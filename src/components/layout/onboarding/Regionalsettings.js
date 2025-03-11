import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import timezones from './timezones.json';
import { OnboardingCreateOrganisation } from "../../../APIs/OnboardingApi";
import arrowRight from "../../../assets/images/icon/arrow.svg";
import RegionalSettings from "../../../assets/images/img/emailSlider03.jpg";
import LoinLogo from "../../../assets/images/logo.svg";

const Regionalsettings = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const email = new URLSearchParams(useLocation().search).get("email");
  const company_name = new URLSearchParams(useLocation().search).get("company_name");
  const [timezonesOptions, setTimezonesOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");


  useEffect(() => {
    if (!company_name) {
      navigate(`/company-name/${uuid}?email=${email}`);
    }
  }, [company_name, email, uuid]);

  useEffect(() => {
    if (country) {
      const findData = timezones.find((timezone) => timezone.name === country);
      setTimezonesOptions(Object.keys(findData?.timezones || {}));
    }
  }, [country]);

  const handleNext = async () => {
    setError("");
    if (!country || !timezone) {
      setError("Please select both country and timezone.");
      return;
    }

    setLoading(true);

    try {
      const data = { name: company_name, country, timezone };
      const response = await OnboardingCreateOrganisation(uuid, data);
      navigate(`/discover-memate/${uuid}`);
    } catch (error) {
      setError(error.message || "Failed to proceed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                    Customize Your<br></br> Regional <span>Settings</span>
                  </h2>
                  <div className="step-progress">
                    <div className="step"></div>
                    <div className="step"></div>
                    <div className="step"></div>
                    <div className="step active"></div>
                    <div className="step"></div>
                  </div>
                  <div className="formgroup timezoneWrapGroup">
                    <label>Country</label>
                    <Dropdown
                      value={country}
                      options={timezones.map((timezone) => ({ value: timezone.name, label: timezone.name }))}
                      placeholder="Select country"
                      className='w-100 rounded'
                      onChange={(e) => setCountry(e.value)}
                      filter
                    />
                  </div>
                  <div className="formgroup removeBorder1">
                    <label>Timezone</label>
                    <Dropdown
                      value={timezone}
                      options={timezonesOptions.map((option) => ({ value: option, label: option }))}
                      placeholder="Select timezone"
                      className='w-100'
                      onChange={(e) => setTimezone(e.value)}
                    />
                  </div>
                  {error && <p className="error-message">{error}</p>}
                  <button
                    type='button'
                    className="fillbtn flexcenterbox"
                    onClick={handleNext}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Next Step"}
                    {!loading && <img src={arrowRight} alt="Arrow Right" />}
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
