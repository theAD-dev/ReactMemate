import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./general.module.scss";
import Select from "react-select";
import { PencilSquare } from "react-bootstrap-icons";
import Sidebar from ".././Sidebar";

const RegionLanguage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [activeTab, setActiveTab] = useState("generalinformation");
  const [countries, setCountries] = useState([]);
  const [timezones, setTimezones] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [countryData, setCountryData] = useState({
    name: "",
    country: "",
    timezone: "",
    currency: "",
  });

  useEffect(() => {
    const fetchCountriesAndTimezones = async () => {
      try {
        const response = await axios.get(
          process.env.PUBLIC_URL + "/timezones.json"
        );
        const countryOptions = response.data.map((country) => ({
          label: country.name,
          value: country.name,
        }));
        setCountries(countryOptions);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountriesAndTimezones();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      getTimezonesForCountry(selectedCountry.value);
    }
  }, [selectedCountry]);

  const getTimezonesForCountry = async (countryName) => {
    try {
      const response = await axios.get(
        process.env.PUBLIC_URL + "/timezones.json"
      );
      const country = response.data.find(
        (country) => country.name === countryName
      );
      console.log("country-time: ", country);
      if (country) {
        const timezonesArray = Object.entries(country.timezones).map(
          ([timezone, value]) => ({
            label: `${timezone} ${value}`,
            value: `${timezone} ${value}`,
          })
        );
        setTimezones(timezonesArray);
        console.log("timezonesArray: ", timezonesArray);
      } else {
        console.warn("Country not found:", countryName);
        setTimezones([]);
      }
    } catch (error) {
      console.error("Error fetching timezones:", error);
      setTimezones([]);
    }
  };

  useEffect(() => {
    if (selectedCountry) {
      getCurrencyForCountry(selectedCountry.value);
    }
  }, [selectedCountry]);

  const getCurrencyForCountry = async (countryName) => {
    try {
      const response = await axios.get(
        process.env.PUBLIC_URL + "/currency.json"
      );
      const country = response.data.find(
        (country) => country.country === countryName
      );

      if (country) {
        const currencyArray = [
          {
            label: `${country.currency_code} (${country.country})`,
            value: `${country.currency_code} (${country.country})`,
            currency_code: country.currency_code,
          },
        ];

        setCurrency(currencyArray);
      } else {
        console.warn("Country not found:", countryName);
        setCurrency([]);
      }
    } catch (error) {
      console.error("Error fetching currency:", error);
      setCurrency([]);
    }
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    setCountryData({
      ...countryData,
      country: selectedOption.value,
    });
  };

  const handleTimezoneChange = (selectedOption) => {
    setSelectedTimezone(selectedOption);
    setCountryData({
      ...countryData,
      timezone: selectedOption.value,
    });
  };
  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption);
    setCountryData({
      ...countryData,
      currency: selectedOption.value,
    });
  };

  const handleUpdate = () => {
    // Implement update functionality here
    setIsEditing(false); // Assuming editing is done after update
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="settings-wrap">
      <div className="settings-wrapper">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="settings-content">
          <div className="headSticky">
            <h1>Company Information</h1>
            <div className="contentMenuTab">
              <ul>
                <li>
                  <Link to="/settings/generalinformation">
                    General Information
                  </Link>
                </li>
                <li>
                  <Link to="/settings/generalinformation/bank-details">
                    Bank Details
                  </Link>
                </li>
                <li className="menuActive">
                  <Link to="/settings/generalinformation/region-and-language">
                    Region & Language
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`content_wrap_main ${isEditing ? "isEditingwrap" : ""}`}
          >
            <div className="content_wrapper">
            <div className= {`listwrapper ${styles.listwrapp}`}>
                <div className="topHeadStyle">
                  <div className="">
                    <h2>Region & Language</h2>
                    {isEditing && <p>Lorem Ipsum dolores</p>}
                  </div>
                  {!isEditing && (
                    <Link to="#" onClick={() => setIsEditing(true)}>
                      Edit
                      <PencilSquare color="#667085" size={20} />
                    </Link>
                  )}
                </div>
                <ul>
                  <li>
                    <span>Country</span>
                    {!isEditing ? (
                      <strong>Country</strong>
                    ) : (
                      <div className="selectInputWidth">
                        <Select
                          className="removeBorder"
                          value={selectedCountry}
                          onChange={handleCountryChange}
                          options={countries}
                        />
                      </div>
                    )}
                  </li>
                  <li>
                    <span>Timezone</span>
                    {!isEditing ? (
                      <strong>Timezone</strong>
                    ) : (
                      <div className="selectInputWidth">
                        <Select
                          className="removeBorder"
                          value={selectedTimezone}
                          onChange={handleTimezoneChange}
                          options={timezones}
                        />
                      </div>
                    )}
                  </li>
                  <li>
                    <span>Currency</span>
                    {!isEditing ? (
                      <strong>Currency</strong>
                    ) : (
                      <div className="selectInputWidth">
                        <Select
                          className="removeBorder"
                          value={selectedCurrency}
                          onChange={handleCurrencyChange}
                          options={currency}
                        />
                      </div>
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {isEditing && (
            <div className="updateButtonGeneral">
              <button className="cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="save" onClick={handleUpdate}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionLanguage;
