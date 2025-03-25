import React, { useRef, useState } from 'react';
import { Row, Button } from 'react-bootstrap';
import { Building, ChevronLeft, InfoSquare, Person } from 'react-bootstrap-icons';
import { NavLink, useParams, useNavigate, Link } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import BusinessForm from '../../../features/clients-features/new-client-create/business-form';

const BusinessClientInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [businessDefaultValues,] = useState({
    payment_terms: 1,
    category: '',
    phone: { country: '', number: '' },
    contact_persons: [{}],
    addresses: [{ title: "Main Location", country: 1 }],
  });

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  const businessFormSubmit = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    if (data.abn) formData.append("abn", data.abn);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    if (data.website) formData.append("website", data.website);
    formData.append("payment_terms", data.payment_terms);
    if (data.category != "0") formData.append("category", data.category);
    formData.append("industry", data.industry);
    if (data.description) formData.append("description", data.description);

    data.addresses.forEach((address, index) => {
      if (address.city) {
        formData.append(`addresses[${index}]address`, address.address);
        formData.append(`addresses[${index}]city`, address.city);
        formData.append(`addresses[${index}]postcode`, address.postcode);
        formData.append(`addresses[${index}]is_main`, address.is_main);
        formData.append(`addresses[${index}]title`, address.title);
      }
    });

    data.contact_persons.forEach((person, index) => {
      if (person.firstname || person.email) {
        formData.append(`contact_persons[${index}]firstname`, person.firstname);
        formData.append(`contact_persons[${index}]lastname`, person.lastname);
        formData.append(`contact_persons[${index}]email`, person.email);
        formData.append(`contact_persons[${index}]phone`, person.phone);
        formData.append(`contact_persons[${index}]position`, person.position);
        formData.append(`contact_persons[${index}]is_main`, person.is_main);
      }
    });

    if (photo?.croppedImageBlob) {
      const photoHintId = nanoid(6);
      formData.append('photo', photo?.croppedImageBlob, `${photoHintId}.jpg`);
    }

    try {
      setIsPending(true);
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/clients/business/new/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData,
      });
      if (response.ok) {
        toast.success(`New client created successfully`);
        const data = await response.json();
        navigate(`/sales/newquote/selectyourclient/client-information/scope-of-work/${data?.id}`);
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
              <li className='deactiveColorBox'><span><Building color="#D0D5DD" size={15} /></span> <p>Scope of Work</p> </li>
            </ul>
          </div>

          <div className='individual height customscrollBar'>
            <div className="formgroupWrap1">
              <ul className='mt-4'>
                <li>
                  <NavLink className="ActiveClient businessTab" to="#"><span><Building color="#1AB2FF " size={24} /></span> Business Client</NavLink>
                </li>
              </ul>
            </div>

            <div className='formgroupboxs businessFormInQuote' style={{ padding: "24px 10px 0px 10px" }}>
              <Row className='text-left pt-3 rounded px-2' style={{ background: '#fff' }}>
                <h2 style={{ marginBottom: '16px' }}>Company Details</h2>

                <BusinessForm photo={photo} setPhoto={setPhoto} ref={formRef} onSubmit={businessFormSubmit} defaultValues={businessDefaultValues} deleteAddress={() => { }} deleteContact={() => { }} />
              </Row>
            </div>
          </div>

          <div className='individual bottomBox'>
            <Link to={"/sales"}>
              <Button type="button" className="cancel-button">
                Cancel
              </Button>
            </Link>

            <Button type='button' disabled={isPending} onClick={handleExternalSubmit} className="submit-button">
              {isPending ? "Loading..." : "Next Step"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessClientInformation;
