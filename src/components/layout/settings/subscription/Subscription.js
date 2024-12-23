import { Link } from "react-router-dom";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import styles from "./subscription.module.scss";
import ThemeImages from '../../../../assets/imgconstant';


import {
  AppIndicator,
  GeoAlt,
} from "react-bootstrap-icons";
import SubscriptionModal from "../SubscriptionModal";
import { Divider } from "@mui/material";
import AddRemoveCompanyUser from "./features/add-remove-company-user";

const Subscription = () => {
  const [activeTab, setActiveTab] = useState("subscription");
  const [visible, setVisible] = useState(true);

  return (
    <>
      <div className="settings-wrap subscription-page">
        <div className="settings-wrapper">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="settings-content">
            <div className="headSticky">
              <h1>Subscription</h1>
              <div className="contentMenuTab">
                <ul>
                  <li className="menuActive">
                    <Link to="/settings/generalinformation/subscription">
                      Subscription
                    </Link>
                  </li>
                  <li>
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
            <div className={`content_wrap_main pt-4`}>
              <div className="content_wrapper">
                <div className={`listwrapper ${styles.listsubscription}`}>
                  <div className="topHeadStyle">
                    <div className="border-bottom mb-4">
                      <h2>Subscription</h2>
                      <p className="font-14">
                        Here, you can manage your subscription, adding or
                        removing users and features as needed.
                      </p>
                    </div>
                  </div>

                  <ul>
                    <li>
                      <div className="progressSubsstart actibeSubscription">
                        <div className="progressSubsWrap">
                          <div className="progressSubsIcon">
                            <img src={ThemeImages.buildingCheck} alt="buildingCheck" />
                          </div>
                          <div className="progressSubsIn">
                            <div className="d-flex justify-content-between mb-1">
                              <h4>Business Subscription </h4>
                              <div className="subscriptionPrice active">$14</div>
                            </div>
                            <div className="progressWrapMain">
                              <div className="progressWrapSubs">
                                <div className="progress-bar bg-businessBar" style={{ width: "100%" }}></div>
                              </div>
                              <span className={styles.textGradient}>ON</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="progressSubsstart marginTopSpance ">
                        <div className="progressSubsWrap">
                          <div className="progressSubsIcon">
                            <img src={ThemeImages.buildingssubs} alt="buildingssubs" />
                          </div>
                          <div className="progressSubsIn">
                            <div className="d-flex justify-content-between mb-1">
                              <h4>Company Users</h4>
                              <div className="subscriptionPrice active">$23</div>
                            </div>
                            <div className="progressWrapMain">
                              <div className="progressWrapSubs">
                                <div
                                  className="progress-bar bg-companyBar"
                                  style={{ width: "40%" }}
                                ></div>
                              </div>
                              <span>1/2</span>
                            </div>
                            <div className="progressButton">
                              <button className="paynow">Add or Remove Users</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    <p className="border-bottom py-2 mb-4 font-16">Add-ons</p>

                    <li>
                      <div className="progressSubsstart ">
                        <div className="progressSubsWrap">
                          <div className="progressSubsIcon">
                            <img src={ThemeImages.hddNetwork} alt="hddNetwork" />
                          </div>
                          <div className="progressSubsIn">
                            <div className="d-flex justify-content-between mb-1">
                              <h4>Work Subscription</h4>
                              <div className="subscriptionPrice">$0</div>
                            </div>

                            <div className="progressWrapMain">
                              <div className="progressWrapSubs">
                                <div
                                  className="progress-bar bg-WorkBar"
                                  style={{ width: "5%" }}
                                ></div>
                              </div>
                              <span>OFF</span>
                            </div>
                            <div className="progressButton">
                              <button className="paynow">
                                Active Work Subscription
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    <p className="border-bottom py-2 mb-3 mt-1 font-16"></p>

                    <li>
                      <div className="progressSubsstart ">
                        <div className="progressSubsWrap">
                          <div className="progressSubsIcon">
                            <img src={ThemeImages.appIndicator} alt="appIndicator" />
                          </div>
                          <div className="progressSubsIn">
                            <div className="d-flex justify-content-between mb-1">
                              <h4>Mobile App Users</h4>
                              <div className="subscriptionPrice">$0</div>
                            </div>

                            <div className="progressWrapMain">
                              <div className="progressWrapSubs">
                                <div
                                  className="progress-bar bg-appBar"
                                  style={{ width: "1%" }}
                                ></div>
                              </div>
                              <span>0/0</span>
                            </div>
                            <div className="progressButton">
                              <button className="paynow">
                                Add or Remove Users
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    <p className="border-bottom py-2 mb-3 mt-1 font-16"></p>

                    <li>
                      <div className="progressSubsstart mb-4">
                        <div className="progressSubsWrap">
                          <div className="progressSubsIcon">
                            <img src={ThemeImages.geoAlt} alt="geoAlt" />
                          </div>
                          <div className="progressSubsIn">
                            <div className="d-flex justify-content-between mb-1">
                              <h4>Locations</h4>
                              <div className="subscriptionPrice active">$56</div>
                            </div>

                            <div className="progressWrapMain">
                              <div className="progressWrapSubs">
                                <div
                                  className="progress-bar bg-locationsBar"
                                  style={{ width: "100%" }}
                                ></div>
                              </div>
                              <span>1/1</span>
                            </div>
                            <div className="progressButton">
                              <button className="paynow">Purchase Locations</button>
                              <button className="close">Remove Locations</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>

                    <button className="closeSubscription">
                      Cancel Subscription
                    </button>
                  </ul>
                </div>
                <div className="rightText">
                  <div className="editwrapper">
                    <div className="repaymentStatusBox w-100 mb-4">
                      <p className="repaymentStatusBox-text-1">Current  repayments</p>
                      <p className="repaymentStatusBox-text-2">$3,454</p>
                      <p className="repaymentStatusBox-text-3">/month</p>
                    </div>
                    <p>
                      <strong>Business Subscription</strong> allows you to use
                      the following features: Sales, Project Management,
                      Invoices, Expense Statistics, Order Management, as well as
                      managing Clients and Suppliers
                    </p>
                    <Divider className="mb-2"/>
                    <p className="mb-5">
                      <strong>Company Users</strong> can operate the desktop
                      account for the company and can be assigned different
                      roles, such as Admin, General Manager, Manager, Sales
                      Manager, or Accounts.
                    </p>
                 
                    <p className="pt-5">
                      <strong>Work Subscription</strong> enables you to utilise
                      the application to assign jobs to contractors, employees,
                      or shift workers. You can manage jobs assigned to your app
                      users, track time through the application, and allow users
                      to participate in projects remotely.
                    </p>
                    <br></br><br/>{" "}
                    <p>
                      <strong>Mobile users:</strong> Mobile application users
                      can communicate with independent contractors and shift
                      workers for time tracking on location. This app is ideal
                      for individuals who do not require access to the Company
                      Management Desktop system.
                    </p>
                    <br></br><br/>{" "}
                    <p>
                      <strong>Locations:</strong> Additional features for
                      Companies with multiple branches/Locations. It allows you
                      to operate multiple locations simultaneously{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddRemoveCompanyUser visible={visible} setVisible={setVisible} />
    </>
  );
};

export default Subscription;
