import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import LoinLogo from "../../../assets/images/logo.svg";
import Checkicon from "../../../assets/images/icon/Checkicon.png";
import LinepatternBottom from "../../../assets/images/icon/Linepattern.png";
import Linepatterntop from "../../../assets/images/icon/Linepatterntop.png";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { OnboardingCreateSubscription } from "../../../APIs/OnboardingApi";
import "./org.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const Discovermemate = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const stripe = useStripe();
  const elements = useElements();

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
      <div className="logohead">
        <img src={LoinLogo} alt="Logo" />
      </div>
      <div className="copywrite">© Memate {new Date().getFullYear()}</div>
      <div className="OnboardingStep1">
        <form onSubmit={handleSubmit}>
          <div className="loginPage">
            <div className="boxinfo">
              <div className="boxLogin">
                <h2>
                  10-Day <span>Free Trial</span> Discover <span>Memate</span>
                </h2>
                <div className="step-progress">
                  <div className="step"></div>
                  <div className="step"></div>
                  <div className="step"></div>
                  <div className="step"></div>
                  <div className="step active"></div>
                </div>
                <div className="formgroup mb-3">
                  <label>Name on card</label>
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
                <label>Card</label>
                <div className="border rounded" style={{ padding: '13px 15px' }}>
                  <CardElement
                    options={{
                      hidePostalCode: true
                    }}
                  />
                </div>

                {error && <p className="error-message">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="fillbtn flexcenterbox"
                >
                  {loading ? "Processing..." : "Next Step"}
                  {!loading && <img src={arrowRight} alt="Arrow Right" />}
                </button>
              </div>
            </div>
            <div
              className="sliderRight BusinessPlanwrap"
              style={{
                backgroundImage: `url(${LinepatternBottom}), url(${Linepatterntop})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left bottom, right top",
              }}
            >
              <div className="BusinessPlanBox">
                <div className="headPlan">
                  <h1>Business Plan</h1>
                  <h3>Billed monthly.</h3>
                  <p>$99/mth + GST</p>
                </div>
                <div className="listPlan">
                  <ul>
                    <li>
                      <img src={Checkicon} alt="Check" /> Includes all features of MeMate
                    </li>
                    <li>
                      <img src={Checkicon} alt="Check" /> Project Management
                    </li>
                    <li>
                      <img src={Checkicon} alt="Check" /> Real Time Cost Breakdown
                    </li>
                    <li>
                      <img src={Checkicon} alt="Check" /> Work
                    </li>
                    <li>
                      <img src={Checkicon} alt="Check" /> Invoicing
                    </li>
                    <li>
                      <img src={Checkicon} alt="Check" /> Quoting
                    </li>
                    <li>
                      <img src={Checkicon} alt="Check" /> Sales Activities
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <img src={Checkicon} alt="Check" /> Company Performance and Reports
                    </li>
                    <li>
                      <img src={Checkicon} alt="Check" /> Customer Database
                    </li>
                    <li>
                      <img src={Checkicon} alt="Check" /> Project Database
                    </li>
                    <li>
                      <img src={Checkicon} alt="Check" /> Company Target Reports
                    </li>
                    <li>
                      <img src={Checkicon} alt="Check" /> Expense Management
                    </li>
                    <li>
                      <img src={Checkicon} alt="Check" /> Outstanding Accounts Tracking
                    </li>
                    <li>
                      <img src={Checkicon} alt="Check" /> Custom Flagging and Alerts
                    </li>
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
