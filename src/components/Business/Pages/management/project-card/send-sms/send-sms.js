import React, { useEffect, useState } from 'react';
import { X } from "react-bootstrap-icons";
import { PhoneInput } from 'react-international-phone';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [smsTemplateId, setSMSTemplatedId] = useState(null);
  const [viewShow, setViewShow] = useState(false);
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
      navigate('/settings/integrations?openTwilio=true');
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
