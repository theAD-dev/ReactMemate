import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../Login/login.css";
import LoinLogo from "../../../assets/images/logo.svg";
import envelopeIcon from "../../../assets/images/icon/envelope.svg";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import { ProfileResetUpdate } from '../../../APIs/ProfileResetPasswordApi';
import forgetyourpass from "../../../assets/images/img/forgetyourpass.jpg";

const ForgotPassword = () => {
  const navigate = useNavigate(); 
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');

  const handleResetPassword = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
  
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    // Reset error state and initiate password reset
    setError(null);
    setIsPasswordReset(true);
  
    // Simulate API call to reset password
    setTimeout(() => {
      // Redirect to CheckMail component after a simulated delay
      navigate(`/check-mail?email=${encodeURIComponent(email)}`);
    }, 2000); // Simulated 2 second delay
  
    // Call the ProfileResetUpdate API
    ProfileResetUpdate(email);
  };

  return (
    <>
      <div className="loginPage forgotPage">
        <div className="boxinfo">
          <div className="logohead">
            <img src={LoinLogo} alt="Loin Logo" />
          </div>
          <div className="boxLogin">
            <h2>Forgot your <span>Password</span></h2>
            <div className="formgroup">
              <form onSubmit={handleResetPassword} >
                <label>Email</label>
                <div className={`inputInfo ${error ? "error-border" : email ? "successBorder" : ""}`}>
                  <img src={envelopeIcon} alt="Envelope Icon" />
                  <input
                    type="text"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button className="fillbtn flexcenterbox" type="submit">
                  Reset Password <img src={arrowRight} alt="Arrow Right" />
                </button>
              </form>
              {/* {isPasswordReset && (
                <div className="confirmation-message">
                  Password reset instructions sent to your email.
                </div>
              )} */}
            </div>
          </div>
          <div className="copywrite">
            © Memate 2024
          </div>
        </div>
        <div className="sliderRight SinglBgRight" style={{
          backgroundImage: `url(${forgetyourpass})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}>
          <p>It appears your password is momentarily out of reach. Let’s retrieve it together.</p>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
