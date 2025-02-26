import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAccountingTarget } from "../api/department-turnover-plan.api";

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
