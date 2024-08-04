import React, { useEffect, useMemo, useState, useContext } from 'react';
import { CardList, ChevronLeft, Envelope, InfoSquare, Person } from 'react-bootstrap-icons';
import { Link, NavLink, useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Col, Row } from 'react-bootstrap';
import exclamationCircle from "../../../../../assets/images/icon/exclamation-circle.svg";
import { PhoneInput } from 'react-international-phone';
import countryList from 'react-select-country-list';
import Select from 'react-select';
import { ClientContext } from './client-provider';

// Validation schema
const schema = yup
    .object({
        firstname: yup.string().required("First name is required"),
        lastname: yup.string().required("Last name is required"),
        email: yup.string().email("Invalid email address").required("Email is required"),
        phone: yup.string({
            country: yup.string().required("Country is required"),
            number: yup.string().required("Phone number is required")
        }),
        country: yup.string().required("Country is required"),
        address: yup.object({
            city: yup.string().required("City is required"),
            address: yup.string().required("Address is required"),
            state: yup.string().required("State is required"),
            postcode: yup.string().required("Postcode is required")
        })
    })
    .required();

const IndividualClientInformation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { login } = useContext(ClientContext);
    const countryOptions = useMemo(() => countryList().getData(), []);
    const [defaultValues, setDefaultValues] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: { country: '', number: '' },
        country: '',
        address: {
            city: "",
            address: "",
            state: "",
            postcode: ""
        }
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

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                const fetchedData = {
                    firstname: 'John',
                    lastname: 'Doe',
                    email: 'john.doe@example.com',
                    phone: { country: 'US', number: '1234567890' },
                    country: 'US',
                    address: {
                        city: 'New York',
                        address: '5th Avenue',
                        state: 'NY',
                        postcode: '10001'
                    }
                };
                setDefaultValues(fetchedData);
                // Set the form values
                Object.entries(fetchedData).forEach(([key, value]) => setValue(key, value));
            };

            fetchData();
        }
    }, [id, setValue]);

    const onSubmit = (data) => {
        if (id) {
            console.log('Updating record:', data);
        } else {
            console.log('Creating new record:', data);
        }
        login(data);
        //navigate('/sales/newquote/selectyourclient/client-information/scope-of-work');
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
                                <li className='deactiveColorBox'><span><CardList color="#D0D5DD" size={15} /></span> <p>Scope of Work</p> </li>
                            </ul>
                        </div>
                        <div className='individual height'>
                            <div className="formgroupWrap1">
                                <ul className='mt-4'>
                                    <li>
                                        <NavLink className="ActiveClient businessTab" to="#">
                                            <span><Person color="#667085" size={24} /></span> Individual Client
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>

                            <div className='formgroupboxs' style={{ paddingTop: '24px' }}>

                                <Row className='text-left'>
                                    <Col sm={6}>
                                        <div className="formgroup mb-2 mt-0">
                                            <label>First Name</label>
                                            <div className={`inputInfo ${errors.firstname ? 'error-border' : ''}`}>
                                                <input {...register("firstname")} placeholder='Enter first name' />
                                                {errors.firstname && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                                            </div>
                                            {errors.firstname && <p className="error-message">{errors.firstname.message}</p>}
                                        </div>
                                    </Col>
                                    <Col sm={6}>
                                        <div className="formgroup mb-2 mt-0">
                                            <label>Last Name</label>
                                            <div className={`inputInfo ${errors.lastname ? 'error-border' : ''}`}>
                                                <input {...register("lastname")} placeholder='Enter last name' />
                                                {errors.lastname && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                                            </div>
                                            {errors.lastname && <p className="error-message">{errors.lastname.message}</p>}
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="formgroup mb-2 mt-3">
                                            <label>Email</label>
                                            <div className={`inputInfo ${errors.email ? 'error-border' : ''}`}>
                                                <Envelope color='#667085' style={{ width: '20px', height: '20px' }} />
                                                <input
                                                    {...register("email")}
                                                    placeholder='example@email.com'
                                                    style={{ paddingLeft: '8px' }}
                                                />
                                                {errors.email && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                                            </div>
                                            {errors.email && <p className="error-message">{errors.email.message}</p>}
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="formgroup phoneInputBoxStyle mb-2 mt-3">
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
                                        <div className="formgroup mb-2 mt-3">
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
                                            {errors.country && <p className="error-message">{errors.country.message}</p>}
                                        </div>
                                    </Col>

                                    <Col sm={6}></Col>

                                    <Col sm={6}>
                                        <div className="formgroup mb-2 mt-3">
                                            <label>Street Address</label>
                                            <div className={`inputInfo ${errors.address?.address ? 'error-border' : ''}`}>
                                                <input
                                                    {...register("address.address")}
                                                    placeholder='Enter street address'
                                                />
                                                {errors.address?.address && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                                            </div>
                                            {errors.address?.address && <p className="error-message">{errors.address.address.message}</p>}
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="formgroup mb-2 mt-3">
                                            <label>City/Suburb</label>
                                            <div className={`inputInfo ${errors.address?.city ? 'error-border' : ''}`}>
                                                <input
                                                    {...register("address.city")}
                                                    placeholder='Enter city'
                                                />
                                                {errors.address?.city && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                                            </div>
                                            {errors.address?.city && <p className="error-message">{errors.address.city.message}</p>}
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="formgroup mb-2 mt-3">
                                            <label>State</label>
                                            <div className={`inputInfo ${errors.address?.state ? 'error-border' : ''}`}>
                                                <input
                                                    {...register("address.state")}
                                                    placeholder='Enter state'
                                                />
                                                {errors.address?.state && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                                            </div>
                                            {errors.address?.state && <p className="error-message">{errors.address.state.message}</p>}
                                        </div>
                                    </Col>

                                    <Col sm={6}>
                                        <div className="formgroup mb-2 mt-3">
                                            <label>Postcode</label>
                                            <div className={`inputInfo ${errors.address?.postcode ? 'error-border' : ''}`}>
                                                <input
                                                    {...register("address.postcode")}
                                                    placeholder='Enter postcode'
                                                />
                                                {errors.address?.postcode && <img className="ExclamationCircle" src={exclamationCircle} alt="Exclamation Circle" />}
                                            </div>
                                            {errors.address?.postcode && <p className="error-message">{errors.address.postcode.message}</p>}
                                        </div>
                                    </Col>
                                </Row>

                            </div>
                        </div>
                        <div className='individual bottomBox'>
                            <Link to={id ? "/sales/newquote/selectyourclient/existing-clients" : "/sales/newquote/selectyourclient/new-clients"}>
                                <button type="button" className="cancel-button">
                                    Cancel
                                </button>
                            </Link>

                            <button type="submit" className="submit-button">
                                Next Step
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default IndividualClientInformation;
