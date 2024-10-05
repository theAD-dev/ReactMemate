
import clsx from 'clsx';
import style from '../location.module.scss';
import { PencilSquare, Plus, PlusCircle } from 'react-bootstrap-icons';
import React, { forwardRef, useEffect, useState } from 'react'
import { InputText } from "primereact/inputtext";
import { Col, Row } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getCities, getCountries, getStates } from '../../../../../APIs/ClientsApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createLocation } from '../../../../../APIs/location-api';

const schema = yup
    .object({
        title: yup.string().required('Title is required'),
        country: yup.string().required('Country is required'),
        address: yup.string().required('Address is required'),
        city: yup.number().typeError("City must be a number").required("City is required"),
        state: yup.number().typeError("State must be a number").required("State is required"),
        postcode: yup.string().required('Postcode is required')
    })
    .required();

const CreateLocation = ({ visible, setVisible, defaultValues = null, id }) => {
    const [countryId, setCountryId] = useState('');
    const [stateId, setStateId] = useState('');
    const countriesQuery = useQuery({ queryKey: ['countries'], queryFn: getCountries, enabled: true });
    const statesQuery = useQuery({ queryKey: ['states', countryId], queryFn: () => getStates(countryId), enabled: !!countryId, retry: 1 });
    const citiesQuery = useQuery({ queryKey: ['cities', stateId], queryFn: () => getCities(stateId), enabled: !!stateId });

    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });
    const handleClose = () => setVisible(false);
    const mutation = useMutation({
        mutationFn: (data) => createLocation(data),
        onSuccess: (response) => {
            // refetch();
            handleClose();
            toast.success(`Location created successfully.`);
        },
        onError: (error) => {
            console.error('Error creating location:', error);
            toast.error(`Failed to create location. Please try again.`);
        }
    });

    const onSubmit = (data) => {
        console.log(data);
        // Handle your save logic here
    };

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
            <Button className='danger-outline-button'>Delete</Button>
            <div className='d-flex justify-content-end gap-2'>
                <Button className='outline-button' >Cancel</Button>
                <Button type='submit' onClick={handleSubmit(onSubmit)} className='solid-button' style={{ width: '132px' }} >Save Details</Button>
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
                                    <InputIcon>{errors?.title && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                                    <InputText {...register("title")} className={clsx(style.inputText, "outline-none", { [style.error]: errors?.title })} placeholder='Enter location name' />
                                </IconField>
                                {errors?.title && <p className="error-message">{errors?.title?.message}</p>}
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
                                    <InputIcon>{errors?.address && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                                    <InputText {...register("address")} className={clsx(style.inputText, "outline-none", { [style.error]: errors?.address })} placeholder='Enter street address' />
                                </IconField>
                                {errors?.address && <p className="error-message">{errors?.address?.message}</p>}
                            </div>
                        </Col>

                        <Col sm={6}>
                            <div className="d-flex flex-column gap-1">
                                <label className={clsx(style.lable)}>Postcode</label>
                                <IconField>
                                    <InputIcon>{errors?.postcode && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                                    <InputText {...register("postcode")} keyfilter="int" className={clsx(style.inputText, "outline-none", { [style.error]: errors?.postcode })} placeholder='Enter postcode' />
                                </IconField>
                                {errors?.postcode && <p className="error-message">{errors?.postcode?.message}</p>}
                            </div>
                        </Col>
                    </Row>
                </form>
            </div>
        </Dialog>
    )
}

export default CreateLocation