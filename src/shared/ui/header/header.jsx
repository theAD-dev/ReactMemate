import { useEffect, useState } from "react";
import { Col, Container, Placeholder, Row } from "react-bootstrap";
import { XCircle } from "react-bootstrap-icons";
import { Navigate, NavLink, useLocation } from "react-router-dom";
import SelectLocation from "./components/location-selection";
import ProfileInfo from "./components/profile-info";
import style from './header.module.scss';
import { useAuth } from "../../../app/providers/auth-provider";
import { useTrialHeight } from "../../../app/providers/trial-height-provider";
import chat from "../../../assets/chat.png";
import Briefcase from "../../../assets/images/icon/briefcase.svg";
import calendarTick from "../../../assets/images/icon/calendar-tick.svg";
import clipboardTick from "../../../assets/images/icon/clipboard-tick.svg";
import ExpenseIcon from "../../../assets/images/icon/ExpenseIcon.svg";
import InvoicesIcon from "../../../assets/images/icon/InvoicesIcon.svg";
import ManagementIcon from "../../../assets/images/icon/ManagementIcon.svg";
import OrdersIcon from "../../../assets/images/icon/OrdersIcon.svg";
import ClientsIcon from "../../../assets/images/icon/profile-2user.svg";
import Profile3user from "../../../assets/images/icon/profile-3user.svg";
import SalesIcon from "../../../assets/images/icon/SalesIcon.svg";
import StatisticsIcon from "../../../assets/images/icon/StatisticsIcon.svg";
import statusUp from "../../../assets/images/icon/status-up.svg";
import SuppliersIcon from "../../../assets/images/icon/suppliersIcon.svg";
import Logo from "../../../assets/images/logo.svg";
import { formatDate } from "../../lib/date-format";
import { FallbackImage } from "../image-with-fallback/image-avatar";
import "../../../components/layout/header.css";

const Header = () => {
    const location = useLocation();
    const { session } = useAuth();
    const { trialHeight, setTrialHeight } = useTrialHeight(30);
    const [isVisibleNotificationBar, setIsVisibleNotificationBar] = useState(false);
    const [menuSwitch, SetMenuSwitch] = useState(true);
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const isSuspended = session?.is_suspended ? true : false;
    const hasSubscriptionPaymentFailed = !!session?.suspension_date;

    useEffect(() => {
        if (session) {
            setIsVisibleNotificationBar(session?.is_trial || hasSubscriptionPaymentFailed || false);
        }
    }, [session, hasSubscriptionPaymentFailed]);

    useEffect(() => {
        if (location.pathname.startsWith("/work")) {
            SetMenuSwitch(false);
        } else {
            SetMenuSwitch(true);
        }
    }, [location.pathname]);

    useEffect(() => {
        setTrialHeight(isVisibleNotificationBar ? (hasSubscriptionPaymentFailed ? 35 : 30) : 0);
    }, [isVisibleNotificationBar, setTrialHeight, hasSubscriptionPaymentFailed]);

    if (!isLoggedIn) return <Navigate to={"/login"} replace />;
    if (isSuspended) return <Navigate to={"/suspended"} replace />;

    function getDaysUntilSuspension(suspensionDate) {
        try {
            if (!suspensionDate) {
                throw new Error("Suspension date is not provided.");
            }

            const suspension = new Date(suspensionDate);
            if (isNaN(suspension.getTime())) {
                throw new Error("Invalid date format.");
            }

            const now = new Date();
            const diffInMs = suspension - now;
            const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

            return diffInDays >= 0 ? diffInDays : 0;
        } catch (err) {
            console.error("Error getting days until suspension:", err.message);
            return 0;
        }
    }

    return (
        <>
            {isVisibleNotificationBar && (
                <div className={hasSubscriptionPaymentFailed ? style.subscriptionFailedNote : style.trialNote} style={{ height: `${trialHeight}px` }}>
                    {hasSubscriptionPaymentFailed ? (
                        <small><b>Payment for your subscription has failed. Please update your payment method.</b> Your subscription will be suspended in <b>{getDaysUntilSuspension(session?.suspension_date)} days</b> if no action is taken.</small>
                    ) : (
                        <small>Your trial will end soon on {formatDate(session?.trial_end)}</small>
                    )}
                    <XCircle
                        color="#fff"
                        size={14}
                        style={{ position: 'absolute', right: '15px', cursor: 'pointer' }}
                        onClick={() => setIsVisibleNotificationBar(false)}
                    />
                </div>
            )}

            <div className="headerNav1">
                {menuSwitch ?
                    <>
                        <div className="headerTop business" style={{ whiteSpace: 'nowrap' }}>
                            <Container fluid>
                                <Row className="d-flex flex-nowrap">
                                    <Col className="d-flex align-items-center">
                                        <div className="company_logo colMinWidth">
                                            {session && session?.organization?.logo ? (
                                                <div className="d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px', overflow: 'hidden', borderRadius: '4px', border: '0.5px solid #F2F4F7' }}>
                                                    <FallbackImage photo={session.organization.logo} is_business={true} has_photo={true} />
                                                </div>
                                            ) : (
                                                <Placeholder as="p" animation="wave" style={{ marginBottom: '0px' }}>
                                                    <Placeholder bg="secondary" style={{ height: '30px', width: '40px' }} size='lg' />
                                                </Placeholder>
                                            )}
                                        </div>
                                        <div className="SelectOptionHead">
                                            <SelectLocation currentLocation={session?.location} locations={session?.organization?.locations || []} profileUserName={session?.organization?.name || ""} />
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
                                                        session?.has_work_subscription &&
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
                                            username={session?.full_name || ""}
                                            userType={session?.type || ""}
                                            aliasName={session?.alias_name || ""}
                                            photo={session?.photo || ""}
                                            has_photo={session?.has_photo}
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
                                            {session?.organization?.logo ? (
                                                <div className="d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px', overflow: 'hidden', borderRadius: '4px', border: '0.5px solid #F2F4F7' }}>
                                                    <FallbackImage photo={session.organization.logo} is_business={true} has_photo={true} />
                                                </div>
                                            ) : (
                                                <Placeholder as="p" animation="wave" style={{ marginBottom: '0px' }}>
                                                    <Placeholder bg="secondary" style={{ height: '30px', width: '40px' }} size='lg' />
                                                </Placeholder>
                                            )}
                                        </div>
                                        <div className="SelectOptionHead">
                                            <SelectLocation currentLocation={session?.location} locations={session?.organization?.locations || []} profileUserName={session?.organization?.name || ""} />
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
                                                        session?.has_work_subscription &&
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
                                            username={session?.full_name || ""}
                                            userType={session?.type || ""}
                                            aliasName={session?.alias_name || ""}
                                            photo={session?.photo || ""}
                                            has_photo={session?.has_photo}
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
                                                <div style={{ width: '25px', height: '25px', overflow: 'hidden', marginRight: '6px' }}>
                                                    <img src={chat} alt="chat" width={'24px'} height={'24px'} style={{ width: '24px', height: '24px' }} />
                                                </div>
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
        </>
    );
};

export default Header;