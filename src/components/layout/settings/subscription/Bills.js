import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Sidebar from './../Sidebar';
import { FilePdf,CreditCard2Front} from "react-bootstrap-icons";


const Bills = () => {
    const [activeTab, setActiveTab] = useState('subscription');
    const [data, setData] = useState([
        { id: 1, col1: 'ELT-230064-1', col2: '20 Nov 2023', col3: 'Mobile App Users', col4: '$ 5,594.31', col5: '$1,074.55', col6: 'Complete', col7: '****1008', col8: 'PDF' },
        { id: 2, col1: 'ELT-230064-1', col2: '20 Nov 2023', col3: 'Company Users', col4: '$ 5,594.31', col5: '$1,074.55', col6: 'Complete', col7: '****1008', col8: 'PDF' },
        { id: 3, col1: 'ELT-230064-1', col2: '20 Nov 2023', col3: 'Work Subscription ', col4: '$ 5,594.31', col5: '$1,074.55', col6: 'Complete', col7: '****1008', col8: 'PDF' },
        { id: 4, col1: 'ELT-230064-1', col2: '20 Nov 2023', col3: 'Locations', col4: '$ 5,594.31', col5: '$1,074.55', col6: 'Complete', col7: '****1008', col8: 'PDF' },
        { id: 5, col1: 'ELT-230064-1', col2: '20 Nov 2023', col3: 'Locations', col4: '$ 5,594.31', col5: '$1,074.55', col6: 'Complete', col7: '****1008', col8: 'PDF' },
        { id: 6, col1: 'ELT-230064-1', col2: '20 Nov 2023', col3: 'Mobile App Users', col4: '$ 5,594.31', col5: '$1,074.55', col6: 'Complete', col7: '****1008', col8: 'PDF' },
      ]);
    
      // Pagination state
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 5; // Change this as needed
    
      // Logic to calculate current items
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    

        // Total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
        <div className='settings-wrap billsPage'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="settings-content">
                <div className='headSticky'>
                <h1>Subscription</h1>
                <div className='contentMenuTab'>
                    <ul>
                        <li><Link to="/settings/generalinformation/subscription">Subscription</Link></li>
                        <li><Link to="/settings/generalinformation/billing-info">Billing Info</Link></li>
                        <li className='menuActive'><Link to="/settings/generalinformation/bills">Bills</Link></li>
                    </ul>
                </div>
                </div>
                <div className={`content_wrap_main`}>
                <div className='content_wrapper'>
                    <div className="subscriptionBill">
                    <div className="topHeadStyle">
                        <div className=''>
                        <h2>Bills</h2>
                        </div>
                    </div>
                    <table className="table">
        <thead>
          <tr>
            <th style={{ width: '193px' }}>Sale ID</th>
            <th style={{ width: '193px' }}>Date</th>
            <th>Product</th>
            <th style={{ width: '110px' }}>Transaction</th>
            <th style={{ width: '111px' }}>Tax Amount</th>
            <th style={{ width: '104px' }}>Status</th>
            <th style={{ width: '128px' }}>Method </th>
            <th style={{ width: '69px' }}>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              {/* <td>{item.id}</td> */}
              <td>{item.col1}</td>
              <td>{item.col2}</td>
              <td>{item.col3}</td>
              <td>{item.col4}</td>
              <td>{item.col5}</td>
              <td className='billsStatus'><span>{item.col6}</span></td>
              <td style={{ color:'#344054' }}><div className='CreditCard2FrontIcon'><span><CreditCard2Front color="#667085" size={20} /></span>{item.col7}</div></td>
              <td className='textCenter'><FilePdf color="#FF0000" size={16} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    <div className='bottomPagenation'>
      <nav>
      <ul className="pagination">
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
    <button
      onClick={() => paginate(currentPage - 1)}
      className="page-link"
    >
      Previous
    </button>
  </li>
  <li className={`page-item ${currentPage === Math.ceil(data.length / itemsPerPage) ? 'disabled' : ''}`}>
    <button
      onClick={() => paginate(currentPage + 1)}
      className="page-link"
    >
      Next
    </button>
  </li>
</ul>

      </nav>
      <div className='countpage'>
          <p>Page {currentPage} of {totalPages}</p>
        </div>
        </div>
            </div>
                </div>
            </div>
            </div>   
        </div>
       
        </div>
         
        </>
    );
}

export default Bills;
