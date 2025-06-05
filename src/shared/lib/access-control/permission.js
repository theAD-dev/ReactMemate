export const PERMISSIONS = Object.freeze({
    CLIENTS: {
        CREATE: 'CREATE_CLIENT',
        READ: 'READ_CLIENT',
        UPDATE: 'UPDATE_CLIENT',
        DELETE: 'DELETE_CLIENT',
    },
    SUPPLIERS: {
        CREATE: 'CREATE_SUPPLIER',
        READ: 'READ_SUPPLIER',
        UPDATE: 'UPDATE_SUPPLIER',
        DELETE: 'DELETE_SUPPLIER',
    },
    SALES: {},
    MANAGEMENT: {},
    PROJECTS: {},
    STATISTIC: {},
    EXPENSE: {
        CREATE: 'CREATE_EXPENSE',
        READ: 'READ_EXPENSE',
        UPDATE: 'UPDATE_EXPENSE',
        DELETE: 'DELETE_EXPENSE',
    },
    INVOICE: {
        CREATE: 'CREATE_INVOICE',
        READ: 'READ_INVOICE',
        UPDATE: 'UPDATE_INVOICE',
        DELETE: 'DELETE_INVOICE',
    },
    SETTINGS: {
        USERS: {
            MOBILE_APP: {
                ADD: 'ADD_USER',
                READ: 'READ_USER',
                UPDATE: 'UPDATE_USER',
                DISCONNECT_USER: 'DISCONNECT_USER',
                RECONNECT_USER: 'RECONNECT_USER',
                SHOW_DISCONNECTED_USERS: 'SHOW_DISCONNECTED_USERS',
                BUY_USER: 'BUY_USER',
            },
            DESKTOP: {
                ADD: 'ADD_USER',
                READ: 'READ_USER',
                DELETE: 'DELETE_USER',
                UPDATE: 'UPDATE_USER',
                RESTORE: 'RESTORE_USER',
                SHOW_DELETED_USERS: 'SHOW_DELETED_USERS',
                BUY_USER: 'BUY_USER',
            },
        }
    }
});
