import React, { useEffect, useState } from "react";
import { Placeholder } from "react-bootstrap";
import { XCircle } from "react-bootstrap-icons";
import { useLocation, NavLink, Outlet, Route, useNavigate, Navigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import style from './header.module.scss';
import Profile from "./Login/profile";
import ProfileInfo from "./ProfileInfo";
import SelectOption from "./SelectOption";
import DepartmentTurnoverPlan from "./settings/accounting/DepartmentTurnoverPlan";
import "./header.css";
import ExpensesAccount from "./settings/accounting/ExpensesAccount";
import CompanyEthos from "./settings/companyethos/CompanyEthos";
import CustomersDiscountCategory from "./settings/customerssettings/CustomersDiscountCategory";
import CustomersIndustries from "./settings/customerssettings/Industries";
import Integrations from "./settings/integrations";
import Location from "./settings/locations";
import MyProfile from "./settings/MyProfile";
import AppNotifications from "./settings/notifications/AppNotifications";
import DashboardNotifications from "./settings/notifications/DashboardNotifications";
import EmailNotifications from "./settings/notifications/EmailNotifications";
import OutgoingEmails from "./settings/projectstatus/outgoing-emails";
import ProjectStatus from "./settings/projectstatus/ProjectStatus";
import RecurringJobs from "./settings/quotesjobs/RecurringJobs";
import RecurringQuotes from "./settings/quotesjobs/RecurringQuotes";
import Subscription from "./settings/subscription/Subscription";
import CreateJobTemplate from "./settings/templates/create-job-template";
import CreateProposalTemplate from "./settings/templates/create-proposal-template";
import EmailSignatures from "./settings/templates/email-signatures";
import CreateEmailTemplate from "./settings/templates/email-template/create-email-template";
import EmailTemplates from "./settings/templates/email-template/email-templates";
import JobTemplates from "./settings/templates/job-templates";
import ProposalTemplates from "./settings/templates/proposal-templates";
import CreateSMSTemplate from "./settings/templates/sms-template/create-sms-template";
import TermsandConditions from "./settings/termsandconditions/TermsandConditions";
import TermsConditionsInvoice from "./settings/termsandconditions/TermsConditionsInvoice";
import { fetchProfile } from "../../APIs/ProfileApi";
import { useTrialHeight } from "../../app/providers/trial-height-provider";
import bookSquare from "../../assets/images/icon/book-square.svg";
import Briefcase from "../../assets/images/icon/briefcase.svg";
import calendarTick from "../../assets/images/icon/calendar-tick.svg";
import clipboardTick from "../../assets/images/icon/clipboard-tick.svg";
import ExpenseIcon from "../../assets/images/icon/ExpenseIcon.svg";
import InvoicesIcon from "../../assets/images/icon/InvoicesIcon.svg";
import ManagementIcon from "../../assets/images/icon/ManagementIcon.svg";
import OrdersIcon from "../../assets/images/icon/OrdersIcon.svg";
import ClientsIcon from "../../assets/images/icon/profile-2user.svg";
import Profile3user from "../../assets/images/icon/profile-3user.svg";
import SalesIcon from "../../assets/images/icon/SalesIcon.svg";
import StatisticsIcon from "../../assets/images/icon/StatisticsIcon.svg";
import statusUp from "../../assets/images/icon/status-up.svg";
import SuppliersIcon from "../../assets/images/icon/suppliersIcon.svg";
import Logo from "../../assets/images/logo.svg";
import Chat from "../../pages/work/chat";
import { formatDate } from "../../shared/lib/date-format";
import { FallbackImage } from "../../ui/image-with-fallback/image-avatar";
import ClientPage from "../Business/Pages/clients";
import ClientOrderHistory from "../Business/Pages/clients/client-order-history";
import ExpensesPage from "../Business/Pages/expenses";
import InvoicePage from "../Business/Pages/invoices";
import Management from "../Business/Pages/management/management-page";
import ProjectPage from "../Business/Pages/projects";
import ClientLayout from "../Business/Pages/sales/new-request";
import BusinessClientInformation from "../Business/Pages/sales/new-request/business-client-information";
import CalculateQuote from "../Business/Pages/sales/new-request/calculate-quote";
import ExistingClients from "../Business/Pages/sales/new-request/existing-clients";
import IndividualClientInformation from "../Business/Pages/sales/new-request/individual-client-information";
import NewClient from "../Business/Pages/sales/new-request/new-client";
import ScopeOfWorkComponent from "../Business/Pages/sales/new-request/scope-of-work";
import SelectClientType from "../Business/Pages/sales/new-request/select-client";
import Sales from "../Business/Pages/sales/sales-page";
import StatisticsPage from "../Business/Pages/statistics";
import Executive from "../Business/Pages/statistics/executive";
import KeyResultsPage from "../Business/Pages/statistics/key-results";
import Overview from "../Business/Pages/statistics/overview";
import SalesConversion from "../Business/Pages/statistics/sales-conversion";
import SupplierPage from "../Business/Pages/suppliers";
import SupplierHistoryPage from "../Business/Pages/suppliers/suppliers-history";
import Home from "../Home";
import Departments from "../layout/settings/calculators/Departments";
import BankDetails from "../layout/settings/generalinformation/BankDetails";
import GeneralInformation from "../layout/settings/generalinformation/GeneralInformation";
import RegionLanguage from "../layout/settings/generalinformation/RegionLanguage";
import BillingInfo from "../layout/settings/subscription/BillingInfo";
import Bills from "../layout/settings/subscription/Bills";
import MobileApp from "../layout/settings/users/MobileApp";
import Users from "../layout/settings/users/Users";
import ApprovalPage from "../Work/Pages/approval";
import Dashboard from "../Work/Pages/Dashboard";
import JobsPage from "../Work/Pages/jobs";
import News from "../Work/Pages/News";
import PeoplePage from "../Work/Pages/people";
import TaskPage from "../Work/Pages/tasks";
import { Work } from "../Work/Pages/Work";
import SMSTemplates from "./settings/templates/sms-template/sms-templates";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const { setTrialHeight } = useTrialHeight();
  const [isVisibleTrial, setIsVisibleTrial] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [menuSwitch, SetMenuSwitch] = useState(true);

  let profileDataLocal = {};
  try {
    profileDataLocal = JSON.parse(window.localStorage.getItem('profileData') || '{}');
  } catch (error) {
    console.error('Error parsing profileData from localStorage:', error);
    window.localStorage.clear();
    window.sessionStorage.clear();
    navigate("/login");
  }
  const isSuspended = profileDataLocal?.is_suspended ? true : false;
  if (isSuspended) navigate("/suspended");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfile();
        setIsVisibleTrial(data?.is_trial || false);
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('location.pathname: ', location.pathname);
    if (location.pathname.startsWith("/work")) {
      SetMenuSwitch(false);
    } else {
      SetMenuSwitch(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    setTrialHeight(isVisibleTrial ? 30 : 0);
  }, [isVisibleTrial, setTrialHeight]);

  if (!isLoggedIn) return <Navigate to={"/login"} replace />;

  return (
    <>
      {
        isVisibleTrial && <div className={style.trialNote}>
          <small>Your trial will end soon on {formatDate(profileDataLocal?.trial_end)}</small>
          <XCircle color="#fff" size={14} style={{ position: 'absolute', right: '15px', cursor: 'pointer' }} onClick={() => setIsVisibleTrial(false)} />
        </div>
      }

      <div className="headerNav1">
        {menuSwitch ?
          <>
            <div className="headerTop business" style={{ whiteSpace: 'nowrap' }}>
              <Container fluid>
                <Row className="d-flex flex-nowrap">
                  <Col className="d-flex align-items-center">
                    <div className="company_logo colMinWidth">
                      {profileData && profileData?.organization?.logo ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px', overflow: 'hidden', borderRadius: '4px', border: '0.5px solid #F2F4F7' }}>
                          <FallbackImage photo={profileData.organization.logo} is_business={true} has_photo={true} />
                        </div>
                      ) : (
                        <Placeholder as="p" animation="wave" style={{ marginBottom: '0px' }}>
                          <Placeholder bg="secondary" style={{ height: '30px', width: '40px' }} size='lg' />
                        </Placeholder>
                      )}
                    </div>
                    <div className="SelectOptionHead">
                      <SelectOption currentLocation={profileData?.location} locations={profileData?.organization?.locations || []} profileUserName={profileData?.organization?.name || ""} />
                    </div>
                  </Col>
                  <Col className="d-flex align-items-center justify-content-center">
                    <nav className="colMinWidth">
                      <div className="menu-item">
                        <ul>
                          <li>
                            <NavLink
                              to="/"
                              className={`managementMain menuActive`}
                            >
                              Business
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/">
                              <img src={Logo} alt="Logo" />
                            </NavLink>
                          </li>
                          {
                            profileData?.has_work_subscription &&
                            <li>
                              <NavLink
                                to="/work/dashboard"
                                className={"managementMain1"}
                              >
                                Work
                              </NavLink>
                            </li>
                          }
                        </ul>
                      </div>
                    </nav>
                  </Col>
                  <Col className="d-flex align-items-center justify-content-end">
                    <ProfileInfo
                      username={profileData?.full_name || ""}
                      userType={profileData?.type || ""}
                      aliasName={profileData?.alias_name || ""}
                      photo={profileData?.photo || ""}
                      has_photo={profileData?.has_photo}
                    />
                  </Col>
                </Row>
              </Container>
            </div>
            <Container fluid className="headerNav" style={{ width: '100%', overflow: 'auto', whiteSpace: 'nowrap' }}>
              <Row className="flex-nowrap">
                <Col xs={3} md={3}>
                  <ul className="left d-flex flex-nowrap">
                    <li>
                      <NavLink
                        to="/clients"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " clients"
                        }
                      >
                        <img src={ClientsIcon} alt="ClientsIcon" />
                        Clients
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/suppliers"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " suppliers"
                        }
                      >
                        <img src={SuppliersIcon} alt="SuppliersIcon" />
                        Suppliers
                      </NavLink>
                    </li>
                  </ul>
                </Col>
                <Col xs={6} md={6}>
                  <ul className="middle">
                    <li>
                      <NavLink
                        to="/sales"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " sales"
                        }
                      >
                        <img src={SalesIcon} alt="SalesIcon" />
                        Sales
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/management"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " management"
                        }
                      >
                        <img src={ManagementIcon} alt="ManagementIcon" />
                        Management
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/projects"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " orders"
                        }
                      >
                        <img src={OrdersIcon} alt="OrdersIcon" />
                        Projects
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/statistics"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " statistics"
                        }
                      >
                        <img src={StatisticsIcon} alt="StatisticsIcon" />
                        Statistics
                      </NavLink>
                    </li>
                  </ul>
                </Col>
                <Col xs={3} md={3} style={{ textAlign: "right" }}>
                  <ul className="right d-flex flex-nowrap justify-content-end">
                    <li>
                      <NavLink
                        to="/expenses"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " expense"
                        }
                      >
                        <img src={ExpenseIcon} alt="Expense" />
                        Expense
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/invoices"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " invoices"
                        }
                      >
                        <img src={InvoicesIcon} alt="Invoices" />
                        Invoices
                      </NavLink>
                    </li>
                  </ul>
                </Col>
              </Row>

            </Container>
          </>
          :
          <>
            <div className="headerTop work">
              <Container fluid className="">
                <Row className="d-flex flex-nowrap">
                  <Col className="d-flex align-items-center">
                    <div className="company_logo colMinWidth">
                      {profileData?.organization?.logo ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px', overflow: 'hidden', borderRadius: '4px', border: '0.5px solid #F2F4F7' }}>
                          <FallbackImage photo={profileData.organization.logo} is_business={true} has_photo={true} />
                        </div>
                      ) : (
                        <Placeholder as="p" animation="wave" style={{ marginBottom: '0px' }}>
                          <Placeholder bg="secondary" style={{ height: '30px', width: '40px' }} size='lg' />
                        </Placeholder>
                      )}
                    </div>
                    <div className="SelectOptionHead">
                      <SelectOption currentLocation={profileData?.location} locations={profileData?.organization?.locations || []} profileUserName={profileData?.organization?.name || ""} />
                    </div>
                  </Col>
                  <Col className="d-flex align-items-center justify-content-center">
                    <nav className="colMinWidth">
                      <div className="menu-item" style={{ whiteSpace: 'nowrap' }}>
                        <ul>
                          <li>
                            <NavLink
                              to="/"
                              className={`managementMain`}
                            >
                              Business
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/">
                              <img src={Logo} alt="Logo" />
                            </NavLink>
                          </li>
                          {
                            profileData?.has_work_subscription &&
                            <li>
                              <NavLink
                                to="/work/dashboard"
                                className={`managementMain1 menuActive`}
                              >
                                Work
                              </NavLink>
                            </li>
                          }
                        </ul>
                      </div>
                    </nav>
                  </Col>
                  <Col className="d-flex align-items-center justify-content-end">
                    <ProfileInfo
                      username={profileData?.full_name || ""}
                      userType={profileData?.type || ""}
                      aliasName={profileData?.alias_name || ""}
                      photo={profileData?.photo || ""}
                      has_photo={profileData?.has_photo}
                    />
                  </Col>
                </Row>
              </Container>
            </div>
            <Container fluid className="headerNav">
              <Row>
                <Col xs={3} md={3}>
                  <ul className="left d-flex flex-nowrap">
                    <li>
                      <NavLink
                        to="/work/people"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " people"
                        }
                      >
                        <img src={Profile3user} alt="Profile3user" />
                        Team
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/work/jobs"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " jobs"
                        }
                      >
                        <img src={Briefcase} alt="briefcase" />
                        Jobs
                      </NavLink>
                    </li>
                  </ul>
                </Col>
                <Col xs={6} md={6}>
                  <ul className="middle">
                    <li>
                      <NavLink
                        to="/work/dashboard"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " dashboard"
                        }
                      >
                        <img src={statusUp} alt="statusUp" />
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/work/approval"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " approval"
                        }
                      >
                        <img src={clipboardTick} alt="clipboard-tick" />
                        Approval
                      </NavLink>
                    </li>
                  </ul>
                </Col>
                <Col xs={3} md={3} style={{ textAlign: "right" }}>
                  <ul className="right d-flex flex-nowrap justify-content-end">
                    <li>
                      <NavLink
                        to="/work/tasks"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " tasks"
                        }

                      >
                        <img src={calendarTick} alt="calendarTick" />
                        Tasks
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/work/chat"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " news"
                        }
                      >
                        <img src={bookSquare} alt="bookSquare" />
                        Chat
                      </NavLink>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Container>
          </>
        }
      </div>
      <div className="main-wrapper">
        <Outlet />
      </div>
    </>
  );
};

export const protectedRoutes = (
  <Route element={<Header />}>
    <Route path="/" exact element={<Home />} />

    <Route path="/clients" element={<ClientPage />} />
    <Route path="/clients/:id/order-history" element={<ClientOrderHistory />} />

    <Route path="/suppliers" element={<SupplierPage />} />
    <Route path="/suppliers/:id/history" element={<SupplierHistoryPage />} />

    <Route path="/expenses" element={<ExpensesPage />} />
    <Route path="/invoices" element={<InvoicePage />} />

    <Route path="/projects" element={<ProjectPage />} />

    <Route path="/statistics" element={<StatisticsPage />} />
    <Route path="/statistics/key-results" element={<KeyResultsPage />} />
    <Route path="/statistics/executive" element={<Executive />} />
    <Route path="/statistics/sales-conversion" element={<SalesConversion />} />
    <Route path="/statistics/overview" element={<Overview />} />

    <Route path="/sales" element={<Sales />} />
    <Route path="/sales" element={<ClientLayout />}>
      <Route path="newquote/selectyourclient" element={<SelectClientType />} />
      <Route path="newquote/selectyourclient/existing-clients" element={<ExistingClients />} />
      <Route path="newquote/selectyourclient/new-clients" element={<NewClient />} />
      <Route path="newquote/selectyourclient/business-client" element={<BusinessClientInformation />} />
      <Route path="newquote/selectyourclient/business-client/:id" element={<BusinessClientInformation />} />
      <Route path="newquote/selectyourclient/individual-client" element={<IndividualClientInformation />} />
      <Route path="newquote/selectyourclient/individual-client/:id" element={<IndividualClientInformation />} />
      <Route path="newquote/selectyourclient/client-information/scope-of-work" element={<ScopeOfWorkComponent />} />
      <Route path="newquote/selectyourclient/client-information/scope-of-work/:id" element={<ScopeOfWorkComponent />} />
      <Route path="quote-calculation" element={<CalculateQuote />} />
      <Route path="quote-calculation/:unique_id" element={<CalculateQuote />} />
    </Route>

    <Route path="/management" element={<Management />} />

    <Route path="/work" element={<Work />} />
    <Route path="/work/dashboard" element={<Dashboard />} />
    <Route path="/work/tasks" element={<TaskPage />} />
    <Route path="/work/news" element={<News />} />
    <Route path="/work/approval" element={<ApprovalPage />} />
    <Route path="/work/jobs" element={<JobsPage />} />
    <Route path="/work/people" element={<PeoplePage />} />
    <Route path="/work/chat" element={<Chat />} />

    <Route path="/profile" element={<Profile />} />

    <Route path="/settings/generalinformation" element={<GeneralInformation />} />
    <Route path="/settings/generalinformation/bank-details" element={<BankDetails />} />
    <Route path="/settings/generalinformation/region-and-language" element={<RegionLanguage />} />
    <Route path="/settings/generalinformation/profile" element={<MyProfile />} />
    <Route path="/settings/generalinformation/subscription" element={<Subscription />} />
    <Route path="/settings/generalinformation/bills" element={<Bills />} />
    <Route path="/settings/generalinformation/billing-info" element={<BillingInfo />} />
    
    <Route path="/settings/users/desktop" element={<Users />} />
    <Route path="/settings/users/mobile-app" element={<MobileApp />} />
    
    <Route path="/settings/calculators/departments" element={<Departments />} />
    
    <Route path="/settings/location" element={<Location />} />

    <Route path="/settings/templates/job-templates" element={<JobTemplates />} />
    <Route path="/settings/templates/job-templates/new" element={<CreateJobTemplate />} />
    <Route path="/settings/templates/job-templates/:id" element={<CreateJobTemplate />} />
    <Route path="/settings/templates/email-templates" element={<EmailTemplates />} />
    <Route path="/settings/templates/email-templates/new" element={<CreateEmailTemplate />} />
    <Route path="/settings/templates/email-templates/:id" element={<CreateEmailTemplate />} />
    <Route path="/settings/templates/email-signatures" element={<EmailSignatures />} />
    <Route path="/settings/templates/proposal-templates" element={<ProposalTemplates />} />
    <Route path="/settings/templates/proposal-templates/new" element={<CreateProposalTemplate />} />
    <Route path="/settings/templates/proposal-templates/:id" element={<CreateProposalTemplate />} />
    <Route path="/settings/templates/sms-templates" element={<SMSTemplates />} />
    <Route path="/settings/templates/sms-templates/new" element={<CreateSMSTemplate />} />
    <Route path="/settings/templates/sms-templates/:id" element={<CreateSMSTemplate />} />

    <Route path="/settings/companyethos/company-ethos" element={<CompanyEthos />} />
    <Route path="/settings/integrations" element={<Integrations />} />
    <Route path="/settings/quotesjobs/recurring-quotes" element={<RecurringQuotes />} />
    <Route path="/settings/quotesjobs/recurring-jobs" element={<RecurringJobs />} />
    <Route path="/settings/projectstatus/project-status" element={<ProjectStatus />} />
    <Route path="/settings/projectstatus/outgoing-emails" element={<OutgoingEmails />} />
    <Route path="/settings/termsandconditions/terms-and-conditions" element={<TermsandConditions />} />
    <Route path="/settings/termsandconditions/terms-and-conditions-invoice" element={<TermsConditionsInvoice />} />
    <Route path="/settings/customerssettings/industries" element={<CustomersIndustries />} />
    <Route path="/settings/customerssettings/customers-discount-category" element={<CustomersDiscountCategory />} />
    <Route path="/settings/accounting/expenses" element={<ExpensesAccount />} />
    <Route path="/settings/accounting/department-turnover-plan" element={<DepartmentTurnoverPlan />} />
    
    <Route path="/settings/notifications/dashboard-notifications" element={<DashboardNotifications />} />
    <Route path="/settings/notifications/app-notifications" element={<AppNotifications />} />
    <Route path="/settings/notifications/email-notifications" element={<EmailNotifications />} />
  </Route>
);

export default Header;
