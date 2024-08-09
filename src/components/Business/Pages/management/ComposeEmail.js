import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { X, CurrencyDollar } from "react-bootstrap-icons";
import { Table } from 'react-bootstrap';
import composeEmailIcon from "../../../../assets/images/icon/composeEmailIcon.svg";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuItem from '@mui/material/MenuItem';
import Select1 from 'react-select';
import CustomOption from './CustomOption'; 
import DraftWysiwyg from './DraftWysiwyg';



const ComposeEmail = () => {
  const [viewShow, setViewShow] = useState(false);
  const [customerCategory, setCustomerCategory] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});
 
const colourOptions = [
  { value: 'red', label: 'Red', image: 'https://dev.memate.com.au/media/no_org.png' },
  { value: 'green', label: 'Green', image: 'https://dev.memate.com.au/media/no_org.png' },
  { value: 'blue', label: 'Blue', image: 'https://dev.memate.com.au/media/no_org.png ' },
  // Add more options here
];


  const handleClose = () => {
    setViewShow(false);
  };
  const handleShow = () => {
    setViewShow(true);

  };

  const handleChange = (event: SelectChangeEvent) => {
    setCustomerCategory(event.target.value);
  };

  return (
    <>
      {/* View modal trigger */}
      <div className="linkByttonStyle" onClick={handleShow}>
      Compose Email
      </div>

      {/* View modal */}
      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
         className="taskModelProject taskModelCompose"
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0">
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
            <img src={composeEmailIcon} alt="composeEmailIcon" />
            Compose Email
            </span>
          </div>
          <button className='CustonCloseModal' onClick={handleClose}>
        <X size={24} color='#667085'/>
      </button>
        </Modal.Header>
        <Modal.Body>
            <div className="ContactModel">
                <Row className="text-left mt-0">
                <Col sm={6}>
                    <div className="formgroup mb-2 mt-0">
                      <label>Contact Person </label>
                      <div className={`inputInfo`}>
                      <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                      <Select
                        value={customerCategory}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        IconComponent={KeyboardArrowDownIcon} 
                      >
                        <MenuItem value="">
                        Select person
                        </MenuItem>
                        <MenuItem value={1} data-value="1">1</MenuItem>
                        <MenuItem value={2} data-value="2">2</MenuItem>
                      </Select>
                    </FormControl>
                      </div>
                    </div>
                    </Col>
                <Col sm={6}>
                    <div className="formgroup mb-2 mt-0">
                      <label>Email Templates </label>
                      <div className={`inputInfo`}>
                      <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                      <Select
                        value={customerCategory}
                        onChange={handleChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        IconComponent={KeyboardArrowDownIcon} 
                      >
                        <MenuItem value="">
                         Select template
                        </MenuItem>
                        <MenuItem value={1} data-value="1">1</MenuItem>
                        <MenuItem value={2} data-value="2">2</MenuItem>
                      </Select>
                    </FormControl>
                      </div>
                    </div>
                    </Col>
                <Col sm={12}>
                <div className="formgroup formgroupSelect formgroupSelectTag mb-2 mt-3">
                    <div className={`inputInfo `}>
                      <span>From</span>
                    <Select1
                    isMulti
                    name="colors"
                    options={colourOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    components={{ Option: CustomOption }}/>
                    </div>
                  </div>
                    </Col>
                </Row>
                <Row>
                <Col>
                <div className="formgroup formgroupSelect formgroupSelectTag mb-2 mt-3">
                    <div className={`inputInfo `}>
                      <span>TO</span>
                    <Select1
                    isMulti
                    name="colors"
                    options={colourOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    components={{ Option: CustomOption }}/>
                    </div>
                  </div>
                    </Col>
                </Row>
                <Row>
                <Col>
                <div className="formgroup sendSMSPhone mb-2 mt-0">
                  <label>Title</label>
                    <div className={`inputInfo ${errors.taskRead ? 'error-border' : ''}`}>
                      <input
                        type="text"
                        name="title"
                        value={phoneNumber}
                        placeholder='Enter phone number'
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          handleChange(e);
                        }}
                      />
                    </div>
                    </div>
                </Col>
                </Row>
                <Row>
                  <Col>
                  <DraftWysiwyg />
                  </Col>
                </Row>
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ComposeEmail;
