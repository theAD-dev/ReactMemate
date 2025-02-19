import React, { useEffect, useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Buildings, Envelope } from "react-bootstrap-icons";
import { useMutation } from "@tanstack/react-query";
import style from './add-remove-company-user.module.scss';
import clsx from "clsx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { toast } from "sonner";
import { deleteDesktopUser, updateUserPrice } from "../../../../../APIs/settings-user-api";
import { ProgressSpinner } from "primereact/progressspinner";
import { formatAUD } from "../../../../../shared/lib/format-aud";

const AddRemoveCompanyUser = ({ users, defaultUser, refetch, total, price, visible, setVisible, additionalUser }) => {
  const [add, setAdd] = useState(0);
  const [state, setState] = useState(users?.length || 0);
  const [max, setMax] = useState(total || 0)
  const percentage = (users?.length / max) * 100;
  const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');

  useEffect(() => {
    setState(users?.length);
    setMax(total);
  }, [users, total]);

  const minusUser = () => {
    if ((defaultUser + (additionalUser + add)) === users?.length) {
      toast.error("You are reducing the number of seats by 1, Remove 1 users to continue.")
    } else {
      if (additionalUser + add > 0) {
        setAdd((prev) => prev - 1);
      }
    }
  }

  const plusUser = () => {
    setAdd((prev) => prev + 1);
  }

  const headerElement = (
    <div className={`${style.modalHeader}`}>
      <b className={style.iconStyle}><Buildings size={24} color="#FFD3A5" /></b>
      <span className={`white-space-nowrap ${style.headerTitle}`}>Company Users</span>
    </div>
  );

  const mutation = useMutation({
    mutationFn: (data) => updateUserPrice(data),
    onSuccess: () => {
      toast.success(`Company user subscription updated successfully`);
      window.location.reload();
    },
    onError: (error) => {
      toast.error(`Failed to update subscription. Please try again.`);
    }
  });

  const saveBusinessSubscription = () => {
    let obj = {
      max_users: defaultUser + (additionalUser + add),
    }
    mutation.mutate(obj);
  }

  const footerContent = (
    <div className="d-flex justify-content-end align-items-center gap-3">
      <Button type='button' className='outline-button' style={{ minWidth: '70px', borderRadius: '28px' }} onClick={() => setVisible(false)}>Close</Button>
      <Button type='button' disabled={add === 0} className='solid-button' style={{ minWidth: '70px', borderRadius: '28px' }} onClick={saveBusinessSubscription}>
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
            data?.photo ?
              <img src={data.photo} alt='clientImg' className='w-100' /> :
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
    </div>
  }

  const deleteMutation = useMutation({
    mutationFn: (data) => deleteDesktopUser(data),
    onSuccess: () => {
      refetch();
      toast.success(`User deleted successfully`);
      deleteMutation.reset();
    },
    onError: (error) => {
      toast.error(`Failed to delete user. Please try again.`);
    }
  });

  const ActionsBody = (data) => {
    if (!data?.id) return "";
    if (profileData.email === data?.email) return "-";

    return <Button className="btn font-14 text-danger outlined-button d-flex align-items-center gap-2" onClick={() => { deleteMutation.mutate(data?.id) }}>
      Remove
      {deleteMutation?.variables === data?.id ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner> : ""}
    </Button>
  }

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
    </div>
  }

  useEffect(() => {
    setAdd(0);
  }, [visible])

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
        <DataTable scrollable scrollHeight={"350px"} className={style.userTable} value={[...users || [], ...Array.from({ length: max - state }, (_, index) => { return {} })]} showGridlines>
          <Column field="name" style={{ width: '80px' }} body={nameBody} header="Name"></Column>
          <Column field="email" style={{ width: '100px' }} body={emailBody} header="Email"></Column>
          <Column style={{ width: '210px' }} header="Actions" body={ActionsBody}></Column>
        </DataTable>
      </div>

    </Dialog>
  )
}

export default AddRemoveCompanyUser;