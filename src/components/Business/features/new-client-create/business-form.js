import clsx from 'clsx';
import { Col, Row, Button } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import React, { forwardRef, useState } from 'react'
import { PhoneInput } from 'react-international-phone';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from 'primereact/dropdown';

import styles from './new-client-create.module.scss';
import { Exclamation, Person, Building, Plus } from 'react-bootstrap-icons';
import FileUploader from '../../../../ui/file-uploader/file-uploader';
import { getCities, getCountries, getStates, getClientCategories, getClientIndustries } from '../../../../APIs/ClientsApi';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";

const schema = yup.object({
  category: yup.number().typeError("Enter a valid category").required('Category is required'),
  name: yup.string().required('Company name is required'),
  industry: yup.number().typeError("Enter a valid industry").required('Industry is required'),
  abn: yup.string().required('ABN is required'),
  phone: yup.string({
    country: yup.string().required("Country is required"),
    number: yup.string().required("Phone number is required")
  }),
  email: yup.string().email('Invalid email').required('Email is required'),
  website: yup.string().url('Invalid URL').required('URL is required'),

  addresses: yup.array().of(
    yup.object({
      country: yup.string().required('Country is required'),
      address: yup.string().required('Address is required'),
      city: yup.number().typeError("City must be a number").required("City is required"),
      state: yup.number().typeError("State must be a number").required("State is required"),
      postcode: yup.string().required('Postcode is required'),
      is_main: yup.boolean().default(false).required('Main address selection is required'),
    })
  ).required(),

  contact_persons: yup.array().of(
    yup.object({
      position: yup.string().required('Position is required'),
      firstname: yup.string().required('First name is required'),
      lastname: yup.string().required('Last name is required'),
      email: yup.string().email('Invalid email').required('Email is required'),
      phone: yup.string({
        country: yup.string().required("Country is required"),
        number: yup.string().required("Phone number is required")
      }),
      is_main: yup.boolean().default(false).required('Main contact selection is required'),
    })
  ).required(),

  payment_terms: yup.number().typeError("Enter a valid payment terms").required('Payment terms are required'),

}).required();

const BusinessForm = forwardRef(({ photo, setPhoto, onSubmit, defaultValues }, ref) => {
  const [show, setShow] = useState(false);

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getClientCategories });
  const industriesQuery = useQuery({ queryKey: ['industries'], queryFn: getClientIndustries });

  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');
  const countriesQuery = useQuery({ queryKey: ['countries'], queryFn: getCountries, enabled: true });
  const statesQuery = useQuery({ queryKey: ['states', countryId], queryFn: () => getStates(countryId), enabled: !!countryId, retry: 1 });
  const citiesQuery = useQuery({ queryKey: ['cities', stateId], queryFn: () => getCities(stateId), enabled: !!stateId });

  const { control, register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });
  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({ control, name: 'contact_persons' });
  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({ control, name: 'addresses' });

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
      <Row className={clsx(styles.bgGreay, 'pt-0')}>
        <Col sm={12}>
          <div className={clsx(styles.fileUploadBox)}>
            <div className={clsx(styles.uploadedImgBox)}>
              {photo ? <img src={photo?.croppedImageBase64} alt='img' /> : <Building size={32} color='#667085' />}
            </div>
            <p className={clsx('mb-0', styles.uploadedText1)}><span className={clsx('mb-0', styles.uploadedText2)} onClick={() => setShow(true)}>Click to upload</span> or drag and drop</p>
            <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
            <FileUploader show={show} setShow={setShow} setPhoto={setPhoto} />
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Customer Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={(categoriesQuery && categoriesQuery.data?.map((category) => ({
                    value: category.id,
                    label: category.name
                  }))) || []}
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

        <Col sm={6}></Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Company Name</label>
            <IconField>
              <InputIcon>{errors.name && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText {...register("name")} className={clsx(styles.inputText, { [styles.error]: errors.name })} placeholder='Enter company name' />
            </IconField>
            {errors.name && <p className="error-message">{errors.name.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Industry</label>
            <Controller
              name="industry"
              control={control}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  options={(industriesQuery && industriesQuery.data?.map((industry) => ({
                    value: industry.id,
                    label: industry.name
                  }))) || []}
                  onChange={(e) => {
                    field.onChange(e.value);
                  }}
                  className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors.industry })}
                  style={{ height: '46px' }}
                  value={field.value}
                  loading={industriesQuery?.isFetching}
                  placeholder="Select Industry"
                />
              )}
            />
            {errors.industry && <p className="error-message">{errors.industry?.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>ABN</label>
            <IconField>
              <InputIcon>{errors.abn && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText {...register("abn")} className={clsx(styles.inputText, { [styles.error]: errors.abn })} placeholder='32 635 443 221' />
            </IconField>
            {errors.abn && <p className="error-message">{errors.abn.message}</p>}
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
                  country={field.value?.country}
                  value={field.value?.number}
                  className='phoneInput'
                  containerClass={styles.countrySelector}
                  onChange={(phone) => field.onChange(phone)}
                />
              )}
            />
            {errors.phone && <p className="error-message">{errors.phone.message}</p>}
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
            <label className={clsx(styles.lable)}>Website</label>
            <IconField>
              <InputIcon>{errors.website && <img src={exclamationCircle} className='mb-3' />}</InputIcon>
              <InputText {...register("website")} className={clsx(styles.inputText, { [styles.error]: errors.website })} placeholder='www.example.com' />
            </IconField>
            {errors.website && <p className="error-message">{errors.website.message}</p>}
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
                  className={clsx(styles.dropdownSelect, 'dropdown-height-fixed', { [styles.error]: errors.category })}
                  style={{ height: '46px' }}
                  value={field.value}
                  placeholder="COD"
                />
              )}
            />
            {errors.payment_terms && <p className="error-message">{errors.payment_terms.message}</p>}
          </div>
        </Col>
      </Row>

      <h2 className={clsx(styles.headingInputs, 'mt-4')}>Contact Person</h2>
      <Row>
        {
          contactFields.map((item, index) => (
            <div key={item.id}>
              <input type="hidden" {...register(`contact_persons.${index}.is_main`)} value={index === 0} />
              <Row className={clsx(styles.bgGreay)}>
                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-4">
                    <label className={clsx(styles.lable)}>Position</label>
                    <IconField>
                      <InputIcon style={{ top: '80%' }}>{errors.contact_persons?.[index]?.position && <img src={exclamationCircle} />}</InputIcon>
                      <InputText {...register(`contact_persons.${index}.position`)} rows={5} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.contact_persons?.[index]?.position })} style={{ resize: 'none' }} placeholder='Manager' />
                    </IconField>
                    {errors.contact_persons?.[index]?.position && <p className="error-message">{errors.contact_persons?.[index]?.position?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}></Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-4">
                    <label className={clsx(styles.lable)}>First Name</label>
                    <IconField>
                      <InputIcon style={{ top: '80%' }}>{errors.contact_persons?.[index]?.firstname && <img src={exclamationCircle} />}</InputIcon>
                      <InputText {...register(`contact_persons.${index}.firstname`)} rows={5} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.contact_persons?.[index]?.firstname })} style={{ resize: 'none' }} placeholder='Jhon' />
                    </IconField>
                    {errors.contact_persons?.[index]?.firstname && <p className="error-message">{errors.contact_persons?.[index]?.firstname?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-4">
                    <label className={clsx(styles.lable)}>Last Name</label>
                    <IconField>
                      <InputIcon style={{ top: '80%' }}>{errors.contact_persons?.[index]?.lastname && <img src={exclamationCircle} />}</InputIcon>
                      <InputText {...register(`contact_persons.${index}.lastname`)} rows={5} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.contact_persons?.[index]?.lastname })} style={{ resize: 'none' }} placeholder='Doe' />
                    </IconField>
                    {errors.contact_persons?.[index]?.lastname && <p className="error-message">{errors.contact_persons?.[index]?.lastname?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-2">
                    <label className={clsx(styles.lable)}>Email</label>
                    <IconField>
                      <InputIcon style={{ top: '80%' }}>{errors.contact_persons?.[index]?.email && <img src={exclamationCircle} />}</InputIcon>
                      <InputText {...register(`contact_persons.${index}.email`)} rows={5} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.contact_persons?.[index]?.email })} style={{ resize: 'none' }} placeholder='golden@harvest.com' />
                    </IconField>
                    {errors.contact_persons?.[index]?.email && <p className="error-message">{errors.contact_persons?.[index]?.email?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-2">
                    <label className={clsx(styles.lable)}>Phone number</label>
                    <Controller
                      name={`contact_persons.${index}.phone`}
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          defaultCountry='au'
                          country={field.value?.contact_persons?.[index]?.country}
                          value={field.value?.contact_persons?.[index]?.number}
                          className='phoneInput'
                          containerClass={styles.countrySelector}
                          onChange={(phone) => field.onChange(phone)}
                        />
                      )}
                    />
                    {errors.contact_persons?.[index]?.phone && <p className="error-message">{errors.contact_persons?.[index]?.phone.message}</p>}
                  </div>
                </Col>
              </Row>
              <Col sm={12} className="d-flex justify-content-end gap-3 mb-4">
                  {index !== 0 && <Button type="button" className={clsx(styles.tempDelete)} onClick={() => removeContact(index)}>Delete Contact</Button>}
                  {index === contactFields.length - 1 &&  <Button type="button" className={clsx(styles.tempAdd)} onClick={() => appendContact({})}>Add New <Plus size={24} color="#106b99" /></Button>}
                </Col>
            </div>
          ))
        }
      </Row>

      <h2 className={clsx(styles.headingInputs, 'mt-4')}>Locations</h2>
      <Row>
        
      </Row>

      <h2 className={clsx(styles.headingInputs)}>Client Description</h2>
      <Row className={clsx(styles.bgGreay)}>
        <Col sm={12}>
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

export default BusinessForm