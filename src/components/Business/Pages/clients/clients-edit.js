import React, { useState } from "react";
import { X, ChevronDown ,Telephone} from "react-bootstrap-icons";
import defaultIcon from "../../../../assets/images/icon/default.png";
import { Button, Col, Row, Placeholder, Form } from "react-bootstrap";
import { MenuItem, Select, FormControl as MUIFormControl } from '@mui/material';
import styles from "./memate-select.module.scss";
import { InputGroup } from 'react-bootstrap';
import { PhoneInput } from 'react-international-phone';

const ClientEdit = ({ clientView, isFetching, close, errors, isEdit, countryCode = "US" }) => {
  const [category, setCategory] = useState(clientView?.category || "");
  const [industry, setIndustry] = useState(clientView?.industry || "");
  const [company, setCompany] = useState(clientView?.days_in_company || "");
  const [customer, setCustomer] = useState(clientView?.setCustomer || "");
  const [phone, setPhone] = useState(clientView?.phone || "");
  const [wurl, setUrl] = useState(clientView?.website || "");
  const [abn, setAbn] = useState(clientView?.abn || "");

  const handleSaveClient = () => {
    // Add your save logic here
    console.log("Client details saved:", { category, industry,company,customer,wurl,abn });
  };

  return (
    <>
      {clientView?.is_business ? (
        <>
          <div className={styles.mainHead}>
            <div className="d-flex align-items-center">
              <div className={styles.clientImgOpacity}>
                {isFetching ? (
                  <Placeholder as="span" animation="wave" className="ms-2 me-2">
                    <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
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
                )}
              </div>
              <strong>{clientView?.name}</strong>
            </div>
            <button className={styles.CustomCloseModal} onClick={close}>
              <X size={24} color="#667085" />
            </button>
          </div>
          
          <div className={`${styles.mainScrollWrap} ${styles.editClientValue}`}>
        
            <div className={styles.displayFlexGrid}>
              <strong>Client Details</strong>
              <span>Client ID: {clientView?.id}</span>
            </div>
            <div className={styles.greyBox}>
              <Row>
                <Col md={6}>
                  <p className={styles.labelColor}>Customer Category</p>
                  {isFetching ? (
                    <Placeholder as="span" animation="wave" className="ms-2 me-2">
                      <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                    </Placeholder>
                  ) : (
                    <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                      <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        displayEmpty
                        IconComponent={ChevronDown}
                        style={{ color: '#101828' }}
                      >
                        <MenuItem value="">Platinium</MenuItem>
                      </Select>
                    </MUIFormControl>
                  )}
                </Col>
              </Row>
              <Row className="pt-2">
              <Col md={6}>
                  <p className={styles.labelColor}>Company Name</p>
                  {isFetching ? (
                    <Placeholder as="span" animation="wave" className="ms-2 me-2">
                      <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                    </Placeholder>
                  ) : (
                    <Form.Group className="mb-3">
                      <Form.Control
                        required
                        type="text"
                        placeholder="Company Name"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                      {errors.company && <Form.Text className="text-danger">Industry is required</Form.Text>}
                    </Form.Group>
                  )}
                </Col>
                <Col md={6}>
                  <p className={styles.labelColor}>Industry</p>
                  {isFetching ? (
                    <Placeholder as="span" animation="wave" className="ms-2 me-2">
                      <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                    </Placeholder>
                  ) : (
                    <Form.Group className="mb-3">
                      <Form.Control
                        required
                        type="text"
                        placeholder="Industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                      />
                      {errors.industry && <Form.Text className="text-danger">Industry is required</Form.Text>}
                    </Form.Group>
                  )}
                </Col>
              </Row>
              <Row className="pt-2">
              <Col md={6}>
                  <p className={styles.labelColor}>Customer Type</p>
                  {isFetching ? (
                    <Placeholder as="span" animation="wave" className="ms-2 me-2">
                      <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                    </Placeholder>
                  ) : (
                    <MUIFormControl className="mb-3 mui-select-custom" fullWidth>
                      <Select
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        displayEmpty
                        IconComponent={ChevronDown}
                        style={{ color: '#101828' }}
                      >
                        <MenuItem value="">Long-terms</MenuItem>
                      </Select>
                    </MUIFormControl>
                  )}
                </Col>
                <Col sm={6}>
                      <Form.Group className="mb-3">
                      <Form.Label style={{ color: '#667085', fontSize: '14px', fontWeight: 400, marginBottom: '4px' }}>Phone</Form.Label>
                      <PhoneInput
                      country={countryCode}
                      value={phone}
                        placeholder="Enter phone"
                      // onChange={(e) => setPhone(e.target.value)}
                    />
                    {errors.taskTitle && <Form.Text className="text-danger">Phone number is required</Form.Text>}
                    </Form.Group>
                   </Col>
              </Row>
              <Row className="pt-2">
              <Col md={6}>
                  <p className={styles.labelColor}>ABN</p>
                  {isFetching ? (
                    <Placeholder as="span" animation="wave" className="ms-2 me-2">
                      <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                    </Placeholder>
                  ) : (
                    <Form.Group className="mb-3">
                      <Form.Control
                        required
                        type="text"
                        placeholder="ABN"
                        value={abn}
                        onChange={(e) => setAbn(e.target.value)}
                      />
                      {errors.abn && <Form.Text className="text-danger">Industry is required</Form.Text>}
                    </Form.Group>
                  )}
                </Col>
              <Col md={6}>
                  <p className={styles.labelColor}>Website</p>
                  {isFetching ? (
                    <Placeholder as="span" animation="wave" className="ms-2 me-2">
                      <Placeholder xs={12} bg="secondary" size="md" style={{ width: "56px" }} />
                    </Placeholder>
                  ) : (
                    <Form.Group className="mb-3">
                      <Form.Control
                        required
                        type="text"
                        placeholder="Website URL"
                        value={wurl}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                      {errors.wurl && <Form.Text className="text-danger">Url is required</Form.Text>}
                    </Form.Group>
                  )}
                </Col>
                
              </Row>
            </div>
          </div>
          <div className={styles.FooterClientView}>
            <div className="d-flex justify-content-end align-items-center">
              <Button className={styles.cancelBut} onClick={close}>Cancel</Button>
              <Button onClick={handleSaveClient} className={styles.saveClient}>Save Client Details</Button>
            </div>
          </div>
        </>
      ) : (
       <>
dfvgdgbv
       </>
      )}
    </>
  );
};

export default ClientEdit;
