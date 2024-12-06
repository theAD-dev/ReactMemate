import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import envelopeIcon from "../../../assets/images/icon/envelope.svg";
import "./org.css";
import LoinLogo from "../../../assets/images/logo.svg";
import VideoPlayer from './VideoPlayer';
import businessVideo from "../../../assets/images/businessVideo.mp4"
import { OnboardingCreateApi ,onboardingNextStep } from "../../../APIs/OnboardingApi";

const Create = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState(null);
  const [uuid,setUuid] = useState('')
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
const emaildata = formData.email
 // Function to handle form field changes
 const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

// Function to handle form submission
const handleSubmit = (e) => {
  // Email validation using regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Email validation using regex
if (formData.email.trim() === '') {
  setEmailError("This is an error message.");
  return; // Exit function if email is empty
} else if (formData.email.trim().length !== formData.email.length) {
  setEmailError("Email cannot contain spaces only.");
  return; // Exit function if email contains only spaces
} else if (!emailPattern.test(formData.email.trim())) {
  setEmailError("Please enter a valid email address.");
  return; // Exit function if email is invalid
}

  // API call to create user
  OnboardingCreateApi(formData)
  .then((uuidResponse) => {
    if (typeof uuidResponse === "string" && uuidResponse.includes("email")) {
      const errorMessage = JSON.parse(uuidResponse).email;
      setEmailError(errorMessage); // Display the API error message
    } else {
      const parsedObject = JSON.parse(uuidResponse);
      const newUuid = parsedObject.uuid;
      setUuid(newUuid);

      onboardingNextStep(newUuid).then((nextStepResponse) => {
          console.log('nextStepResponse: ', nextStepResponse);
          const jsonResponse = JSON.parse(nextStepResponse);
          console.log('nextStepResponse: ', jsonResponse.step);
          //const nextStepData = nextStepResponse;
         switch (jsonResponse.step) {
            case 2:
              // Navigate to the verification page
              navigate("/verify-mail", { state: { uuid: newUuid, emaildata: formData.email} });
              break;
            case 3:
              // Navigate to the next step page
              navigate("/company-name", { state: { uuid: newUuid} });
              break;
            case 4:
              // Navigate to the next step page
              navigate("/discover-memate", { state: { uuid: newUuid} });
              break;
            default:
              // Navigate to the verification page by default
              navigate("/discover-memate", { state: { uuid: newUuid} });
              break;
          }
        })
        .catch((error) => {
          console.error("Error fetching next step:", error);
          // Navigate to the verification page by default
          navigate("/verify-mail", { state: { uuid: newUuid, emaildata: formData.email } });
        });
    }
  });
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
                  Start Your <span>Journey</span> <br></br>with <span>MeMate</span>
                  </h2>
                  <div className="step-progress">
                    <div className="step active"></div>
                    <div className="step"></div>
                    <div className="step"></div>
                    <div className="step"></div>
                    <div className="step"></div>
                  </div>
                  <div className="formgroup">
                    <label>First Name</label>
                    <div className={`inputInfo `}>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>
                  <div className="formgroup">
                    <label>Last Name</label>
                    <div className={`inputInfo `}>
                      <input
                       type="text"
                       name="last_name"
                       value={formData.last_name}
                       onChange={handleInputChange}
                       placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div className="formgroup">
                    <label>Email</label>
                    <div className={`inputInfo ${emailError ? "error-border" : formData.email ? "successBorder" : ""}`}>
                      <img src={envelopeIcon} alt="Envelope Icon" />
                      <input
                       type="email"
                       name="email"
                       value={formData.email}
                       onChange={handleInputChange}
                       placeholder="example@gmail.com"
                      />
                      <img
                        className="ExclamationCircle"
                        src={exclamationCircle}
                        alt="Exclamation Circle"/>
                    </div>
                    {emailError && <p className="error-message">{emailError}</p>}
                  </div>
                  <button
                    type='button'
                    className="fillbtn flexcenterbox"
                    onClick={() => handleSubmit()}
                  >
                    Next Step
                    <img src={arrowRight} alt="Arrow Right" />
                  </button>
                 
                </div>
              </div>
              <div className="sliderRight SinglBgRight">
              <VideoPlayer videoUrl={businessVideo} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Create;
