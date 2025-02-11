import { nanoid } from 'nanoid';
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';
import IndivisualForm from '../new-client-create/indivisual-form';
import { createFormData, handleApiRequest } from '../../../actions/indivisual-client-actions';
import { useNavigate } from 'react-router-dom';

const IndivisualClientEdit = forwardRef(({ client, refetch, setIsPending, handleExternalSubmit, setIsEdit }, ref) => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(client?.photo || null);
  const [defaultValues, setDefaultValues] = useState({
    firstname: client?.name?.split(" ")?.[0] || "",
    lastname: client?.name?.split(" ")?.[1] || "",
    email: client?.email,
    phone: client?.phone,
    
    category: client?.category?.id || 1,
    payment_terms: client?.payment_terms,

    description: client?.description,
    address: {
      id: client.addresses?.[0]?.id || "",
      title: client.addresses?.[0]?.title || "",
      country: client.addresses?.[0]?.country_id || "",
      state: client.addresses?.[0]?.state_id || "",
      city: client.addresses?.[0]?.city || "",
      address: client.addresses?.[0]?.address || "",
      postcode: client.addresses?.[0]?.postcode || ""
    }
  });

  const indivisualFormSubmit = async (data) => {
    console.log('indivisualFormSubmit: ', data);
    const formData = createFormData(data, photo);
    const onSuccess = (response) => {
      setIsEdit(false);
      console.log('response: ', response);
      toast.success(`Client updated successfully`);
      navigate('/clients');
    };
    const onError = () => {
      toast.error('Failed to update client. Please try again.');
    };

    setIsPending(true);
    await handleApiRequest(
      `${process.env.REACT_APP_BACKEND_API_URL}/clients/update/individual/${client.id}/`,
      'PUT',
      formData,
      onSuccess,
      onError
    );
    setIsPending(false);
  }

  const handleSubmit = async (data) => {
    if (client.id) {
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