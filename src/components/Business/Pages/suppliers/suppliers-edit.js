import React, { useState } from "react";
import { X, ChevronDown ,Telephone,Upload,PlusLg,PlusCircle} from "react-bootstrap-icons";
import defaultIcon from "../../../../assets/images/icon/default.png";
import { Button, Col, Row, Placeholder, Form } from "react-bootstrap";
import { MenuItem, Select, FormControl as MUIFormControl } from '@mui/material';
import styles from "./suppliers.module.scss";
import { InputGroup } from 'react-bootstrap';
import { PhoneInput } from 'react-international-phone';
import FileUploader from '../../../../ui/file-uploader/file-uploader';

const SuppliersEdit = ({ suppView, isFetching, close, errors, isEdit, countryCode = "US" }) => {
  const [photo, setPhoto] = useState({});
  const [category, setCategory] = useState(suppView?.category || "");
  const [industry, setIndustry] = useState(suppView?.industry || "");
  const [company, setCompany] = useState(suppView?.days_in_company || "");
  const [customer, setCustomer] = useState(suppView?.setCustomer || "");
  const [phone, setPhone] = useState(suppView?.phone || "");
  const [wurl, setUrl] = useState(suppView?.website || "");
  const [abn, setAbn] = useState(suppView?.abn || "");
  const [payment, setPayment] = useState(suppView?.payment_terms || "");
  const [position , setPosition] = useState(suppView?.position || "");
  const [fName , setFnanme] = useState();
  const [lName , setLnanme] = useState();
  const [email , setEmail] = useState();
  const [location , setLocation] = useState();
  const [country , setCountry] = useState();
  const [streetAddress , setStreetAddress] = useState();
  const [state , setState] = useState();
  const [city , setCity] = useState();
  const [postcode , setPostcode] = useState();
  const [description , setDescription] = useState(suppView?.description || "");
 
 
  const handleSaveClient = () => {
    // Add your save logic here
    console.log("Client details saved:", { category, industry,company,customer,wurl,abn,payment ,position,fName,lName,email,location
      ,country,streetAddress,state,city,postcode,description
    });
  };

  return (
    <>
   
          <div className={styles.mainHead}>
            <div className="d-flex align-items-center">
            <div className={styles.circledesignstyle}>
             <div className={styles.out}>
            
               <PlusCircle size={24} color="#17B26A" />
           
             </div>
             </div>
              <strong>Create new Supplier</strong>
            </div>
            <button className={styles.CustomCloseModal} onClick={close}>
              <X size={24} color="#667085" />
            </button>
          </div>
          
          <div className={`${styles.mainScrollWrap} ${styles.editClientValue}`}>
       
        
            <div className={styles.displayFlexGrid}>
              <strong>Supplier Details</strong>
              <span>Supplier ID: PVG-SP001	</span>
            </div>
            <div className={styles.greyBox}>
              <Row>
                <Col md={12}>
                <FileUpload photo={photo} setPhoto={setPhoto} />
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
                      {errors.company && <Form.Text className="text-danger">Industry is required</Form.Text>}
                    </Form.Group>
                  )}
                </Col>
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
                      {errors.email && <Form.Text className="text-danger">Email is required</Form.Text>}
                    </Form.Group>
                  )}
                </Col>
              </Row>
              <Row className="pt-2">
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
                      {errors.wurl && <Form.Text className="text-danger">Url is required</Form.Text>}
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
                    {errors.taskTitle && <Form.Text className="text-danger">Phone number is required</Form.Text>}
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
                      {errors.abn && <Form.Text className="text-danger">Industry is required</Form.Text>}
                    </Form.Group>
                  )}
                </Col>
         
              </Row>
            </div>
            <div className={styles.displayFlexGrid}>
              <strong>Services</strong>
            </div>
            <div className={styles.greyBox}>
              <Row>
                <Col md={6}>
                  <p className={styles.labelColor}>Services</p>
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
              <Row>
              <Col md={12}>
                  <p className={styles.labelColor}>Note</p>
                  {isFetching ? (
                    <Placeholder as="span" animation="wave" className="ms-2 me-2">
                      <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                    </Placeholder>
                  ) : (
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      Placeholder="Enter the detailed quote for the client contract here. Include all relevant information such as project scope, deliverables, timelines, costs, payment terms, and any special conditions. Ensure the quote is clear, comprehensive, and aligns with the client's requirements and expectations."
                      value={description} // Bind the textarea value to `description`
                      onChange={(e) => setDescription(e.target.value)} // Update `description` on change
                    />
             
                    {errors.company && <Form.Text className="text-danger">Position is required</Form.Text>}
                  </Form.Group>
                  
                    
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
                      {errors.fName && <Form.Text className="text-danger">First Name is required</Form.Text>}
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
                      {errors.lName && <Form.Text className="text-danger">Last Name is required</Form.Text>}
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
                      {errors.email && <Form.Text className="text-danger">Email is required</Form.Text>}
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
                    {errors.taskTitle && <Form.Text className="text-danger">Phone number is required</Form.Text>}
                    </Form.Group>
                   </Col>
              </Row>
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
                      {errors.company && <Form.Text className="text-danger">Position is required</Form.Text>}
                    </Form.Group>
                    
                  )}
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
                      {errors.location && <Form.Text className="text-danger">Position is required</Form.Text>}
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
                      {errors.fName && <Form.Text className="text-danger">Street Address is required</Form.Text>}
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
                      {errors.state && <Form.Text className="text-danger">State is required</Form.Text>}
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
                      {errors.city && <Form.Text className="text-danger">City is required</Form.Text>}
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
                      {errors.postcode && <Form.Text className="text-danger">Postcode is required</Form.Text>}
                    </Form.Group>
                  )}
                </Col>
              
              </Row>
            </div>
            <div className={`mt-3  d-flex justify-content-end align-items-center ${styles.addNewButton}`}>
                <Button className={styles.deleteBut}>Delete</Button>
                <Button className={styles.addNewBut}>Add New  <PlusLg size={20} color="#106B99" /></Button>
            </div>
          </div>
          <div className={styles.FooterSuppliersView}>
            <div className="d-flex justify-content-end align-items-center">
              <Button className={styles.cancelBut} onClick={close}>Cancel</Button>
              <Button onClick={handleSaveClient} className={styles.savesupplier}>Save</Button>
            </div>
          </div>
</>
  );
}

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

export default SuppliersEdit;
