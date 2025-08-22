import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "sonner";
import AddRemoveCompanyUser from "./features/add-remove-company-user";
import AddRemoveMobileUser from "./features/add-remove-mobile-user";
import CancelSubscription from "./features/cancel-subscription";
import { ActivateWorkSubscription } from "./features/work-subscription/activate-work-subscription";
import styles from "./subscription.module.scss";
import { cancelWorkSubscription, getSubscriptions } from "../../../../APIs/settings-subscription-api";
import { getDesktopUserList, getMobileUserList } from "../../../../APIs/settings-user-api";
import { useAuth } from "../../../../app/providers/auth-provider";
import { useTrialHeight } from "../../../../app/providers/trial-height-provider";
import ThemeImages from '../../../../assets/imgconstant';
import { PERMISSIONS } from "../../../../shared/lib/access-control/permission";
import { hasPermission } from "../../../../shared/lib/access-control/role-permission";
import { formatAUD } from "../../../../shared/lib/format-aud";

const Subscription = () => {
  const { role } = useAuth();
  const { trialHeight } = useTrialHeight();
  const [visible, setVisible] = useState(false);
  const [mobileUserVisible, setMobileUserVisible] = useState(false);

  const subscriptionQuery = useQuery({ queryKey: ['subscription'], queryFn: getSubscriptions });
  const desktopUsersQuery = useQuery({ queryKey: ['desktop-users-list'], queryFn: getDesktopUserList });
  const activeUser = desktopUsersQuery?.data?.users?.filter((user) => user.is_active) || [];
  const mobileUsersQuery = useQuery({ queryKey: ['mobile-users'], queryFn: getMobileUserList });
  const activeMobileUser = mobileUsersQuery?.data?.users?.filter((user) => user.status !== 'disconnected') || [];

  const hasWorkSubscription = subscriptionQuery?.data?.work !== null ? true : false;

  const cancelWorkMutation = useMutation({
    mutationFn: cancelWorkSubscription,
    onSuccess: () => {
      toast.success("Work subscription canceled successfully!");
      window.location.reload();
    },
    onError: (error) => {
      console.error("Error canceling work subscription:", error);
      toast.error("Failed to cancel work subscription. Please try again.");
    },
  });



  return (
    <>
      <div className="subscription-page">
        <Helmet>
          <title>MeMate - Subscription</title>
        </Helmet>

        <div className="settings-content w-100">
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
          <div className={`content_wrap_main pt-4`} style={{ paddingBottom: `${trialHeight}px` }}>
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
                    <div className="progressSubsstart actibeSubscription" style={{ marginTop: '40px' }}>
                      <div className="progressSubsWrap">
                        <div className="progressSubsIcon">
                          <img src={ThemeImages.buildingCheck} alt="buildingCheck" />
                        </div>
                        <div className="progressSubsIn">
                          <div className="d-flex justify-content-between mb-1">
                            <h4>Business Subscription </h4>
                            <div className="subscriptionPrice active">${formatAUD(subscriptionQuery?.data?.business?.amount || "0.00")}</div>
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

                    <div className="progressSubsstart marginTopSpance" style={{ marginTop: '30px' }}>
                      <div className="progressSubsWrap">
                        <div className="progressSubsIcon">
                          <img src={ThemeImages.buildingssubs} alt="buildingssubs" />
                        </div>
                        <div className="progressSubsIn">
                          <div className="d-flex justify-content-between mb-1">
                            <h4>Company Users</h4>
                            <div className="subscriptionPrice active">${formatAUD(parseFloat(parseFloat(subscriptionQuery?.data?.business_user_cost || 0) * parseInt((subscriptionQuery?.data?.business?.max_users || 0) - (subscriptionQuery?.data?.default_business_users || 0))).toFixed(2))}</div>
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
                            {
                              hasPermission(role, PERMISSIONS.SETTINGS.SUBSCRIPTION.BUY_COMPANY_USER_SUBSCRIPTION) && (
                                <button className="paynow" onClick={() => setVisible(true)}>
                                  Add or Remove Users
                                </button>
                              )
                            }
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
                            <div className="subscriptionPrice">${formatAUD(subscriptionQuery?.data?.work?.amount || "0.00")}</div>
                          </div>

                          <div className="progressWrapMain">
                            <div className="progressWrapSubs">
                              <div
                                className="progress-bar bg-WorkBar"
                                style={{ width: `${subscriptionQuery?.data?.work ? 100 : 0}%` }}
                              ></div>
                            </div>
                            <span>{hasWorkSubscription ? "ON" : "OFF"}</span>
                          </div>
                          <div className="progressButton">
                            {
                              hasWorkSubscription ?
                                hasPermission(role, PERMISSIONS.SETTINGS.SUBSCRIPTION.CANCEL_WORK_SUBSCRIPTION) && (
                                  <button className="close d-flex gap-1 align-items-center" disabled={cancelWorkMutation.isPending} onClick={() => cancelWorkMutation.mutate()}>
                                    Cancel Subscription
                                    {cancelWorkMutation.isPending && <ProgressSpinner style={{ width: '18px', height: '18px' }}></ProgressSpinner>}
                                  </button>
                                ) :
                                hasPermission(role, PERMISSIONS.SETTINGS.SUBSCRIPTION.ACTIVE_WORK_SUBSCRIPTION) && (
                                  <ActivateWorkSubscription />
                                )
                            }
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
                            <div className="subscriptionPrice">${formatAUD(parseFloat(parseFloat(subscriptionQuery?.data?.work_user_cost || 0) * parseInt((subscriptionQuery?.data?.work?.max_workers || 0) - (hasWorkSubscription && subscriptionQuery?.data?.default_work_users || 0))).toFixed(2))}</div>
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
                            {
                              hasPermission(role, PERMISSIONS.SETTINGS.SUBSCRIPTION.BUY_WORK_USER_SUBSCRIPTION) && (
                                <button disabled={!hasWorkSubscription} className="paynow" onClick={() => setMobileUserVisible(true)}>
                                  Add or Remove Users
                                </button>
                              )
                            }
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
                            <div className="subscriptionPrice active">${formatAUD(subscriptionQuery?.data?.location?.amount || "0.00")}</div>
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
                            {
                              hasPermission(role, PERMISSIONS.SETTINGS.SUBSCRIPTION.BUY_LOCATION_SUBSCRIPTION) && (
                                <button className="paynow" disabled>
                                  Purchase Locations
                                </button>
                              )
                            }
                            {
                              hasPermission(role, PERMISSIONS.SETTINGS.SUBSCRIPTION.REMOVE_LOCATION_SUBSCRIPTION) && (
                                <button className="close" disabled>
                                  Remove Locations
                                </button>
                              )
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  {
                    hasPermission(role, PERMISSIONS.SETTINGS.SUBSCRIPTION.CANCEL_BUSINESS_SUBSCRIPTION) && (
                      <CancelSubscription />
                    )
                  }
                </ul>
              </div>
              <div className="rightText">
                <div className="editwrapper pt-1">
                  <div className="repaymentStatusBox w-100 mb-4">
                    <p className="repaymentStatusBox-text-1">Current  repayments</p>
                    <p className="repaymentStatusBox-text-2">${formatAUD(subscriptionQuery?.data?.total_amount || "0.00")}</p>
                    <p className="repaymentStatusBox-text-3">/month</p>
                  </div>
                  <p className="mb-0">
                    <strong>Business Subscription</strong> allows you to use
                    the following features: Sales, Project Management,
                    Invoices, Expense Statistics, Order Management, as well as
                    managing Clients and Suppliers
                  </p>

                  <p className="border-bottom py-2 mb-2 mt-0 font-16"></p>

                  <p className="mb-0">
                    <strong>Company Users</strong> can operate the desktop
                    account for the company and can be assigned different
                    roles, such as Admin, General Manager, Manager, Sales
                    Manager, or Accounts.
                  </p>


                  <p className="mb-0" style={{ marginTop: '120px' }}>
                    <strong>Work Subscription</strong> enables you to utilise
                    the application to assign jobs to contractors, employees,
                    or shift workers. You can manage jobs assigned to your app
                    users, track time through the application, and allow users
                    to participate in projects remotely.
                  </p>

                  <p className="mb-0" style={{ marginTop: '65px' }}>
                    <strong>Mobile users:</strong> Mobile application users
                    can communicate with independent contractors and shift
                    workers for time tracking on location. This app is ideal
                    for individuals who do not require access to the Company
                    Management Desktop system.
                  </p>


                  <p style={{ marginTop: '60px' }}>
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
      <AddRemoveCompanyUser users={activeUser} defaultUser={subscriptionQuery?.data?.default_business_users || 0} refetch={desktopUsersQuery?.refetch} total={subscriptionQuery?.data?.business?.max_users || 0} visible={visible} setVisible={setVisible} price={parseFloat(subscriptionQuery?.data?.business_user_cost || 0)} additionalUser={(subscriptionQuery?.data?.business?.max_users || 0) - (subscriptionQuery?.data?.default_business_users || 0)} />
      <AddRemoveMobileUser users={activeMobileUser} defaultUser={subscriptionQuery?.data?.default_work_users || 0} refetch={mobileUsersQuery?.refetch} total={subscriptionQuery?.data?.work?.max_workers} price={parseFloat(subscriptionQuery?.data?.work_user_cost || 0)} visible={mobileUserVisible} setVisible={setMobileUserVisible} additionalUser={(subscriptionQuery?.data?.work?.max_workers || 0) - (subscriptionQuery?.data?.default_work_users || 0)} />
    </>
  );
};

export default Subscription;
