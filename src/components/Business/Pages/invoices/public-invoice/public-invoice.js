import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import style from './public-invoice.module.scss';
import { getQuoteation, quotationDecline, quotationAccept, quotationChanges } from "../../../../../APIs/quoteation-api";
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { useParams } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import { Dialog } from "primereact/dialog";
import googleReview from "../../../../../assets/images/icon/checbold.svg";
import { Skeleton } from 'primereact/skeleton';
import { toast } from 'sonner';
import clsx from 'clsx';
import { getInvoice } from '../../../../../APIs/invoice-api';
import { Col, Row as BootstrapRow } from 'react-bootstrap';
import { FilePdf } from 'react-bootstrap-icons';

const PublicInvoice = () => {
    const { id } = useParams();

    const [invoice, setInvoice] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [updateDis, setUpdateDis] = useState('');
    const [errors, setErrors] = useState({});
    const [actionLoading, setActionLoading] = useState({ decline: false, changes: false, accept: false });
    const [visible, setVisible] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await getInvoice(id);
            setInvoice(data);
        } catch (error) {
            console.error('Error fetching data: ', error);
            toast.error("Failed to get the Quotation. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDecline = async () => {
        try {
            setActionLoading(prev => ({ ...prev, decline: true }));
            await quotationDecline(id);
            fetchData();
            toast.success("Quotation declined successfully.");
        } catch (error) {
            console.error('Error declining quotation: ', error);
            toast.error("Failed to decline the Quotation. Please try again.");
        } finally {
            setActionLoading(prev => ({ ...prev, decline: false }));
        }
    };

    const handleRequestChanges = async () => {
        try {
            if (!updateDis.trim()) {
                setErrors({ description: 'Note is required' });
                return;
            }
            setActionLoading(prev => ({ ...prev, changes: true }));
            await quotationChanges(id, { note: updateDis });
            toast.success("Quotation changes request has been sent");
            setVisible(false);
        } catch (error) {
            console.error('Error sending the Quotation changes: ', error);
            toast.error("Failed to sent the Quotation changes request. Please try again.");
        } finally {
            setActionLoading(prev => ({ ...prev, changes: false }));
        }
    };

    const handleAccept = async () => {
        try {
            setActionLoading(prev => ({ ...prev, accept: true }));
            await quotationAccept(id);
            fetchData();
            toast.success("Quotation accepted successfully.");
        } catch (error) {
            console.error('Error accepting quotation: ', error);
            toast.error("Failed to accept the Quotation. Please try again.");
        } finally {
            setActionLoading(prev => ({ ...prev, accept: false }));
        }
    };

    const formatDate = (isoDate) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(isoDate).toLocaleDateString('en-US', options);
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
            <h2>{rowData?.index}</h2>
            <ul>
                <p>{rowData?.description}</p>
                <li>{rowData?.subindex}</li>
            </ul>
        </div>
    );
    const unitPriceBody = (rowData) => (
        <>$ {rowData?.unit_price}</>
    );
    const discountBody = (rowData) => (
        <> {rowData?.discount} %</>
    );
    const TotalBody = (rowData) => (
        <> ${rowData?.total} </>
    );

    const noteBody = () => (
        <div className={style.qupteMainColWrap}>
            <h2>Note</h2>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
        </div>
    );

    const handleClose = (e) => {
        setVisible(false);
    };

    const footerContent = (
        <div className="d-flex justify-content-between gap-2">
            <Button className={`outline-button ${style.modelreadOutLIne}`} onClick={handleClose}>
                Cancel
            </Button>
            <Button className="solid-button" style={{ width: "74px" }} onClick={handleRequestChanges} disabled={actionLoading.changes}>
                {actionLoading.changes ? 'Saving...' : 'Save'}
            </Button>
        </div>
    );

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <img src={googleReview} alt={googleReview} />
                Request Change
            </div>
        </div>
    );

    const CounterBody = (rowData, { rowIndex }) => <span>{rowIndex + 1}</span>;

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column colSpan={4} />
                <Column footer="Subtotal" className={`${style.footerBoldTextLight} ${style.footerBorder}`} footerStyle={{ textAlign: 'right' }} />
                <Column footer={`\$${invoice?.subtotal}`} className={`${style.footerBoldTextLight} ${style.footerBoldTextLight1} ${style.footerBorder}`} />
            </Row>
            <Row>
                <Column colSpan={4} />
                <Column footer="Tax (10%)" className={`${style.footerBoldTextLight} ${style.footerBorder}`} footerStyle={{ textAlign: 'right' }} />
                <Column footer={`\$${invoice?.gst}`} className={`${style.footerBoldTextLight} ${style.footerBoldTextLight1} ${style.footerBorder}`} />
            </Row>
            <Row>
                <Column colSpan={4} />
                <Column footer="Deposit" className={`${style.footerBoldTextLight} ${style.footerBorder}`} footerStyle={{ textAlign: 'right' }} />
                <Column footer={`\$${invoice?.deposit}`} className={`${style.footerBoldTextLight} ${style.footerBoldTextLight1} ${style.footerBorder}`} />
            </Row>
            <Row>
                <Column colSpan={4} />
                <Column footer="Total" className={`${style.footerBoldText} ${style.footerBorder}`} footerStyle={{ textAlign: 'right' }} />
                <Column footer={`\$${invoice?.total}`} className={`${style.footerBoldText} ${style.footerBoldTextLight1} ${style.footerBorder}`} />
            </Row>
            <Row>
                <Column
                    footer={(
                        <div className={style.qupteMainColFooter}>
                            <h2>Note</h2>
                            <p>{invoice?.note}</p>
                        </div>
                    )}
                    colSpan={6}
                    footerStyle={{ textAlign: 'left' }}
                />
            </Row>
        </ColumnGroup>
    );

    const projectStatus = {
        'Accepted': 'Accepted',
        'Declined': 'Declined',
        'Review': 'Under Review',
        'Completed': 'Project Completed'
    }
    return (
        <>
            <div className={style.quotationWrapperPage}>
                <div className={style.quotationScroll}>
                    {
                        (invoice?.status !== "Sent" && invoice?.status !== "Saved") && <div className={clsx(style.topCaption, style.text, style[invoice?.status])}>
                            {projectStatus[invoice?.status] ? projectStatus[invoice?.status] : invoice?.status}
                        </div>
                    }

                    <div className={clsx(style.quotationWrapper, style[invoice?.status])}>
                        <div className={style.quotationHead}>
                            <div className={style.left}>
                                <h1>Invoice</h1>
                                <p className='mb-2 mt-2'> {isLoading ? <Skeleton width="6rem" height='27px' className="mb-2 rounded"></Skeleton> : <span>{invoice?.number}</span>} </p>
                            </div>
                            <div className={style.right}>
                                <img src="https://dev.memate.com.au/static/media/logo.ffcbd441341cd06abd1f3477ebf7a12a.svg" alt='Logo' />
                            </div>
                        </div>

                        <div className={style.quotationRefress}>
                            <div className={style.left}>
                                <p className='d-flex gap-2 align-items-center'>Date of issue:
                                    {isLoading ? <Skeleton width="6rem" height='12px' className='mb-0 rounded'></Skeleton> : <span>{formatTimeStamp(invoice?.date)}</span>}
                                </p>
                                <p className='d-flex gap-2 align-items-center'>Date due:
                                    {isLoading ? <Skeleton width="6rem" height='12px' className='mb-0 rounded'></Skeleton> : <span>{formatDate(invoice?.due_date)}</span>}
                                </p>
                            </div>
                            <div className={style.right}>
                                <p>Reference</p>
                                {isLoading ? <Skeleton width="6rem" height='13px' className='mb-0 mt-1 rounded'></Skeleton> : <p><strong>{invoice?.reference}</strong></p>}
                            </div>
                        </div>

                        <div className={style.quotationAddress}>
                            <div className={style.left}>
                                <p>From:</p>
                                <ul>
                                    <li>
                                        {isLoading ? <Skeleton width="10rem" height='15px' className='rounded'></Skeleton> : <strong>{invoice?.organization.account_name}</strong>}
                                    </li>
                                    <li>ABN:{invoice?.organization.abn}</li>
                                    <li>Address:{invoice?.organization.address}</li>
                                    <li>Phone:{invoice?.organization.phone}</li>
                                    <li>Email:{invoice?.organization.email}</li>
                                </ul>
                            </div>
                            <div className={style.right}>
                                <p>To:</p>
                                <ul>
                                    <li><strong>{invoice?.client.name}</strong></li>
                                    <li>{invoice?.client.email}</li>
                                    <li>{invoice?.client.phone}</li>
                                </ul>
                            </div>
                        </div>

                        <div className={style.quotationtable}>
                            <DataTable value={invoice?.calculations} className={style.invoiceWrapTable}>
                                <Column body={CounterBody} header="#" style={{ width: '36px', verticalAlign: 'top', paddingTop: '15px', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} />
                                <Column field="index" body={ServicesBody} header="Services" style={{ width: '456px' }} />
                                <Column field="quantity" header="Qty/Hours" style={{ width: '174px', textAlign: 'right', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} headerClassName='headerRightAligh' />
                                <Column field="unit_price" body={unitPriceBody} header="Price" style={{ width: '130px', textAlign: 'right', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} headerClassName='headerRightAligh' />
                                <Column field="discount" body={discountBody} header="Discount" style={{ width: '120px', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px', textAlign: 'right' }} headerClassName='headerRightAligh' />
                                <Column field="total" body={TotalBody} header="Total" style={{ width: '66px', textAlign: 'right', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} headerClassName='headerRightAligh' />
                            </DataTable>
                        </div>

                        <BootstrapRow className='w-100 pt-4' style={{ paddingBottom: '200px' }}>
                            <Col sm={8} className='ps-4'>
                                <div className='d-flex'>
                                    <p className='font-14 mb-0' style={{ color: '#1D2939' }}>Bank name:</p>
                                    <p className='font-14 mb-0 ms-5 ps-0' style={{ fontWeight: '500', color: '#1D2939' }}>{invoice?.organization?.bank_name || "-"}</p>
                                </div>
                                <div className='d-flex'>
                                    <p className='font-14 mb-0' style={{ color: '#1D2939' }}>Account name:</p>
                                    <p className='font-14 mb-0 ms-4 ps-1' style={{ fontWeight: '500', color: '#1D2939' }}>{invoice?.organization?.account_name || "-"}</p>
                                </div>
                                <div className='d-flex'>
                                    <p className='font-14 mb-0' style={{ color: '#1D2939' }}>Account number:</p>
                                    <p className='font-14 mb-0 ms-2 ps-1' style={{ fontWeight: '500', color: '#1D2939' }}>{invoice?.organization?.account_number || "-"}</p>
                                </div>
                                <div className='d-flex'>
                                    <p className='font-14 mb-0' style={{ color: '#1D2939' }}>BSN number:</p>
                                    <p className='font-14 mb-0 ms-4 ps-3' style={{ fontWeight: '500', color: '#1D2939' }}>{invoice?.organization?.bsb || "-"}</p>
                                </div>

                                <div className={style.qupteMainColFooter} style={{ marginTop: '32px' }}>
                                    <h2>Note</h2>
                                    <p>{invoice?.note}</p>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div className='border-bottom py-2 w-100 d-flex justify-content-between'>
                                    <div style={{ fontSize: '14px', color: '#1D2939' }}>Subtotal</div>
                                    <div style={{ fontSize: '18px', color: '#1D2939' }}>${invoice?.subtotal}</div>
                                </div>
                                <div className='border-bottom py-2 w-100 d-flex justify-content-between'>
                                    <div style={{ fontSize: '14px', }}>Tax (10%)</div>
                                    <div style={{ fontSize: '18px', }}>${invoice?.gst}</div>
                                </div>
                                <div className='border-bottom py-2 w-100 d-flex justify-content-between'>
                                    <div style={{ fontSize: '14px', }}>Deposit</div>
                                    <div style={{ fontSize: '18px', }}>${invoice?.deposit}</div>
                                </div>
                                <div className='border-bottom py-2 w-100 d-flex justify-content-between'>
                                    <div style={{ fontSize: '14px', }}>Total</div>
                                    <div style={{ fontSize: '18px' }}>${invoice?.total}</div>
                                </div>
                                <div className='py-2 w-100 d-flex justify-content-between'>
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>Amount due</div>
                                    <div style={{ fontSize: '18px', fontWeight: 600 }}>${invoice?.total}</div>
                                </div>
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
                    </div>
                    <div className={style.logoWrapperFooter}>
                        <p><span>Powered by</span><img src="https://dev.memate.com.au/static/media/logo.ffcbd441341cd06abd1f3477ebf7a12a.svg" alt='Logo' /></p>
                    </div>
                </div>

                {
                    (invoice?.pay_status === 'not paid') && <div className={style.quotationfooter}>
                        <div className={style.contanerfooter}>
                            <div className={style.left}>
                                <button
                                    className={"outline-button"}
                                    onClick={handleDecline}
                                    disabled={actionLoading.decline}
                                >
                                    {actionLoading.decline ? 'Declining...' : 'Save PDF'}
                                    <FilePdf size={20} color='#344054' className='ms-1' />
                                </button>
                            </div>
                            <div className={clsx(style.right, 'd-flex align-items-center')}>
                                <div>
                                    <p className='mb-0' style={{ fontSize: '24px', fontWeight: 600, color: '#1A1C21' }}>${invoice?.total}</p>
                                    <p className='mb-0' style={{ fontSize: '16px', fontWeight: 500, color: '#FFB258' }}>{invoice?.overdue || 0} Days Overdue</p>
                                </div>
                                <button
                                    className={style.accept}
                                    onClick={() => { }}
                                    disabled={actionLoading.accept}
                                    style={{ height: '48px' }}
                                >
                                    {actionLoading.accept ? 'Loading...' : 'Pay this invoice'}
                                </button>
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
                className={`${style.modal} custom-modal custom-scroll-integration `}
                onHide={handleClose}
            >
                <div className="d-flex flex-column">
                    <form >
                        <div className={style.formWrapNote}>
                            <div className="formgroup mb-2 mt-2">
                                <label>Note </label>
                                <div className={`${style.inputInfo} ${errors.description ? 'error-border' : ''}`}>
                                    <textarea
                                        type="text"
                                        name="Enter a description..."
                                        value={updateDis}
                                        placeholder='Enter a description...'
                                        onChange={(e) => {
                                            setUpdateDis(e.target.value);
                                        }}
                                    />
                                </div>
                                {errors.description && <p className="error-message">{errors.description}</p>}
                            </div>
                        </div>
                    </form>
                </div>
            </Dialog>
        </>
    )
}

export default PublicInvoice