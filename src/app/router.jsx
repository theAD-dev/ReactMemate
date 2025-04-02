import { lazy } from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./providers/protected-route-provider";
import HeaderLayout from "../shared/ui/layout/header-layout";
import { LazyLoader } from "../shared/ui/lazy-loader/lazy-loader";
// pages
const ClientPage = LazyLoader(lazy(() => import('../components/Business/Pages/clients')));
const ClientOrderHistory = LazyLoader(lazy(() => import('../components/Business/Pages/clients/client-order-history')));
const ExpensesPage = LazyLoader(lazy(() => import('../components/Business/Pages/expenses')));
const InvoicePage = LazyLoader(lazy(() => import('../components/Business/Pages/invoices')));
const PublicInvoice = LazyLoader(lazy(() => import('../components/Business/Pages/invoices/public-invoice/public-invoice')));
const Management = LazyLoader(lazy(() => import('../components/Business/Pages/management/management-page')));
const ProjectPage = LazyLoader(lazy(() => import('../components/Business/Pages/projects')));
const BusinessClientInformation = LazyLoader(lazy(() => import('../components/Business/Pages/sales/new-request/business-client-information')));
const CalculateQuote = LazyLoader(lazy(() => import('../components/Business/Pages/sales/new-request/calculate-quote')));
const ExistingClients = LazyLoader(lazy(() => import('../components/Business/Pages/sales/new-request/existing-clients')));
const IndividualClientInformation = LazyLoader(lazy(() => import('../components/Business/Pages/sales/new-request/individual-client-information')));
const NewClient = LazyLoader(lazy(() => import('../components/Business/Pages/sales/new-request/new-client')));
const ScopeOfWorkComponent = LazyLoader(lazy(() => import('../components/Business/Pages/sales/new-request/scope-of-work')));
const SelectClientType = LazyLoader(lazy(() => import('../components/Business/Pages/sales/new-request/select-client')));
const Sales = LazyLoader(lazy(() => import('../components/Business/Pages/sales/sales-page')));
const StatisticsPage = LazyLoader(lazy(() => import('../components/Business/Pages/statistics')));
const Executive = LazyLoader(lazy(() => import('../components/Business/Pages/statistics/executive')));
const KeyResultsPage = LazyLoader(lazy(() => import('../components/Business/Pages/statistics/key-results')));
const Overview = LazyLoader(lazy(() => import('../components/Business/Pages/statistics/overview')));
const SalesConversion = LazyLoader(lazy(() => import('../components/Business/Pages/statistics/sales-conversion')));
const SupplierPage = LazyLoader(lazy(() => import('../components/Business/Pages/suppliers')));
const SupplierHistoryPage = LazyLoader(lazy(() => import('../components/Business/Pages/suppliers/suppliers-history')));
const QuotationEmail = LazyLoader(lazy(() => import('../components/layout/browser-web/quotation-email')));
const ChangePassword = LazyLoader(lazy(() => import('../components/layout/Login/change-password')));
const CheckMail = LazyLoader(lazy(() => import('../components/layout/Login/check-mail')));
const ForgotPassword = LazyLoader(lazy(() => import('../components/layout/Login/forgot-password')));
const Login = LazyLoader(lazy(() => import('../components/layout/Login/login-page')));
const PasswordReset = LazyLoader(lazy(() => import('../components/layout/Login/password-reset')));
const Profile = LazyLoader(lazy(() => import('../components/layout/Login/profile')));
const Companyname = LazyLoader(lazy(() => import('../components/layout/onboarding/Companyname')));
const CompanyName = LazyLoader(lazy(() => import('../components/layout/requestdemo/CompanyName')));
const Create = LazyLoader(lazy(() => import('../components/layout/onboarding/Create')));
const DiscovermemateWrapper = LazyLoader(lazy(() => import('../components/layout/onboarding/Discovermemate')));
const PasswordCreate = LazyLoader(lazy(() => import('../components/layout/onboarding/password-create')));
const Regionalsettings = LazyLoader(lazy(() => import('../components/layout/onboarding/Regionalsettings')));
const ResendEmail = LazyLoader(lazy(() => import('../components/layout/onboarding/ResendEmail')));
const Verifymail = LazyLoader(lazy(() => import('../components/layout/onboarding/Verifymail')));
const AllSet = LazyLoader(lazy(() => import('../components/layout/requestdemo/AllSet')));
const SelectCountry = LazyLoader(lazy(() => import('../components/layout/requestdemo/SelectCountry')));
const SelectDate = LazyLoader(lazy(() => import('../components/layout/requestdemo/SelectDate')));
const SignUp = LazyLoader(lazy(() => import('../components/layout/requestdemo/SignUp')));
const DepartmentTurnoverPlan = LazyLoader(lazy(() => import('../components/layout/settings/accounting/DepartmentTurnoverPlan')));
const ExpensesAccount = LazyLoader(lazy(() => import('../components/layout/settings/accounting/ExpensesAccount')));
const Departments = LazyLoader(lazy(() => import('../components/layout/settings/calculators/Departments')));
const CompanyEthos = LazyLoader(lazy(() => import('../components/layout/settings/companyethos/CompanyEthos')));
const CustomersDiscountCategory = LazyLoader(lazy(() => import('../components/layout/settings/customerssettings/CustomersDiscountCategory')));
const CustomersIndustries = LazyLoader(lazy(() => import('../components/layout/settings/customerssettings/Industries')));
const Demo = LazyLoader(lazy(() => import('../components/layout/settings/Demo')));
const BankDetails = LazyLoader(lazy(() => import('../components/layout/settings/generalinformation/BankDetails')));
const GeneralInformation = LazyLoader(lazy(() => import('../components/layout/settings/generalinformation/GeneralInformation')));
const RegionLanguage = LazyLoader(lazy(() => import('../components/layout/settings/generalinformation/RegionLanguage')));
const Integrations = LazyLoader(lazy(() => import('../components/layout/settings/integrations')));
const Location = LazyLoader(lazy(() => import('../components/layout/settings/locations')));
const MyProfile = LazyLoader(lazy(() => import('../components/layout/settings/MyProfile')));
const AppNotifications = LazyLoader(lazy(() => import('../components/layout/settings/notifications/AppNotifications')));
const DashboardNotifications = LazyLoader(lazy(() => import('../components/layout/settings/notifications/DashboardNotifications')));
const EmailNotifications = LazyLoader(lazy(() => import('../components/layout/settings/notifications/EmailNotifications')));
const OutgoingEmails = LazyLoader(lazy(() => import('../components/layout/settings/projectstatus/outgoing-emails')));
const ProjectStatus = LazyLoader(lazy(() => import('../components/layout/settings/projectstatus/ProjectStatus')));
const RecurringJobs = LazyLoader(lazy(() => import('../components/layout/settings/quotesjobs/RecurringJobs')));
const RecurringQuotes = LazyLoader(lazy(() => import('../components/layout/settings/quotesjobs/RecurringQuotes')));
const BillingInfo = LazyLoader(lazy(() => import('../components/layout/settings/subscription/BillingInfo')));
const Bills = LazyLoader(lazy(() => import('../components/layout/settings/subscription/Bills')));
const Subscription = LazyLoader(lazy(() => import('../components/layout/settings/subscription/Subscription')));
const CreateEmailTemplate = LazyLoader(lazy(() => import('../components/layout/settings/templates/email-template/create-email-template')));
const CreateSMSTemplate = LazyLoader(lazy(() => import('../components/layout/settings/templates/sms-template/create-sms-template')));
const CreateJobTemplate = LazyLoader(lazy(() => import('../components/layout/settings/templates/create-job-template')));
const CreateProposalTemplate = LazyLoader(lazy(() => import('../components/layout/settings/templates/create-proposal-template')));
const EmailTemplates = LazyLoader(lazy(() => import('../components/layout/settings/templates/email-template/email-templates')));
const SMSTemplates = LazyLoader(lazy(() => import('../components/layout/settings/templates/sms-template/sms-templates')));
const EmailSignatures = LazyLoader(lazy(() => import('../components/layout/settings/templates/email-signatures')));
const JobTemplates = LazyLoader(lazy(() => import('../components/layout/settings/templates/job-templates')));
const ProposalTemplates = LazyLoader(lazy(() => import('../components/layout/settings/templates/proposal-templates')));
const TermsandConditions = LazyLoader(lazy(() => import('../components/layout/settings/termsandconditions/TermsandConditions')));
const TermsConditionsInvoice = LazyLoader(lazy(() => import('../components/layout/settings/termsandconditions/TermsConditionsInvoice')));
const MobileApp = LazyLoader(lazy(() => import('../components/layout/settings/users/MobileApp')));
const Users = LazyLoader(lazy(() => import('../components/layout/settings/users/Users')));
const Suspended = LazyLoader(lazy(() => import('../components/layout/suspended')));
const ApprovalPage = LazyLoader(lazy(() => import('../components/Work/Pages/approval')));
const WorkDashboard = LazyLoader(lazy(() => import('../components/Work/Pages/Dashboard')));
const JobsPage = LazyLoader(lazy(() => import('../components/Work/Pages/jobs')));
const News = LazyLoader(lazy(() => import('../components/Work/Pages/News')));
const PeoplePage = LazyLoader(lazy(() => import('../components/Work/Pages/people')));
const TaskPage = LazyLoader(lazy(() => import('../components/Work/Pages/tasks')));
const AccountOverdue = LazyLoader(lazy(() => import('../pages/account-overdue/account-overdue')));
const Logout = LazyLoader(lazy(() => import('../pages/setting/logout/logout')));
const Chat = LazyLoader(lazy(() => import('../pages/work/chat')));
const Dashboard = LazyLoader(lazy(() => import('../pages/business/dashboard/dashboard')));
const LockedError = LazyLoader(lazy(() => import('../pages/error/locked/locked')));
const NotFoundError = LazyLoader(lazy(() => import('../pages/error/not-found/not-found')));
const UnauthorizedError = LazyLoader(lazy(() => import('../pages/error/unauthorized/unauthorized')));
const StripeContainer = LazyLoader(lazy(() => import('../ui/strip-payment/strip-payment')));

const routes = [
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/logout",
        element: <Logout />
    },
    {
        path: "/suspended",
        element: <Suspended />
    },
    {
        path: "/account-overdue",
        element: <AccountOverdue />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "/check-mail",
        element: <CheckMail />
    },
    {
        path: "/password-reset",
        element: <PasswordReset />
    },
    {
        path: "/profile/change-password/:token",
        element: <ChangePassword />
    },
    {
        path: "/requestdemo",
        element: <SignUp />
    },
    {
        path: "/select-country",
        element: <SelectCountry />
    },
    {
        path: "/companyname",
        element: <CompanyName />
    },
    {
        path: "/selectdate",
        element: <SelectDate />
    },
    {
        path: "/allset",
        element: <AllSet />
    },
    {
        path: "/onboarding",
        element: <Create />
    },
    {
        path: "/verify-mail/:uuid",
        element: <Verifymail />
    },
    {
        path: "/company-name/:uuid",
        element: <Companyname />
    },
    {
        path: "/regional-settings/:uuid",
        element: <Regionalsettings />
    },
    {
        path: "/discover-memate/:uuid",
        element: <DiscovermemateWrapper />
    },
    {
        path: "/create-password/:uuid",
        element: <PasswordCreate />
    },
    {
        path: "/resend-email",
        element: <ResendEmail />
    },
    {
        path: "/demo",
        element: <Demo />
    },
    {
        path: "/quote/:id",
        element: <QuotationEmail />
    },
    {
        path: "/invoice/:id",
        element: <PublicInvoice />
    },
    {
        path: "/payment/:clientSecret/:publishKey",
        element: <StripeContainer />
    },
    {
        path: "/423",
        element: <LockedError />,
    },
    {
        path: "/403",
        element: <UnauthorizedError />,
    },
    {
        path: "/404",
        element: <NotFoundError />,
    },
    {
        path: "/",
        element: <HeaderLayout />,
        children: [
            {
                path: "",
                element: <ProtectedRoute permission={""}><Dashboard /></ProtectedRoute>,
            },
            {
                path: "clients",
                element: <ProtectedRoute permission={""}><ClientPage /></ProtectedRoute>,
            },
            {
                path: "clients/:id/order-history",
                element: <ProtectedRoute permission={""}><ClientOrderHistory /></ProtectedRoute>,
            },
            {
                path: "suppliers",
                element: <ProtectedRoute permission={""}><SupplierPage /></ProtectedRoute>,
            },
            {
                path: "suppliers/:id/history",
                element: <ProtectedRoute permission={""}><SupplierHistoryPage /></ProtectedRoute>,
            },
            {
                path: "expenses",
                element: <ProtectedRoute permission={""}><ExpensesPage /></ProtectedRoute>,
            },
            {
                path: "invoices",
                element: <ProtectedRoute permission={""}><InvoicePage /></ProtectedRoute>,
            },
            {
                path: "projects",
                element: <ProtectedRoute permission={""}><ProjectPage /></ProtectedRoute>,
            },
            {
                path: "statistics",
                children: [
                    {
                        path: "",
                        element: <ProtectedRoute permission={""}><StatisticsPage /></ProtectedRoute>,
                    },
                    {
                        path: "key-results",
                        element: <ProtectedRoute permission={""}><KeyResultsPage /></ProtectedRoute>,
                    },
                    {
                        path: "executive",
                        element: <ProtectedRoute permission={""}><Executive /></ProtectedRoute>,
                    },
                    {
                        path: "sales-conversion",
                        element: <ProtectedRoute permission={""}><SalesConversion /></ProtectedRoute>,
                    },
                    {
                        path: "overview",
                        element: <ProtectedRoute permission={""}><Overview /></ProtectedRoute>,
                    },
                ],
            },
            {
                path: "sales",
                children: [
                    {
                        path: "",
                        element: <ProtectedRoute permission={""}><Sales /></ProtectedRoute>,
                    },
                    {
                        path: "newquote/selectyourclient",
                        children: [

                            {
                                path: "",
                                element: <ProtectedRoute permission={""}><SelectClientType /></ProtectedRoute>
                            },
                            {
                                path: "existing-clients",
                                element: <ProtectedRoute permission={""}><ExistingClients /></ProtectedRoute>,
                            },
                            {
                                path: "new-clients",
                                element: <ProtectedRoute permission={""}><NewClient /></ProtectedRoute>,
                            },
                            {
                                path: "business-client",
                                element: <ProtectedRoute permission={""}><BusinessClientInformation /></ProtectedRoute>,
                            },
                            {
                                path: "business-client/:id",
                                element: <ProtectedRoute permission={""}><BusinessClientInformation /></ProtectedRoute>,
                            },
                            {
                                path: "individual-client",
                                element: <ProtectedRoute permission={""}><IndividualClientInformation /></ProtectedRoute>,
                            },
                            {
                                path: "individual-client/:id",
                                element: <ProtectedRoute permission={""}><IndividualClientInformation /></ProtectedRoute>,
                            },
                            {
                                path: "client-information/scope-of-work",
                                element: <ProtectedRoute permission={""}><ScopeOfWorkComponent /></ProtectedRoute>,
                            },
                            {
                                path: "client-information/scope-of-work/:id",
                                element: <ProtectedRoute permission={""}><ScopeOfWorkComponent /></ProtectedRoute>,
                            },
                        ],
                    },
                    {
                        path: "quote-calculation",
                        element: <ProtectedRoute permission={""}><CalculateQuote /></ProtectedRoute>,
                    },
                    {
                        path: "quote-calculation/:unique_id",
                        element: <ProtectedRoute permission={""}><CalculateQuote /></ProtectedRoute>,
                    },
                ],
            },
            {
                path: "management",
                element: <ProtectedRoute permission={""}><Management /></ProtectedRoute>,
            },
            {
                path: "profile",
                element: <ProtectedRoute permission={""}><Profile /></ProtectedRoute>,
            },
        ],
    },
    {
        path: "/work",
        element: <HeaderLayout />,
        children: [
            {
                path: "",
                element: <ProtectedRoute permission={""}><WorkDashboard /></ProtectedRoute>,
            },
            {
                path: "dashboard",
                element: <ProtectedRoute permission={""}><WorkDashboard /></ProtectedRoute>,
            },
            {
                path: "tasks",
                element: <ProtectedRoute permission={""}><TaskPage /></ProtectedRoute>,
            },
            {
                path: "news",
                element: <ProtectedRoute permission={""}><News /></ProtectedRoute>,
            },
            {
                path: "approval",
                element: <ProtectedRoute permission={""}><ApprovalPage /></ProtectedRoute>,
            },
            {
                path: "jobs",
                element: <ProtectedRoute permission={""}><JobsPage /></ProtectedRoute>,
            },
            {
                path: "people",
                element: <ProtectedRoute permission={""}><PeoplePage /></ProtectedRoute>,
            },
            {
                path: "chat",
                element: <ProtectedRoute permission={""}><Chat /></ProtectedRoute>,
            },
        ],
    },
    {
        path: "/settings",
        element: <HeaderLayout />,
        children: [
            {
                path: "generalinformation",
                children: [
                    {
                        path: "",
                        element: <ProtectedRoute permission={""}><GeneralInformation /></ProtectedRoute>
                    },
                    {
                        path: "bank-details",
                        element: <ProtectedRoute permission={""}><BankDetails /></ProtectedRoute>,
                    },
                    {
                        path: "region-and-language",
                        element: <ProtectedRoute permission={""}><RegionLanguage /></ProtectedRoute>,
                    },
                    {
                        path: "profile",
                        element: <ProtectedRoute permission={""}><MyProfile /></ProtectedRoute>,
                    },
                    {
                        path: "subscription",
                        element: <ProtectedRoute permission={""}><Subscription /></ProtectedRoute>,
                    },
                    {
                        path: "bills",
                        element: <ProtectedRoute permission={""}><Bills /></ProtectedRoute>,
                    },
                    {
                        path: "billing-info",
                        element: <ProtectedRoute permission={""}><BillingInfo /></ProtectedRoute>,
                    },
                ],
            },
            {
                path: "users",
                children: [
                    {
                        path: "desktop",
                        element: <ProtectedRoute permission={""}><Users /></ProtectedRoute>,
                    },
                    {
                        path: "mobile-app",
                        element: <ProtectedRoute permission={""}><MobileApp /></ProtectedRoute>,
                    },
                ],
            },
            {
                path: "calculators/departments",
                element: <ProtectedRoute permission={""}><Departments /></ProtectedRoute>,
            },
            {
                path: "location",
                element: <ProtectedRoute permission={""}><Location /></ProtectedRoute>,
            },
            {
                path: "templates",
                children: [
                    {
                        path: "job-templates",
                        element: <ProtectedRoute permission={""}><JobTemplates /></ProtectedRoute>,
                    },
                    {
                        path: "job-templates/new",
                        element: <ProtectedRoute permission={""}><CreateJobTemplate /></ProtectedRoute>,
                    },
                    {
                        path: "job-templates/:id",
                        element: <ProtectedRoute permission={""}><CreateJobTemplate /></ProtectedRoute>,
                    },
                    {
                        path: "email-templates",
                        element: <ProtectedRoute permission={""}><EmailTemplates /></ProtectedRoute>,
                    },
                    {
                        path: "email-templates/new",
                        element: <ProtectedRoute permission={""}><CreateEmailTemplate /></ProtectedRoute>,
                    },
                    {
                        path: "email-templates/:id",
                        element: <ProtectedRoute permission={""}><CreateEmailTemplate /></ProtectedRoute>,
                    },
                    {
                        path: "email-signatures",
                        element: <ProtectedRoute permission={""}><EmailSignatures /></ProtectedRoute>,
                    },
                    {
                        path: "proposal-templates",
                        element: <ProtectedRoute permission={""}><ProposalTemplates /></ProtectedRoute>,
                    },
                    {
                        path: "proposal-templates/new",
                        element: <ProtectedRoute permission={""}><CreateProposalTemplate /></ProtectedRoute>,
                    },
                    {
                        path: "proposal-templates/:id",
                        element: <ProtectedRoute permission={""}><CreateProposalTemplate /></ProtectedRoute>,
                    },
                    {
                        path: "sms-templates",
                        element: <ProtectedRoute permission={""}><SMSTemplates /></ProtectedRoute>,
                    },
                    {
                        path: "sms-templates/new",
                        element: <ProtectedRoute permission={""}><CreateSMSTemplate /></ProtectedRoute>,
                    },
                    {
                        path: "sms-templates/:id",
                        element: <ProtectedRoute permission={""}><CreateSMSTemplate /></ProtectedRoute>,
                    },
                ],
            },
            {
                path: "companyethos/company-ethos",
                element: <ProtectedRoute permission={""}><CompanyEthos /></ProtectedRoute>,
            },
            {
                path: "integrations",
                element: <ProtectedRoute permission={""}><Integrations /></ProtectedRoute>,
            },
            {
                path: "quotesjobs",
                children: [
                    {
                        path: "recurring-quotes",
                        element: <ProtectedRoute permission={""}><RecurringQuotes /></ProtectedRoute>,
                    },
                    {
                        path: "recurring-jobs",
                        element: <ProtectedRoute permission={""}><RecurringJobs /></ProtectedRoute>,
                    },
                ],
            },
            {
                path: "projectstatus",
                children: [
                    {
                        path: "project-status",
                        element: <ProtectedRoute permission={""}><ProjectStatus /></ProtectedRoute>,
                    },
                    {
                        path: "outgoing-emails",
                        element: <ProtectedRoute permission={""}><OutgoingEmails /></ProtectedRoute>,
                    },
                ],
            },
            {
                path: "termsandconditions",
                children: [
                    {
                        path: "terms-and-conditions",
                        element: <ProtectedRoute permission={""}><TermsandConditions /></ProtectedRoute>,
                    },
                    {
                        path: "terms-and-conditions-invoice",
                        element: <ProtectedRoute permission={""}><TermsConditionsInvoice /></ProtectedRoute>,
                    },
                ],
            },
            {
                path: "customerssettings",
                children: [
                    {
                        path: "industries",
                        element: <ProtectedRoute permission={""}><CustomersIndustries /></ProtectedRoute>,
                    },
                    {
                        path: "customers-discount-category",
                        element: <ProtectedRoute permission={""}><CustomersDiscountCategory /></ProtectedRoute>,
                    },
                ],
            },
            {
                path: "accounting",
                children: [
                    {
                        path: "expenses",
                        element: <ProtectedRoute permission={""}><ExpensesAccount /></ProtectedRoute>,
                    },
                    {
                        path: "department-turnover-plan",
                        element: <ProtectedRoute permission={""}><DepartmentTurnoverPlan /></ProtectedRoute>,
                    },
                ],
            },
            {
                path: "notifications",
                children: [
                    {
                        path: "dashboard-notifications",
                        element: <ProtectedRoute permission={""}><DashboardNotifications /></ProtectedRoute>,
                    },
                    {
                        path: "app-notifications",
                        element: <ProtectedRoute permission={""}><AppNotifications /></ProtectedRoute>,
                    },
                    {
                        path: "email-notifications",
                        element: <ProtectedRoute permission={""}><EmailNotifications /></ProtectedRoute>,
                    },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to={"/404"} replace />,
    }
];

export default routes;