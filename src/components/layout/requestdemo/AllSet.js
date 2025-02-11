
import React from 'react';
import { Link } from "react-router-dom";
import {CheckCircle} from "react-bootstrap-icons";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import "./requestademo.css"
import LoinLogo from "../../../assets/images/logo.svg";
import request05 from "../../../assets/images/img/request05.jpg";

const AllSet = () => {

  return (
    <>
       <div className='requestDemoWrap requestAllset'>
    <div className="logohead">
                  <img src={LoinLogo} alt="Loin Logo" />
                </div>
                <div className="copywrite">© Memate {new Date().getFullYear()}</div>
     <div className='OnboardingStep1'>
           <form>
            <div className="loginPage">
            <div className="boxinfo">
       <div className="boxLogin">
       <div className="envolpicon">
       <CheckCircle color='#344054' size={24} />
         </div>
         <h2>You're All <span>Set!</span></h2>
         <div>
           <form >
            <p>One of our team members will reach out to you shortly.</p> 
            <Link className="fillbtn flexcenterbox" to="/login">Continue <img src={arrowRight} alt="Arrow Right" /></Link> 
           </form>
         </div>
       </div>
     </div>
              <div className="sliderRight SinglBgRight" style={{
          backgroundImage: `url(${request05})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}>
          <p>Predict unprofitable business activities.</p>
        </div>
            </div> 
          </form>
          </div>
          </div>
    </>
  );
};

export default AllSet;