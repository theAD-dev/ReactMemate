import React, { forwardRef, useState } from 'react'
import SupplierForm from '../../../shared/ui/supliers-ui/supplier-form';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

const SupplierEdit = forwardRef(({ data, setIsPending }, ref) => {
    const { id } = useParams();
    const [photo, setPhoto] = useState(null);
    if (data?.addresses?.length === 0) data.addresses.push({});
    if (data?.contact_persons?.length === 0) data.contact_persons.push({});

    const [defaultValues, setDefaultValues] = useState(data || {});


    const formSubmit = async (data) => {
        console.log('data: ', data);
    }

    const handleSubmit = async (data) => {
        if (id) {
            formSubmit(data);
        } else {
            toast.error('Supplier id not found');
        }
    };

    return (
        <SupplierForm photo={photo} setPhoto={setPhoto} ref={ref} onSubmit={handleSubmit} defaultValues={defaultValues} />
    )
})

export default SupplierEdit