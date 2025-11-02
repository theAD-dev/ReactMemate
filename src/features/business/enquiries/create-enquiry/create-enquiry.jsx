import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { PlusCircle, X } from 'react-bootstrap-icons';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { toast } from 'sonner';
import * as yup from 'yup';
import styles from './create-enquiry.module.scss';
import { createEnquirySubmission, getListOfForms } from '../../../../APIs/enquiries-api';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";

const schema = yup.object({
    form: yup.number()
        .required("Form is required")
        .typeError("Form is required"),
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    phone: yup.string().required("Phone is required"),
    message: yup.string().required("Message is required"),
});

export const CreateEnquiry = ({ visible, setVisible, onSuccess, refetchTrigger }) => {
    const formRef = useRef(null);
    const [forms, setForms] = useState([]);
    const [formValue, setFormValue] = useState('');
    const [hasMoreForms, setHasMoreForms] = useState(true);
    const [loadingForms, setLoadingForms] = useState(false);
    const [formSearchQuery, setFormSearchQuery] = useState('');
    const formPageRef = useRef(1);
    const dropdownRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    const { control, register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            form: '',
            name: '',
            email: '',
            phone: '',
            message: ''
        }
    });

    // Fetch forms with pagination and search
    const fetchForms = useCallback(async (page = 1, resetList = false, searchQuery = '') => {
        if (loadingForms) return;

        setLoadingForms(true);
        try {
            const data = await getListOfForms(page, 25, searchQuery, '', false);
            const newForms = data?.results || [];

            if (resetList) {
                setForms(newForms);
                formPageRef.current = 1;
            } else {
                // Filter out duplicates using Set for O(1) lookup
                setForms(prev => {
                    const existingFormIds = new Set(prev.map(form => form.id));
                    const uniqueNewForms = newForms.filter(form => !existingFormIds.has(form.id));
                    return [...prev, ...uniqueNewForms];
                });
            }

            setHasMoreForms(newForms.length === 25);
        } catch (error) {
            console.error('Error fetching forms:', error);
        } finally {
            setLoadingForms(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset page when search changes
    useEffect(() => {
        if (formSearchQuery) {
            formPageRef.current = 1;
        }
    }, [formSearchQuery]);

    // Fetch data when page or search changes
    useEffect(() => {
        fetchForms(formPageRef.current, formPageRef.current === 1, formSearchQuery);
    }, [formSearchQuery, fetchForms]);

    // Initial load
    useEffect(() => {
        fetchForms(1, true, '');
    }, [fetchForms]);

    // Handle scroll for infinite loading
    const handleFormScroll = useCallback((e) => {
        const element = e.target;
        const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;

        if (isAtBottom && hasMoreForms && !loadingForms) {
            const nextPage = formPageRef.current + 1;
            formPageRef.current = nextPage;
            fetchForms(nextPage, false, formSearchQuery);
        }
    }, [hasMoreForms, loadingForms, fetchForms, formSearchQuery]);

    const mutation = useMutation({
        mutationFn: (data) => {
            const { form, ...enquiryData } = data;
            return createEnquirySubmission(form, enquiryData);
        },
        onSuccess: () => {
            toast.success('Enquiry created successfully');
            reset();
            refetchTrigger((prev) => !prev);
            setFormValue('');
            setVisible(false);
            onSuccess && onSuccess();
        },
        onError: (error) => {
            console.error('Error creating enquiry:', error);
            toast.error(error?.response?.data?.message || 'Failed to create enquiry. Please try again.');
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
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
                                    <h2 className={styles.sectionTitle}>Enquiry Information</h2>
                                </Col>
                            </Row>

                            <Row className={clsx(styles.bgGreay)}>
                                <Col sm={12}>
                                    {/* Form Field */}
                                    <div className="d-flex flex-column gap-1 mb-4">
                                        <label className={clsx(styles.lable)}>Form <span className='required'>*</span></label>
                                        <input type="hidden" {...register("form")} />
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

                                                // Debounce the search query update
                                                if (searchTimeoutRef.current) {
                                                    clearTimeout(searchTimeoutRef.current);
                                                }

                                                searchTimeoutRef.current = setTimeout(() => {
                                                    setFormSearchQuery(query);
                                                }, 300);
                                            }}
                                            filterInputAutoFocus={true}
                                            scrollHeight="400px"
                                            onShow={() => {
                                                // Attach scroll listener when dropdown opens
                                                setTimeout(() => {
                                                    const panel = document.querySelector('.p-dropdown-items-wrapper');
                                                    if (panel) {
                                                        panel.addEventListener('scroll', handleFormScroll);
                                                    }
                                                }, 100);
                                            }}
                                            onHide={() => {
                                                // Clear search timeout
                                                if (searchTimeoutRef.current) {
                                                    clearTimeout(searchTimeoutRef.current);
                                                }

                                                // Reset search query
                                                setFormSearchQuery('');

                                                // Remove scroll listener when dropdown closes
                                                const panel = document.querySelector('.p-dropdown-items-wrapper');
                                                if (panel) {
                                                    panel.removeEventListener('scroll', handleFormScroll);
                                                }
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
                                            valueTemplate={(option) => {
                                                return (
                                                    formValue ? (
                                                        <span style={{ fontWeight: '500', color: '#344054' }}>
                                                            {option.title || 'N/A'}
                                                        </span>
                                                    ) : null
                                                );
                                            }}
                                            emptyFilterMessage="No forms found"
                                        />
                                        {errors.form && <p className="error-message">{errors.form.message}</p>}
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    {/* Name Field */}
                                    <div className="d-flex flex-column gap-1 mb-4">
                                        <label className={clsx(styles.lable)}>
                                            Name <span className='required'>*</span>
                                        </label>
                                        <IconField>
                                            <InputIcon>
                                                {errors.name && <img src={exclamationCircle} className='mb-3' alt="error" />}
                                            </InputIcon>
                                            <InputText
                                                {...register("name")}
                                                className={clsx(styles.inputText, { [styles.error]: errors.name })}
                                                placeholder='Enter full name'
                                            />
                                        </IconField>
                                        {errors.name && <p className="error-message">{errors.name.message}</p>}
                                    </div>
                                </Col>

                                <Col sm={6}>
                                    {/* Email Field */}
                                    <div className="d-flex flex-column gap-1 mb-4">
                                        <label className={clsx(styles.lable)}>
                                            Email <span className='required'>*</span>
                                        </label>
                                        <IconField>
                                            <InputIcon>
                                                {errors.email && <img src={exclamationCircle} className='mb-3' alt="error" />}
                                            </InputIcon>
                                            <InputText
                                                {...register("email")}
                                                className={clsx(styles.inputText, { [styles.error]: errors.email })}
                                                placeholder='Enter email address'
                                                type="email"
                                            />
                                        </IconField>
                                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                                    </div>
                                </Col>

                                <Col sm={12}>
                                    {/* Phone Field */}
                                    <div className="d-flex flex-column gap-1 mb-4">
                                        <label className={clsx(styles.lable)}>
                                            Phone <span className='required'>*</span>
                                        </label>
                                        <IconField>
                                            <InputIcon>
                                                {errors.phone && <img src={exclamationCircle} className='mb-3' alt="error" />}
                                            </InputIcon>
                                            <InputText
                                                {...register("phone")}
                                                className={clsx(styles.inputText, { [styles.error]: errors.phone })}
                                                placeholder='Enter phone number'
                                            />
                                        </IconField>
                                        {errors.phone && <p className="error-message">{errors.phone.message}</p>}
                                    </div>
                                </Col>

                                <Col sm={12}>
                                    {/* Message Field */}
                                    <div className="d-flex flex-column gap-1 mb-4">
                                        <label className={clsx(styles.lable)}>
                                            Message <span className='required'>*</span>
                                        </label>
                                        <Controller
                                            name="message"
                                            control={control}
                                            render={({ field }) => (
                                                <InputTextarea
                                                    {...field}
                                                    rows={5}
                                                    className={clsx(styles.inputText, { [styles.error]: errors.message })}
                                                    placeholder='Enter your message'
                                                />
                                            )}
                                        />
                                        {errors.message && <p className="error-message">{errors.message.message}</p>}
                                    </div>
                                </Col>
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
