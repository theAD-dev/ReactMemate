import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAccountingTarget, updateIndustryServiceCode } from "../api/department-turnover-plan.api";

export const useAccountingTargetUpdateMutations = () => {
    return useMutation({
        mutationFn: ({ id, data }) => updateAccountingTarget(id, data),
        onSuccess: () => {
            toast.success(`Accounting target updated successfully`);
        },
        onError: (error) => {
            console.error('Error updating accounting target:', error);
            toast.error('Failed to update accounting target. Please try again.');
        }
    });
};

export const useIndustryServiceUpdateMutations = () => {
    return useMutation({
        mutationFn: ({ id, data }) => updateIndustryServiceCode(id, data),
        onSuccess: () => {
            toast.success(`Industry service code updated successfully`);
        },
        onError: (error) => {
            console.error('Error updating industry service code:', error);
            toast.error('Failed to update industry service code. Please try again.');
        }
    });
};