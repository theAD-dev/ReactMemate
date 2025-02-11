import React, { useEffect, useState } from "react";
import "../Login/login.css";
import { useLocation } from "react-router-dom";
import { ArrowLeftShort } from "react-bootstrap-icons";
import LoinLogo from "../../../assets/images/logo.svg";
// import arrowRight from "../../../assets/images/icon/arrow.svg";
import mail01 from "../../../assets/images/icon/mail-01.png";
import { Link } from "react-router-dom";
import checkemail from "../../../assets/images/img/checkemail.jpg";

const CheckMail = () => {
  const [email, setEmail] = useState("");
  // const navigate = useNavigate();

  // const handleResetmain = (e) => {
  //   e.preventDefault();
  //   navigate("/confirm-password");
  // };

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    setEmail(email); // Update email state
  }, [location.search]);

  return (
    <>
      <div className="loginPage checkMail">
        <div className="boxinfo">
          <div className="logohead">
            <img src={LoinLogo} alt="Loin Logo" />
          </div>
          <div className="boxLogin">
            <div className="envolpicon">
              <img src={mail01} alt="mail01" />
            </div>
            <h2>
              Check your <span>email</span>
            </h2>
            <div className="formgroup">
              <form>
                <label>
                  We sent a password reset link to <strong>{email}</strong>
                </label>
                {/* <button className="fillbtn flexcenterbox" type="submit">
                  Next <img src={arrowRight} alt="Arrow Right" />
                </button> */}
                <div className="linkBottom">
                  <p>
                    Didn’t receive the email?{" "}
                    <Link to="set-new-password">Click to resend</Link>
                  </p>
                  <Link className="backToLogin" to="/login" style={{ color: '#475467', fontWeight: '600', fontSize: '14px' }}>
                    <ArrowLeftShort color="#475467" size={20} />
                    Back to log in
                  </Link>
                </div>
              </form>
            </div>
          </div>
          <div className="copywrite">© Memate {new Date().getFullYear()}</div>
        </div>
        <div
          className="sliderRight SinglBgRight"
          style={{
            backgroundImage: `url(${checkemail})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}>
          <p>Rest assured, your security is our top priority.</p>
        </div>
      </div>
    </>
  );
};

export default CheckMail;
