import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { fetchProfile } from "../../APIs/ProfileApi";
import { useLocation, NavLink, Outlet, Routes, Route } from "react-router-dom";
import "./header.css";
import Logo from "../../assets/images/logo.svg";
import AvatarImg from "../../assets/images/img/Avatar.png";
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
import Sales from "../Business/Pages/sales/Sales";
import Management from "../Business/Pages/management/Management";
import SelectOption from "./SelectOption";
import Profile from "./Login/Profile";
import Clients from "../Business/Pages/clients/Clients";
import Invoices from "../Business/Pages/invoices/Invoices";
import Expenses from "../Business/Pages/expenses/Expenses";
import Home from "../Home";
import Suppliers from "../Business/Pages/suppliers/Suppliers";
import Orders from "../Business/Pages/orders/Orders";
import Statistics from "../Business/Pages/Statistics";
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
import BusinessDetails from "../Business/Pages/sales/newquote/BusinessDetails";
import ScopeofWork from "../Business/Pages/sales/newquote/ScopeofWork";
import IndividualClient from "../Business/Pages/sales/newquote/IndividualClient";
import Locations from "./settings/Locations";
import Calculation from "../Business/Pages/sales/newquote/Calculation";
import Departments from "../layout/settings/calculators/Departments";
import Subindex from "../layout/settings/calculators/Subindex";
import JobTemplates from "./settings/templates/JobTemplates";
import EmailTemplates from "./settings/templates/EmailTemplates";
import EmailSignatures from "./settings/templates/EmailSignatures";
import ProposalTemplates from "./settings/templates/ProposalTemplates";
import CompanyEthos from "./settings/companyethos/CompanyEthos";
import Integrations from "./settings/Integrations";
import RecurringQuotes from "./settings/quotesjobs/RecurringQuotes ";
import RecurringJobs from "./settings/quotesjobs/RecurringJobs";
import TermsandConditions from "./settings/termsandconditions/TermsandConditions";
import TermsConditionsInvoice from "./settings/termsandconditions/TermsConditionsInvoice";
import Industries from "./settings/customerssettings/Industries";
import CustomersDiscountCategory from "./settings/customerssettings/CustomersDiscountCategory";
import DepartmentTurnoverPlan from "./settings/accounting/DepartmentTurnoverPlan";
import ExpensesAccount from "./settings/accounting/ExpensesAccount";
import DashboardNotifications from "./settings/notifications/DashboardNotifications";
import AppNotifications from "./settings/notifications/AppNotifications";
import EmailNotifications from "./settings/notifications/EmailNotifications";
import DemoTable from "../Business/Pages/management/DemoTable";
import Dashboard from "../Work/Pages/Dashboard";
import Tasks from "../Work/Pages/tasks/Tasks";
import News from "../Work/Pages/News";
import Approval from "../Work/Pages/Approval";
import Jobs from "../Work/Pages/Jobs";
import People from "../Work/Pages/People";
import ProjectStatus from "./settings/projectstatus/ProjectStatus";
import Item2 from "./settings/projectstatus/Item2";
import NewClient from "../Business/Pages/sales/new-request/new-client";
import ClientLayout from "../Business/Pages/sales/new-request";
import IndividualClientInformation from "../Business/Pages/sales/new-request/individual-client-information";
import BusinessClientInformation from "../Business/Pages/sales/new-request/business-client-information";
import ScopeOfWorkComponent from "../Business/Pages/sales/new-request/scope-of-work";
import CalculateQuote from "../Business/Pages/sales/new-request/calculate-quote";



const Header = ({ onClick }) => {
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [activeLink, setActiveLink] = useState(null);
  const [menuswitch, SetMenuSwitch] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProfile();
        const parsedData = JSON.parse(data);
        setProfileData(parsedData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Set active link based on the current location
    if (location.pathname.startsWith("")) {
      setActiveLink("");
    } else if (location.pathname.startsWith("/suppliers")) {
      setActiveLink("/suppliers");
    }
  }, [location.pathname]);

  const changeMenu = () => {
    SetMenuSwitch(false);
  }
  const selectBussniess = () => {
    SetMenuSwitch(true);
  }
  return (
    <>

      <div className="headerNav1">
        {menuswitch ?
          <>
            <div className="headerTop business">
              <Container fluid>
                <Row>
                  {profileData && (
                    <>
                      <Col className="d-flex align-items-center">
                        <div className="company_logo colMinWidth">
                          {profileData.organization.logo ? (
                            <img
                              src={profileData.organization.logo}
                              alt="Company Logo"
                            />
                          ) : (
                            <img src={AvatarImg} alt="DummyImg" />
                          )}
                          {/* <span>{profileData.organization.name}</span> */}
                        </div>
                        <div className="SelectOptionHead">
                          <SelectOption locations={profileData.organization.locations} profileUserName={profileData.organization.name} />
                        </div>
                      </Col>
                      <Col>
                        <nav className="colMinWidth">
                          <div className="menu-item">
                            <ul>
                              <li>
                                <NavLink
                                  to=""
                                  className={`managementMain ${activeLink === "" ? "menuActive" : ""
                                    }`}
                                  onClick={selectBussniess}
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
                                  to="/dashboard"
                                  className={({ isActive }) =>
                                    isActive ? "menuActive" : "link" + ""
                                  }
                                  onClick={changeMenu}
                                >
                                  Work
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </nav>
                      </Col>
                      <Col>
                        <ProfileInfo
                          username={profileData.full_name}
                          userType={profileData.type}
                          aliasName={profileData.alias_name}
                        />
                      </Col>
                    </>
                  )}
                </Row>
              </Container>
            </div>
            <Container fluid className="headerNav">
              <Row>
                <Col xs={3} md={3}>
                  <ul className="left">
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
                  <ul className="right">
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
                <Row>
                  {profileData && (
                    <>
                      <Col className="d-flex align-items-center">
                        <div className="company_logo colMinWidth">
                          {profileData.organization.logo ? (
                            <img
                              src={profileData.organization.logo}
                              alt="Company Logo"
                            />
                          ) : (
                            <img src={AvatarImg} alt="DummyImg" />
                          )}
                          <span>{profileData.organization.name}</span>
                        </div>
                        <div className="SelectOptionHead">
                          <SelectOption />
                        </div>
                      </Col>
                      <Col>
                        <nav className="colMinWidth">
                          <div className="menu-item">
                            <ul>
                              <li>
                                <NavLink
                                  to=""
                                  className={`managementMain ${activeLink === "" ? "menuActive1" : ""
                                    }`}
                                  onClick={selectBussniess}
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
                                  to="/dashboard"
                                  className={`managementMain1 menuActive ${activeLink === "" ? "menuActive" : ""
                                    }`}
                                  onClick={selectBussniess}
                                >
                                  Work
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </nav>
                      </Col>
                      <Col>
                        <ProfileInfo
                          username={profileData.full_name}
                          userType={profileData.type}
                          aliasName={profileData.alias_name}
                        />
                      </Col>
                    </>
                  )}
                </Row>
              </Container>
            </div>
            <Container fluid className="headerNav">
              <Row>
                <Col xs={3} md={3}>
                  <ul className="left">
                    <li>
                      <NavLink
                        to="/people"
                        className={({ isActive }) =>
                          (isActive ? "menuActive" : "link") + " people"
                        }
                      >
                        <img src={Profile3user} alt="Profile3user" />
                        People
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/jobs"
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
                        to="/dashboard"
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
                        to="/approval"
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
                  <ul className="right">
                    <li>
                      <NavLink
                        to="/tasks"
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
                        to="/news"
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
          <Route path="*" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/sales" element={<Sales profileData={profileData} />} />
          <Route path="/management" element={<Management />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route
            path="/settings/generalinformation"
            element={<GeneralInformation />}
          />
          <Route
            path="/settings/generalinformation/bank-details"
            element={<BankDetails />}
          />
          <Route
            path="/settings/generalinformation/region-and-language"
            element={<RegionLanguage />}
          />
          <Route
            path="/settings/generalinformation/profile"
            element={<MyProfile />}
          />
          <Route
            path="/settings/generalinformation/subscription"
            element={<Subscription />}
          />
          <Route
            path="/settings/generalinformation/bills"
            element={<Bills />}
          />
          <Route
            path="/settings/generalinformation/billing-info"
            element={<BillingInfo />}
          />
          <Route
            path="/settings/users/desktop"
            element={<Users />}
          />
          <Route
            path="/settings/users/mobile-app"
            element={<MobileApp />}
          />





          <Route
            path="/sales/newquote/selectyourclient"
            element={<SelectClientType />}
          />
          <Route
            path="/sales/newquote/selectyourclient/existing-clients"
            element={<ExistingClients />}
          />
          <Route
            path="/sales/newquote/selectyourclient/new-clients"
            element={<NewClient />}
          />

          <Route path="/sales" element={<ClientLayout />}>
            <Route
              path="newquote/selectyourclient/business-client"
              element={<BusinessClientInformation />}
            />
            <Route
              path="newquote/selectyourclient/business-client/:id"
              element={<BusinessClientInformation />}
            />
            <Route
              path="newquote/selectyourclient/individual-client"
              element={<IndividualClientInformation />}
            />
            <Route
              path="newquote/selectyourclient/individual-client/:id"
              element={<IndividualClientInformation />}
            />
            <Route
              path="newquote/selectyourclient/client-information/scope-of-work"
              element={<ScopeOfWorkComponent />}
            />
            <Route
              path="quote-calculation/client"
              element={<CalculateQuote />}
            />
            <Route
              path="quote-calculation/client/:id"
              element={<CalculateQuote />}
            />
          </Route>


          

          <Route
            path="/sales/newquote/client-information/step2/business-details/"
            element={<BusinessDetails />}
          />
          <Route
            path="/sales/newquote/client-information/step2/individual-client"
            element={<IndividualClient />}
          />
          <Route
            path="/sales/newquote/client-information/step3/scope-of-work/:id?"
            element={<ScopeofWork />}
          />
          <Route
            path="/sales/settings/locations"
            element={<Locations />}
          />
          <Route
            path="/sales/newquote/calculation"
            element={<Calculation />}
          />




          <Route
            path="/settings/calculators/departments"
            element={<Departments />}
          />
          <Route
            path="/settings/calculators/subindex"
            element={<Subindex />}
          />
          <Route
            path="/settings/templates/job-templates"
            element={<JobTemplates />}
          />
          <Route
            path="/settings/templates/email-templates"
            element={<EmailTemplates />}
          />
          <Route
            path="/settings/templates/email-signatures"
            element={<EmailSignatures />}
          />
          <Route
            path="/settings/templates/proposal-templates"
            element={<ProposalTemplates />}
          />

          <Route
            path="/settings/companyethos/company-ethos"
            element={<CompanyEthos />}
          />
          <Route
            path="/settings/integrations"
            element={<Integrations />}
          />
          <Route
            path="/settings/quotesjobs/recurring-quotes"
            element={<RecurringQuotes />}
          />

          <Route
            path="/settings/quotesjobs/recurring-jobs"
            element={<RecurringJobs />}
          />
          <Route
            path="/settings/projectstatus/project-status"
            element={<ProjectStatus />}
          />
          <Route
            path="/settings/projectstatus/item2"
            element={<Item2 />}
          />

          <Route
            path="/settings/termsandconditions/terms-and-conditions"
            element={<TermsandConditions />}
          />
          <Route
            path="/settings/termsandconditions/terms-and-conditions-invoice"
            element={<TermsConditionsInvoice />}
          />
          <Route
            path="/settings/customerssettings/industries"
            element={<Industries />}
          />
          <Route
            path="/settings/customerssettings/customers-discount-category"
            element={<CustomersDiscountCategory />}
          />


          <Route
            path="/settings/accounting/expenses"
            element={<ExpensesAccount />}
          />

          <Route
            path="/settings/accounting/department-turnover-plan"
            element={<DepartmentTurnoverPlan />}
          />

          <Route
            path="/settings/notifications/dashboard-notifications"
            element={<DashboardNotifications />}
          />

          <Route
            path="/settings/notifications/app-notifications"
            element={<AppNotifications />}
          />

          <Route
            path="/settings/notifications/email-notifications"
            element={<EmailNotifications />}
          />
          <Route
            path="/demo"
            element={<DemoTable />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/tasks"
            element={<Tasks />}
          />
          <Route
            path="/news"
            element={<News />}
          />
          <Route
            path="/approval"
            element={<Approval />}
          />
          <Route
            path="/jobs"
            element={<Jobs />}
          />
          <Route
            path="/people"
            element={<People />}
          />




















        </Routes>
        <Outlet />
      </div>
    </>
  );
};

export default Header;
