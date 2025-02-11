import clsx from 'clsx';
import { Col, Row } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import React, { forwardRef, useEffect, useState } from 'react'
import { PhoneInput } from 'react-international-phone';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from 'primereact/dropdown';

import styles from './new-client-create.module.scss';
import { Person } from 'react-bootstrap-icons';
import FileUploader from '../../../../../ui/file-uploader/file-uploader';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import { getCities, getClientCategories, getCountries, getStates } from '../../../../../APIs/ClientsApi';


const schema = yup
    .object({
        firstname: yup.string().required("First name is required"),
        lastname: yup.string().required("Last name is required"),
        email: yup.string().email("Invalid email address").required("Email is required"),
        // phone: yup.string().required("Phone number is required").matches(/^\+\d{1,3}\d{4,14}$/, 'Invalid phone number format'),

        payment_terms: yup.number().typeError("Enter a valid payment terms").required('Payment terms are required'),
        category: yup.number().typeError("Enter a valid category").required('Category is required'),
    })
    .required();

const IndivisualForm = forwardRef(({ photo, setPhoto, onSubmit, defaultValues }, ref) => {
    const [show, setShow] = useState(false);

    const [countryId, setCountryId] = useState('');
    const [stateId, setStateId] = useState('');
    const countriesQuery = useQuery({ queryKey: ['countries'], queryFn: getCountries, enabled: true });
    const statesQuery = useQuery({ queryKey: ['states', countryId], queryFn: () => getStates(countryId), enabled: !!countryId, retry: 1 });
    const citiesQuery = useQuery({ queryKey: ['cities', stateId], queryFn: () => getCities(stateId), enabled: !!stateId });

    const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getClientCategories });

    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    useEffect(() => {
        if (defaultValues?.address?.country) setCountryId(defaultValues?.address?.country);
        if (defaultValues?.address?.state) setStateId(defaultValues?.address?.state);
    }, [defaultValues?.address]);
    return (
        <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
            <Row className={clsx(styles.bgGreay, 'pt-0')}>
                <Col sm={12}>
                    <div className={clsx(styles.fileUploadBox, 'cursor-pointer')} onClick={() => setShow(true)}>
                        <div className={clsx(styles.uploadedImgBox)}>
                            {photo ? <img src={photo?.croppedImageBase64 || photo} alt='profile-img' /> : <Person size={32} color='#667085' />}
                        </div>
                        <p className={clsx('mb-0', styles.uploadedText1)}><span className={clsx('mb-0', styles.uploadedText2)}>Click to upload</span></p>
                        <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
                    </div>
                    <FileUploader show={show} setShow={setShow} setPhoto={setPhoto} shape='round' />
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>First Name</label>
                        <IconField>
                            <InputIcon>{errors.firstname && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("firstname")} className={clsx(styles.inputText, { [styles.error]: errors.firstname })} placeholder='Enter first name' />
                        </IconField>
                        {errors.firstname && <p className="error-message">{errors.firstname.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Last Name</label>
                        <IconField>
                            <InputIcon>{errors.lastname && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("lastname")} className={clsx(styles.inputText, { [styles.error]: errors.lastname })} placeholder='Enter last name' />
                        </IconField>
                        {errors.lastname && <p className="error-message">{errors.lastname.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1">
                        <label className={clsx(styles.lable)}>Email</label>
                        <IconField>
                            <InputIcon>{errors.email && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("email")} className={clsx(styles.inputText, { [styles.error]: errors.email })} placeholder='example@email.com' />
                        </IconField>
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1">
                        <label className={clsx(styles.lable)}>Phone number</label>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    defaultCountry='au'
                                    value={field.value}
                                    className='phoneInput rounded'
                                    containerClass={styles.countrySelector}
                                    onChange={field.onChange}
                                    style={{ border: `1px solid ${errors.phone ? 'red' : '#dedede'}`}}
                                />
                            )}
                        />
                        {errors.phone && <p className="error-message">{errors.phone.message}</p>}
                    </div>
                </Col>
            </Row>

            <h2 className={clsx(styles.headingInputs, 'mt-4')}>Payment Terms</h2>
            <Row className={clsx(styles.bgGreay)}>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Payment Terms</label>
                        <Controller
                            name="payment_terms"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={[
                                        { value: 1, label: "COD" },
                                        { value: 0, label: "Prepaid" },
                                        { value: 7, label: "Week" },
                                        { value: 14, label: "Two weeks" },
                                        { value: 30, label: "One month" },
                                    ] || []}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                    }}
                                    className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors.payment_terms })}
                                    style={{ height: '46px' }}
                                    value={field.value}
                                    placeholder="Select payment terms"
                                />
                            )}
                        />
                        {errors.payment_terms && <p className="error-message">{errors.payment_terms.message}</p>}
                    </div>
                </Col>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Customers Discount Category</label>
                        <Controller
                            name="category"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    options={[
                                        // { value: 1, label: 'Default - 0.00%' },
                                        ...(categoriesQuery && categoriesQuery.data?.map((category) => ({
                                            value: category.id,
                                            label: `${category.name} - ${category.value}%`
                                        }))) || []
                                    ]}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                    }}
                                    className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors.category })}
                                    style={{ height: '46px' }}
                                    value={field.value}
                                    loading={categoriesQuery?.isFetching}
                                    placeholder="Select a category"
                                />
                            )}
                        />
                        {errors.category && <p className="error-message">{errors.category.message}</p>}
                    </div>
                </Col>
            </Row>

            <h2 className={clsx(styles.headingInputs)}>Locations</h2>
            <Row className={clsx(styles.bgGreay)}>
                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Location Name</label>
                        <IconField>
                            <InputIcon>{errors.address?.title && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("address.title")} className={clsx(styles.inputText, { [styles.error]: errors.address?.title })} placeholder='Enter location name' />
                        </IconField>
                        {errors.address?.title && <p className="error-message">{errors.address?.title?.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>Country</label>
                        <Controller
                            name="address.country"
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
                                    className={clsx(styles.dropdownSelect, 'dropdown-height-fixed')}
                                    style={{ height: '46px' }}
                                    value={field.value}
                                    loading={countriesQuery?.isFetching}
                                    placeholder="Select a country"
                                />
                            )}
                        />
                        {errors.address?.country && <p className="error-message">{errors.address?.country?.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>State</label>
                        <Controller
                            name="address.state"
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
                                    className={clsx(styles.dropdownSelect, 'dropdown-height-fixed')}
                                    style={{ height: '46px' }}
                                    value={field.value}
                                    loading={statesQuery?.isFetching}
                                    placeholder={"Select a state"}
                                    filter
                                />
                            )}
                        />
                        {errors.address?.state && <p className="error-message">{errors.address?.state?.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1 mb-4">
                        <label className={clsx(styles.lable)}>City/Suburb</label>
                        <Controller
                            name="address.city"
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
                                    className={clsx(styles.dropdownSelect, 'dropdown-height-fixed')}
                                    style={{ height: '46px' }}
                                    value={field.value}
                                    loading={citiesQuery?.isFetching}
                                    placeholder={"Select a city"}
                                    filter
                                />
                            )}
                        />
                        {errors.address?.city && <p className="error-message">{errors.address?.city?.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1">
                        <label className={clsx(styles.lable)}>Street Address</label>
                        <IconField>
                            <InputIcon>{errors.address?.address && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("address.address")} className={clsx(styles.inputText, { [styles.error]: errors.address?.address })} placeholder='Enter street address' />
                        </IconField>
                        {errors.address?.address && <p className="error-message">{errors.address?.address?.message}</p>}
                    </div>
                </Col>

                <Col sm={6}>
                    <div className="d-flex flex-column gap-1">
                        <label className={clsx(styles.lable)}>Postcode</label>
                        <IconField>
                            <InputIcon>{errors.address?.postcode && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
                            <InputText {...register("address.postcode")} keyfilter="int" className={clsx(styles.inputText, { [styles.error]: errors.address?.postcode })} placeholder='Enter postcode' />
                        </IconField>
                        {errors.address?.postcode && <p className="error-message">{errors.address?.postcode?.message}</p>}
                    </div>
                </Col>
            </Row>

            <h2 className={clsx(styles.headingInputs)}>Client Description</h2>
            <Row className={clsx(styles.bgGreay)}>
                <Col>
                    <div className="d-flex flex-column gap-1">
                        <label className={clsx(styles.lable)}>Description</label>
                        <IconField>
                            <InputIcon style={{ top: '80%' }}>{errors.description && <img src={exclamationCircle} />}</InputIcon>
                            <InputTextarea {...register("description")} rows={5} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.description })} style={{ resize: 'none' }} placeholder='Enter a description...' />
                        </IconField>
                        {errors.description && <p className="error-message">{errors.description.message}</p>}
                    </div>
                </Col>
            </Row>
        </form>
    )
})

export default IndivisualForm