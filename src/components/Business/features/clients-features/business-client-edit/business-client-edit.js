import React, { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { deleteAddress, deleteContactPerson } from '../../../../../APIs/ClientsApi';
import BusinessForm from '../new-client-create/business-form';


const BusinessClientEdit = forwardRef(({ client, refetch, setIsPending, handleExternalSubmit, setIsEdit }, ref) => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(client?.photo || null);

  const [defaultValues, setDefaultValues] = useState({
    ...client,
    category: client?.category?.id || 1,
    contact_persons: client?.contact_persons
      ?.filter((contact) => !contact?.deleted)
      .map((contact) => ({
        ...contact,
        uniqeId: contact?.id || "",
        deleted: contact?.deleted
      })),
    addresses: client?.addresses
      ?.filter((address) => !address?.deleted)
      .map((address) => ({
        id: address?.id || "",
        uniqeId: address?.id || "",
        deleted: address?.deleted,
        title: address?.title || "",
        country: address?.country_id || "",
        state: address?.state_id || "",
        city: address?.city || "",
        address: address?.address || "",
        postcode: address?.postcode || ""
      }))
  } || null);

  if (defaultValues?.addresses?.length === 0) defaultValues.addresses.push({ deleted: false });
  if (defaultValues?.contact_persons?.length === 0) defaultValues.contact_persons.push({ deleted: false });

  const businessFormSubmit = async (data) => {
    console.log('data: ', data);
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("abn", data.abn);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("website", data.website);
    formData.append("payment_terms", data.payment_terms);
    formData.append("category", data.category);
    formData.append("industry", data.industry);
    formData.append("description", data.description);

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
        formData.append(`contact_persons[${index}]phone`, person.phone);
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
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/clients/update/business/${client.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData,
      });
      if (response.ok) {
        setIsEdit(false);
        console.log('response: ', response);
        toast.success(`Client updated successfully`);
        navigate('/clients');
      } else {
        toast.error('Failed to update client. Please try again.');
      }
    } catch (err) {
      toast.error(`Failed to update client. Please try again.`);
    } finally {
      setIsPending(false);
    }
  };

  const handleSubmit = async (data) => {
    if (client.id) {
      businessFormSubmit(data);
    } else {
      toast.error('Client id not found');
    }
  };

  const deleteLocation = async (id) => {
    try {
      const response = await deleteAddress(id);
      console.log('response: ', response);

      if (response.message) {
        toast.success(`Address deleted successfully.`);
      } else {
        toast.error(`Failed to delete address. Please try again.`);
      }
    } catch (err) {
      toast.error(`Failed to delete address. Please try again.`);
    }
  };

  const deleteContact = async (id) => {
    try {
      const response = await deleteContactPerson(id);

      if (response.message) {
        toast.success(`Contact deleted successfully.`);
      } else {
        toast.error(`Failed to delete contact. Please try again.`);
      }
    } catch (err) {
      toast.error(`Failed to delete contact. Please try again.`);
    }
  };

  return (
    <BusinessForm photo={photo} setPhoto={setPhoto}
      ref={ref} onSubmit={handleSubmit}
      defaultValues={defaultValues}
      deleteAddress={deleteLocation}
      deleteContact={deleteContact}
    />
  );
});

export default BusinessClientEdit;