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