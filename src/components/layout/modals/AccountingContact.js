import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// import { MessageChatCircle } from "react-bootstrap-icons";
import MessageChatCircle from "../../../assets/images/icon/message-chat-circle.png";
import ZapCircle from "../../../assets/images/icon/zap.png";
import ClockHistoryCircle from "../../../assets/images/icon/clock-history-icon.png";
import LockZapCircle from "../../../assets/images/icon/lock-icon.png";
import ChartBreakoutSquare from "../../../assets/images/icon/chart-breakout-square.png";
import LenderPanel from "../../../assets/images/img/lender-panel03.png";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import "./styleModel.css";
import { NavLink } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const AccountingContact = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [pnumber, setPnumber] = useState('');
  const [help, setHelp] = useState('');
  const handleAdd = () => {
    handleClose();
  };

  return (
    <>
    
        <div onClick={handleOpen} className={`styleGrey01 popupModalStyle`}>
        Learn More
        </div>
     
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box className="modelStyleBoxstatus contactFinanceWrap" sx={{ width: 1408 }}>
          <Typography id="modal-modal-title" className={``} variant="h6" component="h2">
        
            <>
              <div className='modelHeader modelHeaderBillig '>
               
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close">
                  <CloseIcon color="#667085" size={24} />
                </IconButton>
              </div>
              <Row className="justify-content-md-center align-items-md-center">
        <Col sm={6}>
          <div className='leftFormWrap'>
          <h3>Contact our Accountants team</h3>
          <Row>
          <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>First Name</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="fname"
                        value={fname}
                        placeholder='Enter first name'
                        onChange={(e) => {
                          setFname(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
          <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Last Name</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="fname"
                        value={lname}
                        placeholder='Enter last name'
                        onChange={(e) => {
                          setLname(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
          <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Work Email</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        placeholder='Enter work email'
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
          <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Job Title</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="jobTitle"
                        value={jobTitle}
                        placeholder='Enter job title '
                        onChange={(e) => {
                          setJobTitle(e.target.value);
                        }}
                        
                      />
                    </div>
                  </div>
                    </Col>
                    <Col sm={12}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Phone (Optional)</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="pnumber"
                        value={pnumber}
                        placeholder='+1 (555) 000-0000'
                        onChange={(e) => {
                          setPnumber(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                    <Col sm={12}>
                    <div className="formgroup mb-2 mt-3">
                    <label>How can our team help you?</label>
                    <div className={`inputInfo `}>
                    <textarea
                    type="text"
                    name="help"
                    value={help}
                    placeholder={`Enter the detailed quote for the client contract here. Include all relevant information such as project scope, deliverables, timelines, costs, payment terms, and any special conditions. Ensure the quote is clear, comprehensive, and aligns with the client's requirements and expectations.`}
                    onChange={(e) => {
                      setHelp(e.target.value);
                    }}
                  /> 
                    </div>
                  
                  </div>
                    </Col>
                    <Row className='formBottom'>
        <Col sm={12}>
         <p>By clicking submit, I acknowledge memate.com</p>
         <NavLink className="" to="#"> Privacy Policy</NavLink>
         <button>Submit</button>
        </Col>
      </Row>
          </Row>
          </div>
        </Col>
        <Col sm={6} className='rightText'>
          <h2>Get the Best Australian Accountant. </h2>
          <p>We provide only the finest accountants who will look after your company's tax submissions and ATO communications on a personalized and consistent basis.</p>
          <ul>
            <li><img src={ClockHistoryCircle} alt="ClockHistoryCircle"/><span><h5>Security and Compliance</h5> Ensure adherence to all regulatory requirements.</span></li>
            <li><img src={LockZapCircle} alt="LockZapCircle" /><span><h5>Individualized Approach </h5>Tailored services to meet your unique needs.</span></li>
            <li><img src={ZapCircle} alt="ZapCircle" /><span><h5>Transparent and Timely Communication</h5>Keep informed with clear and prompt updates.</span></li>
          </ul>
          <div className='bgShade mt-4 mb-4'>
            <p>“Thank you for providing the best accountant. This definitely removes any uncertainty and doubt when communicating with the taxation office”</p>
            <strong>Richard Karsay</strong>
            <span>Director - Precision Flooring</span>
          </div>
          <div className='centerimgTag'> <img src={LenderPanel} alt="LenderPanel" /></div>
        </Col>
      </Row>
     
            </>
          
          </Typography>
        </Box>
      </Modal>
    </>
  )
}

export default AccountingContact;
