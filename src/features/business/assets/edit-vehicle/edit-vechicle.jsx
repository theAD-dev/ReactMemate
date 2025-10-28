import React, { forwardRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateVehicle } from '../../../../APIs/assets-api';
import VehicleForm from '../ui/vehicle-form';

const EditVehicle = forwardRef(({ vehicle, setIsEdit, refetch, setIsPending, handleExternalSubmit, setVisible, setRefetch }, ref) => {
  const updateVehicleMutation = useMutation({
    mutationFn: (data) => updateVehicle(vehicle?.id, data),
    onMutate: () => {
      setIsPending && setIsPending(true);
    },
    onSuccess: () => {
      toast.success('Vehicle updated successfully');
      setIsEdit && setIsEdit(false);
      setVisible && setVisible(false);
      setRefetch && setRefetch((prev) => !prev);
      refetch && refetch();
      setIsPending && setIsPending(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to update vehicle');
      setIsPending && setIsPending(false);
    }
  });

  function formatDateToYMD(date) {
    if (!date) return '';
    date = new Date(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleSubmit = (data) => {
    // Format the data for API
    const formattedData = {
      ...data,
      date_of_expiry: formatDateToYMD(data.date_of_expiry),
      date_of_purchase: formatDateToYMD(data.date_of_purchase),
      insurance_expiry: formatDateToYMD(data.insurance_expiry),
    };

    updateVehicleMutation.mutate(formattedData);
  };

  // Format vehicle data for form default values
  const defaultValues = vehicle ? {
    organization: vehicle.organization,
    registration_number: vehicle.registration_number || '',
    date_of_expiry: vehicle.date_of_expiry ? new Date(vehicle.date_of_expiry * 1000) : null,
    make: vehicle.make || '',
    model: vehicle.model || '',
    year_manufactured: vehicle.year_manufactured || null,
    fuel_type: vehicle.fuel_type || '',
    vin_number: vehicle.vin_number || '',
    engine_number: vehicle.engine_number || '',
    date_of_purchase: vehicle.date_of_purchase ? new Date(vehicle.date_of_purchase * 1000) : null,
    purchased_amount: vehicle.purchased_amount || null,
    odometer_km: vehicle.odometer_km || 0,
    driver: vehicle.driver || null,
    insurer: vehicle.insurer || '',
    insurance_policy_number: vehicle.insurance_policy_number || '',
    insurance_expiry: vehicle.insurance_expiry ? new Date(vehicle.insurance_expiry * 1000) : null,
    receipt_number: vehicle.receipt_number || '',
    etag: vehicle.etag || '',
    colour: vehicle.colour || '',
    body_type: vehicle.body_type || '',
    trim: vehicle.trim || '',
    disabled: vehicle.disabled || false,
    is_deleted: vehicle.is_deleted || false
  } : {};

  return (
    <VehicleForm
      ref={ref}
      vehicleId={vehicle?.id}
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      isLoading={updateVehicleMutation.isPending}
    />
  );
});

export default EditVehicle;