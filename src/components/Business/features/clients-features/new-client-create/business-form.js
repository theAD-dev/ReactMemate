import React, { forwardRef, useEffect, useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { Building, Plus } from 'react-bootstrap-icons';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressSpinner } from 'primereact/progressspinner';
import * as yup from 'yup';
import styles from './new-client-create.module.scss';
import { getCities, getCountries, getStates, getClientCategories, getClientIndustries } from '../../../../../APIs/ClientsApi';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import FileUploader from '../../../../../ui/file-uploader/file-uploader';



const schema = yup.object({
  name: yup.string().required('Company name is required'),
  // industry: yup.number().typeError("Enter a valid industry").required('Industry is required'),
  abn: yup.string().nullable().transform((value) => (value === "" ? null : value)).matches(/^\d{11}$/, "ABN must be an 11-digit number").notRequired(),
  // phone: yup.string().required("Phone number is required").matches(/^\+\d{1,3}\d{4,14}$/, 'Invalid phone number format'),
  email: yup.string().nullable().transform((value) => (value === "" ? null : value)).matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address").notRequired(),
  payment_terms: yup.number().typeError("Enter a valid payment terms").required('Payment terms are required'),
  category: yup.number().typeError("Enter a valid category").required('Category is required'),

  contact_persons: yup.array().of(
    yup.object({
      email: yup.string().nullable().email('Invalid contact email format').test('is-valid', 'Contact email must be a valid email if provided', value => !value || yup.string().email().isValidSync(value)),
    })
  )
}).required();

const BusinessForm = forwardRef(({ photo, setPhoto, onSubmit, defaultValues, deleteAddress, deleteContact }, ref) => {
  const [show, setShow] = useState(false);
  const [addressIndex, setAddressIndex] = useState(0);
  const [deleteIndex, setDeleteIndex] = useState({ type: null, index: null });

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getClientCategories });
  const industriesQuery = useQuery({ queryKey: ['industries'], queryFn: getClientIndustries });

  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');
  const [citiesOptions, setCitiesOptions] = useState({});
  const countriesQuery = useQuery({ queryKey: ['countries'], queryFn: getCountries, enabled: true });
  const statesQuery = useQuery({ queryKey: ['states', countryId], queryFn: () => getStates(countryId), enabled: !!countryId, retry: 1 });
  const citiesQuery = useQuery({ queryKey: ['cities', stateId], queryFn: async () => getCities(stateId), enabled: !!stateId, keepPreviousData: true });

  const fetchCities = async (id) => {
    if (!id) return;

    if (!citiesOptions[id]) {
      const response = await getCities(id);
      setCitiesOptions((others) => ({ ...others, [id]: response }));
    }
  };

  useEffect(() => {
    if (stateId) fetchCities(stateId);
  }, [stateId]);

  const { control, register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });
  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({ control, name: 'contact_persons' });
  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({ control, name: 'addresses' });

  const deleteContactIndex = async (index, id) => {
    setDeleteIndex({ type: 'contact', index: index });
    if (id) await deleteContact(id);
    removeContact(index);
    setDeleteIndex({ type: null, index: null });
  };

  const deleteAddressIndex = async (index, id) => {
    setDeleteIndex({ type: 'address', index: index });
    if (id) await deleteAddress(id);
    removeAddress(index);
    setDeleteIndex({ type: null, index: null });
  };

  useEffect(() => {
    if (defaultValues?.addresses?.length) {
      if (addressIndex < defaultValues.addresses.length) {
        const address = defaultValues.addresses[addressIndex];
        const newCountryId = address.country;
        const newStateId = address.state;

        if (newCountryId !== countryId) {
          setCountryId(newCountryId);
        } else if (newStateId !== stateId) {
          setStateId(newStateId);
        } else {
          setAddressIndex((prevIndex) => prevIndex + 1);
        }
      }
    }
  }, [defaultValues, addressIndex, countryId, stateId]);

  useEffect(() => {
    if (categoriesQuery?.data?.length && !defaultValues.category) {
      let findRegular = categoriesQuery.data?.find(category => category.name.toLowerCase() === 'regular');
      if (findRegular.name) {
        setValue('category', findRegular.id);
      }
    }
  }, [categoriesQuery?.data, defaultValues, setValue]);

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
      <Row className={clsx(styles.bgGreay, 'pt-0')}>
        <Col sm={12}>
          <div className={clsx(styles.fileUploadBox)} onClick={() => setShow(true)}>
            <div className={clsx(styles.uploadedImgBox, 'rounded')}>
              {photo ? <img src={photo?.croppedImageBase64 || photo} alt='img' /> : <Building size={32} color='#667085' />}
            </div>
            <p className={clsx('mb-0', styles.uploadedText1)}><span className={clsx('mb-0', styles.uploadedText2)}>Click to upload</span></p>
            <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
          </div>
          <FileUploader show={show} setShow={setShow} setPhoto={setPhoto} />
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Company Name<span className='required'>*</span></label>
            <IconField>
              <InputIcon>{errors.name && <img src={exclamationCircle} className='mb-3' alt='error-icon' />}</InputIcon>
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
                  scrollHeight="380px"
                  value={field.value}
                  loading={industriesQuery?.isFetching}
                  placeholder="Select Industry"
                  filter
                  filterInputAutoFocus={true}
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
              <InputIcon>{errors.abn && <img src={exclamationCircle} className='mb-3' alt='error-icon' />}</InputIcon>
              <InputText
                {...register("abn", {
                  onChange: (e) => {
                    const sanitizedValue = e.target.value.replace(/\D/g, "");
                    setValue("abn", sanitizedValue, { shouldValidate: true });
                  },
                  onPaste: (e) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData("text").replace(/\D/g, "");
                    setValue("abn", pastedText, { shouldValidate: true });
                  },
                })}
                className={clsx(styles.inputText, { [styles.error]: errors.abn })}
                placeholder='32 635 443 221'
              />
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
                  value={typeof field.value === 'string' ? field.value : ''}
                  className='phoneInput rounded'
                  containerClass={styles.countrySelector}
                  onChange={field.onChange}
                  style={{ border: `1px solid ${errors.phone ? 'red' : '#dedede'}` }}
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
              <InputIcon>{errors.email && <img src={exclamationCircle} className='mb-3' alt='error-icon' />}</InputIcon>
              <InputText {...register("email")} className={clsx(styles.inputText, { [styles.error]: errors.email })} placeholder='example@email.com' />
            </IconField>
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1">
            <label className={clsx(styles.lable)}>Website</label>
            <IconField>
              <InputIcon>{errors.website && <img src={exclamationCircle} className='mb-3' alt='error-icon' />}</InputIcon>
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
            <label className={clsx(styles.lable)}>Payment Terms<span className='required'>*</span></label>
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
                  scrollHeight="380px"
                  placeholder="Select payment terms"
                  filterInputAutoFocus={true}
                />
              )}
            />
            {errors.payment_terms && <p className="error-message">{errors.payment_terms.message}</p>}
          </div>
        </Col>
        <Col sm={6}>
          <div className="d-flex flex-column gap-1 mb-4">
            <label className={clsx(styles.lable)}>Customers Discount Category<span className='required'>*</span></label>
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
                  scrollHeight="380px"
                  filterInputAutoFocus={true}
                />
              )}
            />
            {errors.category && <p className="error-message">{errors.category.message}</p>}
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
                    <label className={clsx(styles.lable)}>First Name</label>
                    <IconField>
                      <InputIcon style={{ top: '40%' }}>{errors.contact_persons?.[index]?.firstname && <img src={exclamationCircle} alt='error-icon' />}</InputIcon>
                      <InputText {...register(`contact_persons.${index}.firstname`)} rows={5} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.contact_persons?.[index]?.firstname })} style={{ resize: 'none' }} placeholder='Jhon' />
                    </IconField>
                    {errors.contact_persons?.[index]?.firstname && <p className="error-message">{errors.contact_persons?.[index]?.firstname?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-4">
                    <label className={clsx(styles.lable)}>Last Name</label>
                    <IconField>
                      <InputIcon style={{ top: '40%' }}>{errors.contact_persons?.[index]?.lastname && <img src={exclamationCircle} alt='error-icon' />}</InputIcon>
                      <InputText {...register(`contact_persons.${index}.lastname`)} rows={5} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.contact_persons?.[index]?.lastname })} style={{ resize: 'none' }} placeholder='Doe' />
                    </IconField>
                    {errors.contact_persons?.[index]?.lastname && <p className="error-message">{errors.contact_persons?.[index]?.lastname?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-4">
                    <label className={clsx(styles.lable)}>Email</label>
                    <IconField>
                      <InputIcon style={{ top: '40%' }}>{errors.contact_persons?.[index]?.email && <img src={exclamationCircle} alt='error-icon' />}</InputIcon>
                      <InputText {...register(`contact_persons.${index}.email`)} rows={5} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.contact_persons?.[index]?.email })} style={{ resize: 'none' }} placeholder='golden@harvest.com' />
                    </IconField>
                    {errors.contact_persons?.[index]?.email && <p className="error-message">{errors.contact_persons?.[index]?.email?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-4">
                    <label className={clsx(styles.lable)}>Phone number</label>
                    <Controller
                      name={`contact_persons.${index}.phone`}
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          defaultCountry='au'
                          value={field.value || ""}
                          className='phoneInput rounded'
                          containerClass={styles.countrySelector}
                          onChange={(phone) => field.onChange(phone)}
                          style={{ border: `1px solid ${errors.contact_persons?.[index]?.phone ? 'red' : '#dedede'}` }}
                        />
                      )}
                    />
                    {errors.contact_persons?.[index]?.phone && <p className="error-message">{errors.contact_persons?.[index]?.phone.message}</p>}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-4">
                    <label className={clsx(styles.lable)}>Position</label>
                    <IconField>
                      <InputIcon style={{ top: '40%' }}>{errors.contact_persons?.[index]?.position && <img src={exclamationCircle} alt='error-icon' />}</InputIcon>
                      <InputText {...register(`contact_persons.${index}.position`)} rows={5} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.contact_persons?.[index]?.position })} style={{ resize: 'none' }} placeholder='Manager' />
                    </IconField>
                    {errors.contact_persons?.[index]?.position && <p className="error-message">{errors.contact_persons?.[index]?.position?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}></Col>
              </Row>
              <Col sm={12} className="d-flex justify-content-end gap-3 mb-4">
                {index !== 0 && <Button type="button" className={clsx(styles.tempDelete)} onClick={() => deleteContactIndex(index, item.uniqeId)} disabled={!!(deleteIndex?.type === "contact" && deleteIndex.index === index)}>Delete {deleteIndex?.type === "contact" && deleteIndex.index === index ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : ''}</Button>}
                {index === contactFields.length - 1 && <Button type="button" className={clsx(styles.tempAdd)} onClick={() => appendContact({})}>Add New <Plus size={24} color="#106b99" /></Button>}
              </Col>
            </div>
          ))
        }
      </Row>

      <h2 className={clsx(styles.headingInputs, 'mt-4')}>Locations</h2>
      <Row>
        {
          addressFields.map((item, index) => (
            <div key={item.id}>
              <input type="hidden" {...register(`addresses.${index}.is_main`)} value={index === 0} />
              <Row className={clsx(styles.bgGreay)}>
                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-4">
                    <label className={clsx(styles.lable)}>Location Name</label>
                    <IconField>
                      <InputIcon>{errors.addresses?.[index]?.title && <img src={exclamationCircle} className='mb-3' alt='error-icon' />}</InputIcon>
                      <InputText {...register(`addresses.${index}.title`)} className={clsx(styles.inputText, { [styles.error]: errors.addresses?.[index]?.title })} placeholder='Enter location name' />
                    </IconField>
                    {errors.addresses?.[index]?.title && <p className="error-message">{errors.addresses?.[index]?.title?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-4">
                    <label className={clsx(styles.lable)}>Country</label>
                    <Controller
                      name={`addresses.${index}.country`}
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
                          scrollHeight="380px"
                          filterInputAutoFocus={true}
                        />
                      )}
                    />
                    {errors.addresses?.[index]?.country && <p className="error-message">{errors.addresses?.[index]?.country?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-4">
                    <label className={clsx(styles.lable)}>State</label>
                    <Controller
                      name={`addresses.${index}.state`}
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
                          scrollHeight="380px"
                          filter
                          filterInputAutoFocus={true}
                        />
                      )}
                    />
                    {errors.addresses?.[index]?.state && <p className="error-message">{errors.addresses?.[index]?.state?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-4">
                    <label className={clsx(styles.lable)}>City/Suburb</label>
                    <Controller
                      name={`addresses.${index}.city`}
                      control={control}
                      defaultValue=""
                      render={({ field }) => {
                        const stateIndexId = watch(`addresses.${index}.state`);
                        return (
                          <Dropdown
                            {...field}
                            options={(citiesOptions[stateIndexId]?.map((city) => ({
                              value: city.id,
                              label: city.name
                            }))) || []}
                            onChange={(e) => {
                              field.onChange(e.value);
                            }}
                            className={clsx(styles.dropdownSelect, 'dropdown-height-fixed')}
                            style={{ height: '46px' }}
                            value={field.value}
                            loading={stateIndexId === stateId && citiesQuery?.isFetching}
                            disabled={citiesQuery?.isFetching}
                            placeholder={"Select a city"}
                            emptyMessage={!stateIndexId ? "Select a state first" : "No cities found"}
                            scrollHeight="380px"
                            filter
                            filterInputAutoFocus={true}
                          />
                        );
                      }}
                    />
                    {errors.addresses?.[index]?.city && <p className="error-message">{errors.addresses?.[index]?.city?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1">
                    <label className={clsx(styles.lable)}>Street Address</label>
                    <IconField>
                      <InputIcon>{errors.addresses?.[index]?.address && <img src={exclamationCircle} className='mb-3' alt='error-icon' />}</InputIcon>
                      <InputText {...register(`addresses.${index}.address`)} className={clsx(styles.inputText, { [styles.error]: errors.addresses?.[index]?.address })} placeholder='Enter street address' />
                    </IconField>
                    {errors.addresses?.[index]?.address && <p className="error-message">{errors.addresses?.[index]?.address?.message}</p>}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1">
                    <label className={clsx(styles.lable)}>Postcode</label>
                    <IconField>
                      <InputIcon>{errors.addresses?.[index]?.postcode && <img src={exclamationCircle} className='mb-3' alt='error-icon' />}</InputIcon>
                      <InputText {...register(`addresses.${index}.postcode`)} keyfilter="int" className={clsx(styles.inputText, { [styles.error]: errors.addresses?.[index]?.postcode })} placeholder='Enter postcode' />
                    </IconField>
                    {errors.addresses?.[index]?.postcode && <p className="error-message">{errors.addresses?.[index]?.postcode?.message}</p>}
                  </div>
                </Col>
              </Row>
              <Col sm={12} className="d-flex justify-content-end gap-3 mb-4">
                { index !== 0 && <Button type="button" className={clsx(styles.tempDelete)} onClick={() => deleteAddressIndex(index, item.uniqeId)} disabled={!!(deleteIndex?.type === "address" && deleteIndex.index === index)}>Delete {deleteIndex?.type === "address" && deleteIndex.index === index ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : ''}</Button>}
                {index === addressFields.length - 1 && <Button type="button" className={clsx(styles.tempAdd)} onClick={() => appendAddress({ country: 1 })}>Add New <Plus size={24} color="#106b99" /></Button>}
              </Col>
            </div>
          ))
        }
      </Row>

      <h2 className={clsx(styles.headingInputs)}>Client Description</h2>
      <Row className={clsx(styles.bgGreay)}>
        <Col sm={12}>
          <div className="d-flex flex-column gap-1">
            <label className={clsx(styles.lable)}>Description</label>
            <IconField>
              <InputIcon style={{ top: '75%' }}>{errors.description && <img src={exclamationCircle} alt='error-icon' />}</InputIcon>
              <InputTextarea {...register("description")} rows={5} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.description })} style={{ resize: 'none' }} placeholder='Enter a description...' />
            </IconField>
            {errors.description && <p className="error-message">{errors.description.message}</p>}
          </div>
        </Col>
      </Row>

    </form>
  );
});

export default BusinessForm;