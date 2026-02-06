import React, { useEffect, useState } from 'react';
import { X } from "react-bootstrap-icons";
import { PhoneInput } from 'react-international-phone';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { toast } from 'sonner';
import style from './send-sms.module.scss';
import { getSMS, getSMSTemplates } from '../../../../../../APIs/email-template';
import { sendSms } from '../../../../../../APIs/management-api';
import AddNoteModeIcon from "../../../../../../assets/images/icon/addNoteModeIcon.svg";

const phoneUtil = PhoneNumberUtil.getInstance();
const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const SendSMS = ({ projectId, projectCardData }) => {
  const [smsTemplateId, setSMSTemplatedId] = useState(null);
  const [viewShow, setViewShow] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const handleClose = () => {
    setViewShow(false);
    setMessage("");
    setPhoneNumber("");
    setErrors({});
    setSMSTemplatedId(null);
  };

  const handleShow = () => {
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || "{}");
    if (profileData?.has_twilio)
      setViewShow(true);
    else {
      setShowInstructions(true);
    }
  };

  const smsTemplateQuery = useQuery({
    queryKey: ["getSMSTemplates"],
    queryFn: getSMSTemplates
  });

  const smsQuery = useQuery({
    queryKey: ["smsQuery", smsTemplateId],
    queryFn: () => getSMS(smsTemplateId),
    enabled: !!smsTemplateId,
    retry: 1,
  });


  const mutation = useMutation({
    mutationFn: (data) => sendSms(projectId, data),
    onSuccess: () => {
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
    let error = {};
    if (!message) error.message = true;
    if (!phoneNumber || !isPhoneValid(phoneNumber)) error.phone = true;
    if (Object.keys(error).length) return setErrors(error);

    mutation.mutate({
      phone_number: phoneNumber,
      message: message
    });
  };

  useEffect(() => {
    if (smsQuery?.data?.text) {
      setMessage(smsQuery.data.text);
      setErrors((others) => ({ ...others, message: false }));
    }
  }, [smsQuery.data]);

  return (
    <>
      {/* View modal trigger */}
      <div className="linkByttonStyle py-2 border-right text-center ps-0" onClick={handleShow}>
        Send SMS
      </div>

      {/* Instructions modal */}
      <Modal
        show={showInstructions}
        onHide={() => setShowInstructions(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="taskModelProject"
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0">
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
              <svg width="56" height="57" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4.5" width="48" height="48" rx="24" fill="#FEE4E2" />
                <rect x="4" y="4.5" width="48" height="48" rx="24" stroke="#FEF3F2" strokeWidth="8" />
                <path d="M20.0168 34.3409C20.3324 34.6574 20.4904 35.0981 20.4479 35.5431C20.3524 36.5401 20.1325 37.5778 19.8502 38.5417C21.9425 38.0581 23.2204 37.4972 23.8012 37.2028C24.1309 37.0357 24.5107 36.9963 24.8677 37.092C25.8545 37.3566 26.9061 37.5 28 37.5C33.9934 37.5 38.5 33.2887 38.5 28.5C38.5 23.7113 33.9934 19.5 28 19.5C22.0066 19.5 17.5 23.7113 17.5 28.5C17.5 30.7021 18.426 32.7456 20.0168 34.3409ZM19.2773 40.1984C19.2672 40.2004 19.2571 40.2024 19.247 40.2044C19.1093 40.2315 18.9688 40.2583 18.8257 40.2845C18.625 40.3212 18.419 40.357 18.2076 40.3916C17.9091 40.4405 17.6805 40.1282 17.7985 39.8496C17.8755 39.6676 17.9515 39.4769 18.0255 39.2791C18.0725 39.1535 18.1187 39.025 18.1639 38.8941C18.1658 38.8885 18.1678 38.8828 18.1697 38.8772C18.5413 37.7976 18.8439 36.5567 18.9547 35.4001C17.1146 33.5548 16 31.1413 16 28.5C16 22.701 21.3726 18 28 18C34.6274 18 40 22.701 40 28.5C40 34.299 34.6274 39 28 39C26.7749 39 25.5926 38.8394 24.4793 38.5408C23.7 38.9357 22.0215 39.6545 19.2773 40.1984Z" fill="#F04438" />
                <path d="M22 24.75C22 24.3358 22.3358 24 22.75 24H33.25C33.6642 24 34 24.3358 34 24.75C34 25.1642 33.6642 25.5 33.25 25.5H22.75C22.3358 25.5 22 25.1642 22 24.75ZM22 28.5C22 28.0858 22.3358 27.75 22.75 27.75H33.25C33.6642 27.75 34 28.0858 34 28.5C34 28.9142 33.6642 29.25 33.25 29.25H22.75C22.3358 29.25 22 28.9142 22 28.5ZM22 32.25C22 31.8358 22.3358 31.5 22.75 31.5H28.75C29.1642 31.5 29.5 31.8358 29.5 32.25C29.5 32.6642 29.1642 33 28.75 33H22.75C22.3358 33 22 32.6642 22 32.25Z" fill="#F04438" />
              </svg>

              <span className='ms-3'>SMS is currently unavailable</span>
            </span>
          </div>
          <button className='CustonCloseModal' onClick={() => setShowInstructions(false)}>
            <X size={24} color='#667085' />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="ContactModel">
            <p className={style.smsUnavailableText}>SMS functionality is currently unavailable. To use this<br /> feature, please ask your admin to set up a Twilio<br /> account and connect it via <Link to="/settings/integrations?openTwilio=true" style={{ color: '#158ECC' }}>Settings &gt; Integrations</Link>.</p>

            <div className={clsx("d-flex align-items-center justify-content-center flex-column gap-1 m-auto", style.twilioStatus)}>
              <div className={clsx("d-flex align-items-center justify-content-center", style.twilioIcon)}>
                <img src='/static/media/twilio-logo.c9f32aa9e92765a4deb7.png' style={{ width: '50px' }} />
                <h6 className="mb-1" style={{ color: '#101828', fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>
                  Twilio
                </h6>
              </div>
              <span className={clsx("px-2 py-1", style.disconnectedBadge)}>
                Disconnected
                &nbsp;
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="9" viewBox="0 0 8 9" fill="none">
                  <circle cx="4" cy="4.5" r="3" fill="#F79009" />
                </svg>
              </span>
            </div>
          </div>
        </Modal.Body>
      </Modal>

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
              <Col sm={12} className='mb-3'>
                <div style={{ position: 'relative' }}>
                  <label className={clsx(style.customLabel)}>Templates</label>
                  <Dropdown
                    options={
                      (smsTemplateQuery &&
                        smsTemplateQuery.data?.map((smsTemplate) => ({
                          value: smsTemplate.id,
                          label: `${smsTemplate.title}`,
                        }))) ||
                      []
                    }
                    className={clsx(
                      style.dropdownSelect,
                      "dropdown-height-fixed w-100"
                    )}
                    style={{ height: "46px", paddingLeft: '88px' }}
                    placeholder="Select template"
                    onChange={(e) => {
                      setSMSTemplatedId(e.value);
                    }}
                    value={smsTemplateId}
                    loading={smsTemplateQuery?.isFetching}
                    filterInputAutoFocus={true}
                    scrollHeight="380px"
                  />
                </div>
              </Col>
              <Col>
                <div className="formgroup sendSMSPhone mb-2 mt-0">
                  <label>To<span className="required">*</span></label>
                  <div className={`inputInfo p-0 ${errors.taskRead ? 'error-border' : 'border-0'}`}>
                    <PhoneInput
                      defaultCountry='au'
                      placeholder='Enter phone number'
                      value={phoneNumber || ""}
                      className='phoneInput w-100'
                      containerClass={style.countrySelector}
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
                  <div className={`inputInfo ${errors.description ? 'error-border' : ''}`} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', right: '10px', top: '15px' }}>
                      {smsQuery?.isFetching && <ProgressSpinner style={{ width: '20px', height: '20px', position: 'relative', top: '-5px' }} />}
                    </div>
                    <textarea
                      type="text"
                      name="Enter a message here..."
                      value={message}
                      placeholder='Enter a message here...'
                      onChange={(e) => {
                        const newText = e.target.value.slice(0, 150);
                        setMessage(newText);
                        setErrors((others) => ({ ...others, message: false }));
                      }}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <p className="error-message">{errors.message && "Description is required"}</p>
                    <div style={{ float: 'right', fontSize: '14px', color: '#6c757d' }}>
                      {message?.length || 0}/150
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>

            </Row>
            <div className="popoverbottom  mt-0 pt-4">
              <Button variant="outline-danger" onClick={handleClose}>
                Cancel
              </Button>
              <Button disabled={mutation?.isPending} variant="primary save d-flex align-items-center gap-2" onClick={handleSubmit}>
                Send
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
