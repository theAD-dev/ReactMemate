import React from "react";
import { ArrowLeftShort, CheckCircle } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import passwordreset from "../../../assets/images/img/passwordreset.jpg";
import LoinLogo from "../../../assets/images/logo.svg";

const PasswordReset = () => {
  const navigate = useNavigate();
  const handlePassDone = () => {
    navigate("/login");
  };
  return (
    <>
      <Helmet>
        <title>MeMate - Password Reset</title>
      </Helmet>
      <div className="loginPage passwordReset">
        <div className="boxinfo">
          <div className="logohead">
            <img src={LoinLogo} alt="Loin Logo" />
          </div>
          <div className="boxLogin">
            <div className="envolpicon">
              <CheckCircle color="#344054" size={28} />
            </div>
            <h2>
              Password <span>reset</span>
            </h2>
            <p>
              Your password has been successfully reset. Click below to log in
              magically.
            </p>
            <div className="formgroup">
              <form onSubmit={handlePassDone}>
                <button className="fillbtn flexcenterbox" type="submit">
                  Continue <img src={arrowRight} alt="Arrow Right" />
                </button>
                <div className="linkBottom1">
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
            backgroundImage: `url(${passwordreset})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <p>
          You're all set to run your company with the latest management software on the market
          </p>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
