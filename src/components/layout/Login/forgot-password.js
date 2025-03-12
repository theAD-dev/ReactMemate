import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { resetEmail } from '../../../APIs/ProfileResetPasswordApi';
import arrowRight from "../../../assets/images/icon/arrow.svg";
import envelopeIcon from "../../../assets/images/icon/envelope.svg";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import forgetyourpass from "../../../assets/images/img/forgetyourpass.jpg";
import LoinLogo from "../../../assets/images/logo.svg";


const ForgotPassword = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    setError(null);

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);
      await resetEmail({ email: email });
      navigate(`/check-mail?email=${encodeURIComponent(email)}`);
    } catch (error) {
      if (error.message === "Not found") {
        setError("Email does not exist");
      } else {
        setError("Failed to send email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
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
                <button className="fillbtn flexcenterbox" type="submit" style={{ width: '340px', height: '49px' }}>
                  {isLoading ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner>
                    : <>Reset Password <img src={arrowRight} alt="Arrow Right" /></>}
                </button>
              </form>
            </div>
          </div>
          <div className="copywrite">
            © Memate {new Date().getFullYear()}
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
