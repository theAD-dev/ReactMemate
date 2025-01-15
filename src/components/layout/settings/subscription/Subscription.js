import { Link } from "react-router-dom";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import styles from "./subscription.module.scss";
import ThemeImages from '../../../../assets/imgconstant';
import { Divider } from "@mui/material";
import AddRemoveCompanyUser from "./features/add-remove-company-user";
import { useQuery } from "@tanstack/react-query";
import { getSubscriptions } from "../../../../APIs/settings-subscription-api";
import { getDesktopUserList, getMobileUserList } from "../../../../APIs/settings-user-api";
import AddRemoveMobileUser from "./features/add-remove-mobile-user";

const Subscription = () => {
  const [activeTab, setActiveTab] = useState("subscription");
  const [visible, setVisible] = useState(false);
  const [mobileUserVisible, setMobileUserVisible] = useState(false);

  const subscriptionQuery = useQuery({ queryKey: ['subscription'], queryFn: getSubscriptions });
  const desktopUsersQuery = useQuery({ queryKey: ['desktop-users-list'], queryFn: getDesktopUserList });
  const activeUser = desktopUsersQuery?.data?.users?.filter((user) => user.is_active) || 0;
  const mobileUsersQuery = useQuery({ queryKey: ['mobile-users'], queryFn: getMobileUserList });

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
                              <div className="subscriptionPrice active">${subscriptionQuery?.data?.business?.amount || "0.00"}</div>
                            </div>
                            <div className="progressWrapMain">
                              <div className="progressWrapSubs">
                                <div className="progress-bar bg-businessBar" style={{ width: `${subscriptionQuery?.data?.business ? 100 : 0}%` }}></div>
                              </div>
                              <span className={styles.textGradient}>{subscriptionQuery?.data?.business ? "ON" : "OFF"}</span>
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
                              <div className="subscriptionPrice active">${parseFloat(parseFloat(subscriptionQuery?.data?.business_user_cost || 0) * parseInt((subscriptionQuery?.data?.business?.max_users || 0) - (subscriptionQuery?.data?.default_business_users || 0))).toFixed(2)}</div>
                            </div>
                            <div className="progressWrapMain">
                              <div className="progressWrapSubs">
                                <div
                                  className="progress-bar bg-companyBar"
                                  style={{ width: `${((subscriptionQuery?.data?.business?.total_users || 0) / (subscriptionQuery?.data?.business?.max_users || 0)) * 100}%` }}
                                ></div>
                              </div>
                              <span>{subscriptionQuery?.data?.business?.total_users || 0}/{subscriptionQuery?.data?.business?.max_users || 0}</span>
                            </div>
                            <div className="progressButton">
                              <button className="paynow" onClick={() => setVisible(true)}>Add or Remove Users</button>
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
                              <div className="subscriptionPrice">${subscriptionQuery?.data?.work?.amount || "0.00"}</div>
                            </div>

                            <div className="progressWrapMain">
                              <div className="progressWrapSubs">
                                <div
                                  className="progress-bar bg-WorkBar"
                                  style={{ width: `${subscriptionQuery?.data?.work ? 100 : 0}%` }}
                                ></div>
                              </div>
                              <span>{subscriptionQuery?.data?.work ? "ON" : "OFF"}</span>
                            </div>
                            <div className="progressButton">
                              <button className="paynow" disabled>
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
                              <div className="subscriptionPrice">${parseFloat(parseFloat(subscriptionQuery?.data?.work_user_cost || 0) * parseInt((subscriptionQuery?.data?.work?.max_workers || 0) - (subscriptionQuery?.data?.default_work_users || 0))).toFixed(2)}</div>
                            </div>

                            <div className="progressWrapMain">
                              <div className="progressWrapSubs">
                                <div
                                  className="progress-bar bg-appBar"
                                  style={{ width: `${((subscriptionQuery?.data?.work?.total_workers || 0) / (subscriptionQuery?.data?.work?.max_workers || 0)) * 100}%` }}
                                ></div>
                              </div>
                              <span>{subscriptionQuery?.data?.work?.total_workers || 0}/{subscriptionQuery?.data?.work?.max_workers || 0}</span>
                            </div>
                            <div className="progressButton">
                              <button className="paynow" onClick={() => setMobileUserVisible(true)}>
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
                              <div className="subscriptionPrice active">${subscriptionQuery?.data?.location?.amount || "0.00"}</div>
                            </div>

                            <div className="progressWrapMain">
                              <div className="progressWrapSubs">
                                <div
                                  className="progress-bar bg-locationsBar"
                                  style={{ width: `${((subscriptionQuery?.data?.location?.total_locations || 0) / (subscriptionQuery?.data?.location?.max_locations || 0)) * 100}%` }}
                                ></div>
                              </div>
                              <span>{subscriptionQuery?.data?.location?.total_locations || 0}/{subscriptionQuery?.data?.location?.max_locations || 0}</span>
                            </div>

                            <div className="progressButton">
                              <button className="paynow" disabled>Purchase Locations</button>
                              <button className="close" disabled>Remove Locations</button>
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
                      <p className="repaymentStatusBox-text-2">${subscriptionQuery?.data?.total_amount || "0.00"}</p>
                      <p className="repaymentStatusBox-text-3">/month</p>
                    </div>
                    <p>
                      <strong>Business Subscription</strong> allows you to use
                      the following features: Sales, Project Management,
                      Invoices, Expense Statistics, Order Management, as well as
                      managing Clients and Suppliers
                    </p>
                    <Divider className="mb-2" />
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
                    <br></br><br />{" "}
                    <p>
                      <strong>Mobile users:</strong> Mobile application users
                      can communicate with independent contractors and shift
                      workers for time tracking on location. This app is ideal
                      for individuals who do not require access to the Company
                      Management Desktop system.
                    </p>
                    <br></br><br />{" "}
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
      <AddRemoveCompanyUser users={activeUser} defaultUser={subscriptionQuery?.data?.default_business_users || 0} refetch={desktopUsersQuery?.refetch} total={subscriptionQuery?.data?.business?.max_users || 0} visible={visible} setVisible={setVisible} price={parseFloat(subscriptionQuery?.data?.business_user_cost || 0)} additionalUser={(subscriptionQuery?.data?.business?.max_users || 0) - (subscriptionQuery?.data?.default_business_users || 0)} />
      <AddRemoveMobileUser refetch={mobileUsersQuery?.refetch} total={mobileUsersQuery?.data?.limits?.total} price={subscriptionQuery?.data?.total_amount} visible={mobileUserVisible} setVisible={setMobileUserVisible} users={mobileUsersQuery?.data?.users} />
    </>
  );
};

export default Subscription;
