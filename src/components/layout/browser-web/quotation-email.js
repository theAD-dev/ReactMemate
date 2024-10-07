
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import style from './quote.module.scss';
import { emailQuoteationApi } from "../../../APIs/quoteation-api";
import { Placeholder } from "react-bootstrap";

export const ProductService = {
    getProductsData() {
        return [
            {
                id: '1000',
                code: 'f230fh0g3',
                name: 'Bamboo Watch',
                description: 'Product Description',
                image: 'bamboo-watch.jpg',
                price: 65,
                category: 'Accessories',
                quantity: 24,
                inventoryStatus: 'INSTOCK',
                rating: 5
            },
           
        ];
    },



    getProductsMini() {
        return Promise.resolve(this.getProductsData().slice(0, 5));
    },

    getProductsSmall() {
        return Promise.resolve(this.getProductsData().slice(0, 10));
    },

    getProducts() {
        return Promise.resolve(this.getProductsData());
    },

    getProductsWithOrdersSmall() {
        return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
    },

    getProductsWithOrders() {
        return Promise.resolve(this.getProductsWithOrdersData());
    }
};


const QuotationEmail = () => {
    const [quote, setQuote] = useState('');
    console.log('quote: ', quote);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data = await emailQuoteationApi();
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


    const [products, setProducts] = useState([]);

    useEffect(() => {
        ProductService.getProductsMini().then(data => setProducts(data));
    }, []);


  return (
    <>
     {isLoading ? (
                                          <Placeholder as="p" animation="wave" style={{ marginBottom: '10px', marginTop: '5px' }}>
                                          <Placeholder bg="secondary" size='md' style={{ width: '100%' }} />
                                        </Placeholder>
                                   
                                    ):(
                                      <>
                              <div className={style.quotationWrapperPage}>
                              <div className={style.quotationWrapper}>
                              <div className={style.quotationHead}>
                                <div className={style.left}>
                               <h1>Quotation</h1>
                               <p><span>24000987-01</span></p>
                                </div>
                                <div className={style.right}>
                               <img src="https://dev.memate.com.au/static/media/logo.ffcbd441341cd06abd1f3477ebf7a12a.svg" alt='Logo'/>
                                </div>
                              </div>

                              <div className={style.quotationRefress}>
                                <div className={style.left}>
                               <p>Date of issue: <span>April 1, 2024</span></p>
                                </div>
                                <div className={style.right}>
                              <p>Refference</p>
                              <p><strong>[ Project Reference Must Be One Line</strong></p>
                                </div>
                              </div>
                              <div className={style.quotationAddress}>
                                <div className={style.left}>
                               <p>From:</p>
                               <ul>
                                <li><strong>TheAd Pty Ltd</strong></li>
                                <li>ABN: 55637265984</li>
                                <li>SE9 89-97 Jones St Ultimo NSW 2007 </li>
                                <li>+61-0-280802100</li>
                                <li>info@thead.com.au</li>
                               </ul>
                               
                                </div>
                                <div className={style.right}>
                              <p>To:</p>
                              <ul>
                                <li><strong>Company Name</strong></li>
                                <li>Company address</li>
                                <li>City, Country - 00000</li>
                                <li>+0 (000) 123-4567</li>
                               
                               </ul>
                                </div>
                              </div>
                              </div>
                              <div className={style.quotationtable}>
                              <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
                <Column field="Services" header="Code" sortable style={{ width: '25%' }}></Column>
                <Column field="name" header="Name" sortable style={{ width: '25%' }}></Column>
                <Column field="category" header="Category" sortable style={{ width: '25%' }}></Column>
                <Column field="quantity" header="Quantity" sortable style={{ width: '25%' }}></Column>
            </DataTable>

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
                                      </>
                                    )}
 
    </>
  );
};

export default QuotationEmail;
