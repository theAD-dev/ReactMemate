import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import arrowRight from "../../../assets/images/icon/arrow.svg";
import "./org.css"
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import LoinLogo from "../../../assets/images/logo.svg";
import BusinessProfile from "../../../assets/images/img/emailSlider02.png";
import { useLocation } from 'react-router-dom';

const CompanyName = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const email = new URLSearchParams(useLocation().search).get("email");

  if (!uuid) navigate('/onboarding');

  const [company_name, setCompanyname] = useState('');
  const [firstcmError, setFirstcmError] = useState('');
  const handleStepOne = () => {
    if (company_name.trim() === '') {
      setFirstcmError('Company name is required');
      return;
    }
    navigate(`/regional-settings/${uuid}?email=${email}&company_name=${company_name}`)
  };
  return (
    <>
      <div className='requestDemoWrap'>
        <div className="logohead">
          <img src={LoinLogo} alt="Loin Logo" />
        </div>
        <div className="copywrite">© Memate 2024</div>
        <div className='OnboardingStep1'>
          <form>
            <div className="loginPage">
              <div className="boxinfo">
                <div className="boxLogin">
                  <h2>
                    Define Your <br></br><span>Business</span> Profile
                  </h2>
                  <div className="step-progress">
                    <div className="step"></div>
                    <div className="step"></div>
                    <div className="step active" ></div>
                    <div className="step"></div>
                    <div className="step"></div>
                  </div>
                  <div className="formgroup">
                    <label>Company Legal Name</label>
                    <div className={`inputInfo ${firstcmError ? 'error-border' : ''}`}>
                      <input
                        type="text"
                        name="company_name"
                        value={company_name}
                        placeholder='Enter company legal name '
                        onChange={(e) => {
                          setCompanyname(e.target.value);
                        }}
                      />
                      {firstcmError && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                    </div>
                    {firstcmError && <p className="error-message">{firstcmError}</p>}
                  </div>

                  <button
                    type='button'
                    className="fillbtn flexcenterbox"
                    onClick={handleStepOne}>
                    Next Step
                    <img src={arrowRight} alt="Arrow Right" />
                  </button>

                </div>
              </div>
              <div className="sliderRight SinglBgRight" style={{
                backgroundImage: `url(${BusinessProfile})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}>
                <p>Ability to scale and avoid any manual processes.</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CompanyName;
