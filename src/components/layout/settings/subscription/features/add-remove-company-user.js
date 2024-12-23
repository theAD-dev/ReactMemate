import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Buildings } from "react-bootstrap-icons";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { useMutation } from "@tanstack/react-query";

import style from './add-remove-company-user.module.scss';
import clsx from "clsx";

const AddRemoveCompanyUser = ({ visible, setVisible }) => {
  const headerElement = (
    <div className={`${style.modalHeader}`}>
      <b className={style.iconStyle}><Buildings size={24} color="#FFD3A5" /></b>
      <span className={`white-space-nowrap ${style.headerTitle}`}>Company Users</span>
    </div>
  );

  const footerContent = (
    <div className="d-flex justify-content-end align-items-center gap-3">
      <Button type='button' className='outline-button' style={{ minWidth: '70px', borderRadius: '28px' }}>Close</Button>
      <Button type='button' className='solid-button' style={{ minWidth: '70px', borderRadius: '28px' }}>Save</Button>
    </div>
  );
  return (
    <Dialog visible={visible} modal header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={() => { if (!visible) return; setVisible(false); }}>
      <div className="d-flex gap-4">
        <div className={clsx(style.addRemoveBox)}>
          <label className={style.addRemoveBoxLabel}>Available Seats</label>
          <div className="d-flex justify-content-between">
            <h1 className={style.addRemoveBoxNumber}>10</h1>
            <div className={style.addRemoveButtonBox}>
              <div className={style.addRemoveButtonLeft}>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.75781 10C2.75781 9.65482 3.03763 9.375 3.38281 9.375H17.1328C17.478 9.375 17.7578 9.65482 17.7578 10C17.7578 10.3452 17.478 10.625 17.1328 10.625H3.38281C3.03763 10.625 2.75781 10.3452 2.75781 10Z" fill="#344054" />
                </svg>
              </div>
              <div className={style.addRemoveButtonRight}>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2578 2.5C10.603 2.5 10.8828 2.77982 10.8828 3.125V9.375H17.1328C17.478 9.375 17.7578 9.65482 17.7578 10C17.7578 10.3452 17.478 10.625 17.1328 10.625H10.8828V16.875C10.8828 17.2202 10.603 17.5 10.2578 17.5C9.91263 17.5 9.63281 17.2202 9.63281 16.875V10.625H3.38281C3.03763 10.625 2.75781 10.3452 2.75781 10C2.75781 9.65482 3.03763 9.375 3.38281 9.375H9.63281V3.125C9.63281 2.77982 9.91263 2.5 10.2578 2.5Z" fill="#344054" />
                </svg>
              </div>
            </div>
          </div>
          <label className="font-14" style={{ color: '#344054' }}>Total Seats vs Used</label>
          <div></div>
        </div>
      </div>

    </Dialog>
  )
}

export default AddRemoveCompanyUser;