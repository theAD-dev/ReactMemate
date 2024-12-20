import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./../Sidebar";
import classNames from 'classnames';
import BillingInfiVisa from "../../../../assets/images/icon/visaBilling.png";
import { PencilSquare, ExclamationCircle, CheckLg } from "react-bootstrap-icons";
import { SettingsBankInformation, updateBankInformation } from "../../../../APIs/SettingsGeneral";
import AddpaymentModal from "./../AddpaymentModal";
import { Button, Card, Col, Row } from "react-bootstrap";

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
          <div className="settings-content ps-0">
            <div className="headSticky ps-4">
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
            <div className={`content_wrap_main bg-grey p-4`}>
              <div className="content_wrapper1">
                <div className="topHeadStyle rounded mb-3">
                  <div className="pt-3 ps-4">
                    <h2 className="Exclamation">
                      <span>
                        <ExclamationCircle color="#344054" size={20} />
                      </span>
                      <strong> Next Payment </strong> Your next monthly payment
                      100$ will be charged on Nov 27, 2023.
                    </h2>
                  </div>
                </div>

                <Row>
                  <Col xs={7}>
                    <Card className="border-0 rounded p-0">
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-4">
                          <h1 className="font-18 m-0">Personal Info</h1>
                          <button className="text-button">Edit</button>
                        </div>
                        <div className="bg-grey p-3 mb-4">
                          <Row>
                            <Col>
                              <div className="form-group">
                                <label className="lable">Full Name</label>
                                <p className="mb-0 font-16 font-600">Max Narelik</p>
                              </div>
                            </Col>
                            <Col>
                              <div className="form-group">
                                <label className="lable">Phone</label>
                                <p className="mb-0 font-16 font-600 color-blue d-flex gap-2 align-items-center">
                                  1300882582
                                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                    <path d="M4.15387 1.32849C3.90343 1.00649 3.42745 0.976861 3.139 1.26531L2.10508 2.29923C1.6216 2.78271 1.44387 3.46766 1.6551 4.06847C2.50338 6.48124 3.89215 8.74671 5.82272 10.6773C7.75329 12.6078 10.0188 13.9966 12.4315 14.8449C13.0323 15.0561 13.7173 14.8784 14.2008 14.3949L15.2347 13.361C15.5231 13.0726 15.4935 12.5966 15.1715 12.3461L12.8653 10.5524C12.7008 10.4245 12.4866 10.3793 12.2845 10.4298L10.0954 10.9771C9.50082 11.1257 8.87183 10.9515 8.43845 10.5181L5.98187 8.06155C5.54849 7.62817 5.37427 6.99919 5.52292 6.40459L6.07019 4.21553C6.12073 4.01336 6.07552 3.79918 5.94758 3.63468L4.15387 1.32849ZM2.38477 0.511076C3.12689 -0.231039 4.3515 -0.154797 4.99583 0.673634L6.78954 2.97983C7.1187 3.40304 7.23502 3.95409 7.10498 4.47423L6.55772 6.66329C6.49994 6.8944 6.56766 7.13888 6.7361 7.30732L9.19268 9.7639C9.36113 9.93235 9.6056 10.0001 9.83671 9.94229L12.0258 9.39502C12.5459 9.26499 13.097 9.3813 13.5202 9.71047L15.8264 11.5042C16.6548 12.1485 16.731 13.3731 15.9889 14.1152L14.955 15.1492C14.2153 15.8889 13.1089 16.2137 12.0778 15.8512C9.51754 14.9511 7.11438 13.4774 5.06849 11.4315C3.0226 9.38562 1.54895 6.98246 0.648838 4.42225C0.286318 3.39112 0.61113 2.28472 1.35085 1.545L2.38477 0.511076Z" fill="#106B99" />
                                  </svg>
                                </p>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        <div className="bg-grey p-3 mb-4">
                          <Row>
                            <Col>
                              <div className="form-group">
                                <label className="lable">Business Name</label>
                                <p className="mb-0 font-16 font-600">theAd</p>
                              </div>
                            </Col>
                            <Col>
                              <div className="form-group">
                                <label className="lable">Australian Business Number</label>
                                <p className="mb-0 font-16 font-600">1424897931749</p>
                              </div>
                            </Col>
                          </Row>
                        </div>

                        <div className="bg-grey p-3 mb-4">
                          <Row>
                            <Col xs={6}>
                              <div className="form-group">
                                <label className="lable">Country</label>
                                <p className="font-16 font-600">Australia</p>
                              </div>
                            </Col>
                            <Col xs={6}></Col>
                            <Col xs={6}>
                              <div className="form-group">
                                <label className="lable">State</label>
                                <p className="font-16 font-600">New South Wales</p>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <div className="form-group">
                                <label className="lable">City/Suburb</label>
                                <p className="font-16 font-600">Winburndale</p>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <div className="form-group">
                                <label className="lable">Street Address</label>
                                <p className="font-16 font-600">Sydney Street of 9143</p>
                              </div>
                            </Col>
                            <Col xs={6}>
                              <div className="form-group">
                                <label className="lable">Postcode</label>
                                <p className="font-16 font-600">2795</p>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xs={5}>
                    <Card className="border-0 rounded">
                      <Card.Body>
                        <h1 className="font-18">Payment Method o</h1>
                        <div className="bg-grey p-3 mb-4 d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="32" viewBox="0 0 46 32" fill="none">
                              <path d="M0.5 4C0.5 2.067 2.067 0.5 4 0.5H42C43.933 0.5 45.5 2.067 45.5 4V28C45.5 29.933 43.933 31.5 42 31.5H4C2.067 31.5 0.5 29.933 0.5 28V4Z" fill="white" />
                              <path d="M0.5 4C0.5 2.067 2.067 0.5 4 0.5H42C43.933 0.5 45.5 2.067 45.5 4V28C45.5 29.933 43.933 31.5 42 31.5H4C2.067 31.5 0.5 29.933 0.5 28V4Z" stroke="#EAECF0" />
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.3321 21.1444H11.5858L9.52638 13.0565C9.42863 12.6845 9.22108 12.3556 8.91579 12.2006C8.15389 11.811 7.31432 11.501 6.39844 11.3446V11.0332H10.8225C11.4331 11.0332 11.8911 11.501 11.9674 12.0442L13.0359 17.8782L15.7809 11.0332H18.4509L14.3321 21.1444ZM19.9774 21.1444H17.3837L19.5195 11.0332H22.1131L19.9774 21.1444ZM25.4687 13.8343C25.545 13.2898 26.003 12.9784 26.5372 12.9784C27.3768 12.9002 28.2914 13.0566 29.0546 13.4448L29.5125 11.2678C28.7493 10.9564 27.9097 10.8 27.1478 10.8C24.6305 10.8 22.7987 12.2006 22.7987 14.1444C22.7987 15.6231 24.0962 16.3995 25.0121 16.8673C26.003 17.3337 26.3846 17.6451 26.3083 18.1114C26.3083 18.811 25.545 19.1224 24.7831 19.1224C23.8672 19.1224 22.9514 18.8892 22.1131 18.4997L21.6552 20.678C22.5711 21.0662 23.5619 21.2226 24.4778 21.2226C27.3005 21.2994 29.0546 19.9002 29.0546 17.8001C29.0546 15.1553 25.4687 15.0003 25.4687 13.8343ZM38.1318 21.1444L36.0724 11.0332H33.8603C33.4024 11.0332 32.9444 11.3446 32.7918 11.811L28.9783 21.1444H31.6483L32.1812 19.667H35.4618L35.7671 21.1444H38.1318ZM34.2419 13.7562L35.0038 17.5669H32.8681L34.2419 13.7562Z" fill="#172B85" />
                            </svg>
                            <div className="d-flex flex-column">
                              <p className="mb-0 font-500 color-344054 font-14">Visa ending in 1234</p>
                              <p className="mb-0 color-475467 font-14">Expiry 06/2024</p>
                            </div>
                          </div>
                          <Button className="text-button bg-transparent">Change</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingInfo;
