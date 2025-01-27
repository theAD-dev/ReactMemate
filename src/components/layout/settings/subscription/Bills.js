import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Sidebar from './../Sidebar';
import { FilePdf, CreditCard2Front } from "react-bootstrap-icons";
import { useQuery } from '@tanstack/react-query';
import { getSubscriptionsBills } from '../../../../APIs/settings-subscription-api';
import { Spinner } from 'react-bootstrap';

const Bills = () => {
  const [activeTab, setActiveTab] = useState('subscription');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const offset = (currentPage - 1) * itemsPerPage;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['bills', itemsPerPage, offset],
    queryFn: () => getSubscriptionsBills({ limit: itemsPerPage, offset }),
    keepPreviousData: true,
  });

  useEffect(() => {
    refetch();
  }, [currentPage]);

  const { results = [], count } = data || {};
  const totalPages = Math.ceil(count / itemsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="settings-wrap billsPage">
      <div className="settings-wrapper">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="settings-content ps-0">
          <div className="headSticky ps-4">
            <h1>Subscription</h1>
            <div className="contentMenuTab">
              <ul>
                <li><Link to="/settings/generalinformation/subscription">Subscription</Link></li>
                <li><Link to="/settings/generalinformation/billing-info">Billing Info</Link></li>
                <li className="menuActive"><Link to="/settings/generalinformation/bills">Bills</Link></li>
              </ul>
            </div>
          </div>
          <div className="content_wrap_main bg-grey p-4">
            <div className="content_wrapper">
              <div className="subscriptionBill">
                <div className="topHeadStyle">
                  <h2>Bills</h2>
                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sale ID</th>
                      <th>Date</th>
                      <th>Product</th>
                      <th>Transaction</th>
                      <th>Tax Amount</th>
                      <th>Status</th>
                      <th>Method</th>
                      <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length > 0 ? (
                      results.map((bill) => (
                        <tr key={bill.id}>
                          <td>{bill.id}</td>
                          <td>{new Date(bill.period_start).toLocaleDateString()}</td>
                          <td>{bill.price.product_name}</td>
                          <td>{bill.price.amount} {bill.price.currency}</td>
                          <td>{bill.price.tax || '-'}</td>
                          <td className="billsStatus">
                            <span>{bill.status === 'p' ? 'Pending' : 'Complete'}</span>
                          </td>
                          <td style={{ color: '#344054' }}>
                            <div className="CreditCard2FrontIcon">
                              <span><CreditCard2Front color="#667085" size={20} /></span>
                              {bill.payment_method}
                            </div>
                          </td>
                          <td className="textCenter">
                            <a href={bill.invoice} target="_blank" rel="noopener noreferrer">
                              <FilePdf color="#FF0000" size={16} />
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center"><p className='mt-3'>No data available</p></td>
                      </tr>
                    )}
                  </tbody>

                </table>
                <div className="bottomPagenation">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          className="page-link"
                          style={{ borderRadius: '20px' }}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          className="page-link"
                          style={{ borderRadius: '20px' }}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                  <div className="countpage">
                    <p>Page {currentPage} of {totalPages}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        isLoading && <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      }
    </div>
  );
};

export default Bills;
