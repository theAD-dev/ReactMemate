import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import style from './dialog.module.scss';
import { Chip } from "primereact/chip";
import warningIcon from '../../../../../assets/images/Jobs/Featured icon.svg';
import { Badge } from "primereact/badge";
import { useMutation } from "@tanstack/react-query";
import { unpaidExpense } from "../../../../../APIs/expenses-api";
import { toast } from "sonner";

export default function UnPaidDialog({ visible, setVisible, details, setRefetch }) {
    const unpaidMutation = useMutation({
        mutationFn: (data) => unpaidExpense(data),
        onSuccess: () => {
            setRefetch((refetch) => !refetch);
            setVisible();
            toast.success(`Expenses have been successfully marked as unpaid.`);
        },
        onError: (error) => {
            toast.error(`Failed to mark the expenses as unpaid. Please try again.`);
        }
    });

    const handleUnPaidExpense = () => {
        const id = details?.id;
        unpaidMutation.mutate({ ids: [id]});
    }

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <img src={warningIcon} alt="task-details" style={{ width: '48px', height: '48px' }} />
            <span className={`white-space-nowrap ${style.headerTitle}`}>Mark Expense as Unpaid?</span>
        </div>
    );

    const footerContent = (
        <div className="d-flex justify-content-end align-items-center gap-3">
            <Button label="Cancel" className="outline-button outline-none" onClick={() => setVisible(false)} autoFocus />
            <Button label={unpaidMutation?.isPending ? "Loading..." : "Mark as Unpaid"} className="danger-button font-Weight-600" style={{ padding: '10px 10px' }} onClick={handleUnPaidExpense} autoFocus />
        </div>
    );
    return (
        <>
            <Dialog visible={visible} modal={false} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={() => { if (!visible) return; setVisible(false); }}>
                <div className="px-3">
                    <p className="font-16 mb-1" style={{ color: '#344054' }}>Reference</p>
                    <h6 style={{ fontSize: '16px', color: '#475467', fontWeight: 600, marginBottom: '16px' }}>{details?.invoice_reference || ""}</h6>

                    <p className="font-16 mb-1" style={{ color: '#344054' }}>Total</p>
                    <div className={`${style.unpaidTotal}`}>
                        <Badge severity="danger"></Badge> $ {details?.total || "0.00"}
                    </div>
                </div>
            </Dialog>
        </>
    )
}
