import { PERMISSIONS } from "./permission";
import { USER_ROLES } from "./role";

export const ROLE_PERMISSIONS = {
    [USER_ROLES.ADMIN]: {
        permissions: [
            // clients 
            PERMISSIONS.CLIENTS.CREATE,
            PERMISSIONS.CLIENTS.READ,
            PERMISSIONS.CLIENTS.UPDATE,
            PERMISSIONS.CLIENTS.DELETE,

            // suppliers
            PERMISSIONS.SUPPLIERS.CREATE,
            PERMISSIONS.SUPPLIERS.READ,
            PERMISSIONS.SUPPLIERS.UPDATE,
            PERMISSIONS.SUPPLIERS.DELETE,

            // Expense
            PERMISSIONS.EXPENSE.CREATE,
            PERMISSIONS.EXPENSE.READ,
            PERMISSIONS.EXPENSE.UPDATE,
            PERMISSIONS.EXPENSE.DELETE,

            // Invoice
            PERMISSIONS.INVOICE.CREATE,
            PERMISSIONS.INVOICE.READ,
            PERMISSIONS.INVOICE.UPDATE,
            PERMISSIONS.INVOICE.DELETE,

            // settings desktop users
            PERMISSIONS.SETTINGS.USERS.DESKTOP.ADD,
            PERMISSIONS.SETTINGS.USERS.DESKTOP.READ,
            PERMISSIONS.SETTINGS.USERS.DESKTOP.DELETE,
            PERMISSIONS.SETTINGS.USERS.DESKTOP.UPDATE,
            PERMISSIONS.SETTINGS.USERS.DESKTOP.RESTORE,
            PERMISSIONS.SETTINGS.USERS.DESKTOP.SHOW_DELETED_USERS,
            PERMISSIONS.SETTINGS.USERS.DESKTOP.BUY_USER,

            // settings mobile users
            PERMISSIONS.SETTINGS.USERS.MOBILE_APP.ADD,
            PERMISSIONS.SETTINGS.USERS.MOBILE_APP.READ,
            PERMISSIONS.SETTINGS.USERS.MOBILE_APP.UPDATE,
            PERMISSIONS.SETTINGS.USERS.MOBILE_APP.DISCONNECT_USER,
            PERMISSIONS.SETTINGS.USERS.MOBILE_APP.RECONNECT_USER,
            PERMISSIONS.SETTINGS.USERS.MOBILE_APP.SHOW_DISCONNECTED_USERS,
            PERMISSIONS.SETTINGS.USERS.MOBILE_APP.BUY_USER,
        ],
    },
};

export const hasPermission = (role, permissions, requireAll = true) => {
    if (!role || !ROLE_PERMISSIONS[role]) return false;

    const rolePermissions = ROLE_PERMISSIONS[role].permissions;

    if (Array.isArray(permissions)) {
        return requireAll
            ? permissions.every((perm) => rolePermissions.includes(perm))
            : permissions.some((perm) => rolePermissions.includes(perm));
    }

    return rolePermissions.includes(permissions);
};