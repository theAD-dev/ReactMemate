import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import RegionalSettings from "../../../assets/images/img/login_slider.jpg";
import OnboardingLogo from "../../../assets/images/img/onboarding-logo.svg";
import LoinLogo from "../../../assets/images/logo.svg";

const SignUp = () => {
  const navigate = useNavigate();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');

  const handleSignUp = () => {
    // Validation
    if (first_name.trim() === '') {
      setFirstNameError('First name is required');
      return;
    } else if (first_name.trim().length !== first_name.length) {
      setFirstNameError('First name cannot be spaces only');
      return;
    }
    
    // If validation passes, navigate to the next step
    navigate("/select-country", { state: { first_name, last_name } });
  };

  return (
    <>
      <div className='requestDemoWrap'>
        <div className="logohead" style={{ zIndex: 10 }}>
          <Link to={`${process.env.REACT_APP_STATIC_WEBSITE_URL}`}><img src={LoinLogo} alt="Loin Logo" /></Link>
        </div>
        <div className="copywrite">© Memate {new Date().getFullYear()}</div>
        <div className='OnboardingStep1'>
          <form>
            <div className="loginPage">
              <div className="boxinfo">
                <div className="boxLogin">
                  <h1>
                    Yes, I want to <span>sign up</span><br></br> for a demo
                  </h1>
                  <div className="step-progress">
                    <div className="step active"></div>
                    <div className="step"></div>
                    <div className="step"></div>
                  </div>
                  <div className="formgroup">
                    <label>First Name<span style={{ color: "#f04438" }}>*</span></label>
                    <div className={`inputInfo ${firstNameError ? 'error-border' : ''}`}>
                      <input
                        type="text"
                        name="first_name"
                        value={first_name}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setFirstNameError('');
                        }}
                        placeholder="First Name"
                      />
                      {firstNameError && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                    </div>
                    {firstNameError && <p className="error-message">{firstNameError}</p>}
                  </div>
                  <div className="formgroup">
                    <label>Last Name</label>
                    <div className={`inputInfo`}>
                      <input
                        type="text"
                        name="last_name"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                      />
                      <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />
                    </div>
                  </div>
                  <button
                    type='button'
                    className="fillbtn flexcenterbox"
                    onClick={() => handleSignUp()}
                  >
                    Next Step
                    <img src={arrowRight} alt="Arrow Right" />
                  </button>
                  <div className="linkBottom"><p>Already have an account? <Link to="/login">Sign in</Link></p></div>
                </div>
              </div>
              <div className="sliderRight logoWrapMain SinglBgRight" style={{
                backgroundImage: `url(${RegionalSettings})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}>
               <img src={OnboardingLogo} alt='{Onboarding Logo}' />
               <p>Predict unprofitable business activities.</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
