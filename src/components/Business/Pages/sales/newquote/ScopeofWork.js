import React, { useState } from 'react';
import { People,InfoSquare,ChevronLeft,CardList,Upload} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";



const ScopeofWork = () => {

  const [company_name, setCompanyname] = useState('');
  const [abn, setAbn] = useState('');
  const [phoneumber, setPhoneumber] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();



 
  const handleCalculation = () => {
    navigate("/sales/newquote/calculation" , {state: {id}});
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
                    <li><span><People color="#D0D5DD" size={15} /></span> <p>Choose Client</p></li>
                    <li><span><InfoSquare color="#D0D5DD" size={15} /></span> <p>Client Information</p> </li>
                    <li className='activeClientTab'><span><CardList color="#D0D5DD" size={15} /></span> <p>Scope of Work</p> </li>
                </ul>
              </div>
              </div>
              
        <div className="newQuoteContent">
                  <div className="formgroupboxs mt-4">
                  <Row className='text-left'> 
                    <Col sm={12}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Order Reference  </label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="company_name"
                        value={company_name}
                        placeholder='Add Reference for your Project'
                        onChange={(e) => {
                          setCompanyname(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                    
                    <Col sm={12}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Describe requirements for the order below </label>
                    <p className='notCustomer'>Use for organisation. Not customer-facing.</p>
                    <div className={`inputInfo `}>
                    <textarea
                        type="text"
                        name="abn"
                        value={abn}
                        placeholder='Enter a description...'
                        onChange={(e) => {
                          setAbn(e.target.value);
                        }}
                      />
                      
                    </div>
                    <span>Only for internal use.</span>
                  </div>
                    </Col>
                    <Col sm={12}>
                    <div className="formgroup mb-2 mt-3">
                    <div class="upload-btn-wrapper">
                        <button class="btn">Attach Files <Upload color="#1D2939" size={20} /></button>
                        <input type="file" name="myfile" />
                      </div>
                  </div>    
                    </Col>
                   
                  </Row>
                  </div>
        </div>
        </div>
        <div class="updateButtonGeneral"><button class="cancel">Save Draft</button><button onClick={handleCalculation} class="save">Calculate</button></div>
        </div>
  )
}
export default ScopeofWork