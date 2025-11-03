import React, { useState, useEffect, useRef } from 'react';
import { Col, Row as BootstrapRow, Button, Card } from 'react-bootstrap';
import { CardList, Check2Circle, CheckCircleFill, EyeSlash, FilePdf, Person } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { useForm, Controller } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Skeleton } from 'primereact/skeleton';
import { toast } from 'sonner';
import * as yup from 'yup';
import style from './public-invoice.module.scss';
import { getCities, getCountries, getStates } from '../../../../../APIs/ClientsApi';
import { getInvoice, paymentIntentCreate } from '../../../../../APIs/invoice-api';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import ValidationError from '../../../../../pages/error/validation/validation';
import { formatAUD } from '../../../../../shared/lib/format-aud';
import StripeContainer from '../../../../../ui/strip-payment/strip-payment';


const schema = yup.object().shape({
    firstname: yup.string().required('First name is required'),
    lastname: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    city: yup.string().required('City is required'),
    postal_code: yup.string().required('Postal code is required'),
    address: yup.string().required('Address is required'),
});

const PublicInvoice = () => {
    const { id } = useParams();
    const paymentRef = useRef();
    const [isPaymentProcess, setIsPaymentProcess] = useState(false);
    const [termAndConditionShow, setTermAndConditionShow] = useState(false);

    const [invoice, setInvoice] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [payment, setPayment] = useState({});

    const [visible, setVisible] = useState(false);
    const [isError, setIsError] = useState(false);
    const handleClose = () => setVisible(false);

    const { register, control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstname: '',
            lastname: '',
            email: '',
            city: '',
            postal_code: '',
            address: '',
            country: 1,
            state: ''
        }
    });

    const [countryId, setCountryId] = useState(1);
    const [stateId, setStateId] = useState('');
    const countriesQuery = useQuery({ queryKey: ['countries'], queryFn: getCountries, enabled: true });
    const statesQuery = useQuery({ queryKey: ['states', countryId], queryFn: () => getStates(countryId), enabled: !!countryId, retry: 1 });
    const citiesQuery = useQuery({ queryKey: ['cities', stateId], queryFn: () => getCities(stateId), enabled: !!stateId });

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await getInvoice(id);
            setInvoice(data);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const formatDate = (isoDate) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(isoDate).toLocaleDateString('en-US', options);
    };

    const daysLeft = (dueDate) => {
        const currentDate = new Date();
        const dueDateObj = new Date(dueDate);
        const timeDiff = dueDateObj - currentDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        return daysDiff ? `${daysDiff} Days Overdue` : '';
    };

    const formatTimeStamp = (timestamp) => {
        if (!timestamp) return "-";

        const date = new Date(+timestamp * 1000);
        const day = date.getDate();
        const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
            month: "long",
        }).format(date);
        const year = date.getFullYear();
        return `${monthAbbreviation} ${day}, ${year}`;
    };

    const ServicesBody = (rowData) => (
        <div className={style.qupteMainColWrap}>
            <ul>
                <p>{rowData?.description}</p>
            </ul>
        </div>
    );
    const unitPriceBody = (rowData) => (
        <span className={style.whitespaceNowrap}>${formatAUD(rowData?.unit_price)}</span>
    );
    const discountBody = (rowData) => (
        <span className={style.whitespaceNowrap}>{rowData?.discount} %</span>
    );
    const TotalBody = (rowData) => (
        <span className={style.whitespaceNowrap}>${formatAUD(rowData?.total)}</span>
    );

    const CounterBody = (rowData, { rowIndex }) => <span>{rowIndex + 1}</span>;

    const mutation = useMutation({
        mutationFn: (data) => paymentIntentCreate(id, data),
        onSuccess: (response) => {
            toast.success(`Payment intent created successfully.`);
            // navigate(`/payment/${response?.client_secret}/${response?.public_key}`);
            setPayment({ client_secret: response?.client_secret, public_key: response?.public_key });
        },
        onError: (error) => {
            console.error('Error creating payment intent:', error);
            toast.error(`Failed to create payment intent. Please try again.`);
        }
    });

    const onSubmit = (data) => {
        const { firstname, lastname, email, cityname, postal_code, address } = data;
        console.log('Form Data:', data);
        mutation.mutate({
            name: `${firstname} ${lastname}`, email, city: cityname, postal_code, address
        });
    };

    const step = (payment?.client_secret && payment?.public_key) ? 2 : 1;

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <div className={style.circledesignstyle}>
                    <div className={style.out}>
                        <Check2Circle size={24} color={"#17B26A"} />
                    </div>
                </div>
                Pay Invoice
            </div>
            <div className={clsx(style.stepper, 'd-md-flex d-none')}>
                <div className={style.personalDetails}>
                    <div className={clsx(style.stepperButton, 'outline-button', "active-outline-button")}>
                        <Person size={16} color={step === 1 ? '#158ECC' : "#76D1FF"} />
                    </div>
                    <span style={{ color: step === 1 ? "#344054" : "#98A2B3", }}>Personal Details</span>
                </div>
                <div className={style.paymentMethod}>
                    <div className={clsx(style.stepperButton, 'outline-button', { "active-outline-button": step === 2 })}>
                        <CardList size={16} color={step === 2 ? '#158ECC' : "#D0D5DD"} />
                    </div>
                    <span style={{ color: step === 2 ? "#344054" : "#858D98" }}>Payment Method</span>
                </div>
            </div>
        </div>
    );

    const handlePareentPay = () => {
        if (paymentRef.current)
            paymentRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    };

    const footerContent = (
        <div className="d-flex justify-content-between gap-3">
            <Button className={`text-button text-danger`} onClick={handleClose}>
                Cancel
            </Button>
            <div className='d-flex gap-3'>
                {
                    step === 1 ? <Button onClick={handleSubmit(onSubmit)} disabled={mutation.isPending} className="success-button text-nowrap">
                        Next Step {mutation.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                    </Button>
                        : <>
                            <Button onClick={() => setPayment({})} className="outline-button">
                                Back
                            </Button>
                            <Button onClick={handlePareentPay} disabled={isPaymentProcess} className="success-button text-nowrap">
                                Pay ${formatAUD(invoice?.outstanding_amount)}
                                {isPaymentProcess && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                            </Button>
                        </>
                }
            </div>

        </div>
    );

    if (isError) {
        return <ValidationError message="Invoice not valid." />;
    }

    return (
        <>
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>
            <div className={style.quotationWrapperPage}>
                <div className={style.quotationScroll}>
                    <div className={clsx(style.quotationWrapper, { [style.paid]: invoice?.pay_status === 'paid' })}>
                        {
                            (invoice?.pay_status === 'paid') && <div className={clsx(style.paidLabel)}>
                                <div className='d-flex align-items-center gap-2'>
                                    <span>Paid</span>
                                    <CheckCircleFill size={16} color='#085D3A' />
                                </div>
                            </div>
                        }
                        <div className={style.quotationHead}>
                            <div className={style.left} style={{ width: '50%' }}>
                                <div className='d-flex align-items-center gap-3'>
                                    <div className='logo-section'>
                                        {
                                            invoice?.organization?.logo &&
                                            <img src={`${process.env.REACT_APP_URL}${invoice?.organization?.logo}`} alt='Logo' style={{ maxWidth: '150px', maxHeight: '75px', borderRadius: '2px' }} className={style.logo} />
                                        }
                                    </div>
                                    <div className='title-sections'>
                                        <h1 className={style.title}>Tax Invoice</h1>
                                        <p className={clsx(style.invoiceNumber, 'mb-2 mt-2')}> {isLoading ? <Skeleton width="6rem" height='27px' className="mb-2 rounded"></Skeleton> : <span>{invoice?.number}</span>} </p>
                                    </div>
                                </div>
                            </div>
                            <div className={style.right} style={{ width: '50%' }}>
                                <div className={style.quotationRefress}>
                                    <div className={style.left}>
                                        <p className='d-flex gap-2 align-items-center text-nowrap'>Date of issue:
                                            {isLoading ? <Skeleton width="6rem" height='12px' className='mb-0 rounded'></Skeleton> : <span>{formatTimeStamp(invoice?.date)}</span>}
                                        </p>
                                        <p className='d-flex gap-2 align-items-center text-nowrap'>Date due:
                                            {isLoading ? <Skeleton width="6rem" height='12px' className='mb-0 rounded'></Skeleton> : <span>{formatDate(invoice?.due_date)}</span>}
                                        </p>
                                    </div>
                                    <div className={style.right}>
                                        {invoice?.purchase_order && <p>PO: </p>}
                                        {isLoading ? <Skeleton width="6rem" height='13px' className='mb-0 mt-1 rounded'></Skeleton> : <p><strong>{invoice?.purchase_order}</strong></p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='d-md-block d-none' style={{ border: "1px solid #dedede", width: '100%' }}></div>

                        <div className={style.quotationAddress}>
                            <div className={style.left}>
                                <p style={{ textDecoration: "underline" }}>To</p>
                                <ul>
                                    {isLoading ? (
                                        <>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                        </>
                                    ) : (
                                        <>
                                            {invoice?.client.name && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    <strong style={{ lineHeight: '16px' }}>{invoice.client.name}</strong>
                                                </li>
                                            )}
                                            {invoice?.client.abn && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    ABN: {invoice.client.abn}
                                                </li>
                                            )}
                                            {invoice?.client?.addresses[0]?.address && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {invoice.client.addresses[0].address}
                                                </li>
                                            )}
                                            {invoice?.client?.addresses[0]?.city && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {invoice.client.addresses[0].city}
                                                </li>
                                            )}
                                            {invoice?.client?.addresses[0]?.state && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {invoice.client.addresses[0].state}
                                                </li>
                                            )}
                                            {invoice?.client?.addresses[0]?.country && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {invoice.client.addresses[0].country}
                                                </li>
                                            )}
                                            {invoice?.client?.addresses[0]?.postcode && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {invoice.client.addresses[0].postcode}
                                                </li>
                                            )}
                                            {invoice?.client.phone && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {invoice.client.phone}
                                                </li>
                                            )}
                                        </>
                                    )}
                                </ul>
                            </div>
                            <div className={style.right}>
                                <p style={{ textDecoration: "underline" }}>Issued by</p>
                                <ul>
                                    {isLoading ? (
                                        <>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                        </>
                                    ) : (
                                        <>
                                            {invoice?.organization.account_name && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    <strong style={{ lineHeight: '16px' }}>{invoice.organization.account_name}</strong>
                                                </li>
                                            )}
                                            {invoice?.organization.abn && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    ABN: {invoice.organization.abn}
                                                </li>
                                            )}
                                            {invoice?.organization.address && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {invoice.organization.address}
                                                </li>
                                            )}
                                            {invoice?.organization.phone && (
                                                <li style={{ lineHeight: '18px' }}>
                                                    {invoice.organization.phone}
                                                </li>
                                            )}
                                            {invoice?.organization.email && (
                                                <li style={{ lineHeight: '18px' }}>
                                                    {invoice.organization.email}
                                                </li>
                                            )}
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className='my-3 d-md-block d-none' style={{ border: "1px solid #dedede", width: '100%' }}></div>

                        <div className={style.quotationRefress}>
                            <p>Reference: {isLoading ? <Skeleton width="6rem" height='13px' className='mb-0 rounded'></Skeleton> : <span><strong>{invoice?.reference}</strong></span>}</p>
                        </div>

                        <div className={clsx(style.quotationtable, 'phone-responsive-table')}>
                            <DataTable value={invoice?.calculations} className={style.invoiceWrapTable}>
                                <Column body={CounterBody} header="" style={{ width: '36px', verticalAlign: 'top', paddingTop: '15px', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px', textAlign: 'center' }} />
                                <Column field="index" body={ServicesBody} header="Product or Service" style={{ width: '456px', minWidth: '172px' }} />
                                <Column field="quantity" header="Qty/Hours" style={{ width: '174px', textAlign: 'right', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} headerClassName='headerRightAligh' />
                                <Column field="unit_price" body={unitPriceBody} header="Unit Price" style={{ width: '130px', textAlign: 'right', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} headerClassName='headerRightAligh' />
                                <Column field="discount" body={discountBody} header="Discount" style={{ width: '120px', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px', textAlign: 'right' }} headerClassName='headerRightAligh' />
                                <Column field="total" body={TotalBody} header="Total" style={{ width: '66px', textAlign: 'right', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} headerClassName='headerRightAligh' />
                            </DataTable>
                        </div>

                        <BootstrapRow className={clsx('w-100 pt-5', style.quoteMainRowFooter)} style={{ paddingBottom: '200px' }}>
                            <Col sm={8} className='ps-ms-4 ps-3 w-50'>
                                <div className={clsx(style.backDetails)}>
                                    <p className='mb-1'>Account Name: &nbsp;&nbsp;&nbsp;&nbsp; <b>{invoice?.organization?.name || "-"}</b></p>
                                    <p className='mb-1'>Account number: &nbsp;&nbsp; <b>{invoice?.organization?.account_number || "-"}</b></p>
                                    <p className='mb-1'>BSB number: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{invoice?.organization?.bsb || "-"}</b></p>
                                </div>
                                <div className={clsx(style.qupteMainColFooter, 'd-md-block d-none mt-3')} style={{ marginTop: '0px' }}>
                                    <h2>Note:</h2>
                                    <p className='mt-1' style={{ whiteSpace: 'pre-line' }}>{invoice?.note}</p>
                                </div>
                            </Col>
                            <Col sm={4} className={clsx(style.quoteMainColFooter, 'w-50 pe-md-4 pe-0')}>
                                <div className='border-bottom pb-2 w-100 d-flex justify-content-between'>
                                    <div style={{ fontSize: '14px', color: '#1D2939' }}>Subtotal</div>
                                    <div style={{ fontSize: '18px', color: '#1D2939' }}>${formatAUD(invoice?.subtotal)}</div>
                                </div>
                                <div className='border-bottom py-2 w-100 d-flex justify-content-between'>
                                    <div style={{ fontSize: '14px', }}>
                                        Tax ({invoice?.xero_tax === 'in' ? '10% Inclusive' : invoice?.xero_tax === 'ex' ? '10% Exclusive' : '0%'})
                                    </div>
                                    <div style={{ fontSize: '18px', }}>${formatAUD(invoice?.gst)}</div>
                                </div>
                                <div className='border-bottom py-2 w-100 d-flex justify-content-between'>
                                    <div style={{ fontSize: '14px', }}>Total</div>
                                    <div style={{ fontSize: '18px' }}>${formatAUD(invoice?.total)}</div>
                                </div>
                                <div className='border-bottom py-2 w-100 d-flex justify-content-between'>
                                    <div style={{ fontSize: '14px', }}>Deposit</div>
                                    <div style={{ fontSize: '18px', }}>- ${formatAUD(invoice?.deposit)}</div>
                                </div>
                                <div className='py-2 w-100 d-flex justify-content-between'>
                                    <div style={{ fontSize: '20px', fontWeight: 600 }}>Amount due</div>
                                    <div style={{ fontSize: '20px', fontWeight: 600 }}>${formatAUD(invoice?.outstanding_amount)}</div>
                                </div>
                            </Col>
                        </BootstrapRow>

                        <div className={clsx(style.qupteMainColFooter, 'd-md-none d-block')} style={{ marginTop: '0px' }}>
                            <h2>Note:</h2>
                            <p className={clsx('mt-1', style.noteText)} style={{ whiteSpace: 'pre-line' }}>{invoice?.note}</p>
                        </div>
                    </div>
                    <div className={clsx(style.logoWrapperFooter, 'd-flex flex-column align-items-center')}>
                        <p className='mb-1'><span className={clsx(style.poweredByText)}>Powered by</span><img src="/logo.svg" alt='Logo' /></p>
                        <Button className='bg-transparent border-0 p-0 font-14 mb-4' onClick={() => setTermAndConditionShow(true)} style={{ color: '#158ECC' }}>Term and Conditions</Button>
                        {
                            termAndConditionShow && (
                                <>
                                    <Button className='outline-button mb-2' onClick={() => setTermAndConditionShow(false)}>Hide <EyeSlash size={20} color='#344054' /></Button>
                                    <div className={clsx(style.termsCondition, 'p-md-4 p-1 mx-auto')} style={{ width: '825px' }}>
                                        <Editor readOnly showHeader={false} modules={{}}
                                            style={{ border: "none", fontSize: "16px", background: 'transparent', color: '#475467' }}
                                            value={invoice?.terms_and_conditions}
                                        />
                                    </div>
                                </>
                            )
                        }

                    </div>
                </div>

                {
                    (invoice?.pay_status !== 'paid') && <div className={style.quotationFooter}>
                        <div className={style.containerFooter}>
                            <div className={style.left}>
                                <Link to={`${process.env.REACT_APP_URL}${invoice?.invoice_url}`} target='_blank'>
                                    <button
                                        className={"outline-button"}
                                    >
                                        {'Save PDF'}
                                        <FilePdf size={20} color='#344054' className='ms-1' />
                                    </button>
                                </Link>
                            </div>
                            <div className={clsx(style.right, 'd-flex align-items-center')}>
                                <div>
                                    <p className='mb-0' style={{ fontSize: '24px', fontWeight: 600, color: '#1A1C21' }}>${formatAUD(invoice?.outstanding_amount)}</p>
                                    <p className='mb-0' style={{ fontSize: '16px', fontWeight: 500, color: '#FFB258' }}>{daysLeft(invoice?.due_date)}</p>
                                </div>
                                {invoice && invoice?.has_stripe &&
                                    <button
                                        className={style.accept}
                                        onClick={() => { setVisible(true); }}
                                        style={{ height: '48px' }}
                                    >
                                        Pay this invoice
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>

            <Dialog
                visible={visible}
                modal={true}
                header={headerElement}
                footer={footerContent}
                className={`${style.modal} custom-modal custom-scroll-integration pt-0`}
                onHide={handleClose}
            >

                <BootstrapRow>
                    {
                        step === 1 ? <Col sm={8}>
                            <div className={clsx(style.stepper, 'd-md-none d-flex')}>
                                <div className={style.personalDetails}>
                                    <div className={clsx(style.stepperButton, 'outline-button', "active-outline-button")}>
                                        <Person size={16} color={step === 1 ? '#158ECC' : "#76D1FF"} />
                                    </div>
                                    <span style={{ color: step === 1 ? "#344054" : "#98A2B3", whiteSpace: 'nowrap' }}>Personal Details</span>
                                </div>
                                <div className={style.paymentMethod}>
                                    <div className={clsx(style.stepperButton, 'outline-button', { "active-outline-button": step === 2 })}>
                                        <CardList size={16} color={step === 2 ? '#158ECC' : "#D0D5DD"} />
                                    </div>
                                    <span style={{ color: step === 2 ? "#344054" : "#858D98", whiteSpace: 'nowrap' }}>Payment Method</span>
                                </div>
                            </div>
                            <h6 className='mb-2'>Personal Details</h6>
                            <BootstrapRow>
                                <Col sm={6} className='pe-1'>
                                    <div className="d-flex flex-column gap-1 mb-3">
                                        <label className={clsx(style.lable)}>First Name</label>
                                        <IconField>
                                            <InputIcon>{errors.firstname && <img src={exclamationCircle} className='mb-2' alt='exclamationCircle' />}</InputIcon>
                                            <InputText {...register("firstname")} className={clsx(style.inputText, { [style.error]: errors.firstname })} placeholder='Enter first name' />
                                        </IconField>
                                        {errors.firstname && <p className="error-message">{errors.firstname.message}</p>}
                                    </div>
                                </Col>
                                <Col sm={6} className='ps-2'>
                                    <div className="d-flex flex-column gap-1 mb-3">
                                        <label className={clsx(style.lable)}>Last Name</label>
                                        <IconField>
                                            <InputIcon>{errors.lastname && <img src={exclamationCircle} className='mb-3' alt='exclamationCircle' />}</InputIcon>
                                            <InputText {...register("lastname")} className={clsx(style.inputText, { [style.error]: errors.lastname })} placeholder='Enter last name' />
                                        </IconField>
                                        {errors.lastname && <p className="error-message">{errors.lastname.message}</p>}
                                    </div>
                                </Col>

                                <Col sm={12}>
                                    <div className="d-flex flex-column gap-1 mb-3">
                                        <label className={clsx(style.lable)}>Email</label>
                                        <IconField>
                                            <InputIcon>{errors.email && <img src={exclamationCircle} className='mb-3' alt='exclamationCircle' />}</InputIcon>
                                            <InputText {...register("email")} className={clsx(style.inputText, { [style.error]: errors.email })} placeholder='example@email.com' />
                                        </IconField>
                                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                                    </div>
                                </Col>

                                <Col sm={12}>
                                    <div className="d-flex flex-column gap-1 mb-3">
                                        <label className={clsx(style.lable)}>Country</label>
                                        <Controller
                                            name="country"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <Dropdown
                                                    {...field}
                                                    options={(countriesQuery && countriesQuery.data?.map((country) => ({
                                                        value: country.id,
                                                        label: country.name
                                                    }))) || []}
                                                    onChange={(e) => {
                                                        field.onChange(e.value);
                                                        setCountryId(e.value);
                                                    }}
                                                    className={clsx(style.dropdownSelect, 'dropdown-height-fixed')}
                                                    style={{ height: '46px' }}
                                                    value={field.value}
                                                    loading={countriesQuery?.isFetching}
                                                    placeholder="Select a country"
                                                    filterInputAutoFocus={true}
                                                />
                                            )}
                                        />
                                        {errors?.country && <p className="error-message">{errors?.country?.message}</p>}
                                    </div>
                                </Col>

                                <Col sm={12}>
                                    <div className="d-flex flex-column gap-1 mb-3">
                                        <label className={clsx(style.lable)}>Street Address</label>
                                        <IconField>
                                            <InputIcon>{errors?.address && <img src={exclamationCircle} className='mb-3' alt='exclamationCircle' />}</InputIcon>
                                            <InputText {...register("address")} className={clsx(style.inputText, { [style.error]: errors?.address })} placeholder='Enter street address' />
                                        </IconField>
                                        {errors?.address && <p className="error-message">{errors?.address?.message}</p>}
                                    </div>
                                </Col>

                                <Col sm={5} className='pe-1'>
                                    <div className="d-flex flex-column gap-1 mb-3">
                                        <label className={clsx(style.lable)}>State</label>
                                        <Controller
                                            name="state"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <Dropdown
                                                    {...field}
                                                    options={(statesQuery && statesQuery.data?.map((state) => ({
                                                        value: state.id,
                                                        label: state.name
                                                    }))) || []}
                                                    onChange={(e) => {
                                                        field.onChange(e.value);
                                                        setStateId(e.value);
                                                    }}
                                                    className={clsx(style.dropdownSelect, 'dropdown-height-fixed')}
                                                    style={{ height: '46px' }}
                                                    value={field.value}
                                                    loading={statesQuery?.isFetching}
                                                    placeholder={"Select a state"}
                                                    scrollHeight="380px"
                                                    filter

                                                />
                                            )}
                                        />
                                        {errors?.state && <p className="error-message">{errors?.state?.message}</p>}
                                    </div>
                                </Col>

                                <Col sm={4} className='px-2'>
                                    <div className="d-flex flex-column gap-1 mb-3">
                                        <label className={clsx(style.lable)}>City/Suburb</label>
                                        <Controller
                                            name="city"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <Dropdown
                                                    {...field}
                                                    options={(citiesQuery && citiesQuery.data?.map((city) => ({
                                                        value: city.id,
                                                        label: city.name
                                                    }))) || []}
                                                    onChange={(e) => {
                                                        const selectedCity = citiesQuery.data.find(city => city.id === e.value);
                                                        field.onChange(e.value);
                                                        setValue('cityname', selectedCity?.name || "");
                                                    }}
                                                    className={clsx(style.dropdownSelect, { [style.error]: errors?.city }, 'dropdown-height-fixed')}
                                                    style={{ height: '46px' }}
                                                    value={field.value}
                                                    loading={citiesQuery?.isFetching}
                                                    disabled={citiesQuery?.isFetching}
                                                    placeholder={"Select a city"}
                                                    emptyMessage={!stateId ? "Select a state first" : "No cities found"}
                                                    scrollHeight="380px"
                                                    filter
                                                    filterInputAutoFocus={true}
                                                />
                                            )}
                                        />
                                        {errors?.city && <p className="error-message">{errors?.city?.message}</p>}
                                    </div>
                                </Col>

                                <Col sm={3} className='ps-1'>
                                    <div className="d-flex flex-column gap-1 mb-3">
                                        <label className={clsx(style.lable)}>Postcode</label>
                                        <IconField>
                                            <InputIcon>{errors?.postal_code && <img src={exclamationCircle} className='mb-3' alt='exclamationCircle' />}</InputIcon>
                                            <InputText {...register("postal_code")} keyfilter="int" className={clsx(style.inputText, { [style.error]: errors?.postal_code })} placeholder='Postcode' />
                                        </IconField>
                                        {errors?.postal_code && <p className="error-message text-nowrap">{errors.postal_code?.message}</p>}
                                    </div>
                                </Col>
                            </BootstrapRow>
                        </Col>
                            :
                            <Col sm={8} className="mb-3">
                                <h6>Payment Method</h6>
                                <StripeContainer ref={paymentRef} setIsPaymentProcess={setIsPaymentProcess} amount={invoice?.outstanding_amount} close={handleClose} clientSecret={payment?.client_secret} publishKey={payment?.public_key} fetchData={fetchData} />
                            </Col>
                    }

                    <Col sm={4}>
                        <Card className='mt-2' style={{ border: '1px solid #EAECF0' }}>
                            <Card.Body className='border-0'>
                                <p className='mb-0' style={{ color: '#475467', fontSize: '16px' }}>{invoice?.number}</p>
                                <p className='mb-0' style={{ color: '#1D2939', fontSize: '42px' }}>${formatAUD(invoice?.outstanding_amount + invoice?.commission)}</p>
                                <Divider />
                                <div className='d-flex justify-content-between'>
                                    <span className='font-14' style={{ color: '#1D2939' }}>Subtotal</span>
                                    <span className='font-14' style={{ color: '#1D2939' }}>${formatAUD(invoice?.subtotal)}</span>
                                </div>
                                <Divider />
                                <div className='d-flex justify-content-between'>
                                    <span className='font-14' style={{ color: '#1D2939' }}>
                                        {invoice?.xero_tax === "in"
                                            ? "Tax Inclusive (10%)"
                                            : invoice?.xero_tax === "ex"
                                                ? "Tax Exclusive (10%)"
                                                : "Tax"
                                        }
                                    </span>
                                    <span className='font-14' style={{ color: '#1D2939' }}>${formatAUD(invoice?.gst)}</span>
                                </div>
                                <Divider />
                                <div className='d-flex justify-content-between'>
                                    <span className='font-14' style={{ color: '#1D2939' }}>Total</span>
                                    <span className='font-14' style={{ color: '#1D2939' }}>${formatAUD(invoice?.total)}</span>
                                </div>
                                <Divider />
                                <div className='d-flex justify-content-between'>
                                    <span className='font-14' style={{ color: '#1D2939' }}>Deposit</span>
                                    <span className='font-14' style={{ color: '#1D2939' }}>- ${formatAUD(invoice?.deposit)}</span>
                                </div>
                                <Divider />
                                <div className='d-flex justify-content-between'>
                                    <span className='font-14' style={{ color: '#1D2939' }}>Processing Fee</span>
                                    <span className='font-14' style={{ color: '#1D2939' }}>${formatAUD(invoice?.commission)}</span>
                                </div>
                                <Divider />
                                <div className='d-flex justify-content-between mb-3'>
                                    <span className='font-14' style={{ color: '#1D2939', fontWeight: 600 }}>Amount due</span>
                                    <span className='font-14' style={{ color: '#1D2939', fontWeight: 600 }}>${formatAUD(invoice?.outstanding_amount + invoice?.commission)}</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </BootstrapRow>
            </Dialog>
        </>
    );
};

export default PublicInvoice;