import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import arrowRight from "../../../assets/images/icon/arrow.svg";
import "./org.css";
import LoinLogo from "../../../assets/images/logo.svg";
import RegionalSettings from "../../../assets/images/img/emailSlider03.jpg";
import { OnboardingtimeZone } from "../../../APIs/OnboardingApi";
import { useLocation } from 'react-router-dom';

const Regionalsettings = () => {
  const location = useLocation();
  const { company_name ,uuid} = location.state;
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState({ label: 'Australia', value: 'Australia' }); // Default country
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [countries, setCountries] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const countrydata = selectedCountry.label;
  const timezondata = selectedTimezone ? selectedTimezone.label : '';
  const [counteryData, setCounteryData] = useState({
    "name": company_name,
    "country": countrydata,
    "timezone": timezondata 
  });
  

  console.log('counteryData: ', counteryData);

  useEffect(() => {
    const fetchCountriesAndTimezones = async () => {
      try {
        const response = await axios.get(process.env.PUBLIC_URL + '/timezones.json');
        const countryOptions = response.data.map(country => ({
          label: country.name,
          value: country.name,
        }));
        setCountries(countryOptions);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
  
    fetchCountriesAndTimezones();
  }, []);
  

  useEffect(() => {
    // Fetch timezones for the default country on component load
    getTimezonesForCountry(selectedCountry.value);
  }, [selectedCountry]); // Run effect whenever selectedCountry changes
  
  const getTimezonesForCountry = async (countryName) => {
    try {
      const response = await axios.get(process.env.PUBLIC_URL + '/timezones.json');
      const country = response.data.find(country => country.name === countryName);
      if (country) {
        const timezonesArray = Object.entries(country.timezones).map(([timezone, value]) => ({
          label: timezone +" "+value,
          value: timezone +" "+value
        }));
        const keyArr = Object.keys(country.timezones)
  
        const timeArr = []
        keyArr.map((item)=>{
          timeArr.push(item+" "+country.timezones[item])
        })
  
  
        // const timeArr = country.timezones.
        if (timezonesArray!=null) {
          setTimezones(timezonesArray);
        } else {
          console.warn('Timezones data is not an array:', country.timezones);
          setTimezones(country.timezones);
        }
      } else {
        console.warn('Country not found:', countryName);
        setTimezones([]);
      }
    } catch (error) {
      console.error('Error fetching timezones:', error);
      setTimezones([]); // Reset timezones on error
    }
  };

  const handleCountryChange = (selectedOption) => {

    // setSelectedTimezone()
    setSelectedCountry(selectedOption);
    setCounteryData({
      ...counteryData,
      country: selectedOption.value,
    });
    getTimezonesForCountry(selectedOption.value);
  };

// Handle timezone selection
const handleTimezoneChange = (selectedOption) => {
  setSelectedTimezone(selectedOption);
  setCounteryData({
    ...counteryData,
    timezone: selectedOption.value,
  });
};

  const handleSubmittime = (e) => {
    OnboardingtimeZone(counteryData, uuid)
      .then(() => {
        navigate("/discover-memate", { state: { uuid } });
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
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
                    Customize Your<br></br> Regional <span>Settings</span>
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
                    <div className={`inputInfo`}>
                    <Select
                        className='removeBorder'
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        options={countries}
                      />
                    </div>
                  </div>
                  <div className="formgroup removeBorder1">
                    <label>Timezone</label>
                    <div className={`inputInfo`}>
                      {selectedCountry && (
                       <Select
                       className='removeBorder'
                       value={selectedTimezone}
                       onChange={handleTimezoneChange}
                       options={timezones}
                     />
                      )}
                    </div>
                  </div>
                  <button
                    type='button'
                    className="fillbtn flexcenterbox"
                    onClick={handleSubmittime}
                  >
                    Next Step
                    <img src={arrowRight} alt="Arrow Right" />
                  </button>
                </div>
              </div>
              <div className="sliderRight SinglBgRight" style={{
                backgroundImage: `url(${RegionalSettings})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}>
                <p>Helping Australian businesses with digital solutions.</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Regionalsettings;
