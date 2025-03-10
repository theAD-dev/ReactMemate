import { useQuery } from "@tanstack/react-query";
import { getAccountingList } from "../api/department-turnover-plan.api";

export const useAccountingGetQuery = () => {
    return useQuery({
        queryKey: ['accounting-list'],
        queryFn: getAccountingList
    });
};