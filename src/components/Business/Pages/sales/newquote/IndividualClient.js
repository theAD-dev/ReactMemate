import React, { useState } from 'react';
import { People, InfoSquare, ChevronLeft, CardList, Person } from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router-dom";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { clientsIndividualClient } from "../../../../../APIs/NewQuoteApis";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import FeaturediconOutline from "../../../../../assets/images/icon/Featuredicon-outline.png";
import Alert from 'react-bootstrap/Alert';

const IndividualClient = () => {
  const [formData, setFormData] = useState({
    address: '',
    suburb: '',
    state: '',
    postcode: '',
    fname: '',
    lname: '',
    email: '',
    pnumber: '+61', // Default phone number for Australia
    countryCode: 'AU'
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const handleStepDetails = () => {
    const { fname, suburb, postcode, email } = formData;
    let valid = true;
    let newErrors = {};

    if (fname.trim() === '') {
      newErrors.fname = 'First name is required';
      valid = false;
    }

    if (suburb.trim() === '') {
      newErrors.suburb = 'City/Suburb is required';
      valid = false;
    }

    if (postcode.trim() === '') {
      newErrors.postcode = 'Postcode is required';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      setError('Please fix the errors above to proceed.');
      return;
    }

    const mainData = {
      firstname: formData.fname,
      lastname: formData.lname,
      email: formData.email,
      phone: formData.pnumber,
      address: {
        city: formData.suburb,
        address: formData.address,
        state: formData.state,
        postcode: formData.postcode
      }
    };

        // Call the API function to submit data
        clientsIndividualClient(mainData)
        .then((responseData) => {
          console.log('responseData: ', responseData);
          navigate("/sales/newquote/client-information/step3/scope-of-work");
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          setError("Error submitting form. Please try again later.");
        });
  };

  return (
    <div className="newQuotePage bsdpage bsdindipage">
      <div className="dFlex">
        <div className='navStepsticky'>
          <div className="newQuoteBack">
            <button>
              <NavLink to="/sales/newquote/client-information/step1">
                <ChevronLeft color="#000000" size={20} /> Go Back
              </NavLink>
            </button>
          </div>
          <div className='navStepClient'>
            <ul>
              <li><span><People color="#D0D5DD" size={15} /></span> <p>Choose Client</p></li>
              <li className='activeClientTab'><span><InfoSquare color="#D0D5DD" size={15} /></span> <p>Client Information</p> </li>
              <li><span><CardList color="#D0D5DD" size={15} /></span> <p>Scope of Work</p> </li>
            </ul>
          </div>
          <div className="formgroupWrap1">
            <ul className='mt-4'>
              <li>
                <NavLink className="ActiveClient businessTab" to="#">
                  <span><Person color="#667085" size={24} /></span> Individual Client
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="newQuoteContent">
          <div className="formgroupboxs mt-0">
            {error && <Alert variant="alertBoxWrap" onClose={() => setError(null)} dismissible>
              <div className='alertBoxFlex'>
                <div className='alertIcon'>
                  <img className="FeaturediconOutline" src={FeaturediconOutline} alt="FeaturediconOutline" />
                </div>
                <div className='righttext'>
                  <h5>There was a problem with that action</h5>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum dolor.</p>
                </div>
              </div>
            </Alert>}
            <Row className='text-left mt-0'>
              <Col>
                <div className="formgroup mb-2 mt-0">
                  <label>First Name</label>
                  <div className={`inputInfo ${errors.fname ? 'error-border' : ''}`}>
                    <input
                      type="text"
                      name="fname"
                      value={formData.fname}
                      placeholder='First Name'
                      onChange={handleInputChange}
                    />
                    {errors.fname && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                  </div>
                  {errors.fname && <p className="error-message">{errors.fname}</p>}
                </div>
              </Col>
              <Col sm={6}>
                <div className="formgroup mb-2 mt-0">
                  <label>Last Name</label>
                  <div className="inputInfo">
                    <input
                      type="text"
                      name="lname"
                      value={formData.lname}
                      placeholder='Enter last name'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </Col>
              <Col sm={6}>
                <div className="formgroup mb-2 mt-3">
                  <label>Email</label>
                  <div className={`inputInfo ${errors.email ? 'error-border' : ''}`}>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      placeholder='company@email.com'
                      onChange={handleInputChange}
                    />
                    {errors.email && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                  </div>
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
              </Col>
              <Col sm={6}>
                <div className="formgroup phoneInputBoxStyle mb-2 mt-3">
                  <label>Phone number</label>
                  <div className="inputInfo">
                    <PhoneInput
                      country={formData.countryCode}
                      value={formData.pnumber}
                      onChange={(pnumber) => setFormData({ ...formData, pnumber })}
                    />
                  </div>
                </div>
              </Col>
              <Col sm={12}>
                <div className="formgroup mb-2 mt-3">
                  <label>Country</label>
                  <div className="inputInfo">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      placeholder='Avenue 35 SY'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </Col>
              <Col sm={6}>
                <div className="formgroup mb-2 mt-3">
                  <label>Street Address</label>
                  <div className="inputInfo">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      placeholder='Avenue 35 SY'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </Col>
              <Col sm={6}>
                <div className="formgroup mb-2 mt-3">
                  <label>City/Suburb</label>
                  <div className={`inputInfo ${errors.suburb ? 'error-border' : ''}`}>
                    <input
                      type="text"
                      name="suburb"
                      value={formData.suburb}
                      placeholder='Sydney'
                      onChange={handleInputChange}
                    />
                    {errors.suburb && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                  </div>
                  {errors.suburb && <p className="error-message">{errors.suburb}</p>}
                </div>
              </Col>
              <Col sm={6}>
                <div className="formgroup mb-2 mt-3">
                  <label>State</label>
                  <div className="inputInfo">
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      placeholder='AU State'
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </Col>
              <Col sm={6}>
                <div className="formgroup mb-2 mt-3">
                  <label>Postcode</label>
                  <div className={`inputInfo ${errors.postcode ? 'error-border' : ''}`}>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      placeholder='4531 13'
                      onChange={handleInputChange}
                    />
                    {errors.postcode && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                  </div>
                  {errors.postcode && <p className="error-message">{errors.postcode}</p>}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div className="updateButtonGeneral">
        <button className="cancel">Cancel</button>
        <button onClick={handleStepDetails} className="save">Next Step</button>
      </div>
    </div>
  );
};

export default IndividualClient;
