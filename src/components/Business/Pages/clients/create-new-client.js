import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import styles from './client.module.scss';
import { X, Pen } from "react-bootstrap-icons";
import defaultIcon from "../../../../assets/images/icon/default.png";
import { Button } from "react-bootstrap";
import { Placeholder } from "react-bootstrap";

function ClientNew() {
  const [show, setShow] = useState(true); // Set to true for default open
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setShow(false);
    navigate('/clients'); // Navigate to the specified route
  };

  return (
    <div>
      <Offcanvas show={show} onHide={handleClose} placement="end" className={styles.border} style={{ width: '607px' }}>
        <Offcanvas.Body className={styles.p0}>
          <div className={styles.mainHead}>
            <div className="d-flex align-items-center">
              <div className={styles.clientImgOpacity}>
                {/* Uncomment and modify the code below if you need to handle client images */}
                {/* {isFetching ? (
                  <Placeholder as="span" animation="wave" className="ms-2 me-2">
                    <Placeholder
                      xs={12}
                      bg="secondary"
                      size="md"
                      style={{ width: "56px" }}
                    />
                  </Placeholder>
                ) : clientView?.photo ? (
                  <img
                    src={clientView.photo}
                    alt="Client photo"
                    style={{ marginRight: "5px" }}
                    onError={(e) => {
                      e.target.src = defaultIcon;
                      e.target.alt = "Image Not Found";
                    }}
                  />
                ) : (
                  <img src={defaultIcon} alt="defaultIcon" />
                )} */}
              </div>
              <strong>Name</strong>
              <Button className={styles.CustomEdit} onClick={() => setIsEdit(!isEdit)}>
                Edit <Pen size={20} color="#1D2939" />
              </Button>
            </div>
            <button className={styles.CustomCloseModal} onClick={handleClose}>
              <X size={24} color="#667085" />
            </button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default ClientNew;
