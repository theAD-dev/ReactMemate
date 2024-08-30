import React, { useState } from 'react';
import styles from './client.module.scss';
import { BuildingAdd,PersonAdd,X, ChevronDown ,Telephone,Upload,PlusLg } from 'react-bootstrap-icons';

import defaultIcon from "../../../../assets/images/icon/default.png";
import { Button, Col, Row, Placeholder, Form } from "react-bootstrap";
import { MenuItem, Select, FormControl as MUIFormControl } from '@mui/material';

import { InputGroup } from 'react-bootstrap';
import { PhoneInput } from 'react-international-phone';
import FileUploader from '../../../../../ui/file-uploader/file-uploader';

const Tab = ({ tabName,icon, activeTab, onClick }) => (
  <div className='tabBoxGrid'
    onClick={() => onClick(tabName)}
    style={{
      cursor: 'pointer',
      padding: '10px',
      backgroundColor: activeTab === tabName ? '#EBF8FF' : '#fff',
      border: `1px solid ${activeTab === tabName ? '#76D1FF' : '#EAECF0'}`,
      borderRadius: '4px',
      color: '#106B99'
    }}
  >
     {icon && <span className={styles.iconstabs}>{icon}</span>}
    {tabName}
  </div>
);

// Custom Tabs Component
const NewClientTabbing = ({isFetching,countryCode,close}) => {
  const [activeTab, setActiveTab] = useState('Business');
  const [photo, setPhoto] = useState({});
  const [category, setCategory] = useState();
  const [industry, setIndustry] = useState();
  const [company, setCompany] = useState();
  const [customer, setCustomer] = useState();
  const [phone, setPhone] = useState();
  const [wurl, setUrl] = useState();
  const [abn, setAbn] = useState();
  const [payment, setPayment] = useState();
  const [position , setPosition] = useState();
  const [fName , setFnanme] = useState();
  const [lName , setLnanme] = useState();
  const [email , setEmail] = useState();
  const [location , setLocation] = useState();
  const [country , setCountry] = useState();
  const [streetAddress , setStreetAddress] = useState();
  const [state , setState] = useState();
  const [city , setCity] = useState();
  const [postcode , setPostcode] = useState();
  const [description , setDescription] = useState();



  const handleSaveClient = () => {
    // Add your save logic here
    console.log("Client details saved:", { category, industry,company,customer,wurl,abn,payment ,position,fName,lName,email,location
      ,country,streetAddress,state,city,postcode,description
    });
  };





  return (
    <div className={styles.NewClientTabs}>
      
            <div className={`${styles.mainScrollWrap} ${styles.editClientValue}`}>
            <div className={styles.displayFlexGrid}>
              <strong>Client Details</strong>
              <span>User ID: ELT-339047-1</span>
            </div>
      <div className={styles.dFlexTab}>
        
      <Tab
          icon={<BuildingAdd color={activeTab === "Business" ? '#158ECC' : '#1AB2FF'} size={20} />}
          tabName="Business"
          activeTab={activeTab}
          onClick={setActiveTab}
        />
        <Tab
          icon={<PersonAdd color={activeTab === "Individual" ? '#158ECC' : '#1AB2FF'} size={20} />}
          tabName="Individual"
          activeTab={activeTab}
          onClick={setActiveTab}
        />
      
      </div>
      {activeTab === 'Business' && (
          <>
         
       
        
   
       <div>
        
         <Row>
           <Col md={12}>
           <FileUpload photo={photo} setPhoto={setPhoto} />
           </Col>
           <Col md={6}>
             <p className={styles.labelColor}>Customer Category</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                 <Select
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   displayEmpty
                   IconComponent={ChevronDown}
                   style={{ color: '#101828' }}
                 >
                   <MenuItem value="">Platinium</MenuItem>
                 </Select>
               </MUIFormControl>
             )}
           </Col>
         </Row>
         <Row className="pt-2">
         <Col md={6}>
             <p className={styles.labelColor}>Company Name</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="Company Name"
                   value={company}
                   onChange={(e) => setCompany(e.target.value)}
                 />
           
               </Form.Group>
             )}
           </Col>
           <Col md={6}>
             <p className={styles.labelColor}>Industry</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="Industry"
                   value={industry}
                   onChange={(e) => setIndustry(e.target.value)}
                 />
                
               </Form.Group>
             )}
           </Col>
         </Row>
         <Row className="pt-2">
         <Col md={6}>
             <p className={styles.labelColor}>Customer Type</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                 <Select
                   value={customer}
                   onChange={(e) => setCustomer(e.target.value)}
                   displayEmpty
                   IconComponent={ChevronDown}
                   style={{ color: '#101828' }}
                 >
                   <MenuItem value="">Long-terms</MenuItem>
                 </Select>
               </MUIFormControl>
             )}
           </Col>
           <Col sm={6}>
                 <Form.Group className="mb-3">
                 <Form.Label style={{ color: '#667085', fontSize: '14px', fontWeight: 400, marginBottom: '4px' }}>Phone</Form.Label>
                 <PhoneInput
                 country={countryCode}
                 value={phone}
                   placeholder="Enter phone"
                 // onChange={(e) => setPhone(e.target.value)}
               />
           
               </Form.Group>
              </Col>
         </Row>
         <Row className="pt-2">
         <Col md={6}>
             <p className={styles.labelColor}>ABN</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="ABN"
                   value={abn}
                   onChange={(e) => setAbn(e.target.value)}
                 />
               
               </Form.Group>
             )}
           </Col>
         <Col md={6}>
             <p className={styles.labelColor}>Website</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="Website URL"
                   value={wurl}
                   onChange={(e) => setUrl(e.target.value)}
                 />
              
               </Form.Group>
             )}
           </Col> 
         </Row>
       </div>
       <div className={styles.displayFlexGrid}>
         <strong>Payment Terms</strong>
       </div>
       <div className={styles.greyBox}>
         <Row>
           <Col md={6}>
             <p className={styles.labelColor}>Payment Terms</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                 <Select
                   value={payment}
                   onChange={(e) => setPayment(e.target.value)}
                   displayEmpty
                   IconComponent={ChevronDown}
                   style={{ color: '#101828' }}
                 >
                   <MenuItem value="">Monthly</MenuItem>
                 </Select>
               </MUIFormControl>
             )}
           </Col>
         </Row>
       </div>
       <div className={styles.displayFlexGrid}>
         <strong>Contact Person</strong>
       </div>
       <div className={styles.greyBox}>
       <Row className="pt-2">
         <Col md={6}>
             <p className={styles.labelColor}>Position</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="position"
                   value={position}
                   onChange={(e) => setPosition(e.target.value)}
                 />
                
               </Form.Group>
               
             )}
           </Col>
      
         </Row>
        
         <Row className="pt-2">
         <Col md={6}>
             <p className={styles.labelColor}>First Name</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="First Name"
                   value={fName}
                   onChange={(e) => setFnanme(e.target.value)}
                 />
           
               </Form.Group>
             )}
           </Col>
         <Col md={6}>
             <p className={styles.labelColor}>Last Name</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="Last Name"
                   value={lName}
                   onChange={(e) => setLnanme(e.target.value)}
                 />
                 
               </Form.Group>
             )}
           </Col>
       
         </Row>
         <Row className="pt-2">
         <Col md={6}>
             <p className={styles.labelColor}>Email</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="Email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
   
               </Form.Group>
             )}
           </Col>
         <Col sm={6}>
                 <Form.Group className="mb-3">
                 <Form.Label style={{ color: '#667085', fontSize: '14px', fontWeight: 400, marginBottom: '4px' }}>Phone</Form.Label>
                 <PhoneInput
                 country={countryCode}
                 value={phone}
                   placeholder="Enter phone"
                 // onChange={(e) => setPhone(e.target.value)}
               />
      
               </Form.Group>
              </Col>
         </Row>
       </div>
       <div className={`mt-3  d-flex justify-content-end align-items-center ${styles.addNewButton}`}>
           <Button className={styles.deleteBut}>Delete</Button>
           <Button className={styles.addNewBut}>Add New  <PlusLg size={20} color="#106B99" /></Button>
       </div>
       <div className={styles.displayFlexGrid}>
         <strong>Locations</strong>
       </div>
       <div className={styles.greyBox}>
       <Row className="pt-2">
           <Col md={6}>
             <p className={styles.labelColor}>Location Name</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="Enter location name"
                   value={location}
                   onChange={(e) => setLocation(e.target.value)}
                 />
          
               </Form.Group>
               
             )}
           </Col>
           <Col md={6}>
             <p className={styles.labelColor}>Country</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                 <Select
                   value={country}
                   onChange={(e) => setCountry(e.target.value)}
                   displayEmpty
                   IconComponent={ChevronDown}
                   style={{ color: '#101828' }}
                 >
                   <MenuItem value="">AUS</MenuItem>
                 </Select>
               </MUIFormControl>
             )}
           </Col>
         </Row>
         
         <Row className="pt-2">
         <Col md={6}>
             <p className={styles.labelColor}>Street Address</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="Street Address"
                   value={streetAddress}
                   onChange={(e) => setStreetAddress(e.target.value)}
                 />
      
               </Form.Group>
             )}
           </Col>
         <Col md={6}>
             <p className={styles.labelColor}>State</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="State"
                   value={state}
                   onChange={(e) => setState(e.target.value)}
                 />
            
               </Form.Group>
             )}
           </Col>
       
         </Row>
         <Row className="pt-2">
         <Col md={6}>
             <p className={styles.labelColor}>City/Suburb</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="Enter city"
                   value={city}
                   onChange={(e) => setCity(e.target.value)}
                 />
 
               </Form.Group>
             )}
           </Col>
          
         <Col md={6}>
             <p className={styles.labelColor}>Postcode</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3">
                 <Form.Control
                   required
                   type="text"
                   placeholder="Enter postcode"
                   value={postcode}
                   onChange={(e) => setPostcode(e.target.value)}
                 />
          
               </Form.Group>
             )}
           </Col>
         
         </Row>
       </div>
       <div className={`mt-3  d-flex justify-content-end align-items-center ${styles.addNewButton}`}>
           <Button className={styles.deleteBut}>Delete</Button>
           <Button className={styles.addNewBut}>Add New  <PlusLg size={20} color="#106B99" /></Button>
       </div>
    
       <div className={`mt-4 ${styles.greyBox}`}>
       <Row className="pt-2">
         <Col md={12}>
             <p className={styles.labelColor}>Client Description</p>
             {isFetching ? (
               <Placeholder as="span" animation="wave" className="ms-2 me-2">
                 <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
               </Placeholder>
             ) : (
               <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
               <Form.Control
                 as="textarea"
                 rows={3}
                 Placeholder="Enter a description..."
                 value={description} // Bind the textarea value to `description`
                 onChange={(e) => setDescription(e.target.value)} // Update `description` on change
               />
               <p className={styles.paragraphColor}>This is a hint text to help user.</p>
               
             </Form.Group>
             
               
             )}
           </Col>
     
         </Row>
        
         
       </div>
   
     <div className={styles.FooterClientView}>
       <div className="d-flex justify-content-end align-items-center">
         <Button className={styles.cancelBut} onClick={close}>Cancel</Button>
         <Button onClick={handleSaveClient} className={styles.saveClient}>Save Client Details</Button>
       </div>
     </div>
          </>
        )}




        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Individual
        >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        {activeTab === 'Individual' && (
          <>
  
      <div className={styles.greyBox}>
            <Row>
              <Col md={12}>
              <FileUpload photo={photo} setPhoto={setPhoto} />
              </Col>
              <Col md={6}>
                <p className={styles.labelColor}>Customer Category</p>
                {isFetching ? (
                  <Placeholder as="span" animation="wave" className="ms-2 me-2">
                    <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                  </Placeholder>
                ) : (
                  <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      displayEmpty
                      IconComponent={ChevronDown}
                      style={{ color: '#101828' }}
                    >
                      <MenuItem value="">Platinium</MenuItem>
                    </Select>
                  </MUIFormControl>
                )}
              </Col>
              <Col sm={6}>
                    <Form.Group className="mb-3">
                    <Form.Label style={{ color: '#667085', fontSize: '14px', fontWeight: 400, marginBottom: '4px' }}>Phone</Form.Label>
                    <PhoneInput
                    country={countryCode}
                    value={phone}
                      placeholder="Enter phone"
                    // onChange={(e) => setPhone(e.target.value)}
                  />
 
                  </Form.Group>
                 </Col>
            </Row>
            <Row className="pt-2">
              <Col md={6}>
                  <p className={styles.labelColor}>First Name</p>
                  {isFetching ? (
                    <Placeholder as="span" animation="wave" className="ms-2 me-2">
                      <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                    </Placeholder>
                  ) : (
                    <Form.Group className="mb-3">
                      <Form.Control
                        required
                        type="text"
                        placeholder="First Name"
                        value={fName}
                        onChange={(e) => setFnanme(e.target.value)}
                      />
                   
                    </Form.Group>
                  )}
                </Col>
              <Col md={6}>
                  <p className={styles.labelColor}>Last Name</p>
                  {isFetching ? (
                    <Placeholder as="span" animation="wave" className="ms-2 me-2">
                      <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                    </Placeholder>
                  ) : (
                    <Form.Group className="mb-3">
                      <Form.Control
                        required
                        type="text"
                        placeholder="Last Name"
                        value={lName}
                        onChange={(e) => setLnanme(e.target.value)}
                      />
              
                    </Form.Group>
                  )}
                </Col>
            
              </Row>
              <Row className="pt-2">
            <Col md={6}>
                <p className={styles.labelColor}>Email</p>
                {isFetching ? (
                  <Placeholder as="span" animation="wave" className="ms-2 me-2">
                    <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                  </Placeholder>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                   
                  </Form.Group>
                )}
              </Col>
              </Row>
           
          </div>
          <div className={styles.displayFlexGrid}>
            <strong>Locations</strong>
          </div>
 
         
          <div className={styles.greyBox}>
          <Row className="pt-2">
              <Col md={6}>
                <p className={styles.labelColor}>Location Name</p>
                {isFetching ? (
                  <Placeholder as="span" animation="wave" className="ms-2 me-2">
                    <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                  </Placeholder>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter location name"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
               
                  </Form.Group>
                  
                )}
              </Col>
              <Col md={6}>
                <p className={styles.labelColor}>Country</p>
                {isFetching ? (
                  <Placeholder as="span" animation="wave" className="ms-2 me-2">
                    <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                  </Placeholder>
                ) : (
                  <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                    <Select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      displayEmpty
                      IconComponent={ChevronDown}
                      style={{ color: '#101828' }}
                    >
                      <MenuItem value="">AUS</MenuItem>
                    </Select>
                  </MUIFormControl>
                )}
              </Col>
            </Row>
            
            <Row className="pt-2">
            <Col md={6}>
                <p className={styles.labelColor}>Street Address</p>
                {isFetching ? (
                  <Placeholder as="span" animation="wave" className="ms-2 me-2">
                    <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                  </Placeholder>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      placeholder="Street Address"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                    />
    
                  </Form.Group>
                )}
              </Col>
            <Col md={6}>
                <p className={styles.labelColor}>State</p>
                {isFetching ? (
                  <Placeholder as="span" animation="wave" className="ms-2 me-2">
                    <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                  </Placeholder>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
          
                  </Form.Group>
                )}
              </Col>
          
            </Row>
            <Row className="pt-2">
            <Col md={6}>
                <p className={styles.labelColor}>City/Suburb</p>
                {isFetching ? (
                  <Placeholder as="span" animation="wave" className="ms-2 me-2">
                    <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                  </Placeholder>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                   
                  </Form.Group>
                )}
              </Col>
             
            <Col md={6}>
                <p className={styles.labelColor}>Postcode</p>
                {isFetching ? (
                  <Placeholder as="span" animation="wave" className="ms-2 me-2">
                    <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                  </Placeholder>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter postcode"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                    />
                  
                  </Form.Group>
                )}
              </Col>
            
            </Row>
          </div>
          <div className={styles.displayFlexGrid}>
            <strong>Client Description</strong>
          </div>
          <div className={` ${styles.greyBox}`}>
          <Row className="pt-2">
            <Col md={12}>
                <p className={styles.labelColor}>Description</p>
                {isFetching ? (
                  <Placeholder as="span" animation="wave" className="ms-2 me-2">
                    <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                  </Placeholder>
                ) : (
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    Placeholder="Enter a description..."
                    value={description} // Bind the textarea value to `description`
                    onChange={(e) => setDescription(e.target.value)} // Update `description` on change
                  />
                  
                
                </Form.Group>
                
                  
                )}
              </Col>
        
            </Row>
            </div>
  
    <div className={styles.FooterClientView}>
      <div className="d-flex justify-content-end align-items-center">
        <Button className={styles.cancelBut} onClick={close}>Cancel</Button>
        <Button onClick={handleSaveClient} className={styles.saveClient}>Save Client Details</Button>
      </div>
    </div>
          </>
        )}
    </div>
    </div>
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
export default NewClientTabbing;
