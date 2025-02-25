import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Skeleton } from 'primereact/skeleton';

const SidebarClientLoading = () => {
  return (
    <div className='loading-details-sidebar'>
      <div className="d-flex flex-column">
        <div className='modal-body' style={{ padding: '0px 12px 12px 12px', height: 'calc(100vh - 72px - 105px)', overflow: 'auto' }}>
          <div className='d-flex align-items-center justify-content-between mb-4'>
            <Skeleton height="2rem" width='10rem' className="mb-2"></Skeleton>
            <Skeleton height="1.5rem" width='10rem' className="mb-2"></Skeleton>
          </div>
          <Skeleton height="1.2rem" width='10rem' className="mb-2"></Skeleton>
          <Skeleton width="100%" className="mb-4" height="45px"></Skeleton>

          <Skeleton height="1.2rem" width='10rem' className="mb-2"></Skeleton>
          <Skeleton width="100%" className="mb-4" height="45px"></Skeleton>

          <Row>
            <Col>
              <Skeleton height="1.2rem" width='10rem' className="mb-2"></Skeleton>
              <Skeleton width="100%" className="mb-4" height="45px"></Skeleton>
            </Col>
            <Col>
              <Skeleton height="1.2rem" width='10rem' className="mb-2"></Skeleton>
              <Skeleton width="100%" className="mb-4" height="45px"></Skeleton>
            </Col>
          </Row>

          <Row>
            <Col>
              <Skeleton height="1.2rem" width='10rem' className="mb-2"></Skeleton>
              <Skeleton width="100%" className="mb-4" height="45px"></Skeleton>
            </Col>
            <Col>
              <Skeleton height="1.2rem" width='10rem' className="mb-2"></Skeleton>
              <Skeleton width="100%" className="mb-4" height="45px"></Skeleton>
            </Col>
          </Row>

          <Row>
            <Col>
              <Skeleton width="100%" className="mb-4" height="94px"></Skeleton>
            </Col>
            <Col>
              <Skeleton width="100%" className="mb-4" height="94px"></Skeleton>
            </Col>
            <Col>
              <Skeleton width="100%" className="mb-4" height="94px"></Skeleton>
            </Col>
          </Row>

          <div className='d-flex align-items-center mb-4 gap-1'>
            <Skeleton height="2rem" width='10rem' className="mb-2"></Skeleton>
            <Skeleton height="2rem" width='10rem' className="mb-2"></Skeleton>
          </div>
          <Skeleton height="1.2rem" width='10rem' className="mb-2"></Skeleton>
          <Skeleton width="50%" className="mb-4" height="45px"></Skeleton>

          <Row>
            <Col>
              <Skeleton height="1.2rem" width='10rem' className="mb-2"></Skeleton>
              <Skeleton width="100%" className="mb-4" height="45px"></Skeleton>
            </Col>
            <Col>
              <Skeleton height="1.2rem" width='10rem' className="mb-2"></Skeleton>
              <Skeleton width="100%" className="mb-4" height="45px"></Skeleton>
            </Col>
          </Row>

          <div className='d-flex align-items-center mb-4 gap-1'>
            <Skeleton height="2rem" width='2rem' className="mb-2"></Skeleton>
            <Skeleton height="2rem" width='50%' className="mb-2"></Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarClientLoading;