import React, { useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Building, Buildings, Envelope, Person } from "react-bootstrap-icons";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { useMutation } from "@tanstack/react-query";

import style from './add-remove-company-user.module.scss';
import clsx from "clsx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { toast } from "sonner";
import { ProgressSpinner } from "primereact/progressspinner";

const AddRemoveMobileUser = ({ users, refeatch, total, price, visible, setVisible }) => {
    const [state, setState] = useState(users?.length || 0);
    const percentage = (users?.length / total) * 100;

    useEffect(() => {
        setState(users?.length)
    }, [users]);

    const minusUser = () => {
        if (state == users?.length) {
            toast.error("You are reducing the number of seats by 1, Remove 1 users to continue.")
        } else {
            setState((prev) => prev - 1);
        }
    }

    const plusUser = () => {
        setState((prev) => prev + 1);
    }

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <b className={style.iconStyle}><Buildings size={24} color="#FFD3A5" /></b>
            <span className={`white-space-nowrap ${style.headerTitle}`}>Company Users</span>
        </div>
    );

    const footerContent = (
        <div className="d-flex justify-content-end align-items-center gap-3">
            <Button type='button' className='outline-button' style={{ minWidth: '70px', borderRadius: '28px' }} onClick={() => setVisible(false)}>Close</Button>
            <Button type='button' className='solid-button' style={{ minWidth: '70px', borderRadius: '28px' }}>Save</Button>
        </div>
    );

    const nameBody = (data) => {
        return <div className='d-flex align-items-center justify-content-between show-on-hover'>
            <div className='d-flex gap-2 justify-content-center align-items-center'>
                <div style={{ overflow: 'hidden', width: '24px', height: '24px' }} className={`d-flex justify-content-center align-items-center ${style.userImg} ${data.is_business ? "" : "rounded-circle"}`}>
                    {data.photo ? <img src={data.photo} alt='clientImg' className='w-100' /> : data.is_business ? <Building color='#667085' /> : <Person color='#667085' />}
                </div>
                <div className='d-flex flex-column gap-1'>
                    <div className={`${style.ellipsis}`}>{data.first_name} {data.last_name}</div>
                </div>
            </div>
        </div>
    }

    const emailBody = (data) => {
        return <div className="d-flex gap-2 align-items-center">
            <Envelope size={24} color="#667085" />
            <span>{data?.email}</span>
        </div>
    }

    const ActionsBody = (data) => {
        return <Button className="btn font-14 text-danger outlined-button d-flex align-items-center gap-2">
            Remove
        </Button>
    }

    return (
        <Dialog visible={visible} modal header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={() => { setVisible(false); }}>
            <div className="d-flex gap-4 justify-content-between">
                <div className={clsx(style.addRemoveBox)}>
                    <label className={style.addRemoveBoxLabel}>Available Seats</label>
                    <div className="d-flex justify-content-between w-100">
                        <h1 className={style.addRemoveBoxNumber}>{total}</h1>

                        <div className={style.addRemoveButtonBox}>
                            <div className={style.addRemoveButtonLeft} onClick={minusUser}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.75781 10C2.75781 9.65482 3.03763 9.375 3.38281 9.375H17.1328C17.478 9.375 17.7578 9.65482 17.7578 10C17.7578 10.3452 17.478 10.625 17.1328 10.625H3.38281C3.03763 10.625 2.75781 10.3452 2.75781 10Z" fill="#344054" />
                                </svg>
                            </div>
                            <div className={style.addRemoveButtonRight} onClick={plusUser}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2578 2.5C10.603 2.5 10.8828 2.77982 10.8828 3.125V9.375H17.1328C17.478 9.375 17.7578 9.65482 17.7578 10C17.7578 10.3452 17.478 10.625 17.1328 10.625H10.8828V16.875C10.8828 17.2202 10.603 17.5 10.2578 17.5C9.91263 17.5 9.63281 17.2202 9.63281 16.875V10.625H3.38281C3.03763 10.625 2.75781 10.3452 2.75781 10C2.75781 9.65482 3.03763 9.375 3.38281 9.375H9.63281V3.125C9.63281 2.77982 9.91263 2.5 10.2578 2.5Z" fill="#344054" />
                                </svg>
                            </div>
                        </div>

                    </div>
                    <label className="font-14" style={{ color: '#344054' }}>Total Seats vs Used</label>
                    <div className="d-flex gap-2">

                        <div className="progressWrapMain">
                            <div className="progressWrapSubs" style={{ width: '210px' }}>
                                <div
                                    className="progress-bar"
                                    style={{ width: `${percentage}%`, background: (percentage > 50 && percentage < 90) ? "#FEDF89" : percentage > 90 ? "#FDA29B" : "#48C1FF" }}
                                ></div>
                            </div>
                            <span>{state || "0"}/{total || "0"}</span>
                        </div>

                    </div>
                </div>

                <div className={style.currentPricing}>
                    <p className={style.priceBoxText}>Current Pricing</p>
                    <div className="d-flex align-items-center"><span className={style.priceBoxPrice}>${price}</span><span className={style.slashText}>/month</span></div>
                </div>

            </div>

            <div className="mt-4">
                <DataTable value={users} showGridlines scrollable scrollHeight={"350px"}>
                    <Column field="name" style={{ width: '80px' }} body={nameBody} header="Name"></Column>
                    <Column field="email" style={{ width: '100px' }} body={emailBody} header="Email"></Column>
                    <Column style={{ width: '210px' }} header="Actions" body={ActionsBody}></Column>
                </DataTable>
            </div>

        </Dialog>
    )
}

export default AddRemoveMobileUser;