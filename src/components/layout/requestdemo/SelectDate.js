import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import datecal from "../../../assets/images/datecal.png";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import "./requestademo.css"
import LoinLogo from "../../../assets/images/logo.svg";
import request04 from "../../../assets/images/img/request04.jpg";
import { useLocation } from 'react-router-dom';
import { requestDemoCreate } from "../../../APIs/OnboardingApi";
import { InlineWidget } from "react-calendly";


const SelectDate = () => {
  const location = useLocation();
  const { first_name, last_name, country, phone, email, company_name, company_description, company_size, is_agree_marketing } = location.state;
  const navigate = useNavigate();
  const [date, setDate] = useState('');

  const handleStepOne = () => {
    // if (date.trim() === '') {
    //   setDate('Select Date');
    //   return;
    // }

    // Create an object containing all the data
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
                    Yes, I want to <span>sign up</span><br></br> for a demo
                  </h2>
                  <div className="step-progress">
                    <div className="step " ></div>
                    <div className="step" ></div>
                    <div className="step " ></div>
                    <div className="step active" ></div>
                    <div className="step" ></div>
                  </div>
                  <div className="formgroup ">
                  
                   
                  </div>
      
                 
                  <InlineWidget 
        url="https://calendly.com/memate/memate-demo" 
        styles={{ height: '700px' }} 
      />

                 {/* <img className="" src={datecal} alt="datecal" /> */}
                  <button
                    type='button'
                    className="fillbtn flexcenterbox"
                    onClick={handleStepOne}>
                    Next Step
                    <img src={arrowRight} alt="Arrow Right" />
                  </button>
                  <div className="linkBottom"><p>Already have an account? <Link to="set-new-password">Sign in</Link></p></div>
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
