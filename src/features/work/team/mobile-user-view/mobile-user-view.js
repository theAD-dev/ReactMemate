import React, { useRef, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Person, StarFill, Trash, X } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import style from './mobile-user-view.module.scss';
import { dateFormat } from '../../../../components/Business/shared/utils/helper';
import { formatAUD } from '../../../../shared/lib/format-aud';

const MobileUserView = ({ user, refetch, closeIconRef, hide }) => {
  const formRef = useRef(null);
  const [isPending, setIsPending] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

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
                user?.photo ? <img src={user?.photo} alt='user-photo' /> : <Person color='#667085' size={26} />
              }
            </div>
            <div className='d-flex align-items-center gap-2'>
              <span style={{ color: '344054', fontSize: '22px', fontWeight: 600 }}>{user?.name}</span>
              {user?.deleted ? <Tag value="Deleted" style={{ height: '22px', width: '59px', borderRadius: '16px', border: '1px solid #FECDCA', background: '#FEF3F2', color: '#912018', fontSize: '12px', fontWeight: 500 }}></Tag> : ''}
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
            <h5 className={clsx(style.boxLabel)}>user Details</h5>
            <h6 className={clsx(style.boxLabel2)}>user ID: {user?.number}</h6>
          </div>
          {
            isEdit ? <>Edit Mode</>
              : <ViewSection user={user} />
          }
        </div>

        <div className='modal-footer d-flex align-items-center justify-content-between h-100' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)" }}>
          {
            !user?.deleted ? (<Trash color='#344054' size={20} />) : <span></span>
          }

          {
            isEdit ? <div className='d-flex align-items-center gap-3'>
              <Button type='button' onClick={(e) => { e.stopPropagation(); setIsEdit(false); }} className='outline-button'>Cancel</Button>
              <Button type='button' onClick={handleExternalSubmit} className='solid-button' style={{ minWidth: '179px' }}>{isPending ? "Loading..." : "Save user Details"}</Button>
            </div>
              : user?.deleted
                ? <Button type='button' onClick={(e) => { e.stopPropagation(); setIsEdit(true); }} className='solid-button'>Restore user</Button>
                : <Button type='button' onClick={(e) => { e.stopPropagation(); setIsEdit(true); }} className='solid-button'>Edit user</Button>
          }
        </div>
      </div>
    </div>
  );
};

const ViewSection = ({ user }) => {
  return (
    <>
      {/* User Details */}
      <div className={clsx(style.box)}>
        <Row>
          <Col sm={12} className='mb-3'>
            <label className={clsx(style.label)}>Rating</label>
            <Rating value={3} className='yellow-rating' style={{ position: 'static' }} readOnly cancel={false} />
          </Col>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>First Name</label>
            <p className={clsx(style.text)}>{user?.firstName || 'John'}</p>
          </Col>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>Last Name</label>
            <p className={clsx(style.text)}>{user?.lastName || 'Doe'}</p>
          </Col>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>Date of Birthday</label>
            <p className={clsx(style.text)}>{dateFormat(user?.dob || '1995-12-17')}</p>
          </Col>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>ABN/TFN</label>
            <p className={clsx(style.text)}>{user?.abn || '32 635 443 221'}</p>
          </Col>
        </Row>
      </div>

      {/* Contact Person */}
      <div className={clsx(style.box)}>
        <h5 className={clsx(style.boxLabel)}>Contact Person</h5>
        <Row>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>Email</label>
            <p className={clsx(style.text)}>{user?.email || 'client@email.com'}</p>
          </Col>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>Phone</label>
            <p className={clsx(style.text)}>{user?.phone || '07 3803 4998'}</p>
          </Col>
        </Row>
      </div>

      {/* Address */}
      <div className={clsx(style.box)}>
        <h5 className={clsx(style.boxLabel)}>Address</h5>
        <Row>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>Country</label>
            <p className={clsx(style.text)}>{user?.country || 'Australia'}</p>
          </Col>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>State</label>
            <p className={clsx(style.text)}>{user?.state || 'New South Wales'}</p>
          </Col>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>City/Suburb</label>
            <p className={clsx(style.text)}>{user?.city || 'Winburndale'}</p>
          </Col>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>Street Address</label>
            <p className={clsx(style.text)}>{user?.street || 'Sydney Street of 914'}</p>
          </Col>
          <Col sm={6}>
            <label className={clsx(style.label)}>Postcode</label>
            <p className={clsx(style.text)}>{user?.postcode || '2795'}</p>
          </Col>
        </Row>
      </div>

      {/* Payment */}
      <div className={clsx(style.box)}>
        <h5 className={clsx(style.boxLabel)}>Payment</h5>
        <Row>
          <Col sm={4} className='mb-3'>
            <label className={clsx(style.label)}>P/H</label>
            <p className={clsx(style.text)}>{formatAUD(user?.payRate || 20)}</p>
          </Col>
          <Col sm={4} className='mb-3'>
            <label className={clsx(style.label)}>Payment cycle</label>
            <p className={clsx(style.text)}>{user?.paymentCycle || 'Week'}</p>
          </Col>
          <Col sm={4} className='mb-3'>
            <label className={clsx(style.label)}>Format</label>
            <p className={clsx(style.text)}>{user?.format || 'Contractor'}</p>
          </Col>
        </Row>
      </div>

      {/* Groups */}
      <div className={clsx(style.box)}>
        <h5 className={clsx(style.boxLabel)}>Groups</h5>
        <Row>
          <Col sm={12}>
            <label className={clsx(style.label)}>Group Name</label>
            <p className={clsx(style.text)}>{user?.group || 'Group 1'}</p>
          </Col>
        </Row>
      </div>

      {/* Emergency Contact */}
      <div className={clsx(style.box)}>
        <h5 className={clsx(style.boxLabel)}>Emergency Contact</h5>
        <Row>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>Full Name</label>
            <p className={clsx(style.text)}>{user?.emergencyContactName || 'Paul Stein'}</p>
          </Col>
          <Col sm={6}>
            <label className={clsx(style.label)}>Phone</label>
            <p className={clsx(style.text)}>{user?.emergencyPhone || '1300882582'}</p>
          </Col>
        </Row>
      </div>

      {/* Manager Notes */}
      <div className={clsx(style.box)}>
        <h5 className={clsx(style.boxLabel)}>Manager Notes</h5>
        <p className={clsx(style.text)}>
          {user?.managerNotes || `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...`}
        </p>
      </div>
    </>
  );
};


export default MobileUserView;