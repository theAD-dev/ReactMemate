import bookSquare from "../../../../assets/images/icon/book-square.svg";
import Briefcase from "../../../../assets/images/icon/briefcase.svg";
import calendarTick from "../../../../assets/images/icon/calendar-tick.svg";
import clipboardTick from "../../../../assets/images/icon/clipboard-tick.svg";
import ExpenseIcon from "../../../../assets/images/icon/ExpenseIcon.svg";
import InvoicesIcon from "../../../../assets/images/icon/InvoicesIcon.svg";
import ManagementIcon from "../../../../assets/images/icon/ManagementIcon.svg";
import OrdersIcon from "../../../../assets/images/icon/OrdersIcon.svg";
import ClientsIcon from "../../../../assets/images/icon/profile-2user.svg";
import Profile3user from "../../../../assets/images/icon/profile-3user.svg";
import SalesIcon from "../../../../assets/images/icon/SalesIcon.svg";
import StatisticsIcon from "../../../../assets/images/icon/StatisticsIcon.svg";
import statusUp from "../../../../assets/images/icon/status-up.svg";
import SuppliersIcon from "../../../../assets/images/icon/suppliersIcon.svg";
import Logo from "../../../../assets/images/logo.svg";

// Menu configuration object to reduce repetition
export const MENU_CONFIG = {
    business: {
        left: [
            { to: '/clients', icon: ClientsIcon, label: 'Clients', className: 'clients' },
            { to: '/suppliers', icon: SuppliersIcon, label: 'Suppliers', className: 'suppliers' },
        ],
        middle: [
            { to: '/sales', icon: SalesIcon, label: 'Sales', className: 'sales' },
            { to: '/management', icon: ManagementIcon, label: 'Management', className: 'management' },
            { to: '/orders', icon: OrdersIcon, label: 'Orders', className: 'orders' },
            { to: '/statistics', icon: StatisticsIcon, label: 'Statistics', className: 'statistics' },
        ],
        right: [
            { to: '/expenses', icon: ExpenseIcon, label: 'Expense', className: 'expense' },
            { to: '/invoices', icon: InvoicesIcon, label: 'Invoices', className: 'invoices' },
        ]
    },
    work: {
        left: [
            { to: '/work/people', icon: 'Profile3user', label: 'Team', className: 'people' },
            { to: '/work/jobs', icon: 'Briefcase', label: 'Jobs', className: 'jobs' },
        ],
        middle: [
            { to: '/work/dashboard', icon: 'statusUp', label: 'Dashboard', className: 'dashboard' },
            { to: '/work/approval', icon: 'clipboardTick', label: 'Approval', className: 'approval' },
        ],
        right: [
            { to: '/work/tasks', icon: 'calendarTick', label: 'Tasks', className: 'tasks' },
            { to: '/work/chat', icon: 'bookSquare', label: 'Chat', className: 'news' },
        ]
    }
};