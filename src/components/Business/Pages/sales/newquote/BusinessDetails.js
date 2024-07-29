import React, { useState,useEffect } from 'react';
import { People,InfoSquare,ChevronLeft,Building,CardList,Plus,Upload} from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate,useParams  } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { clientsBusinessNewCreate } from "../../../../../APIs/NewQuoteApis";
import { newQuoteClientList } from "../../../../../APIs/NewQuoteApis";
import { PhoneInput } from 'react-international-phone';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";

const BusinessDetails = () => {
  const [company_name, setCompanyname] = useState('');
  const [customerCategory, setCustomerCategory] = useState('');
  const [abn, setAbn] = useState('');
  const [phoneumber, setPhoneumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [suburb, setSuburb] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [pnumber, setPnumber] = useState('');
  const [emailc, setEmailc] = useState('');
  const [position, setPosition] = useState('');
  const [industry, setIndustry] = useState('');
  const [paymentterms, setPaymentTerms] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({ value: 'Australia', label: 'Australia' }); // Default select Australia
  const [phone, setPhone] = useState('+61'); // Default phone number for Australia
  const [countryCode, setCountryCode] = useState('AU'); // Default country code for Australia
  const [countriesData, setCountriesData] = useState([]);
  
  const { id } = useParams();
  console.log('id: ', id);


  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/timezones.json')
      .then(response => response.json())
      .then(data => {
        setCountriesData(data);
      })
      .catch(error => console.error('Error fetching countries data:', error));
  }, []);

  
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setCustomerCategory(event.target.value);
  };
  // Function to handle image deletion
  const handleImageDelete = () => {
    setImage(null);
  };

  // Function to handle updating image
  const handleImageUpdate = (e) => {
    handleImageUpload(e);
  };


  const handleStepDetails = () => {
    const mainData = {
      "name": company_name,
      "category": customerCategory,
      "industry": industry,
      "abn": abn,
      "phone": phoneumber,
      "email": email,
      "website": website,
      "payment_terms": paymentterms,
      "image": image,
      "contact_persons": [
      {
      "firstname": fname,
      "lastname": lname,
      "phone": pnumber,
      "email": email,
      "position": position
      }
      ],
      "addresses": [
      {
      "city": suburb,
      "address": address,
      "state": state,
      "postcode": postcode
      }
      ]
    };

    // Call the API function to submit data
    clientsBusinessNewCreate(mainData)
      .then((responseData) => {
        navigate("/sales/newquote/client-information/step3/scope-of-work");
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
      });
  };



  const [address1, setAddress1] = useState('');
  const [suburb1, setSuburb1] = useState('');
  const [state1, setState1] = useState('');
  const [postcode1, setPostcode1] = useState('');

  const [addresses, setAddresses] = useState([]);

  const handleAddNewAddress1 = () => {
    const newAddress = {
      address1: address1,
      suburb1: suburb1,
      state1: state1,
      postcode1: postcode1
    };
    setAddresses([...addresses, newAddress]);
    setAddress1('');
    setSuburb1('');
    setState1('');
    setPostcode1('');
  };
  return (
    <div className="newQuotePage bsdpage">
        <div className="dFlex">
       <div className='navStepsticky'>
       <div className="newQuoteBack">
        <button><NavLink to="/sales/newquote/client-information/step1"><ChevronLeft color="#000000" size={20} /> Go Back</NavLink></button>
        </div>
        <div className='navStepClient '>
                <ul>
                    <li><span><People color="#1AB2FF" size={15} /></span> <p>Choose Client</p></li>
                    <li className='activeClientTab'><span><InfoSquare color="#1AB2FF" size={15} /></span> <p>Client Information</p> </li>
                    <li className='deactiveColorBox'><span><CardList color="#1AB2FF" size={15} /></span> <p>Scope of Work</p> </li>
                </ul>
              </div>
              <div className="formgroupWrap1">
               <ul className='mt-4'>
               <li>
                <NavLink className="ActiveClient businessTab" to="#"><span><Building color="#1AB2FF " size={24} /></span> Business Client</NavLink>
                </li>
              
                 </ul>
                  </div>
              </div>
  
        <div className="newQuoteContent">
                  <div className="formgroupboxs mt-4">
                  <Row className='text-left'> 
                    <h2>Company Details</h2>
                    <Col>
                    <div className="formgroup mb-2 mt-3">
                    <label>Company Name</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="company_name"
                        value={company_name}
                        placeholder='Comm Bank'
                        onChange={(e) => {
                          setCompanyname(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                      <label>Customer Category</label>
                      <div className={`inputInfo`}>
                      <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
        <Select
          value={customerCategory}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          IconComponent={KeyboardArrowDownIcon} 
        >
          <MenuItem value="">
          Select category
          </MenuItem>
          <MenuItem value={1} data-value="1">1</MenuItem>
          <MenuItem value={2} data-value="2">2</MenuItem>
        </Select>
      </FormControl>
                      </div>
                    </div>
                    </Col>
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>ABN</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="abn"
                        value={abn}
                        placeholder='Comm Bank'
                        onChange={(e) => {
                          setAbn(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Phone number</label>
                    <div className={`inputInfo `}>
                      <PhoneInput
                        country={countryCode}
                        value={phoneumber}
                        onChange={setPhone}
                      />
                      <img
                        className="ExclamationCircle"
                        src={exclamationCircle}
                        alt="Exclamation Circle"
                      />
                    </div>
                  </div>
                    </Col>
                   
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Email</label>
                    <div className={`inputInfo `}>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder='company@email.com'
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Website</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="website"
                        value={website}
                        placeholder='company@email.com'
                        onChange={(e) => {
                          setWebsite(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                  </Row>
                  <Row className='text-left mt-4'> 
                    <h2>Main Company Address</h2>
                    <Col>
                    <div className="formgroup mb-2 mt-3">
                    <label>Street Address</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="address"
                        value={address}
                        placeholder='Enter main address'
                        onChange={(e) => {
                          setAddress(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>City/Suburb</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="suburb"
                        value={suburb}
                        placeholder='Enter city'
                        onChange={(e) => {
                          setSuburb(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                   
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>State</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="state"
                        value={state}
                        placeholder='Enter state'
                        onChange={(e) => {
                          setState(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Postcode</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="postcode"
                        value={postcode}
                        placeholder='Enter postcode'
                        onChange={(e) => {
                          setPostcode(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                   
                    
                   
                  </Row>
                  {addresses.map((addr, index) => (
        <Row key={index} className='addNewRow text-left mt-4'>
          <h2>Main Company address1</h2>
          <Col>
            <div className="formgroup mb-2 mt-3">
              <label>Street address1</label>
              <div className={`inputInfo `}>
                <input
                  type="text"
                  name="address1"
                  value={addr.address1}
                  placeholder='Enter main address1'
                  onChange={(e) => {
                    let updatedAddresses = [...addresses];
                    updatedAddresses[index].address1 = e.target.value;
                    setAddresses(updatedAddresses);
                  }}
                />
              </div>
            </div>
          </Col>
          <Col sm={6}>
            <div className="formgroup mb-2 mt-3">
              <label>City/suburb1</label>
              <div className={`inputInfo `}>
                <input
                  type="text"
                  name="suburb1"
                  value={addr.suburb1}
                  placeholder='Enter city'
                  onChange={(e) => {
                    let updatedAddresses = [...addresses];
                    updatedAddresses[index].suburb1 = e.target.value;
                    setAddresses(updatedAddresses);
                  }}
                />
              </div>
            </div>
          </Col>

          <Col sm={6}>
            <div className="formgroup mb-2 mt-3">
              <label>state1</label>
              <div className={`inputInfo `}>
                <input
                  type="text"
                  name="state1"
                  value={addr.state1}
                  placeholder='Enter state1'
                  onChange={(e) => {
                    let updatedAddresses = [...addresses];
                    updatedAddresses[index].state1 = e.target.value;
                    setAddresses(updatedAddresses);
                  }}
                />
              </div>
            </div>
          </Col>
          <Col sm={6}>
            <div className="formgroup mb-2 mt-3">
              <label>postcode1</label>
              <div className={`inputInfo `}>
                <input
                  type="text"
                  name="postcode1"
                  value={addr.postcode1}
                  placeholder='Enter postcode1'
                  onChange={(e) => {
                    let updatedAddresses = [...addresses];
                    updatedAddresses[index].postcode1 = e.target.value;
                    setAddresses(updatedAddresses);
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      ))}

      <Row className='textRightRow mt-3'>
        <Col sm={12}>
          <button className='addbuttonRight' onClick={handleAddNewAddress1}>
            Add New <Plus color="#344054" size={20} />
          </button>
        </Col>
      </Row>

                  {/* Contact Person */}
                  <Row className='text-left mt-4'> 
                    <h2>Contact Person</h2>
                    <Col>
                    <div className="formgroup mb-2 mt-3">
                    <label>First Name</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="fname"
                        value={fname}
                        placeholder='First Name'
                        onChange={(e) => {
                          setFname(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Last Name</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="lname"
                        value={lname}
                        placeholder='Last Name'
                        onChange={(e) => {
                          setLname(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Phone Number</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="pnumber"
                        value={pnumber}
                        placeholder='+1 (555) 000-0000'
                        onChange={(e) => {
                          setPnumber(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                   
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Email</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="emailc"
                        value={emailc}
                        placeholder='company@email.com'
                        onChange={(e) => {
                          setEmailc(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Position</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="position"
                        value={position}
                        placeholder='Manager'
                        onChange={(e) => {
                          setPosition(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                    </Col>
                  </Row>
                  <Row className='textRightRow mt-3'> 
                  <Col sm={12}>
                     <button className='addbuttonRight'>Add New <Plus color="#344054" size={20} /></button>
                    </Col>
                  </Row>
                  {/* App Logo */}
                  <Row className='text-left mt-4'> 
                    <Col>
                    <div className="formgroup mb-2 mt-3">
                    <label>Type of Industry</label>
                    <div className={`inputInfo `}>
                    <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                    <Select
                      value={industry}
                      onChange={(e) => {
                        setIndustry(e.target.value);
                      }}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Without label' }}
                      IconComponent={KeyboardArrowDownIcon} 
                    >
                      <MenuItem value="">
                      Select team member
                      </MenuItem>
                      <MenuItem value={5} data-value="5">5</MenuItem>
                    </Select>
                  </FormControl>
                    </div>
                  </div>
                    </Col>
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>Payment Terms</label>
                    <div className={`inputInfo `}>
                    <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                      <Select
                        value={paymentterms}
                        onChange={(e) => {
                          setPaymentTerms(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        IconComponent={KeyboardArrowDownIcon} 
                      >
                        <MenuItem value="">
                        Select team member
                        </MenuItem>
                        <MenuItem value={1} data-value="1">1</MenuItem>
                        <MenuItem value={2} data-value="2">2</MenuItem>
                      </Select>
                    </FormControl>
                    </div>
                  </div>
                    </Col>
                    <Col sm={6}>
                    <div className="formgroup mb-2 mt-3">
                    <label>App Logo</label>
                    <div className="upload-btn-wrapper">
                            <button className="btnup">
                              <div className="iconPerson">
                                <Upload color="#475467" size={32} />
                              </div>
                              <div className="textbtm">
                                <p>
                                  <span>Click to upload</span> or drag and drop
                                  <br></br>
                                  SVG, PNG, JPG or GIF (max. 800x400px)
                                </p>
                              </div>
                            </button>
                            <input type="file" onChange={handleImageUpload} />
                            {image && (
                        <div className='uploadImgWrap'>
                         <div>
                         <img src={image} alt="Uploaded" />
                          <div className='updatebut'>
                          <button className='update' onClick={handleImageUpdate}>Update</button>
                          <button className='delete' onClick={handleImageDelete}>Delete</button>
                          </div>
                          </div>
                        </div>
                      )}
                          </div>
                         
                  </div>
                    </Col>
                  </Row>
                  </div>
             
        </div>
        </div>
        <div className="updateButtonGeneral"><button className="cancel">Cancel</button><button  onClick={handleStepDetails} className="save">Next Step</button></div>
        </div>
  )
}
export default BusinessDetails