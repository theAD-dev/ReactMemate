import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { PlusCircle, X } from 'react-bootstrap-icons';
import { nanoid } from 'nanoid';
import { Sidebar } from 'primereact/sidebar';
import { toast } from 'sonner';
import styles from './supplier-create.module.scss';
import SupplierForm from '../../../shared/ui/supliers-ui/supplier-form';


const SupplierCreate = ({ visible, setVisible, refetch }) => {
  const formRef = useRef(null);
  const [isPending, setIsPending] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [defaultValues, setDefaultValues] = useState({
    contact_persons: [{}],
    addresses: [{
      country: 1
    }],
  });

  const FormSubmit = async (data) => {
    console.log('data: ', data);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("website", data.website);
    formData.append("abn", data.abn);
    formData.append("phone", data.phone);
    formData.append("services", data.services);
    formData.append("note", data.note);

    data.addresses.forEach((address, index) => {
      formData.append(`addresses[${index}]address`, address.address);
      formData.append(`addresses[${index}]city`, address.city);
      formData.append(`addresses[${index}]postcode`, address.postcode);
      formData.append(`addresses[${index}]is_main`, address.is_main);
      formData.append(`addresses[${index}]title`, address.title);
    });

    data.contact_persons.forEach((person, index) => {
      formData.append(`contact_persons[${index}]firstname`, person.firstname);
      formData.append(`contact_persons[${index}]lastname`, person.lastname);
      formData.append(`contact_persons[${index}]email`, person.email);
      formData.append(`contact_persons[${index}]phone`, person.phone);
      formData.append(`contact_persons[${index}]position`, person.position);
      formData.append(`contact_persons[${index}]is_main`, person.is_main);
    });

    if (photo?.croppedImageBlob) {
      const photoHintId = nanoid(6);
      formData.append('photo', photo?.croppedImageBlob, `${photoHintId}.jpg`);
    }

    try {
      setIsPending(true);
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/suppliers/new/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData,
      });
      if (response.ok) {
        console.log('response: ', response);
        toast.success(`New supplier created successfully`);
        setVisible(false);
        refetch((prev) => !prev);
      } else {
        toast.error('Failed to create new supplier. Please try again.');
      }
    } catch (err) {
      toast.error(`Failed to create new supplier. Please try again.`);
    } finally {
      setIsPending(false);
    }
  };

  const handleSubmit = async (data) => {
    console.log('data: ', data);
    FormSubmit(data);
  };

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  useEffect(() => {
    if (!visible) setPhoto(null);
  }, [visible]);
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
            <Button type='button' onClick={(e) => { e.stopPropagation(); setVisible(false); }} className='outline-button'>Cancel</Button>
            <Button type='button' disabled={isPending} onClick={handleExternalSubmit} className='solid-button' style={{ minWidth: '75px' }}>{isPending ? "Loading..." : "Save"}</Button>
          </div>
        </div>
      )}
    ></Sidebar>
  );
};

export default SupplierCreate;