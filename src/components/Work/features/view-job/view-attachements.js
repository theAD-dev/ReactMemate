import React from 'react'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import style from './view-job.module.scss';
import { InfoCircle } from "react-bootstrap-icons";

const ViewAttachements = ({ show, setShow, attachments }) => {
    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <span className={`white-space-nowrap ${style.headerTitle}`}>Documents</span>
        </div>
    );
    const footerContent = (
        <div className='d-flex justify-content-center'>
            <Button className='outline-button' onClick={() => setShow(false)} style={{ borderRadius: '30px' }}>Close</Button>
        </div>
    );
    return (
        <Dialog visible={show} modal={false} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={() => { if (!show) return; setShow(false); }}>
            <div className='d-flex flex-wrap gap-2'>
                {
                    attachments?.map((attachment) => (
                        <div className={style.attachmentBox}>
                            {attachment?.name}
                            <button className='border-0 p-0 bg-none'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M9.5 13C9.5 13.8284 8.82843 14.5 8 14.5C7.17157 14.5 6.5 13.8284 6.5 13C6.5 12.1716 7.17157 11.5 8 11.5C8.82843 11.5 9.5 12.1716 9.5 13ZM9.5 8C9.5 8.82843 8.82843 9.5 8 9.5C7.17157 9.5 6.5 8.82843 6.5 8C6.5 7.17157 7.17157 6.5 8 6.5C8.82843 6.5 9.5 7.17157 9.5 8ZM9.5 3C9.5 3.82843 8.82843 4.5 8 4.5C7.17157 4.5 6.5 3.82843 6.5 3C6.5 2.17157 7.17157 1.5 8 1.5C8.82843 1.5 9.5 2.17157 9.5 3Z" fill="#344054" />
                                </svg>
                            </button>
                        </div>
                    ))
                }
            </div>
        </Dialog>
    )
}

export default ViewAttachements