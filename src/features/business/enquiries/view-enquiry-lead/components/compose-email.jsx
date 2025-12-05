import { useState } from "react";
import { X } from "react-bootstrap-icons";
import { ProgressSpinner } from 'primereact/progressspinner';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from "react-bootstrap/Modal";
import Row from 'react-bootstrap/Row';
import AddNoteModeIcon from "../../../../../assets/images/icon/addNoteModeIcon.svg";

const ComposeEmail = ({ submissionId, email }) => {
  const [viewShow, setViewShow] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleShow = () => {
    setEmailTo(email || '');
    setViewShow(true);
  };

  const handleClose = () => {
    setViewShow(false);
    setEmailTo('');
    setSubject('');
    setMessage('');
    setErrors({});
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!emailTo || !validateEmail(emailTo)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: Implement API call to send email
    setIsLoading(true);
    console.log('Sending email for submission:', submissionId, {
      to: emailTo,
      subject: subject,
      message: message
    });

    setTimeout(() => {
      setIsLoading(false);
      handleClose();
    }, 1000);
  };

  return (
    <>
      <div className="linkByttonStyle py-2 ps-0" onClick={handleShow}>
        Compose Email
      </div>

      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="taskModelProject"
        onHide={handleClose}
        animation={false}
        size="lg"
      >
        <Modal.Header className="mb-0 pb-0 border-0">
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
              <img src={AddNoteModeIcon} alt="AddNoteModeIcon" />
              Compose Email
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
                <div className="formgroup mb-2">
                  <label htmlFor="email-to">To<span className="required">*</span></label>
                  <div className={`inputInfo ${errors.email ? 'error-border' : ''}`}>
                    <input
                      id="email-to"
                      type="email"
                      value={emailTo}
                      placeholder='Enter email address...'
                      onChange={(e) => {
                        setEmailTo(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                      }}
                      className="w-100"
                    />
                  </div>
                  {errors.email && <small className="error-message">{errors.email}</small>}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="formgroup mb-2 mt-2">
                  <label htmlFor="email-subject">Subject<span className="required">*</span></label>
                  <div className={`inputInfo ${errors.subject ? 'error-border' : ''}`}>
                    <input
                      id="email-subject"
                      type="text"
                      value={subject}
                      placeholder='Enter subject...'
                      onChange={(e) => {
                        setSubject(e.target.value);
                        if (errors.subject) setErrors(prev => ({ ...prev, subject: '' }));
                      }}
                      className="w-100"
                    />
                  </div>
                  {errors.subject && <small className="error-message">{errors.subject}</small>}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="formgroup mb-2 mt-2">
                  <label htmlFor="email-message">Message<span className="required">*</span></label>
                  <div className={`inputInfo ${errors.message ? 'error-border' : ''}`}>
                    <textarea
                      id="email-message"
                      value={message}
                      placeholder='Enter your message...'
                      onChange={(e) => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                      }}
                      rows={8}
                      className="w-100"
                    />
                  </div>
                  {errors.message && <small className="error-message">{errors.message}</small>}
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

export default ComposeEmail;
