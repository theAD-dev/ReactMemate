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
import homeBoxImg04 from "../../../assets/images/img/homeboxImg04.png";
import LenderPanel from "../../../assets/images/img/lender-panel03.png";

const AccountingContact = () => {
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
      type: 'accounting_contact', // Updated to reflect accounting context
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
        backgroundImage: `url(${homeBoxImg04})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer'
      }} >
        <div className='textOverly'>
          <h3>Accounting</h3>
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
                    <h3>Contact our Accountants team</h3>
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
                  <h2>Get the Best Australian Accountant.</h2>
                  <p>We provide only the finest accountants who will look after your company's tax submissions and ATO communications on a personalized and consistent basis.</p>
                  <ul>
                    <li>
                      <img src={ClockHistoryCircle} alt="ClockHistoryCircle" />
                      <span>
                        <h5>Security and Compliance</h5>
                        Ensure adherence to all regulatory requirements.
                      </span>
                    </li>
                    <li>
                      <img src={LockZapCircle} alt="LockZapCircle" />
                      <span>
                        <h5>Individualized Approach</h5>
                        Tailored services to meet your unique needs.
                      </span>
                    </li>
                    <li>
                      <img src={ZapCircle} alt="ZapCircle" />
                      <span>
                        <h5>Transparent and Timely Communication</h5>
                        Keep informed with clear and prompt updates.
                      </span>
                    </li>
                  </ul>
                  <div className='bgShade mt-4 mb-4'>
                    <p>“Thank you for providing the best accountant. This definitely removes any uncertainty and doubt when communicating with the taxation office”</p>
                    <strong>Richard Karsay</strong>
                    <span>Director - Precision Flooring</span>
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

export default AccountingContact;