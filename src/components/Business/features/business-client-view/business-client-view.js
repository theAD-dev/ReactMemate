import React, { useState } from 'react'
import { Trash, X } from 'react-bootstrap-icons';
import { Button, Col, Row } from 'react-bootstrap';
import BusinessClientEdit from '../business-client-edit/business-client-edit'

const BusinessClientView = ({ client, closeIconRef, hide }) => {
  const [isEdit, setIsEdit] = useState(false);

  console.log('client: ', client);
  return (
    <div className='view-details-sidebar'>
      <div className="d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '24px' }}>
          <div className="d-flex align-items-center gap-2">
            <div className='d-flex align-items-center justify-content-center' style={{ borderRadius: "var(--radius-xs, 4px)", border: '1px solid #dedede', width: '56px', height: '56px' }}>
              <img src={client.photo} alt='client-photo' />
            </div>
            <span style={{ color: '344054', fontSize: '22px', fontWeight: 600 }}>{client.name}</span>
          </div>
          <span>
            <Button type="button" className='text-button' text ref={closeIconRef} onClick={(e) => hide(e)}>
              <X size={24} color='#667085' />
            </Button>
          </span>
        </div>

        <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 105px)', overflow: 'auto' }}>
          <div className='d-flex align-items-center justify-content-between' style={{ marginBottom: '16px' }}>
            <h5 style={{ color: '#475467', fontSize: '18px', fontWeight: 600 }}>Client Details</h5>
            <h6 style={{ color: '#475467', fontSize: '14px', fontWeight: 500 }}>Client ID: {client.id}</h6>
          </div>
          {
            isEdit ? <BusinessClientEdit />
              : <ViewSection />
          }
        </div>

        <div className='modal-footer d-flex align-items-center justify-content-between h-100' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)" }}>
          <Button type='button' className='outline-button'>
            <Trash color='#344054' size={20} />
          </Button>
          {
            isEdit ? <div className='d-flex align-items-center gap-3'>
              <Button type='button' onClick={() => setIsEdit(false)} className='outline-button'>Cancel</Button>
              <Button type='button' className='solid-button'>Save Client Details</Button>
            </div>
              : <Button type='button' onClick={() => setIsEdit(true)} className='solid-button'>Edit Client</Button>
          }
        </div>
      </div>
    </div>
  )
}

const ViewSection = () => {
  return (
    <>
      <div style={{ background: "var(--Gray-50, #F9FAFB)", padding: '24px 16px' }}>
        <label className='mb-2' style={{ color: '#667085', fontSize: '14px', fontWeight: 400 }}>Customer Category</label>
        <h4 style={{ color: '#475467', fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Platinium</h4>
        <Row>
          <Col style={{ marginBottom: '16px' }}>
            <label style={{ color: '#667085', fontSize: '14px', fontWeight: 400 }}>ABN</label>
            <h4 className='m-0' style={{ color: '#475467', fontSize: '16px', fontWeight: 600 }}>32 635 443 221</h4>
          </Col>
          <Col style={{ marginBottom: '16px' }}>
            <label style={{ color: '#667085', fontSize: '14px', fontWeight: 400 }}>Industry</label>
            <h4 className='m-0' style={{ color: '#475467', fontSize: '16px', fontWeight: 600 }}>Trucking</h4>
          </Col>
        </Row>

        <Row>
          <Col style={{ marginBottom: '16px' }}>
            <label style={{ color: '#667085', fontSize: '14px', fontWeight: 400 }}>Customer Type</label>
            <h4 className='m-0' style={{ color: '#475467', fontSize: '16px', fontWeight: 600 }}>Business</h4>
          </Col>
          <Col style={{ marginBottom: '16px' }}>
            <label style={{ color: '#667085', fontSize: '14px', fontWeight: 400 }}>Phone</label>
            <h4 className='m-0' style={{ color: '#475467', fontSize: '16px', fontWeight: 600 }}>1300882582</h4>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default BusinessClientView