import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import envelopeIcon from "../../../assets/images/icon/envelope.svg";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import request03 from "../../../assets/images/img/request03.jpg";
import LoinLogo from "../../../assets/images/logo.svg";

const options = [
  { value: "1-10", label: "1-10" },
  { value: "11-50", label: "11-50" },
  { value: "51-250", label: "51-250" },
  { value: "251-1000", label: "251-1000" },
  { value: "1000+", label: "1000+" },
];

const CompanyName = () => {
  const location = useLocation();
  const { first_name, last_name, country, phone } = location.state;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [company_name, setCompanyname] = useState("");
  const [company_description, setCompanydescription] = useState("");
  const [company_size, setCompanySize] = useState("");
  const [is_agree_marketing, setAgree] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [checkError, setCheckError] = useState("");

  const handleStepOne = () => {
    // Email validation
    if (!email.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // Checkbox validation
    if (!is_agree_marketing) {
      setCheckError(
        "Please agree to receive marketing communications from MeMate."
      );
      return;
    }

    navigate("/selectdate", {
      state: {
        first_name,
        last_name,
        country,
        phone,
        email,
        company_name,
        company_description,
        company_size,
        is_agree_marketing,
      },
    });
  };

  return (
    <>
      <div className="requestDemoWrap">
        <div className="OnboardingStep1">
          <form>
            <div className="loginPage">
              <div className="boxinfo" style={{ overflow: 'auto', flexDirection: 'column' }}>
                <div className="w-100 p-4">
                  <img src={LoinLogo} alt="Loin Logo" />
                </div>

                <div className="boxLogin">
                  <h2>
                    Yes, I want to <span>sign up</span>
                    <br></br> for a demo
                  </h2>
                  <div className="step-progress">
                    <div className="step "></div>
                    <div className="step"></div>
                    <div className="step active"></div>
                    <div className="step"></div>
                    <div className="step"></div>
                  </div>

                  <div className="formgroup">
                    <label>Email<span style={{ color: "#f04438" }}>*</span></label>
                    <div
                      className={`inputInfo ${emailError ? "error-border" : ""
                        }`}
                    >
                      <img src={envelopeIcon} alt="Envelope Icon" />
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError("");
                        }}
                      />
                      {emailError && (
                        <img
                          className="ExclamationCircle"
                          src={exclamationCircle}
                          alt="Exclamation Circle"
                        />
                      )}
                    </div>
                    {emailError && (
                      <p className="error-message">{emailError}</p>
                    )}
                  </div>
                  <div className="formgroup">
                    <label>Company Legal Name</label>
                    <div className={`inputInfo `}>
                      <input
                        type="text"
                        name="company_name"
                        value={company_name}
                        onChange={(e) => {
                          setCompanyname(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="formgroup">
                    <label>Nature of Business</label>
                    <div className={`inputInfo`}>
                      <textarea
                        rows={4}
                        name="company_description"
                        value={company_description}
                        onChange={(e) => {
                          setCompanydescription(e.target.value);
                        }}
                        placeholder="Describe nature of your business"
                      />
                    </div>
                  </div>
                  <div className="formgroup">
                    <label>Company Size</label>
                    <div className="sizeRadioWrap">
                      {options.map((option) => (
                        <div
                          key={option.value}
                          className={`option inputInfoSizeCheck ${company_size === option.value ? "active" : ""
                            }`}
                        >
                          <input
                            type="radio"
                            className="radioBtn"
                            id={option.value}
                            name="companySize"
                            value={option.value}
                            checked={company_size === option.value}
                            onChange={(e) => {
                              setCompanySize(e.target.value);
                            }}
                          />
                          <label htmlFor={option.value}>{option.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="formgroup">
                    <div className={``}>
                      <label
                        id="inputInfocheckbox"
                        className="inputInfocheckbox"
                      >
                        Yes, I would like to receive marketing communications
                        from MeMate
                        <input
                          type="checkbox"
                          name="is_agree_marketing"
                          checked={is_agree_marketing}
                          onChange={(e) => {
                            setAgree(e.target.value);
                          }}
                        />
                        <span
                          className={`checkmarkdata ${checkError ? "agree_marketing-border" : ""
                            }`}
                        ></span>
                      </label>
                    </div>
                    {checkError && (
                      <p className="error-message">{checkError}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="fillbtn flexcenterbox"
                    onClick={handleStepOne}
                  >
                    Next Step
                    <img src={arrowRight} alt="Arrow Right" />
                  </button>
                  <div className="linkBottom">
                    <p>
                      Already have an account?{" "}
                      <Link to="/login">Sign in</Link>
                    </p>
                  </div>
                </div>

                <div className="w-100 p-4 footer-copyright">
                  <span className="font-14" style={{ color: '#212529' }}>© Memate {new Date().getFullYear()}</span>
                </div>
              </div>

              <div
                className="sliderRight SinglBgRight"
                style={{
                  backgroundImage: `url(${request03})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <p>Predict unprofitable business activities.</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CompanyName;
