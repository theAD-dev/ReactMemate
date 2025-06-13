import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Login from '../components/layout/Login/login-page';
import UnknownError from "../pages/error/unknown/unknown";
import ProtectedLayout from "../shared/ui/layout/protected-layout";
import SettingsLayout from "../shared/ui/layout/settings-layout";
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
const PublicQuotation = LazyLoader(lazy(() => import('../components/Business/Pages/sales/public-quotation/quotation')));
const ChangePassword = LazyLoader(lazy(() => import('../components/layout/Login/change-password')));
const CheckMail = LazyLoader(lazy(() => import('../components/layout/Login/check-mail')));
const ForgotPassword = LazyLoader(lazy(() => import('../components/layout/Login/forgot-password')));
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
const SelectDate = LazyLoader(lazy(() => import('../components/layout/requestdemo/select-date')));
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
const EmailSignatures = LazyLoader(lazy(() => import('../components/layout/settings/templates/email-signature-template/email-signature-templates')));
const CreateEmailSignatures = LazyLoader(lazy(() => import('../components/layout/settings/templates/email-signature-template/create-email-signature-template')));
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
        element: <PublicQuotation />
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
        path: "/500",
        element: <UnknownError />,
    },
    {
        path: "/",
        element: <ProtectedLayout />,
        children: [
            {
                path: "",
                element: <Dashboard />,
            },
            {
                path: "clients",
                element: <ClientPage />,
            },
            {
                path: "clients/:id/order-history",
                element: <ClientOrderHistory />,
            },
            {
                path: "suppliers",
                element: <SupplierPage />,
            },
            {
                path: "suppliers/:id/history",
                element: <SupplierHistoryPage />,
            },
            {
                path: "expenses",
                element: <ExpensesPage />,
            },
            {
                path: "invoices",
                element: <InvoicePage />,
            },
            {
                path: "projects",
                element: <ProjectPage />,
            },
            {
                path: "statistics",
                children: [
                    {
                        path: "",
                        element: <StatisticsPage />,
                    },
                    {
                        path: "key-results",
                        element: <KeyResultsPage />,
                    },
                    {
                        path: "executive",
                        element: <Executive />,
                    },
                    {
                        path: "sales-conversion",
                        element: <SalesConversion />,
                    },
                    {
                        path: "overview",
                        element: <Overview />,
                    },
                ],
            },
            {
                path: "sales",
                children: [
                    {
                        path: "",
                        element: <Sales />,
                    },
                    {
                        path: "newquote/selectyourclient",
                        children: [

                            {
                                path: "",
                                element: <SelectClientType />
                            },
                            {
                                path: "existing-clients",
                                element: <ExistingClients />,
                            },
                            {
                                path: "new-clients",
                                element: <NewClient />,
                            },
                            {
                                path: "business-client",
                                element: <BusinessClientInformation />,
                            },
                            {
                                path: "business-client/:id",
                                element: <BusinessClientInformation />,
                            },
                            {
                                path: "individual-client",
                                element: <IndividualClientInformation />,
                            },
                            {
                                path: "individual-client/:id",
                                element: <IndividualClientInformation />,
                            },
                            {
                                path: "client-information/scope-of-work",
                                element: <ScopeOfWorkComponent />,
                            },
                            {
                                path: "client-information/scope-of-work/:id",
                                element: <ScopeOfWorkComponent />,
                            },
                        ],
                    },
                    {
                        path: "quote-calculation",
                        element: <CalculateQuote />,
                    },
                    {
                        path: "quote-calculation/:unique_id",
                        element: <CalculateQuote />,
                    },
                ],
            },
            {
                path: "management",
                element: <Management />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
        ],
    },
    {
        path: "/work",
        element: <ProtectedLayout />,
        children: [
            {
                path: "",
                element: <WorkDashboard />,
            },
            {
                path: "dashboard",
                element: <WorkDashboard />,
            },
            {
                path: "tasks",
                element: <TaskPage />,
            },
            {
                path: "news",
                element: <News />,
            },
            {
                path: "approval",
                element: <ApprovalPage />,
                errorElement: <UnknownError />,
            },
            {
                path: "jobs",
                element: <JobsPage />,
            },
            {
                path: "people",
                element: <PeoplePage />,
            },
            {
                path: "chat",
                element: <Chat />,
            },
        ],
    },
    {
        path: "/settings",
        element: <ProtectedLayout />,
        children: [
            {
                path: "",
                element: <SettingsLayout />,
                children: [
                    {
                        path: "generalinformation",
                        children: [
                            {
                                path: "",
                                element: <GeneralInformation />
                            },
                            {
                                path: "bank-details",
                                element: <BankDetails />,
                            },
                            {
                                path: "region-and-language",
                                element: <RegionLanguage />,
                            },
                            {
                                path: "profile",
                                element: <MyProfile />,
                            },
                            {
                                path: "subscription",
                                element: <Subscription />,
                            },
                            {
                                path: "bills",
                                element: <Bills />,
                            },
                            {
                                path: "billing-info",
                                element: <BillingInfo />,
                            },
                        ],
                    },
                    {
                        path: "users",
                        children: [
                            {
                                path: "desktop",
                                element: <Users />,
                            },
                            {
                                path: "mobile-app",
                                element: <MobileApp />,
                            },
                        ],
                    },
                    {
                        path: "calculators/departments",
                        element: <Departments />,
                    },
                    {
                        path: "location",
                        element: <Location />,
                    },
                    {
                        path: "templates",
                        children: [
                            {
                                path: "job-templates",
                                element: <JobTemplates />,
                            },
                            {
                                path: "job-templates/new",
                                element: <CreateJobTemplate />,
                            },
                            {
                                path: "job-templates/:id",
                                element: <CreateJobTemplate />,
                            },
                            {
                                path: "email-templates",
                                element: <EmailTemplates />,
                            },
                            {
                                path: "email-templates/new",
                                element: <CreateEmailTemplate />,
                            },
                            {
                                path: "email-templates/:id",
                                element: <CreateEmailTemplate />,
                            },
                            {
                                path: "email-signatures",
                                element: <EmailSignatures />,
                            },
                            {
                                path: "email-signatures/new",
                                element: <CreateEmailSignatures />,
                            },
                            {
                                path: "email-signatures/:id",
                                element: <CreateEmailSignatures />,
                            },
                            {
                                path: "proposal-templates",
                                element: <ProposalTemplates />,
                            },
                            {
                                path: "proposal-templates/new",
                                element: <CreateProposalTemplate />,
                            },
                            {
                                path: "proposal-templates/:id",
                                element: <CreateProposalTemplate />,
                            },
                            {
                                path: "sms-templates",
                                element: <SMSTemplates />,
                            },
                            {
                                path: "sms-templates/new",
                                element: <CreateSMSTemplate />,
                            },
                            {
                                path: "sms-templates/:id",
                                element: <CreateSMSTemplate />,
                            },
                        ],
                    },
                    {
                        path: "companyethos/company-ethos",
                        element: <CompanyEthos />,
                    },
                    {
                        path: "integrations",
                        element: <Integrations />,
                    },
                    {
                        path: "quotesjobs",
                        children: [
                            {
                                path: "recurring-quotes",
                                element: <RecurringQuotes />,
                            },
                            {
                                path: "recurring-jobs",
                                element: <RecurringJobs />,
                            },
                        ],
                    },
                    {
                        path: "projectstatus",
                        children: [
                            {
                                path: "project-status",
                                element: <ProjectStatus />,
                            },
                            {
                                path: "outgoing-emails",
                                element: <OutgoingEmails />,
                            },
                        ],
                    },
                    {
                        path: "termsandconditions",
                        children: [
                            {
                                path: "terms-and-conditions",
                                element: <TermsandConditions />,
                            },
                            {
                                path: "terms-and-conditions-invoice",
                                element: <TermsConditionsInvoice />,
                            },
                        ],
                    },
                    {
                        path: "customerssettings",
                        children: [
                            {
                                path: "industries",
                                element: <CustomersIndustries />,
                            },
                            {
                                path: "customers-discount-category",
                                element: <CustomersDiscountCategory />,
                            },
                        ],
                    },
                    {
                        path: "accounting",
                        children: [
                            {
                                path: "expenses",
                                element: <ExpensesAccount />,
                            },
                            {
                                path: "department-turnover-plan",
                                element: <DepartmentTurnoverPlan />,
                            },
                        ],
                    },
                    {
                        path: "notifications",
                        children: [
                            {
                                path: "dashboard-notifications",
                                element: <DashboardNotifications />,
                            },
                            {
                                path: "app-notifications",
                                element: <AppNotifications />,
                            },
                            {
                                path: "email-notifications",
                                element: <EmailNotifications />,
                            },
                        ],
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