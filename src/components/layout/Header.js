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
import { Work } from "../Work/Pages/Work";
import ProfileInfo from "./ProfileInfo";
import Sales from "../Business/Pages/sales/sales-page";
import Management from "../Business/Pages/management/management-page";
import SelectOption from "./SelectOption";
import Profile from "./Login/profile";
import ExpensesPage from "../Business/Pages/expenses";
import Home from "../Home";

import GeneralInformation from "../layout/settings/generalinformation/GeneralInformation";
import BankDetails from "../layout/settings/generalinformation/BankDetails";
import RegionLanguage from "../layout/settings/generalinformation/RegionLanguage";
import MyProfile from "./settings/MyProfile";
import Subscription from "./settings/subscription/Subscription";
import Bills from "../layout/settings/subscription/Bills";
import BillingInfo from "../layout/settings/subscription/BillingInfo";
import Users from "../layout/settings/users/Users";
import MobileApp from "../layout/settings/users/MobileApp";
import ExistingClients from "../Business/Pages/sales/new-request/existing-clients";
import SelectClientType from "../Business/Pages/sales/new-request/select-client";
import Departments from "../layout/settings/calculators/Departments";
import JobTemplates from "./settings/templates/job-templates";
import EmailTemplates from "./settings/templates/email-templates";
import EmailSignatures from "./settings/templates/EmailSignatures";
import ProposalTemplates from "./settings/templates/proposal-templates";
import CompanyEthos from "./settings/companyethos/CompanyEthos";
import Integrations from "./settings/integrations";
import RecurringQuotes from "./settings/quotesjobs/RecurringQuotes";
import RecurringJobs from "./settings/quotesjobs/RecurringJobs";
import TermsandConditions from "./settings/termsandconditions/TermsandConditions";
import TermsConditionsInvoice from "./settings/termsandconditions/TermsConditionsInvoice";
import CustomersDiscountCategory from "./settings/customerssettings/CustomersDiscountCategory";
import DepartmentTurnoverPlan from "./settings/accounting/DepartmentTurnoverPlan";
import ExpensesAccount from "./settings/accounting/ExpensesAccount";
import DashboardNotifications from "./settings/notifications/DashboardNotifications";
import AppNotifications from "./settings/notifications/AppNotifications";
import EmailNotifications from "./settings/notifications/EmailNotifications";
import DemoTable from "../Business/Pages/management/project-card/DemoTable";
import Dashboard from "../Work/Pages/Dashboard";
import News from "../Work/Pages/News";
import ProjectStatus from "./settings/projectstatus/ProjectStatus";
import OutgoingEmails from "./settings/projectstatus/outgoing-emails";
import NewClient from "../Business/Pages/sales/new-request/new-client";
import ClientLayout from "../Business/Pages/sales/new-request";
import IndividualClientInformation from "../Business/Pages/sales/new-request/individual-client-information";
import BusinessClientInformation from "../Business/Pages/sales/new-request/business-client-information";
import ScopeOfWorkComponent from "../Business/Pages/sales/new-request/scope-of-work";
import CalculateQuote from "../Business/Pages/sales/new-request/calculate-quote";
import { Placeholder, Spinner } from "react-bootstrap";
import JobsPage from "../Work/Pages/jobs";
import PeoplePage from "../Work/Pages/people";
import OrderPage from "../Business/Pages/orders";
import ClientPage from "../Business/Pages/clients"
import ApprovalPage from "../Work/Pages/approval";
import ClientOrderHistory from "../Business/Pages/clients/client-order-history";
import SupplierPage from "../Business/Pages/suppliers";
import SupplierHistoryPage from "../Business/Pages/suppliers/suppliers-history";
import EditTemplates from "./settings/templates/edit-template";
import EditEmail from "./settings/templates/edit-email";
import EditSignatures from "./settings/templates/edit-signatures";
import EditProposal from "./settings/templates/edit-proposal";
import StatisticsPage from "../Business/Pages/statistics";
import CustomersIndustries from "./settings/customerssettings/Industries";
import CreateEmailTemplate from "./settings/templates/create-email-template";
import KeyResultsPage from "../Business/Pages/statistics/key-results";
import CreateProposalTemplate from "./settings/templates/create-proposal-template";
import Location from "./settings/locations";
import TaskPage from "../Work/Pages/tasks";
import NotFoundTemplate from "../../ui/404-template/not-found-template";
import InvoicePage from "../Business/Pages/invoices";
import CreateJobTemplate from "./settings/templates/create-job-template";
import Executive from "../Business/Pages/statistics/executive";
import SalesConversion from "../Business/Pages/statistics/sales-conversion";
import Overview from "../Business/Pages/statistics/overview";
import { ProgressSpinner } from "primereact/progressspinner";
import NProgress from 'nprogress';

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
