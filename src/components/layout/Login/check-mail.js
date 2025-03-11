import React, { useEffect, useState } from "react";
import { ArrowLeftShort } from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "sonner";
import { resetEmail } from "../../../APIs/ProfileResetPasswordApi";
import mail01 from "../../../assets/images/icon/mail-01.png";
import checkemail from "../../../assets/images/img/checkemail.jpg";
import LoinLogo from "../../../assets/images/logo.svg";

const CheckMail = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    setEmail(email);
  }, [location.search]);

  const handleResend = async () => {
    if (!email) return toast.error("No email address found to resend.");

    try {
      setIsLoading(true);
      await resetEmail({ email: email });
      toast.success("Password reset link has been resent to your email.");
    } catch (error) {
      if (error.message === "Not found") {
        toast.error("Email address not found.");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
                <label className="text-center">We've sent a secure password reset link to <strong>{email}</strong> along with detailed instructions to reset your password.
                  <br /><br />
                  If you don't receive it within 5 minutes, check your spam folder or request a resend.
                </label>
                <div className="linkBottom">
                  <p className="d-flex align-items-center gap-1" style={{ width: 'fit-content', margin: 'auto' }}>
                    Didn’t receive the email?{" "}
                    <span onClick={handleResend} className="d-flex align-items-center gap-1" style={{ fontWeight: '600', fontSize: '14px', color: '#158ECC', cursor: 'pointer' }}>
                      Click to resend
                      {
                        isLoading && <ProgressSpinner style={{ width: '15px', height: '15px' }} />
                      }
                    </span>
                  </p>
                  <Link className="backToLogin" to="/login" style={{ color: '#475467', fontWeight: '600', fontSize: '14px', marginTop: '32px' }}>
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
