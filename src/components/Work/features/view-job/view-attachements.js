import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import style from './view-job.module.scss';

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
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M9.29289 0H4C2.89543 0 2 0.895431 2 2V14C2 15.1046 2.89543 16 4 16H12C13.1046 16 14 15.1046 14 14V4.70711C14 4.44189 13.8946 4.18754 13.7071 4L10 0.292893C9.81246 0.105357 9.55811 0 9.29289 0ZM9.5 3.5V1.5L12.5 4.5H10.5C9.94772 4.5 9.5 4.05228 9.5 3.5ZM11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8ZM13 13.7553V14C13 14.5523 12.5523 15 12 15H4C3.44772 15 3 14.5523 3 14V13.7554C3 13.7554 4 12 8 12C12 12 13 13.7553 13 13.7553Z" fill="#667085" />
                                </svg>
                                <Link to={attachment?.link} target='_blank'>
                                    <span className='text-dark'>{attachment?.name}</span>
                                </Link>
                            </div>

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
    );
};

export default ViewAttachements;