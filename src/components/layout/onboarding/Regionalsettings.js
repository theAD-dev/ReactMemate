import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import timezones from './timezones.json';
import { getCountries, getStates, getCities } from '../../../APIs/ClientsApi';
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
  const [fieldErrors, setFieldErrors] = useState({});

  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostCode] = useState("");
  const [countryId, setCountryId] = useState(1);
  const [stateId, setStateId] = useState('');

  const countriesQuery = useQuery({ queryKey: ['countries'], queryFn: getCountries });
  const statesQuery = useQuery({ queryKey: ['states', countryId], queryFn: () => getStates(countryId), enabled: !!countryId });
  const citiesQuery = useQuery({ queryKey: ['cities', stateId], queryFn: () => getCities(stateId), enabled: !!stateId });

  useEffect(() => {
    if (!company_name) {
      navigate(`/company-name/${uuid}?email=${email}`);
    }
  }, [company_name, email, uuid]);

  useEffect(() => {
    if (countryId) {
      const findData = timezones.find((timezone) => timezone.id === countryId);
      setTimezonesOptions(Object.keys(findData?.timezones || {}));
      setCountry(findData?.name);
    }
  }, [countryId]);

  const handleNext = async () => {
    setError("");
    const errors = {};

    if (!countryId) errors.country = "Country is required.";
    if (!stateId) errors.state = "State is required.";
    if (!city) errors.city = "City is required.";
    if (!address.trim()) errors.address = "Street address is required.";
    if (!postcode.trim()) errors.postcode = "Postcode is required.";
    if (!timezone) errors.timezone = "Timezone is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const data = { name: company_name, country, timezone, city, address, postcode };
      await OnboardingCreateOrganisation(uuid, data);
      navigate(`/discover-memate/${uuid}`);
    } catch (error) {
      setError(error.message || "Failed to proceed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>MeMate - Onboarding - Regional Settings</title>
      </Helmet>
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
                    Customize Your<br /> Regional <span>Settings</span>
                  </h2>
                  <div className="step-progress">
                    <div className="step"></div>
                    <div className="step"></div>
                    <div className="step"></div>
                    <div className="step active"></div>
                    <div className="step"></div>
                  </div>

                  {/* Country */}
                  <div className="formgroup timezoneWrapGroup">
                    <label>Country<span style={{ color: "#f04438" }}>*</span></label>
                    <Dropdown
                      value={countryId}
                      options={countriesQuery?.data?.map((country) => ({
                        value: country.id,
                        label: country.name
                      })) || []}
                      style={{ height: '46px' }}
                      loading={countriesQuery?.isFetching}
                      placeholder="Select a country"
                      className={clsx('w-100 dropdown-height-fixed customDropdownSelect', {
                        'border-danger': fieldErrors.country,
                      })}
                      onChange={(e) => setCountryId(e.value)}
                      filter
                      filterInputAutoFocus={true}
                    />
                    {fieldErrors.country && <small className="error-message">{fieldErrors.country}</small>}
                  </div>

                  {/* Address */}
                  <div className="formgroup">
                    <label>Street Address</label>
                    <InputText
                      value={address}
                      className={`customInputText ${fieldErrors.address ? 'error-border' : ''}`}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder='Enter street address'
                    />
                    {fieldErrors.address && <small className="error-message">{fieldErrors.address}</small>}
                  </div>

                  {/* State + City */}
                  <Row>
                    <Col sm={6} className='pe-0'>
                      <div className="formgroup">
                        <label>State<span style={{ color: "#f04438" }}>*</span></label>
                        <Dropdown
                          value={stateId}
                          options={statesQuery?.data?.map((state) => ({
                            value: state.id,
                            label: state.name
                          })) || []}
                          onChange={(e) => setStateId(e.value)}
                          className={`w-100 dropdown-height-fixed customDropdownSelect ${fieldErrors.state ? 'error-border' : ""}`}
                          style={{ height: '46px' }}
                          loading={statesQuery?.isFetching}
                          placeholder={"Select a state"}
                          filter
                          filterInputAutoFocus={true}
                        />
                        {fieldErrors.state && <small className="error-message">{fieldErrors.state}</small>}
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className='formgroup'>
                        <label>City<span style={{ color: "#f04438" }}>*</span></label>
                        <Dropdown
                          value={city}
                          options={citiesQuery?.data?.map((city) => ({
                            value: city.id,
                            label: city.name
                          })) || []}
                          onChange={(e) => setCity(e.value)}
                          style={{ height: '46px' }}
                          className={`w-100 dropdown-height-fixed customDropdownSelect ${fieldErrors.city ? 'error-border' : ""}`}
                          loading={citiesQuery?.isFetching}
                          disabled={citiesQuery?.isFetching}
                          placeholder={"Select a city"}
                          emptyMessage={!stateId ? "Select a state first" : "No cities found"}
                          filter
                          filterInputAutoFocus={true}
                        />
                        {fieldErrors.city && <small className="error-message">{fieldErrors.city}</small>}
                      </div>
                    </Col>
                  </Row>

                  {/* Postcode + Timezone */}
                  <Row>
                    <Col sm={6} className='pe-1'>
                      <div className="formgroup">
                        <label>Postcode<span style={{ color: "#f04438" }}>*</span></label>
                        <InputText
                          value={postcode}
                          keyfilter={'int'}
                          className={`customInputText ${fieldErrors.postcode ? "error-border" : ""}`}
                          onChange={(e) => setPostCode(e.target.value)}
                          placeholder='Enter postcode'
                        />
                        {fieldErrors.postcode && <small className="error-message">{fieldErrors.postcode}</small>}
                      </div>
                    </Col>
                    <Col sm={6} className='ps-2'>
                      <div className="formgroup">
                        <label>Timezone<span style={{ color: "#f04438" }}>*</span></label>
                        <Dropdown
                          value={timezone}
                          options={timezonesOptions.map((option) => ({ value: option, label: option }))}
                          placeholder="Select timezone"
                          style={{ height: '46px' }}
                          className={`w-100 ml-2 dropdown-height-fixed customDropdownSelect ${fieldErrors.timezone ? "error-border" : ""}`}
                          onChange={(e) => setTimezone(e.value)}
                          scrollHeight='300px'
                          filterInputAutoFocus={true}
                        />
                        {fieldErrors.timezone && <small className="error-message">{fieldErrors.timezone}</small>}
                      </div>
                    </Col>
                  </Row>

                  {/* Global error */}
                  {error && <p className="error-message mt-2">{error}</p>}

                  {/* Submit Button */}
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

              <div
                className="sliderRight SinglBgRight"
                style={{
                  backgroundImage: `url(${RegionalSettings})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                }}
              >
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
