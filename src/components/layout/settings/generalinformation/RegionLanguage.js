import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./general.module.scss";
import { PencilSquare } from "react-bootstrap-icons";
import Sidebar from ".././Sidebar";
import timezones from './timezones.json';
import { Dropdown } from "primereact/dropdown";

const RegionLanguage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("generalinformation");
  const [timezonesOptions, setTimezonesOptions] = useState([]);

  const [country, setCountry] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const handleUpdate = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (country) {
      const findData = timezones.find((timezone) => timezone.name === country);
      setTimezonesOptions(Object.keys(findData?.timezones || {}));
    }
  }, [country]);

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
              <div className={`listwrapper ${styles.listwrapp}`}>
                <div className="topHeadStyle">
                  <div className="">
                    <h2>Region & Language</h2>
                    {isEditing && <p>Select your Country, Timezone, and Currency to ensure accurate localization and a seamless experience.</p>}
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
                      <Dropdown
                        value={country}
                        options={timezones.map((timezone) => ({ value: timezone.name, label: timezone.name }))}
                        placeholder="Select country"
                        className='w-100 rounded'
                        onChange={(e) => setCountry(e.value)}
                        filter
                      />
                    )}
                  </li>
                  <li>
                    <span>Timezone</span>
                    {!isEditing ? (
                      <strong>Timezone</strong>
                    ) : (
                      <Dropdown
                        value={timezone}
                        options={timezonesOptions.map((option) => ({ value: option, label: option }))}
                        placeholder="Select timezone"
                        className='w-100'
                        onChange={(e) => setTimezone(e.value)}
                      />
                    )}
                  </li>
                  <li>
                    <span>Currency</span>
                    {!isEditing ? (
                      <strong>Currency</strong>
                    ) : (
                      <></>
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
