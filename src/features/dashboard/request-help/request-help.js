import React from 'react';
import { QuestionCircle } from 'react-bootstrap-icons';
import { InlineWidget } from "react-calendly";
import { Dialog } from 'primereact/dialog';
import style from './request-help.module.scss';
import { useAuth } from '../../../app/providers/auth-provider';

const headerElement = (
    <div className={`${style.modalHeader}`}>
        <div className="w-100 d-flex align-items-center gap-2">
            <b className={style.iconStyle}><QuestionCircle size={24} color="#079455" /></b>
            <span className={`white-space-nowrap mt-2 mb-2 ${style.headerTitle}`}>
                Need help with this?
            </span>
        </div>
    </div>
);

const RequestHelp = ({ visible, setVisible }) => {
    const { session } = useAuth();
    return (
        <Dialog header={headerElement} visible={visible} onHide={() => setVisible(false)} className={`${style.modal} custom-modal`}>
            <InlineWidget
                url="https://calendly.com/memate-support/30min"
                styles={{
                    width: '100%',
                    border: '1px solid #f2f2f2',
                    height: '500px'
                }}
                prefill={{
                    name: `${session?.full_name}`,
                    email: session?.email,
                }}
                pageSettings={{
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: '#1D2939',
                    textColor: '#667085'
                }}
            />
        </Dialog>
    );
};

export default RequestHelp;