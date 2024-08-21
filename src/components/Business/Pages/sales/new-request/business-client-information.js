import React, { useEffect, useState } from 'react';
import { Building, ChevronDown, ChevronLeft, Envelope, InfoSquare, Person, Upload } from 'react-bootstrap-icons';
import { NavLink, useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { nanoid } from 'nanoid';
import { Col, Row, Button } from 'react-bootstrap';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import Select from 'react-select';
import { FormControl, Select as MuiSelect } from '@mui/material';
import { PhoneInput } from 'react-international-phone';
import { MenuItem } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createNewBusinessClient, getCities, getClientCategories, getClientIndustries, getCountries, getStates } from '../../../../../APIs/ClientsApi';
import FileUploader from '../../../../../ui/file-uploader/file-uploader';


const schema = yup.object({
  name: yup.string().required('Company name is required'),
  category: yup.number().typeError("Enter a valid category").required('Category is required'),
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
      firstname: yup.string().required('First name is required'),
      lastname: yup.string().required('Last name is required'),
      phone: yup.string({
        country: yup.string().required("Country is required"),
        number: yup.string().required("Phone number is required")
      }),
      email: yup.string().email('Invalid email').required('Email is required'),
      position: yup.string().required('Position is required'),
      is_main: yup.boolean().default(false).required('Main contact selection is required'),
    })
  ).required(),

  industry: yup.number().typeError("Enter a valid industry").required('Industry is required'),
  payment_terms: yup.number().typeError("Enter a valid payment terms").required('Payment terms are required'),

}).required();

const BusinessClientInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState({});
  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getClientCategories });
  const industriesQuery = useQuery({ queryKey: ['industries'], queryFn: getClientIndustries });
  const countriesQuery = useQuery({ queryKey: ['countries'], queryFn: getCountries, enabled: true });
  const statesQuery = useQuery({ queryKey: ['states', countryId], queryFn: () => getStates(countryId), enabled: !!countryId, retry: 1 });
  const citiesQuery = useQuery({ queryKey: ['cities', stateId], queryFn: () => getCities(stateId), enabled: !!stateId });

  const [defaultValues, setDefaultValues] = useState({
    phone: { country: '', number: '' },
    contact_persons: [{}],
    addresses: [{}],
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
    control,
    name: 'contact_persons'
  });

  const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({
    control,
    name: 'addresses'
  });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        // Replace with your data fetching logic
        const fetchedData = {
          name: 'Sample Company',
          category: 1,
          industry: 1,
          abn: '123456789',
          phone: '1234567890',
          email: 'sample@example.com',
          website: 'http://example.com',
          payment_terms: 30,
          contact_persons: [
            {
              firstname: 'John',
              lastname: 'Doe',
              email: 'john.doe@example.com',
              phone: '1234567890',
              position: 'Manager'
            }
          ],
          addresses: [
            {
              country: 'US',
              city: 1,
              address: '5th Avenue',
              state: 2,
              postcode: '10001'
            }
          ]
        };
        setDefaultValues(fetchedData);
        // Set the form values
        Object.entries(fetchedData).forEach(([key, value]) => setValue(key, value));
      };

      fetchData();
    }
  }, [id, setValue]);

  const mutation = useMutation({
    mutationFn: (data) => createNewBusinessClient(data),
    onSuccess: (response) => {
      console.log('response: ', response);
      if (response.client)
        navigate(`/sales/newquote/selectyourclient/client-information/scope-of-work/${response.client}`);
      else {
        alert("Business Client could not be created. Try again later.");
      }
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      alert(error.message);
    }
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    if (id) {
      console.log('Updating record:', data);
    } else {
      console.log('Creating new record:', data);
      for (const key in data) formData.append(key, data[key]);
      if (photo?.croppedImageBlob) {
        console.log('photo?.croppedImageBlob: ', photo?.croppedImageBlob);
        const photoHintId = nanoid(6);
        formData.append('photo', photo?.croppedImageBlob, `${photoHintId}.jpg`);
      }
      mutation.mutate(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="newQuotePage existingClients borderSkyColor">
        <div style={{ height: 'calc(100vh - 249px)' }}>
          <div className="newQuoteBack">
            <NavLink to={id ? "/sales/newquote/selectyourclient/existing-clients" : "/sales/newquote/selectyourclient/new-clients"}>
              <button>
                <ChevronLeft color="#000000" size={20} /> &nbsp;&nbsp;Go Back
              </button>
            </NavLink>
          </div>
          <div className="newQuoteContent h-100">
            <div className='navStepClient'>
              <ul>
                <li><span><Person color="#D0D5DD" size={15} /></span> <p>Choose Client</p></li>
                <li className='activeClientTab'><span><InfoSquare color="#D0D5DD" size={15} /></span> <p>Client Information</p> </li>
                <li className='deactiveColorBox'><span><Building color="#D0D5DD" size={15} /></span> <p>Scope of Work</p> </li>
              </ul>
            </div>

            <div className='individual height'>
              <div className="formgroupWrap1">
                <ul className='mt-4'>
                  <li>
                    <NavLink className="ActiveClient businessTab" to="#"><span><Building color="#1AB2FF " size={24} /></span> Business Client</NavLink>
                  </li>
                </ul>
              </div>

              <div className='formgroupboxs' style={{ paddingTop: '24px' }}>
                <Row className='text-left'>
                  <h2 style={{ marginBottom: '16px' }}>Company Details</h2>
                  <Col sm={6}>
                    <div className="formgroup mb-3 mt-0">
                      <label>Company Name</label>
                      <div className={`inputInfo ${errors.name ? 'error-border' : ''}`}>
                        <input {...register("name")} placeholder='Company Name' />
                        {errors.name && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                      </div>
                      {errors.name && <p className="error-message">{errors.name.message}</p>}
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="formgroup mb-3 mt-0">
                      <label>Customer Category</label>
                      <div className={`inputInfo ${errors.category ? 'error-border' : ''}`}>
                        <FormControl className='customerCategory' sx={{ m: 0, minWidth: `102%` }}>
                          <MuiSelect
                            displayEmpty
                            {...register("category")}
                            inputProps={{ 'aria-label': 'Without label' }}
                            IconComponent={!errors.category ? ChevronDown : ""}
                            defaultValue={""}
                            style={{ color: '#667085' }}
                          >
                            <MenuItem value="">Select category</MenuItem>
                            {categoriesQuery && categoriesQuery.data && categoriesQuery.data?.map((category) => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
                          </MuiSelect>
                        </FormControl>
                        {errors.category && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" style={{ position: 'relative', right: '26px' }} />}
                      </div>
                      {errors.category && <p className="error-message">{errors.category.message}</p>}
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="formgroup mb-3 mt-0">
                      <label>ABN</label>
                      <div className={`inputInfo ${errors.abn ? 'error-border' : ''}`}>
                        <input {...register("abn")} placeholder='ABN' />
                        {errors.abn && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                      </div>
                      {errors.abn && <p className="error-message">{errors.abn.message}</p>}
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="formgroup phoneInputBoxStyle mb-3 mt-0">
                      <label>Phone number</label>
                      <div className={`inputInfo ${errors.phone ? 'error-border' : ''}`}>
                        <Controller
                          name="phone"
                          control={control}
                          render={({ field }) => (
                            <PhoneInput
                              defaultCountry='au'
                              country={field.value?.country}
                              value={field.value?.number}
                              onChange={(phone) => field.onChange(phone)}
                            />
                          )}
                        />
                        {errors.phone && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                      </div>
                      {errors.phone && <p className="error-message">{errors.phone.message}</p>}
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="formgroup mb-2 mt-0">
                      <label>Email</label>
                      <div className={`inputInfo ${errors.email ? 'error-border' : ''}`}>
                        <Envelope color='#667085' style={{ width: '20px', height: '20px' }} />
                        <input {...register("email")} placeholder='Email' style={{ paddingLeft: '8px' }} />
                        {errors.email && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                      </div>
                      {errors.email && <p className="error-message">{errors.email.message}</p>}
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="formgroup mb-2 mt-0">
                      <label>Website</label>
                      <div className={`inputInfo ${errors.website ? 'error-border' : ''}`}>
                        <input {...register("website")} placeholder='Website' />
                        {errors.website && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                      </div>
                      {errors.website && <p className="error-message">{errors.website.message}</p>}
                    </div>
                  </Col>

                </Row>


                <div className="formgroupboxs text-left" style={{ marginTop: '24px' }}>
                  {addressFields.map((item, index,) => (
                    <div key={item.id} className="address">
                      <h2 style={{ marginBottom: '16px', marginTop: "16px" }}>{index === 0 ? "Main Company Address" : "Secondary Company Address"}</h2>
                      <input type="hidden" {...register(`addresses.${index}.is_main`)} value={index === 0} />

                      <Row className='text-left'>
                        <Col sm={6}>
                          <div className="formgroup mb-3 mt-0">
                            <label>Country</label>
                            <Controller
                              name={`addresses.${index}.country`}
                              control={control}
                              defaultValue={""}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  placeholder="Select country"
                                  className={`custom-select-country ${errors.addresses?.[index]?.country ? 'error-border' : ''}`}
                                  options={(countriesQuery && countriesQuery?.data?.map((country) => ({ value: country.id, label: country.name }))) || []}
                                  onChange={(selectedOption) => {
                                    field.onChange(selectedOption?.value);
                                    setCountryId(selectedOption?.value);
                                  }}
                                  value={countriesQuery?.data?.find(option => option.value === field.value)}
                                />
                              )}
                            />
                            {errors.addresses?.[index]?.country && <p className="error-message">{errors.addresses?.[index].country.message}</p>}
                          </div>
                        </Col>
                        <Col sm={6}></Col>

                        <Col sm={6}>
                          <div className="formgroup mb-3 mt-0">
                            <label>State</label>
                            <Controller
                              name={`addresses.${index}.state`}
                              control={control}
                              defaultValue={""}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  placeholder="Select state"
                                  className={`custom-select-country ${errors.addresses?.[index]?.state ? 'error-border' : ''}`}
                                  options={(statesQuery && statesQuery?.data?.map((state) => ({ value: state.id, label: state.name }))) || []}
                                  onChange={(selectedOption) => {
                                    field.onChange(selectedOption?.value);
                                    setStateId(selectedOption?.value);
                                    setValue(`addresses.${index}.city`, null); // Clear city value when state changes
                                  }}
                                  value={statesQuery?.data?.find(option => option.value === field.value)}
                                />
                              )}
                            />
                            {errors.addresses?.[index]?.state && <p className="error-message">{errors.addresses[index].state.message}</p>}
                          </div>
                        </Col>

                        <Col sm={6}>
                          <div className="formgroup mb-3 mt-0">
                            <label>City/Suburb</label>
                            <Controller
                              name={`addresses.${index}.city`}
                              control={control}
                              defaultValue={""}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  placeholder="Select city"
                                  className={`custom-select-country ${errors.addresses?.[index]?.state ? 'error-border' : ''}`}
                                  options={(citiesQuery && citiesQuery?.data?.map((city) => ({ value: city.id, label: city.name }))) || []}
                                  onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                                  value={(citiesQuery?.data?.find(option => option.value === field.value))}
                                />
                              )}
                            />
                            {errors.addresses?.[index]?.city && <p className="error-message">{errors.addresses[index].city.message}</p>}
                          </div>
                        </Col>

                        <Col sm={6}>
                          <div className="formgroup mb-3 mt-0">
                            <label>Street Address</label>
                            <div className={`inputInfo ${errors.addresses?.[index]?.address ? 'error-border' : ''}`}>
                              <input {...register(`addresses.${index}.address`)} placeholder="Address" />
                              {errors.addresses?.[index]?.address && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.addresses?.[index]?.address && <p className="error-message">{errors.addresses[index].address.message}</p>}
                          </div>
                        </Col>

                        <Col sm={6}>
                          <div className="formgroup mb-3 mt-0">
                            <label>Postcode</label>
                            <div className={`inputInfo ${errors.addresses?.[index]?.postcode ? 'error-border' : ''}`}>
                              <input {...register(`addresses.${index}.postcode`)} placeholder="Postcode" />
                              {errors.addresses?.[index]?.postcode && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.addresses?.[index]?.postcode && <p className="error-message">{errors.addresses[index].postcode.message}</p>}
                          </div>
                        </Col>
                        <Col sm={12} className='d-flex justify-content-end align-items-center' style={{ gap: '8px' }}>
                          {index !== 0 && <Button type="button" className='delete-button-client' onClick={() => removeAddress(index)}>Delete Address</Button>}
                          {index === addressFields.length - 1 && <Button type="button" className='add-button-client' onClick={() => appendAddress({})}>Add New
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path
                                d="M10.0001 4.1665V15.8332M4.16675 9.99984H15.8334"
                                stroke="#344054"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Button>}
                        </Col>
                      </Row>
                    </div>
                  ))}
                </div>


                <div className="formgroupboxs text-left" style={{ marginTop: '24px' }}>
                  {contactFields.map((item, index) => (
                    <div key={item.id} className="contact-person">
                      <h2 style={{ marginBottom: '16px', marginTop: '16px' }}>{index === 0 ? "Contact Person" : "Other Contact Person"}</h2>
                      <input type="hidden" {...register(`contact_persons.${index}.is_main`)} value={index === 0} />

                      <Row className='text-left'>
                        <Col sm={6}>
                          <div className="formgroup mb-3 mt-0">
                            <label>First Name</label>
                            <div className={`inputInfo ${errors.contact_persons?.[index]?.firstname ? 'error-border' : ''}`}>
                              <input {...register(`contact_persons.${index}.firstname`)} placeholder="First Name" />
                              {errors.contact_persons?.[index]?.firstname && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.contact_persons?.[index]?.firstname && <p className="error-message">{errors.contact_persons[index].firstname.message}</p>}
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="formgroup mb-3 mt-0">
                            <label>Last Name</label>
                            <div className={`inputInfo ${errors.contact_persons?.[index]?.lastname ? 'error-border' : ''}`}>
                              <input {...register(`contact_persons.${index}.lastname`)} placeholder="Last Name" />
                              {errors.contact_persons?.[index]?.lastname && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.contact_persons?.[index]?.lastname && <p className="error-message">{errors.contact_persons[index].lastname.message}</p>}
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="formgroup mb-3 mt-0">
                            <label>Phone</label>
                            <div className={`inputInfo ${errors.contact_persons?.[index]?.phone ? 'error-border' : ''}`}>
                              <Controller
                                name={`contact_persons.${index}.phone`}
                                control={control}
                                render={({ field }) => (
                                  <PhoneInput
                                    country={field.value?.contact_persons?.[index]?.country}
                                    value={field.value?.contact_persons?.[index]?.number}
                                    onChange={(phone) => field.onChange(phone)}
                                  />
                                )}
                              />
                              {errors.contact_persons?.[index]?.phone && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.contact_persons?.[index]?.phone && <p className="error-message">{errors.contact_persons[index].phone.message}</p>}
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="formgroup mb-3 mt-0">
                            <label>Email</label>
                            <div className={`inputInfo ${errors.contact_persons?.[index]?.email ? 'error-border' : ''}`}>
                              <Envelope color='#667085' style={{ width: '20px', height: '20px' }} />

                              <input {...register(`contact_persons.${index}.email`)} placeholder="Email" style={{ paddingLeft: '8px' }} />
                              {errors.contact_persons?.[index]?.email && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.contact_persons?.[index]?.email && <p className="error-message">{errors.contact_persons[index].email.message}</p>}
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="formgroup mb-3 mt-0">
                            <label>Position</label>
                            <div className={`inputInfo ${errors.contact_persons?.[index]?.position ? 'error-border' : ''}`}>
                              <input {...register(`contact_persons.${index}.position`)} placeholder="Position" />
                              {errors.contact_persons?.[index]?.position && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.contact_persons?.[index]?.position && <p className="error-message">{errors.contact_persons[index].position.message}</p>}
                          </div>
                        </Col>
                        <Col sm={12} className='d-flex justify-content-end align-items-center' style={{ gap: '8px' }}>
                          {index !== 0 && <Button type="button" className='delete-button-client' onClick={() => removeContact(index)}>Delete Contact</Button>}
                          {index === contactFields.length - 1 && <Button type="button" className='add-button-client' onClick={() => appendContact({})}>Add New
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path
                                d="M10.0001 4.1665V15.8332M4.16675 9.99984H15.8334"
                                stroke="#344054"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Button>}
                        </Col>
                      </Row>
                    </div>
                  ))}
                </div>

                <Row className='text-left' style={{ paddingTop: '24px' }}>
                  <Col sm={6}>
                    <div className="formgroup mb-3 mt-0">
                      <label>Industry</label>
                      <div className={`inputInfo ${errors.industry ? 'error-border' : ''}`}>
                        <FormControl className='customerCategory' sx={{ m: 0, minWidth: `102%` }}>
                          <MuiSelect
                            displayEmpty
                            {...register("industry")}
                            inputProps={{ 'aria-label': 'Without label' }}
                            IconComponent={!errors.industry ? ChevronDown : ""}
                            defaultValue={""}
                            style={{ color: '#667085' }}
                          >
                            <MenuItem value="">Select Industry</MenuItem>
                            {industriesQuery?.data?.map((industry) => <MenuItem key={industry.id} value={industry.id}>{industry.name}</MenuItem>) || []}
                          </MuiSelect>
                        </FormControl>
                        <input {...register("industry")} placeholder='Industry' />
                        {errors.industry && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" style={{ position: 'relative', right: '26px' }} />}
                      </div>
                      {errors.industry && <p className="error-message">{errors.industry.message}</p>}
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="formgroup mb-3 mt-0">
                      <label>Payment Terms</label>
                      <div className={`inputInfo ${errors.payment_terms ? 'error-border' : ''}`}>
                        <FormControl className='customerCategory' sx={{ m: 0, minWidth: `102%` }}>
                          <MuiSelect
                            displayEmpty
                            {...register("payment_terms")}
                            inputProps={{ 'aria-label': 'Without label' }}
                            IconComponent={!errors.payment_terms ? ChevronDown : ''}
                            placeholder='Select category'
                            defaultValue={""}
                            style={{ color: '#667085' }}
                          >
                            <MenuItem value="">Select Payment Terms</MenuItem>
                            <MenuItem value="1">COD</MenuItem>
                            <MenuItem value="0">Prepaid</MenuItem>
                            <MenuItem value="7">Week</MenuItem>
                            <MenuItem value="14">Two weeks</MenuItem>
                            <MenuItem value="30">One month</MenuItem>
                          </MuiSelect>
                        </FormControl>
                        {errors.payment_terms && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" style={{ position: 'relative', right: '26px' }} />}
                      </div>
                      {errors.payment_terms && <p className="error-message">{errors.payment_terms.message}</p>}
                    </div>
                  </Col>

                  <Col sm={6}>
                    <FileUpload photo={photo} setPhoto={setPhoto} />
                  </Col>
                </Row>

              </div>
            </div>

            <div className='individual bottomBox'>
              <Link to={id ? "/sales/newquote/selectyourclient/existing-clients" : "/sales/newquote/selectyourclient/new-clients"}>
                <Button type="button" className="cancel-button">
                  Cancel
                </Button>
              </Link>

              <Button type="submit" className="submit-button">
                Next Step
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};


function FileUpload({ photo, setPhoto }) {
  const [show, setShow] = useState(false);

  return (
    <section className="container mb-3" style={{ marginTop: '24px', padding: '0px' }}>
      <label className='mb-2' style={{ color: '#475467', fontSize: '14px', fontWeight: '500' }}>App Logo</label>
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
            <button type='button' onClick={() => setShow(true)} className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', padding: '10px', border: '1px solid #EAECF0', background: '#fff', borderRadius: '4px', marginBottom: '16px' }}>
              <Upload />
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

export default BusinessClientInformation;
