import React, { useState } from 'react';
import { X } from "react-bootstrap-icons";
import { PhoneInput } from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import AddNoteModeIcon from "../../../../../assets/images/icon/addNoteModeIcon.svg";

const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const SendSMS = ({ submissionId, phone }) => {
  const [viewShow, setViewShow] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setViewShow(false);
    setMessage("");
    setPhoneNumber("");
    setErrors({});
  };

  const handleShow = () => {
    setPhoneNumber(phone || '');
    setViewShow(true);
  };

  const handleSubmit = () => {
    let error = {};
    if (!message) error.message = true;
    if (!phoneNumber || !isPhoneValid(phoneNumber)) error.phone = true;
    if (Object.keys(error).length) return setErrors(error);

    // TODO: Implement API call to send SMS
    setIsLoading(true);
    console.log('Sending SMS for submission:', submissionId, {
      phone_number: phoneNumber,
      message: message
    });
    
    setTimeout(() => {
      setIsLoading(false);
      handleClose();
    }, 1000);
  };

  return (
    <>
      <div className="linkByttonStyle py-2 border-right text-center ps-0" onClick={handleShow}>
        Send SMS
      </div>

      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="taskModelProject"
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0">
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
              <img src={AddNoteModeIcon} alt="AddNoteModeIcon" />
              Send SMS
            </span>
          </div>
          <button className='CustonCloseModal' onClick={handleClose}>
            <X size={24} color='#667085' />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="ContactModel">
            <Row>
              <Col>
                <div className="formgroup sendSMSPhone mb-2 mt-0">
                  <label>To<span className="required">*</span></label>
                  <div className={`inputInfo p-0 ${errors.phone ? 'error-border' : 'border-0'}`}>
                    <PhoneInput
                      defaultCountry='au'
                      placeholder='Enter phone number'
                      value={phoneNumber || ""}
                      className='phoneInput w-100'
                      onChange={(e) => {
                        setPhoneNumber(e);
                        if (isPhoneValid(e)) setErrors((others) => ({ ...others, phone: false }));
                      }}
                    />
                  </div>
                  {errors.phone && <p className="error-message">Phone is not valid</p>}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="formgroup mb-2 mt-2">
                  <label>Message<span className="required">*</span></label>
                  <div className={`inputInfo ${errors.message ? 'error-border' : ''}`}>
                    <textarea
                      type="text"
                      name="message"
                      value={message}
                      placeholder='Enter a message here...'
                      onChange={(e) => {
                        const newText = e.target.value.slice(0, 150);
                        setMessage(newText);
                        setErrors((others) => ({ ...others, message: false }));
                      }}
                      rows={6}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <p className="error-message">{errors.message && "Message is required"}</p>
                    <div style={{ float: 'right', fontSize: '14px', color: '#6c757d' }}>
                      {message?.length || 0}/150
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className='pt-0'>
          <div className="popoverbottom w-100 border-0 mt-0 pt-0">
            <Button variant="outline-danger" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              disabled={isLoading} 
              variant="primary save d-flex align-items-center gap-2" 
              onClick={handleSubmit}
            >
              Send
              {isLoading && <ProgressSpinner style={{ width: '15px', height: '15px' }} />}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SendSMS;
