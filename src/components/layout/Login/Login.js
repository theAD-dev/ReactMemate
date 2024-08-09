import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Login/login.css";
import LoinLogo from "../../../assets/images/logo.svg";
import envelopeIcon from "../../../assets/images/icon/envelope.svg";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import unlockIcon from "../../../assets/images/icon/unlock.svg";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import loginSlide from "../../../assets/images/img/loginSlide.jpg";
import Header from "../Header";
import { authenticateUser } from "../../../APIs/LoginApi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("isLoggedIn") === "true"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Invalid email address.");
        setIsLoading(false);
        return;
      }

      const { success, error } = await authenticateUser(email, password);
      console.log('success: ', success);

      if (success) {
        sessionStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        // Redirect or handle successful login
      } else {
        setError("Invalid credentials.");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };
  return (
    <>
      {isLoggedIn ? (
        <div>
          <Header onClick={handleLogout} isLoggedIn={isLoggedIn} />
        </div>
      ) : (
        <>
          <form>
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
                      className={`inputInfo ${
                        error ? "error-border" : email ? "successBorder" : ""
                      }`}
                    >
                      <img src={envelopeIcon} alt="Envelope Icon" />
                      <input
                        type="text"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                      <img
                        className="ExclamationCircle"
                        src={exclamationCircle}
                        alt="Exclamation Circle"
                      />
                    </div>
                  </div>
                  <div className="formgroup">
                    <label>Password</label>
                    <div
                      className={`inputInfo ${
                        error ? "error-border" : email ? "successBorder" : ""
                      }`}
                    >
                      <img src={unlockIcon} alt="Unlock Icon" />
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                      <img
                        className="ExclamationCircle"
                        src={exclamationCircle}
                        alt="Exclamation Circle"
                      />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {/* {error && (
                      <p className="error-message">
                        {error.includes('email') && 'Invalid email address.'}
                        {error.includes('password') && 'Invalid password.'}
                        {!error.includes('email') && !error.includes('password') && error}
                      </p>
                    )} */}
                  </div>
                  <Link to="forgot-password" className="textbtn">
                    Forgot password
                  </Link>
                  <button
                    className="fillbtn flexcenterbox"
                    onClick={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                    <img src={arrowRight} alt="Arrow Right" />
                  </button>
                  <p className="loading">
                    {isLoading ? "Logging in..." : "Login"}
                  </p>
                </div>
                <div className="copywrite">© Memate 2024</div>
              </div>
              <div
                className="sliderRight SinglBgRight"
                style={{
                  backgroundImage: `url(${loginSlide})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <p>Reduce admin work at every stage.</p>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
};

export default Login;
