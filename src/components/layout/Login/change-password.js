import React, { useState } from "react";

import "../Login/login.css";
import { ArrowLeftShort, CheckCircleFill,Eye,EyeSlash } from "react-bootstrap-icons";
import PasswordStrengthBar from "react-password-strength-bar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { ProfileChangePassword } from "../../../APIs/ProfileResetPasswordApi";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import Featuredlockicon from "../../../assets/images/icon/Featuredlockicon.png";
import changepassword from "../../../assets/images/img/changepassword.png";
import LoinLogo from "../../../assets/images/logo.svg";


const ChangePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // State to track password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const { token } = useParams();
  console.log('token: ', token);
  
  const tokenId = `profile/change-password/${token}`;



  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordsMatch(e.target.value === confirmPassword);
    setValidPassword(
      /\d/.test(e.target.value) && // Must contain at least one digit
        /[A-Z]/.test(e.target.value) && // Must contain at least one uppercase character
        /[\W_]/.test(e.target.value) && // Must contain at least one special character
        e.target.value.length >= 20 // Must be at least 20 characters long
    );
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
    // Toggle visibility of confirm password
    const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };

  const handleSubmit = () => {
    // Add your password reset logic here
    if (password === confirmPassword && validPassword) {
    } else {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
      } else if (!validPassword) {
        ProfileChangePassword(password,tokenId);
        navigate("/password-reset");
      }
       
    }
    
  };

  return (
    <>
      <div className="loginPage forgotPage">
        <div className="boxinfo">
          <div className="logohead">
            <img src={LoinLogo} alt="Login Logo" />
          </div>
          <div className="boxLogin">
            <div className="lockIconStyle">
              <img
                className="Featuredlockicon"
                src={Featuredlockicon}
                alt="Featuredlockicon"
              />
              <h2>
              
                Set new <span>Password</span>
              </h2>
             
              <p>
                Your new password must be different from previously used
                passwords.
              </p>
            </div>
            <div className="formgroup">
              <label>Password</label>
              <div className={`inputInfo `}>
                <input
                  type={showPassword ? "text" : "password"} // Conditionally set input type based on showPassword state
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter your password"
                />
                <button
                  className="eyeButton"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
            <>
              <EyeSlash color="#98A2B3" size={20} />
            </>
          ) : (
            <>
             <Eye color="#98A2B3" size={20} />
            </>
          )}
                </button>
              </div>
              <PasswordStrengthBar
                className="PasswordStrengthBar"
                password={password}
                shortScoreWord="weak"
                isRequired={false}
                scoreWords={["very weak", "weak", "okay", "good", "strong"]}
                barColors={["#EAECF0", "#F97066", "#f6b44d", "#2b90ef", "#25c281"]}
              />
              {/* {!validPassword && (
                <p className="error-message">
                  Password must meet the requirements
                </p>
              )} */}
            </div>
            <div className="formgroup">
              <label>Confirm password</label>
              <div className={`inputInfo `}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirm password"
                />
                   <button
                  className="eyeButton"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
            <>
              <EyeSlash color="#98A2B3" size={20} />
            </>
          ) : (
            <>
             <Eye color="#98A2B3" size={20} />
            </>
          )}
                </button>
              </div>
              {passwordsMatch ? null : (
                <p className="error-message">Passwords do not match</p>
              )}
            </div>
            <ul className="activeListPassword">
              <li className={/[A-Z]/.test(password) ? "active" : ""}>
                <CheckCircleFill
                  color="#D0D5DD"
                  size={20}
                  style={{ marginRight: "5px" }}
                />
                One uppercase character
              </li>
              <li className={password.length >= 8 ? "active" : ""}>
                {" "}
                <CheckCircleFill
                  color="#D0D5DD"
                  size={20}
                  style={{ marginRight: "5px" }}
                />
                Must be at least 8 characters
              </li>
              <li className={/[\W_]/.test(password) ? "active" : ""}>
                <CheckCircleFill
                  color="#D0D5DD"
                  size={20}
                  style={{ marginRight: "5px" }}
                />
                Must contain one special character
              </li>
            </ul>
            <button
              className="fillbtn flexcenterbox"
              type="submit"
              onClick={handleSubmit}
            >
              Reset Password{" "}
              <img src={arrowRight} alt="Arrow Right" />
            </button>
            <div className="linkBottom">
              <Link className="backToLogin" to="/login" style={{ color: '#475467', fontWeight: '600', fontSize: '14px' }}>
                <ArrowLeftShort color="#475467" size={20} />
                Back to log in
              </Link>
            </div>
          </div>
          <div className="copywrite">© Memate {new Date().getFullYear()}</div>
        </div>
        <div
          className="sliderRight SinglBgRight"
          style={{
            backgroundImage: `url(${changepassword})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <p>Secure and safe: We're here to ensure your business thrives</p>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
