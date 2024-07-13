import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {  } from "react-bootstrap-icons";


import saleContact from "../../../assets/images/icon/sale-01.svg";
import NewTaskAdd from "../../../assets/images/icon/newTaskAdd.svg";


const NewTaskModal = () => {
  
  const [show, setShow] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const handleClose = () => {
    setShow(false);
    setValidationError('');
  };

  const handleShow = () => setShow(true);



 

  return (
   <>
   
     <Button variant="newTaskBut" onClick={handleShow}>
     New
     </Button>
     <Modal show={show} aria-labelledby="contained-modal-title-vcenter"
      centered className='SalesContact newtaskaddModal' onHide={handleClose} animation={false}>
        <Modal.Header className='mb-0 pb-0 border-0' closeButton>
          <div className='modelHeader d-flex justify-content-between align-items-start'>
            <span>
              <img src={NewTaskAdd} alt="NewTaskAdd" />
              New Task
            </span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='ContactModel'>
            <div className='ContactModelIn'>
              <span>Task Title</span>
          

            </div>
            <div className='popoverbottom mt-0 pt-4'>
            
              <Button className='savebox'>
              Create Task
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
   </>
  )
}

export default NewTaskModal;
