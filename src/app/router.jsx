import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Login from '../components/layout/Login/login-page';
import UnknownError from "../pages/error/unknown/unknown";
import ValidationError from "../pages/error/validation/validation";
import ProtectedLayout from "../shared/ui/layout/protected-layout";
import SettingsLayout from "../shared/ui/layout/settings-layout";
import { LazyLoader } from "../shared/ui/lazy-loader/lazy-loader";

// pages
const ClientPage = LazyLoader(lazy(() => import('../components/Business/Pages/clients')));
const ClientOrderHistory = LazyLoader(lazy(() => import('../components/Business/Pages/clients/client-order-history')));
const Assets = LazyLoader(lazy(() => import('../pages/business/assets')));
const ExpensesPage = LazyLoader(lazy(() => import('../components/Business/Pages/expenses')));
const InvoicePage = LazyLoader(lazy(() => import('../components/Business/Pages/invoices')));
const PublicInvoice = LazyLoader(lazy(() => import('../components/Business/Pages/invoices/public-invoice/public-invoice')));
const Management = LazyLoader(lazy(() => import('../components/Business/Pages/management/management-page')));
const Profitability = LazyLoader(lazy(() => import('../components/Business/Pages/statistics/profitability')));
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
const AccountCode = LazyLoader(lazy(() => import('../components/layout/settings/accounting/account-code')));
const IndustryService = LazyLoader(lazy(() => import('../components/layout/settings/accounting/industry-service')));
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
const TeamInvoiceHistory = LazyLoader(lazy(() => import('../pages/work/team/invoice-history/')));
const TaskPage = LazyLoader(lazy(() => import('../components/Work/Pages/tasks')));
const AccountOverdue = LazyLoader(lazy(() => import('../pages/account-overdue/account-overdue')));
const Logout = LazyLoader(lazy(() => import('../pages/setting/logout/logout')));
const Chat = LazyLoader(lazy(() => import('../pages/chat')));
const Dashboard = LazyLoader(lazy(() => import('../pages/business/dashboard/dashboard')));
const LockedError = LazyLoader(lazy(() => import('../pages/error/locked/locked')));
const NotFoundError = LazyLoader(lazy(() => import('../pages/error/not-found/not-found')));
const UnauthorizedError = LazyLoader(lazy(() => import('../pages/error/unauthorized/unauthorized')));
const StripeContainer = LazyLoader(lazy(() => import('../ui/strip-payment/strip-payment')));
const Help = LazyLoader(lazy(() => import('../pages/help')));
const AccountStatement = LazyLoader(lazy(() => import('../components/Business/Pages/invoices/statement')));
const Enquiries = LazyLoader(lazy(() => import('../pages/business/enquiries/enquiries')));
const Forms = LazyLoader(lazy(() => import('../pages/business/enquiries/forms')));
const FormBuilder = LazyLoader(lazy(() => import('../pages/business/enquiries/form-builder/form-builder')));
const VehicleHistory = LazyLoader(lazy(() => import('../pages/business/assets/vehicle-history')));

const routes = [
    {
        path: "/login",
        element: <Login />,
        errorElement: <UnknownError />
    },
    {
        path: "/logout",
        element: <Logout />,
        errorElement: <UnknownError />
    },
    {
        path: "/suspended",
        element: <Suspended />,
        errorElement: <UnknownError />
    },
    {
        path: "/account-overdue",
        element: <AccountOverdue />,
        errorElement: <UnknownError />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
        errorElement: <UnknownError />
    },
    {
        path: "/check-mail",
        element: <CheckMail />,
        errorElement: <UnknownError />
    },
    {
        path: "/password-reset",
        element: <PasswordReset />,
        errorElement: <UnknownError />
    },
    {
        path: "/profile/change-password/:token",
        element: <ChangePassword />,
        errorElement: <UnknownError />
    },
    {
        path: "/requestdemo",
        element: <SignUp />,
        errorElement: <UnknownError />
    },
    {
        path: "/select-country",
        element: <SelectCountry />,
        errorElement: <UnknownError />
    },
    {
        path: "/companyname",
        element: <CompanyName />,
        errorElement: <UnknownError />
    },
    {
        path: "/selectdate",
        element: <SelectDate />,
        errorElement: <UnknownError />
    },
    {
        path: "/allset",
        element: <AllSet />,
        errorElement: <UnknownError />
    },
    {
        path: "/onboarding",
        element: <Create />,
        errorElement: <UnknownError />
    },
    {
        path: "/verify-mail/:uuid",
        element: <Verifymail />,
        errorElement: <UnknownError />
    },
    {
        path: "/company-name/:uuid",
        element: <Companyname />,
        errorElement: <UnknownError />
    },
    {
        path: "/regional-settings/:uuid",
        element: <Regionalsettings />,
        errorElement: <UnknownError />
    },
    {
        path: "/discover-memate/:uuid",
        element: <DiscovermemateWrapper />,
        errorElement: <UnknownError />
    },
    {
        path: "/create-password/:uuid",
        element: <PasswordCreate />,
        errorElement: <UnknownError />
    },
    {
        path: "/resend-email",
        element: <ResendEmail />,
        errorElement: <UnknownError />
    },
    {
        path: "/demo",
        element: <Demo />,
        errorElement: <UnknownError />
    },
    {
        path: "/quote/:id",
        element: <PublicQuotation />,
        errorElement: <UnknownError />
    },
    {
        path: "/invoice/:id",
        element: <PublicInvoice />,
        errorElement: <UnknownError />
    },
    {
        path: "/invoice/account-statement",
        element: <AccountStatement />,
        errorElement: <UnknownError />
    },
    {
        path: "/payment/:clientSecret/:publishKey",
        element: <StripeContainer />,
        errorElement: <UnknownError />
    },
    {
        path: "/423",
        element: <LockedError />,
        errorElement: <UnknownError />
    },
    {
        path: "/403",
        element: <UnauthorizedError />,
        errorElement: <UnknownError />
    },
    {
        path: "/404",
        element: <NotFoundError />,
        errorElement: <UnknownError />
    },
    {
        path: "/400",
        element: <ValidationError />,
        errorElement: <UnknownError />
    },
    {
        path: "/500",
        element: <UnknownError />,
        errorElement: <UnknownError />
    },
    {
        path: "/",
        element: <ProtectedLayout />,
        errorElement: <UnknownError />,
        children: [
            {
                path: "",
                element: <Dashboard />,
                errorElement: <UnknownError />,
            },
            {
                path: "/help",
                element: <Help />,
                errorElement: <UnknownError />
            },
            {
                path: "clients",
                element: <ClientPage />,
                errorElement: <UnknownError />,
            },
            {
                path: "clients/:id/order-history",
                element: <ClientOrderHistory />,
                errorElement: <UnknownError />,
            },
            {
                path: "suppliers",
                element: <SupplierPage />,
                errorElement: <UnknownError />,
            },
            {
                path: "suppliers/:id/history",
                element: <SupplierHistoryPage />,
                errorElement: <UnknownError />,
            },
            {
                path: "assets",
                element: <Assets />,
                errorElement: <UnknownError />,
            },
            {
              path: "assets/vehicles/:id/history",
              element: <VehicleHistory />,
              errorElement: <UnknownError />,
            },
            {
                path: "enquiries",
                element: <Enquiries />,
                errorElement: <UnknownError />,
            },
            {
                path: "enquiries/forms",
                element: <Forms />,
                errorElement: <UnknownError />,
            },
            {
                path: 'enquiries/form-builder/:id',
                element: <FormBuilder />,
                errorElement: <UnknownError />,
            },
            {
                path: "tasks",
                element: <TaskPage />,
                errorElement: <UnknownError />,
            },
            {
                path: "chat",
                element: <Chat />,
                errorElement: <UnknownError />,
            },
            {
                path: "expenses",
                element: <ExpensesPage />,
                errorElement: <UnknownError />,
            },
            {
                path: "invoices",
                element: <InvoicePage />,
                errorElement: <UnknownError />,
            },
            {
                path: "statistics",
                errorElement: <UnknownError />,
                children: [
                    {
                        path: "",
                        element: <StatisticsPage />,
                        errorElement: <UnknownError />,
                    },
                    {
                        path: "key-results",
                        element: <KeyResultsPage />,
                        errorElement: <UnknownError />,
                    },
                    {
                        path: "executive",
                        element: <Executive />,
                        errorElement: <UnknownError />,
                    },
                    {
                        path: "sales-conversion",
                        element: <SalesConversion />,
                        errorElement: <UnknownError />,
                    },
                    {
                        path: "overview",
                        element: <Overview />,
                        errorElement: <UnknownError />,
                    },
                    {
                        path: "profitability",
                        element: <Profitability />,
                        errorElement: <UnknownError />,
                    },
                ],
            },
            {
                path: "sales",
                errorElement: <UnknownError />,
                children: [
                    {
                        path: "",
                        element: <Sales />,
                        errorElement: <UnknownError />,
                    },
                    {
                        path: "newquote/selectyourclient",
                        errorElement: <UnknownError />,
                        children: [
                            {
                                path: "",
                                element: <SelectClientType />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "existing-clients",
                                element: <ExistingClients />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "new-clients",
                                element: <NewClient />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "business-client",
                                element: <BusinessClientInformation />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "business-client/:id",
                                element: <BusinessClientInformation />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "individual-client",
                                element: <IndividualClientInformation />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "individual-client/:id",
                                element: <IndividualClientInformation />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "client-information/scope-of-work",
                                element: <ScopeOfWorkComponent />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "client-information/scope-of-work/:id",
                                element: <ScopeOfWorkComponent />,
                                errorElement: <UnknownError />,
                            },
                        ],
                    },
                    {
                        path: "quote-calculation",
                        element: <CalculateQuote />,
                        errorElement: <UnknownError />,
                    },
                    {
                        path: "quote-calculation/:unique_id",
                        element: <CalculateQuote />,
                        errorElement: <UnknownError />,
                    },
                ],
            },
            {
                path: "management",
                element: <Management />,
                errorElement: <UnknownError />,
            },
            {
                path: "profile",
                element: <Profile />,
                errorElement: <UnknownError />,
            },
        ],
    },
    {
        path: "/work",
        element: <ProtectedLayout />,
        errorElement: <UnknownError />,
        children: [
            {
                path: "",
                element: <WorkDashboard />,
                errorElement: <UnknownError />,
            },
            {
                path: "dashboard",
                element: <WorkDashboard />,
                errorElement: <UnknownError />,
            },
            {
                path: "news",
                element: <News />,
                errorElement: <UnknownError />,
            },
            {
                path: "approval",
                element: <ApprovalPage />,
                errorElement: <UnknownError />,
            },
            {
                path: "jobs",
                element: <JobsPage />,
                errorElement: <UnknownError />,
            },
            {
                path: "people",
                element: <PeoplePage />,
                errorElement: <UnknownError />,
            },
            {
                path: "people/:id/invoice-history",
                element: <TeamInvoiceHistory />,
                errorElement: <UnknownError />,
            },
            {
                path: "chat",
                element: <Chat />,
                errorElement: <UnknownError />,
            },
        ],
    },
    {
        path: "/settings",
        element: <ProtectedLayout />,
        errorElement: <UnknownError />,
        children: [
            {
                path: "",
                element: <SettingsLayout />,
                errorElement: <UnknownError />,
                children: [
                    {
                        path: "generalinformation",
                        errorElement: <UnknownError />,
                        children: [
                            {
                                path: "",
                                element: <GeneralInformation />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "bank-details",
                                element: <BankDetails />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "region-and-language",
                                element: <RegionLanguage />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "profile",
                                element: <MyProfile />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "subscription",
                                element: <Subscription />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "bills",
                                element: <Bills />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "billing-info",
                                element: <BillingInfo />,
                                errorElement: <UnknownError />,
                            },
                        ],
                    },
                    {
                        path: "users",
                        errorElement: <UnknownError />,
                        children: [
                            {
                                path: "desktop",
                                element: <Users />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "mobile-app",
                                element: <MobileApp />,
                                errorElement: <UnknownError />,
                            },
                        ],
                    },
                    {
                        path: "calculators/departments",
                        element: <Departments />,
                        errorElement: <UnknownError />,
                    },
                    {
                        path: "location",
                        element: <Location />,
                        errorElement: <UnknownError />,
                    },
                    {
                        path: "templates",
                        errorElement: <UnknownError />,
                        children: [
                            {
                                path: "job-templates",
                                element: <JobTemplates />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "job-templates/new",
                                element: <CreateJobTemplate />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "job-templates/:id",
                                element: <CreateJobTemplate />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "email-templates",
                                element: <EmailTemplates />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "email-templates/new",
                                element: <CreateEmailTemplate />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "email-templates/:id",
                                element: <CreateEmailTemplate />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "email-signatures",
                                element: <EmailSignatures />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "email-signatures/new",
                                element: <CreateEmailSignatures />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "email-signatures/:id",
                                element: <CreateEmailSignatures />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "proposal-templates",
                                element: <ProposalTemplates />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "proposal-templates/new",
                                element: <CreateProposalTemplate />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "proposal-templates/:id",
                                element: <CreateProposalTemplate />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "sms-templates",
                                element: <SMSTemplates />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "sms-templates/new",
                                element: <CreateSMSTemplate />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "sms-templates/:id",
                                element: <CreateSMSTemplate />,
                                errorElement: <UnknownError />,
                            },
                        ],
                    },
                    {
                        path: "companyethos/company-ethos",
                        element: <CompanyEthos />,
                        errorElement: <UnknownError />,
                    },
                    {
                        path: "integrations",
                        element: <Integrations />,
                        errorElement: <UnknownError />,
                    },
                    {
                        path: "quotesjobs",
                        errorElement: <UnknownError />,
                        children: [
                            {
                                path: "recurring-quotes",
                                element: <RecurringQuotes />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "recurring-jobs",
                                element: <RecurringJobs />,
                                errorElement: <UnknownError />,
                            },
                        ],
                    },
                    {
                        path: "projectstatus",
                        errorElement: <UnknownError />,
                        children: [
                            {
                                path: "project-status",
                                element: <ProjectStatus />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "outgoing-emails",
                                element: <OutgoingEmails />,
                                errorElement: <UnknownError />,
                            },
                        ],
                    },
                    {
                        path: "termsandconditions",
                        errorElement: <UnknownError />,
                        children: [
                            {
                                path: "terms-and-conditions",
                                element: <TermsandConditions />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "terms-and-conditions-invoice",
                                element: <TermsConditionsInvoice />,
                                errorElement: <UnknownError />,
                            },
                        ],
                    },
                    {
                        path: "customerssettings",
                        errorElement: <UnknownError />,
                        children: [
                            {
                                path: "industries",
                                element: <CustomersIndustries />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "customers-discount-category",
                                element: <CustomersDiscountCategory />,
                                errorElement: <UnknownError />,
                            },
                        ],
                    },
                    {
                        path: "accounting",
                        errorElement: <UnknownError />,
                        children: [
                            {
                                path: "account-code",
                                element: <AccountCode />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "department-turnover-plan",
                                element: <DepartmentTurnoverPlan />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "industry-service",
                                element: <IndustryService />,
                                errorElement: <UnknownError />,
                            },
                        ],
                    },
                    {
                        path: "notifications",
                        errorElement: <UnknownError />,
                        children: [
                            {
                                path: "dashboard-notifications",
                                element: <DashboardNotifications />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "app-notifications",
                                element: <AppNotifications />,
                                errorElement: <UnknownError />,
                            },
                            {
                                path: "email-notifications",
                                element: <EmailNotifications />,
                                errorElement: <UnknownError />,
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
        errorElement: <UnknownError />
    }
];

export default routes;