import React, { useState, useCallback } from 'react';
import { PlusLg, Envelope, Telephone, Calendar as CalendarIcon, ChevronDown, Calendar3 } from "react-bootstrap-icons";
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { Calendar } from 'primereact/calendar';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { fetchContacts } from '../../../../../APIs/SalesApi';
import saleContact from "../../../../../assets/images/icon/sale-01.svg";

const ContactAdd = ({ saleUniqueIdold, contactRefresh, step, created, type }) => {
  const [radioValue, setRadioValue] = useState('E'); // Default to Email
  const [value, setValue] = useState(null);
  console.log('value: ', value, new Date(value)?.toISOString()?.split("T")[0]);
  const [note, setNote] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const MAX_NOTE_LENGTH = 500;
  const MIN_NOTE_LENGTH = 3;

  const handleClose = useCallback(() => {
    setShow(false);
    setIsLoading(false);
    setErrors({});
    setNote('');
    setValue(null);
    setRadioValue('E');
  }, []);

  const handleShow = useCallback(() => setShow(true), []);

  const validateForm = () => {
    const newErrors = {};

    if (!value || !dayjs(value).isValid()) {
      newErrors.date = 'Please select a valid date';
    }

    if (!note.trim()) {
      newErrors.note = 'Note is required';
    } else if (note.length < MIN_NOTE_LENGTH) {
      newErrors.note = `Note must be at least ${MIN_NOTE_LENGTH} characters`;
    } else if (note.length > MAX_NOTE_LENGTH) {
      newErrors.note = `Note must not exceed ${MAX_NOTE_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function formatDateToYMD(date) {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    if (!saleUniqueIdold) {
      setErrors({ general: 'Sale ID is missing' });
      return;
    }

    setIsLoading(true);

    const formData = {
      type: radioValue,
      date: formatDateToYMD(value),
      note: note.trim(),
    };

    try {
      await fetchContacts(saleUniqueIdold, formData);
      contactRefresh();
      handleClose();
    } catch (error) {
      setIsLoading(false);
      console.error("Error while saving:", error);
      setErrors({ general: 'Failed to save contact. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [radioValue, value, note, saleUniqueIdold, contactRefresh, handleClose]);

  const radios = [
    { name: 'Email', value: 'E', icon: <Envelope size={20} /> },
    { name: 'Phone', value: 'P', icon: <Telephone size={20} /> },
    { name: 'Meeting', value: 'M', icon: <CalendarIcon size={20} /> },
  ];

  const isShowPulseEffect = step === 0
    ? (Date.now() - created * 1000 >= 259200000)
    : (Date.now() - type[step - 1].date * 1000 >= 259200000);

  return (
    <>
      <Button variant="ContactAdd" onClick={handleShow}>
        <PlusLg
          color="#1AB2FF"
          className={`${isShowPulseEffect ? 'vibrate' : ''}`}
          size={16}
          style={{ width: '16px', height: '16px' }}
        />
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className='SalesContact salesTableWrap'
        animation={false}
      >
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
              <Form.Label>Contact Type<sup className="required">*</sup></Form.Label>
              <ButtonGroup className='radioSelectButton'>
                {radios.map((radio, idx) => (
                  <div className='radioSelectButtons' key={idx}>
                    <ToggleButton
                      id={`radio-${idx}`}
                      type="radio"
                      variant={radioValue === radio.value ? 'selectBox' : 'outlineBox'}
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={(e) => setRadioValue(e.currentTarget.value)}
                      disabled={isLoading}
                    >
                      {radio.name} {radio.icon}
                    </ToggleButton>
                  </div>
                ))}
              </ButtonGroup>

              <Form.Label className="flexRemove mt-3 mb-0">Date<sup className="required">*</sup></Form.Label>
              <Calendar value={value} onChange={(e) => setValue(e.value)} dateFormat="dd/mm/yy" disabled={isLoading} locale='en'
                className='w-100 outline-none border rounded'
                style={{ height: '46px', width: '230px', overflow: 'hidden' }}
                showIcon
                showButtonBar
                icon={<Calendar3 color='#667085' size={20} style={{ position: 'absolute', top: '6px' }} />}
                inputStyle={{ width: '88%' }}
                placeholder='DD/MM/YY'
              />
              {errors.date && <div className="error-message mt-2">{errors.date}</div>}

              <Form.Label className="mt-3">Note<sup className="required">*</sup></Form.Label>
              <Typography sx={{ p: 0 }}>
                <Form.Control
                  as="textarea"
                  placeholder="Enter a description..."
                  style={{ height: '152px' }}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={MAX_NOTE_LENGTH}
                  isInvalid={!!errors.note}
                />
                <div className="d-flex justify-content-between mt-1">
                  <small className={errors.note ? 'error-message' : 'text-muted'}>
                    {errors.note || `${note.length}/${MAX_NOTE_LENGTH} characters`}
                  </small>
                </div>
              </Typography>

              {errors.general && (
                <div className="text-danger mt-2">{errors.general}</div>
              )}
            </div>
            <div className='popoverbottom mt-0 pt-4'>
              <Button
                className='closebox'
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className='savebox'
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ContactAdd;