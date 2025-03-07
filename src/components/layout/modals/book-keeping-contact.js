import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import { NavLink } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { toast } from 'sonner';
import { createAdditionalService } from '../../../APIs/service-api';
import ClockHistoryCircle from "../../../assets/images/icon/clock-history-icon.png";
import LockZapCircle from "../../../assets/images/icon/lock-icon.png";
import ZapCircle from "../../../assets/images/icon/zap.png";
import homeboxImg02 from "../../../assets/images/img/homeboxImg02.png";
import LenderPanel from "../../../assets/images/img/lender-panel01.png";
import "./style-model.css";

const BookkeepingContact = ({ onAdd }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      type: 'book_keeping_contact', // Updated to reflect bookkeeping context
      first_name: '',
      last_name: '',
      email: '',
      job_title: '',
      phone: '',
      text: ''
    },
    mode: 'onChange'
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createAdditionalService,
    onSuccess: () => {
      reset();
      handleClose();
      if (onAdd) onAdd({ /* You can pass data here if needed */ });
      toast.success('Your message has been sent successfully');
    },
    onError: (error) => {
      console.error('Submission error:', error);
      toast.error('An error occurred while submitting the form. Please try again.');
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <>
      <div className="imageBoxHome" onClick={handleOpen} style={{
        backgroundImage: `url(${homeboxImg02})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer'
      }} >
        <div className='textOverly'>
          <h3>Book keeping</h3>
          <Button variant="link">
            <div className={`styleGrey01 popupModalStyle`}>
              Learn More
            </div>
          </Button>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modelStyleBoxstatus contactFinanceWrap" sx={{ width: 1408 }}>
          <Typography id="modal-modal-title" className={``} variant="h6" component="h2">
            <>
              <div className='modelHeader modelHeaderBillig'>
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon color="#667085" size={24} />
                </IconButton>
              </div>
              <Row className="justify-content-md-center">
                <Col sm={6}>
                  <div className='leftFormWrap'>
                    <h3>Contact our book keeping team</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Row>
                        <Col sm={6}>
                          <div className="formgroup mb-2">
                            <label>First Name</label>
                            <div className={`inputInfo ${errors.first_name ? 'error-border' : ''}`}>
                              <Controller
                                name="first_name"
                                control={control}
                                rules={{ required: 'First name is required' }}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    placeholder='Enter first name'
                                  />
                                )}
                              />
                            </div>
                            {errors.first_name && <p className="error-message">{errors.first_name.message}</p>}
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="formgroup mb-2">
                            <label>Last Name</label>
                            <div className={`inputInfo ${errors.last_name ? 'error-border' : ''}`}>
                              <Controller
                                name="last_name"
                                control={control}
                                rules={{ required: 'Last name is required' }}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    placeholder='Enter last name'
                                  />
                                )}
                              />
                            </div>
                            {errors.last_name && <p className="error-message">{errors.last_name.message}</p>}
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="formgroup mb-2">
                            <label>Work Email</label>
                            <div className={`inputInfo ${errors.email ? 'error-border' : ''}`}>
                              <Controller
                                name="email"
                                control={control}
                                rules={{
                                  required: 'Email is required',
                                  pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'Invalid email address'
                                  }
                                }}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="email"
                                    placeholder='Enter work email'
                                  />
                                )}
                              />
                            </div>
                            {errors.email && <p className="error-message">{errors.email.message}</p>}
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="formgroup mb-2">
                            <label>Job Title</label>
                            <div className={`inputInfo ${errors.job_title ? 'error-border' : ''}`}>
                              <Controller
                                name="job_title"
                                control={control}
                                rules={{ required: 'Job title is required' }}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    placeholder='Enter job title'
                                  />
                                )}
                              />
                            </div>
                            {errors.job_title && <p className="error-message">{errors.job_title.message}</p>}
                          </div>
                        </Col>
                        <Col sm={12}>
                          <div className="formgroup mb-2">
                            <label>Phone (Optional)</label>
                            <div className={``}>
                              <Controller
                                name="phone"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <PhoneInput
                                    defaultCountry='au'
                                    value={value}
                                    onChange={onChange}
                                    className={`phoneInput rounded ${errors.phone ? 'error-border' : ''}`}
                                    placeholder='+1 (555) 000-0000'
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </Col>
                        <Col sm={12}>
                          <div className="formgroup mb-2">
                            <label>How can our team help you?</label>
                            <div className={`inputInfo ${errors.text ? 'error-border' : ''}`}>
                              <Controller
                                name="text"
                                control={control}
                                rules={{ required: 'This field is required' }}
                                render={({ field }) => (
                                  <textarea
                                    {...field}
                                    placeholder={`Enter the detailed quote for the client contract here. Include all relevant information such as project scope, deliverables, timelines, costs, payment terms, and any special conditions. Ensure the quote is clear, comprehensive, and aligns with the client's requirements and expectations.`}
                                  />
                                )}
                              />
                            </div>
                            {errors.text && <p className="error-message">{errors.text.message}</p>}
                          </div>
                        </Col>
                        <Row className='formBottom'>
                          <Col sm={12}>
                            <p>By clicking submit, I acknowledge memate.com</p>
                            <NavLink className="" to="#"> Privacy Policy</NavLink>
                            <button type="submit" disabled={isPending}>
                              {isPending ? 'Submitting...' : 'Submit'}
                            </button>
                          </Col>
                        </Row>
                      </Row>
                    </form>
                  </div>
                </Col>
                <Col sm={6} className='rightText'>
                  <h2>Need a Booking Service?</h2>
                  <p>We partner with the top booking professionals in the country to ensure all your transactions are accurately recorded and properly allocated.</p>
                  <ul>
                    <li>
                      <img src={ClockHistoryCircle} alt="ClockHistoryCircle" />
                      <span>
                        <h5>Save Time</h5>
                        Reduce the effort and attention needed for processing paperwork.
                      </span>
                    </li>
                    <li>
                      <img src={LockZapCircle} alt="LockZapCircle" />
                      <span>
                        <h5>Enhance Security and Accountability</h5>
                        Ensure every transaction is properly allocated and accounted for.
                      </span>
                    </li>
                    <li>
                      <img src={ZapCircle} alt="ZapCircle" />
                      <span>
                        <h5>Ease Your Burdens</h5>
                        Offload your book keeping and accounting tasks with cost-effective solutions.
                      </span>
                    </li>
                  </ul>
                  <div className='bgShade mt-4 mb-4'>
                    <p>“I believe the strength of their company lies in its book keeping, as it provides a clear and accountable way to manage daily operations, ensure compliance, and control every transaction.”</p>
                    <strong>Robert Sanasi</strong>
                    <span>Vice President ICMS</span>
                  </div>
                  <div className='centerimgTag'>
                    <img src={LenderPanel} alt="LenderPanel" />
                  </div>
                </Col>
              </Row>
            </>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default BookkeepingContact;