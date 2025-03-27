
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { PencilSquare, PlusCircle } from 'react-bootstrap-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import * as yup from 'yup';
import { getCities, getCountries, getStates } from '../../../../../APIs/ClientsApi';
import { createLocation, deleteLocation, updateLocation } from '../../../../../APIs/location-api';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import style from '../location.module.scss';

const schema = yup
    .object({
        name: yup.string().required('Name is required'),
        country: yup.string().required('Country is required'),
        address: yup.string().required('Address is required'),
        city: yup.number().typeError("City must be a number").required("City is required"),
        state: yup.number().typeError("State must be a number").required("State is required"),
        postcode: yup.string().required('Postcode is required')
    })
    .required();

const CreateLocation = ({ visible, setVisible, defaultValues = {}, id = null, refetch, refetch2, fallbackLocation }) => {
    const [countryId, setCountryId] = useState('');
    const [stateId, setStateId] = useState('');
    const countriesQuery = useQuery({ queryKey: ['countries'], queryFn: getCountries, enabled: true });
    const statesQuery = useQuery({ queryKey: ['states', countryId], queryFn: () => getStates(countryId), enabled: !!countryId, retry: 1 });
    const citiesQuery = useQuery({ queryKey: ['cities', stateId], queryFn: () => getCities(stateId), enabled: !!stateId });

    const { control, register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });
    const handleClose = () => {
        setVisible(false);
        setCountryId("");
        setStateId("");
        reset();
        setValue('country', '');
        setValue('state', '');
        setValue('city', '');
    };
    const mutation = useMutation({
        mutationFn: (data) => id ? updateLocation(id, data) : createLocation(data),
        onSuccess: () => {
            refetch();
            refetch2();
            handleClose();
            toast.success(`Location created successfully.`);
            setCountryId("");
            setStateId("");
            reset();
            setValue('country', '');
            setValue('state', '');
            setValue('city', '');
        },
        onError: (error) => {
            console.error('Error creating location:', error);
            toast.error(`Failed to create location. Please try again.`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteLocation(id),
        onSuccess: () => {
            refetch();
            fallbackLocation();
            handleClose();
            toast.success(`Location deleted successfully`);
            setCountryId("");
            setStateId("");
            reset();
            setValue('country', '');
            setValue('state', '');
            setValue('city', '');
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to delete location. Please try again.`);
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    useEffect(() => {
        if (defaultValues) {
            Object.keys(defaultValues).forEach(key => {
                setValue(key, defaultValues[key]);
            });

            if (defaultValues?.country) setCountryId(defaultValues?.country);
            if (defaultValues?.state) setStateId(defaultValues?.state);
        }
    }, [defaultValues]);

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <div className={style.circledesignstyle}>
                    <div className={style.out}>
                        {defaultValues
                            ? <PencilSquare size={24} color="#17B26A" className='mb-0' />
                            : <PlusCircle size={24} color="#17B26A" className='mb-0' />
                        }
                    </div>
                </div>
                <span className={`white-space-nowrap ${style.headerTitle}`}>
                    {defaultValues ? 'Edit' : 'Add'} Location
                </span>
            </div>
        </div>
    );
    const footerContent = (
        <div className='d-flex justify-content-between'>
            {id
                ? <Button disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate()} className='danger-outline-button' >
                    Delete
                    {deleteMutation.isPending && (<ProgressSpinner style={{ width: '20px', height: '20px' }} />)}
                </Button>
                : <span></span>
            }
            <div className='d-flex justify-content-end gap-2'>
                <Button className='outline-button' onClick={handleClose}>Cancel</Button>
                <Button type='submit' disabled={mutation?.isPending} onClick={handleSubmit(onSubmit)} className='solid-button'>
                    {id ? "Update" : "Save"} Details
                    {mutation?.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                </Button>
            </div>
        </div>
    );

    return (
        <Dialog visible={visible} modal={true} header={headerElement} footer={footerContent} className={`${style.modal} custom-modal`} onHide={handleClose}>
            <div className="d-flex flex-column">
                <form onSubmit={handleSubmit(onSubmit)} >
                    <Row>
                        <Col sm={6}>
                            <div className="d-flex flex-column gap-1 mb-4">
                                <label className={clsx(style.lable)}>Location Name</label>
                                <IconField>
                                    <InputIcon>{errors?.name && <img src={exclamationCircle} alt='error' className='mb-3' />}</InputIcon>
                                    <InputText {...register("name")} className={clsx(style.inputText, "outline-none", { [style.error]: errors?.name })} placeholder='Enter location name' />
                                </IconField>
                                {errors?.name && <p className="error-message">{errors?.name?.message}</p>}
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="d-flex flex-column gap-1 mb-4">
                                <label className={clsx(style.lable)}>Country</label>
                                <Controller
                                    name="country"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Dropdown
                                            {...field}
                                            options={(countriesQuery && countriesQuery.data?.map((country) => ({
                                                value: country.id,
                                                label: country.name
                                            }))) || []}
                                            onChange={(e) => {
                                                field.onChange(e.value);
                                                setCountryId(e.value);
                                            }}
                                            className={clsx(style.dropdownSelect, 'dropdown-height-fixed', "outline-none")}
                                            style={{ height: '46px' }}
                                            value={field.value}
                                            loading={countriesQuery?.isFetching}
                                            placeholder="Select a country"
                                        />
                                    )}
                                />
                                {errors?.country && <p className="error-message">{errors?.country?.message}</p>}
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="d-flex flex-column gap-1 mb-4">
                                <label className={clsx(style.lable)}>State</label>
                                <Controller
                                    name="state"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Dropdown
                                            {...field}
                                            options={(statesQuery && statesQuery.data?.map((state) => ({
                                                value: state.id,
                                                label: state.name
                                            }))) || []}
                                            onChange={(e) => {
                                                field.onChange(e.value);
                                                setStateId(e.value);
                                            }}
                                            className={clsx(style.dropdownSelect, 'dropdown-height-fixed', "outline-none")}
                                            style={{ height: '46px' }}
                                            value={field.value}
                                            loading={statesQuery?.isFetching}
                                            placeholder={"Select a state"}
                                            filter
                                        />
                                    )}
                                />
                                {errors?.state && <p className="error-message">{errors?.state?.message}</p>}
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="d-flex flex-column gap-1 mb-4">
                                <label className={clsx(style.lable)}>City/Suburb</label>
                                <Controller
                                    name="city"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Dropdown
                                            {...field}
                                            options={(citiesQuery && citiesQuery.data?.map((city) => ({
                                                value: city.id,
                                                label: city.name
                                            }))) || []}
                                            onChange={(e) => {
                                                field.onChange(e.value);
                                            }}
                                            className={clsx(style.dropdownSelect, 'dropdown-height-fixed', "outline-none")}
                                            style={{ height: '46px' }}
                                            value={field.value}
                                            loading={citiesQuery?.isFetching}
                                            placeholder={"Select a city"}
                                            filter
                                        />
                                    )}
                                />
                                {errors?.city && <p className="error-message">{errors?.city?.message}</p>}
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="d-flex flex-column gap-1">
                                <label className={clsx(style.lable)}>Street Address</label>
                                <IconField>
                                    <InputIcon>{errors?.address && <img src={exclamationCircle} alt='error' className='mb-3' />}</InputIcon>
                                    <InputText {...register("address")} className={clsx(style.inputText, "outline-none", { [style.error]: errors?.address })} placeholder='Enter street address' />
                                </IconField>
                                {errors?.address && <p className="error-message">{errors?.address?.message}</p>}
                            </div>
                        </Col>

                        <Col sm={6}>
                            <div className="d-flex flex-column gap-1">
                                <label className={clsx(style.lable)}>Postcode</label>
                                <IconField>
                                    <InputIcon>{errors?.postcode && <img src={exclamationCircle} alt='error' className='mb-3' />}</InputIcon>
                                    <InputText {...register("postcode")} keyfilter="int" className={clsx(style.inputText, "outline-none", { [style.error]: errors?.postcode })} placeholder='Enter postcode' />
                                </IconField>
                                {errors?.postcode && <p className="error-message">{errors?.postcode?.message}</p>}
                            </div>
                        </Col>
                    </Row>
                </form>
            </div>
        </Dialog>
    );
};

export default CreateLocation;