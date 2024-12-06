import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Modal from 'react-bootstrap/Modal';
import { PlusLg , Envelope, Telephone, Calendar, ChevronDown } from "react-bootstrap-icons";
import Typography from '@mui/material/Typography';
import Form from 'react-bootstrap/Form';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ToggleButton from 'react-bootstrap/ToggleButton';
import saleContact from "../../../../assets/images/icon/sale-01.svg";
import { fetchContacts } from '../../../../APIs/SalesApi';

const ContactAdd = ({saleUniqueIdold, contactRefresh}) => {
  
  const [radioValue, setRadioValue] = useState('email');
  const [value, setValue] = useState(dayjs());
  const [note, setNote] = useState('');
  const [show, setShow] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const handleClose = () => {
    setShow(false);
    setValidationError('');
  };

  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!validateForm()) return; // Check if form is valid

    const saleUniqueId = saleUniqueIdold;
    const nextDay = new Date(value);
    nextDay.setDate(nextDay.getDate() + 1);

    const formData = {
      type: radioValue,
      date: dayjs(nextDay).format('YYYY-MM-DD'),
      note: note,
    };

    try {
      const data = await fetchContacts(saleUniqueId, formData);
      handleClose();
      refreshData();
    } catch (error) {
      console.error("Error while saving:", error);
    }
  };

  const refreshData = () => {
    contactRefresh();
  };

  const radios = [
    { name: 'Email', value: 'E', icon: <Envelope size={20} /> },
    { name: 'Phone', value: 'P', icon: <Telephone size={20} /> },
    { name: 'Meeting', value: 'M', icon: <Calendar size={20} /> },
  ];

  const validateForm = () => {
    if (!value) {
      setValidationError('This is an error message.');
      return false;
    }
    if (!note) {
      setValidationError('This is an error message.');
      return false;
    }
    // Additional validation checks can be added here
    return true;
  };

  return (
   <>
     <Button variant="ContactAdd" onClick={handleShow}>
       <PlusLg color="#1AB2FF" size={16} />
     </Button>

     <Modal show={show} aria-labelledby="contained-modal-title-vcenter"
      centered className='SalesContact salesTableWrap' onHide={handleClose} animation={false}>
        <Modal.Header className='SalesContact mb-0 pb-0 border-0' closeButton>
          <div className='modelHeader d-flex justify-content-between align-items-start'>
            <span>
              <div className='iconOutStyle'>
                <div className='iconinStyle'>
                  <div className='iconinnerStyle'>
                    <img src={saleContact} alt="saleContact" />
                  </div>
                </div>
              </div>
              Sales Contact
            </span>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className='ContactModel'>
            <div className='ContactModelIn'>
              <span>Contact Type</span>
              <ButtonGroup className='radioSelectButton'>
                {radios.map((radio, idx) => (
                  <div className='radioSelectButtons' key={idx}>
                    <ToggleButton
                      id={`radio-${idx}`}
                      type="radio"
                      variant={idx % 2 ? 'outlineBox' : 'selectBox'}
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >
                      {radio.name} {radio.icon}
                    </ToggleButton>
                  </div>
                ))}
              </ButtonGroup>
              {validationError && (
                <div className="text-danger">{validationError}</div>
              )}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <span className="flexRemove">Date</span>
                <DatePicker
                  className='datepickerField'
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                  slots={{ openPickerIcon: ChevronDown }}
                  size={20}
                />
              </LocalizationProvider>
              {validationError && (
                <div className="text-danger">{validationError}</div>
              )}
              <span>Note</span>
              <Typography sx={{ p: 0 }}>
                <Form.Control
                  as="textarea"
                  placeholder="Enter a description..."
                  style={{ height: '152px' }}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Typography>
              {validationError && (
                <div className="text-danger">{validationError}</div>
              )}
            </div>
            <div className='popoverbottom mt-0 pt-4'>
              <Button className='closebox' onClick={handleClose}>
                Cancel
              </Button>
              <Button className='savebox' onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
   </>
  )
}

export default ContactAdd;
