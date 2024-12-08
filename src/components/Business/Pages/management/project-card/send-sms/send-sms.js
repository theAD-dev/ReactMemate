import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { X } from "react-bootstrap-icons";
import AddNoteModeIcon from "../../../../../../assets/images/icon/addNoteModeIcon.svg";
import { useNavigate } from 'react-router-dom';
import { PhoneInput } from 'react-international-phone';
import style from './send-sms.module.scss';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { useMutation } from '@tanstack/react-query';
import { sendSms } from '../../../../../../APIs/management-api';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';

const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const SendSMS = ({ projectId, projectCardData }) => {
  const navigate = useNavigate();
  const [viewShow, setViewShow] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const isValid = isPhoneValid(phoneNumber);
  const handleClose = () => {
    setViewShow(false);
    setMessage("");
    setPhoneNumber("");
  };

  const handleShow = () => {
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || "{}");
    if (profileData?.has_twilio)
      setViewShow(true);
    else {
      navigate('/settings/integrations?openTwilio=true');
    }
  };

  const mutation = useMutation({
    mutationFn: (data) => sendSms(projectId, data),
    onSuccess: (response) => {
      toast.success(`SMS send successfully`);
      handleClose();
      projectCardData();
    },
    onError: (error) => {
      console.error('Error creating expense:', error);
      toast.error('Failed to send sms. Please try again.');
    }
  });

  const handleSubmit = () => {
    if (!message) return setErrors({ message: true });
    if (message && isValid) {
      mutation.mutate({
        phone_number: phoneNumber,
        message: message
      })
    }
  }

  return (
    <>
      {/* View modal trigger */}
      <div className="linkByttonStyle" onClick={handleShow}>
        Send SMS
      </div>

      {/* View modal */}
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
                  <label>To</label>
                  <div className={`inputInfo p-0 ${errors.taskRead ? 'error-border' : 'border-0'}`}>
                    <PhoneInput
                      defaultCountry='au'
                      placeholder='Enter phone number'
                      value={phoneNumber || ""}
                      className='phoneInput w-100'
                      containerClass={style.countrySelector}
                      onChange={(e) => {
                        setPhoneNumber(e);
                      }}
                    />
                  </div>
                  {!isValid && <p className="error-message">Phone is not valid</p>}
                </div>
              </Col>
            </Row>
            <Row>

              <Col>
                <div className="formgroup mb-2 mt-2">
                  <label>Message </label>
                  <div className={`inputInfo ${errors.description ? 'error-border' : ''}`}>
                    <textarea
                      type="text"
                      name="Enter a message here..."
                      value={message}
                      placeholder='Enter a message here...'
                      onChange={(e) => {
                        setMessage(e.target.value);
                        setErrors({})
                      }}
                    />
                  </div>
                  {errors.message && <p className="error-message">Description is required</p>}
                </div>
              </Col>
            </Row>
            <Row>

            </Row>
            <div className="popoverbottom  mt-0 pt-4">
              <Button variant="outline-danger" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary save d-flex align-items-center gap-2" onClick={handleSubmit}>
                Save 
                {
                  mutation?.isPending && <ProgressSpinner style={{ width: '15px', height: '15px' }} />
                }
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SendSMS;
