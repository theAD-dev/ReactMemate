import React, { forwardRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateVehicle } from '../../../../APIs/assets-api';
import VehicleForm from '../ui/vehicle-form';

const EditVehicle = forwardRef(({ vehicle, setIsEdit, refetch, setIsPending, handleExternalSubmit, setVisible, setRefetch }, ref) => {
  const queryClient = useQueryClient();

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

  const handleSubmit = (data) => {
    // Format the data for API
    const formattedData = {
      ...data,
      date_of_expiry: data.date_of_expiry ? new Date(data.date_of_expiry).toISOString().split('T')[0] : null,
      date_of_purchase: data.date_of_purchase ? new Date(data.date_of_purchase).toISOString().split('T')[0] : null,
      insurance_expiry: data.insurance_expiry ? new Date(data.insurance_expiry).toISOString().split('T')[0] : null,
    };

    updateVehicleMutation.mutate(formattedData);
  };

  // Format vehicle data for form default values
  const defaultValues = vehicle ? {
    organization: vehicle.organization,
    registration_number: vehicle.registration_number || '',
    date_of_expiry: vehicle.date_of_expiry || null,
    make: vehicle.make || '',
    model: vehicle.model || '',
    year_manufactured: vehicle.year_manufactured || null,
    fuel_type: vehicle.fuel_type || '',
    vin_number: vehicle.vin_number || '',
    engine_number: vehicle.engine_number || '',
    date_of_purchase: vehicle.date_of_purchase || null,
    purchased_amount: vehicle.purchased_amount || null,
    odometer_km: vehicle.odometer_km || 0,
    driver: vehicle.driver || null,
    insurer: vehicle.insurer || '',
    insurance_policy_number: vehicle.insurance_policy_number || '',
    insurance_expiry: vehicle.insurance_expiry || null,
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
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      isLoading={updateVehicleMutation.isPending}
    />
  );
});

export default EditVehicle;