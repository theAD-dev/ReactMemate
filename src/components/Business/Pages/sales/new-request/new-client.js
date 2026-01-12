import React, { useState, useEffect } from 'react';
import { People, InfoSquare, ChevronLeft, Building, CardList, Person, FileText } from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router-dom";

const NewClient = () => {
  const navigate = useNavigate();
  const [enquiryData, setEnquiryData] = useState(null);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('enquiry-to-sale');
      if (storedData) {
        setEnquiryData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Failed to parse enquiry data from sessionStorage', error);
    }
  }, []);

  const handleClearEnquiryData = () => {
    sessionStorage.removeItem('enquiry-to-sale');
    setEnquiryData(null);
  };

  const handleGoBack = () => {
    sessionStorage.removeItem('enquiry-to-sale');
    navigate('/sales/newquote/selectyourclient');
  };

  return (
    <div className="newQuotePage existingClients borderSkyColor">
      <div className="dFlex">
        <div className="newQuoteBack">
          <button onClick={handleGoBack}>
            <ChevronLeft color="#000000" size={20} /> &nbsp;&nbsp;Go Back
          </button>
        </div>
        <div className="newQuoteContent">
          <div className='navStepClient'>
            <ul>
              <li className='activeClientTab'><span><Person color="#D0D5DD" size={15} /></span> <p>Choose Client</p></li>
              <li className='deactiveColorBox'><span><InfoSquare color="#D0D5DD" size={15} /></span> <p>Client Information</p> </li>
              <li className='deactiveColorBox'><span><CardList color="#D0D5DD" size={15} /></span> <p>Scope of Work</p> </li>
            </ul>
          </div>

          {enquiryData && (
            <div className="formgroupWrap mt-3" style={{ 
              background: '#F0F9FF', 
              border: '1px solid #B9E6FE', 
              borderRadius: '8px', 
              padding: '16px',
              marginBottom: '8px'
            }}>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <FileText size={20} color="#0EA5E9" />
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0C4A6E', textAlign: 'left' }}>
                      Creating from Enquiry
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#0369A1', textAlign: 'left' }}>
                      {enquiryData.name && `Name: ${enquiryData.name}`}
                      {enquiryData.email && ` • Email: ${enquiryData.email}`}
                      {enquiryData.phone && ` • Phone: ${enquiryData.phone}`}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleClearEnquiryData}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: '#0369A1', 
                    fontSize: '12px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="formgroupWrap clstep01">
            <ul className='mt-4'>
              <li>
                <NavLink className="" to="/sales/newquote/selectyourclient/business-client"><span><Building color="#667085" size={24} /></span> Business Client</NavLink>
              </li>
              <li>
                <NavLink className="" to="/sales/newquote/selectyourclient/individual-client"><span><People color="#667085" size={24} /></span> Individual Client</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NewClient;