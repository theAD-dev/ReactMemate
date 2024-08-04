import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import CreateProposalIcon from "../../../../../../assets/images/icon/CreateProposalIcon.svg";
import { X, PlusLg } from "react-bootstrap-icons";
import CreateProposalEditText from './CreateProposalEditText';


const CreateProposalModel = ({ taskId }) => {
  const [viewShow, setViewShow] = useState(false);
  const [company, setCompany] = useState('Business Name');

 
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
         Create Proposal
      </div>

      {/* View modal */}
      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="SalesContact modelInputSelectStyle creteProposalModel"
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0">
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
            <img src={CreateProposalIcon} alt="CreateProposalIcon" />
            Tender Template
            </span>
          </div>
          <button className='CustonCloseModal' onClick={handleClose}>
        <X size={24} color='#667085'/>
       
      </button>
        </Modal.Header>
        <Modal.Body>
     
            <div className="ContactModel">
              <div className="ContactModelIn">
                <Row className="text-left mt-3">
                <Col>
                  <div className="formGroup mb-2">
                  <label>Template:</label>
                    <div className="inputInfo">
                      
                      <FormControl className='customerCategory' sx={{ m: 0, minWidth: '100%' }}>
                        <Select
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          IconComponent={KeyboardArrowDownIcon}
                        >
                          <MenuItem value="Business Name">Boat Quote</MenuItem>
                          <MenuItem value={1} data-value="1">1</MenuItem>
                          <MenuItem value={2} data-value="2">2</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </Col>
                </Row>
                <Row className="text-left mt-0">
                <div className="formGroup mb-2">
                 <CreateProposalEditText />

                  </div>
                </Row>
              </div>
              <div className="popoverbottom taskBottonBar mt-0 pt-4">
              <Button  variant="primary cancelProposalBut">
                Cancel
              </Button>
              <div className='rightBut'>
              <Button variant="primary addNewBut" >
              Add  New Section  <PlusLg size={20} color='#106B99'/>
              </Button>
              <Button variant="primary createAndSave" >
              Create & Save
              </Button>
              <Button variant="primary sendProposalBut" >
              Send Proposal
              </Button>
              </div>
            </div>
            </div>
          
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateProposalModel;
