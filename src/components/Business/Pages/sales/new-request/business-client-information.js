import React, { useEffect, useMemo, useState } from 'react';
import { Building, ChevronDown, ChevronLeft, Envelope, InfoSquare, Person, Upload } from 'react-bootstrap-icons';
import { NavLink, useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Col, Row, Button } from 'react-bootstrap';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import countryList from 'react-select-country-list';
import Select from 'react-select';
import { FormControl, Select as MuiSelect, SelectChangeEvent } from '@mui/material';
import { PhoneInput } from 'react-international-phone';
import { MenuItem } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { createNewBusinessClient } from '../../../../../APIs/ClientsApi';


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
      address: yup.string().required('Address is required'),
      city: yup.number().typeError("City must be a number").required("City is required"),
      state: yup.number().typeError("State must be a number").required("State is required"),
      postcode: yup.string().required('Postcode is required'),
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
    })
  ).required(),

  industry: yup.number().typeError("Enter a valid industry").required('Industry is required'),
  payment_terms: yup.number().typeError("Enter a valid payment terms").required('Payment terms are required'),

}).required();

const BusinessClientInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState({});
  const countryOptions = useMemo(() => countryList().getData(), []);
  const [defaultValues, setDefaultValues] = useState({
    phone: { country: '', number: '+61' },
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
    if (id) {
      console.log('Updating record:', data);
    } else {
      console.log('Creating new record:', data);
      mutation.mutate(data);
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
                            <MenuItem value="37" data-value="0.00">Regular - 0.00%</MenuItem>
                            <MenuItem value="38" data-value="2.50">Bronze - 2.50%</MenuItem>
                            <MenuItem value="39" data-value="5.00">Silver - 5.00%</MenuItem>
                            <MenuItem value="40" data-value="7.50">Gold - 7.50%</MenuItem>
                            <MenuItem value="41" data-value="10.00">Platinum - 10.00%</MenuItem>
                            <MenuItem value="42" data-value="12.50">Diamond - 12.50%</MenuItem>
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

                      <Row className='text-left'>
                        {/* <Col sm={6}>
                          <div className="formgroup mb-3 mt-0">
                            <label>Country</label>
                            <Controller
                              name="country"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  className={`custom-select-country ${errors.country ? 'error-border' : ''}`}
                                  options={countryOptions}
                                  onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                                  value={countryOptions.find(option => option.value === field.value)}
                                />
                              )}
                            />
                            {errors.addresses?.[index]?.country && <p className="error-message">{errors.addresses?.[index].country.message}</p>}
                          </div>
                        </Col>
                        <Col sm={6}></Col> */}

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
                            <label>City/Suburb</label>
                            <div className={`inputInfo ${errors.addresses?.[index]?.city ? 'error-border' : ''}`}>
                              <input {...register(`addresses.${index}.city`)} placeholder="City" />
                              {errors.addresses?.[index]?.city && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                            </div>
                            {errors.addresses?.[index]?.city && <p className="error-message">{errors.addresses[index].city.message}</p>}
                          </div>
                        </Col>

                        <Col sm={6}>
                          <div className="formgroup mb-3 mt-0">
                            <label>State</label>
                            <input {...register(`addresses.${index}.state`)} placeholder="State" />
                            <Controller
                              name={`addresses.${index}.state`}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  placeholder="Select state"
                                  className={`custom-select-country ${errors.addresses?.[index]?.state ? 'error-border' : ''}`}
                                  options={[
                                    { value: '2', label: 'NSW' },
                                    { value: '3', label: 'QLD' },
                                    { value: '4', label: 'SA' },
                                    { value: '5', label: 'TAS' },
                                    { value: '6', label: 'VIC' },
                                    { value: '7', label: 'WA' }
                                  ]}
                                  onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                                  value={countryOptions.find(option => option.value === field.value)}
                                />
                              )}
                            />
                            {errors.addresses?.[index]?.state && <p className="error-message">{errors.addresses[index].state.message}</p>}
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
                            <MenuItem value="193">Agriculture</MenuItem>
                            <MenuItem value="194">Apparel</MenuItem>
                            <MenuItem value="195">Automotive</MenuItem>
                            <MenuItem value="196">Banking</MenuItem>
                            <MenuItem value="197">Biotechnology</MenuItem>
                            <MenuItem value="198">Chemicals</MenuItem>
                            <MenuItem value="199">Communications</MenuItem>
                            <MenuItem value="200">Construction</MenuItem>
                            <MenuItem value="201">Education</MenuItem>
                            <MenuItem value="202">Electronics</MenuItem>
                            <MenuItem value="203">Energy</MenuItem>
                            <MenuItem value="204">Engineering</MenuItem>
                            <MenuItem value="205">Entertainment</MenuItem>
                            <MenuItem value="206">Environmental</MenuItem>
                            <MenuItem value="207">Finance</MenuItem>
                            <MenuItem value="208">Food &amp; Beverage</MenuItem>
                            <MenuItem value="209">Government</MenuItem>
                            <MenuItem value="210">Healthcare</MenuItem>
                            <MenuItem value="211">Hospitality</MenuItem>
                            <MenuItem value="212">Insurance</MenuItem>
                            <MenuItem value="213">Machinery</MenuItem>
                            <MenuItem value="214">Manufacturing</MenuItem>
                            <MenuItem value="215">Media</MenuItem>
                            <MenuItem value="216">Non For Profit</MenuItem>
                            <MenuItem value="217">Other</MenuItem>
                            <MenuItem value="218">Recreation</MenuItem>
                            <MenuItem value="219">Retail</MenuItem>
                            <MenuItem value="220">Shipping</MenuItem>
                            <MenuItem value="221">Software</MenuItem>
                            <MenuItem value="222">Technology</MenuItem>
                            <MenuItem value="223">Telecommunications</MenuItem>
                            <MenuItem value="224">Utilities</MenuItem>
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
                    <FileUpload />
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


function FileUpload(props) {
  const [files, setFiles] = useState([]);
  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    maxFiles: 1,
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    }
  });

  const remove = (e) => {
    e.stopPropagation();
    setFiles([]);
  }

  const thumbs = files?.map(file => (
    <div key={file.name} className='text-center'>
      <img
        alt='uploaded-file'
        src={file.preview}
        style={{ width: '64px', height: '64px', marginBottom: '12px' }}
        onLoad={() => { URL.revokeObjectURL(file.preview) }}
      />
      <div className='d-flex' style={{ gap: '12px' }}>
        <button style={{ background: '#fff', border: 'none', color: '#1AB2FF', fontWeight: '500', fontSize: '14px' }}>Update</button>
        <button type='button' onClick={remove} style={{ background: '#fff', border: 'none', color: '#B42318', fontWeight: '500', fontSize: '14px' }}>Delete</button>
      </div>
    </div>
  ));
  console.log('thumbs: ', thumbs);

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <section className="container mb-3" style={{ marginTop: '24px', padding: '0px' }}>
      <label className='mb-2' style={{ color: '#475467', fontSize: '14px', fontWeight: '500' }}>App Logo</label>
      <div {...getRootProps({ className: 'dropzone d-flex justify-content-center align-items-center flex-column' })} style={{ width: '100%', height: '126px', background: '#fff', borderRadius: '4px', border: '1px solid #D0D5DD' }}>
        <input {...getInputProps()} />
        {
          thumbs && thumbs.length ? thumbs : (
            <>

              <button type='button' className='d-flex justify-content-center align-items-center' style={{ width: '40px', height: '40px', padding: '10px', border: '1px solid #EAECF0', background: '#fff', borderRadius: '4px', marginBottom: '16px' }}>
                <Upload />
              </button>
              <p className='mb-0' style={{ color: '#475467', fontSize: '14px' }}><span style={{ color: '#1AB2FF', fontWeight: '600' }}>Click to upload</span> or drag and drop</p>
              <span style={{ color: '#475467', fontSize: '12px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</span>
            </>
          )
        }
      </div>
    </section>
  );
}

export default BusinessClientInformation;