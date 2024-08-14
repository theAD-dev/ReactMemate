import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { X, CloudArrowUp } from "react-bootstrap-icons";
import AddNoteModeIcon from "../../../../assets/images/icon/addNoteModeIcon.svg";
import { cardAddNoteApi } from "../../../../APIs/management-api"; // API for fetching


const AddNote = ({ projectId }) => {
  const [viewShow, setViewShow] = useState(false);
  const [updateDis, setUpdateDis] = useState('');
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [addNoteCard, setAddNoteCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setViewShow(false);
  };

  const handleShow = () => {
    setViewShow(true);
  };

  useEffect(() => {
    const fetchProjectCardData = async () => {
      try {
        const data = await cardAddNoteApi(projectId);
        setAddNoteCard(data);
      } catch (error) {
        console.error('Error fetching project card data:', error);
      }
    };

    if (projectId && viewShow) {
      fetchProjectCardData();
    }
  }, [projectId, viewShow]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateDis(value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setImage(null);
  };

  const handleImageUpdate = (e) => {
    handleImageUpload(e);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const noteData = {
        description: updateDis,
        image, // Attach image if needed
      };

      await cardAddNoteApi(projectId, noteData);
      // Optionally, you can show a success message or update state here

      handleClose(); // Close the modal after successful save
    } catch (err) {
      setError('Error saving note. Please try again.');
      console.error('Error updating note:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="linkByttonStyle" onClick={handleShow}>
        Add Note
      </div>

      <Modal
        show={viewShow}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="taskModelProject"
        onHide={handleClose}
        animation={false}
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
                  <label>Note </label>
                  <div className={`inputInfo ${errors.description ? 'error-border' : ''}`}>
                    <textarea
                      type="text"
                      name="description"
                      value={updateDis}
                      placeholder='Enter a message here...'
                      onChange={handleChange}
                    />
                    {errors.description && <p className="error-message">{errors.description}</p>}
                  </div>
                </div>
              </Col>
            </Row>
            {/* Optional image upload section */}
            {/* <Row>
              <Col>
                <div className="formgroup mb-2 mt-3">
                  <label>App Logo</label>
                  <div className="upload-btn-wrapper">
                    <button className="btnup">
                      <div className="iconPerson">
                        <CloudArrowUp color="#475467" size={32} />
                      </div>
                      <div className="textbtm">
                        <p>
                          <span>Click to upload</span> or drag and drop
                          <br />
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                      </div>
                    </button>
                    <input type="file" onChange={handleImageUpload} />
                    {image && (
                      <div className='uploadImgWrap'>
                        <div>
                          <img src={image} alt="Uploaded" />
                          <div className='updatebut'>
                            <button className='update' onClick={handleImageUpdate}>Update</button>
                            <button className='delete' onClick={handleImageDelete}>Delete</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row> */}
          </div>
        </Modal.Body>
        <Modal.Footer className='pt-0'>
          <div className="popoverbottom w-100 border-0 mt-0 pt-0">
            <Button variant="outline-danger" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNote;
