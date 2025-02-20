import { fetchInstance } from "../../../shared/lib/fetch-api-instance";

export const deleteSaleQuotation = async (unique_id) => {
    const path = `/quotes/${unique_id}/delete/`;
    const options = {
        method: 'DELETE',
    };
    return fetchInstance(path, options);
}