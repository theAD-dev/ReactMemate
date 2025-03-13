import React, { forwardRef, useEffect, useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import { Building, Plus } from 'react-bootstrap-icons';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Chips } from "primereact/chips";
import { Dropdown } from 'primereact/dropdown';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import * as yup from 'yup';
import styles from './supplier-form.module.scss';
import { getCities, getCountries, getStates } from '../../../../../APIs/ClientsApi';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import FileUploader from '../../../../../ui/file-uploader/file-uploader';


const schema = yup.object({
  name: yup.string().required('Company name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  abn: yup.string().required('ABN is required'),
  phone: yup.string().required("Phone number is required").matches(/^\+\d{1,3}\d{4,14}$/, 'Invalid phone number format'),
  services: yup.string().required('Services is required'),
  // note: yup.string().required('Note is required'),
  contact_persons: yup.array().of(
    yup.object({
      email: yup.string().nullable().email('Invalid contact email format').test('is-valid', 'Contact email must be a valid email if provided', value => !value || yup.string().email().isValidSync(value)),
    })
  )

  // addresses: yup.array().of(
  //   yup.object({
  //     id: yup.string(),
  //     title: yup.string(),
  //     country: yup.string().required('Country is required'),
  //     address: yup.string().required('Address is required'),
  //     city: yup.number().typeError("City must be a number").required("City is required"),
  //     state: yup.number().typeError("State must be a number").required("State is required"),
  //     postcode: yup.string().required('Postcode is required'),
  //     is_main: yup.boolean().default(false).required('Main address selection is required'),
  //   })
  // ).required(),

  // contact_persons: yup.array().of(
  //   yup.object({
  //     position: yup.string().required('Position is required'),
  //     firstname: yup.string().required('First name is required'),
  //     lastname: yup.string().required('Last name is required'),
  //     email: yup.string().email('Invalid email').required('Email is required'),
  //     phone: yup.string().required("Phone number is required").matches(/^\+\d{1,3}\d{4,14}$/, 'Invalid phone number format'),
  //     is_main: yup.boolean().default(false).required('Main contact selection is required'),
  //   })
  // ).required(),

}).required();

const SupplierForm = forwardRef(({ photo, setPhoto, onSubmit, defaultValues }, ref) => {
  const [show, setShow] = useState(false);
  const [servicesTag, setServiceTag] = useState([]);
  const [addressIndex, setAddressIndex] = useState(0);

  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');
  const [citiesOptions, setCitiesOptions] = useState({});
  const countriesQuery = useQuery({ queryKey: ['countries'], queryFn: getCountries, enabled: true });
  const statesQuery = useQuery({ queryKey: ['states', countryId], queryFn: () => getStates(countryId), enabled: !!countryId, retry: 1 });
  const citiesQuery = useQuery({ queryKey: ['cities', stateId], queryFn: () => getCities(stateId), enabled: !!stateId });

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

  const { control, register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });
  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({ control, name: 'contact_persons' });
  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({ control, name: 'addresses' });

  useEffect(() => {
    if (defaultValues?.addresses?.length) {
      if (addressIndex < defaultValues.addresses.length) {
        const address = defaultValues?.addresses[addressIndex];
        const newCountryId = address?.country;
        const newStateId = address?.state;

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

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)}>
      <Row className={clsx(styles.bgGreay, 'pt-0')}>
        <Col sm={12}>
          <div className={clsx(styles.fileUploadBox)} onClick={() => setShow(true)}>
            <div className={clsx(styles.uploadedImgBox, 'rounded')}>
              {photo ? <img src={photo?.croppedImageBase64 || photo} alt='profile' /> : <Building size={32} color='#667085' />}
            </div>
            <p className={clsx('mb-0', styles.uploadedText1)}><span className={clsx('mb-0', styles.uploadedText2)}>Click to upload</span> or drag and drop</p>
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
          <div className="d-flex flex-column mb-4 gap-1">
            <label className={clsx(styles.lable)}>Email<span className='required'>*</span></label>
            <IconField>
              <InputIcon>{errors.email && <img src={exclamationCircle} className='mb-3' alt='error-icon' />}</InputIcon>
              <InputText {...register("email")} className={clsx(styles.inputText, { [styles.error]: errors.email })} placeholder='example@email.com' />
            </IconField>
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column mb-4 gap-1">
            <label className={clsx(styles.lable)}>Website</label>
            <IconField>
              <InputIcon>{errors.website && <img src={exclamationCircle} className='mb-3' alt='error-icon' />}</InputIcon>
              <InputText {...register("website")} className={clsx(styles.inputText, { [styles.error]: errors.website })} placeholder='www.example.com' />
            </IconField>
            {errors.website && <p className="error-message">{errors.website.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column mb-4 gap-1">
            <label className={clsx(styles.lable)}>Phone number<span className='required'>*</span></label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  defaultCountry='au'
                  value={typeof field.value === 'string' ? field.value : ''}
                  className='phoneInput'
                  containerClass={styles.countrySelector}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.phone && <p className="error-message">{errors.phone.message}</p>}
          </div>
        </Col>

        <Col sm={6}>
          <div className="d-flex flex-column gap-1">
            <label className={clsx(styles.lable)}>ABN<span className='required'>*</span></label>
            <IconField>
              <InputIcon>{errors.abn && <img src={exclamationCircle} className='mb-3' alt='error-icon' />}</InputIcon>
              <InputText {...register("abn")} className={clsx(styles.inputText, { [styles.error]: errors.abn })} placeholder='32 635 443 221' />
            </IconField>
            {errors.abn && <p className="error-message">{errors.abn.message}</p>}
          </div>
        </Col>
      </Row>

      <h2 className={clsx(styles.headingInputs, 'mt-4')}>Services</h2>
      <Row className={clsx(styles.bgGreay, '')}>
        <Col>
          <div className="d-flex flex-column mb-4 gap-1">
            <label className={clsx(styles.label)}>Services<span className='required'>*</span></label>
            <Controller
              name="services"
              control={control}
              render={({ field }) => (
                <Chips
                  value={field.value ? field.value.split(',') : []}  // Convert string to array
                  allowDuplicate={false}
                  addOnBlur={true}
                  onChange={(e) => field.onChange(e.value.join(','))}  // Convert array to comma-separated string
                  className={clsx('w-100 custom-chipsInput')}
                  separator=","
                />
              )}
            />
            {errors.services && <span className="error-message">{errors.services.message}</span>}
          </div>
        </Col>
        <Col sm={12}>
          <div className="d-flex flex-column gap-1">
            <label className={clsx(styles.lable)}>Notes</label>
            <IconField>
              <InputIcon style={{ top: '75%' }}>{errors.note && <img src={exclamationCircle} alt='error-icon' />}</InputIcon>
              <InputTextarea {...register("note")} rows={4} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.note })} style={{ resize: 'none' }} placeholder='Enter a note...' />
            </IconField>
            {errors.note && <p className="error-message">{errors.note.message}</p>}
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
                    {/* {errors.contact_persons?.[index]?.firstname && <p className="error-message">{errors.contact_persons?.[index]?.firstname?.message}</p>} */}
                  </div>
                </Col>

                <Col sm={6}>
                  <div className="d-flex flex-column gap-1 mb-4">
                    <label className={clsx(styles.lable)}>Last Name</label>
                    <IconField>
                      <InputIcon style={{ top: '40%' }}>{errors.contact_persons?.[index]?.lastname && <img src={exclamationCircle} alt='error-icon' />}</InputIcon>
                      <InputText {...register(`contact_persons.${index}.lastname`)} rows={5} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.contact_persons?.[index]?.lastname })} style={{ resize: 'none' }} placeholder='Doe' />
                    </IconField>
                    {/* {errors.contact_persons?.[index]?.lastname && <p className="error-message">{errors.contact_persons?.[index]?.lastname?.message}</p>} */}
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
                    <label className={clsx(styles.lable)}>Phone (Optional)</label>
                    <Controller
                      name={`contact_persons.${index}.phone`}
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          defaultCountry='au'
                          value={field.value || ""}
                          className='phoneInput'
                          containerClass={styles.countrySelector}
                          onChange={(phone) => field.onChange(phone)}
                        />
                      )}
                    />
                    {/* {errors.contact_persons?.[index]?.phone && <p className="error-message">{errors.contact_persons?.[index]?.phone.message}</p>} */}
                  </div>
                </Col>
                <Col sm={6}>
                  <div className="d-flex flex-column gap-1">
                    <label className={clsx(styles.lable)}>Position</label>
                    <IconField>
                      <InputIcon style={{ top: '40%' }}>{errors.contact_persons?.[index]?.position && <img src={exclamationCircle} alt='error-icon' />}</InputIcon>
                      <InputText {...register(`contact_persons.${index}.position`)} rows={5} cols={30} className={clsx(styles.inputText, { [styles.error]: errors.contact_persons?.[index]?.position })} style={{ resize: 'none' }} placeholder='Manager' />
                    </IconField>
                    {/* {errors.contact_persons?.[index]?.position && <p className="error-message">{errors.contact_persons?.[index]?.position?.message}</p>} */}
                  </div>
                </Col>

                <Col sm={6}></Col>
              </Row>
              <Col sm={12} className="d-flex justify-content-end gap-3 mb-4">
                {index !== 0 && <Button type="button" className={clsx(styles.tempDelete)} onClick={() => removeContact(index)}>Delete</Button>}
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
                    <label className={clsx(styles.lable)}>Location Name (Optional)</label>
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
                          filter
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
                            placeholder={"Select a city"}
                            filter
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
                {index !== 0 && <Button type="button" className={clsx(styles.tempDelete)} onClick={() => removeAddress(index)}>Delete</Button>}
                {index === addressFields.length - 1 && <Button type="button" className={clsx(styles.tempAdd)} onClick={() => appendAddress({ country: 1 })}>Add New <Plus size={24} color="#106b99" /></Button>}
              </Col>
            </div>
          ))
        }
      </Row>

    </form>
  );
});

export default SupplierForm;