import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import styles from "./setting.profile.module.scss";
import { PencilSquare, Telephone, Person,Upload } from "react-bootstrap-icons";
import {
  SettingsGeneralInformation,
  updateGeneralInformation,
} from "../../../APIs/SettingsGeneral";
import AvatarImg from "../../../assets/images/img/Avatar.png";
import FileUploader from '../../../ui/file-uploader/file-uploader';


const MyProfile = (profileData) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [generalData, setGeneralData] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState({});

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
                            value={profileData?.profileData?.full_name}
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
                            {/* <button class="btnup">
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
                              type={profileData?.profileData?.company_logo}
                              onChange={(e) =>
                                setGeneralData({
                                  ...generalData,
                                  company_logo: e.target.files[0],
                                })
                              }
                            /> */}
                            <FileUpload photo={photo} setPhoto={setPhoto} />
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
                            value={profileData?.profileData?.email}
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
                            {profileData?.profileData?.phone} &nbsp;
                            <Telephone color="#1AB2FF" size={20} />
                          </strong>
                        ) : (
                          <input
                            type="text"
                            value={profileData?.profileData?.phone}
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
                            value={profileData?.profileData?.type}
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


function FileUpload({ photo, setPhoto }) {
  const [show, setShow] = useState(false);

  return (
    <section className="container mb-3" style={{ marginTop: '24px', padding: '0px' }}>
      {/* <label className='mb-2' style={{ color: '#475467', fontSize: '14px', fontWeight: '500' }}>App Logo</label> */}
      <div className='d-flex justify-content-center align-items-center flex-column' style={{ width: '100%', minHeight: '126px', padding: '16px', background: '#fff', borderRadius: '4px', border: '1px solid #D0D5DD' }}>
        {
          photo?.croppedImageBase64 ? (
            <div className='text-center'>
              <img
                alt='uploaded-file'
                src={photo?.croppedImageBase64}
                style={{ width: '64px', height: '64px', marginBottom: '12px' }}
              />
            </div>
          ) : (
            <button type='button' onClick={() => setShow(true)} className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', padding: '10px', border: '1px solid #EAECF0', background: '#fff', borderRadius: '4px', marginBottom: '16px' }}>
              <Upload />
            </button>
          )
        }
        <p className='mb-0' style={{ color: '#475467', fontSize: '14px' }}><span style={{ color: '#1AB2FF', fontWeight: '600', cursor: 'pointer' }} onClick={() => setShow(true)}>Click to upload</span></p>
        <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
      </div>
      <FileUploader show={show} setShow={setShow} setPhoto={setPhoto} />
    </section>
  );
}
export default MyProfile;
