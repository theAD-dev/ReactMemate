import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import style from './quote.module.scss';
import { emailQuoteationApi, emailDeclineApi, emailAcceptApi, emailChangesApi } from "../../../APIs/quoteation-api";
import { Placeholder } from "react-bootstrap";
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { useLocation } from 'react-router-dom';
import Button from "react-bootstrap/Button";
import { Dialog } from "primereact/dialog";
import googleReview from "../../../assets/images/icon/checbold.svg";

const QuotationEmail = () => {
    const [quote, setQuote] = useState();  
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const [updateDis, setUpdateDis] = useState('');
    const [errors, setErrors] = useState({});
    const [lastId, setLastId] = useState('');
    console.log('lastId: ', lastId);
    const [actionLoading, setActionLoading] = useState({ decline: false, changes: false, accept: false });
    console.log('actionLoading: ', actionLoading);
    const [visible, setVisible] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await emailQuoteationApi(lastId);
            setQuote(data);  
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // const pathname1 = 'https://dev.memate.com.au/quote/view/6a3e12db-4050-4f58-b8e9-8326e310b758';
        // const pathArray = pathname1.split('/');
              const pathArray = location.pathname.split('/');
      
        const lastSegment = pathArray[pathArray.length - 1];  
        setLastId(lastSegment);
    }, [location]);

    const handleDecline = async () => {
        try {
            setActionLoading(prev => ({ ...prev, decline: true }));
            await emailDeclineApi(lastId);
            alert("Quotation declined successfully.");
        } catch (error) {
            console.error('Error declining quotation: ', error);
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
            await emailChangesApi(lastId, { note: updateDis });
            alert("Requested changes successfully.");
            setVisible(false);
        } catch (error) {
            console.error('Error requesting changes: ', error);
        } finally {
            setActionLoading(prev => ({ ...prev, changes: false }));
        }
    };

    const handleAccept = async () => {
        try {
            setActionLoading(prev => ({ ...prev, accept: true }));
            await emailAcceptApi(lastId);
            alert("Quotation accepted successfully.");
        } catch (error) {
            console.error('Error accepting quotation: ', error);
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
            <h2>{rowData?.index}</h2>
            <ul>
                <p>{rowData?.description}</p>
                <li>{rowData?.subindex}</li>
            </ul>
        </div>
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
                <Column colSpan={5} footer="Subtotal" className={style.footerBoldTextLight} footerStyle={{ textAlign: 'right' }} />
                <Column footer={quote?.subtotal} className={style.footerBoldTextLight} />
            </Row>
            <Row>
                <Column colSpan={5} footer="GST (10%)" className={style.footerBoldTextLight} footerStyle={{ textAlign: 'right' }} />
                <Column footer={quote?.gst} className={style.footerBoldTextLight} />
            </Row>
            <Row>
                <Column colSpan={5} footer="Total" className={style.footerBoldText} footerStyle={{ textAlign: 'right' }} />
                <Column footer={quote?.total} className={style.footerBoldText} />
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

    return (
        <>
            {isLoading ? (
                <Placeholder as="p" animation="wave" style={{ marginBottom: '10px', marginTop: '5px' }}>
                    <Placeholder bg="secondary" size='md' style={{ width: '100%' }} />
                </Placeholder>
            ) : (
                <>
                    <div className={style.quotationWrapperPage}>
                        <div className={style.quotationScroll}>
                            <div className={style.quotationWrapper}>
                                <div className={style.quotationHead}>
                                    <div className={style.left}>
                                        <h1>Quotation</h1>
                                        <p><span>{quote?.number}</span></p>
                                    </div>
                                    <div className={style.right}>
                                        <img src="https://dev.memate.com.au/static/media/logo.ffcbd441341cd06abd1f3477ebf7a12a.svg" alt='Logo' />
                                    </div>
                                </div>

                                <div className={style.quotationRefress}>
                                    <div className={style.left}>
                                        <p>Date of issue: <span>{formatDate(quote?.due_date)}</span></p>
                                    </div>
                                    <div className={style.right}>
                                        <p>Reference</p>
                                        <p><strong>{quote?.reference}</strong></p>
                                    </div>
                                </div>

                                <div className={style.quotationAddress}>
                                    <div className={style.left}>
                                        <p>From:</p>
                                        <ul>
                                            <li><strong>{quote?.organization.account_name}</strong></li>
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
                                        <Column body={CounterBody} header="#" style={{ width: '36px', verticalAlign: 'top', paddingTop: '15px', fontSize: '17.21px' }} />
                                        <Column field="index" body={ServicesBody} header="Services" style={{ width: '400px' }} />
                                        <Column field="quantity" header="Qty/Hours" style={{ width: '174px', textAlign: 'right', color: '#667085' }} headerClassName='headerRightAligh' />
                                        <Column field="unit_price" header="Price" style={{ width: '130px', textAlign: 'right' }} headerClassName='headerRightAligh' />
                                        <Column field="discount" header="Discount" style={{ width: '120px', color: '#667085', textAlign: 'right' }} headerClassName='headerRightAligh' />
                                        <Column field="total" header="Total" style={{ width: '66px', textAlign: 'right' }} headerClassName='headerRightAligh' />
                                    </DataTable>
                                </div>

                                <div className={style.logoWrapperFooter}>
                                    <p><span>Powered by</span><img src="https://dev.memate.com.au/static/media/logo.ffcbd441341cd06abd1f3477ebf7a12a.svg" alt='Logo' /></p>
                                </div>
                            </div>
                        </div>

                        <div className={style.quotationfooter}>
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
                                        // onClick={handleRequestChanges}
                                        onClick={() => { setVisible(true)}}
                                        // disabled={actionLoading.changes}
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
                    </div>
                </>
            )}
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
