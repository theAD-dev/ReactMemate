import React from 'react';
import { Button } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';
import { Skeleton } from 'primereact/skeleton';

const SupplierLoadingSidebar = ({ closeIconRef, hide }) => {
    return (
        <div className='loading-details-sidebar'>
            <div className="d-flex flex-column">
                <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '24px' }}>
                    <div className="d-flex align-items-center gap-2">
                        <div className='d-flex align-items-center justify-content-center' style={{ borderRadius: "var(--radius-xs, 4px)", border: '1px solid #dedede', width: '56px', height: '56px', overflow: 'hidden' }}>
                            <Skeleton size="3.5rem"></Skeleton>
                        </div>
                        <Skeleton height="2rem" width='20rem' className="mb-2"></Skeleton>
                    </div>
                    <span>
                        <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                            <X size={24} color='#667085' />
                        </Button>
                    </span>
                </div>

                <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 122px)', overflow: 'auto' }}>
                    <div className='d-flex align-items-center justify-content-between'>
                        <Skeleton height="1.5rem" width='10rem' className="mb-2"></Skeleton>
                        <Skeleton height="1.5rem" width='10rem' className="mb-2"></Skeleton>
                    </div>

                    <Skeleton width="100%" className="mb-4" height="150px"></Skeleton>

                    <Skeleton height="1rem" className="mb-2 w-50"></Skeleton>
                    <Skeleton width="100%" className="mb-4" height="150px"></Skeleton>

                    <Skeleton height="1rem" className="mb-2 w-50"></Skeleton>
                    <Skeleton width="100%" className="mb-4" height="150px"></Skeleton>

                    <Skeleton height="1rem" className="mb-2 w-50"></Skeleton>
                    <Skeleton width="100%" className="mb-4" height="150px"></Skeleton>
                </div>

                <div className='modal-footer d-flex align-items-center justify-content-between h-100' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)" }}>
                    <Skeleton width="4rem" height="3rem"></Skeleton>
                    <div className='d-flex align-items-center gap-3'>
                        <Skeleton width="6rem" height="3rem"></Skeleton>
                        <Skeleton width="6rem" height="3rem"></Skeleton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierLoadingSidebar;