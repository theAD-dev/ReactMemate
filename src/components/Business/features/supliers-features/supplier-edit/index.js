import React, { forwardRef, useState } from 'react'
import SupplierForm from '../../../shared/ui/supliers-ui/supplier-form';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

const SupplierEdit = forwardRef(({ data, refetch, setIsPending, setIsEdit }, ref) => {
    const { id } = useParams();
    const [photo, setPhoto] = useState(null);
    if (data?.addresses?.length === 0) data.addresses.push({});
    if (data?.contact_persons?.length === 0) data.contact_persons.push({});

    const [defaultValues, setDefaultValues] = useState({
        ...data,
        addresses: data?.addresses?.map((address) => ({
            id: address?.id || "",
            country: address?.country_id || "",
            state: address?.state_id || "",
            city: address?.city || "",
            address: address?.address || "",
            postcode: address?.postcode || ""
        }))
    } || null);

    const formSubmit = async (data) => {
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
            formData.append(`addresses[${index}]city`, address.city);
            formData.append(`addresses[${index}]title`, address.title);
            formData.append(`addresses[${index}]address`, address.address);
            formData.append(`addresses[${index}]is_main`, address.is_main);
            formData.append(`addresses[${index}]postcode`, address.postcode);
            if (address?.id) formData.append(`addresses[${index}]id`, address?.id);
        });

        data.contact_persons.forEach((person, index) => {
            formData.append(`contact_persons[${index}]firstname`, person.firstname);
            formData.append(`contact_persons[${index}]lastname`, person.lastname);
            formData.append(`contact_persons[${index}]email`, person.email);
            formData.append(`contact_persons[${index}]phone`, person.phone);
            formData.append(`contact_persons[${index}]position`, person.position);
            formData.append(`contact_persons[${index}]is_main`, person.is_main);
            if (person?.id) formData.append(`contact_persons[${index}]id`, person?.id);
        });

        if (photo?.croppedImageBlob) {
            const photoHintId = nanoid(6);
            formData.append('photo', photo?.croppedImageBlob, `${photoHintId}.jpg`);
        }

        try {
            setIsPending(true);
            const accessToken = localStorage.getItem("access_token");
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/suppliers/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData,
            });
            if (response.ok) {
                refetch();
                setIsEdit(false);
                console.log('response: ', response);
                toast.success(`Supplier updated successfully`);
            } else {
                toast.error('Failed to update supplier. Please try again.');
            }
        } catch (err) {
            toast.error(`Failed to update supplier. Please try again.`);
        } finally {
            setIsPending(false);
        }
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