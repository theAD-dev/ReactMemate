import React, { useState, useEffect } from 'react';
import { FilePdf } from 'react-bootstrap-icons';
import { Link, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';
import { Dialog } from "primereact/dialog";
import { Row } from 'primereact/row';
import { Skeleton } from 'primereact/skeleton';
import Button from "react-bootstrap/Button";
import { toast } from 'sonner';
import style from './quote.module.scss';
import { getQuoteation, quotationDecline, quotationAccept, quotationChanges } from "../../../../../APIs/quoteation-api";
import googleReview from "../../../../../assets/images/icon/checbold.svg";
import { formatAUD } from '../../../../../shared/lib/format-aud';

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

const Quotation = () => {
    const { id } = useParams();
    const [quote, setQuote] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [updateDis, setUpdateDis] = useState('');
    const [errors, setErrors] = useState({});
    const [actionLoading, setActionLoading] = useState({ decline: false, changes: false, accept: false });
    const [visible, setVisible] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await getQuoteation(id);
            setQuote(data);
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
            await quotationChanges(id, { changes: updateDis });
            toast.success("Quotation changes request has been sent");
            setVisible(false);
            fetchData();
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
        <>{rowData?.discount}%</>
    );

    const TotalBody = (rowData) => (
        <>${formatAUD(rowData?.total)} </>
    );

    const handleClose = () => {
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
        <ColumnGroup className="pe-4">
            <Row>
                <Column colSpan={4} style={{ position: 'relative' }} footer={
                    <div className='pe-4' style={{ position: 'absolute' }}>
                        <b>Note:</b>
                        <p className='mt-1' style={{ whiteSpace: 'pre-line' }}>{quote?.note}</p>
                    </div>
                } />
                <Column footer="Subtotal" className={`${style.footerBoldTextLight} ${style.footerBorder}`} footerStyle={{ textAlign: 'right' }} />
                <Column footer={`\$${formatAUD(quote?.subtotal)}`} className={`${style.footerBoldTextLight} ${style.footerBoldTextLight1} ${style.footerBorder}`} />
            </Row>
            <Row>
                <Column colSpan={4} />
                <Column footer="Tax" className={`${style.footerBoldTextLight} ${style.footerBorder}`} footerStyle={{ textAlign: 'right' }} />
                <Column footer={`\$${formatAUD(quote?.gst)}`} className={`${style.footerBoldTextLight} ${style.footerBoldTextLight1} ${style.footerBorder}`} />
            </Row>
            <Row>
                <Column colSpan={4} />
                <Column footer="Total" className={`${style.footerBoldText} ${style.footerBorder}`} footerStyle={{ textAlign: 'right' }} />
                <Column footer={`\$${formatAUD(quote?.total)}`} className={`${style.footerBoldText} ${style.footerBorder}`} />
            </Row>
        </ColumnGroup>
    );

    const projectStatus = {
        'Accepted': 'Accepted',
        'Declined': 'Declined',
        'Review': 'Under Review',
        'Completed': 'Project Completed'
    };
    return (
        <>
            <div className={style.quotationWrapperPage}>
                <div className={style.quotationScroll}>
                    {
                        (quote?.status !== "Sent" && quote?.status !== "Saved") && <div className={clsx(style.topCaption, style.text, style[quote?.status])}>
                            {projectStatus[quote?.status] ? projectStatus[quote?.status] : quote?.status}
                        </div>
                    }

                    <div className={clsx(style.quotationWrapper, style[quote?.status])}>
                        <div className={style.quotationHead}>
                            <div className={style.left} style={{ width: '50%' }}>
                                <div className='d-flex align-items-center gap-3'>
                                    <div className='logo-section'>
                                        {
                                            quote?.organization?.logo &&
                                            <img src={`${process.env.REACT_APP_URL}${quote?.organization?.logo}`} alt='Logo' style={{ maxWidth: '150px', maxHeight: '100px' }} />
                                        }
                                    </div>
                                    <div className='title-sections'>
                                        <h1>Quotation</h1>
                                        <p className={clsx(style.invoiceNumber, 'mb-2 mt-2')}> {isLoading ? <Skeleton width="6rem" height='27px' className="mb-2 rounded"></Skeleton> : <span>{quote?.number}</span>} </p>
                                    </div>
                                </div>
                            </div>
                            <div className={style.right} style={{ width: '50%' }}>
                                <div className={style.quotationRefress}>
                                    <div className={style.left}>
                                        <p className='d-flex gap-2 align-items-center text-nowrap'>Date of issue:
                                            {isLoading ? <Skeleton width="6rem" height='12px' className='mb-0 rounded'></Skeleton> : <span>{formatTimeStamp(quote?.date)}</span>}
                                        </p>
                                        <p className='d-flex gap-2 align-items-center text-nowrap'>Date due:
                                            {isLoading ? <Skeleton width="6rem" height='12px' className='mb-0 rounded'></Skeleton> : <span>{formatDate(quote?.due_date)}</span>}
                                        </p>
                                    </div>
                                    <div className={style.right}>
                                        {quote?.purchase_order && <p>PO: </p>}
                                        {isLoading ? <Skeleton width="6rem" height='13px' className='mb-0 mt-1 rounded'></Skeleton> : <p><strong>{quote?.purchase_order}</strong></p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ border: "1px solid #dedede", width: '100%' }}></div>

                        <div className={style.quotationAddress}>
                            <div className={style.left}>
                                <p style={{ textDecoration: "underline" }}>To</p>
                                <ul>
                                    {isLoading ?
                                        <>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                            <Skeleton width="10rem" height='15px' className='rounded mb-1'></Skeleton>
                                        </>
                                        :
                                        <>
                                            {quote?.client.name && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    <strong style={{ lineHeight: '16px' }}>{quote.client.name}</strong>
                                                </li>
                                            )}
                                            {quote?.client.abn && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    ABN: {quote.client.abn}
                                                </li>
                                            )}
                                            {quote?.client?.addresses[0]?.address && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {quote.client.addresses[0].address}
                                                </li>
                                            )}
                                            {quote?.client?.addresses[0]?.city && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {quote.client.addresses[0].city}
                                                </li>
                                            )}
                                            {quote?.client?.addresses[0]?.state && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {quote.client.addresses[0].state}
                                                </li>
                                            )}
                                            {quote?.client?.addresses[0]?.country && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {quote.client.addresses[0].country}
                                                </li>
                                            )}
                                            {quote?.client?.addresses[0]?.postcode && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {quote.client.addresses[0].postcode}
                                                </li>
                                            )}
                                            {quote?.client.phone && (
                                                <li style={{ lineHeight: '16px' }}>
                                                    {quote.client.phone}
                                                </li>
                                            )}
                                        </>
                                    }
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
                                        quote?.organization.account_name && (
                                            <li style={{ lineHeight: '16px' }}>
                                                <strong style={{ lineHeight: '16px' }}>{quote.organization.account_name}</strong>
                                            </li>
                                        )
                                    )}
                                    {quote?.organization.abn && (
                                        <li style={{ lineHeight: '18px' }}>
                                            ABN: {quote.organization.abn}
                                        </li>
                                    )}
                                    {quote?.organization.address && (
                                        <li style={{ lineHeight: '18px' }}>
                                            {quote.organization.address}
                                        </li>
                                    )}
                                    {quote?.organization.phone && (
                                        <li style={{ lineHeight: '18px' }}>
                                            {quote.organization.phone}
                                        </li>
                                    )}
                                    {quote?.organization.email && (
                                        <li style={{ lineHeight: '18px' }}>
                                            {quote.organization.email}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className='my-3' style={{ border: "1px solid #dedede", width: '100%' }}></div>

                        <div className={style.quotationRefress}>
                            <p>Reference: {isLoading ? <Skeleton width="6rem" height='13px' className='mb-0 rounded'></Skeleton> : <span><strong>{quote?.reference}</strong></span>}</p>
                        </div>

                        <div className={clsx(style.quotationtable, 'quotationtable')}>
                            <DataTable value={quote?.calculations} footerColumnGroup={footerGroup} className={style.quoteWrapTable}>
                                <Column body={CounterBody} header="#" style={{ width: '36px', verticalAlign: 'top', paddingTop: '15px', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} />
                                <Column field="index" body={ServicesBody} header="Services" style={{ width: '456px' }} />
                                <Column field="quantity" header="Qty/Hours" style={{ width: '174px', textAlign: 'right', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} headerClassName='headerRightAligh' />
                                <Column field="unit_price" body={unitPriceBody} header="Price" style={{ width: '130px', textAlign: 'right', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} headerClassName='headerRightAligh' />
                                <Column field="discount" body={discountBody} header="Discount" style={{ width: '120px', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px', textAlign: 'right' }} headerClassName='headerRightAligh' />
                                <Column field="total" body={TotalBody} header="Total" style={{ width: '66px', textAlign: 'right', fontSize: '16px', lineHeight: '36px', color: '#344054', fontWeight: '400', letterSpacing: '0.16px' }} headerClassName='headerRightAligh' />
                            </DataTable>
                        </div>


                    </div>
                    <div className={style.logoWrapperFooter}>
                        <p><span>Powered by</span><img src="/logo.svg" alt='Logo' /></p>
                    </div>
                </div>

                {
                    (quote?.status === 'Sent' || quote?.status === 'Saved') && <div className={style.quotationfooter}>
                        <div className={style.contanerfooter}>
                            <div className={style.left}>
                                <button
                                    className={style.decline}
                                    onClick={handleDecline}
                                    disabled={actionLoading.decline}
                                >
                                    {actionLoading.decline ? 'Declining...' : 'Decline'}
                                </button>
                            </div>
                            <div className={style.right}>
                                <Link to={`${process.env.REACT_APP_URL}${quote?.quote_url}`} target='_blank'><button className='me-3'>Save PDF <FilePdf size={20} color='#344054' className='ms-1' /></button></Link>
                                <button
                                    onClick={() => { setVisible(true); }}
                                >
                                    {actionLoading.changes ? 'Requesting changes...' : 'Request changes'}
                                </button>
                                <button
                                    className={style.accept}
                                    onClick={handleAccept}
                                    disabled={actionLoading.accept}
                                >
                                    {actionLoading.accept ? 'Accepting...' : 'Accept'}
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
    );
};

export default Quotation;
