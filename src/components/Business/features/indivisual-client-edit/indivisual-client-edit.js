import { nanoid } from 'nanoid';
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';
import IndivisualForm from '../new-client-create/indivisual-form';

const IndivisualClientEdit = forwardRef(({ client, refetch, setIsPending, handleExternalSubmit }, ref) => {
  console.log('IndivisualClientEdit: ', client);
  const [photo, setPhoto] = useState(null);
  const [defaultValues, setDefaultValues] = useState({
    firstname: client?.name?.split(" ")?.[0] || "",
    lastname: client?.name?.split(" ")?.[1] || "",
    email: client?.email,
    phone: client?.phone,
    description: client?.description,
    address: {
      title: client.addresses?.[0].title || "",
      country: client.addresses?.[0].country_code === "AU" ? 1 : "",
      state: 8 || client.addresses?.[0].state || "",
      city: client.addresses?.[0].city || "",
      address: client.addresses?.[0].address || "",
      postcode: client.addresses?.[0].postcode || ""
    }
  });

  const indivisualFormSubmit = async (data) => {
    console.log('indivisualFormSubmit: ', data);
    const formData = new FormData();

    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("description", data.description);

    formData.append("address.country", data.address.country);
    formData.append("address.title", data.address.title);
    formData.append("address.city", data.address.city);
    formData.append("address.address", data.address.address);
    formData.append("address.state", data.address.state);
    formData.append("address.postcode", data.address.postcode);

    if (photo?.croppedImageBlob) {
      const photoHintId = nanoid(6);
      formData.append('photo', photo?.croppedImageBlob, `${photoHintId}.jpg`);
    }

    try {
      setIsPending(true);
      const accessToken = sessionStorage.getItem("access_token");
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/clients/update/individual/${client.id}/`, {
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
      setIsPending(false);
    }
  }

  const handleSubmit = async (data) => {
    if(client.id) {
      indivisualFormSubmit(data);
    } else {
      toast.error('Client id not found');
    }
  };

  return (
    <IndivisualForm photo={photo} setPhoto={setPhoto} ref={ref} onSubmit={handleSubmit} defaultValues={defaultValues} />
  )
})

export default IndivisualClientEdit