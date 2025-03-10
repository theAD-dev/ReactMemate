import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteSaleQuotation } from "../api/sales.api";

export const useSaleQuotationDeleteMutations = () => {
    return useMutation({
        mutationFn: (id) => deleteSaleQuotation(id),
        onSuccess: () => {
            toast.success(`Quotation deleted successfully`);
        },
        onError: (error) => {
            console.error('Error deleting sale quotation:', error);
            toast.error('Failed to delete deleteSaleQuotation. Please try again.');
        }
    });
};
