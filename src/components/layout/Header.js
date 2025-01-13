import React, { lazy, Suspense, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { fetchProfile } from "../../APIs/ProfileApi";
import { useLocation, NavLink, Outlet, Routes, Route } from "react-router-dom";
import "./header.css";
import Logo from "../../assets/images/logo.svg";
import ClientsIcon from "../../assets/images/icon/profile-2user.svg";
import SuppliersIcon from "../../assets/images/icon/suppliersIcon.svg";
import SalesIcon from "../../assets/images/icon/SalesIcon.svg";
import ManagementIcon from "../../assets/images/icon/ManagementIcon.svg";
import OrdersIcon from "../../assets/images/icon/OrdersIcon.svg";
import StatisticsIcon from "../../assets/images/icon/StatisticsIcon.svg";
import ExpenseIcon from "../../assets/images/icon/ExpenseIcon.svg";
import InvoicesIcon from "../../assets/images/icon/InvoicesIcon.svg";
import bookSquare from "../../assets/images/icon/book-square.svg";
import calendarTick from "../../assets/images/icon/calendar-tick.svg";
import clipboardTick from "../../assets/images/icon/clipboard-tick.svg";
import Briefcase from "../../assets/images/icon/briefcase.svg";
import statusUp from "../../assets/images/icon/status-up.svg";
import Profile3user from "../../assets/images/icon/profile-3user.svg";
import NProgress from 'nprogress';
import { Placeholder, Spinner } from "react-bootstrap";


function SuspenseLoader() {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: '0px', left: '0px', width: '100%', height: '100%' }}>
      <div className="shadow-lg" style={{ width: '60px', height: '60px', background: 'white', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    </div>
  );
}

const Loader = (Component) => (props) =>
(
  <Suspense fallback={<SuspenseLoader />}>
    <Component {...props} />
  </Suspense>
);

const Work = Loader(lazy(() => import("../Work/Pages/Work")));
const ProfileInfo = Loader(lazy(() => import("./ProfileInfo")));
const Sales = Loader(lazy(() => import("../Business/Pages/sales/sales-page")));
const Management = Loader(lazy(() => import("../Business/Pages/management/management-page")));
const SelectOption = Loader(lazy(() => import("./SelectOption")));
const Profile = Loader(lazy(() => import("./Login/profile")));
const ExpensesPage = Loader(lazy(() => import("../Business/Pages/expenses")));
const Home = Loader(lazy(() => import("../Home")));
const GeneralInformation = Loader(lazy(() => import("../layout/settings/generalinformation/GeneralInformation")));
const BankDetails = Loader(lazy(() => import("../layout/settings/generalinformation/BankDetails")));
const RegionLanguage = Loader(lazy(() => import("../layout/settings/generalinformation/RegionLanguage")));
const MyProfile = Loader(lazy(() => import("./settings/MyProfile")));
const Subscription = Loader(lazy(() => import("./settings/subscription/Subscription")));
const Bills = Loader(lazy(() => import("../layout/settings/subscription/Bills")));
const BillingInfo = Loader(lazy(() => import("../layout/settings/subscription/BillingInfo")));
const Users = Loader(lazy(() => import("../layout/settings/users/Users")));
const MobileApp = Loader(lazy(() => import("../layout/settings/users/MobileApp")));
const ExistingClients = Loader(lazy(() => import("../Business/Pages/sales/new-request/existing-clients")));
const SelectClientType = Loader(lazy(() => import("../Business/Pages/sales/new-request/select-client")));
const Departments = Loader(lazy(() => import("../layout/settings/calculators/Departments")));
const JobTemplates = Loader(lazy(() => import("./settings/templates/job-templates")));
const EmailTemplates = Loader(lazy(() => import("./settings/templates/email-templates")));
const EmailSignatures = Loader(lazy(() => import("./settings/templates/EmailSignatures")));
const ProposalTemplates = Loader(lazy(() => import("./settings/templates/proposal-templates")));
const CompanyEthos = Loader(lazy(() => import("./settings/companyethos/CompanyEthos")));
const Integrations = Loader(lazy(() => import("./settings/integrations")));
const RecurringQuotes = Loader(lazy(() => import("./settings/quotesjobs/RecurringQuotes")));
const RecurringJobs = Loader(lazy(() => import("./settings/quotesjobs/RecurringJobs")));
const TermsandConditions = Loader(lazy(() => import("./settings/termsandconditions/TermsandConditions")));
const TermsConditionsInvoice = Loader(lazy(() => import("./settings/termsandconditions/TermsConditionsInvoice")));
const CustomersDiscountCategory = Loader(lazy(() => import("./settings/customerssettings/CustomersDiscountCategory")));
const DepartmentTurnoverPlan = Loader(lazy(() => import("./settings/accounting/DepartmentTurnoverPlan")));
const ExpensesAccount = Loader(lazy(() => import("./settings/accounting/ExpensesAccount")));
const DashboardNotifications = Loader(lazy(() => import("./settings/notifications/DashboardNotifications")));
const AppNotifications = Loader(lazy(() => import("./settings/notifications/AppNotifications")));
const EmailNotifications = Loader(lazy(() => import("./settings/notifications/EmailNotifications")));
const DemoTable = Loader(lazy(() => import("../Business/Pages/management/project-card/DemoTable")));
const Dashboard = Loader(lazy(() => import("../Work/Pages/Dashboard")));
const News = Loader(lazy(() => import("../Work/Pages/News")));
const ProjectStatus = Loader(lazy(() => import("./settings/projectstatus/ProjectStatus")));
const OutgoingEmails = Loader(lazy(() => import("./settings/projectstatus/outgoing-emails")));
const NewClient = Loader(lazy(() => import("../Business/Pages/sales/new-request/new-client")));
const ClientLayout = Loader(lazy(() => import("../Business/Pages/sales/new-request")));
const IndividualClientInformation = Loader(lazy(() => import("../Business/Pages/sales/new-request/individual-client-information")));
const BusinessClientInformation = Loader(lazy(() => import("../Business/Pages/sales/new-request/business-client-information")));
const ScopeOfWorkComponent = Loader(lazy(() => import("../Business/Pages/sales/new-request/scope-of-work")));
const CalculateQuote = Loader(lazy(() => import("../Business/Pages/sales/new-request/calculate-quote")));
const JobsPage = Loader(lazy(() => import("../Work/Pages/jobs")));
const PeoplePage = Loader(lazy(() => import("../Work/Pages/people")));
const OrderPage = Loader(lazy(() => import("../Business/Pages/orders")));
const ClientPage = Loader(lazy(() => import("../Business/Pages/clients")));
const ApprovalPage = Loader(lazy(() => import("../Work/Pages/approval")));
const ClientOrderHistory = Loader(lazy(() => import("../Business/Pages/clients/client-order-history")));
const SupplierPage = Loader(lazy(() => import("../Business/Pages/suppliers")));
const SupplierHistoryPage = Loader(lazy(() => import("../Business/Pages/suppliers/suppliers-history")));
const EditTemplates = Loader(lazy(() => import("./settings/templates/edit-template")));
const EditEmail = Loader(lazy(() => import("./settings/templates/edit-email")));
const EditSignatures = Loader(lazy(() => import("./settings/templates/edit-signatures")));
const EditProposal = Loader(lazy(() => import("./settings/templates/edit-proposal")));
const StatisticsPage = Loader(lazy(() => import("../Business/Pages/statistics")));
const CustomersIndustries = Loader(lazy(() => import("./settings/customerssettings/Industries")));
const CreateEmailTemplate = Loader(lazy(() => import("./settings/templates/create-email-template")));
const KeyResultsPage = Loader(lazy(() => import("../Business/Pages/statistics/key-results")));
const CreateProposalTemplate = Loader(lazy(() => import("./settings/templates/create-proposal-template")));
const Location = Loader(lazy(() => import("./settings/locations")));
const TaskPage = Loader(lazy(() => import("../Work/Pages/tasks")));
const NotFoundTemplate = Loader(lazy(() => import("../../ui/404-template/not-found-template")));
const InvoicePage = Loader(lazy(() => import("../Business/Pages/invoices")));
const CreateJobTemplate = Loader(lazy(() => import("./settings/templates/create-job-template")));
const Executive = Loader(lazy(() => import("../Business/Pages/statistics/executive")));
const SalesConversion = Loader(lazy(() => import("../Business/Pages/statistics/sales-conversion")));
const Overview = Loader(lazy(() => import("../Business/Pages/statistics/overview")));


const Header = ({ onClick }) => {
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [menuswitch, SetMenuSwitch] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfile();
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

  return (
    <>
      <div className="headerNav1">
        {menuswitch ?
          <>
            <div className="headerTop business" style={{ whiteSpace: 'nowrap' }}>
              <Container fluid>
                <Row className="d-flex flex-nowrap">
                  <Col className="d-flex align-items-center">
                    <div className="company_logo colMinWidth">
                      {profileData && profileData?.organization?.logo ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px', overflow: 'hidden', borderRadius: '4px', border: '0.5px solid #F2F4F7' }}>
                          <img
                            src={profileData.organization.logo}
                            alt="Company Logo"
                          />
                        </div>
                      ) : (
                        <Placeholder as="p" animation="wave" style={{ marginBottom: '0px' }}>
                          <Placeholder bg="secondary" style={{ height: '30px', width: '40px' }} size='lg' />
                        </Placeholder>
                      )}
                    </div>
                    <div className="SelectOptionHead">
                      <SelectOption currentLocation={profileData?.location} locations={profileData?.organization?.locations || []} profileUserName={profileData?.organization?.trading_name || ""} />
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
                            <a href="/">
                              <img src={Logo} alt="Logo" />
                            </a>
                          </li>
                          <li>
                            <NavLink
                              to="/work/dashboard"
                              className={"managementMain1"}
                            >
                              Work
                            </NavLink>
                          </li>
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
                        to="/orders"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " orders"
                        }
                      >
                        <img src={OrdersIcon} alt="OrdersIcon" />
                        Orders
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
                        <img
                          src={profileData.organization.logo}
                          alt="Company Logo"
                        />
                      ) : (
                        <Placeholder as="p" animation="wave" style={{ marginBottom: '0px' }}>
                          <Placeholder bg="secondary" style={{ height: '30px', width: '40px' }} size='lg' />
                        </Placeholder>
                      )}
                      <span>{profileData?.organization?.name || ""}</span>
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
                            <a href="/">
                              <img src={Logo} alt="Logo" />
                            </a>
                          </li>
                          <li>
                            <NavLink
                              to="/work/dashboard"
                              className={`managementMain1 menuActive`}
                            >
                              Work
                            </NavLink>
                          </li>
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
                        to="/work/news"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " news"
                        }
                      >
                        <img src={bookSquare} alt="bookSquare" />
                        News
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
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/clients" element={<ClientPage />} />
          <Route path="/clients/:id/order-history" element={<ClientOrderHistory />} />

          <Route path="/suppliers" element={<SupplierPage />} />
          <Route path="/suppliers/:id/history" element={<SupplierHistoryPage />} />

          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/invoices" element={<InvoicePage />} />

          <Route path="/orders" element={<OrderPage />} />

          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/statistics/key-results" element={<KeyResultsPage />} />
          <Route path="/statistics/executive" element={<Executive />} />
          <Route path="/statistics/sales-conversion" element={<SalesConversion />} />
          <Route path="/statistics/overview" element={<Overview />} />

          <Route path="/sales" element={<Sales profileData={profileData} />} />
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

          <Route path="/profile" element={<Profile />} />

          <Route path="/settings/generalinformation" element={<GeneralInformation />} />
          <Route path="/settings/generalinformation/bank-details" element={<BankDetails />} />
          <Route path="/settings/generalinformation/region-and-language" element={<RegionLanguage />} />
          <Route path="/settings/generalinformation/profile" element={<MyProfile profileData={profileData} />} />
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
          <Route path="/settings/templates/edit-template/" element={<EditTemplates />} />
          <Route path="/settings/templates/edit-email/" element={<EditEmail />} />
          <Route path="/settings/templates/edit-signatures/" element={<EditSignatures />} />
          <Route path="/settings/templates/edit-proposal/" element={<EditProposal />} />

          <Route path="/404" element={<NotFoundTemplate />} />
          <Route path="/demo" element={<DemoTable />} />

        </Routes>
        <Outlet />
      </div>
    </>
  );
};

export default Header;
