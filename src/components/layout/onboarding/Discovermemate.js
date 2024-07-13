import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import "./org.css"
import LoinLogo from "../../../assets/images/logo.svg";
import { useLocation } from 'react-router-dom';
import Checkicon from "../../../assets/images/icon/Checkicon.png";
import { OnboardingSubscription } from "../../../APIs/OnboardingApi";
import LinepatternBottom from "../../../assets/images/icon/Linepattern.png";
import Linepatterntop from "../../../assets/images/icon/Linepatterntop.png";

const Discovermemate = () => {
  const location = useLocation();
  const { uuid} = location.state;
  const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [name,setName] = useState('')
    const [number,setNumber] = useState('')
    const [month,setMonth] = useState('')
    const [year,setYear] = useState('')
    const [cvv,setCvv] = useState('')
    const [coupon,setCoupon] = useState('')



  const handleSubscription = () => {
    const mainData = {
      "name": name,
      "number": number,
      "month": month,
      "year": year,
      "cvv": cvv,
      "coupon": "123456"
      
  };
 // Call the API function to submit data
 OnboardingSubscription(mainData,uuid)
 .then((responseData) => {
   // Log the success data
   console.log('Success data:', responseData);
   // Navigate to the next step if API call succeeds
   navigate("/login");
 })
 .catch((error) => {
   console.error("Error submitting form:", error);
   // Handle error if API call fails
 });

    navigate("/login");

  };

  return (
    <>
      <div className='requestDemoWrap'>
        <div className="logohead">
          <img src={LoinLogo} alt="Loin Logo" />
        </div>
        <div className="copywrite">© Memate 2024</div>
        <div className='OnboardingStep1'>
          <form>
            <div className="loginPage">
              <div className="boxinfo">
                <div className="boxLogin">
                <h2>
                    10-Day <span>Free Trial</span> Discover <span>Memate</span> 
                    </h2>
                  <div className="step-progress">
                    <div className="step " ></div>
                    <div className="step" ></div>
                    <div className="step " ></div>
                    <div className="step" ></div>
                    <div className="step active" ></div>

                  </div>
                  <div className="formgroup">
                    <label>Name on card</label>
                    <div className={`inputInfo ${error ? "error-border" : name ? "successBorder" : ""}`}>
                      <input
                        type="text"
                        name='name'
                        placeholder="Full name "
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                          
                          }}
                       />
                      <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle"/>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                  </div>
                   <div className="formgroup">
                    <label>Card number</label>
                    <div className={`inputInfo ${error ? "error-border" : number ? "successBorder" : ""}`}>
                    {/* <img className="Paymentmethodicon" src={Paymentmethodicon} alt="Paymentmethodicon"/> */}
                      <input 
                      type="text" 
                      name='number'
                      minLength={16}
                      maxLength={16}
                      placeholder="Card number" 
                      value={number} 
                      onChange={(e) => {
                        setNumber(e.target.value);
                      }}
                      />
                      <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle"/>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                  </div>
                  <div className='colgridpaymentwrap'>
                  <div className="formgroup">
                    <label>Expiry</label>
                    <div className={`inputInfo ${error ? "error-border" : month ? "successBorder" : ""}`}>
                    <input 
                              type="text" 
                              name='month'
                              minLength={2}
                              maxLength={2}
                              placeholder="MM" 
                              value={month} 
                              onChange={(e) => {
                                  const enteredValue = e.target.value;
                                  // Check if enteredValue is a number and between 1 and 12
                                  if (!isNaN(enteredValue) && parseInt(enteredValue) >= 1 && parseInt(enteredValue) <= 12) {
                                      setMonth(enteredValue);
                                  }
                              }}
                          />
                      <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle"/>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                  </div>
                  <div className="formgroup middle">
                  <label></label>
                    <div className={`inputInfo ${error ? "error-border" : year ? "successBorder" : ""}`}>
                      <input 
                      type="text" 
                      name='year'
                      minLength={2}
                      maxLength={2}
                      placeholder="YY" 
                      value={year} 
                      onChange={(e) => {
                        setYear(e.target.value);
                      }}
                      />
                      <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle"/>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                  </div>
                  <div className="formgroup">
                  <label>CVV</label>
                    <div className={`inputInfo ${error ? "error-border" : cvv ? "successBorder" : ""}`}>
                     
                    <input 
                        type="password" 
                        name='cvv'
                        placeholder=""
                        minLength={3}
                        maxLength={3}
                        value={cvv} 
                        onChange={(e) => {
                            setCvv(e.target.value);
                          }}
                      />
                      <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle"/>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                  </div>
                  </div>
                  <div className="formgroup">
                    <label>Coupon</label>
                    <div className={`inputInfo ${error ? "error-border" : coupon ? "successBorder" : ""}`}>
                      <input 
                      type="text" 
                      name='coupon'
                      placeholder="Add Coupon" 
                      value={coupon} 
                      onChange={(e) => {
                        setCoupon(e.target.value);
                      }}
                      />
                      <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle"/>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                  </div> 
                
                 
                  <button type='submit'
                className="fillbtn flexcenterbox"
                onClick={()=>handleSubscription()}>Next Step
                <img src={arrowRight} alt="Arrow Right" />
               </button>

                </div>
              </div>
              <div className="sliderRight BusinessPlanwrap" style={{ 
                  backgroundImage: `url(${LinepatternBottom}), url(${Linepatterntop})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'left bottom, right top'
                }}>
                <div className="BusinessPlanBox">
                <div className="headPlan">
                <h1>Business Plan</h1>
                <h3>Billed monthly.</h3>
                <p>$99/mth + GST</p>
                </div>
               <div className='listPlan'>
               <ul>
                  <li><img src={Checkicon} alt="Checkicon" />Includes all features of MeMate</li>
                  <li><img src={Checkicon} alt="Checkicon" />Project Management</li>
                  <li><img src={Checkicon} alt="Checkicon" />Real Time Cost Breakdown</li>
                  <li><img src={Checkicon} alt="Checkicon" />Work</li>
                  <li><img src={Checkicon} alt="Checkicon" />Invoicing</li>
                  <li><img src={Checkicon} alt="Checkicon" />Quoting</li>
                  <li><img src={Checkicon} alt="Checkicon" />Sales Activities</li>
                </ul>
                <ul>
                  <li><img src={Checkicon} alt="Checkicon" />Company Performance and Reports</li>
                  <li><img src={Checkicon} alt="Checkicon" />Customer Database</li>
                  <li><img src={Checkicon} alt="Checkicon" />Project Database</li>
                  <li><img src={Checkicon} alt="Checkicon" />Company Target Reports</li>
                  <li><img src={Checkicon} alt="Checkicon" />Expense Management</li>
                  <li><img src={Checkicon} alt="Checkicon" />Outstanding Accounts Tracking</li>
                  <li><img src={Checkicon} alt="Checkicon" />Custom Flagging and Alerts</li>
                </ul>
               </div>
                <p>Get started with no upfront cost. Your <strong>subscription begins in 10 days</strong>, allowing you to fully explore our services without any immediate charges.</p>
                </div>
                </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Discovermemate;
