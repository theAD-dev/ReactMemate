import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CustomVideoPlayer from './VideoPlayer';
import { onboardingNextStep } from "../../../APIs/OnboardingApi";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import envelopeIcon from "../../../assets/images/icon/envelope.svg";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import LoinLogo from "../../../assets/images/logo.svg";

const Create = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required.";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateInputs();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      let response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/onboarding/create/user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        response = await response.json();
        navigate(`/verify-mail/${response?.uuid}?email=${formData.email}`);
      } else {
        response = await response.json();
        if (response?.uuid) {
          const { step } = await onboardingNextStep(response?.uuid);
          if (step === 1) navigate(`/verify-mail/${response?.uuid}?email=${formData.email}`);
          else if (step === 2) navigate(`/company-name/${response?.uuid}?email=${formData.email}`);
          else if (step === 3) navigate(`/discover-memate/${response?.uuid}`);
          else if (step === 4) navigate(`/create-password/${response?.uuid}`);
          else {
            toast.error("Something went wrong");
          }
        } else if (response.error) {
          setErrors({ email: response.error });
        } else {
          toast.error("Something went wrong");
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='requestDemoWrap'>
      <div className="logohead" style={{ zIndex: 10 }}>
        <Link to={`${process.env.REACT_APP_STATIC_WEBSITE_URL}`}><img src={LoinLogo} alt="Loin Logo" /></Link>
      </div>
      <div className="copywrite">© Memate {new Date().getFullYear()}</div>
      <div className='OnboardingStep1'>
        <form>
          <div className="loginPage requestDemoWrapVideoSection">
            <div className="boxinfo w-50">
              <div className="boxLogin">
                <h2>
                  Start Your <span>Journey</span> <br />
                  with <span>MeMate</span>
                </h2>
                <div className="step-progress">
                  <div className="step active"></div>
                  <div className="step"></div>
                  <div className="step"></div>
                  <div className="step"></div>
                  <div className="step"></div>
                </div>
                <div className="formgroup">
                  <label>First Name<span style={{ color: "#f04438" }}>*</span></label>
                  <div className={`inputInfo ${errors.first_name ? "error-border" : ""}`}>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                    />
                  </div>
                  {errors.first_name && <p className="error-message">{errors.first_name}</p>}
                </div>
                <div className="formgroup">
                  <label>Last Name<span style={{ color: "#f04438" }}>*</span></label>
                  <div className={`inputInfo ${errors.last_name ? "error-border" : ""}`}>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                    />
                  </div>
                  {errors.last_name && <p className="error-message">{errors.last_name}</p>}
                </div>
                <div className="formgroup">
                  <label>Email<span style={{ color: "#f04438" }}>*</span></label>
                  <div className={`inputInfo ${errors.email ? "error-border" : ""}`}>
                    <img src={envelopeIcon} alt="Envelope Icon" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@gmail.com"
                    />
                    <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />
                  </div>
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                <button
                  type='button'
                  className="fillbtn flexcenterbox"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Next Step"}
                  {!loading && <img src={arrowRight} alt="Arrow Right" />}
                </button>
              </div>
            </div>
            <div className="videoPlayerWrapSection w-50" style={{ padding: '0px 40px' }}>
              <div className='videoPlayerWrap d-flex flex-column align-items-center' style={{ zIndex: 10 }}>
                <h2 className='videoIntroHeading'>More Business - Less Busyness</h2>
                <div style={{ borderRadius: '24px', zIndex: 100, overflow: 'hidden', border: "7px solid #F6F8FB", background: '#FFF', boxShadow: '0px 3.042px 21.982px 1.521px rgba(26, 178, 255, 0.25), 0px 24.34px 48.68px -9.127px rgba(16, 24, 40, 0.14)', position: 'relative', maxWidth: '1008px', minWidth: '600px', minHeight: '345px' }}>
                  <CustomVideoPlayer />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
