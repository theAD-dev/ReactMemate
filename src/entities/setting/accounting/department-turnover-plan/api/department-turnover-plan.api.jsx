import { fetchInstance } from "../../../../../shared/lib/fetch-api-instance";

export const getAccountingList = async () => {
    const path = `/settings/accounting/`;
    const options = {
        method: 'GET',
    };
    return fetchInstance(path, options);
};

export const updateAccountingTarget = async (id, data) => {
    const path = `/settings/accounting/${id}/`;
    const options = {
        method: 'PUT',
        body: data
    };
    return fetchInstance(path, options);
};

export const getIndustryServiceList = async () => {
    const path = `/suppliers/industries/`;
    const options = {
        method: 'GET',
    };
    return fetchInstance(path, options);
};

export const updateIndustryServiceCode = async (id, data) => {
    const path = `/suppliers/industries/${id}/`;
    const options = {
        method: 'PUT',
        body: data
    };
    return fetchInstance(path, options);
};

export const getXeroCodesList = async () => {
    const path = `/references/xero-codes/`;
    const options = {
        method: 'GET',
    };
    return fetchInstance(path, options);
};

export const getAccountCodeList = async () => {
    const path = `/account_codes/`;
    const options = {
        method: 'GET',
    };
    return fetchInstance(path, options);
};

export const syncCode = async () => {
    const path = `/account_codes/sync/`;
    const options = {
        method: 'PUT',
    };
    return fetchInstance(path, options);
};
