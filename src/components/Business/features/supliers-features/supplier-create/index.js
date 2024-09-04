import clsx from 'clsx';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import React, { useEffect, useRef, useState } from 'react'
import { Sidebar } from 'primereact/sidebar';
import { Button, Col, Row } from 'react-bootstrap';
import { Building, BuildingAdd, PersonAdd, PlusCircle, StarFill, Trash, X } from 'react-bootstrap-icons';

import styles from './supplier-create.module.scss';
import SupplierForm from '../../../shared/ui/supliers-ui/supplier-form';

const SupplierCreate = ({ visible, setVisible }) => {
  const formRef = useRef(null);
  const [isPending, setIsPending] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [defaultValues, setDefaultValues] = useState({
    contact_persons: [{}],
    addresses: [{}],
  });

  const handleSubmit = async (data) => {
    console.log('data: ', data);

  };

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  useEffect(() => {
    if (!visible) setPhoto(null);
  }, [visible])
  return (
    <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} modal={false} dismissable={false} style={{ width: '702px' }}
      content={({ closeIconRef, hide }) => (
        <div className='create-sidebar d-flex flex-column'>
          <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '24px' }}>
            <div className="d-flex align-items-center gap-2">
              <div className={styles.circledesignstyle}>
                <div className={styles.out}>
                  <PlusCircle size={24} color="#17B26A" />
                </div>
              </div>
              <span style={{ color: '344054', fontSize: '20px', fontWeight: 600 }}>Create new Supplier</span>
            </div>
            <span>
              <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                <X size={24} color='#667085' />
              </Button>
            </span>
          </div>

          <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 105px)', overflow: 'auto' }}>
            <SupplierForm photo={photo} setPhoto={setPhoto} ref={formRef} onSubmit={handleSubmit} defaultValues={defaultValues} />
          </div>

          <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
            <Button type='button' onClick={(e) => { e.stopPropagation(); setVisible(false) }} className='outline-button'>Cancel</Button>
            <Button type='button' onClick={handleExternalSubmit} className='solid-button' style={{ minWidth: '75px' }}>{isPending ? "Loading..." : "Save"}</Button>
          </div>
        </div>
      )}
    ></Sidebar>
  )
}

export default SupplierCreate