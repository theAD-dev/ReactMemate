import React from 'react';
import { ExclamationOctagon } from 'react-bootstrap-icons';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import style from './skip-setup.module.scss';

const SkipSetup = ({ visible, setVisible, progress }) => {
    const handleSkipSetup = () => {
        localStorage.setItem('skipSetup', true);
        setVisible(false);
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="w-100 d-flex align-items-center gap-2">
                <b className={style.iconStyle}><ExclamationOctagon size={24} color="#F04438" /></b>
                <span className={`white-space-nowrap mt-2 mb-2 ${style.headerTitle}`}>
                    Skip setup for now?
                </span>
            </div>
        </div>
    );

    const footerContent = (
        <div className='d-flex justify-content-end gap-2'>
            <Button className='outline-button' onClick={() => setVisible(false)}>Cancel</Button>
            <Button className='solid-button' onClick={handleSkipSetup}>Skip</Button>
        </div>
    );
    return (
        <Dialog header={headerElement} visible={visible} onHide={() => setVisible(false)} footer={footerContent} className={`${style.modal} custom-modal`}>
            <div className='d-flex flex-column align-items-center'>
                <h1 className={style.DialogTitle}>You've completed 60% of your setup.</h1>
                <div style={{ width: '374px', height: 12, background: '#EAECF0', borderRadius: 17, overflow: 'hidden', position: 'relative', margin: '15px 0px' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: 'linear-gradient(to right, #4db8ff, #ffaa40)', borderRadius: 4, transition: 'width 0.3s' }}></div>
                </div>
                <p className={style.skipSetupText}>You can finish these steps later from your<br /> dashboard.</p>
            </div>
        </Dialog>
    );
};

export default SkipSetup;