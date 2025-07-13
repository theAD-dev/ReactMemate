import React from "react";
import { QuestionCircle } from "react-bootstrap-icons";
import { useMutation } from "@tanstack/react-query";
import { Badge } from "primereact/badge";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { toast } from "sonner";
import style from './dialog.module.scss';
import { paidExpense } from "../../../../../APIs/expenses-api";

export default function PaidDialog({ visible, setVisible, details, setRefetch }) {
    const paidMutation = useMutation({
        mutationFn: (data) => paidExpense(data),
        onSuccess: () => {
            setRefetch((refetch) => !refetch);
            setVisible();
            toast.success(`Expenses have been successfully marked as paid.`);
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to mark the expenses as paid. Please try again.`);
        }
    });

    const handlePaidExpense = () => {
        const id = details?.id;
        paidMutation.mutate({ ids: [id]});
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <b className={style.iconStyle}><QuestionCircle size={24} color="#B54708" /></b>
            <span className={`white-space-nowrap ${style.headerTitle}`}>Mark Expense as paid?</span>
        </div>
    );

    const footerContent = (
        <div className="d-flex justify-content-end align-items-center gap-3">
            <Button disabled={paidMutation?.isPending} label="Cancel" className="outline-button outline-none" onClick={() => setVisible(false)} autoFocus />
            <Button disabled={paidMutation?.isPending} label={paidMutation?.isPending ? "Loading..." : "Mark as paid"} className="success-button outline-none" onClick={handlePaidExpense} autoFocus />
        </div>
    );
    return (
        <Dialog visible={visible} modal header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={() => { if (!visible) return; setVisible(false); }}>
            <div className="px-3">
                <p className="font-16 mb-1" style={{ color: '#344054' }}>Reference</p>
                <h6 style={{ fontSize: '16px', color: '#475467', fontWeight: 600, marginBottom: '16px' }}>{details?.invoice_reference || ""}</h6>

                <p className="font-16 mb-1" style={{ color: '#344054' }}>Total</p>
                <div className={`${style.paidTotal}`}>
                    <Badge severity="success"></Badge> $ {details?.total || "0.00"}
                </div>
            </div>
        </Dialog>
    );
}
