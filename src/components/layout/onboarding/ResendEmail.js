import React, { useState } from 'react';
import { ArrowLeftShort } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import envelopeIcon from "../../../assets/images/icon/envelope.svg";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import mail01 from "../../../assets/images/icon/mail-01.png";
import login_slider1 from "../../../assets/images/img/emailSlider01.png";
import LoinLogo from "../../../assets/images/logo.svg";



const ResendEmail = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');



  return (
    <>
      <div className='requestDemoWrap veryfymail '>
        <div className="logohead">
          <img src={LoinLogo} alt="Loin Logo" />
        </div>
        <div className="copywrite">© Memate {new Date().getFullYear()}</div>
        <div className='OnboardingStep1 onboardingWrap'>
          <form>
            <div className="loginPage">
              <div className="boxinfo">
                <div className="boxLogin ">
                  <div className='verifyEmailb'>
                    <div className="envolpicon">
                      <img src={mail01} alt="mail01" />
                    </div>
                    <h2>Resend <span>verification</span> code</h2>
                    <p className='emailDis'>You haven't confirmed your email address <strong>max@narelik.com</strong> yet. To complete registration, please click on the confirmation email. Afterwards, we will send new verification code.</p>

                  </div>
                  <div className="formgroup">
                    <label>Email</label>
                    <div className={`inputInfo ${emailError ? 'error-border' : ''}`}>
                      <img src={envelopeIcon} alt="Envelope Icon" />
                      <input
                        type="email"
                        name="email"
                        placeholder='example@gmail.com'
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError('');
                        }}
                      />
                      {emailError && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                    </div>
                    {emailError && <p className="error-message">{emailError}</p>}
                  </div>
                  <button type='submit'
                    className="fillbtn flexcenterbox"
                  >
                    Resend email
                  </button>

                  <div className={`linkBottom `}>
                    <Link className="backToLogin" to="/login" style={{ color: '#475467', fontWeight: '600', fontSize: '14px' }}>
                      <ArrowLeftShort color='#475467' size={20} />Back to log in
                    </Link>
                  </div>

                </div>
              </div>
              <div className="sliderRight SinglBgRight" style={{
                backgroundImage: `url(${login_slider1})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}>
                <p>Complete internal control of the business from anywhere.</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResendEmail;
