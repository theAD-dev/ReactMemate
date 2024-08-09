import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { X, CloudArrowUp } from "react-bootstrap-icons";
import AddNoteModeIcon from "../../../../assets/images/icon/addNoteModeIcon.svg";

const AddNote = () => {
  const [viewShow, setViewShow] = useState(false);
  const [updateDis, setUpdateDis] = useState('');
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const handleClose = () => {
    setViewShow(false);
  };
  const handleShow = () => {
    setViewShow(true);

  };
  // Handle change in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
  
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
    // Function to handle image deletion
    const handleImageDelete = () => {
      setImage(null);
    };
 // Function to handle updating image
 const handleImageUpdate = (e) => {
  handleImageUpload(e);
};
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
        <X size={24} color='#667085'/>
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
                       handleChange(e);
                     }}
                   />
                   {errors.description && <p className="error-message">{errors.description}</p>}
                 </div>
               </div>
             </Col>
           </Row>
           <Row>
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
           </Row>
           <div className="popoverbottom  mt-0 pt-4">
              <Button variant="outline-danger">
              Cancel
              </Button>
              <Button variant="primary save" >
              Save
              </Button>
            </div>
            </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddNote;
