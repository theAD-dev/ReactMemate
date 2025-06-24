import React, { useState, useEffect, useRef } from 'react';
import { Col, Row as BootstrapRow, Button, Card } from 'react-bootstrap';
import { CardList, Check2Circle, CheckCircleFill, EyeSlash, FilePdf, Person } from 'react-bootstrap-icons';
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
            toast.error("Failed to get the Invoice. Please try again.");
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
        <>${formatAUD(rowData?.unit_price)}</>
    );
    const discountBody = (rowData) => (
        <>{rowData?.discount} %</>
    );
    const TotalBody = (rowData) => (
        <> ${formatAUD(rowData?.total)} </>
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
            <div className={style.stepper}>
                <div className={style.personalDetails}>
                    <div className={clsx(style.stepperButton, 'outline-button', "active-outline-button")}>
                        <Person size={16} color={step === 1 ? '#158ECC' : "#76D1FF"} />
                    </div>
                    <span style={{ color: step === 1 ? "#344054" : "#98A2B3" }}>Personal Details</span>
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

    return (
        <>
            <div className={style.quotationWrapperPage}>
                <div className={style.quotationScroll}>
                    <div className={clsx(style.quotationWrapper, style[invoice?.status])}>
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
                                            <img src={`${process.env.REACT_APP_URL}${invoice?.organization?.logo}`} alt='Logo' style={{ maxWidth: '150px', maxHeight: '100px' }} />
                                        }
                                    </div>
                                    <div className='title-sections'>
                                        <h1>Tax Invoice</h1>
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

                        <div style={{ border: "1px solid #dedede", width: '100%' }}></div>

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

                        <div className='my-3' style={{ border: "1px solid #dedede", width: '100%' }}></div>

                        <div className={style.quotationRefress}>
                            <p>Reference: {isLoading ? <Skeleton width="6rem" height='13px' className='mb-0 rounded'></Skeleton> : <span><strong>{invoice?.reference}</strong></span>}</p>
                        </div>

                        <div className={style.quotationtable}>
                            <DataTable value={invoice?.calculations} className={style.invoiceWrapTable}>
                                <Column body={CounterBody} header="" style={{ width: '36px', verticalAlign: 'top', paddingTop: '15px', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} />
                                <Column field="index" body={ServicesBody} header="Product or Service" style={{ width: '456px' }} />
                                <Column field="quantity" header="Qty/Hours" style={{ width: '174px', textAlign: 'right', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} headerClassName='headerRightAligh' />
                                <Column field="unit_price" body={unitPriceBody} header="Unit Price" style={{ width: '130px', textAlign: 'right', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} headerClassName='headerRightAligh' />
                                <Column field="discount" body={discountBody} header="Discount" style={{ width: '120px', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px', textAlign: 'right' }} headerClassName='headerRightAligh' />
                                <Column field="total" body={TotalBody} header="Total" style={{ width: '66px', textAlign: 'right', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} headerClassName='headerRightAligh' />
                            </DataTable>
                        </div>

                        <BootstrapRow className='w-100 pt-4' style={{ paddingBottom: '200px' }}>
                            <Col sm={8} className='ps-4'>
                                <div className={style.qupteMainColFooter} style={{ marginTop: '0px' }}>
                                    <h2>Note:</h2>
                                    <p style={{ whiteSpace: 'pre-line' }}>{invoice?.note}</p>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div className='border-bottom py-2 w-100 d-flex justify-content-between'>
                                    <div style={{ fontSize: '14px', color: '#1D2939' }}>Subtotal</div>
                                    <div style={{ fontSize: '18px', color: '#1D2939' }}>${formatAUD(invoice?.subtotal)}</div>
                                </div>
                                <div className='border-bottom py-2 w-100 d-flex justify-content-between'>
                                    <div style={{ fontSize: '14px', }}>
                                        Tax
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

                            <Col sm={12} className='px-0'>
                                <span style={{ fontWeight: 600 }}>Ways to pay</span>
                            </Col>
                            <div className='mb-2 mt-1' style={{ border: "1px solid #dedede", width: '100%' }}></div>
                            <Col sm={12}>
                                <BootstrapRow>
                                    <Col sm={8}>
                                        <p className='mb-1' style={{ textDecoration: "underline" }}>Bank transfer</p>
                                        <p className='mb-1'>Account Holder: &nbsp;&nbsp;&nbsp;&nbsp; <b>{invoice?.organization?.name || "-"}</b></p>
                                        <p className='mb-1'>Account number: &nbsp;&nbsp; <b>{invoice?.organization?.account_number || "-"}</b></p>
                                        <p className='mb-1'>BSB number: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>{invoice?.organization?.bsb || "-"}</b></p>
                                    </Col>
                                    <Col sm={4}>
                                        <div className='py-2 w-100 d-flex justify-content-end gap-3'>
                                            <svg width="206" height="29" viewBox="0 0 206 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="1.75821" y="1.77261" width="37.8622" height="25.8151" rx="3.44202" fill="white" stroke="#D9D9D9" strokeWidth="1.72101" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.9881 19.5656H10.5902L8.79198 12.606C8.70663 12.2858 8.52541 12.0028 8.25884 11.8694C7.59358 11.5342 6.86051 11.2674 6.06079 11.1328V10.8649H9.92374C10.4569 10.8649 10.8567 11.2674 10.9234 11.7349L11.8564 16.7551L14.2532 10.8649H16.5845L12.9881 19.5656ZM17.9173 19.5656H15.6526L17.5174 10.8649H19.7821L17.9173 19.5656ZM22.7122 13.2751C22.7789 12.8065 23.1787 12.5385 23.6452 12.5385C24.3783 12.4712 25.1769 12.6058 25.8433 12.9399L26.2431 11.0666C25.5767 10.7986 24.8436 10.6641 24.1784 10.6641C21.9803 10.6641 20.3809 11.8692 20.3809 13.5419C20.3809 14.8143 21.5138 15.4824 22.3135 15.8849C23.1787 16.2863 23.5119 16.5542 23.4453 16.9556C23.4453 17.5576 22.7789 17.8255 22.1136 17.8255C21.3139 17.8255 20.5142 17.6248 19.7823 17.2896L19.3824 19.1641C20.1821 19.4981 21.0473 19.6327 21.847 19.6327C24.3117 19.6988 25.8433 18.4948 25.8433 16.6876C25.8433 14.4118 22.7122 14.2784 22.7122 13.2751ZM33.769 19.5656L31.9708 10.8649H30.0394C29.6395 10.8649 29.2396 11.1328 29.1064 11.5342L25.7765 19.5656H28.1079L28.5732 18.2943H31.4377L31.7043 19.5656H33.769ZM30.3725 13.2078L31.0378 16.4869H29.173L30.3725 13.2078Z" fill="#172B85" />
                                                <rect x="44.7835" y="1.77261" width="37.8622" height="25.8151" rx="3.44202" fill="white" stroke="#D9D9D9" strokeWidth="1.72101" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M64.0833 21.0438C62.573 22.311 60.6138 23.0759 58.473 23.0759C53.6961 23.0759 49.8236 19.2673 49.8236 14.5692C49.8236 9.87108 53.6961 6.0625 58.473 6.0625C60.6138 6.0625 62.573 6.82747 64.0834 8.09466C65.5937 6.82749 67.5529 6.06253 69.6938 6.06253C74.4707 6.06253 78.3431 9.87111 78.3431 14.5692C78.3431 19.2674 74.4707 23.076 69.6938 23.076C67.5529 23.076 65.5937 22.311 64.0833 21.0438Z" fill="#ED0006" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M64.0833 21.0438C65.943 19.4835 67.1222 17.1618 67.1222 14.5692C67.1222 11.9766 65.943 9.65493 64.0833 8.09465C65.5936 6.82747 67.5528 6.0625 69.6937 6.0625C74.4706 6.0625 78.343 9.87108 78.343 14.5692C78.343 19.2673 74.4706 23.0759 69.6937 23.0759C67.5528 23.0759 65.5936 22.311 64.0833 21.0438Z" fill="#F9A000" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M64.0833 21.0439C65.943 19.4836 67.1222 17.1619 67.1222 14.5693C67.1222 11.9767 65.943 9.65501 64.0833 8.09473C62.2235 9.65501 61.0443 11.9767 61.0443 14.5693C61.0443 17.1619 62.2235 19.4836 64.0833 21.0439Z" fill="#FF5E00" />
                                                <rect x="87.8087" y="1.77261" width="74.0034" height="25.8151" rx="3.44202" fill="white" stroke="#D9D9D9" strokeWidth="1.72101" />
                                                <path d="M154.194 18.837H152.32C151.932 18.837 151.609 18.5803 151.609 18.2594C151.609 17.8743 151.932 17.6818 152.32 17.6818H155.744L156.52 15.9504H152.32C150.576 15.9504 149.606 16.9759 149.606 18.3236C149.606 19.6713 150.576 20.5684 152.062 20.5684H153.935C154.323 20.5684 154.646 20.8251 154.646 21.146C154.646 21.4669 154.388 21.7236 153.935 21.7236H149.8V23.455H153.935C155.679 23.455 156.649 22.4295 156.649 21.0176C156.649 19.6058 155.744 18.837 154.194 18.837ZM146.635 18.837H144.762C144.374 18.837 144.051 18.5803 144.051 18.2594C144.051 17.8743 144.374 17.6818 144.762 17.6818H148.185L148.961 15.9504H144.762C143.018 15.9504 142.049 16.9759 142.049 18.3236C142.049 19.6713 143.018 20.5684 144.504 20.5684H146.378C146.766 20.5684 147.089 20.8251 147.089 21.146C147.089 21.4669 146.83 21.7236 146.378 21.7236H142.243V23.455H146.378C148.122 23.455 149.091 22.4295 149.091 21.0176C149.155 19.6071 148.251 18.837 146.635 18.837ZM134.684 23.5178H141.145V21.7864H136.752V20.5684H141.081V18.837H136.752V17.619H141.145V15.8875H134.684V23.5192V23.5178ZM130.679 19.1579H128.547V17.619H130.679C131.261 17.619 131.584 18.004 131.584 18.3891C131.584 18.8383 131.261 19.1592 130.679 19.1592M133.65 18.3249C133.65 16.8502 132.616 15.8875 130.936 15.8875H126.478V23.5192H128.545V20.8906H129.321L131.647 23.5192H134.103L131.583 20.7623C132.874 20.4414 133.65 19.5442 133.65 18.3249ZM122.603 19.2875H120.406V17.6203H122.603C123.185 17.6203 123.508 18.0053 123.508 18.4546C123.508 18.9038 123.25 19.2889 122.603 19.2889M122.862 15.8902H118.404V23.5219H120.471V21.0203H122.862C124.606 21.0203 125.64 19.9306 125.64 18.4546C125.576 16.9157 124.543 15.8889 122.862 15.8889M118.017 15.8889H115.369L113.431 18.1979L111.428 15.8889H108.714L112.138 19.6726L108.65 23.5205H111.297L113.365 21.0831L115.432 23.5205H118.145L114.657 19.6084L118.016 15.8889H118.017ZM101.931 23.5205H108.391V21.7891H103.933V20.5711H108.262V18.8396H103.933V17.6216H108.391V15.8902H101.931V23.5219V23.5205ZM153.418 10.7561L150.253 6.13937H147.668V13.7069H149.736V8.89629L152.965 13.7055H155.421V6.13937H153.418V10.7574V10.7561ZM141.531 10.4994L142.628 7.93364L143.726 10.4994H141.529H141.531ZM141.272 6.13803L137.913 13.7697H140.174L140.821 12.2308H144.374L145.02 13.7697H147.346L143.923 6.13937H141.273L141.272 6.13803ZM134.554 9.98595V9.8576C134.554 8.70376 135.2 7.93364 136.492 7.93364H138.753V6.0752H136.298C133.778 6.0752 132.486 7.67827 132.486 9.79476V9.92311C132.486 12.2963 133.972 13.6427 136.233 13.6427H136.944L137.784 11.9113H136.557C135.33 11.9754 134.554 11.2695 134.554 9.98729M129.386 13.7069H131.453V6.13937H129.386V13.7069ZM125.38 9.34553H123.248V7.80663H125.38C125.962 7.80663 126.285 8.19168 126.285 8.57674C126.285 9.02598 125.962 9.34686 125.38 9.34686M128.351 8.57674C128.351 7.10202 127.317 6.13937 125.639 6.13937H121.181V13.771H123.248V11.0783H124.024L126.35 13.7082H128.87L126.287 10.9513C127.578 10.6946 128.354 9.73326 128.354 8.57808M113.366 13.7082H119.826V11.9768H115.432V10.7587H119.697V9.02732H115.432V7.8093H119.826V6.13937H113.366V13.7069V13.7082ZM106.842 10.8858L105.096 6.13937H101.931V13.7069H103.934V8.25586L105.937 13.7069H107.746L109.749 8.25586V13.7069H111.816V6.13937H108.586L106.842 10.8844V10.8858ZM95.7304 10.5007L96.8281 7.93498L97.9258 10.5007H95.729H95.7304ZM95.4704 6.13937L92.1113 13.7069H94.3727L95.0192 12.168H98.5722L99.2187 13.7069H101.545L98.1197 6.13937H95.4704Z" fill="#006FCF" />
                                                <rect x="166.975" y="1.77261" width="37.8622" height="25.8151" rx="3.44202" fill="white" stroke="#D9D9D9" strokeWidth="1.72101" />
                                                <path d="M188.964 14.5856C188.964 19.2857 185.197 23.096 180.551 23.096C175.905 23.096 172.138 19.2857 172.138 14.5856C172.138 9.88543 175.905 6.0752 180.551 6.0752C185.197 6.0752 188.964 9.88543 188.964 14.5856Z" fill="#ED0006" />
                                                <path d="M199.877 14.5856C199.877 19.2857 196.111 23.096 191.465 23.096C186.818 23.096 183.052 19.2857 183.052 14.5856C183.052 9.88543 186.818 6.0752 191.465 6.0752C196.111 6.0752 199.877 9.88543 199.877 14.5856Z" fill="#0099DF" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M186.008 21.0631C187.817 19.5021 188.963 17.1794 188.963 14.5857C188.963 11.9921 187.817 9.66936 186.008 8.1084C184.199 9.66936 183.052 11.9921 183.052 14.5857C183.052 17.1794 184.199 19.5021 186.008 21.0631Z" fill="#6C6BBD" />
                                            </svg>
                                        </div>
                                    </Col>
                                </BootstrapRow>
                            </Col>
                        </BootstrapRow>
                    </div>
                    <div className={clsx(style.logoWrapperFooter, 'd-flex flex-column align-items-center')}>
                        <p className='mb-1'><span>Powered by</span><img src="/logo.svg" alt='Logo' /></p>
                        <Button className='bg-transparent border-0 p-0 font-14 mb-4' onClick={() => setTermAndConditionShow(true)} style={{ color: '#158ECC' }}>Term and Conditions</Button>
                        {
                            termAndConditionShow && (
                                <>
                                    <Button className='outline-button mb-2' onClick={() => setTermAndConditionShow(false)}>Hide <EyeSlash size={20} color='#344054' /></Button>
                                    <div className={clsx(style.termsCondition, 'p-4 mx-auto')} style={{ width: '825px' }}>
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
                    (invoice?.pay_status !== 'paid') && <div className={style.quotationfooter}>
                        <div className={style.contanerfooter}>
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
                                {invoice?.has_stripe &&
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
                            <h6 className='mb-2'>Personal Details</h6>
                            <BootstrapRow>
                                <Col sm={6} className='pe-1'>
                                    <div className="d-flex flex-column gap-1 mb-2">
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
                                    <div className="d-flex flex-column gap-1">
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
                                                    filter
                                                />
                                            )}
                                        />
                                        {errors?.state && <p className="error-message">{errors?.state?.message}</p>}
                                    </div>
                                </Col>

                                <Col sm={4} className='px-2'>
                                    <div className="d-flex flex-column gap-1">
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
                                                    filter
                                                />
                                            )}
                                        />
                                        {errors?.city && <p className="error-message">{errors?.city?.message}</p>}
                                    </div>
                                </Col>

                                <Col sm={3} className='ps-1'>
                                    <div className="d-flex flex-column gap-1">
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
                            <Col sm={8}>
                                <h6>Payment Method</h6>
                                <StripeContainer ref={paymentRef} setIsPaymentProcess={setIsPaymentProcess} amount={invoice?.outstanding_amount} close={handleClose} clientSecret={payment?.client_secret} publishKey={payment?.public_key} />
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