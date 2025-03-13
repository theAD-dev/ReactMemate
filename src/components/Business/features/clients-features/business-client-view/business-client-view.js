import React, { useRef, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Building, StarFill, X } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { toast } from 'sonner';
import style from './business-client.module.scss';
import { getClientIndustries, markeMainAddress, markeMainContact } from '../../../../../APIs/ClientsApi';
import mapicon from '../../../../../assets/images/google_maps_ico.png';
import BusinessClientEdit from '../business-client-edit/business-client-edit';
import DeleteClient from '../delete-client';
import Restore from '../restore-client';


const BusinessClientView = ({ client, refetch, closeIconRef, hide }) => {
  const formRef = useRef(null);
  const [isPending, setIsPending] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const industriesQuery = useQuery({ queryKey: ['industries'], queryFn: getClientIndustries });

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  return (
    <div className='view-details-sidebar'>
      <div className="d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '24px' }}>
          <div className="d-flex align-items-center gap-2">
            <div className={clsx(style.profileBox, 'd-flex align-items-center justify-content-center')}>
              {
                client.photo ? <img src={client.photo} alt='client-photo' /> : <Building color='#667085' size={26} />
              }
            </div>
            <div className='d-flex align-items-center gap-2'>
              <span style={{ color: '344054', fontSize: '22px', fontWeight: 600 }}>{client.name}</span>
              {client.deleted ? <Tag value="Deleted" style={{ height: '22px', width: '59px', borderRadius: '16px', border: '1px solid #FECDCA', background: '#FEF3F2', color: '#912018', fontSize: '12px', fontWeight: 500 }}></Tag> : ''}
            </div>
          </div>
          <span>
            <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
              <X size={24} color='#667085' />
            </Button>
          </span>
        </div>

        <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 105px)', overflow: 'auto' }}>
          <div className='d-flex align-items-center justify-content-between'>
            <h5 className={clsx(style.boxLabel)}>Client Details</h5>
            <h6 className={clsx(style.boxLabel2)}>Client ID: {client.id}</h6>
          </div>
          {
            isEdit ? <BusinessClientEdit ref={formRef} refetch={refetch} setIsPending={setIsPending} handleExternalSubmit={handleExternalSubmit} client={client} setIsEdit={setIsEdit} />
              : <ViewSection client={client} industries={industriesQuery?.data} refetch={refetch} />
          }
        </div>

        <div className='modal-footer d-flex align-items-center justify-content-between h-100' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)" }}>
          {
            !client.deleted ? (<DeleteClient id={client?.id} />) : <span></span>
          }

          {
            isEdit ? <div className='d-flex align-items-center gap-3'>
              <Button type='button' onClick={(e) => { e.stopPropagation(); setIsEdit(false); }} className='outline-button'>Cancel</Button>
              <Button type='button' onClick={handleExternalSubmit} className='solid-button' style={{ width: '180px' }}>{isPending ? "Loading..." : "Save Client Details"}</Button>
            </div>
              : client.deleted
                ? <Restore id={client?.id} refetch={refetch} />
                : <Button type='button' onClick={(e) => { e.stopPropagation(); setIsEdit(true); }} className='solid-button'>Edit Client</Button>
          }
        </div>
      </div>
    </div>
  );
};

const ViewSection = ({ client, industries, refetch }) => {
  const [isMainLoading, setIsMainLoading] = useState(null);
  const payments = [
    { value: 1, label: "COD" },
    { value: 0, label: "Prepaid" },
    { value: 7, label: "Week" },
    { value: 14, label: "Two weeks" },
    { value: 30, label: "One month" },
  ];
  let clientIndustry = industries?.find((industry) => industry.id === client?.industry);
  let clientPayment = payments?.find((payment) => payment?.value === client?.payment_terms);

  const addresses = client?.addresses?.filter((address) => !address?.deleted);
  const contacts = client?.contact_persons?.filter((contact) => !contact?.deleted);

  const markContactPersonMain = async (id) => {
    try {
      if (!id) return toast.error("Id not found");
      setIsMainLoading(id);

      await markeMainContact(id);
      refetch();
      toast.success('Contact person has been successfully set as the primary contact');
    } catch (error) {
      console.error('Error is setting primary contact:', error);
      toast.error(`Failed to set primary contact. Please try again.`);
    } finally {
      setIsMainLoading(null);
    }
  };

  const markAddressMain = async (id) => {
    try {
      if (!id) return toast.error("Id not found");
      setIsMainLoading(id);

      await markeMainAddress(id);
      refetch();
      toast.success('Address has been successfully set as the primary address');
    } catch (error) {
      console.error('Error is setting primary address:', error);
      toast.error(`Failed to set primary address. Please try again.`);
    } finally {
      setIsMainLoading(null);
    }
  };

  return (
    <>
      <div className={clsx(style.box)}>
        <Row>
          <Col sm={6}>
            <label className={clsx(style.label)}>ABN</label>
            <h4 className={clsx(style.text)}>{client?.abn || "-"}</h4>
          </Col>
          <Col sm={6}>
            <label className={clsx(style.label)}>Industry</label>
            <h4 className={clsx(style.text)}>{clientIndustry?.name || "-"}</h4>
          </Col>
        </Row>

        <Row>
          <Col sm={6}>
            <label className={clsx(style.label)}>Customer Type</label>
            <h4 className={clsx(style.text)}>{client?.is_business ? "Business" : "Indivisual"}</h4>
          </Col>
          <Col sm={6}>
            <label className={clsx(style.label)}>Phone</label>
            <h4 className={clsx(style.text)}>{client?.phone || "-"}</h4>
          </Col>
        </Row>

        <Row>
          <Col sm={6}>
            <label className={clsx(style.label)}>Email</label>
            <Link to='#'
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `mailto:${client?.email}`;
              }}
            >
              <div className='d-flex align-items-center' style={{ color: '#106B99', fontSize: '16px', }}>
                <div className='ellipsis-width' title={client?.email}>{client?.email || "-"}&nbsp;</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <path d="M6.3335 14.1666L14.6668 5.83331M14.6668 5.83331H6.3335M14.6668 5.83331V14.1666" stroke="#106B99" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </Col>
          <Col sm={6}>
            <label className={clsx(style.label)}>Website</label>
            <Link
              to={
                client?.website
                  ? client.website.startsWith('http://') || client.website.startsWith('https://')
                    ? client.website
                    : `https://${client.website}`
                  : '#'
              }
              target='_blank'
            >
              <div className='d-flex align-items-center' style={{ color: '#106B99', fontSize: '16px', }}>
                <div className='ellipsis-width' title={client?.website}>{client?.website || "-"}&nbsp;</div>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <path d="M6.3335 14.1666L14.6668 5.83331M14.6668 5.83331H6.3335M14.6668 5.83331V14.1666" stroke="#106B99" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          </Col>
        </Row>
      </div>

      <h5 className={clsx(style.boxLabel)}>Payment Terms</h5>
      <div className={clsx(style.box)}>
        <Row>
          <Col sm={6}>
            <label className={clsx(style.label)}>Payment Terms</label>
            <h4 className={clsx(style.text, 'mb-0')}>{clientPayment?.label || "-"}</h4>
          </Col>
          <Col sm={6}>
            <label className={clsx(style.label)}>Customers Discount Category</label>
            <h4 className={clsx(style.text)}>{client?.category?.name || "-"}</h4>
          </Col>
        </Row>
      </div>

      <h5 className={clsx(style.boxLabel)}>Contact Person</h5>
      {
        contacts?.map((contact) => (
          <div key={contact.id} className={clsx(style.box)}>
            <div className={clsx(style.iconBoxsContainer)}>
              <div className={clsx(style.iconBox, 'cursor-pointer')} onClick={() => markContactPersonMain(contact.id)}>
                {
                  (isMainLoading === contact.id) ? <ProgressSpinner style={{ width: '20px', height: '20px' }} />
                    : <StarFill color={contact.is_main ? "#FFCB45" : "#D0D5DD"} size={16} />
                }
              </div>
            </div>
            <Row>
              <Col sm={6}>
                <label className={clsx(style.label)}>Full Name</label>
                <h4 className={clsx(style.text)}>{`${contact.firstname} ${contact.lastname}`}</h4>
              </Col>
              <Col sm={6}>
                <label className={clsx(style.label)}>Email</label>
                <Link to='#'
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `mailto:${contact?.email}`;
                  }}
                >
                  <div className='d-flex align-items-center' style={{ color: '#106B99', fontSize: '16px', }}>
                    <div className='ellipsis-width' title={contact?.email}>{contact?.email || "-"}&nbsp;</div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <path d="M6.3335 14.1666L14.6668 5.83331M14.6668 5.83331H6.3335M14.6668 5.83331V14.1666" stroke="#106B99" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              </Col>
            </Row>

            <Row>
              <Col sm={6}>
                <label className={clsx(style.label)}>Position</label>
                <h4 className={clsx(style.text, 'mb-0')}>{contact?.position || "-"}</h4>
              </Col>
              <Col sm={6}>
                <label className={clsx(style.label)}>Phone</label>
                <h4 className={clsx(style.text, 'mb-0')}>{contact?.phone || "-"}&nbsp;&nbsp;
                  <Link to='#'
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `tel:${contact?.phone}`;
                    }}
                    style={{ position: 'relative', top: '-2px' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                      <path d="M4.15387 1.32849C3.90343 1.00649 3.42745 0.976861 3.139 1.26531L2.10508 2.29923C1.6216 2.78271 1.44387 3.46766 1.6551 4.06847C2.50338 6.48124 3.89215 8.74671 5.82272 10.6773C7.75329 12.6078 10.0188 13.9966 12.4315 14.8449C13.0323 15.0561 13.7173 14.8784 14.2008 14.3949L15.2347 13.361C15.5231 13.0726 15.4935 12.5966 15.1715 12.3461L12.8653 10.5524C12.7008 10.4245 12.4866 10.3793 12.2845 10.4298L10.0954 10.9771C9.50082 11.1257 8.87183 10.9515 8.43845 10.5181L5.98187 8.06155C5.54849 7.62817 5.37427 6.99919 5.52292 6.40459L6.07019 4.21553C6.12073 4.01336 6.07552 3.79918 5.94758 3.63468L4.15387 1.32849ZM2.38477 0.511076C3.12689 -0.231039 4.3515 -0.154797 4.99583 0.673634L6.78954 2.97983C7.1187 3.40304 7.23502 3.95409 7.10498 4.47423L6.55772 6.66329C6.49994 6.8944 6.56766 7.13888 6.7361 7.30732L9.19268 9.7639C9.36113 9.93235 9.6056 10.0001 9.83671 9.94229L12.0258 9.39502C12.5459 9.26498 13.097 9.3813 13.5202 9.71047L15.8264 11.5042C16.6548 12.1485 16.731 13.3731 15.9889 14.1152L14.955 15.1492C14.2153 15.8889 13.1089 16.2137 12.0778 15.8512C9.51754 14.9511 7.11438 13.4774 5.06849 11.4315C3.0226 9.38562 1.54895 6.98246 0.648838 4.42225C0.286318 3.39112 0.61113 2.28472 1.35085 1.545L2.38477 0.511076Z" fill="#106B99" />
                    </svg>
                  </Link>
                </h4>
              </Col>
            </Row>
          </div>
        ))
      }

      {contacts?.length === 0 && <div className={clsx(style.box)}>-</div>}

      <h5 className={clsx(style.boxLabel)}>Locations</h5>
      {
        addresses?.map((address) => (
          <div key={address.id} className={clsx(style.box)}>
            <div className={clsx(style.iconBoxsContainer)}>
              <div className={clsx(style.iconBox, 'cursor-pointer')} onClick={() => markAddressMain(address.id)}>
                {
                  (isMainLoading === address.id) ? <ProgressSpinner style={{ width: '20px', height: '20px' }} />
                    : <StarFill color={address.is_main ? "#FFCB45" : "#D0D5DD"} size={16} />
                }
              </div>
              <div className={clsx(style.iconBox)}>
                <Link to={`http://maps.google.com/?q=${address.address}`} target='_blank'><img src={mapicon} alt='map' /></Link>
              </div>
            </div>

            <Row>
              <Col sm={6}>
                <label className={clsx(style.label)}>Location Name</label>
                <h4 className={clsx(style.text)}>{`${address.title || "-"}`}</h4>
              </Col>
              <Col sm={6}>
                <label className={clsx(style.label)}>Country</label>
                <h4 className={clsx(style.text)}>{`${address.country || "-"}`}</h4>
              </Col>
            </Row>

            <Row>
              <Col sm={6}>
                <label className={clsx(style.label)}>State</label>
                <h4 className={clsx(style.text)}>{`${address.state || "-"}`}</h4>
              </Col>
              <Col sm={6}>
                <label className={clsx(style.label)}>City</label>
                <h4 className={clsx(style.text)}>{`${address.city || "-"}`}</h4>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <label className={clsx(style.label)}>Street Address</label>
                <h4 className={clsx(style.text, 'mb-0')}>{`${address.address || "-"}`}</h4>
              </Col>
              <Col sm={6}>
                <label className={clsx(style.label)}>Postcode</label>
                <h4 className={clsx(style.text, 'mb-0')}>{`${address.postcode || "-"}`}</h4>
              </Col>
            </Row>
          </div>
        ))
      }
      {addresses?.length === 0 && <div className={clsx(style.box)}>-</div>}


      <h5 className={clsx(style.boxLabel)}>Client Description</h5>
      <div className={clsx(style.box, 'mb-0')}>
        {client.description || "-"}
      </div>
    </>
  );
};

export default BusinessClientView;