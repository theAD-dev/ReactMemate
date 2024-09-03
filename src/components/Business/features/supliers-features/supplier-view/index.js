import clsx from 'clsx';
import { Sidebar } from 'primereact/sidebar';
import React, { useRef, useState } from 'react';
import { Building, X } from 'react-bootstrap-icons';

import style from './supplier-view.module.scss';
import { Button } from 'react-bootstrap';
import SupplierDelete from '../supplier-delete';

const SupplierView = ({ data, closeIconRef, hide }) => {
    const formRef = useRef(null);
    const [isPending, setIsPending] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    return (
        <div className='view-details-sidebar'>
            <div className="d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '24px' }}>
                    <div className="d-flex align-items-center gap-2">
                        <div className={clsx(style.profileBox, 'd-flex align-items-center justify-content-center')}>
                            {
                                data.photo ? <img src={data.photo} alt='profile-photo' /> : <Building color='#667085' size={26} />
                            }
                        </div>
                        <span style={{ color: '344054', fontSize: '22px', fontWeight: 600 }}>{data?.name}</span>
                    </div>
                    <span>
                        <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                            <X size={24} color='#667085' />
                        </Button>
                    </span>
                </div>

                <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 105px)', overflow: 'auto' }}>
                    <div className='d-flex align-items-center justify-content-between'>
                        <h5 className={clsx(style.boxLabel)}>Supplier Details</h5>
                        <h6 className={clsx(style.boxLabel2)}>Supplier ID: {data.id}</h6>
                    </div>
                    {
                        isEdit ? "Edit"
                            : <ViewSection data={data} />
                    }
                </div>

                <div className='modal-footer d-flex align-items-center justify-content-between h-100' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)" }}>
                    <SupplierDelete />
                    {
                        isEdit ? <div className='d-flex align-items-center gap-3'>
                            <Button type='button' onClick={(e) => { e.stopPropagation(); setIsEdit(false) }} className='outline-button'>Cancel</Button>
                            <Button type='button' onClick={handleExternalSubmit} className='solid-button' style={{ minWidth: '179px' }}>{isPending ? "Loading..." : "Save Client Details"}</Button>
                        </div>
                            : <Button type='button' onClick={(e) => { e.stopPropagation(); setIsEdit(true); }} className='solid-button'>Edit</Button>
                    }
                </div>
            </div>
        </div>
    )
}

const ViewSection = () => {
    return <>View section</>
}

export default SupplierView