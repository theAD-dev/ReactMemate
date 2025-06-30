import React, { forwardRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import SupplierForm from '../../../shared/ui/supliers-ui/supplier-form';


const SupplierEdit = forwardRef(({ data, refetch, setIsPending, setIsEdit }, ref) => {
    const { id } = useParams();
    const [photo, setPhoto] = useState(null);

    const [defaultValues] = useState({
        ...data,
        industry: data?.service?.industry_id,
        service: data?.service?.id,
        addresses: data?.addresses?.filter((address) => !address?.deleted)?.map((address) => ({
            id: address?.id || "",
            title: address?.title || "",
            country: address?.country_id || "",
            state: address?.state_id || "",
            city: address?.city || "",
            address: address?.address || "",
            postcode: address?.postcode || ""
        }))
    } || null);

    if (defaultValues?.addresses?.length === 0) defaultValues.addresses.push({ title: "Main Location", country: 1 });
    if (defaultValues?.contact_persons?.length === 0) defaultValues.contact_persons.push({ deleted: false });

    const formSubmit = async (data) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("email", data.email);
        if (data.website) formData.append("website", data.website);
        if (data.abn) formData.append("abn", data.abn);
        const phoneNumber = data?.phone && parsePhoneNumberFromString(data.phone);
        if (phoneNumber?.nationalNumber) formData.append("phone", data.phone);
        formData.append("service", data.service);
        if (data.note) formData.append("note", data.note);

        data.addresses.forEach((address, index) => {
            if (address.city) {
                formData.append(`addresses[${index}]city`, address.city);
                formData.append(`addresses[${index}]title`, address.title);
                formData.append(`addresses[${index}]address`, address.address);
                formData.append(`addresses[${index}]is_main`, address.is_main);
                formData.append(`addresses[${index}]postcode`, address.postcode);
                if (address?.id) formData.append(`addresses[${index}]id`, address?.id);
            }
        });

        data.contact_persons.forEach((person, index) => {
            if (person.firstname || person.email) {
                formData.append(`contact_persons[${index}]firstname`, person.firstname);
                formData.append(`contact_persons[${index}]lastname`, person.lastname);
                formData.append(`contact_persons[${index}]email`, person.email);
                const phoneNumber = person?.phone && parsePhoneNumberFromString(person.phone);
                if (phoneNumber?.nationalNumber) formData.append(`contact_persons[${index}]phone`, person.phone);
                formData.append(`contact_persons[${index}]position`, person.position);
                formData.append(`contact_persons[${index}]is_main`, person.is_main);
                if (person?.id) formData.append(`contact_persons[${index}]id`, person?.id);
            }
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
    };

    const handleSubmit = async (data) => {
        if (id) {
            formSubmit(data);
        } else {
            toast.error('Supplier id not found');
        }
    };

    return (
        <SupplierForm photo={photo} setPhoto={setPhoto} ref={ref} onSubmit={handleSubmit} defaultValues={defaultValues} />
    );
});

export default SupplierEdit;