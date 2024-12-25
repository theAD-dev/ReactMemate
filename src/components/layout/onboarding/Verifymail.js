import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import mail01 from "../../../assets/images/icon/mail-01.png";
import LoinLogo from "../../../assets/images/logo.svg";
import login_slider1 from "../../../assets/images/img/emailSlider01.png";
import VerificationInput from 'react-verification-input';
import { OnboardingCode, OnboardingCreateApi } from "../../../APIs/OnboardingApi";
import { ClockHistory, ArrowLeftShort } from "react-bootstrap-icons";
import "./org.css";
import { Button } from 'react-bootstrap';

const Verifymail = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const email = new URLSearchParams(useLocation().search).get("email");
  const first_name = new URLSearchParams(useLocation().search).get("first_name");
  const last_name = new URLSearchParams(useLocation().search).get("last_name");

  if (!uuid || !email || !first_name || !last_name) navigate('/onboarding');

  const [otpCode, setOtpCode] = useState('');
  const [codeError, setCodeError] = useState(null);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    if (timer > 0 && isTimerActive) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
  }, [timer, isTimerActive]);

  const CodeSubmit = async (event) => {
    event.preventDefault();

    if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
      setCodeError("OTP must be 6 numeric digits.");
      return;
    }

    try {
      const response = await OnboardingCode(otpCode, uuid);
      if (typeof response === "string" && response.includes("code")) {
        setCodeError(JSON.parse(response).otpCode);
      } else {
        navigate(`/company-name/${uuid}?email=${email}&first_name=${first_name}&last_name=${last_name}`)
      }
    } catch (error) {
      console.error("API error:", error);
      setCodeError("An error occurred while verifying the OTP. Please try again later.");
    }
  };

  const resendOTP = async () => {
    try {
      const response = await OnboardingCreateApi({ email, first_name, last_name });
      if (response?.uuid) {
        setTimer(60);
        setIsTimerActive(true);
      }
    } catch (error) {
      console.error("API error:", error);
      setCodeError("An error occurred while verifying the OTP. Please try again later.");
    }
  }

  return (
    <div className='requestDemoWrap veryfymail'>
      <div className="logohead">
        <img src={LoinLogo} alt="Logo" />
      </div>
      <div className="copywrite">© Memate 2024</div>
      <div className='OnboardingStep1 onboardingWrap'>
        <form onSubmit={CodeSubmit}>
          <div className="loginPage">
            <div className="boxinfo">
              <div className="boxLogin verifyEmailb">
                <div className="envolpicon">
                  <img src={mail01} alt="Email Icon" />
                </div>
                <h2>Verify your <span>email</span> address</h2>
                <p className='emailDis'>
                  You haven't confirmed your email address <strong>{email}</strong> yet. To complete the registration, please enter the verification code we sent to your email. Once verified, you will be able to continue.
                </p>
                <VerificationInput
                  length={6}
                  value={otpCode}
                  placeholder='0'
                  onChange={setOtpCode}
                />
                {codeError && <p className="error-message">{codeError}</p>}
                <button type='submit' className="fillbtn flexcenterbox">
                  Submit OTP
                  <img src={arrowRight} alt="Arrow Right" />
                </button>
                <div className='resendTimer'>
                  <div className='Timercount'>
                    <ClockHistory color='#667085' size={24} />
                    <p className='text'>Resend code in:</p>
                    <p className='timer'>{isTimerActive ?
                      `${String(Math.floor(timer / 60)).padStart(2, '0')} : ${String(timer % 60).padStart(2, '0')}`
                      :
                      '00:00'
                    }</p>
                  </div>
                </div>
                {!isTimerActive && (
                  <div className='linkBottom'>
                    <p>Didn’t receive the email? <Link to="/resend-email">Click to resend</Link></p>
                    <Button onClick={resendOTP}>
                      <ArrowLeftShort color='#475467' size={20} /> Back to log in
                    </Button>
                  </div>
                )}
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
  );
};

export default Verifymail;
