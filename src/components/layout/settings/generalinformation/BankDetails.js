import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from ".././Sidebar";
import { PencilSquare } from "react-bootstrap-icons";
import {
  SettingsBankInformation,
  updateBankInformation,
} from "../../../../APIs/SettingsGeneral";

const BankDetails = () => {
  const [activeTab, setActiveTab] = useState("generalinformation");
  const [generalData, setGeneralData] = useState();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await SettingsBankInformation();

        setGeneralData(JSON.parse(data));
      } catch (error) {
        console.error("Error fetching Bank information:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      await updateBankInformation(generalData);
      setIsEditing(false); // Exit editing mode after successful update
    } catch (error) {
      console.error("Error updating Bank information:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // Set isEditing to false when Cancel button is clicked
  };

  return (
    <>
      <div className="settings-wrap">
        <div className="settings-wrapper">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="settings-content">
            <div className="headSticky">
              <h1>Company Information </h1>
              <div className="contentMenuTab">
                <ul>
                  <li>
                    <Link to="/settings/generalinformation">
                      General Information
                    </Link>
                  </li>
                  <li className="menuActive">
                    <Link to="/settings/generalinformation/bank-details">
                      Bank Details{" "}
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings/generalinformation/region-and-language">
                      Region & Language
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={`content_wrap_main ${
                isEditing ? "isEditingwrap" : ""
              }`}
            >
              <div className="content_wrapper">
                <div className="listwrapper">
                  <div className="topHeadStyle">
                    <div className="">
                      <h2>Bank Details </h2>
                      {!isEditing ? <></> : <p>Lorem Ipsum dolores</p>}
                    </div>
                    {!isEditing && (
                      <Link to="#" onClick={() => setIsEditing(true)}>
                        Edit
                        <PencilSquare color="#667085" size={20} />
                      </Link>
                    )}
                  </div>
                  {generalData && (
                    <ul>
                      <li>
                        <span>Bank Name</span>
                        {!isEditing ? (
                          <strong>{generalData.bank_name}</strong>
                        ) : (
                          <input
                            type="text"
                            value={generalData.bank_name}
                            onChange={(e) =>
                              setGeneralData({
                                ...generalData,
                                bank_name: e.target.value,
                              })
                            }
                          />
                        )}
                      </li>
                      <li>
                        <span>BSB</span>
                        {!isEditing ? (
                          <strong>{generalData.bsb}</strong>
                        ) : (
                          <input
                            type="text"
                            value={generalData.bsb}
                            onChange={(e) =>
                              setGeneralData({
                                ...generalData,
                                bsb: e.target.value,
                              })
                            }
                          />
                        )}
                      </li>
                      <li>
                        <span>Account</span>
                        {!isEditing ? (
                          <strong>{generalData.account_number}</strong>
                        ) : (
                          <input
                            type="text"
                            value={generalData.account_number}
                            onChange={(e) =>
                              setGeneralData({
                                ...generalData,
                                account_number: e.target.value,
                              })
                            }
                          />
                        )}
                      </li>
                    </ul>
                  )}
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
    </>
  );
};

export default BankDetails;
