import React, { useState } from "react";
import { Check } from "react-bootstrap-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { OnboardingCreateSubscription } from "../../../APIs/OnboardingApi";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import LinepatternBottom from "../../../assets/images/icon/Linepattern.png";
import Linepatterntop from "../../../assets/images/icon/Linepatterntop.png";
import LoinLogo from "../../../assets/images/logo.svg";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const SVGContent = () => {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.6777 25.1831C19.6261 25.1831 25.2586 19.5506 25.2586 12.6021C25.2586 5.65362 19.6261 0.0211182 12.6777 0.0211182C5.72919 0.0211182 0.0966797 5.65362 0.0966797 12.6021C0.0966797 19.5506 5.72919 25.1831 12.6777 25.1831Z" fill="#F7F9FC" />
      <path d="M6.98438 13.4155L10.2378 16.6689L18.3715 8.53528" stroke="url(#paint0_linear_10_91758)" strokeWidth="1.93554" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="paint0_linear_10_91758" x1="12.6779" y1="8.53528" x2="12.6779" y2="16.6689" gradientUnits="userSpaceOnUse">
          <stop stopColor="#21B3FA" />
          <stop offset="1" stopColor="#FFB258" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const Discovermemate = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const [isChecked, setIsChecked] = useState(true);

  if (!uuid) navigate('/onboarding');

  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error(error.message);
      setError(error.message);
    } else {
      console.log("PaymentMethod:", paymentMethod);
      setLoading(true);
      OnboardingCreateSubscription(uuid, { payment_method: paymentMethod.id })
        .then(() => navigate(`/create-password/${uuid}`))
        .catch((err) => {
          console.error("Error submitting form:", err);
          setError(err.message);
        }).finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="requestDemoWrap">
      <div className="OnboardingStep1">
        <form onSubmit={handleSubmit}>
          <div className="loginPage">
            <div className="boxinfo" style={{ overflow: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div className="d-flex w-100 p-4 pb-5">
                <Link to={`${process.env.REACT_APP_STATIC_WEBSITE_URL}`}><img src={LoinLogo} alt="Logo" /></Link>
              </div>

              <div className="boxLogin mb-4">
                <h2 className="mb-3">
                  10-Day <span>Free Trial</span> Discover <span>Memate</span>
                </h2>
                <p style={{ color: '#475467', fontSize: '16px' }}>Your card won’t be charged unless you choose to continue after the trial period. You can cancel anytime before the trial ends — no questions asked. </p>
                <div className="step-progress">
                  <div className="step"></div>
                  <div className="step"></div>
                  <div className="step"></div>
                  <div className="step"></div>
                  <div className="step active"></div>
                </div>
                <label style={{ fontWeight: '600', color: '#1D2939', fontSize: '16px' }}>Payment Details</label>
                <div className="formBoxDiscover mb-2">
                  <div className="formgroup mb-3">
                    <label>Name on card<span style={{ color: "#f04438" }}>*</span></label>
                    <div className={`inputInfo ${error ? "error-border" : name ? "successBorder" : ""}`}>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <img className="ExclamationCircle" src={exclamationCircle} alt="Error" />
                    </div>
                  </div>
                  <label>Card<span style={{ color: "#f04438" }}>*</span></label>
                  <div className="border rounded" style={{ padding: '13px 15px' }}>
                    <CardElement
                      options={{
                        hidePostalCode: true
                      }}
                    />
                  </div>

                  {error && <p className="error-message">{error}</p>}
                </div>

                <div style={{ borderRadius: '8px', border: '1px solid #BAE8FF', background: '#F2FAFF', color: '#0A4766', padding: '16px', fontSize: '14px' }}>You’re signing up for a free trial — no charge today.</div>

                <div className="d-flex gap-2 mt-1">
                  <label className="customCheckBox">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    <span className="checkmark">
                      <Check color="#1ab2ff" size={20} />
                    </span>
                  </label>
                  <p className="mt-3 mb-0 termconditionP">
                    By selecting "Start Free Trial", I authorise meMate to charge my payment method on {new Date(Date.now() + 10 * 864e5).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} and monthly after that at the then-current price plus tax. I can cancel / change  anytime by going to the Subscription page in Account Settings. I agree to the <span style={{ color: '#158ECC', fontWeight: '600' }}>terms</span> and have read and acknowledged <span style={{ color: '#158ECC', fontWeight: '600' }}>privacy statement</span>
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading || !isChecked}
                  className="fillbtn flexcenterbox"
                >
                  {loading ? "Processing..." : "Next Step"}
                  {!loading && <img src={arrowRight} alt="Arrow Right" />}
                </button>
              </div>

              <div className="copy-write w-100 text-start p-4 pt-5">© Memate {new Date().getFullYear()}</div>
            </div>
            <div
              className="sliderRight BusinessPlanwrap"
              style={{
                backgroundImage: `url(${LinepatternBottom}), url(${Linepatterntop})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left bottom, right top",
                overflow: 'auto',
                padding: '40px 20px',
              }}
            >

              <div className="BusinessPlanBox" style={{ position: "relative", marginTop: '100px' }}>
                <div className="badgePlan" style={{ position: "absolute", top: "-15px", left: "40%", fontSize: "12px", color: "#344054", fontWeight: '500' }}>
                  Cancel Anytime
                </div>
                <div className="headPlan">
                  <h1>Business + Work</h1>
                  <p>Everything in Business + Employee and Contractor Management.</p>
                  <div className="d-flex align-items-center"><h3>$162.17</h3> <span>/monthly</span></div>
                </div>
                <div className="listPlan">
                  <ul>
                    <li><SVGContent />&nbsp;Client Management</li>
                    <li><SVGContent />&nbsp;Supplier Management</li>
                    <li><SVGContent />&nbsp;Sales Pipeline</li>
                    <li><SVGContent />&nbsp;Project Management</li>
                    <li><SVGContent />&nbsp;Internal Chat</li>
                    <li><SVGContent />&nbsp;Invoicing</li>
                    <li><SVGContent />&nbsp;Statistic Reports</li>
                    <li><SVGContent />&nbsp;Profitability and Budgeting</li>
                    <li><SVGContent />&nbsp;Expenses</li>
                  </ul>
                  <ul>
                    <li><SVGContent />&nbsp;Employee Management</li>
                    <li><SVGContent />&nbsp;Time Sheets & Tracker</li>
                    <li><SVGContent />&nbsp;Contractor Management</li>
                    <li><SVGContent />&nbsp;Job Scheduling</li>
                    <li><SVGContent />&nbsp;Company News</li>
                    <li><SVGContent />&nbsp;Task Management</li>
                    <li><SVGContent />&nbsp;Company Calendar</li>
                  </ul>
                </div>
                <p>
                  Get started with no upfront cost. Your{" "}
                  <strong>subscription begins in 10 days</strong>, allowing you to explore our services
                  without immediate charges.
                </p>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const DiscovermemateWrapper = () => (
  <Elements stripe={stripePromise}>
    <Discovermemate />
  </Elements>
);

export default DiscovermemateWrapper;
