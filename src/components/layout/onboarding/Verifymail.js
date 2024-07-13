import React, { useState,useEffect } from 'react';

import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import arrowRight from "../../../assets/images/icon/arrow.svg";
import "./org.css"
import mail01 from "../../../assets/images/icon/mail-01.png";
import LoinLogo from "../../../assets/images/logo.svg";
import login_slider1 from "../../../assets/images/img/emailSlider01.png";
import VerificationInput from 'react-verification-input';
import { OnboardingCode } from "../../../APIs/OnboardingApi";
import {ArrowLeftShort,ClockHistory} from "react-bootstrap-icons";
import { useLocation } from 'react-router-dom';


const Verifymail = () => {
  const location = useLocation();
  const { uuid,emaildata } = location.state;

  const navigate = useNavigate();
    const [otpCode,setOtpCode] = useState('')
    const [codeError, setCodeError] = useState(null);
    const [timer, setTimer] = useState(60); // Initial timer value in seconds
    const [isTimerActive, setIsTimerActive] = useState(true);

    const CodeSubmit = async (event) => {
      event.preventDefault();
  
      // Validation checks
      if (otpCode.length !== 6) {
          setCodeError("OTP must be 6 digits long.");
          return;
      }
      if (!/^\d+$/.test(otpCode)) {
        
          setCodeError("OTP must contain only numeric digits.");
          return;
      }
      console.log('otpCode: ', otpCode);
      // If validation passes, submit OTP
      OnboardingCode(otpCode, uuid)
          .then((response) => {
            console.log('response: ', response);
              if (typeof response === "string" && response.includes("code")) {
                  const errorMessage = JSON.parse(response).otpCode;
                  setCodeError(errorMessage); // Display the API error message
              } else {
                  navigate("/company-name", { state: { uuid } });
              }
          })
          .catch((error) => {
              // Handle any API errors here
              console.error("API error:", error);
              setCodeError("An error occurred while verifying the OTP. Please try again later.");
          });
  };
  
      useEffect(() => {
        if (timer > 0 && isTimerActive) {
          const countdown = setTimeout(() => setTimer(timer - 1), 1000);
          return () => clearTimeout(countdown);
        } else if (timer === 0) {
          setIsTimerActive(false);
          // Automatically submit OTP or trigger next step here
        //   handleSubmit();
        }
      }, [timer, isTimerActive]);
  return (
    <>
      <div className='requestDemoWrap veryfymail '>
        <div className="logohead">
          <img src={LoinLogo} alt="Loin Logo" />
        </div>
        <div className="copywrite">© Memate 2024</div>
        <div className='OnboardingStep1 onboardingWrap'>
          <form>
            <div className="loginPage">
              <div className="boxinfo">
                <div className="boxLogin verifyEmailb">
                <div className="envolpicon">
          <img src={mail01} alt="mail01" />
            </div>
                <h2>Verify your <span>email</span> address</h2>
                 <p className='emailDis'>You haven't confirmed your email address <strong>{emaildata}</strong> yet. To complete registration, please click on the confirmation link in the email we sent you. Afterwards, you will be able to continue.</p>
             
                 <VerificationInput
              length={6} 
              value={otpCode}
              placeholder='0'
              onChange={(newValue) => setOtpCode(newValue)} /> 
                {codeError && <p className="error-message">{codeError}</p>}
                       <button type='submit'
                          className="fillbtn flexcenterbox"
                          onClick={CodeSubmit}
                          >
                            Submit OTP 
                          <img src={arrowRight} alt="Arrow Right" />
                        </button>
                      
                        <div className='resendTimer'>
                        <div className='Timercount'>
                           <span><ClockHistory color='#667085' size={24} /></span>
                           <p className='text'>Resend code in:</p>
                          <p className='timer'>{isTimerActive ? 
                          `${(Math.floor(timer / 60)).toString().padStart(2, '0')} : ${(timer % 60).toString().padStart(2, '0')}` 
                          : 
                          '00:00'
                      }</p>
                          </div>
                          </div>
                          <div className={`linkBottom ${isTimerActive ? 'hide' : 'show'}`}>
        <p>Didn’t receive the email? <Link to="/resend-email">Click to resend</Link></p>
        <Link className="backToLogin" to="/login"><ArrowLeftShort color='#475467' size={20} />Back to log in</Link>
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

export default Verifymail;
