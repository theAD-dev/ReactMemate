import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Sidebar from '.././Sidebar';
import styles from "./general.module.scss";
import { PencilSquare,Telephone,Building,Link45deg } from "react-bootstrap-icons";
import { SettingsGeneralInformation ,updateGeneralInformation} from "../../../../APIs/SettingsGeneral";
import AvatarImg from "../../../../assets/images/img/Avatar.png";


const GeneralInformation = () => {
    const [activeTab, setActiveTab] = useState('generalinformation');
    const [generalData, setGeneralData] = useState();
    const [isEditingGroup, setIsEditingGroup] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);


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




    const handleEditGroup = () => {
        setIsEditingGroup(true);
        setIsEditingName(true);
        setIsEditingEmail(true);
      };
    
      const handleUpdateGroup = async () => {
        try {
            await updateGeneralInformation(generalData);
            setIsEditingGroup(false);
        setIsEditingName(false);
        setIsEditingEmail(false);// Exit editing mode after successful update
        } catch (error) {
            console.error('Error updating general information:', error);
        }
    };


   
    
      const handleCancelEdit = () => {
        setIsEditingGroup(false);
        setIsEditingName(false);
        setIsEditingEmail(false);
      };
    
   
    
      const handleEditInline = async (field) => {
        try {
            await updateGeneralInformation(generalData);
            setIsEditingGroup(false);
           setIsEditingName(false);
       
        } catch (error) {
            console.error('Error updating general information:', error);
        }

        if (field === 'legal_name') {
            setIsEditingName(!isEditingName);
          } else if (field === 'email') {
            setIsEditingEmail(!isEditingEmail);
          }
    };

    return (
        <>
        <div className='settings-wrap'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="settings-content">
                <div className='headSticky'>
                <h1>Company Information </h1>
                <div className='contentMenuTab'>
                    <ul>
                        <li className='menuActive'><Link to="/settings/generalinformation">General Information</Link></li>
                        <li><Link to="/settings/generalinformation/bank-details">Bank Details </Link></li>
                        <li><Link to="/settings/generalinformation/region-and-language">Region & Language</Link></li>
                    </ul>
                </div>
                </div>
                <div className={`content_wrap_main ${isEditingGroup ? 'isEditingwrap' : ''}`}>
                <div className='content_wrapper'>
                    <div className="listwrapper">
                    <div className="topHeadStyle">
                        <div className=''>
                        <h2>General Information</h2>
                        {!isEditingGroup ? (
                           <></>
                            ) : (
                        <p>Lorem Ipsum dolores</p>
                        )}
                        </div>
                        {!isEditingGroup && (
                            <Link to="#" onClick={handleEditGroup}>Edit<PencilSquare color="#344054" size={20} /></Link>
                        )}
                    </div>
                    {generalData && ( 
                            <ul>
                                   
                                    <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                                   
                                  <div className={styles.editinfo}>
                                  <span>Company Legal Name</span>
                                    {!isEditingGroup ? (
                                        <strong>{generalData.legal_name}</strong>
                                    ) : (
                                        <input
                                            type="text"
                                            value={generalData.legal_name}
                                            onChange={(e) => setGeneralData({ ...generalData, legal_name: e.target.value })}
                                        />
                                    )}
                                  </div>
                                   
                                    {!isEditingGroup ? (
                    <>
                    </>
                ) : (
             
                <div className={styles.editpara}>
                <p>Please provide the complete legal name of your company, as it will be displayed on outgoing documentation.</p>
                
            </div> 
            
             )}
                                </li>
                                <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                                <div className={styles.editinfo}>
                                    <span>Company Trading name</span>
                                    {!isEditingGroup ? (
                                        <strong>{generalData.trading_name}</strong>
                                    ) : (
                                        <input
                                            type="text"
                                            value={generalData.trading_name}
                                            onChange={(e) => setGeneralData({ ...generalData, trading_name: e.target.value })}
                                        />
                                    )}
                                    </div>
                                    {!isEditingGroup ? (
                    <>
                    </>
                ) : (
             
                <div className={styles.editpara}>
                <p>Please enter a trading name. This will be displayed when you communicate with contractors, clients, and suppliers.

</p>
                
            </div> 
            
             )}
                                </li>
                                <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                                <div className={styles.editinfo}>
                                    <span>ABN</span>
                                    {!isEditingGroup ? (
                                        <strong>{generalData.abn}</strong>
                                    ) : (
                                        <input
                                            type="text"
                                            value={generalData.abn}
                                            onChange={(e) => setGeneralData({ ...generalData, abn: e.target.value })}
                                        />
                                    )}
                                    
                                    </div>
                                    {!isEditingGroup ? (
                    <>
                    </>
                ) : (
             
                <div className={styles.editpara}>
                <p>Please input Active Business Number</p>
                
            </div> 
            
             )}
                                </li>
                                <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                                <div className={styles.editinfo}>
                                    <span>Main Company Email</span>
                                    {!isEditingGroup ? (
                                        <strong>{generalData.main_email} <Link45deg color="#158ECC" size={20} /></strong>
                                    ) : (
                                        <input
                                            type="text"
                                            value={generalData.main_email}
                                            onChange={(e) => setGeneralData({ ...generalData, main_email: e.target.value })}
                                        />
                                    )}
                                 </div>
                                 {!isEditingGroup ? (
                    <>
                    </>
                ) : (
             
                <div className={styles.editpara}>
                <p>Insert emails which will be used to send all your automatic outgoing emails and notifications.</p>
                
            </div> 
            
             )}
                                </li>
                                <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                                <div className={styles.editinfo}>
                                    <span>Main Company Phone Number</span>
                                    {!isEditingGroup ? (
                                        <strong>{generalData.main_phone} <Telephone color="#158ECC" size={20} /></strong>
                                    ) : (
                                        <input
                                            type="text"
                                            value={generalData.main_phone}
                                            onChange={(e) => setGeneralData({ ...generalData, main_phone: e.target.value })}
                                        />
                                    )}
                                    </div>
                                    {!isEditingGroup ? (
                    <>
                    </>
                ) : (
             
                <div className={styles.editpara}>
                <p>The phone number will be displayed in outgoing documentation.</p>
                
            </div> 
            
             )}
                                </li>
                                <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                                <div className={styles.editinfo}>
                                    <span>Company Abbreviation</span>
                                    {!isEditingGroup ? (
                                        <strong>{generalData.abbreviation}</strong>
                                    ) : (
                                        <input
                                            type="text"
                                            value={generalData.abbreviation}
                                            onChange={(e) => setGeneralData({ ...generalData, abbreviation: e.target.value })}
                                        />
                                    )}
                                    </div>
                                    {!isEditingGroup ? (
                    <>
                    </>
                ) : (
             
                <div className={styles.editpara}>
                <p>Provide your legal company address for outgoing documentation.</p>
                
            </div> 
            
             )}
                                </li>
                                <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                                <div className={styles.editinfo}>
                                    <span>Street Address</span>
                                    {!isEditingGroup ? (
                                        <strong>{generalData.address}</strong>
                                    ) : (
                                        <input
                                            type="text"
                                            value={generalData.address}
                                            onChange={(e) => setGeneralData({ ...generalData, address: e.target.value })}
                                        />
                                    )}
                                    </div>
                                    {!isEditingGroup ? (
                    <>
                    </>
                ) : (
             
                    <div className={styles.editpara}>
                    <p></p>
                    
                </div>
            
             )}
                                </li>
                                <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                                <div className={styles.editinfo}>
                                    <span>State</span>
                                    {!isEditingGroup ? (
                                        <strong>{generalData.state}</strong>
                                    ) : (
                                        <input
                                            type="text"
                                            value={generalData.state}
                                            onChange={(e) => setGeneralData({ ...generalData, state: e.target.value })}
                                        />
                                    )}
                                    </div>
                                    {!isEditingGroup ? (
                    <>
                    </>
                ) : (
             
                    <div className={styles.editpara}>
                    <p></p>
                    
                </div>
            
             )}
                                </li>
                                <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                                <div className={styles.editinfo}>
                                    <span>Postcode</span>
                                    {!isEditingGroup ? (
                                        <strong>{generalData.postcode}</strong>
                                    ) : (
                                        <input
                                            type="text"
                                            value={generalData.postcode}
                                            onChange={(e) => setGeneralData({ ...generalData, postcode: e.target.value })}
                                        />
                                    )}
                                    </div>
                                    {!isEditingGroup ? (
                    <>
                    </>
                ) : (
             
                    <div className={styles.editpara}>
                    <p></p>
                    
                </div>
            
             )}
                                </li>
                                <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                                <div className={styles.editinfo}>
                                    <span>Company Logo for Documentation</span>
                                    {!isEditingGroup ? (
                                        <strong>
                                            {generalData.company_logo ? (
                                                <img src={generalData.company_logo} width={76} alt="Company Logo" />
                                            ) : (
                                                <img src={AvatarImg} alt="DummyImg" />
                                            )}
                                        </strong>
                                    ) : (
                                     
                                    <div class="upload-btn-wrapper">
                                    <button class="btnup">
                                        <div className='iconBulding'>
                                    <Building color="#667085" size={32} /></div>
                                    <div className='textbtm'>
                                        <p><span>Click to upload</span> or drag and drop<br></br>
                                        SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                    </div>
                                    </button>
                                    <input
                                     type="file"
                                     onChange={(e) => setGeneralData({ ...generalData, company_logo: e.target.files[0] })}                                      
                                       />
                                    </div>
                                      )}
                                      </div>

                                      {!isEditingGroup ? (
                    <>
                    </>
                ) : (
             
                <div className={styles.editpara}>
               <div className='logo'>
                <h5>Company logo</h5>
                <p>Upload the logo for your unique quotes and invoices.</p>
                </div>
                
            </div> 
            
             )}


                                </li>





                            </ul>
                        )}
                    </div>
             
            </div>
            </div>
            {isEditingGroup && (
            <div className='updateButtonGeneral'>
            <button className="cancel" onClick={handleCancelEdit}>Cancel</button>
            <button className="save mr-3" onClick={handleUpdateGroup}>Update</button>
            </div>
        )}
            </div> 
        </div>
        </div>
        </>
    );
}

export default GeneralInformation;
