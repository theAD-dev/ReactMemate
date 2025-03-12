import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { getQuoteation, quotationDecline, quotationAccept, quotationChanges } from "../../../APIs/quoteation-api";
import googleReview from "../../../assets/images/icon/checbold.svg";
import { formatAUD } from '../../../shared/lib/format-aud';


const QuotationEmail = () => {
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
        <ColumnGroup>
            <Row>
                <Column colSpan={4} />
                <Column footer="Subtotal" className={`${style.footerBoldTextLight} ${style.footerBorder}`} footerStyle={{ textAlign: 'right' }} />
                <Column footer={`\$${formatAUD(quote?.subtotal)}`} className={`${style.footerBoldTextLight} ${style.footerBoldTextLight1} ${style.footerBorder}`} />
            </Row>
            <Row>
                <Column colSpan={4} />
                <Column footer="GST (10%)" className={`${style.footerBoldTextLight} ${style.footerBorder}`} footerStyle={{ textAlign: 'right' }} />
                <Column footer={`\$${formatAUD(quote?.gst)}`} className={`${style.footerBoldTextLight} ${style.footerBoldTextLight1} ${style.footerBorder}`} />
            </Row>
            <Row>
                <Column colSpan={4} />
                <Column footer="Total" className={`${style.footerBoldText} ${style.footerBorder}`} footerStyle={{ textAlign: 'right' }} />
                <Column footer={`\$${formatAUD(quote?.total)}`} className={`${style.footerBoldText} ${style.footerBoldTextLight1} ${style.footerBorder}`} />
            </Row>
            <Row>
                <Column
                    footer={(
                        <div className={style.qupteMainColFooter}>
                            <h2>Note</h2>
                            <p>{quote?.note}</p>
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
                            <div className={style.left}>
                                <h1>Quotation</h1>
                                <p className='mb-2 mt-2'> {isLoading ? <Skeleton width="6rem" height='27px' className="mb-2 rounded"></Skeleton> : <span>{quote?.number}</span>} </p>
                            </div>
                            <div className={style.right}>
                                {
                                    quote?.organization?.logo && <img src={`${process.env.REACT_APP_URL}${quote?.organization?.logo}`} alt='Logo' style={{ width: '100px' }} />
                                }
                            </div>
                        </div>

                        <div className={style.quotationRefress}>
                            <div className={style.left}>
                                <p className='d-flex gap-2 align-items-center'>Date of issue:
                                    {isLoading ? <Skeleton width="6rem" height='12px' className='mb-0 rounded'></Skeleton> : <span>{formatDate(quote?.due_date)}</span>}
                                </p>
                            </div>
                            <div className={style.right}>
                                <p>Reference</p>
                                {isLoading ? <Skeleton width="6rem" height='13px' className='mb-0 mt-1 rounded'></Skeleton> : <p><strong>{quote?.reference}</strong></p>}

                                <p className='mt-4'>PO:</p>
                                {isLoading ? <Skeleton width="6rem" height='13px' className='mb-0 mt-1 rounded'></Skeleton> : <p><strong>{quote?.purchase_order || "-"}</strong></p>}
                            </div>
                        </div>

                        <div className={style.quotationAddress}>
                            <div className={style.left}>
                                <p>From:</p>
                                <ul>
                                    <li>
                                        {isLoading ? <Skeleton width="10rem" height='15px' className='rounded'></Skeleton> : <strong>{quote?.organization.account_name}</strong>}
                                    </li>
                                    <li>ABN:{quote?.organization.abn}</li>
                                    <li>Address:{quote?.organization.address}</li>
                                    <li>Phone:{quote?.organization.phone}</li>
                                    <li>Email:{quote?.organization.email}</li>
                                </ul>
                            </div>
                            <div className={style.right}>
                                <p>To:</p>
                                <ul>
                                    <li><strong>{quote?.client.name}</strong></li>
                                    <li>{quote?.client.email}</li>
                                    <li>{quote?.client.phone}</li>
                                </ul>
                            </div>
                        </div>

                        <div className={style.quotationtable}>
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
                        <p><span>Powered by</span><img src="https://dev.memate.com.au/static/media/logo.ffcbd441341cd06abd1f3477ebf7a12a.svg" alt='Logo' /></p>
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

export default QuotationEmail;
