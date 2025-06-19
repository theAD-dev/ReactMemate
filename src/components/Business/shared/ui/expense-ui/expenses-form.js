import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Plus, Calendar3, QuestionCircle, ExclamationCircleFill, Upload, PlusCircle, CheckCircleFill } from 'react-bootstrap-icons';
import { useDropzone } from 'react-dropzone';
import { useForm, Controller } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { SelectButton } from 'primereact/selectbutton';
import { Tooltip } from 'primereact/tooltip';
import { toast } from 'sonner';
import * as yup from 'yup';
import styles from './expenses-form.module.scss';
import { getDepartments } from '../../../../../APIs/CalApi';
import { getProjectsList, getXeroCodesList } from '../../../../../APIs/expenses-api';
import { getListOfSuppliers } from '../../../../../APIs/SuppliersApi';
import aiScanImg from '../../../../../assets/ai-scan.png';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import { extractAIResponseData, formatExpenseDataFromAI } from '../../../../../shared/lib/extract-ai-response';
import { formatAUD } from '../../../../../shared/lib/format-aud';
import { CircularProgressBar } from '../../../../../shared/ui/circular-progressbar';
import { FallbackImage } from '../../../../../shared/ui/image-with-fallback/image-avatar';
import { getFileIcon } from '../../../../Work/features/create-job/create-job';


function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

const schema = yup
    .object({
        supplier: yup.number().typeError("Supplier must be a valid id").required("Supplier is required"),
        invoice_reference: yup.string().required("Invoice reference is required"),
        date: yup.string().required("Date is required"),
        due_date: yup.string()
            .required("Due date is required")
            .test(
                'is-after-date',
                'Due date must be after the invoice date',
                function (value) {
                    const { date } = this.parent;
                    if (!date || !value) return true; // Skip validation if either date is missing

                    const invoiceDate = new Date(date);
                    const dueDate = new Date(value);

                    // Set hours, minutes, seconds, and milliseconds to 0 for both dates to compare only the dates
                    invoiceDate.setHours(0, 0, 0, 0);
                    dueDate.setHours(0, 0, 0, 0);

                    return dueDate >= invoiceDate;
                }
            ),
        amount: yup.string().required("Amount is required"),
        nogst: yup.boolean().required("NOGST must be a boolean"),
        gst: yup.boolean().required("GST must be a boolean"),
        // account_code: yup.string().required("Account Code is required"),
        // department: yup.number().required("Department is required"),
    })
    .required();

const ExpensesForm = forwardRef(({ onSubmit, defaultValues, id, defaultSupplier, projectId }, ref) => {
    const autoCompleteRef = useRef(null);
    const observerRef = useRef(null);
    const accessToken = localStorage.getItem("access_token");

    const [supplierValue, setSupplierValue] = useState(defaultSupplier || "");
    const [suppliers, setSuppliers] = useState([]);
    const [files, setFiles] = useState([]);
    const [page, setPage] = useState(1);
    const [searchValue, setSearchValue] = useState(defaultSupplier?.name || "");
    const [hasMoreData, setHasMoreData] = useState(true);
    const limit = 25;

    const { control, reset, register, handleSubmit, setValue, getValues, watch, setError, trigger, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        maxFiles: 1,
        multiple: false,
        onDrop: acceptedFiles => {
            const newFiles = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file),
                progress: 0,
            }));
            setFiles(() => [
                ...newFiles,
            ]);
            fileUploadBySignedURL(newFiles, false);
        }
    });

    const {
        getRootProps: getAIRootProps,
        getInputProps: getAIInputProps,
    } = useDropzone({
        maxFiles: 1,
        multiple: false,
        accept: { 'application/pdf': ['.pdf', '.png', '.jpg', '.jpeg'] },
        maxSize: 5 * 1024 * 1024,
        onDrop: (acceptedFiles) => {
            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                    progress: 0,
                    aiAnalysis: true,
                })
            );
            setFiles(() => [...newFiles]);
            fileUploadBySignedURL(newFiles, true);
        },
    });

    const uploadToS3 = async (file, url) => {
        return axios.put(url, file, {
            headers: {
                "Content-Type": "",
            },
            onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
                setFiles((prevFiles) => {
                    return prevFiles.map((f) =>
                        f.name === file.name
                            ? Object.assign(f, { progress, url })
                            : f
                    );
                });
            },
        }).catch((err) => {
            console.log('err: ', err);
            setFiles((prevFiles) => {
                return prevFiles.map((f) =>
                    f.name === file.name
                        ? Object.assign(f, { progress: 0, url, error: true })
                        : f
                );
            });
        });
    };

    const fileUploadBySignedURL = async (files, isAIAnalysis) => {
        if (!files.length) return;

        for (const file of files) {
            try {
                // Step 1: Get the signed URL from the backend
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_API_URL}/expenses/file/`,
                    { file_name: file.name },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                const { url } = response.data;
                if (!url) {
                    setFiles([]);
                    toast.error(`Failed to upload ${file.name}. Please try again.`);
                    return;
                }

                // Step 2: Upload the file to S3 using the signed URL
                await uploadToS3(file, url);

                // step 3: Get the AI recognize response
                const fileUrl = url.split("?")[0] || "";

                if (!isAIAnalysis) {
                    // set the file url
                    setValue('file', fileUrl);

                    // Update file progress to show AI processing
                    setFiles((prevFiles) => {
                        return prevFiles.map((f) =>
                            f.name === file.name
                                ? Object.assign(f, { progress: 100 })
                                : f
                        );
                    });
                    return;
                }

                if (isAIAnalysis) {
                    // Update file progress to show AI processing
                    setFiles((prevFiles) => {
                        return prevFiles.map((f) =>
                            f.name === file.name
                                ? Object.assign(f, { progress: 100, aiProcessing: true })
                                : f
                        );
                    });

                    // Show toast notification for AI processing
                    toast.info('AI is analyzing your document...', {
                        duration: 3000,
                    });

                    try {
                        const aiResponse = await axios.post(
                            `${process.env.REACT_APP_BACKEND_API_URL}/expenses/recognize/`,
                            { file_url: fileUrl },
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            }
                        );

                    // Extract and process the AI response data
                    const extractedData = extractAIResponseData(aiResponse?.data);
                    if (extractedData) {
                        // Format the data for the form
                        const formattedData = formatExpenseDataFromAI(extractedData);
                        if (formattedData) {
                            // set the file url
                            setValue('file', fileUrl);

                            // Prefill the form with the extracted data
                            Object.entries(formattedData).forEach(([key, value]) => {
                                setValue(key, value);
                            });

                                // Trigger validation for required fields
                                trigger(['invoice_reference', 'amount', 'gst', 'nogst']);

                                // Show success message
                                toast.success('Form prefilled with invoice data');

                                // Update file to show success
                                setFiles((prevFiles) => {
                                    return prevFiles.map((f) =>
                                        f.name === file.name
                                            ? Object.assign(f, { aiProcessing: false, aiSuccess: true })
                                            : f
                                    );
                                });
                            } else {
                                // Update file to show no data extracted
                                setFiles((prevFiles) => {
                                    return prevFiles.map((f) =>
                                        f.name === file.name
                                            ? Object.assign(f, { aiProcessing: false, aiNoData: true })
                                            : f
                                    );
                                });
                                toast.warning('No invoice data could be extracted from the document');
                            }
                        } else {
                            // Update file to show no data extracted
                            setFiles((prevFiles) => {
                                return prevFiles.map((f) =>
                                    f.name === file.name
                                        ? Object.assign(f, { aiProcessing: false, aiNoData: true })
                                        : f
                                );
                            });
                            toast.warning('No invoice data could be extracted from the document');
                        }
                    } catch (aiError) {
                        console.error("Error during AI recognition:", aiError);
                        // Update file to show AI error
                        setFiles((prevFiles) => {
                            return prevFiles.map((f) =>
                                f.name === file.name
                                    ? Object.assign(f, { aiProcessing: false, aiError: true })
                                    : f
                            );
                        });
                        toast.error('Failed to analyze the document. Please try again.');
                    }
                }
            } catch (error) {
                console.error("Error uploading file:", file.name, error);
                toast.error(`Failed to upload ${file.name}. Please try again.`);
            }
        }
    };

    useEffect(() => {
        setValue('supplier', +supplierValue?.id);
        if (supplierValue?.id) trigger(['supplier']);

    }, [supplierValue]);

    const onFocus = () => {
        if (autoCompleteRef.current) autoCompleteRef.current.show();
        const lastRow = document.querySelector('.p-autocomplete-items li.p-autocomplete-item:last-child');
        if (lastRow) {
            observerRef.current.observe(lastRow);
        }
    };

    const search = debounce((event) => {
        const query = event?.query?.toLowerCase() || '';
        setSearchValue(query);
    }, 300);

    useEffect(() => {
        setPage(1);
    }, [searchValue]);

    useEffect(() => {
        const loadData = async () => {
            const data = await getListOfSuppliers(page, limit, searchValue, 'name');
            if (page === 1) setSuppliers(data.results);

            else {
                if (data?.results?.length > 0)
                    setSuppliers(prev => {
                        const existingSupplierIds = new Set(prev.map(supplier => supplier.id));
                        const newSuppliers = data.results.filter(supplier => !existingSupplierIds.has(supplier.id));
                        return [...prev, ...newSuppliers];
                    });
            }
            setHasMoreData(data.count !== suppliers.length);
        };

        loadData();
    }, [page, searchValue]);

    useEffect(() => {
        if (suppliers.length > 0 && hasMoreData) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
                console.log('entries[0].isIntersecting: ', entries[0].isIntersecting);
            });

            const lastRow = document.querySelector('.p-autocomplete-items li.p-autocomplete-item:last-child');
            if (lastRow) observerRef.current.observe(lastRow);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [suppliers, hasMoreData]);

    const calculateAmounts = (amount, gstType) => {
        let calculatedTax = 0;
        let subtotal = 0;

        if (gstType === 'ex') {
            subtotal = amount;
            calculatedTax = subtotal * 0.10;
        } else if (gstType === 'in') {
            calculatedTax = amount * 0.10 / 1.10;
            subtotal = amount - calculatedTax;
        } else {
            subtotal = amount;
            calculatedTax = 0;
        }

        return {
            subtotal: subtotal.toFixed(2),
            calculatedTax: calculatedTax.toFixed(2),
            totalAmount: (parseFloat(subtotal) + parseFloat(calculatedTax)).toFixed(2),
        };
    };

    const handleGstChange = (value) => {
        if (value) {
            const totalAmount = parseFloat(getValues("amount")) || 0;
            const { subtotal, calculatedTax, totalAmount: newTotalAmount } = calculateAmounts(totalAmount, value);

            setValue("tax", calculatedTax);
            setValue("subtotal", subtotal);
            setValue("totalAmount", newTotalAmount);
            setValue("nogst", value === 'no');
            setValue("gst", value === 'ex');
            trigger(['gst']);
        }
    };

    const xeroCodesList = useQuery({ queryKey: ['getXeroCodesList'], queryFn: getXeroCodesList });
    const departmentsList = useQuery({ queryKey: ['getDepartments'], queryFn: getDepartments });
    const projectsList = useQuery({ queryKey: ['getProjectsList'], queryFn: getProjectsList });

    const options = ['Assign to project', 'Assign to timeframe'];
    const [option, setOptionValue] = useState(defaultValues?.option || options[0]);

    const watchOrder = watch('order');
    useEffect(() => {
        if (watchOrder) trigger(['order']);
    }, [watchOrder]);
    const watchType = watch('type');
    const validateFields = () => {
        if (option === 'Assign to project' && !watchOrder) {
            setError("order", { type: "manual", message: "Order is required" });
        }

        if (option === 'Assign to timeframe' && !watchType) {
            setError("type", { type: "manual", message: "Type is required" });
        }
    };

    useEffect(() => {
        if (Object.keys(errors).length > 0)
            validateFields();
    }, [errors]);

    useEffect(() => {
        if (option === 'Assign to timeframe') {
            setValue('order', '');
            if (defaultValues?.type) setValue('type', defaultValues?.type);
        } else if (option === 'Assign to project') {
            setValue('type', '');
            if (defaultValues?.order) setValue('order', defaultValues?.order);
        }

        setValue('option', option);
    }, [option]);

    useEffect(() => {
        if (defaultValues?.option) setOptionValue(defaultValues?.option);
    }, [defaultValues?.option]);

    const handleFormSubmit = (data) => {
        validateFields();

        if (Object.keys(errors).length > 0) {
            console.log('Validation errors:', errors);
            return;
        }

        onSubmit(data, reset);
    };

    useEffect(() => {
        if (projectId) {
            setValue('order', +projectId);
        }
    }, [projectId]);

    useEffect(() => {
        if (!id) setValue('gst-calculation', 'in');
    }, []);

    return (
        <form ref={ref} onSubmit={handleSubmit(handleFormSubmit)} >
            <Row className={clsx(styles.bgGreay, 'pt-3')}>
                <Col sm={8}>
                    <div className="d-flex flex-column gap-1 mb-3">
                        <label className={clsx(styles.lable)}>Supplier<span className='required'>*</span></label>
                        <input type="hidden" {...register("supplier")} />
                        <AutoComplete
                            ref={autoCompleteRef}
                            value={supplierValue || ""}
                            completeMethod={search}
                            onChange={(e) => {
                                if (!e.value) setSearchValue("");
                                setSupplierValue(e.value);
                            }}
                            dropdownAutoFocus
                            field="name"
                            suggestions={suppliers}
                            itemTemplate={(option) => {
                                return (
                                    <div className='d-flex gap-2 align-items-center w-100'>
                                        <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dedede' }}>
                                            <FallbackImage photo={option?.photo} has_photo={option?.has_photo} is_business={false} size={17} />
                                        </div>
                                        <div className='ellipsis-width' style={{ maxWidth: '350px' }}>{option?.name}</div>
                                    </div>
                                );
                            }}
                            onClick={onFocus}
                            onFocus={onFocus}
                            onBlur={() => {
                                console.log('blur');
                                setPage(1);
                                setSearchValue("");
                                setHasMoreData(true);
                            }}
                            style={{ minHeight: '46px' }}
                            scrollHeight='450px'
                            className={clsx(styles.autoComplete, "w-100", { [styles.error]: errors.supplier })}
                            placeholder="Search for supplier"
                        />
                        {errors.supplier && <p className="error-message">{errors.supplier.message}</p>}
                    </div>
                </Col>

                <Col sm={4}>
                    <div className="d-flex justify-content-end text-md-end flex-column gap-1 mt-3 pt-3 mb-3">
                        <Link to={"/suppliers?addNewSupplier=true"} target='_blank'>
                            <Button className={styles.expensesCreateNew}>Create New Supplier<Plus size={24} color="#475467" /></Button>
                        </Link>
                    </div>
                </Col>

                <Col sm={12} className='mb-4'>
                    <div className="d-flex flex-column gap-1">
                        <label className={clsx(styles.lable)}>Invoice/#Ref<span className='required'>*</span></label>
                        <IconField>
                            <InputIcon>{errors?.invoice_reference && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("invoice_reference")} className={clsx(styles.inputText, { [styles.error]: errors.invoice_reference })} placeholder='Enter invoice reference' />
                        </IconField>
                        {errors?.invoice_reference && <p className="error-message">{errors.invoice_reference?.message}</p>}
                    </div>
                </Col>

                <Col sm={12}>
                    <Row>
                        <Col sm={6}>
                            <label className={clsx(styles.lable)}>Upload Only</label>
                            <div {...getRootProps({ className: 'dropzone d-flex justify-content-center align-items-center flex-column' })} style={{ width: '100%', height: '126px', background: '#fff', borderRadius: '4px', border: '1px solid #EAECF0', marginTop: '5px' }}>
                                <input {...getInputProps()} />
                                <button type='button' className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', border: '1px solid #EAECF0', background: '#fff', borderRadius: '8px', marginBottom: '16px' }}>
                                    <Upload size={20} color='#475467' />
                                </button>
                                <p className='mb-0' style={{ color: '#475467', fontSize: '14px' }}><span style={{ color: '#106B99', fontWeight: '600' }}>Click to upload</span> or drag and drop</p>
                                <span style={{ color: '#475467', fontSize: '12px' }}>PDF, SVG, PNG, JPG files • Max size: 5MB</span>
                            </div>
                        </Col>
                        <Col sm={6}>
                            <label className={clsx(styles.lable)}>Upload & Read With AI</label>
                            <div {...getAIRootProps({ className: 'dropzone d-flex justify-content-center align-items-center flex-column' })} style={{ width: '100%', height: '126px', background: '#fff', borderRadius: '4px', border: '1px solid #EAECF0', marginTop: '5px' }}>
                                <input {...getAIInputProps()} />
                                <button type='button' className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', border: '1px solid #FFF', background: '#f2f2f2', borderRadius: '8px', marginBottom: '16px' }}>
                                    <img src={aiScanImg} className='w-100' />
                                </button>
                                <p className='mb-0' style={{ color: '#475467', fontSize: '14px' }}><span style={{ color: '#106B99', fontWeight: '600' }}>Click to upload</span> or drag and drop</p>
                                <span style={{ color: '#475467', fontSize: '12px' }}>PDF, PNG, JPG, JPEG files • Max size: 5MB</span>
                            </div>
                        </Col>
                    </Row>


                    <div className='d-flex flex-column'>
                        {files?.length > 0 && <label className={clsx(styles.lable, 'mt-4 mb-1')}>Photo/Document Of The Expense</label>}
                        {
                            files?.map((file, index) => (
                                <div key={index} className={styles.fileBox}>
                                    {getFileIcon(file.type)}
                                    <div className={styles.fileNameBox}>
                                        <p className='mb-0'>{file?.name || ""}</p>
                                        <p className='mb-0'>{parseFloat(file?.size / 1024).toFixed(2)} KB - {parseInt(file?.progress) || 0}% uploaded</p>
                                    </div>
                                    <div className='ms-auto'>
                                        {
                                            file.error ? (
                                                <div className={styles.deleteBox}>
                                                    <ExclamationCircleFill color='#F04438' size={16} />
                                                </div>
                                            ) : file.aiProcessing ? (
                                                <div className={styles.aiProcessingBox}>
                                                    <div className={styles.aiProcessingSpinner}></div>
                                                    <span className={styles.aiProcessingText}>AI analyzing...</span>
                                                </div>
                                            ) : file.aiSuccess ? (
                                                <div className={styles.aiSuccessBox}>
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM7 11.4L3.6 8L5 6.6L7 8.6L11 4.6L12.4 6L7 11.4Z" fill="#12B76A" />
                                                    </svg>
                                                    <span className={styles.aiSuccessText}>Data extracted</span>
                                                </div>
                                            ) : file.aiNoData ? (
                                                <div className={styles.aiNoDataBox}>
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM8 12C7.4 12 7 11.6 7 11C7 10.4 7.4 10 8 10C8.6 10 9 10.4 9 11C9 11.6 8.6 12 8 12ZM9 9H7V4H9V9Z" fill="#F79009" />
                                                    </svg>
                                                    <span className={styles.aiNoDataText}>No data found</span>
                                                </div>
                                            ) : file.aiError ? (
                                                <div className={styles.aiErrorBox}>
                                                    <ExclamationCircleFill color='#F04438' size={16} />
                                                    <span className={styles.aiErrorText}>AI error</span>
                                                </div>
                                            ) : file.progress == 100 ? (
                                                <CheckCircleFill color='#12B76A' size={20} />
                                            ) : (
                                                <CircularProgressBar percentage={parseInt(file?.progress) || 0} size={30} color="#158ECC" />
                                            )
                                        }

                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mt-4 mb-4">
                        <label className={clsx(styles.lable)}>Date<span className='required'>*</span></label>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <Calendar {...field}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                        // Trigger validation for due_date when invoice date changes
                                        setTimeout(() => trigger('due_date'), 0);
                                    }}
                                    showButtonBar
                                    placeholder='DD/MM/YY'
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                    style={{ height: '46px' }}
                                    icon={<Calendar3 color='#667085' size={20} />}
                                    className={clsx(styles.inputText, { [styles.error]: errors.date }, 'p-0 outline-none')}
                                />
                            )}
                        />
                        {errors?.date && <p className="error-message">{errors.date?.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mt-4 mb-4">
                        <label className={clsx(styles.lable)}>Due Date<span className='required'>*</span></label>
                        <Controller
                            name="due_date"
                            control={control}
                            render={({ field }) => {
                                // Get the current invoice date value to set as minimum date
                                const invoiceDate = watch('date');
                                const minDate = invoiceDate ? new Date(invoiceDate) : null;

                                return (
                                    <Calendar {...field}
                                        onChange={(e) => {
                                            field.onChange(e.value);
                                            // Trigger validation after date change
                                            trigger('due_date');
                                        }}
                                        showButtonBar
                                        placeholder='DD/MM/YY'
                                        dateFormat="dd/mm/yy"
                                        showIcon
                                        minDate={minDate}
                                        style={{ height: '46px' }}
                                        icon={<Calendar3 color='#667085' size={20} />}
                                        className={clsx(styles.inputText, { [styles.error]: errors.due_date }, 'p-0 outline-none')}
                                    />
                                );
                            }}
                        />
                        {errors?.due_date && <p className="error-message">{errors.due_date?.message}</p>}
                    </div>
                </Col>


                <Col sm={6}>
                    <div className="d-flex flex-column gap-1">
                        <label className={clsx(styles.lable)}>Total Amount<span className='required'>*</span></label>
                        <IconField>
                            <InputNumber
                                prefix="$"
                                value={watch('amount')}
                                onValueChange={(e) => {
                                    setValue('amount', e.value);
                                    handleGstChange(getValues('gst-calculation'));
                                }}
                                onBlur={() => handleGstChange(getValues('gst-calculation'))}
                                style={{ height: '46px', padding: '0px' }}
                                className={clsx(styles.inputText, { [styles.error]: errors.amount })}
                                placeholder='$ Enter total amount'
                                maxFractionDigits={2}
                                minFractionDigits={2}
                                inputId="minmaxfraction"
                            />
                            <InputIcon>{errors.amount && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                        </IconField>
                        {errors?.amount && <p className="error-message">{errors.amount?.message}</p>}
                    </div>
                </Col>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-2">
                        <label className={clsx(styles.lable)}>GST<span className='required'>*</span></label>
                        <input type="hidden" {...register("nogst")} />
                        <Controller
                            name="gst-calculation"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={[
                                        { value: 'ex', label: "GST Exclusive" },
                                        { value: 'in', label: "GST Inclusive" },
                                        { value: 'no', label: "No GST" },
                                    ] || []}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                        handleGstChange(e.value);
                                    }}
                                    className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors?.gst })}
                                    style={{ height: '46px' }}
                                    value={field.value}
                                    placeholder="Select GST"
                                />
                            )}
                        />
                        {errors?.gst && <p className="error-message">{errors.gst?.message}</p>}
                    </div>
                </Col>
            </Row>

            <Row className={`${styles.expTotalRow}`}>
                <Col className='d-flex align-items-center justify-content-end' style={{ position: 'relative' }}>
                    <div className={styles.CalItem}>
                        <div>
                            <span>Subtotal</span>
                            <strong>${formatAUD(watch('subtotal') || "0.00")}</strong>
                        </div>
                    </div>
                    <div className={styles.dividerIcon}>
                        <PlusCircle color='#667085' size={20} />
                    </div>
                </Col>
                <Col className='d-flex align-items-center justify-content-end' style={{ position: 'relative' }}>
                    <div className={styles.CalItem}>
                        <div>
                            <span>Tax</span>
                            <strong>${formatAUD(watch('tax') || "0.00")}</strong>
                        </div>
                    </div>
                    <div className={styles.dividerIcon}>
                        <span style={{ color: '#1D2939', fontSize: '14px', fontWeight: 600 }}>=</span>
                    </div>
                </Col>
                <Col style={{ position: 'relative' }}>
                    <div className={`${styles.CalItemActive} ${styles.CalItem}`}>
                        <div>
                            <span>Total</span>
                            <strong className='text-nowrap'>${formatAUD(watch('totalAmount') || "0.00")}</strong>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className={clsx(styles.bgGreay, 'customSelectButton')}>
                <SelectButton value={option} onChange={(e) => setOptionValue(e.value)} options={options} />
                {
                    option === 'Assign to project'
                        ? (
                            <Col sm={12}>
                                <div className="d-flex flex-column gap-1 mt-4 mb-4">
                                    <Tooltip position='top' target={`.info-timeinterval`} />
                                    <label className={clsx(styles.lable)}>Link to Project<span className='required'>*</span> <QuestionCircle color='#667085' style={{ position: 'relative', top: '-1px' }} className={`ms-1 info-timeinterval`} data-pr-tooltip="Select an existing project to assign expenses and display the exact cost of using this asset." /></label>
                                    <Controller
                                        name="order"
                                        control={control}
                                        render={({ field }) => (
                                            <Dropdown
                                                {...field}
                                                options={projectsList?.data?.map((project) => ({
                                                    value: project.id,
                                                    label: `${project.number}: ${project.reference}`
                                                })) || []}
                                                onChange={(e) => {
                                                    field.onChange(e.value);
                                                }}
                                                className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors?.order })}
                                                style={{ height: '46px' }}
                                                value={field.value}
                                                loading={projectsList?.isFetching}
                                                placeholder="Select project"
                                                filter
                                            />
                                        )}
                                    />
                                    {errors?.order && <p className="error-message">{errors.order?.message}</p>}
                                </div>
                            </Col>
                        )
                        : (
                            <Col sm={12}>
                                <div className="d-flex flex-column gap-1 mt-4 mb-4">
                                    <Tooltip position='top' target={`.info-timeinterval`} />
                                    <label className={clsx(styles.lable)}>Expense time interval<span className='required'>*</span> <QuestionCircle color='#667085' style={{ position: 'relative', top: '-1px' }} className={`ms-1 info-timeinterval`} data-pr-tooltip="Selecting this option will categorize the expense under 'Operational Expense' and distribute it evenly over the chosen timeframe." /></label>
                                    <Controller
                                        name="type"
                                        control={control}
                                        render={({ field }) => (
                                            <Dropdown
                                                {...field}
                                                options={[
                                                    { value: 1, label: 'Monthly' },
                                                    { value: 2, label: 'Yearly' }
                                                ]}
                                                onChange={(e) => {
                                                    field.onChange(e.value);
                                                }}
                                                className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors?.type })}
                                                style={{ height: '46px' }}
                                                value={field.value}
                                                placeholder="Select expense time interval"
                                            />
                                        )}
                                    />
                                    {errors?.type && <p className="error-message">{errors.type?.message}</p>}
                                </div>
                            </Col>
                        )
                }
            </Row>

            <Row className={clsx(styles.bgGreay)}>
                <Col sm={12}>
                    <div className="d-flex flex-column gap-1">
                        <label className={clsx(styles.lable)}>Notes</label>
                        <IconField>
                            <InputIcon style={{ top: '75%' }}>{errors.note && <img src={exclamationCircle} alt='error-icon' />}</InputIcon>
                            <InputTextarea {...register("note")} rows={3} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.note })} style={{ resize: 'none' }} placeholder='Enter a note...' />
                        </IconField>
                        {errors.note && <p className="error-message">{errors.note.message}</p>}
                    </div>
                </Col>
            </Row>

            <Row className={clsx(styles.bgGreay)}>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mt-4 mb-4">
                        <label className={clsx(styles.lable)}>Account Code</label>
                        <Controller
                            name="account_code"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={[
                                        ...(xeroCodesList && xeroCodesList?.data?.map((code) => ({
                                            value: code.id,
                                            label: `${code.code}: ${code.name}`
                                        }))) || []
                                    ] || []}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                    }}
                                    className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors?.account_code })}
                                    style={{ height: '46px' }}
                                    scrollHeight="400px"
                                    value={field.value}
                                    loading={xeroCodesList?.isFetching}
                                    placeholder="Select account code"
                                    filter
                                />
                            )}
                        />
                        {errors?.account_code && <p className="error-message">{errors.account_code?.message}</p>}
                    </div>
                </Col>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mt-4 mb-4">
                        <label className={clsx(styles.lable)}>Department</label>
                        <Controller
                            name="department"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={[
                                        ...(departmentsList && departmentsList?.data?.map((department) => ({
                                            value: department.id,
                                            label: `${department.name}`
                                        }))) || []
                                    ] || []}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                    }}
                                    className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors?.department })}
                                    style={{ height: '46px' }}
                                    scrollHeight="400px"
                                    value={field.value}
                                    loading={departmentsList?.isFetching}
                                    placeholder="Select department"
                                    filter
                                />
                            )}
                        />
                        {errors?.department && <p className="error-message">{errors.department?.message}</p>}
                    </div>
                </Col>
            </Row>

            <div className="flex align-items-center">
                <Controller
                    name="notification"
                    control={control}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Checkbox
                            inputRef={ref}
                            checked={value}
                            onChange={(e) => {
                                onChange(e.checked);
                            }}
                            onBlur={onBlur}
                        />
                    )}
                />
                <label className="ms-2" style={{ position: 'relative', top: '1px', color: '#344054', fontWeight: 500, fontSize: '14px' }}>Send Email Notification when paid</label>
            </div>
        </form>
    );
});

export default ExpensesForm;