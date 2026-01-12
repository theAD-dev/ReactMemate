import React, { useRef, useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import { CardList, ChevronLeft, InfoSquare, Person } from 'react-bootstrap-icons';
import { Link, NavLink, useParams, useNavigate } from 'react-router-dom';
import parsePhoneNumberFromString from 'libphonenumber-js';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import IndivisualForm from '../../../features/clients-features/new-client-create/indivisual-form';

const IndividualClientInformation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const formRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [isPending, setIsPending] = useState(false);

    // Get enquiry data from sessionStorage if available
    const getEnquiryData = () => {
        try {
            const storedData = sessionStorage.getItem('enquiry-to-sale');
            if (storedData) {
                return JSON.parse(storedData);
            }
        } catch (error) {
            console.error('Failed to parse enquiry data from sessionStorage', error);
        }
        return null;
    };

    const enquiryData = getEnquiryData();

    // Parse the name into first name and last name
    const getIndividualDefaultValues = () => {
        const baseValues = {
            payment_terms: 1,
            category: '',
            address: { country: 1 },
        };

        if (enquiryData) {
            const name = enquiryData.name || '';
            const nameParts = name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            return {
                ...baseValues,
                firstname: firstName,
                lastname: lastName,
                email: enquiryData.email || '',
                phone: enquiryData.phone || '',
            };
        }

        return baseValues;
    };

    const [individualDefaultValues,] = useState(getIndividualDefaultValues);

    // Clear enquiry data from sessionStorage after using it
    useEffect(() => {
        return () => {
            // Only clear on unmount if navigating away (not on back button)
        };
    }, []);

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    const individualFormSubmit = async (data) => {
        const formData = new FormData();

        // Append user data
        formData.append("firstname", data.firstname);
        formData.append("lastname", data.lastname);
        if (data.email) formData.append("email", data.email);
        const phoneNumber = data?.phone && parsePhoneNumberFromString(data.phone);
        if (phoneNumber?.nationalNumber) formData.append("phone", data.phone);

        if (data.category != "0") formData.append("category", data.category);
        if (data.payment_terms) formData.append("payment_terms", data.payment_terms);

        if (data.description) formData.append("description", data.description);

        // Append address data
        if (data.address.city) {
            formData.append("address.country", data.address.country);
            formData.append("address.title", data.address.title);
            formData.append("address.city", data.address.city);
            formData.append("address.address", data.address.address);
            formData.append("address.state", data.address.state);
            formData.append("address.postcode", data.address.postcode);
            if (data.address.id) formData.append("address.id", data.address.id);
        }

        // Append photo if it exists
        if (photo?.croppedImageBlob) {
            const photoHintId = nanoid(6);
            formData.append('photo', photo.croppedImageBlob, `${photoHintId}.jpg`);
        }

        try {
            setIsPending(true);
            const accessToken = localStorage.getItem("access_token");
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/clients/individual/new/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData,
            });
            if (response.ok) {
                toast.success(`New client created successfully`);
                const data = await response.json();
                navigate(`/sales/newquote/selectyourclient/client-information/scope-of-work/${data?.client}`);
            } else {
                const error = await response.json();
                toast.error(error || 'Failed to create new client. Please try again.');
            }
        } catch (err) {
            console.log('Error in creating new business client: ', err);
            toast.error(`Failed to create new client. Please try again.`);
        } finally {
            setIsPending(false);
        }
    };

    return (
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
                    <div className='individual height customscrollBar'>
                        <div className="formgroupWrap1">
                            <ul className='mt-4'>
                                <li>
                                    <NavLink className="ActiveClient businessTab" to="#">
                                        <span><Person color="#667085" size={24} /></span> Individual Client
                                    </NavLink>
                                </li>
                            </ul>
                        </div>

                        <div className='formgroupboxs' style={{ padding: "24px 10px 0px 10px" }}>
                            <Row className='text-left pt-3 rounded px-2' style={{ background: '#fff' }}>
                                <IndivisualForm photo={photo} setPhoto={setPhoto} ref={formRef} onSubmit={individualFormSubmit} defaultValues={individualDefaultValues} />
                            </Row>
                        </div>
                    </div>
                    <div className='individual bottomBox'>
                        <Link to={"/sales"}>
                            <button type="button" className="cancel-button">
                                Cancel
                            </button>
                        </Link>

                        <button type="button" disabled={isPending} onClick={handleExternalSubmit} className="submit-button">
                            {isPending ? 'Loading...' : 'Next Step'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndividualClientInformation;
