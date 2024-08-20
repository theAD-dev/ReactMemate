import React, { useState } from 'react';
import { People, InfoSquare, ChevronLeft, CardList, Upload } from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ScopeofWork = () => {
  const [orderReference, setOrderReference] = useState('');
  const [orderDescription, setOrderDescription] = useState('');
  const [file, setFile] = useState(null); // State to hold the selected file
  const { id } = useParams();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleCalculation = () => {
    // Prepare the data to send
    const dataToSend = {
      id: id,
      orderReference: orderReference,
      orderDescription: orderDescription,
      file: file // Include the file in the data to send
    };

    // Navigate to the calculation page with the data
    navigate("/sales/newquote/calculation", {
      state: dataToSend
    });
  };

  return (
    <div className="newQuotePage bsdScope">
      <div className="dFlex">
        <div className='navStepsticky'>
          <div className="newQuoteBack">
            <button><NavLink to="/sales/Newquote/selectyourclient/existing-clients"><ChevronLeft color="#000000" size={20} /> Go Back</NavLink></button>
          </div>
          <div className='navStepClient'>
            <ul>
              <li><span><People color="#A3E0FF" size={15} /></span> <p>Choose Client</p></li>
              <li><span><InfoSquare color="#A3E0FF" size={15} /></span> <p>Client Information</p> </li>
              <li className='activeClientTab'><span><CardList color="#D0D5DD" size={15} /></span> <p>Scope of Work</p> </li>
            </ul>
          </div>
        </div>

        <div className="newQuoteContent">
          <div className="formgroupboxs mt-4">
            <Row className='text-left'>
              <Col sm={12}>
                <div className="formgroup mb-2 mt-3">
                  <label>Order Reference</label>
                  <div className={`inputInfo`}>
                    <input
                      type="text"
                      name="orderReference"
                      value={orderReference}
                      placeholder='Add Reference for your Project'
                      onChange={(e) => setOrderReference(e.target.value)}
                    />
                  </div>
                </div>
              </Col>

              <Col sm={12}>
                <div className="formgroup mb-2 mt-3">
                  <label>Describe requirements for the order below</label>
                  <p className='notCustomer'>Use for organisation. Not customer-facing.</p>
                  <div className={`inputInfo`}>
                    <textarea
                      type="text"
                      name="orderDescription"
                      value={orderDescription}
                      placeholder='Enter a description...'
                      onChange={(e) => setOrderDescription(e.target.value)}
                    />
                  </div>
                  <span>Only for internal use.</span>
                </div>
              </Col>

              <Col sm={12}>
                <div className="formgroup mb-2 mt-3">
                  <div className="upload-btn-wrapper">
                    <button className="btn">Attach Files <Upload color="#1D2939" size={20} /></button>
                    <input type="file" name="myfile" onChange={handleFileChange} />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <div className="updateButtonGeneral d-flex align-items-center justify-content-between">
        <div className='CancelActionBut'>
          <button className="cancelData">Cancel</button>
        </div>
        <div className='rightActionBut'>
          <button className="cancel">Save Draft</button>
          <button onClick={handleCalculation} className="save">Calculate</button>
        </div>
      </div>
    </div>
  );
};

export default ScopeofWork;
