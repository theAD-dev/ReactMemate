import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import style from './job-dialog.module.scss';
import { Chip } from "primereact/chip";
import JobConfirmation from "./job-confirmation-dialog";

export default function JobDetails({ visible, setVisible, JobDetails}) {
    const [confirmation, setConfirmation] = useState(false);

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <img src="/static/media/task-details.6c24fdfe452b19f485da192519e9cbe3.svg" alt="task-details" style={{ width: '48px', height: '48px' }} />
            <span className={`white-space-nowrap ${style.headerTitle}`}>Job Details</span>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Stop Cycle" className="danger-button" onClick={() => setConfirmation(true)} autoFocus />
        </div>
    );
    return (
        <>
            <Dialog visible={visible} modal={false} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={() => { if (!visible) return; setVisible(false); }}>
                <div className="">
                    <p className="font-14 mb-1" style={{ color: '#667085' }}>Repeat</p>
                    <h6 className="font-16" style={{ color: '#101828', fontWeight: 600, marginBottom: '16px' }}>Every Week</h6>
                    <p className="font-14 mb-1" style={{ color: '#667085' }}>Repeat on</p>
                    <div className={`d-flex ${style.weekNames}`}>
                        <Chip className={`status ${style.weekName}`} label={'Monday'} />
                        <Chip className={`status ${style.weekName}`} label={'Wednesday'} />
                        <Chip className={`status ${style.weekName}`} label={'Thursday'} />
                    </div>
                    <div className="d-flex">
                        <div style={{ width: '280px' }}>
                            <p className="font-14 mb-1" style={{ color: '#667085' }}>Starts</p>
                            <p className="font-16 mb-0" style={{ color: '#101828', fontWeight: 600 }}>12 Jul 2025</p>
                        </div>
                        <div style={{ width: '280px' }}>
                            <p className="font-14 mb-1" style={{ color: '#667085' }}>Ends</p>
                            <p className="font-16 mb-0" style={{ color: '#101828', fontWeight: 600 }}>12 Jul 2025</p>
                        </div>
                    </div>
                </div>
            </Dialog>
            <JobConfirmation visible={confirmation} setVisible={setConfirmation} />
        </>
    )
}
