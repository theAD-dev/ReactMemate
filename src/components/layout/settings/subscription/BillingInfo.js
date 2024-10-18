import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./../Sidebar";
import classNames from 'classnames';
import BillingInfiVisa from "../../../../assets/images/icon/visaBilling.png";
import { PencilSquare,ExclamationCircle,CheckLg } from "react-bootstrap-icons";
import { SettingsBankInformation, updateBankInformation } from "../../../../APIs/SettingsGeneral";
import AddpaymentModal from "./../AddpaymentModal";

const BillingInfo = () => {
  const [activeTab, setActiveTab] = useState("subscription");
  const [generalData, setGeneralData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [list, setList] = useState([]);
  
  const [item, setItem] = useState('');

  const addItemToList = (item) => {
    setList([...list, item]);
  };

  const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
  };


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

  const handleRemove = (index) => {
    setList(list.filter((_, i) => i !== index));
  };


  return (
    <>
      <div className="settings-wrap settings-BillingInfo">
        <div className="settings-wrapper">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="settings-content">
            <div className="headSticky">
              <h1>Subscription </h1>
              <div className="contentMenuTab">
                <ul>
                  <li>
                    <Link to="/settings/generalinformation/subscription">
                      Subscription
                    </Link>
                  </li>
                  <li className="menuActive">
                    <Link to="/settings/generalinformation/billing-info">
                      Billing Info
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings/generalinformation/bills">Bills</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={`content_wrap_main ${
                isEditing ? "isEditingwrap" : ""
              }`}
            >
              <div className="content_wrapper1">
                <div className="topHeadStyle">
                  <div className="">
                    <h2 className="Exclamation">
                      <span>
                        <ExclamationCircle color="#344054" size={20} />
                      </span>
                      <strong> Next Payment </strong> Your next monthly payment
                      100$ will be charged on Nov 27, 2023.
                    </h2>
                  </div>
                  {!isEditing && (
                    <Link to="#" onClick={() => setIsEditing(true)}>
                      Edit
                      <PencilSquare color="#667085" size={20} />
                    </Link>
                  )}
                </div>
                <div className="dflex">
                  <div className="listwrapper1 gridInfoWrap">
                    {generalData && (
                      <>
                        <ul>
                          <li>
                            <span>Full Name</span>
                            {!isEditing ? (
                              <strong>Max Narelik</strong>
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
                            <span>Country</span>
                            {!isEditing ? (
                              <strong>Australia</strong>
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
                            <span>City</span>
                            {!isEditing ? (
                              <strong>Sydney</strong>
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
                        </ul>
                        <ul>
                          <li>
                            <span>Phone</span>
                            {!isEditing ? (
                              <strong>1300882582</strong>
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
                            <span>Address Line 1</span>
                            {!isEditing ? (
                              <strong>9 9 - 97 Jones ST</strong>
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
                            <span>Postal Code</span>
                            {!isEditing ? (
                              <strong>2007</strong>
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
                        </ul>
                        <ul>
                          <li>
                            <span>Business Name</span>
                            {!isEditing ? (
                              <strong>theAd</strong>
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
                          <li>
                            <span>Address Line 2</span>
                            {!isEditing ? (
                              <strong>Ultimo</strong>
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
                          <li>
                            <span>Business number</span>
                            {!isEditing ? (
                              <strong>1424897931749</strong>
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
                      </>
                    )}
                  </div>
                  <div className="listwrapper billingwrapper">
                    <div className="head">
                      <h2>Payment Method</h2>
                    </div>
                    {list.map((item, index) => (
                      <div key={index} className={classNames('grid-item', { 'active': selectedOption === `option${index}` })}>
                        <label>
                          <input
                            type="radio"
                            value={`option${index}`}
                            checked={selectedOption === `option${index}`}
                            onChange={handleOptionChange}
                          />
                          <div className="boxWrap">
                            <div className="icon">
                              <img src={BillingInfiVisa} alt="Visa" />
                            </div>
                            <div className='boxItem'>
                              <h2>{item.address} {item.number}</h2>
                              <p>Expiry{item.expiry}</p>
                              <button>Default</button>
                              <button className="close" onClick={() => handleRemove(index)}>Remove</button>
                            </div>
                          </div>
                          <div className='boxCheckNo'>
                            <div className='ckeckIcon'><CheckLg color="#344054" size={12} /></div>
                          </div>
                        </label>
                      </div>
                    ))}
                    <AddpaymentModal item={item} onAdd={addItemToList} onRemove={handleRemove} />
                  </div>
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

export default BillingInfo;
