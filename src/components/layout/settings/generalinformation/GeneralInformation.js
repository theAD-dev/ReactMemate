import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { PencilSquare, Telephone, Link45deg, Upload } from "react-bootstrap-icons";
import { Helmet } from 'react-helmet-async';
import { Controller, useForm } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery, useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'sonner';
import * as yup from 'yup';
import styles from "./general.module.scss";
import { getCities, getCountries, getStates } from '../../../../APIs/ClientsApi';
import { SettingsGeneralInformation, updateGeneralInformation } from '../../../../APIs/SettingsGeneral';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import exclamationCircle from "../../../../assets/images/icon/exclamation-circle.svg";
import { FallbackImage } from '../../../../shared/ui/image-with-fallback/image-avatar';
import FileUploader from '../../../../ui/file-uploader/file-uploader';


const schema = yup.object().shape({
  legal_name: yup.string().required('Company Legal Name is required'),
  trading_name: yup.string().required('Trading Name is required'),
  abn: yup.string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .matches(/^\d{11}$/, "ABN must be an 11-digit number")
    .notRequired(),
  main_email: yup.string().email('Invalid email').required('Main Company Email is required'),
  main_phone: yup.string(),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  address: yup.string(),
  postcode: yup.string(),
  company_logo: yup.mixed().nullable(),
});

function GeneralInformation() {
  const { trialHeight } = useTrialHeight();
  const [isEditingGroup, setIsEditingGroup] = useState(false);
  const editingHeight = isEditingGroup ? 100 : 0;
  const [photo, setPhoto] = useState({});

  const [countryId, setCountryId] = useState(1);
  const [stateId, setStateId] = useState('');
  const [cityId, setCityId] = useState('');
  const countriesQuery = useQuery({ queryKey: ['countries'], queryFn: getCountries, enabled: true });
  const statesQuery = useQuery({ queryKey: ['states', countryId], queryFn: () => getStates(countryId), enabled: !!countryId, retry: 1 });
  const citiesQuery = useQuery({ queryKey: ['cities', stateId], queryFn: () => getCities(stateId), enabled: !!stateId });

  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      country: 1,
    }
  });
  console.log('errors: ', errors);

  const { data, isLoading, error } = useQuery({
    queryKey: ['generalInfo'],
    queryFn: SettingsGeneralInformation,
    onSuccess: (data) => {
      reset(data);
    },
    onError: (error) => {
      console.error('Error fetching data:', error);
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => updateGeneralInformation(data, photo),
    onSuccess: () => {
      window.location.reload();
      toast.success(`Company Information updated successfully`);
    },
  });

  const onSubmit = (data) => {
    if (data.abn == null) data.abn = "";
    mutation.mutate({ ...data });
  };

  useEffect(() => {
    if (data?.main_phone) setValue('main_phone', data.main_phone);
  }, [data]);

  useEffect(() => {
    if (data) {
      setCountryId(data.country);
      setStateId(data.state);
      setCityId(data.city);
      setValue("city", data.city);
      setValue("state", data.state);
      setValue("country", data.country);
    }
  }, [data]);

  if (isLoading) return <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>;

  const handleEditGroup = () => {
    setIsEditingGroup(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Helmet>
        <title>MeMate - General Information</title>
      </Helmet>
      <div className='headSticky'>
        <h1>Company Information</h1>
        <div className='contentMenuTab'>
          <ul>
            <li className='menuActive'><Link to="/settings/generalinformation">General Information</Link></li>
            <li><Link to="/settings/generalinformation/bank-details">Bank Details </Link></li>
            <li><Link to="/settings/generalinformation/region-and-language">Region & Language</Link></li>
          </ul>
        </div>
      </div>
      <div className={`content_wrap_main ${isEditingGroup ? 'isEditingwrap' : ''}`} style={{ height: `calc(100vh - 230px - ${trialHeight}px - ${editingHeight}px)` }}>
        <div className='content_wrapper'>
          <div className="listwrapper">
            <div className="topHeadStyle">
              <div className=''>
                <h2>General Information</h2>
                {!isEditingGroup ? (
                  <></>
                ) : (
                  <p>Provide key details about your company</p>
                )}
              </div>

              {!isEditingGroup && (
                <Link to="#" onClick={handleEditGroup}>Edit<PencilSquare color="#344054" size={20} /></Link>
              )}
            </div>

            <ul>
              <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                <div className={styles.editinfo}>
                  <span>Company Legal Name
                    {isEditingGroup && (
                      <span className="required">*</span>
                    )}
                  </span>
                  {!isEditingGroup ? (
                    <strong>{data?.legal_name}</strong>
                  ) : (
                    <div>
                      <div className={`inputInfo ${errors?.legal_name ? 'error-border' : ''}`}>
                        <input
                          {...register("legal_name")}
                          placeholder='Enter company legal name'
                          defaultValue={data?.legal_name}
                        />
                        {errors?.legal_name && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                      </div>
                      {errors?.legal_name && <p className="error-message">{errors?.legal_name?.message}</p>}
                    </div>
                  )}
                </div>
                {!isEditingGroup ? (
                  <>
                  </>
                ) : (
                  <div className={styles.editpara}>
                    <p>Please provide the complete legal name of your company, as it will be displayed on outgoing documentation.</p>
                  </div>
                )}
              </li>
              <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                <div className={styles.editinfo}>
                  <span>Company Trading name
                    {isEditingGroup && (
                      <span className="required">*</span>
                    )}
                  </span>
                  {!isEditingGroup ? (
                    <strong>{data.trading_name} </strong>
                  ) : (
                    <div>
                      <div className={`inputInfo ${errors.trading_name ? 'error-border' : ''}`}>
                        <input
                          {...register("trading_name")}
                          placeholder='Enter Trading Name'
                          defaultValue={data.trading_name}
                        />
                        {errors.trading_name && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                      </div>
                      {errors.trading_name && <p className="error-message">{errors.trading_name.message}</p>}
                    </div>
                  )}
                </div>
                {!isEditingGroup ? (
                  <>
                  </>
                ) : (
                  <div className={styles.editpara}>
                    <p>Please enter a trading name. This will be displayed when you communicate with contractors, clients, and suppliers.</p>
                  </div>
                )}
              </li>
              <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                <div className={styles.editinfo}>
                  <span>ABN</span>
                  {!isEditingGroup ? (
                    <strong>{data.abn} </strong>
                  ) : (
                    <div>
                      <div className={`inputInfo ${errors.abn ? 'error-border' : ''}`}>
                        <input
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
                          placeholder='Enter ABN'
                          defaultValue={data.abn}
                        />
                        {errors.abn && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                      </div>
                      {errors.abn && <p className="error-message">{errors.abn.message}</p>}
                    </div>
                  )}
                </div>
                {!isEditingGroup ? (
                  <>
                  </>
                ) : (
                  <div className={styles.editpara}>
                    <p>Please input Active Business Number</p>
                  </div>
                )}
              </li>
              <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                <div className={styles.editinfo}>
                  <span>Main Company Email
                    {isEditingGroup && (
                      <span className="required">*</span>
                    )}
                  </span>
                  {!isEditingGroup ? (
                    <strong>{data.main_email} <Link45deg color="#158ECC" size={20} /></strong>
                  ) : (
                    <div>
                      <div className={`inputInfo ${errors.main_email ? 'error-border' : ''}`}>
                        <input
                          {...register("main_email")}
                          placeholder='Enter Email'
                          defaultValue={data.main_email}
                        />
                        {errors.main_email && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                      </div>
                      {errors.main_email && <p className="error-message">{errors.main_email.message}</p>}
                    </div>
                  )}
                </div>
                {!isEditingGroup ? (
                  <>
                  </>
                ) : (
                  <div className={styles.editpara}>
                    <p>Insert emails which will be used to send all your automatic outgoing emails and notifications.</p>
                  </div>
                )}
              </li>
              <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                <div className={styles.editinfo}>
                  <span>Main Company Phone Number</span>
                  {!isEditingGroup ? (
                    <strong>{data.main_phone} <Telephone color="#158ECC" size={20} /></strong>
                  ) : (
                    <div>
                      <Controller
                        name="main_phone"
                        control={control}
                        render={({ field }) => (
                          <PhoneInput
                            className='phoneInput'
                            defaultCountry='au'
                            value={field.value || ''}
                            placeholder='Enter Phone Number'
                            style={{ width: '315px' }}
                            onChange={(phone) => field.onChange(phone)}
                          />
                        )}
                      />
                      {errors.main_phone && <p className="error-message">{errors.main_phone.message}</p>}
                    </div>
                  )}
                </div>
                {!isEditingGroup ? (
                  <>
                  </>
                ) : (
                  <div className={styles.editpara}>
                    <p>Insert emails which will be used to send all your automatic outgoing emails and notifications.</p>
                  </div>
                )}
              </li>

              <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                <div className={styles.editinfo}>
                  <span>Country
                    {isEditingGroup && (
                      <span className="required">*</span>
                    )}
                  </span>
                  {!isEditingGroup ? (
                    <strong>{data.country_name}</strong>
                  ) : (
                    <div>
                      <div className='inputInfo' style={{ width: '320px' }}>
                        <Dropdown
                          value={countryId}
                          defaultValue={data.country}
                          options={(countriesQuery && countriesQuery.data?.map((country) => ({
                            value: country.id,
                            label: country.name
                          }))) || []}
                          placeholder="Select a country"
                          className={clsx('w-100 rounded', { 'error-border': errors.country })}
                          onChange={(e) => {
                            setValue("country", e.value);
                            setCountryId(e.value);
                          }}
                          loading={countriesQuery?.isFetching}
                          disabled={countriesQuery?.isFetching}
                          filter
                          filterInputAutoFocus={true}
                        />
                      </div>
                      {errors.country && <p className="error-message">{errors.country.message}</p>}
                    </div>
                  )}
                </div>
              </li>

              <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                <div className={styles.editinfo}>
                  <span>State
                    {isEditingGroup && (
                      <span className="required">*</span>
                    )}
                  </span>
                  {!isEditingGroup ? (
                    <strong>{data.state_name}</strong>
                  ) : (
                    <div>
                      <div className='inputInfo' style={{ width: '320px' }}>
                        <Dropdown
                          value={stateId}
                          defaultValue={data.state}
                          options={(statesQuery && statesQuery.data?.map((state) => ({
                            value: state.id,
                            label: state.name
                          }))) || []}
                          placeholder="Select a state"
                          className={clsx('w-100 rounded', { 'error-border': errors.state })}
                          onChange={(e) => {
                            setValue("state", e.value);
                            setStateId(e.value);
                          }}
                          loading={statesQuery?.isFetching}
                          disabled={statesQuery?.isFetching}
                          emptyMessage={!countryId ? "Select a country first" : "No states found"}
                          filter
                          filterInputAutoFocus={true}
                        />
                      </div>
                      {errors.state && <p className="error-message">{errors.state.message}</p>}
                    </div>
                  )}
                </div>
              </li>

              <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                <div className={styles.editinfo}>
                  <span>City
                    {isEditingGroup && (
                      <span className="required">*</span>
                    )}
                  </span>
                  {!isEditingGroup ? (
                    <strong>{data.city_name}</strong>
                  ) : (
                    <div>
                      <div className='inputInfo' style={{ width: '320px' }}>
                        <Dropdown
                          value={cityId}
                          defaultValue={data.city}
                          options={(citiesQuery && citiesQuery.data?.map((city) => ({
                            value: city.id,
                            label: city.name
                          }))) || []}
                          placeholder="Select a city"
                          className={clsx('w-100 rounded', { 'error-border': errors.city })}
                          onChange={(e) => {
                            setValue("city", e.value);
                            setCityId(e.value);
                          }}
                          loading={citiesQuery?.isFetching}
                          disabled={citiesQuery?.isFetching}
                          emptyMessage={!stateId ? "Select a state first" : "No cities found"}
                          filter
                          filterInputAutoFocus={true}
                        />
                      </div>
                      {errors.city && <p className="error-message">{errors.city.message}</p>}
                    </div>
                  )}
                </div>
              </li>

              <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                <div className={styles.editinfo}>
                  <span>Street Address</span>
                  {!isEditingGroup ? (
                    <strong>{data.address}</strong>
                  ) : (
                    <div>
                      <div className={`inputInfo ${errors.address ? 'error-border' : ''}`}>
                        <input
                          {...register("address")}
                          placeholder='Enter Address'
                          defaultValue={data.address}
                        />
                        {errors.address && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                      </div>
                      {errors.address && <p className="error-message">{errors.address.message}</p>}
                    </div>
                  )}
                </div>
                {!isEditingGroup ? (
                  <>
                  </>
                ) : (
                  <div className={styles.editpara}>
                    <p></p>
                  </div>
                )}
              </li>

              <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                <div className={styles.editinfo}>
                  <span>Postcode</span>
                  {!isEditingGroup ? (
                    <strong>{data.postcode}</strong>
                  ) : (
                    <div>
                      <div className={`inputInfo ${errors.postcode ? 'error-border' : ''}`}>
                        <input
                          {...register("postcode")}
                          placeholder='Enter postcode'
                          defaultValue={data.postcode}
                          type="number"
                        />
                        {errors.postcode && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                      </div>
                      {errors.postcode && <p className="error-message">{errors.postcode.message}</p>}
                    </div>
                  )}
                </div>
                {!isEditingGroup ? (
                  <>
                  </>
                ) : (
                  <div className={styles.editpara}>
                    <p></p>
                  </div>
                )}
              </li>
              <li className={`${isEditingGroup ? `${styles.editBorderWrap}` : `${styles.viewBorderWrap}`}`}>
                <div className={styles.editinfo}>
                  <span>Company Logo for Documentation</span>
                  {!isEditingGroup ? (
                    <div className='d-flex justify-content-center align-items-center' style={{ border: '1px solid #dedede', width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden' }}>
                      <FallbackImage photo={data.company_logo} has_photo={data.has_photo} is_business={true} size={28} />
                    </div>
                  ) : (

                    <div className="upload-btn-wrapper">
                      <FileUpload photo={photo} data={data} setPhoto={setPhoto} />
                    </div>
                  )}
                </div>

                {!isEditingGroup ? (
                  <>
                  </>
                ) : (

                  <div className={styles.editpara}>
                    <div className='logo'>
                      <h5>Company logo</h5>
                      <p>Upload the logo for your unique quotes and invoices.</p>
                    </div>

                  </div>

                )}

              </li>

            </ul>
          </div>

        </div>
      </div>
      {isEditingGroup && (
        <div className='updateButtonGeneral'>
          <button className="cancel" type='button' onClick={() => setIsEditingGroup(false)}>Cancel</button>
          <button type="submit" className="save mr-3" disabled={mutation.isPending}>
            {mutation.isPending ? 'Updating...' : 'Update'}
          </button>
        </div>
      )}
    </form>
  );
}



function FileUpload({ photo, setPhoto, data }) {
  const [show, setShow] = useState(false);

  return (
    <section className="container mb-3" style={{ marginTop: '24px', padding: '0px' }}>
      {/* <label className='mb-2' style={{ color: '#475467', fontSize: '14px', fontWeight: '500' }}>App Logo</label> */}
      <div className='d-flex justify-content-center align-items-center flex-column' style={{ width: '100%', minHeight: '126px', padding: '16px', background: '#fff', borderRadius: '4px', border: '1px solid #D0D5DD' }}>
        {
          photo?.croppedImageBase64 ? (
            <div className='text-center'>
              <img
                alt='uploaded-file'
                src={photo?.croppedImageBase64}
                style={{ width: '64px', height: '64px', marginBottom: '12px' }}
              />
            </div>
          ) : (
            <button type='button' onClick={() => setShow(true)} className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', padding: '2px', border: '1px solid #EAECF0', background: '#fff', borderRadius: '4px', marginBottom: '16px' }}>
              {data?.company_logo && data.has_photo ? (
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={data?.company_logo}
                    style={{ width: '100%' }}
                    alt="Uploaded Photo"
                  />
                </div>
              ) : (
                <Upload />
              )}
            </button>
          )
        }
        <p className='mb-0' style={{ color: '#475467', fontSize: '14px' }}><span style={{ color: '#1AB2FF', fontWeight: '600', cursor: 'pointer' }} onClick={() => setShow(true)}>Click to upload</span></p>
        <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
      </div>
      <FileUploader show={show} setShow={setShow} setPhoto={setPhoto} />
    </section>
  );
}
export default GeneralInformation;
