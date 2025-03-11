import React, { useState, useEffect } from 'react';
import { PhoneInput } from 'react-international-phone';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import arrowRight from "../../../assets/images/icon/arrow.svg";
import exclamationCircle from "../../../assets/images/icon/exclamation-circle.svg";
import request02 from "../../../assets/images/img/request02.jpg";
import LoinLogo from "../../../assets/images/logo.svg";
import 'react-international-phone/style.css';

const SelectCountry = () => {

  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState({ value: 'Australia', label: 'Australia' }); // Default select Australia
  const [phone, setPhone] = useState('+61'); // Default phone number for Australia
  const [countryCode, setCountryCode] = useState('AU'); // Default country code for Australia
  const [countriesData, setCountriesData] = useState([]);

  const location = useLocation();

  const { first_name, last_name } = location.state || { first_name: '', last_name: '' };


  const country = selectedCountry.label;

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/timezones.json')
      .then(response => response.json())
      .then(data => {
        setCountriesData(data);
      })
      .catch(error => console.error('Error fetching countries data:', error));
  }, []);

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    const countryData = countriesData.find(country => country.name === selectedOption.value);
    if (countryData) {
      const countryPhoneCode = countryData.phone[0];
      setCountryCode(countryPhoneCode);
      setPhone('+' + countryPhoneCode); // Auto-select phone code
    }
  };

  const handleStepCountry = () => {
    const data = {
      country: selectedCountry,
      phoneNumber: phone
    };
    const jsonData = JSON.stringify(data);
    navigate("/companyname", { state: { data: jsonData, first_name, last_name, country, phone } });
  };

  useEffect(() => {
    if (selectedCountry) {
      const countryData = countriesData.find(country => country.name === selectedCountry.value);
      if (countryData) {
        const countryPhoneCode = countryData.phone[0];
        setCountryCode(countryPhoneCode);
      }
    }
  }, [selectedCountry, countriesData]);

  return (
    <>
      <div className='requestDemoWrap'>
        <div className="logohead">
          <img src={LoinLogo} alt="Loin Logo" />
        </div>
        <div className="copywrite">© Memate {new Date().getFullYear()}</div>
        <div className='OnboardingStep1'>
          <form>
            <div className="loginPage">
              <div className="boxinfo">
                <div className="boxLogin">
                  <h2>
                    Yes, I want to <span>sign up</span><br></br> for a demo
                  </h2>
                  <div className="step-progress">
                    <div className="step"></div>
                    <div className="step active"></div>
                    <div className="step"></div>
                    <div className="step"></div>
                    <div className="step"></div>
                  </div>
                  <div className="formgroup timezoneWrapGroup">
                    <label>Country</label>
                    <div className={`inputInfo `}>
                      <Select
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        options={countriesData.map(country => ({
                          value: country.name,
                          label: country.name,
                        }))}
                      />
                    </div>
                  </div>
                  <div className="formgroup">
                    <label>Phone number</label>
                    <div className={`inputInfo `}>
                      <PhoneInput
                        country={countryCode}
                        value={phone}
                        onChange={setPhone}
                      />
                      <img
                        className="ExclamationCircle"
                        src={exclamationCircle}
                        alt="Exclamation Circle"
                      />
                    </div>
                  </div>
                  <button
                    type='button'
                    className="fillbtn flexcenterbox"
                    onClick={() => handleStepCountry()}
                  >
                    Next Step
                    <img src={arrowRight} alt="Arrow Right" />
                  </button>
                  <div className="linkBottom"><p>Already have an account? <Link to="set-new-password">Sign in</Link></p></div>
                </div>
              </div>
              <div className="sliderRight SinglBgRight" style={{
                backgroundImage: `url(${request02})`,
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

export default SelectCountry;
