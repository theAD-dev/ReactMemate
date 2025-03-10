import React from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import style from './job-dialog.module.scss';
import warningIcon from '../../../../assets/images/Jobs/Featured icon.svg';


export default function JobConfirmation({ visible, setVisible }) {

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <img src={warningIcon} alt="task-details" style={{ width: '48px', height: '48px' }} />
            <span className={`white-space-nowrap ${style.headerTitle}`}>Are you sure you want to stop cycle?</span>
        </div>
    );

    const footerContent = (
        <div className="d-flex justify-content-between align-items-center">
            <Button label="Stop Cycle" className="danger-button" onClick={() => setVisible(false)} autoFocus />
            <Button label="Cancel" className="outline-button" onClick={() => setVisible(false)} autoFocus />
        </div>
    );
    return (
        <Dialog visible={visible} modal header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={() => { if (!visible) return; setVisible(false); }}>
            <div className="">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 style={{ fontSize: '18px', color: '#101828', fontWeight: 600, marginBottom: '16px' }}>Job Details</h6>
                    <p className="font-14 mb-0" style={{ color: '#475467' }}>Job ID: 031-240003</p>
                </div>
                <p className="font-14 mb-1" style={{ color: '#667085' }}>Job Reference</p>
                <h6 style={{ fontSize: '16px', color: '#475467', fontWeight: 600, marginBottom: '16px' }}>Enter the detailed quote for the client contract here. Include all relevant </h6>     
            </div>
        </Dialog>

    );
}
