import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { X } from "react-bootstrap-icons";
import AddNoteModeIcon from "../../../../../assets/images/icon/addNoteModeIcon.svg";
import { createProjectNoteById } from '../../../../../APIs/management-api';
import { useMutation } from '@tanstack/react-query';

const AddNote = ({ projectId, projectCardData }) => {
  const [viewShow, setViewShow] = useState(false);
  const [updateDis, setUpdateDis] = useState('');
  const [errors, setErrors] = useState({});
  const handleClose = () => setViewShow(false);
  const handleShow = () => setViewShow(true);
  const mutation = useMutation({
    mutationFn: (data) => createProjectNoteById(projectId, data),
    onSuccess: () => {
      handleClose();
      projectCardData(projectId);
    },
    onError: (error) => {
      console.error('Error creating task:', error);
    }
  });

  const handleChange = () => {
    if (!updateDis) return setErrors((errs) => ({ ...errs, description: "Note is required" }));
    else setErrors((errs) => ({ ...errs, description: "" }));
    mutation.mutate({ text: updateDis });
  };

  useEffect(() => {
    if (!viewShow) {
      setUpdateDis('');
      setErrors({});
    }
  }, [viewShow])

  return (
    <>
      {/* View modal trigger */}
      <div className="linkByttonStyle" onClick={handleShow}>
        Add Note
      </div>

      {/* View modal */}
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
                      name="Enter a message here..."
                      value={updateDis}
                      placeholder='Enter a message here...'
                      onChange={(e) => {
                        setUpdateDis(e.target.value);
                      }}
                    />
                  </div>
                  {errors.description && <p className="error-message">{errors.description}</p>}
                </div>
              </Col>
            </Row>
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
                          <br></br>
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
          <div className="popoverbottom w-100  border-0 mt-0 pt-0">
            <Button variant="outline-danger" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary save" onClick={handleChange}>
              {mutation.isPending ? "Loading..." : "Save"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNote;
