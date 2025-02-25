import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

// import { MessageChatCircle } from "react-bootstrap-icons";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ChartBreakoutSquare from "../../../assets/images/icon/chart-breakout-square.png";
import MessageChatCircle from "../../../assets/images/icon/message-chat-circle.png";
import ZapCircle from "../../../assets/images/icon/zap.png";
import LenderPanel from "../../../assets/images/img/lender-panel 1.png";

import "./style-model.css";

const ModalSalesContactFinance = ({ onAdd }) => {
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
              <Row className="justify-content-md-center">
                <Col sm={6}>
                  <div className='leftFormWrap'>
                    <h3>Contact our Finance team</h3>
                    <Row>
                      <Col sm={6}>
                        <div className="formgroup mb-2 ">
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
                        <div className="formgroup mb-2 ">
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
                        <div className="formgroup mb-2 ">
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
                        <div className="formgroup mb-2 ">
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
                        <div className="formgroup mb-2 ">
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
                        <div className="formgroup mb-2 ">
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
                  <h2>Empowering Your Business Growth with Tailored Finance Solutions. </h2>
                  <p>From asset financing to commercial loans, auto debt refinancing, and equipment finance.</p>
                  <ul>
                    <li><img src={MessageChatCircle} alt="MessageChatCircle" /><span>We provide you with a personal manager who will offer a comprehensive individual
                      solution and act as your personal finance broker.</span></li>
                    <li><img src={ZapCircle} alt="ZapCircle" /><span>We are also able to restructure loans, refinance, and provide you with a wide range of financial
                      lending options, from major banks to private
                      lenders and hedge funds across Australia.</span></li>
                    <li><img src={ChartBreakoutSquare} alt="ChartBreakoutSquare" /><span>We are proud to work with Australian businesses and have already helped thousands
                      of Australian businesses save, expand, and restructure.</span></li>
                  </ul>
                  <div className='bgShade mt-4 mb-4'>
                    <p>Working with MeMate Fiancn was a game-changer for our business. Their personalised approach and expert guidance helped us navigate complex
                      financial challenges with ease. Thanks to their support"</p>
                    <strong>Daniel Vinkl </strong>
                    <span>CEO Visual Advertising Solutions</span>
                  </div>
                  <div className='centerimgTag'><img src={LenderPanel} alt="LenderPanel" /></div>
                </Col>
              </Row>

            </>

          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default ModalSalesContactFinance;
