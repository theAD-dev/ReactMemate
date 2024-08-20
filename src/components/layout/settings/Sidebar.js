import React, { useEffect, useState  } from "react";
import { Link } from "react-router-dom";
import "./settings.css";
import {
  InfoSquare,
  Person,
  CreditCard2Back,
  People,
  Map,
  Bell,
  PlusSlashMinus,
  WindowDock,
  Bookmarks,
  CardChecklist,
  BlockquoteRight,
  WindowStack,
  FiletypeDoc,
  ListUl,
} from "react-bootstrap-icons";
import { fetchProfile } from "../../../APIs/ProfileApi";
import LogoutButton from "../Login/logout-button";
const Sidebar = ({ activeTab, setActiveTab }) => {
  const [profileData, setProfileData] = useState(null);

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


  return (
    <>
      <div className="settings-menu">
        <div className="menuList">
          <div className="topList">
            <h2>General</h2>
            <ul>
              <li>
                {" "}
                <Link
                  to="/settings/generalinformation"
                  className={`sidebar-tab ${
                    activeTab === "generalinformation" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("generalinformation")}
                >
                  <InfoSquare color="#667085" size={18} />
                  Company Information
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/settings/generalinformation/profile"
                  className={`sidebar-tab ${
                    activeTab === "profile"
                      ? "activelist"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("profile")
                  }
                >
                  <Person color="#667085" size={18} />
                  My Profile
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/settings/generalinformation/subscription"
                  className={`sidebar-tab ${
                    activeTab === "subscription"
                      ? "activelist"
                      : ""
                  }`}
                  onClick={() =>
                    setActiveTab("subscription")
                  }
                >
                  <CreditCard2Back color="#667085" size={18} />
                  Subscription
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/settings/users/desktop"
                  className={`sidebar-tab ${
                    activeTab === "desktop" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("desktop")}
                >
                  <People color="#667085" size={18} />
                  Users
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/sales/settings/locations"
                  className={`sidebar-tab ${
                    activeTab === "locations" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("locations")}
                >
                  <Map color="#667085" size={18} />
                  Locations
                </Link>
              </li>
            </ul>
            <h2>Settings</h2>
            <ul>
              <li>
                {" "}
                <Link
                  to="/settings/calculators/departments"
                  className={`sidebar-tab ${
                    activeTab === "departments" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("departments")}
                >
                  <PlusSlashMinus color="#667085" size={18} />
                  Calculators
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/settings/templates/job-templates"
                  className={`sidebar-tab ${
                    activeTab === "job-templates" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("job-templates")}
                >
                  <WindowDock color="#667085" size={18} />
                  Templates
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/settings/companyethos/company-ethos"
                  className={`sidebar-tab ${
                    activeTab === "company-ethos" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("company-ethos")}
                >
                  <Bookmarks color="#667085" size={18} />
                  Company Ethos
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/settings/integrations"
                  className={`sidebar-tab ${
                    activeTab === "integrations" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("integrations")}
                >
                  <CardChecklist color="#667085" size={18} />
                  Integrations
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/settings/quotesjobs/recurring-quotes"
                  className={`sidebar-tab ${
                    activeTab === "recurring-quotes" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("recurring-quotes")}
                >
                  <BlockquoteRight color="#667085" size={18} />
                  Quotes & Jobs
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/settings/projectstatus/project-status"
                  className={`sidebar-tab ${
                    activeTab === "organisation-setting" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("organisation-setting")}
                >
                  <WindowStack color="#667085" size={18} />
                  Organisation Setting
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/settings/termsandconditions/terms-and-conditions"
                  className={`sidebar-tab ${
                    activeTab === "terms-and-conditions" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("terms-and-conditions")}
                >
                  <FiletypeDoc color="#667085" size={18} />
                  Terms and Conditions
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/settings/customerssettings/industries"
                  className={`sidebar-tab ${
                    activeTab === "industries" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("industries")}
                >
                  <Person color="#667085" size={18} />
                  Customers Settings
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/settings/accounting/expenses"
                  className={`sidebar-tab ${
                    activeTab === "expenses" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("expenses")}
                >
                  <ListUl color="#667085" size={18} />
                  Accounting
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  to="/settings/notifications/dashboard-notifications"
                  className={`sidebar-tab ${
                    activeTab === "dashboard-notifications" ? "activelist" : ""
                  }`}
                  onClick={() => setActiveTab("dashboard-notifications")}
                >
                  <Bell color="#667085" size={18} />
                  Notifications
                </Link>
              </li>
            </ul>
          </div>
          <div className="logoutBottomS">
            <div className="userNameList">
            {profileData && (
              <p>
                <strong>{profileData.full_name}</strong>
                <span>olivia@memate.com</span>
              </p>
            )}
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
