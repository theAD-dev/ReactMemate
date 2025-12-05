import React from 'react';
import { X } from 'react-bootstrap-icons';
import { ProgressSpinner } from 'primereact/progressspinner';
import styles from './cancel-project.module.scss';

const CancelProject = ({ show, onClose, onConfirm, isLoading }) => {
    if (!show) return null;

    return (
        <div className={styles.cancelProjectContainer}>
            <div className='d-flex align-items-end'>
                <div className='me-2'>
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="9" y="9" width="20" height="20" rx="10" fill="white" />
                        <g opacity="0.3">
                            <rect x="6" y="6" width="26" height="26" rx="13" stroke="#D92D20" strokeWidth="2" />
                        </g>
                        <g opacity="0.1">
                            <rect x="1" y="1" width="36" height="36" rx="18" stroke="#D92D20" strokeWidth="2" />
                        </g>
                        <g clipPath="url(#clip0_3922_546259)">
                            <path d="M18.9998 15.6665V18.9998M18.9998 22.3332H19.0082M27.3332 18.9998C27.3332 23.6022 23.6022 27.3332 18.9998 27.3332C14.3975 27.3332 10.6665 23.6022 10.6665 18.9998C10.6665 14.3975 14.3975 10.6665 18.9998 10.6665C23.6022 10.6665 27.3332 14.3975 27.3332 18.9998Z" stroke="#D92D20" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_3922_546259">
                                <rect width="20" height="20" fill="white" transform="translate(9 9)" />
                            </clipPath>
                        </defs>
                    </svg>

                </div>
                <h1 className={styles.cancelProjectTitle}>Cancel Project?</h1>
                <button 
                    className='ms-auto mb-3'
                    onClick={onClose}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                    <X size={24} className={styles.cancelProjectCloseIcon} />
                </button>
            </div>

            <div className={styles.cancelProjectDescription}>
                <p className={styles.cancelProjectDescriptionText}>This will cancel the project and permanently delete the linked invoice.</p>
                <p className={styles.cancelProjectDescriptionText}>Are you sure you want to proceed?</p>
            </div>

            <div className={styles.cancelProjectActions}>
                <button 
                    className={styles.cancelProjectButton}
                    onClick={onConfirm}
                    disabled={isLoading}
                    style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
                >
                    Cancel Project
                    {isLoading && <ProgressSpinner style={{ width: '14px', height: '14px', marginLeft: '8px', position: 'relative', top: '2px' }} />}
                </button>
            </div>
        </div>
    );
};

export default CancelProject;