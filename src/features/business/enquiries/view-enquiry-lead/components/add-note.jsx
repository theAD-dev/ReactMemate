import React, { useEffect, useState } from 'react';
import { X } from "react-bootstrap-icons";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import AddNoteModeIcon from "../../../../../assets/images/icon/addNoteModeIcon.svg";

const AddNote = ({ submissionId }) => {
  const [viewShow, setViewShow] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [errors, setErrors] = useState({
    description: '',
  });

  const MAX_LENGTH = 2000;
  const MIN_LENGTH = 3;

  const handleClose = () => setViewShow(false);
  const handleShow = () => setViewShow(true);

  const validateNote = (text) => {
    if (!text.trim()) {
      return 'Note is required';
    }
    if (text.length < MIN_LENGTH) {
      return `Note must be at least ${MIN_LENGTH} characters long`;
    }
    if (text.length > MAX_LENGTH) {
      return `Note must not exceed ${MAX_LENGTH} characters`;
    }
    if (/^\s+$/.test(text)) {
      return 'Note cannot contain only whitespace';
    }
    return '';
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setNoteText(value);

    const error = validateNote(value);
    setErrors(prev => ({ ...prev, description: error }));
  };

  const handleSubmit = () => {
    const validationError = validateNote(noteText);

    if (validationError) {
      setErrors(prev => ({ ...prev, description: validationError }));
      return;
    }

    // TODO: Implement API call to save note
    console.log('Saving note for submission:', submissionId, noteText);
    handleClose();
  };

  useEffect(() => {
    if (!viewShow) {
      setNoteText('');
      setErrors({ description: '' });
    }
  }, [viewShow]);

  return (
    <>
      <div className="linkByttonStyle py-2 border-right" onClick={handleShow}>
        Add Note
      </div>

      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="taskModelProject"
        onHide={handleClose}
        animation={false}
        size="lg"
      >
        <Modal.Header className="mb-0 pb-0 border-0">
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
              <img src={AddNoteModeIcon} alt="AddNoteModeIcon" />
              Add Note
            </span>
          </div>
          <button className='CustonCloseModal' onClick={handleClose}>
            <X size={24} color='#667085' />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="ContactModel">
            <Row>
              <Col>
                <div className="formgroup mb-2 mt-2">
                  <label htmlFor="note-input">Note <span className="required">*</span></label>
                  <div className={`inputInfo ${errors.description ? 'error-border' : ''}`}>
                    <textarea
                      id="note-input"
                      type="text"
                      name="note"
                      value={noteText}
                      placeholder='Enter a message here...'
                      onChange={handleChange}
                      maxLength={MAX_LENGTH}
                      rows={10}
                      className="w-100"
                    />
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <small className={errors.description ? "error-message" : "text-muted"}>
                      {errors.description || `${noteText.length}/${MAX_LENGTH} characters`}
                    </small>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className='pt-0'>
          <div className="popoverbottom w-100 border-0 mt-0 pt-0">
            <Button
              variant="outline-danger"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary save"
              onClick={handleSubmit}
              disabled={!!errors.description}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNote;
