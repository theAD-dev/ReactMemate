import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import style from './quote.module.scss';
import { emailQuoteationApi } from "../../../APIs/quoteation-api";
import { Placeholder } from "react-bootstrap";
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { useLocation } from 'react-router-dom';

const QuotationEmail = () => {
    const [quote, setQuote] = useState();  
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const [lastId, setLastId] = useState('');
    console.log('lastId: ', lastId);

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
        //const pathname1 = 'https://dev.memate.com.au/quote/view/f4f511e3-e923-468e-a40c-910dbfaf610a';
         const pathArray = location.pathname.split('/');

        console.log('array'+pathArray.length);
        const lastSegment = pathArray[pathArray.length - 1];  
        setLastId(lastSegment);
    }, [location]);

    const formatDate = (isoDate) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(isoDate).toLocaleDateString('en-US', options);
  };
    
    const ServicesBody = (rowData) => {
        return (
            <div className={style.qupteMainColWrap}>
                <h2>{rowData?.index}</h2>
                <ul>
                    <p>{rowData?.description}</p>
                    <li>{rowData?.subindex}</li>
                </ul>
            </div>
        );
    }
    const noteBody = (rowData) => {
        return (
            <div className={style.qupteMainColWrap}>
                <h2>Note</h2>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
        );
    }

    const CounterBody = (rowData, { rowIndex }) => {
      return <span>{rowIndex + 1}</span>; 
  };


  const footerGroup = (
    <ColumnGroup>
        <Row>
            <Column footer="Subtotal" className={style.footerBoldTextLight} colSpan={5} footerStyle={{ textAlign: 'right' }} />
            <Column />
            <Column footer={quote?.subtotal} className={style.footerBoldTextLight}/>
        </Row>
        <Row>
            <Column footer="GST (10%)" colSpan={5} className={style.footerBoldTextLight} footerStyle={{ textAlign: 'right' }} />
            <Column />
            <Column footer={quote?.gst}  className={style.footerBoldTextLight}/>
        </Row>
        <Row>
            <Column footer="Total" colSpan={5} className={style.footerBoldText} footerStyle={{ textAlign: 'right' }} />
            <Column />
            <Column footer={quote?.total} className={style.footerBoldText}/>
        </Row>
        <Row>

      <Column
        footer={
          <div className={style.qupteMainColFooter}>
            <h2>Note</h2>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
          </div>
        }
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
                                <DataTable value={quote?.calculations} footerColumnGroup={footerGroup} className={style.quoteWrapTable} scrollable  style={{ minWidth: '50rem' }}>
                                <Column body={CounterBody} header="#" style={{ width: '36px', verticalAlign: 'top', paddingTop: '15px', fontSize: '17.21px' }} />
                                {footerGroup}
                                    <Column field="index" body={ServicesBody} header="Services" style={{ width: '392px' }}></Column>
                                    <Column field="quantity" header="Qty/Hours" style={{ width: '174px', textAlign: 'right', color: '#667085' }} headerClassName='headerRightAligh'></Column>
                                    <Column field="unit_price" header="Price" style={{ width: '130px', textAlign: 'right' }} headerClassName='headerRightAligh'></Column>
                                    <Column field="discount" header="Discount" style={{ width: '120px', color: '#667085', textAlign: 'right' }} headerClassName='headerRightAligh'></Column>
                                    <Column field="total" header="Total" style={{ width: '66px', textAlign: 'right' }} headerClassName='headerRightAligh'></Column>
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
                                    <a className={style.decline} href=''>Decline</a>
                                </div>
                                <div className={style.right}>
                                    <a href=''>Request changes</a>
                                    <a className={style.accept} href=''>Accept</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default QuotationEmail;
