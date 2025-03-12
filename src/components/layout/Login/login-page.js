import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authenticateUser } from "../../../APIs/LoginApi";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import envelopeIcon from "../../../assets/images/icon/envelope.svg";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import unlockIcon from "../../../assets/images/icon/unlock.svg";
import loginSlide from "../../../assets/images/img/loginslidebg.png";
import LoinLogo from "../../../assets/images/logo.svg";
import Header from "../Header";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [authError, setAuthError] = useState(null); // For API-level errors

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form submission and page refresh

    // Reset errors
    setEmailError(null);
    setPasswordError(null);
    setAuthError(null);

    // Email validation
    let isValid = true;
    if (!email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError("Password is required.");
      isValid = false;
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const { success } = await authenticateUser(email, password);
      console.log("success: ", success);

      if (success) {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        navigate("/"); // Redirect to home page
      } else {
        setAuthError("Invalid email or password.");
      }
    } catch (error) {
      setAuthError("An error occurred during login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <div className="loginPage">
          <div className="boxinfo">
            <div className="logohead">
              <img src={LoinLogo} alt="Loin Logo" />
            </div>
            <div className="boxLogin">
              <h2>
                Login to <span>MeMate</span>
              </h2>
              <div className="formgroup">
                <label>Email</label>
                <div
                  className={`inputInfo ${emailError ? "error-border" : email ? "successBorder" : ""
                    }`}
                >
                  <img src={envelopeIcon} alt="Envelope Icon" />
                  <input
                    type="text"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  <img
                    className="ExclamationCircle"
                    src={exclamationCircle}
                    alt="Exclamation Circle"
                  />
                </div>
                {emailError && <p className="error-message">{emailError}</p>}
              </div>
              <div className="formgroup">
                <label>Password</label>
                <div
                  className={`inputInfo ${passwordError ? "error-border" : email ? "successBorder" : ""
                    }`}
                >
                  <img src={unlockIcon} alt="Unlock Icon" />
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <img
                    className="ExclamationCircle"
                    src={exclamationCircle}
                    alt="Exclamation Circle"
                  />
                </div>
                {passwordError && <p className="error-message">{passwordError}</p>}
                {authError && <p className="error-message">{authError}</p>}
              </div>
              <Link to="/forgot-password" className="textbtn">
                Forgot password
              </Link>
              <button
                type="submit"
                className="fillbtn flexcenterbox"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
                <img src={arrowRight} alt="Arrow Right" />
              </button>
              <p className="loading">
                {isLoading ? "Logging in..." : "Login"}
              </p>
            </div>
            <div className="copywrite">© Memate {new Date().getFullYear()}</div>
          </div>
          <div
            className="sliderRight SinglBgRight"
            style={{
              backgroundImage: `url(${loginSlide})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "bottom",
            }}
          >
            <p>Reduce admin work at every stage.</p>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;