import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// import { MessageChatCircle } from "react-bootstrap-icons";
import ClockHistoryCircle from "../../../assets/images/icon/clock-history-icon.png";
import LockZapCircle from "../../../assets/images/icon/lock-icon.png";
import ZapCircle from "../../../assets/images/icon/zap.png";
import ChartBreakoutSquare from "../../../assets/images/icon/chart-breakout-square.png";
import LenderPanel from "../../../assets/images/img/lender-panel01.png";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import "./style-model.css";
import { NavLink } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const BookkeepingContact = ({ onAdd }) => {
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
                    <h3>Contact our book keeping team</h3>
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
                  <h2>Need a Booking Service? </h2>
                  <p>We partner with the top booking professionals in the country to ensure all your transactions are accurately recorded and properly allocated.</p>
                  <ul>
                    <li><img src={ClockHistoryCircle} alt="ClockHistoryCircle" />
                      <span><h5>Save Time</h5>
                        Reduce the effort and attention needed for processing paperwork.</span></li>
                    <li><img src={LockZapCircle} alt="LockZapCircle" /><span>
                      <h5>Enhance Security and Accountability </h5>
                      Ensure every transaction is properly allocated and accounted for.</span></li>
                    <li><img src={ZapCircle} alt="ZapCircle" /><span>
                      <h5>Ease Your Burdens</h5>
                      Offload your bookkeeping and accounting tasks with cost-effective solutions.</span></li>
                  </ul>
                  <div className='bgShade mt-4 mb-4'>
                    <p>“I believe the strength of their company lies in its bookkeeping, as it provides a clear and accountable way to manage daily operations, ensure compliance, and control every transaction.”</p>
                    <strong>Robert Sanasi</strong>
                    <span>Vice President ICMS</span>
                  </div>
                  <div className='centerimgTag'><img src={LenderPanel} alt="LenderPanel" /></div>
                </Col>
              </Row>
            </>
          </Typography>
        </Box>
      </Modal>
    </>
  )
}

export default BookkeepingContact;
