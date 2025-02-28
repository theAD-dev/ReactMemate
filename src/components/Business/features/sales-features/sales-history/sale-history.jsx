import React, { useState } from 'react';
import { FilePdf } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Dialog } from 'primereact/dialog';
import style from './sale-history.module.scss';
import NodataImg from "../../../../../assets/images/img/NodataImg.png";

const SaleHistory = ({ history, setHistory }) => {
    const [visible, setVisible] = useState(!!history);
    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <span className={`white-space-nowrap ${style.headerTitle}`}>History</span>
        </div>
    );

    return (
        <Dialog visible={visible} modal header={headerElement} className={`${style.modal} custom-modal`} onHide={() => setHistory(null)}>
            <div className='d-flex justify-content-start flex-wrap gap-4 align-items-center'>
                {
                    Object.entries(history).map(([key, value]) => {
                        return (
                            <div key={key} className={clsx(style.historyBox, 'd-flex align-items-center gap-1')}>
                                <FilePdf color='#667085' size={18} />
                                <Link to={value} target='_blank'>
                                    {key}
                                </Link>
                            </div>
                        );
                    })
                }

                {
                    Object.entries(history).length === 0 && (
                        <div className='d-flex justify-content-center align-items-center flex-column w-100'>
                            <img src={NodataImg} alt='no-data' />
                            <h2 className={clsx(style.title)}>No history found</h2>
                        </div>
                    )
                }
            </div>
        </Dialog>
    );
};

export default SaleHistory;