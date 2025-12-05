import { useQuery } from "@tanstack/react-query";
import { getAccountCodeList, getAccountingList, getIndustryServiceList, getXeroCodesList } from "../api/department-turnover-plan.api";

export const useAccountingGetQuery = () => {
    return useQuery({
        queryKey: ['accounting-list'],
        queryFn: getAccountingList
    });
};

export const useIndustryServiceGetQuery = () => {
    return useQuery({
        queryKey: ['industry-service-list'],
        queryFn: getIndustryServiceList
    });
};

export const useXeroCodesGetQuery = () => {
    return useQuery({
        queryKey: ['xero-codes-list'],
        queryFn: getXeroCodesList
    });
};

export const useAccountCodeGetQuery = () => {
    return useQuery({
        queryKey: ['account-code-list'],
        queryFn: getAccountCodeList
    });
};
