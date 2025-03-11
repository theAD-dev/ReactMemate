import React, { useState, useEffect } from 'react';
import { ClockHistory, ArrowLeftShort } from "react-bootstrap-icons";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import VerificationInput from 'react-verification-input';
import { ProgressSpinner } from 'primereact/progressspinner';
import { OnboardingCode, onboardingNextStep } from "../../../APIs/OnboardingApi";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import mail01 from "../../../assets/images/icon/mail-01.png";
import login_slider1 from "../../../assets/images/img/emailSlider01.png";
import LoinLogo from "../../../assets/images/logo.svg";

const Verifymail = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const email = new URLSearchParams(useLocation().search).get("email");

  if (!uuid) navigate('/onboarding');

  const [otpCode, setOtpCode] = useState('');
  const [codeError, setCodeError] = useState(null);
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


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
      setIsLoading(true);
      const response = await OnboardingCode(otpCode, uuid);
      if (typeof response === "string" && response.includes("code")) {
        setCodeError(JSON.parse(response).otpCode);
      } else {
        navigate(`/company-name/${uuid}?email=${email}`);
      }
    } catch (error) {
      console.error("API error:", error);
      setCodeError("An error occurred while verifying the OTP. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setIsResendLoading(true);
      const { step } = await onboardingNextStep(uuid);
      setTimer(60);
      setIsResendLoading(false);
      setIsTimerActive(true);
      if (step === 1) return navigate(`/verify-mail/${uuid}?email=${email}`);
      else if (step === 2) return navigate(`/company-name/${uuid}?email=${email}`);
      else if (step === 3) return navigate(`/discover-memate/${uuid}`);
      else if (step === 4) return navigate(`/create-password/${uuid}`);

    } catch (error) {
      console.error("API error:", error);
      setCodeError("An error occurred while verifying the OTP. Please try again later.");
    }
  };

  return (
    <div className='requestDemoWrap veryfymail'>
      <div className="logohead">
        <img src={LoinLogo} alt="Logo" />
      </div>
      <div className="copywrite">© Memate {new Date().getFullYear()}</div>
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
                <button type='submit' disabled={isLoading} className="fillbtn flexcenterbox">
                  {isLoading ? "Loading..." : "Submit OTP"}
                  {!isLoading && <img src={arrowRight} alt="Arrow Right" />}
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
                  <div className='linkBottom d-flex flex-column align-items-center'>
                    <p className='mb-1 d-flex align-items-center justify-content-center gap-1 w-fit'>Didn’t receive the email?
                      <button className='cursor-pointer border-0 px-0' disabled={isResendLoading} style={{ color: '#106B99', background: '#fff', fontWeight: '600' }} onClick={resendOTP}>Click to resend</button>
                      {isResendLoading && <ProgressSpinner style={{ width: '12px', height: '12px' }} />}
                    </p>
                    <Link to={"/login"} style={{ color: '#475467', fontWeight: '600', fontSize: '14px' }}>
                      <ArrowLeftShort color='#475467' size={20} /> Back to log in
                    </Link>
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
