import React, { useEffect, useState } from "react";
import { Envelope } from "react-bootstrap-icons";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Button } from 'primereact/button';
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from "primereact/progressspinner";
import { toast } from "sonner";
import style from './add-remove-company-user.module.scss';
import { deleteMobileUser, updateMobileUserPrice } from "../../../../../APIs/settings-user-api";
import { formatAUD } from "../../../../../shared/lib/format-aud";
import { FallbackImage } from "../../../../../shared/ui/image-with-fallback/image-avatar";


const AddRemoveMobileUser = ({ users, defaultUser, refetch, total, price, visible, setVisible, additionalUser }) => {
    const [add, setAdd] = useState(0);
    const [state, setState] = useState(users?.length || 0);
    const [max, setMax] = useState(total || 0);
    const percentage = (users?.length / max) * 100;

    useEffect(() => {
        setState(users?.length);
        setMax(total);
    }, [users, total]);

    const minusUser = () => {
        if ((defaultUser + (additionalUser + add)) === users?.length) {
            toast.error("You are reducing the number of seats by 1, Remove 1 users to continue.");
        } else {
            if (additionalUser + add > 0) {
                setAdd((prev) => prev - 1);
            }
        }
    };

    const plusUser = () => {
        setAdd((prev) => prev + 1);
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4.25781" y="4" width="48" height="48" rx="24" fill="url(#paint0_linear_12550_176710)" fillOpacity="0.2" />
                <rect x="4.25781" y="4" width="48" height="48" rx="24" stroke="url(#paint1_linear_12550_176710)" strokeOpacity="0.1" strokeWidth="8" />
                <path d="M24.5078 19C21.6083 19 19.2578 21.3505 19.2578 24.25V31.75C19.2578 34.6495 21.6083 37 24.5078 37H32.0078C34.9073 37 37.2578 34.6495 37.2578 31.75V28C37.2578 27.5858 37.5936 27.25 38.0078 27.25C38.422 27.25 38.7578 27.5858 38.7578 28V31.75C38.7578 35.4779 35.7357 38.5 32.0078 38.5H24.5078C20.7799 38.5 17.7578 35.4779 17.7578 31.75V24.25C17.7578 20.5221 20.7799 17.5 24.5078 17.5H28.2578C28.672 17.5 29.0078 17.8358 29.0078 18.25C29.0078 18.6642 28.672 19 28.2578 19H24.5078Z" fill="black" />
                <path d="M24.5078 19C21.6083 19 19.2578 21.3505 19.2578 24.25V31.75C19.2578 34.6495 21.6083 37 24.5078 37H32.0078C34.9073 37 37.2578 34.6495 37.2578 31.75V28C37.2578 27.5858 37.5936 27.25 38.0078 27.25C38.422 27.25 38.7578 27.5858 38.7578 28V31.75C38.7578 35.4779 35.7357 38.5 32.0078 38.5H24.5078C20.7799 38.5 17.7578 35.4779 17.7578 31.75V24.25C17.7578 20.5221 20.7799 17.5 24.5078 17.5H28.2578C28.672 17.5 29.0078 17.8358 29.0078 18.25C29.0078 18.6642 28.672 19 28.2578 19H24.5078Z" fill="url(#paint2_linear_12550_176710)" />
                <path d="M40.2578 20.5C40.2578 22.9853 38.2431 25 35.7578 25C33.2725 25 31.2578 22.9853 31.2578 20.5C31.2578 18.0147 33.2725 16 35.7578 16C38.2431 16 40.2578 18.0147 40.2578 20.5Z" fill="black" />
                <path d="M40.2578 20.5C40.2578 22.9853 38.2431 25 35.7578 25C33.2725 25 31.2578 22.9853 31.2578 20.5C31.2578 18.0147 33.2725 16 35.7578 16C38.2431 16 40.2578 18.0147 40.2578 20.5Z" fill="url(#paint3_linear_12550_176710)" />
                <defs>
                    <linearGradient id="paint0_linear_12550_176710" x1="4.25706" y1="51.9997" x2="52.2572" y2="3.99942" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4A879A" />
                        <stop offset="1" stopColor="#C5EDF5" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_12550_176710" x1="4.25706" y1="51.9997" x2="52.2572" y2="3.99942" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4A879A" />
                        <stop offset="1" stopColor="#C5EDF5" />
                    </linearGradient>
                    <linearGradient id="paint2_linear_12550_176710" x1="17.7575" y1="38.4999" x2="40.2575" y2="15.9997" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4A879A" />
                        <stop offset="1" stopColor="#C5EDF5" />
                    </linearGradient>
                    <linearGradient id="paint3_linear_12550_176710" x1="17.7575" y1="38.4999" x2="40.2575" y2="15.9997" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4A879A" />
                        <stop offset="1" stopColor="#C5EDF5" />
                    </linearGradient>
                </defs>
            </svg>

            <span className={`white-space-nowrap ${style.headerTitle}`}>Mobile App Users</span>
        </div>
    );

    const mutation = useMutation({
        mutationFn: (data) => updateMobileUserPrice(data),
        onSuccess: () => {
            toast.success(`Mobile user subscription updated successfully`);
            window.location.reload();
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to update subscription. Please try again.`);
        }
    });

    const saveWorkSubscription = () => {
        let obj = {
            max_workers: defaultUser + (additionalUser + add),
        };
        mutation.mutate(obj);
    };

    const footerContent = (
        <div className="d-flex justify-content-end align-items-center gap-3">
            <Button type='button' className='outline-button' style={{ minWidth: '70px', borderRadius: '28px' }} onClick={() => setVisible(false)}>Close</Button>
            <Button type='button' className='solid-button' style={{ minWidth: '70px', borderRadius: '28px' }} onClick={saveWorkSubscription}>
                Update
                {mutation?.isPending && <ProgressSpinner className='me-2' style={{ width: '18px', height: '18px' }} />}
            </Button>
        </div>
    );

    const nameBody = (data) => {
        return <div className='d-flex align-items-center justify-content-between show-on-hover'>
            <div className='d-flex gap-2 justify-content-center align-items-center'>
                <div style={{ overflow: 'hidden', width: '24px', height: '24px' }} className={`d-flex justify-content-center align-items-center ${style.userImg} ${data.is_business ? "" : "rounded-circle"}`}>
                    {
                        data?.has_photo ?
                            <div className="d-flex justify-content-center align-items-center" style={{ border: '1px solid #dedede', width: '100%', height: '100%', borderRadius: '50%' }}>
                                <FallbackImage photo={data.photo} is_business={false} has_photo={data?.has_photo} size={20} />
                            </div> :
                            <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.757812" y="0.5" width="31" height="31" rx="15.5" stroke="#98A2B3" strokeDasharray="2 2" />
                                <path d="M16.2578 16C18.7431 16 20.7578 13.9853 20.7578 11.5C20.7578 9.01472 18.7431 7 16.2578 7C13.7725 7 11.7578 9.01472 11.7578 11.5C11.7578 13.9853 13.7725 16 16.2578 16ZM19.2578 11.5C19.2578 13.1569 17.9147 14.5 16.2578 14.5C14.601 14.5 13.2578 13.1569 13.2578 11.5C13.2578 9.84315 14.601 8.5 16.2578 8.5C17.9147 8.5 19.2578 9.84315 19.2578 11.5Z" fill="#667085" />
                                <path d="M25.2578 23.5C25.2578 25 23.7578 25 23.7578 25H8.75781C8.75781 25 7.25781 25 7.25781 23.5C7.25781 22 8.75781 17.5 16.2578 17.5C23.7578 17.5 25.2578 22 25.2578 23.5ZM23.7578 23.4948C23.7556 23.1246 23.5271 22.0157 22.5096 20.9982C21.5313 20.0198 19.6915 19 16.2578 19C12.8241 19 10.9843 20.0198 10.006 20.9982C8.98844 22.0157 8.75995 23.1246 8.75781 23.4948H23.7578Z" fill="#667085" />
                            </svg>
                    }
                </div>
                <div className='d-flex flex-column gap-1'>
                    {
                        data.first_name ?
                            <div className={`${style.ellipsis}`}>{data.first_name} {data.last_name}</div> :
                            <svg width="79" height="12" viewBox="0 0 79 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.257812" width="78.0098" height="12" rx="6" fill="#F2F4F7" />
                            </svg>
                    }
                </div>
            </div>
        </div>;
    };

    const emailBody = (data) => {
        return <div className="d-flex gap-2 align-items-center">
            <Envelope size={24} color="#667085" />
            {
                data?.email ?
                    <span>{data?.email}</span> :
                    <svg width="199" height="12" viewBox="0 0 199 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.257812" width="198.729" height="12" rx="6" fill="#F2F4F7" />
                    </svg>
            }
        </div>;
    };

    const deleteMutation = useMutation({
        mutationFn: (data) => deleteMobileUser(data),
        onSuccess: () => {
            refetch();
            toast.success(`User deleted successfully`);
            deleteMutation.reset();
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to delete user. Please try again.`);
        }
    });

    const ActionsBody = (data) => {
        if (!data?.id) return "";
        return <Button className="btn font-14 text-danger outlined-button d-flex align-items-center gap-2" onClick={() => { deleteMutation.mutate(data?.id); }}>
            Remove
            {deleteMutation?.variables === data?.id ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner> : ""}
        </Button>;
    };

    useEffect(() => {
        setAdd(0);
    }, [visible]);

    return (
        <Dialog visible={visible} modal header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={() => { setVisible(false); }}>
            <div className="d-flex gap-4 justify-content-between">
                <div className={clsx(style.addRemoveBox)}>
                    <label className={style.addRemoveBoxLabel}>Additional Seats</label>
                    <div className="d-flex justify-content-between w-100">
                        <h1 className={style.addRemoveBoxNumber}>{additionalUser + add}</h1>

                        <div className={style.addRemoveButtonBox}>
                            <div className={style.addRemoveButtonLeft} onClick={minusUser}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.75781 10C2.75781 9.65482 3.03763 9.375 3.38281 9.375H17.1328C17.478 9.375 17.7578 9.65482 17.7578 10C17.7578 10.3452 17.478 10.625 17.1328 10.625H3.38281C3.03763 10.625 2.75781 10.3452 2.75781 10Z" fill="#344054" />
                                </svg>
                            </div>
                            <div className={style.addRemoveButtonRight} onClick={plusUser}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.2578 2.5C10.603 2.5 10.8828 2.77982 10.8828 3.125V9.375H17.1328C17.478 9.375 17.7578 9.65482 17.7578 10C17.7578 10.3452 17.478 10.625 17.1328 10.625H10.8828V16.875C10.8828 17.2202 10.603 17.5 10.2578 17.5C9.91263 17.5 9.63281 17.2202 9.63281 16.875V10.625H3.38281C3.03763 10.625 2.75781 10.3452 2.75781 10C2.75781 9.65482 3.03763 9.375 3.38281 9.375H9.63281V3.125C9.63281 2.77982 9.91263 2.5 10.2578 2.5Z" fill="#344054" />
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
                            <span>{state || "0"}/{max || "0"}</span>
                        </div>

                    </div>
                </div>

                <div className="d-flex flex-column w-100 gap-2">
                    <div className={style.currentPricing}>
                        <p className={style.priceBoxText}>Current Pricing</p>
                        <div className="d-flex align-items-center"><span className={style.priceBoxPrice}>${formatAUD(parseFloat(price * additionalUser).toFixed(2))}</span><span className={style.slashText}>/month</span></div>
                    </div>
                    <div className={style.currentPricing}>
                        <p className={style.priceBoxText}>Updated Price</p>
                        <div className="d-flex align-items-center">
                            <span className={style.priceBoxPrice}>${formatAUD((additionalUser + add > 0) && add !== 0 ? parseFloat(price * (additionalUser + add)).toFixed(2) : parseFloat(0).toFixed(2))}</span>
                            <span className={style.slashText}>/month</span></div>
                    </div>
                </div>


            </div>

            <div className="mt-4">
                <DataTable scrollable scrollHeight={"350px"} className={style.userTable} value={[...users || [], ...Array.from({ length: max - state }, () => { return {}; })]} showGridlines>
                    <Column field="name" style={{ width: '80px' }} body={nameBody} header="Name"></Column>
                    <Column field="email" style={{ width: '100px' }} body={emailBody} header="Email"></Column>
                    <Column style={{ width: '210px' }} header="Actions" body={ActionsBody}></Column>
                </DataTable>
            </div>

        </Dialog>
    );
};

export default AddRemoveMobileUser;