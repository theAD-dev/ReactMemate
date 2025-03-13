import React from 'react';
import { InlineWidget } from "react-calendly";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Link } from "react-router-dom";
import { requestDemoCreate } from "../../../APIs/OnboardingApi";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import request04 from "../../../assets/images/img/request04.jpg";
import LoinLogo from "../../../assets/images/logo.svg";


const SelectDate = () => {
  const location = useLocation();
  const { first_name, last_name, country, phone, email, company_name, company_description, company_size } = location.state;
  const navigate = useNavigate();

  const handleStepOne = () => {
    const mainData = {
      first_name: first_name,
      last_name: last_name,
      country: country,
      phone: phone,
      email: email,
      company_name: company_name,
      company_description: company_description,
      company_size: company_size,
      is_agree_marketing: true,
      date: "11-04-2024"
    };

    // Call the API function to submit data
    requestDemoCreate(mainData)
      .then((responseData) => {
        // Log the success data
        console.log('Success data:', responseData);
        // Navigate to the next step if API call succeeds
        navigate("/allset");
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        // Handle error if API call fails
      });
  };


  return (
    <>
      <div className='requestDemoWrap request-calendly-date'>
        <div className='OnboardingStep1'>
          <form>
            <div className="loginPage">
              <div className="boxinfo" style={{ flexDirection: 'column', overflow: 'auto' }}>
                <div className="w-100 p-4">
                  <img src={LoinLogo} alt="Loin Logo" />
                </div>

                <div className="boxLogin w-100">
                  <h2>
                    Yes, I want to <span>sign up</span><br></br> for a demo
                  </h2>
                  <div className="step-progress">
                    <div className="step " ></div>
                    <div className="step" ></div>
                    <div className="step " ></div>
                    <div className="step active" ></div>
                    <div className="step" ></div>
                  </div>

                  <div className='calendly-container' style={{ padding: '0px 60px' }}>
                    <InlineWidget
                      url="https://calendly.com/memate/memate-demo"
                      styles={{
                        width: '100%', border: '1px solid #f2f2f2',
                      }}
                      prefill={{
                        name: `${first_name} ${last_name}`,
                        email: email,
                      }}
                    />
                  </div>
                  <button
                    type='button'
                    className="fillbtn flexcenterbox mt-3"
                    onClick={handleStepOne}>
                    Next Step
                    <img src={arrowRight} alt="Arrow Right" />
                  </button>
                  <div className="linkBottom"><p>Already have an account? <Link to="/login">Sign in</Link></p></div>
                </div>

                <div className="w-100 p-4 footer-copyright">
                  <span className="font-14" style={{ color: '#212529' }}>© Memate {new Date().getFullYear()}</span>
                </div>
              </div>

              <div className="sliderRight SinglBgRight" style={{
                backgroundImage: `url(${request04})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}>
                <p>Predict unprofitable business activities.</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SelectDate;
