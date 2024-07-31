import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { X, CurrencyDollar } from "react-bootstrap-icons";
import { Table } from 'react-bootstrap';

const NewTask = () => {
  const [viewShow, setViewShow] = useState(false);


 
  const handleClose = () => {
    setViewShow(false);
  };
  const handleShow = () => {
    setViewShow(true);

  };

  return (
    <>
      {/* View modal trigger */}
      <div className="linkByttonStyle" onClick={handleShow}>
      New Task
      </div>

      {/* View modal */}
      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className=""
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 ">
          <div className="modelHeader">
       
          </div>
          <button className='CustonCloseModal' onClick={handleClose}>
        <X size={24} color='#667085'/>
        </button>
        </Modal.Header>
        <Modal.Body>
            <div className="ContactModel">
                <Row className="text-left mt-3">
                
                <Col>
                </Col>
                </Row>
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewTask;
