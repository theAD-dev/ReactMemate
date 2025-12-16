import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Person, X } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { toast } from 'sonner';
import style from './mobile-user-view.module.scss';
import { updateMobileUser } from '../../../../APIs/team-api';
import { formatAUD } from '../../../../shared/lib/format-aud';
import MobileUserEdit from '../mobile-user-edit/mobile-user-edit';

const MobileUserView = ({ user, refetch, closeIconRef, hide }) => {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);

  const [message, setMessage] = useState(user?.manager_notes || "");
  const [paymentCycle, setPaymentCycle] = useState(user?.payment_cycle || "7");
  const [gst, setGst] = useState(user?.gst || false);
  const [hourlyRate, setHourlyRate] = useState(user?.hourly_rate || 0);

  const userSaveMutation = useMutation({
    mutationFn: (data) => updateMobileUser(user?.id, data),
    onSuccess: () => {
      refetch();
      toast.success(`user updated successfully`);
      navigate('/work/people');
    },
    onError: () => {
      toast.error('Failed to update user. Please try again.');
    }
  });

  const handleSave = () => {
    let obj = {
      manager_notes: message,
      payment_cycle: paymentCycle,
      gst: gst,
      hourly_rate: hourlyRate,
    };
    userSaveMutation.mutate(obj);
  };

  useEffect(() => {
    setMessage(user?.manager_notes || "");
    setPaymentCycle(user?.payment_cycle || "7");
    setGst(user?.gst || false);
    setHourlyRate(user?.hourly_rate || 0);
  }, [user]);

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
              <span style={{ color: '344054', fontSize: '22px', fontWeight: 600 }}>{user?.first_name} {user?.last_name}</span>
              {user?.deleted ? <Tag value="Deleted" style={{ height: '22px', width: '59px', borderRadius: '16px', border: '1px solid #FECDCA', background: '#FEF3F2', color: '#912018', fontSize: '12px', fontWeight: 500 }}></Tag> : ''}
            </div>
          </div>
          <span>
            <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
              <X size={24} color='#667085' />
            </Button>
          </span>
        </div>

        <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 130px)', overflow: 'auto' }}>
          <div className='d-flex align-items-center justify-content-between'>
            <h5 className={clsx(style.boxLabel)}>user Details</h5>
            <h6 className={clsx(style.boxLabel2)}>user ID: {user?.number}</h6>
          </div>
          {
            isEdit ? <MobileUserEdit user={user} message={message} setMessage={setMessage} paymentCycle={paymentCycle} setPaymentCycle={setPaymentCycle} gst={gst} setGst={setGst} hourlyRate={hourlyRate} setHourlyRate={setHourlyRate} />
              : <ViewSection user={user} />
          }
        </div>

        <div className='modal-footer d-flex align-items-center justify-content-between h-100' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)" }}>
          {
            user?.deleted ? <span></span> : <span></span>
          }

          {
            isEdit ? <div className='d-flex align-items-center gap-3'>
              <Button type='button' disabled={userSaveMutation.isPending} onClick={(e) => { e.stopPropagation(); setIsEdit(false); }} className='outline-button'>Cancel</Button>
              <Button type='button' disabled={userSaveMutation.isPending} onClick={handleSave} className='solid-button' style={{ minWidth: '179px' }}>{userSaveMutation.isPending ? "Loading..." : "Save user Details"}</Button>
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
            <Rating value={user?.rating || 0} className='yellow-rating' style={{ position: 'static' }} readOnly cancel={false} />
          </Col>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>First Name</label>
            <p className={clsx(style.text)}>{user?.first_name}</p>
          </Col>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>Last Name</label>
            <p className={clsx(style.text)}>{user?.last_name}</p>
          </Col>
          <Col sm={6} className='mb-0'>
            <label className={clsx(style.label)}>Days in Company</label>
            <p className={clsx(style.text)}>{user?.days_in_company || 0}</p>
          </Col>
          <Col sm={6} className='mb-0'>
            <label className={clsx(style.label)}>ABN/TFN</label>
            <p className={clsx(style.text)}>{user?.abn || '-'}</p>
          </Col>
        </Row>
      </div>

      {/* Contact Person */}
      <h5 className={clsx(style.boxLabel, 'mb-2')}>Contact Person</h5>
      <div className={clsx(style.box)}>
        <Row>
          <Col sm={6} className='mb-0'>
            <label className={clsx(style.label)}>Email</label>
            <p className={clsx(style.text)}>{user?.email || '-'}</p>
          </Col>
          <Col sm={6} className='mb-0'>
            <label className={clsx(style.label)}>Phone</label>
            <p className={clsx(style.text)}>{user?.phone || '-'}</p>
          </Col>
        </Row>
      </div>

      {/* Address */}
      <h5 className={clsx(style.boxLabel, 'mb-2')}>Address</h5>
      <div className={clsx(style.box)}>
        <Row>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>Country</label>
            <p className={clsx(style.text)}>{user?.country || '-'}</p>
          </Col>
          <Col sm={6}></Col>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>State</label>
            <p className={clsx(style.text)}>{user?.state || '-'}</p>
          </Col>
          <Col sm={6} className='mb-3'>
            <label className={clsx(style.label)}>City/Suburb</label>
            <p className={clsx(style.text)}>{user?.city || '-'}</p>
          </Col>
          <Col sm={6}>
            <label className={clsx(style.label)}>Street Address</label>
            <p className={clsx(style.text)}>{user?.street || '-'}</p>
          </Col>
          <Col sm={6}>
            <label className={clsx(style.label)}>Postcode</label>
            <p className={clsx(style.text)}>{user?.postcode || '-'}</p>
          </Col>
        </Row>
      </div>

      {/* Payment */}
      <h5 className={clsx(style.boxLabel, 'mb-2')}>Payment</h5>
      <div className={clsx(style.box)}>
        <Row>
          <Col sm={4}>
            <label className={clsx(style.label)}>P/H</label>
            <p className={clsx(style.text)}>${formatAUD(user?.hourly_rate || 0)}</p>
          </Col>
          <Col sm={4}>
            <label className={clsx(style.label)}>Payment cycle</label>
            <p className={clsx(style.text)}>{user?.payment_cycle == "7" ? 'Week' : "-"}</p>
          </Col>
          <Col sm={4}>
            <label className={clsx(style.label)}>Format</label>
            <p className={clsx(style.text)}>{'Contractor'}</p>
          </Col>
        </Row>
      </div>

      {/* Emergency Contact */}
      <h5 className={clsx(style.boxLabel, 'mb-2')}>Emergency Contact</h5>
      <div className={clsx(style.box)}>
        <Row>
          <Col sm={6}>
            <label className={clsx(style.label)}>Full Name</label>
            <p className={clsx(style.text)}>{user?.emergencyContactName || '-'}</p>
          </Col>
          <Col sm={6}>
            <label className={clsx(style.label)}>Phone</label>
            <p className={clsx(style.text)}>{user?.emergencyPhone || '-'}</p>
          </Col>
        </Row>
      </div>

      {/* Manager Notes */}
      <h5 className={clsx(style.boxLabel, 'mb-2')}>Manager Notes</h5>
      <div className={clsx(style.box)}>
        <p className='mb-0 font-14'>
          {user?.manager_notes || '-'}
        </p>
      </div>
    </>
  );
};


export default MobileUserView;