import React from 'react';
import { Download } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import style from './view-job.module.scss';
import { getFileIcon } from '../create-job/create-job';

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
                        <div key={attachment?.link} className={style.attachmentBox}>
                            <div className='d-flex align-items-center gap-2'>
                                {
                                    getFileIcon(attachment?.extension)
                                }
                                <Link to={attachment?.link} target='_blank'>
                                    <span className='text-dark ellipsis-width'>{attachment?.name}</span>
                                </Link>
                            </div>

                            <button className='border-0 p-1 bg-none' onClick={() => window.open(attachment?.link, '_blank')}>
                                <Download />
                            </button>
                        </div>
                    ))
                }
            </div>
        </Dialog>
    );
};

export default ViewAttachements;