import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { PlusCircle, X } from 'react-bootstrap-icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import { Sidebar } from 'primereact/sidebar';
import { toast } from 'sonner';
import * as yup from 'yup';
import styles from './create-enquiry.module.scss';
import { createEnquirySubmission, getListOfForms } from '../../../../APIs/enquiries-api';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";

/**
 * Admin-side "Create Enquiry" renders dynamic fields from the selected form
 * (same field model used by the public embed). We validate required fields,
 * max length, and regex patterns based on form configuration.
 */

// Helper function to get error messages (supports multiple errors)
const getErrorMessages = (fieldError) => {
    if (!fieldError) return [];
    if (fieldError.message) return [fieldError.message];
    if (Array.isArray(fieldError)) return fieldError.filter(Boolean);
    return [];
};

const buildDynamicSchema = (fields = []) => {
    const schemaObj = {
        form: yup.number()
            .required("Form is required")
            .typeError("Form is required"),
    };

    fields.forEach((field) => {
        const fieldName = field.name;
        if (!fieldName) return;

        let fieldSchema;

        // === 1. MULTI-SELECT FIELDS (multicheckbox & multiselect) → MUST be array ===
        if (field.field_type === 'multicheckbox' || field.field_type === 'multiselect') {
            fieldSchema = yup.array().nullable();

            if (field.required) {
                fieldSchema = fieldSchema.min(1, 'This field is required');
            }

            schemaObj[fieldName] = fieldSchema;
            return; // Skip all other logic for this field
        }

        // === 2. SINGLE CONSENT CHECKBOX (no options) → boolean ===
        if (field.field_type === 'consent' ||
            (field.field_type === 'checkbox' && (!field.options || field.options.length === 0))) {
            fieldSchema = yup.boolean();

            if (field.required) {
                fieldSchema = fieldSchema.oneOf([true], 'This field is required');
            }

            schemaObj[fieldName] = fieldSchema;
            return;
        }

        // === 3. ALL OTHER FIELDS → string (text, email, phone, textarea, etc.) ===
        fieldSchema = yup.string().nullable();

        if (field.required) {
            fieldSchema = fieldSchema.required('This field is required');
        }

        if (field.max_length && typeof field.max_length === 'number') {
            fieldSchema = fieldSchema.max(field.max_length, `Max ${field.max_length} characters`);
        }

        if (field.regex && typeof field.regex === 'string' && field.regex.trim()) {
            try {
                let regexPattern;
                const regexStr = field.regex.trim();
                const match = regexStr.match(/^\/(.+)\/([gimuy]*)$/);

                if (match) {
                    regexPattern = new RegExp(match[1], match[2] || '');
                } else {
                    regexPattern = new RegExp(regexStr);
                }

                fieldSchema = fieldSchema.matches(regexPattern, field.error_message || 'Invalid format');
            } catch (e) {
                console.warn(`Invalid regex for field "${fieldName}"`, field.regex);
            }
        }

        schemaObj[fieldName] = fieldSchema;
    });

    return yup.object(schemaObj);
};

export const CreateEnquiry = ({ visible, setVisible, refetchTrigger, enquiriesCountQuery }) => {
    const formRef = useRef(null);
    const loadingRef = useRef(false);

    // Forms dropdown state
    const [forms, setForms] = useState([]);
    const [formValue, setFormValue] = useState('');
    const [hasMoreForms, setHasMoreForms] = useState(true);
    const [loadingForms, setLoadingForms] = useState(false);
    const [formSearchQuery, setFormSearchQuery] = useState('');
    const formPageRef = useRef(1);
    const dropdownRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Selected form detail (fields, meta)
    const [selectedForm, setSelectedForm] = useState(null);
    const dynamicFields = useMemo(() => selectedForm?.fields || [], [selectedForm]);

    // Build validation schema based on selected form
    const validationSchema = useMemo(() => {
        return buildDynamicSchema(selectedForm?.fields || []);
    }, [selectedForm?.fields]);

    // react-hook-form with dynamic validation
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: { form: '' },
        mode: 'onBlur', // Validate on blur for better UX
    });
    
    // Fetch paginated forms (title, id, source_type, etc.)
    const fetchForms = useCallback(
        async (page = 1, resetList = false, searchQuery = '') => {
            if (loadingRef.current) return;
            loadingRef.current = true;
            setLoadingForms(true);
            try {
                const data = await getListOfForms(page, 25, searchQuery, '', false);
                const newForms = data?.results || [];
                if (resetList) {
                    setForms(newForms);
                    formPageRef.current = 1;
                } else {
                    setForms((prev) => {
                        const existingIds = new Set(prev.map((f) => f.id));
                        const uniqueNew = newForms.filter((f) => !existingIds.has(f.id));
                        return [...prev, ...uniqueNew];
                    });
                }
                setHasMoreForms(newForms.length === 25);
            } catch (error) {
                console.error('Error fetching forms:', error);
            } finally {
                loadingRef.current = false;
                setLoadingForms(false);
            }
        },
        []
    );

    // Initial + reactive fetches for the forms list
    useEffect(() => {
        fetchForms(1, true, '');
    }, [fetchForms]);

    useEffect(() => {
        if (formSearchQuery) {
            formPageRef.current = 1;
        }
    }, [formSearchQuery]);

    useEffect(() => {
        fetchForms(formPageRef.current, formPageRef.current === 1, formSearchQuery);
    }, [formSearchQuery, fetchForms]);

    // Fetch full form definition when form selection changes
    const formIdWatch = watch('form');
    useEffect(() => {
        const formId = Number(formIdWatch);
        if (!formId) {
            setSelectedForm(null);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/inquiries/form/${formId}/`);
                const form = res.ok ? await res.json() : null;
                if (!cancelled) setSelectedForm(form);
            } catch (e) {
                console.error('Failed to fetch form detail', e);
                if (!cancelled) setSelectedForm(null);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [formIdWatch]);

    // Handle scroll for infinite loading
    const handleFormScroll = useCallback((e) => {
        const el = e.target;
        const isAtBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 1;
        if (isAtBottom && hasMoreForms && !loadingForms) {
            const next = formPageRef.current + 1;
            formPageRef.current = next;
            fetchForms(next, false, formSearchQuery);
        }
    }, [hasMoreForms, loadingForms, fetchForms, formSearchQuery]);

    // Submit
    const mutation = useMutation({
        mutationFn: (data) => {
            const { form, ...enquiryData } = data;
            return createEnquirySubmission(form, enquiryData);
        },
        onSuccess: () => {
            toast.success('Enquiry created successfully');
            reset();
            setSelectedForm(null);
            setFormValue('');
            setVisible(false);
            refetchTrigger && refetchTrigger((prev) => !prev);
            enquiriesCountQuery?.refetch();
        },
        onError: (error) => {
            console.error('Error creating enquiry:', error);
            toast.error(error?.response?.data?.message || 'Failed to create enquiry. Please try again.');
        },
    });

    const onSubmit = (data) => {
        console.log('data: ', data);
        // Convert form data to FormData object for proper multiselect/multicheckbox handling
        const formData = new FormData();

        // Add form ID
        formData.append('form', data.form);

        // Add each field value
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'form') return; // Already added

            // Handle array values (multiselect, multicheckbox with [] naming)
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    formData.append(key, v);
                });
            } else if (value !== null && value !== undefined) {
                // Skip null/undefined values
                formData.append(key, value);
            }
        });

        mutation.mutate(data); // Pass original data, backend will handle serialization
    };

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    // Render a single dynamic field using PrimeReact/native inputs
    const renderDynamicField = (field) => {
        const type = String(field.field_type || '').toLowerCase();
        const name = field.name || '';
        const labelText = field.label || '';
        const placeholder = field.placeholder || '';

        // HTML block (read-only) – admin panel keeps layout; render as description
        if (type === 'html') {
            return (
                <div className="d-flex flex-column gap-1 mb-4" key={name || Math.random()}>
                    <div dangerouslySetInnerHTML={{ __html: field.html || '' }} />
                </div>
            );
        }

        // For checkbox consent (single boolean) - no options, or explicitly consent type
        if (type === 'consent' || (type === 'checkbox' && (!field.options || field.options.length === 0))) {
            const inputId = `${name}-single`;
            return (
                <div className="d-flex flex-column gap-1 mb-4" key={name}>
                    <div className="d-flex align-items-center gap-2">
                        <Checkbox
                            inputId={inputId}
                            name={name}
                            onChange={(e) => setValue(name, e.checked)}
                            checked={watch(name) || false}
                        />
                        <label htmlFor={inputId} className={clsx(styles.lable)} style={{ cursor: 'pointer' }}>
                            {labelText}{field.required && <span className={styles.required}> *</span>}
                        </label>
                        <input type="hidden" {...register(name)} />
                    </div>
                    {errors[name] && (
                        <div className="error-messages">
                            {getErrorMessages(errors[name]).map((msg, idx) => (
                                <p key={idx} className="error-message">{msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Multi-checkbox group when checkbox field has options - using PrimeReact Checkbox
        if (type === 'checkbox' && field.options && field.options.length > 0) {
            const base = name || 'checkbox';
            return (
                <div className="d-flex flex-column gap-1 mb-4" key={name}>
                    <label className={clsx(styles.lable)}>
                        {labelText}{field.required && <span className={styles.required}> *</span>}
                    </label>
                    <div className="d-flex flex-column" style={{ gap: '.5rem' }}>
                        {(field.options || []).map((opt, idx) => {
                            const id = `${base}-${idx}`;
                            const currentValues = watch(`${base}[]`) || [];
                            const isChecked = currentValues.includes(opt);
                            return (
                                <div key={id} className="d-flex align-items-center gap-2">
                                    <Checkbox
                                        inputId={id}
                                        value={opt}
                                        onChange={() => {
                                            const updated = isChecked
                                                ? currentValues.filter(v => v !== opt)
                                                : [...currentValues, opt];
                                            setValue(`${base}[]`, updated);
                                        }}
                                        checked={isChecked}
                                    />
                                    <label htmlFor={id} style={{ margin: 0, fontWeight: 'normal', cursor: 'pointer' }}>{opt}</label>
                                    <input type="hidden" {...register(`${base}[]`)} />
                                </div>
                            );
                        })}
                    </div>
                    {errors[`${base}[]`] && (
                        <div className="error-messages">
                            {getErrorMessages(errors[`${base}[]`]).map((msg, idx) => (
                                <p key={idx} className="error-message">{msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Radio group - using PrimeReact RadioButton
        if (type === 'radio') {
            return (
                <div className="d-flex flex-column gap-1 mb-4" key={name}>
                    <label className={clsx(styles.lable)}>
                        {labelText}{field.required && <span className={styles.required}> *</span>}
                    </label>
                    <div className="d-flex flex-column" style={{ gap: '.5rem' }}>
                        {(field.options || []).map((opt, idx) => {
                            const id = `${name}-${idx}`;
                            return (
                                <div key={id} className="d-flex align-items-center gap-2">
                                    <RadioButton
                                        inputId={id}
                                        name={name}
                                        value={opt}
                                        onChange={(e) => setValue(name, e.value)}
                                        checked={watch(name) === opt}
                                    />
                                    <label htmlFor={id} style={{ margin: 0, fontWeight: 'normal', cursor: 'pointer' }}>{opt}</label>
                                    <input type="hidden" {...register(name)} />
                                </div>
                            );
                        })}
                    </div>
                    {errors[name] && (
                        <div className="error-messages">
                            {getErrorMessages(errors[name]).map((msg, idx) => (
                                <p key={idx} className="error-message">{msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Multicheckbox group (explicit multicheckbox field type) - using PrimeReact Checkbox
        if (type === 'multicheckbox') {
            const base = name || 'multi';
            return (
                <div className="d-flex flex-column gap-1 mb-4" key={name}>
                    <label className={clsx(styles.lable)}>
                        {labelText}{field.required && <span className={styles.required}> *</span>}
                    </label>
                    <div className="d-flex flex-column" style={{ gap: '.5rem' }}>
                        {(field.options || []).map((opt, idx) => {
                            const id = `${base}-${idx}`;
                            const currentValues = watch(`${base}[]`) || [];
                            const isChecked = currentValues.includes(opt);
                            return (
                                <div key={id} className="d-flex align-items-center gap-2">
                                    <Checkbox
                                        inputId={id}
                                        value={opt}
                                        onChange={() => {
                                            const updated = isChecked
                                                ? currentValues.filter(v => v !== opt)
                                                : [...currentValues, opt];
                                            setValue(`${base}[]`, updated);
                                        }}
                                        checked={isChecked}
                                    />
                                    <label htmlFor={id} style={{ margin: 0, fontWeight: 'normal', cursor: 'pointer' }}>{opt}</label>
                                    <input type="hidden" {...register(`${base}[]`)} />
                                </div>
                            );
                        })}
                    </div>
                    {errors[`${base}[]`] && (
                        <div className="error-messages">
                            {getErrorMessages(errors[`${base}[]`]).map((msg, idx) => (
                                <p key={idx} className="error-message">{msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Select (single) - using PrimeReact Dropdown
        if (type === 'select') {
            return (
                <div className="d-flex flex-column gap-1 mb-4" key={name}>
                    <label className={clsx(styles.lable)}>
                        {labelText}{field.required && <span className={styles.required}> *</span>}
                    </label>
                    <div style={{ display: 'none' }}>
                        <input {...register(name)} />
                    </div>
                    <Dropdown
                        value={watch(name) || ''}
                        onChange={(e) => setValue(name, e.value)}
                        options={field.options || []}
                        placeholder={placeholder || 'Select an option'}
                        className={clsx(styles.dropdownSelect, { [styles.error]: errors[name] })}
                        style={{ height: '46px', width: '100%' }}
                    />
                    {errors[name] && (
                        <div className="error-messages">
                            {getErrorMessages(errors[name]).map((msg, idx) => (
                                <p key={idx} className="error-message">{msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Select (multiple) - using PrimeReact MultiSelect
        if (type === 'multiselect') {
            return (
                <div className="d-flex flex-column gap-1 mb-4" key={name}>
                    <label className={clsx(styles.lable)}>
                        {labelText}{field.required && <span className={styles.required}> *</span>}
                    </label>
                    <div style={{ display: 'none' }}>
                        <input {...register(name)} />
                    </div>
                    <MultiSelect
                        value={watch(name) || []}
                        onChange={(e) => setValue(name, e.value)}
                        options={field.options || []}
                        placeholder={placeholder || 'Select options'}
                        className={clsx(styles.dropdownSelect, { [styles.error]: errors[name] })}
                        style={{ height: '46px', width: '100%' }}
                    />
                    {errors[name] && (
                        <div className="error-messages">
                            {getErrorMessages(errors[name]).map((msg, idx) => (
                                <p key={idx} className="error-message">{msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Text-area using PrimeReact InputTextarea
        if (type === 'textarea') {
            return (
                <div className="d-flex flex-column gap-1 mb-4" key={name}>
                    <label className={clsx(styles.lable)}>
                        {labelText}{field.required && <span className={styles.required}> *</span>}
                    </label>
                    <IconField>
                        <InputIcon>
                            {errors[name] && <img src={exclamationCircle} className='mb-3' alt="error" />}
                        </InputIcon>
                        <InputTextarea
                            rows={5}
                            placeholder={placeholder}
                            className={clsx(styles.inputText, { [styles.error]: errors[name] })}
                            {...register(name)}
                        />
                    </IconField>
                    {errors[name] && (
                        <div className="error-messages">
                            {getErrorMessages(errors[name]).map((msg, idx) => (
                                <p key={idx} className="error-message">{msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Date field - using PrimeReact Calendar
        if (type === 'date') {
            return (
                <div className="d-flex flex-column gap-1 mb-4" key={name}>
                    <label className={clsx(styles.lable)}>
                        {labelText}{field.required && <span className={styles.required}> *</span>}
                    </label>
                    <div style={{ display: 'none' }}>
                        <input {...register(name)} />
                    </div>
                    <Calendar
                        value={watch(name) ? new Date(watch(name)) : null}
                        onChange={(e) => {
                            const dateString = e.value ? e.value.toISOString().split('T')[0] : '';
                            setValue(name, dateString);
                        }}
                        placeholder={placeholder || 'Select a date'}
                        dateFormat="dd/mm/yy"
                        className={clsx({ [styles.error]: errors[name] })}
                        style={{ width: '100%', border: '1px solid #d0d5dd' }}
                    />
                    {errors[name] && (
                        <div className="error-messages">
                            {getErrorMessages(errors[name]).map((msg, idx) => (
                                <p key={idx} className="error-message">{msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Time field - using PrimeReact InputText with type time
        if (type === 'time') {
            return (
                <div className="d-flex flex-column gap-1 mb-4" key={name}>
                    <label className={clsx(styles.lable)}>
                        {labelText}{field.required && <span className={styles.required}> *</span>}
                    </label>
                    <IconField>
                        <InputIcon>
                            {errors[name] && <img src={exclamationCircle} className='mb-3' alt="error" />}
                        </InputIcon>
                        <InputText
                            type="time"
                            placeholder={placeholder}
                            className={clsx(styles.inputText, { [styles.error]: errors[name] })}
                            {...register(name)}
                        />
                    </IconField>
                    {errors[name] && (
                        <div className="error-messages">
                            {getErrorMessages(errors[name]).map((msg, idx) => (
                                <p key={idx} className="error-message">{msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Text-like inputs (text, email, number, tel/phone, url) using PrimeReact InputText
        const resolved = type === 'phone' ? 'tel' : type;
        const allowed = ['text', 'email', 'number', 'tel', 'url'];
        const inputType = allowed.includes(resolved) ? resolved : 'text';

        if (allowed.includes(resolved)) {
            return (
                <div className="d-flex flex-column gap-1 mb-4" key={name}>
                    <label className={clsx(styles.lable)}>
                        {labelText}{field.required && <span className={styles.required}> *</span>}
                    </label>
                    <IconField>
                        <InputIcon>
                            {errors[name] && <img src={exclamationCircle} className='mb-3' alt="error" />}
                        </InputIcon>
                        <InputText
                            type={inputType}
                            placeholder={placeholder}
                            className={clsx(styles.inputText, { [styles.error]: errors[name] })}
                            maxLength={field.max_length || undefined}
                            {...register(name)}
                        />
                    </IconField>
                    {errors[name] && (
                        <div className="error-messages">
                            {getErrorMessages(errors[name]).map((msg, idx) => (
                                <p key={idx} className="error-message">{msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Fallback for unknown types
        return (
            <div className="d-flex flex-column gap-1 mb-4" key={name}>
                <label className={clsx(styles.lable)}>
                    {labelText}{field.required && <span className={styles.required}> *</span>}
                </label>
                <IconField>
                    <InputIcon>
                        {errors[name] && <img src={exclamationCircle} className='mb-3' alt="error" />}
                    </InputIcon>
                    <InputText
                        type="text"
                        placeholder={placeholder}
                        className={clsx(styles.inputText, { [styles.error]: errors[name] })}
                        {...register(name)}
                    />
                </IconField>
                {errors[name] && (
                    <div className="error-messages">
                        {getErrorMessages(errors[name]).map((msg, idx) => (
                            <p key={idx} className="error-message">{msg}</p>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Sidebar
            visible={visible}
            position="right"
            onHide={() => setVisible(false)}
            modal={false}
            dismissable={false}
            style={{ width: '702px' }}
            content={({ closeIconRef, hide }) => (
                <div className='create-sidebar d-flex flex-column'>
                    <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '16px 24px' }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className={styles.circledesignstyle}>
                                <div className={styles.out}>
                                    <PlusCircle size={24} color="#17B26A" />
                                </div>
                            </div>
                            <span style={{ color: '#344054', fontSize: '20px', fontWeight: 600 }}>Create New Enquiry</span>
                        </div>
                        <span>
                            <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                <X size={24} color='#667085' />
                            </Button>
                        </span>
                    </div>

                    <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 105px)', overflow: 'auto' }}>
                        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col sm={12}>
                                    <h2 className={styles.sectionTitle}>
                                        Enquiry Information {selectedForm && `(${selectedForm.title})`}
                                    </h2>
                                </Col>
                            </Row>

                            <Row className={clsx(styles.bgGreay)}>
                                <Col sm={12}>
                                    {/* Form selector */}
                                    <div className="d-flex flex-column gap-1 mb-4">
                                        <label className={clsx(styles.lable)}>Form <span className='required'>*</span></label>
                                        <input type="hidden" {...register('form')} />
                                        <Dropdown
                                            ref={dropdownRef}
                                            value={formValue}
                                            onChange={(e) => {
                                                setFormValue(e.value);
                                                setValue('form', +e.value);
                                            }}
                                            options={forms}
                                            optionLabel="title"
                                            optionValue="id"
                                            className={clsx(styles.dropdownSelect, { [styles.error]: errors.form })}
                                            panelClassName="form-dropdown"
                                            style={{ height: '46px' }}
                                            placeholder="Select a form"
                                            filter
                                            onFilter={(e) => {
                                                const query = e.filter || '';
                                                if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                                                searchTimeoutRef.current = setTimeout(() => setFormSearchQuery(query), 300);
                                            }}
                                            filterInputAutoFocus={true}
                                            scrollHeight="400px"
                                            onShow={() => {
                                                setTimeout(() => {
                                                    const panel = document.querySelector('.p-dropdown-items-wrapper');
                                                    if (panel) panel.addEventListener('scroll', handleFormScroll);
                                                }, 100);
                                            }}
                                            onHide={() => {
                                                if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                                                setFormSearchQuery('');
                                                const panel = document.querySelector('.p-dropdown-items-wrapper');
                                                if (panel) panel.removeEventListener('scroll', handleFormScroll);
                                            }}
                                            itemTemplate={(option) => (
                                                <div className='d-flex flex-column' style={{ padding: '4px 0' }}>
                                                    <span style={{ fontWeight: '500', fontSize: '14px', color: '#344054' }}>
                                                        {option.title || 'N/A'}
                                                    </span>
                                                    {option.source_type && (
                                                        <span style={{ fontSize: '12px', color: '#667085' }}>
                                                            {option.source_type}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            valueTemplate={(option) => (
                                                formValue ? (
                                                    <span style={{ fontWeight: '500', color: '#344054' }}>
                                                        {option.title || 'N/A'}
                                                    </span>
                                                ) : null
                                            )}
                                            emptyFilterMessage="No forms found"
                                        />
                                        {errors.form && <p className="error-message">{errors.form.message}</p>}
                                    </div>
                                </Col>

                                {/* Form description when selected */}
                                {selectedForm && selectedForm.description && (
                                    <Col sm={12}>
                                        <p style={{ color: '#667085', fontSize: '14px', margin: '0 0 16px' }}>
                                            {selectedForm.description}
                                        </p>
                                    </Col>
                                )}

                                {/* Dynamic fields from selected form */}
                                {selectedForm && dynamicFields.length > 0 ? (
                                    dynamicFields
                                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                                        .map((field) => (
                                            <Col sm={12} key={field.name || field.id}>
                                                {renderDynamicField(field)}
                                            </Col>
                                        ))
                                ) : null}
                            </Row>
                        </form>
                    </div>

                    <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                        <Button
                            type='button'
                            onClick={(e) => { e.stopPropagation(); setVisible(false); }}
                            className='outline-button'
                        >
                            Cancel
                        </Button>
                        <Button
                            type='button'
                            disabled={mutation.isPending}
                            onClick={handleExternalSubmit}
                            className='solid-button'
                            style={{ minWidth: '75px' }}
                        >
                            {mutation.isPending ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : "Save"}
                        </Button>
                    </div>
                </div>
            )}
        />
    );
};

export default CreateEnquiry;
