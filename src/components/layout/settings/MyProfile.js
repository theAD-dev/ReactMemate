import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import styles from "./setting.profile.module.scss";
import { PencilSquare, Telephone, Person } from "react-bootstrap-icons";
import {
  SettingsGeneralInformation,
  updateGeneralInformation,
} from "../../../APIs/SettingsGeneral";
import AvatarImg from "../../../assets/images/img/Avatar.png";

const MyProfile = (profileData) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [generalData, setGeneralData] = useState();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await SettingsGeneralInformation();

        setGeneralData(JSON.parse(data));
      } catch (error) {
        console.error("Error fetching general information:", error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      await updateGeneralInformation(generalData);
      setIsEditing(false); // Exit editing mode after successful update
    } catch (error) {
      console.error("Error updating general information:", error);
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
              <h1>My Profile </h1>
            </div>
            <div
              className={`content_wrap_main ${
                isEditing ? "isEditingwrap" : ""
              }`}
            >
              <div className="content_wrapper">
              <div className= {`listwrapper ${styles.listwrapp}`}>
                  <div className="topHeadStyle">
                    <div className="">
                      <h2>My Profile</h2>
                      {!isEditing ? (
                        <></>
                      ) : (
                        <p>
                          For your user picture, we suggest choosing a simple,
                          neutral photo of yourself or a corporate headshot to
                          ensure clear and professional communication.
                        </p>
                      )}
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
                        <span>First Name</span>
                        {!isEditing ? (
                          <strong>{profileData?.profileData?.full_name}</strong>
                        ) : (
                          <input
                            type="text"
                            value="John"
                            onChange={(e) =>
                              setGeneralData({
                                ...generalData,
                                legal_name: e.target.value,
                              })
                            }
                          />
                          
                        )}
                    

                      </li>
                   
                       
                        {!isEditing ? (
                            <>
                            </>
                        ) : (
                          <li>
                             <span>Last Name</span>
                          <input
                            type="text"
                            value="Smith"
                            onChange={(e) =>
                              setGeneralData({
                                ...generalData,
                                trading_name: e.target.value,
                              })
                            }
                          />
                          </li>
                        )}
                     
                      <li>
                        <span>User picture</span>
                        {!isEditing ? (
                          <strong>
                            {generalData.photo ? (
                              <img
                                src={generalData.photo}
                                width={76}
                                alt="Company Logo"
                              />
                            ) : (
                              <img src={AvatarImg} alt="DummyImg" />
                            )}
                          </strong>
                        ) : (
                          <div class="upload-btn-wrapper">
                            <button class="btnup">
                              <div className="iconPerson">
                                <Person color="#667085" size={32} />
                              </div>
                              <div className="textbtm">
                                <p>
                                  <span>Click to upload</span> or drag and drop
                                  <br></br>
                                  SVG, PNG, JPG or GIF (max. 800x400px)
                                </p>
                              </div>
                            </button>
                            <input
                              type="file"
                              onChange={(e) =>
                                setGeneralData({
                                  ...generalData,
                                  company_logo: e.target.files[0],
                                })
                              }
                            />
                          </div>
                        )}
                      </li>
                      <li>
                        <span>Email</span>
                        {!isEditing ? (
                          <strong>{profileData?.profileData?.email}</strong>
                        ) : (
                          <input
                            type="text"
                            value="email@example.com"
                            onChange={(e) =>
                              setGeneralData({
                                ...generalData,
                                abn: e.target.value,
                              })
                            }
                          />
                        )}
                      </li>
                      <li>
                        <span>Phone Number</span>
                        {!isEditing ? (
                          <strong className="flexStyleProfile">
                            1300882582 &nbsp;
                            <Telephone color="#1AB2FF" size={20} />
                          </strong>
                        ) : (
                          <input
                            type="text"
                            value="Phone Number"
                            onChange={(e) =>
                              setGeneralData({
                                ...generalData,
                                abn: e.target.value,
                              })
                            }
                          />
                        )}
                      </li>
                      <li>
                        <span>Position</span>
                        {!isEditing ? (
                          <strong>{profileData?.profileData?.type}</strong>
                        ) : (
                          <input
                            type="text"
                            value="Manager"
                            onChange={(e) =>
                              setGeneralData({
                                ...generalData,
                                abn: e.target.value,
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

export default MyProfile;
