import { nanoid } from 'nanoid';
import React, { forwardRef, useEffect, useState } from 'react';
import { toast } from 'sonner';
import BusinessForm from '../new-client-create/business-form';


const BusinessClientEdit = forwardRef(({ client, refetch, setIsPending, handleExternalSubmit }, ref) => {
  console.log('BusinessClientEdit: ', client);
  const [photo, setPhoto] = useState(client?.photo || null);
  if (client?.addresses?.length === 0) client.addresses.push({});
  
  const [defaultValues, setDefaultValues] = useState(client)

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
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/clients/update/business/${client.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData,
      });
      if (response.ok) {
        refetch();
        console.log('response: ', response);
        toast.success(`Client updated successfully`);
      } else {
        toast.error('Failed to update client. Please try again.');
      }
    } catch (err) {
      toast.error(`Failed to update client. Please try again.`);
    } finally {
    }
  }

  const handleSubmit = async (data) => {
    if (client.id) {
      businessFormSubmit(data);
    } else {
      toast.error('Client id not found');
    }
  };
  return (
    <BusinessForm photo={photo} setPhoto={setPhoto} ref={ref} onSubmit={handleSubmit} defaultValues={defaultValues}/>
  )
})

export default BusinessClientEdit