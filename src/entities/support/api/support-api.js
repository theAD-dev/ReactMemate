import { fetchInstance } from "../../../shared/lib/fetch-api-instance";

export const reachOutForSupport = async (data) => {
    const path = `/support/`;
    const options = {
        method: 'POST',
        body: data
    };
    return fetchInstance(path, options);
};