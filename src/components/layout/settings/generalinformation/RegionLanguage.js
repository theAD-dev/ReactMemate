import React, { useState, useEffect } from "react";
import { PencilSquare } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "sonner";
import styles from "./general.module.scss";
import currency from './lib/currency.json';
import timezones from './lib/timezones.json';
import Sidebar from ".././Sidebar";
import { getCountries } from "../../../../APIs/ClientsApi";
import { getReginalAndLanguage, updateReginalAndLanguage } from "../../../../APIs/SettingsGeneral";
import { useTrialHeight } from "../../../../app/providers/trial-height-provider";



const RegionLanguage = () => {
  const { trialHeight } = useTrialHeight();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("generalinformation");
  const [timezonesOptions, setTimezonesOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);

  const [country, setCountry] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const countriesQuery = useQuery({ queryKey: ['countries'], queryFn: getCountries, enabled: true });
  const reginalAndLanguageQuery = useQuery({ queryKey: ['getReginalAndLanguage'], queryFn: getReginalAndLanguage, enabled: true, staleTime: 1000 });

  const mutation = useMutation({
    mutationFn: (data) => updateReginalAndLanguage(data),
    onSuccess: () => {
      reginalAndLanguageQuery.refetch();
      toast.success(`Reginal and language updated successfully`);
    },
  });

  const handleUpdate = async () => {
    await mutation.mutateAsync({
      country: country,
      timezone,
      currency: selectedCurrency
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (country) {
      const findData = timezones.find((timezone) => timezone.name === country);
      setTimezonesOptions(Object.keys(findData?.timezones || {}));

      const findCurrency = currency.find((data) => data.name === country);
      setCurrencyOptions([findCurrency]);
      setSelectedCurrency(`${findCurrency?.currency?.code}`);
    }
  }, [country]);

  useEffect(() => {
    if (reginalAndLanguageQuery?.data) {
      setCountry(reginalAndLanguageQuery?.data?.country);
      setTimezone(reginalAndLanguageQuery?.data?.timezone);
    }
  }, [reginalAndLanguageQuery?.data]);



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
            className={`content_wrap_main ${isEditing ? "isEditingwrap" : ""}`} style={{ paddingBottom: `${trialHeight}px` }}
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
                      <strong>{reginalAndLanguageQuery?.data?.country === 1 && 'Australia'}</strong>
                    ) : (
                      <Dropdown
                        value={country}
                        options={(countriesQuery && countriesQuery.data?.map((country) => ({
                          value: country.id,
                          label: country.name
                        }))) || []}
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
                      <strong>{reginalAndLanguageQuery?.data?.timezone}</strong>
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
                      <strong>{reginalAndLanguageQuery?.data?.currency}</strong>
                    ) : (
                      <span>{currencyOptions[0]?.currency?.code}</span>
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
                Save {" "}
                {mutation?.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionLanguage;
