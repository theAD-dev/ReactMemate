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

const Subscription = () => {
  const [activeTab, setActiveTab] = useState("subscription");

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
            <div className={`content_wrap_main`}>
              <div className="content_wrapper">
              <div className= {`listwrapper ${styles.listsubscription}`}>
                  <div className="topHeadStyle">
                    <div className="">
                      <h2>Subscription</h2>
                      <p>
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
                          <img src={ThemeImages.buildingCheck} alt="buildingCheck"/>
                         
                          </div>
                          <div className="progressSubsIn">
                            <h4>Business Subscription </h4>
                            <div class="progressWrapMain">
                              <div class="progressWrapSubs">
                                <div
                                  className="progress-bar bg-businessBar"
                                  style={{ width: "100%" }}
                                ></div>
                              </div>
                              <span className={styles.textGradient}>ON</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="progressSubsstart marginTopSpance ">
                        <div className="progressSubsWrap">
                          <div className="progressSubsIcon">
                          <img src={ThemeImages.buildingssubs} alt="buildingssubs"/>
                        
                          </div>
                          <div className="progressSubsIn">
                            <h4>Company Users </h4>
                            <div class="progressWrapMain">
                              <div class="progressWrapSubs">
                                <div
                                  className="progress-bar bg-companyBar"
                                  style={{ width: "40%" }}
                                ></div>
                              </div>
                              <span>1/2</span>
                            </div>
                            <div className="progressButton">
                              <button className="paynow">
                                Purchase Company Users
                              </button>
                              <button className="close">Remove Users</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="progressSubsstart ">
                        <div className="progressSubsWrap">
                          <div className="progressSubsIcon">
                          <img src={ThemeImages.hddNetwork} alt="hddNetwork"/>
                          
                          </div>
                          <div className="progressSubsIn">
                            <h4>Work Subscription</h4>
                            <div class="progressWrapMain">
                              <div class="progressWrapSubs">
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
                    <li>
                      <div className="progressSubsstart ">
                        <div className="progressSubsWrap">
                          <div className="progressSubsIcon">
                          <img src={ThemeImages.appIndicator} alt="appIndicator"/>
                          
                          </div>
                          <div className="progressSubsIn">
                            <h4>Mobile App Users</h4>
                            <div class="progressWrapMain">
                              <div class="progressWrapSubs">
                                <div
                                  className="progress-bar bg-appBar"
                                  style={{ width: "1%" }}
                                ></div>
                              </div>
                              <span>0/0</span>
                            </div>
                            <div className="progressButton">
                              <button className="paynow">
                                Purchase Mobile App Users
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="progressSubsstart ">
                        <div className="progressSubsWrap">
                          <div className="progressSubsIcon">
                          <img src={ThemeImages.geoAlt} alt="geoAlt"/>
                          </div>
                          <div className="progressSubsIn">
                            <h4>Locations</h4>
                            <div class="progressWrapMain">
                              <div class="progressWrapSubs">
                                <div
                                  className="progress-bar bg-locationsBar"
                                  style={{ width: "100%" }}
                                ></div>
                              </div>
                              <span>1/1</span>
                            </div>
                            <div className="progressButton">
                              <SubscriptionModal />
                              <button className="close">
                                Remove Locations
                              </button>
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
                    <p>
                      <strong>Business Subscription</strong> allows you to use
                      the following features: Sales, Project Management,
                      Invoices, Expense Statistics, Order Management, as well as
                      managing Clients and Suppliers
                    </p>
                    <br></br>{" "}
                    <p>
                      <strong>Company Users</strong> can operate the desktop
                      account for the company and can be assigned different
                      roles, such as Admin, General Manager, Manager, Sales
                      Manager, or Accounts.
                    </p>
                    <br></br>{" "}
                    <p>
                      <strong>Work Subscription</strong> enables you to utilise
                      the application to assign jobs to contractors, employees,
                      or shift workers. You can manage jobs assigned to your app
                      users, track time through the application, and allow users
                      to participate in projects remotely.
                    </p>
                    <br></br>{" "}
                    <p>
                      <strong>Mobile users:</strong> Mobile application users
                      can communicate with independent contractors and shift
                      workers for time tracking on location. This app is ideal
                      for individuals who do not require access to the Company
                      Management Desktop system.
                    </p>
                    <br></br>{" "}
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
    </>
  );
};

export default Subscription;
