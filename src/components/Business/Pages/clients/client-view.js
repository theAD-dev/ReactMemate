import React, { useState, useEffect } from "react";
import { clientEditApi } from "../../../../APIs/ClientsApi";
import {
  X,
  Pen,
  ArrowUpRight,
  Telephone,
  StarFill,
} from "react-bootstrap-icons";
import defaultIcon from "../../../../assets/images/icon/default.png";
import Gmap from "../../../../assets/images/google_maps_ico.png";
import { Button } from "react-bootstrap";
import styles from "./memate-select.module.scss";
import { Col, Row } from "react-bootstrap";
import { Placeholder } from "react-bootstrap";
import ClientEdit from "./clients-edit";

const ClientView = ({ id, close }) => {
    const [clientView, setClientView] = useState();
    const [isFetching, setIsFetching] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({
      name: false,
    });
  
    useEffect(() => {
      const fetchData = async () => {
        setIsFetching(true);
        try {
          const data = await clientEditApi(id);
          setClientView(data);
        } catch (error) {
          console.error("Error fetching client information:", error);
        } finally {
          setIsFetching(false);
        }
      };
  
      fetchData();
    }, [id]);

  return (
    <>
      {clientView?.is_business ? (
        <>
         {isEdit ? (
                    <>

                 <ClientEdit isFetching={isFetching} clientView={clientView } close={close} errors={errors} isEdit={isEdit}/>
                    </>
                     )
                     : (
                       <>
           <div className={styles.mainHead}>
            <div className="d-flex align-items-center">
              <div className={styles.clientImgOpacity}>
                {isFetching ? (
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
                )}
              </div>
              <strong>{clientView?.name}</strong>
              <Button className={styles.CustomEdit}
                onClick={() => setIsEdit(!isEdit)}
                disabled={isFetching}
              >
                Edit <Pen size={20} color="#1D2939" />
              </Button>
            </div>
            <button className={styles.CustomCloseModal} onClick={close}>
              <X size={24} color="#667085" />
            </button>
          </div>

          <div className={styles.mainScrollWrap}>
            {/* Grey Box */}
            <div className={styles.displayFlexGrid}>
              <strong>Client Details</strong>
              <span>Client ID: {clientView?.id}</span>
            </div>
            <div className={styles.greyBox}>
              <Row>
                <Col md={12}>
                  <p className={styles.labelColor}>Customer Category</p>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <h3 className={styles.inputValue}>
                      {clientView?.category}
                    </h3>
                  )}
                </Col>
              </Row>
              <Row className="pt-2">
                <Col md={6}>
                  <p className={styles.labelColor}>ABN</p>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <h3 className={styles.inputValue}>{clientView?.abn}</h3>
                  )}
                </Col>
                <Col md={6}>
                  <p className={styles.labelColor}>Industry</p>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <h3 className={styles.inputValue}>
                      {clientView?.industry}
                    </h3>
                  )}
                </Col>
              </Row>
              <Row className="pt-2">
                <Col md={6}>
                  <p className={styles.labelColor}>Customer Type</p>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <h3 className={styles.inputValue}>
                      {clientView?.is_business ? (
                        <>
                          <span>Business</span>
                        </>
                      ) : (
                        <span>Individual</span>
                      )}
                    </h3>
                  )}
                </Col>
                <Col md={6}>
                  <p className={styles.labelColor}>Phone</p>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <h3 className={styles.inputValue}>{clientView?.phone}</h3>
                  )}
                </Col>
              </Row>
              <Row className="pt-2">
                <Col md={6}>
                  <p className={styles.labelColor}>Email</p>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <h3 className={styles.inputValue}>
                      <a href="#">
                        <span>{clientView?.email}</span>
                        <ArrowUpRight size={20} color="#106B99" />
                      </a>
                    </h3>
                  )}
                </Col>
                <Col md={6}>
                  <p className={styles.labelColor}>Website</p>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <h3 className={styles.inputValue}>
                      <a href="#">
                        <span>{clientView?.website}</span>
                        <ArrowUpRight size={20} color="#106B99" />
                      </a>
                    </h3>
                  )}
                </Col>
              </Row>
            </div>
            {/* Grey Box */}
            {/* Grey Box */}
            <div className={styles.displayFlexGrid}>
              <strong>Payment Terms</strong>
            </div>
            <div className={styles.greyBox}>
              <Row>
                <Col md={12}>
                  <p className={styles.labelColor}>Payment Terms</p>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <h3 className={styles.inputValue}>
                      {clientView?.payment_terms}
                    </h3>
                  )}
                </Col>
              </Row>
            </div>
            {/* Grey Box */}
            {/* Grey Box */}
            <div className={`${styles.displayFlexGrid} ${styles.marginBottom}`}>
              <strong>Contact Person</strong>
            </div>
            {clientView?.contact_persons.map(({ id }, index) => {
              <div className={styles.greyBox} key={`address-${id || index}`}>
                <ul className={styles.contactStar}>
                  <li>
                    <StarFill size={16} color="#FFCB45" />
                  </li>
                </ul>
                <Row className="pt-2">
                  <Col md={6}>
                    <p className={styles.labelColor}>Full Name</p>
                    {isFetching ? (
                      <Placeholder
                        as="span"
                        animation="wave"
                        className="ms-2 me-2"
                      >
                        <Placeholder
                          xs={12}
                          bg="secondary"
                          size="md"
                          style={{ width: "56px" }}
                        />
                      </Placeholder>
                    ) : (
                      <h3 className={styles.inputValue}>Paul Stein</h3>
                    )}
                  </Col>
                  <Col md={6}>
                    <p className={styles.labelColor}>Email</p>
                    {isFetching ? (
                      <Placeholder
                        as="span"
                        animation="wave"
                        className="ms-2 me-2"
                      >
                        <Placeholder
                          xs={12}
                          bg="secondary"
                          size="md"
                          style={{ width: "56px" }}
                        />
                      </Placeholder>
                    ) : (
                      <h3 className={styles.inputValue}>
                        <a href="#">
                          <span>client@email.com</span>
                          <ArrowUpRight size={20} color="#106B99" />
                        </a>
                      </h3>
                    )}
                  </Col>
                </Row>

                <Row className="pt-2">
                  <Col md={6}>
                    <p className={styles.labelColor}>Position</p>
                    {isFetching ? (
                      <Placeholder
                        as="span"
                        animation="wave"
                        className="ms-2 me-2"
                      >
                        <Placeholder
                          xs={12}
                          bg="secondary"
                          size="md"
                          style={{ width: "56px" }}
                        />
                      </Placeholder>
                    ) : (
                      <h3 className={styles.inputValue}>
                        Specialist Claims Manager
                      </h3>
                    )}
                  </Col>
                  <Col md={6}>
                    <p className={styles.labelColor}>Phone</p>
                    {isFetching ? (
                      <Placeholder
                        as="span"
                        animation="wave"
                        className="ms-2 me-2"
                      >
                        <Placeholder
                          xs={12}
                          bg="secondary"
                          size="md"
                          style={{ width: "56px" }}
                        />
                      </Placeholder>
                    ) : (
                      <h3 className={styles.inputValue}>
                        {" "}
                        <a href="#">
                          1300882582
                          <Telephone size={20} color="#106B99" />
                        </a>
                      </h3>
                    )}
                  </Col>
                </Row>
              </div>;
            })}
            {/* Grey Box */}
            {/* Grey Box */}

            <div
              className={` ${styles.displayFlexGrid} ${styles.marginBottom}`}
            >
              <strong>Locations</strong>
            </div>

            {clientView?.addresses.map(
              (
                { id, country, city_name, address, state, postcode, is_main },
                index
              ) => {
                if (is_main === false) {
                  return (
                    <div
                      className={`mt-3 ${styles.greyBox}`}
                      key={`address-${id || index}`}
                    >
                      <ul className={styles.contactStar}>
                        <li className={styles.active}>
                          <StarFill size={16} color="#FFCB45" />
                        </li>
                        <li>
                          <img src={Gmap} alt="Gmap" />
                        </li>
                      </ul>
                      <Row className="pt-2">
                        <Col md={6}>
                          <p className={styles.labelColor}>Location Name</p>
                          {isFetching ? (
                            <Placeholder
                              as="span"
                              animation="wave"
                              className="ms-2 me-2"
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                size="md"
                                style={{ width: "56px" }}
                              />
                            </Placeholder>
                          ) : (
                            <h3 className={styles.inputValue}>
                              {is_main
                                ? "Main Location"
                                : `Location ${index + 1}`}
                            </h3>
                          )}
                        </Col>
                        <Col md={6}>
                          <p className={styles.labelColor}>Country</p>
                          {isFetching ? (
                            <Placeholder
                              as="span"
                              animation="wave"
                              className="ms-2 me-2"
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                size="md"
                                style={{ width: "56px" }}
                              />
                            </Placeholder>
                          ) : (
                            <h3 className={styles.inputValue}>{country}</h3>
                          )}
                        </Col>
                      </Row>
                      <Row className="pt-2">
                        <Col md={6}>
                          <p className={styles.labelColor}>Street Address</p>
                          {isFetching ? (
                            <Placeholder
                              as="span"
                              animation="wave"
                              className="ms-2 me-2"
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                size="md"
                                style={{ width: "56px" }}
                              />
                            </Placeholder>
                          ) : (
                            <h3 className={styles.inputValue}>{address}</h3>
                          )}
                        </Col>
                        <Col md={6}>
                          <p className={styles.labelColor}>State</p>
                          {isFetching ? (
                            <Placeholder
                              as="span"
                              animation="wave"
                              className="ms-2 me-2"
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                size="md"
                                style={{ width: "56px" }}
                              />
                            </Placeholder>
                          ) : (
                            <h3 className={styles.inputValue}>{state}</h3>
                          )}
                        </Col>
                      </Row>
                      <Row className="pt-2">
                        <Col md={6}>
                          <p className={styles.labelColor}>City/Suburb</p>
                          {isFetching ? (
                            <Placeholder
                              as="span"
                              animation="wave"
                              className="ms-2 me-2"
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                size="md"
                                style={{ width: "56px" }}
                              />
                            </Placeholder>
                          ) : (
                            <h3 className={styles.inputValue}>{city_name}</h3>
                          )}
                        </Col>
                        <Col md={6}>
                          <p className={styles.labelColor}>Postcode</p>
                          {isFetching ? (
                            <Placeholder
                              as="span"
                              animation="wave"
                              className="ms-2 me-2"
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                size="md"
                                style={{ width: "56px" }}
                              />
                            </Placeholder>
                          ) : (
                            <h3 className={styles.inputValue}>
                              {postcode || "N/A"}
                            </h3>
                          )}
                        </Col>
                      </Row>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className={`mt-3 ${styles.greyBox}`}
                      key={`address-${id || index}`}
                    >
                      <Row className="pt-2">
                        <Col md={12}>
                          <p>No Address</p>
                        </Col>
                      </Row>
                    </div>
                  );
                }
              }
            )}

            {/* Grey Box */}
            {/* Grey Box */}
            <div className={styles.displayFlexGrid}>
              <strong>Client Description</strong>
            </div>
            <div className={styles.greyBox}>
              <Row className="pt-2">
                <Col md={12}>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <p className={styles.paragraphColor}>
                      {clientView?.description}
                    </p>
                  )}
                </Col>
              </Row>
            </div>
            {/* Grey Box */}
          </div>
          <div className={styles.FooterClientView}>
            <Button className={styles.deleteClient}>Delete Client</Button>
          </div>
                       </>
                     )
                   }
        
        </>
      ) : (
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Induvisual>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        
        <>
         {isEdit ? (
                     <>
<ClientEdit isFetching={isFetching} close={close} errors={errors} isEdit={isEdit}/>
                     </>
                     )
                     : (
                       <>

<div className={styles.mainHead}>
            <div className="d-flex align-items-center">
              <div className={styles.clientImgOpacity}>
                {isFetching ? (
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
                )}
              </div>
              <strong>{clientView?.name}</strong>
              <Button
                onClick={() => setIsEdit(!isEdit)}
                disabled={isFetching}
              >
                Edit <Pen size={20} color="#1D2939" />
              </Button>
            </div>
            <button className={styles.CustomCloseModal} onClick={close}>
              <X size={24} color="#667085" />
            </button>
          </div>

          <div className={styles.mainScrollWrap}>
            {/* Grey Box */}
            <div className={styles.displayFlexGrid}>
              <strong>Client Details</strong>
              <span>Client ID: {clientView?.id}</span>
            </div>
            <div className={styles.greyBox}>
              <Row>
                <Col md={12}>
                  <p className={styles.labelColor}>Customer Category</p>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <h3 className={styles.inputValue}>
                      {clientView?.category}
                    </h3>
                  )}
                </Col>
              </Row>
              <Row className="pt-2">
                <Col md={6}>
                  <p className={styles.labelColor}>Email</p>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <h3 className={styles.inputValue}>
                      <a href="#">
                        <span>{clientView?.email}</span>
                        <ArrowUpRight size={20} color="#106B99" />
                      </a>
                    </h3>
                  )}
                </Col>
                <Col md={6}>
                  <p className={styles.labelColor}>Phone</p>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <h3 className={styles.inputValue}>{clientView?.phone}</h3>
                  )}
                </Col>
              </Row>
            </div>
            {/* Grey Box */}

            {/* Grey Box */}

            <div
              className={` ${styles.displayFlexGrid} ${styles.marginBottom}`}
            >
              <strong>Locations</strong>
            </div>

            {clientView?.addresses.map(
              (
                { id, country, city_name, address, state, postcode, is_main },
                index
              ) => {
                if (is_main === false) {
                  return (
                    <div
                      className={`mt-3 ${styles.greyBox}`}
                      key={`address-${id || index}`}
                    >
                      <ul className={styles.contactStar}>
                        <li className={styles.active}>
                          <StarFill size={16} color="#FFCB45" />
                        </li>
                        <li>
                          <img src={Gmap} alt="Gmap" />
                        </li>
                      </ul>
                      <Row className="pt-2">
                        <Col md={12}>
                          <p className={styles.labelColor}>Location Name</p>
                          {isFetching ? (
                            <Placeholder
                              as="span"
                              animation="wave"
                              className="ms-2 me-2"
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                size="md"
                                style={{ width: "56px" }}
                              />
                            </Placeholder>
                          ) : (
                            <h3 className={styles.inputValue}>
                              {is_main
                                ? "Main Location"
                                : `Location ${index + 1}`}
                            </h3>
                          )}
                        </Col>
                      </Row>
                      <Row className="pt-2">
                        <Col md={12}>
                          <p className={styles.labelColor}>Country</p>
                          {isFetching ? (
                            <Placeholder
                              as="span"
                              animation="wave"
                              className="ms-2 me-2"
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                size="md"
                                style={{ width: "56px" }}
                              />
                            </Placeholder>
                          ) : (
                            <h3 className={styles.inputValue}>{country}</h3>
                          )}
                        </Col>
                      </Row>
                      <Row className="pt-2">
                        <Col md={6}>
                          <p className={styles.labelColor}>Street Address</p>
                          {isFetching ? (
                            <Placeholder
                              as="span"
                              animation="wave"
                              className="ms-2 me-2"
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                size="md"
                                style={{ width: "56px" }}
                              />
                            </Placeholder>
                          ) : (
                            <h3 className={styles.inputValue}>{address}</h3>
                          )}
                        </Col>
                        <Col md={6}>
                          <p className={styles.labelColor}>State</p>
                          {isFetching ? (
                            <Placeholder
                              as="span"
                              animation="wave"
                              className="ms-2 me-2"
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                size="md"
                                style={{ width: "56px" }}
                              />
                            </Placeholder>
                          ) : (
                            <h3 className={styles.inputValue}>{state}</h3>
                          )}
                        </Col>
                      </Row>
                      <Row className="pt-2">
                        <Col md={6}>
                          <p className={styles.labelColor}>City/Suburb</p>
                          {isFetching ? (
                            <Placeholder
                              as="span"
                              animation="wave"
                              className="ms-2 me-2"
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                size="md"
                                style={{ width: "56px" }}
                              />
                            </Placeholder>
                          ) : (
                            <h3 className={styles.inputValue}>{city_name}</h3>
                          )}
                        </Col>
                        <Col md={6}>
                          <p className={styles.labelColor}>Postcode</p>
                          {isFetching ? (
                            <Placeholder
                              as="span"
                              animation="wave"
                              className="ms-2 me-2"
                            >
                              <Placeholder
                                xs={12}
                                bg="secondary"
                                size="md"
                                style={{ width: "56px" }}
                              />
                            </Placeholder>
                          ) : (
                            <h3 className={styles.inputValue}>
                              {postcode || "N/A"}
                            </h3>
                          )}
                        </Col>
                      </Row>
                    </div>
                  );
                } else {
                  return (
                    <div
                      className={`mt-3 ${styles.greyBox}`}
                      key={`address-${id || index}`}
                    >
                      <Row className="pt-2">
                        <Col md={12}>
                          <p>No Address</p>
                        </Col>
                      </Row>
                    </div>
                  );
                }
              }
            )}

            {/* Grey Box */}
            {/* Grey Box */}
            <div className={styles.displayFlexGrid}>
              <strong>Client Description</strong>
            </div>
            <div className={styles.greyBox}>
              <Row className="pt-2">
                <Col md={12}>
                  {isFetching ? (
                    <Placeholder
                      as="span"
                      animation="wave"
                      className="ms-2 me-2"
                    >
                      <Placeholder
                        xs={12}
                        bg="secondary"
                        size="md"
                        style={{ width: "56px" }}
                      />
                    </Placeholder>
                  ) : (
                    <p className={styles.paragraphColor}>
                      {clientView?.description}
                    </p>
                  )}
                </Col>
              </Row>
            </div>
            {/* Grey Box */}

            {/* Grey Box */}
            <div className={styles.displayFlexGrid}>
              <strong>Calculations</strong>
            </div>
            <div>
              <Row className="pt-2">
                <Col md={6}>
                  <div className={styles.greyBox}>
                    <>
                      <p className={styles.labelColor}>Total Turnover:</p>
                      {isFetching ? (
                        <Placeholder
                          as="span"
                          animation="wave"
                          className="ms-2 me-2"
                        >
                          <Placeholder
                            xs={12}
                            bg="secondary"
                            size="md"
                            style={{ width: "56px" }}
                          />
                        </Placeholder>
                      ) : (
                        <h3 className={styles.inputValue}>$32,488.80</h3>
                      )}
                    </>
                    <>
                      <p className={styles.labelColor}>
                        Average Weekly Turnover:
                      </p>
                      {isFetching ? (
                        <Placeholder
                          as="span"
                          animation="wave"
                          className="ms-2 me-2"
                        >
                          <Placeholder
                            xs={12}
                            bg="secondary"
                            size="md"
                            style={{ width: "56px" }}
                          />
                        </Placeholder>
                      ) : (
                        <h3 className={styles.inputValue}>$7,336.18</h3>
                      )}
                    </>
                    <>
                      <p className={styles.labelColor}>Total orders:</p>
                      {isFetching ? (
                        <Placeholder
                          as="span"
                          animation="wave"
                          className="ms-2 me-2"
                        >
                          <Placeholder
                            xs={12}
                            bg="secondary"
                            size="md"
                            style={{ width: "56px" }}
                          />
                        </Placeholder>
                      ) : (
                        <h3 className={styles.inputValue}>3</h3>
                      )}
                    </>
                  </div>
                </Col>
                <Col md={6}>
                  <div className={styles.greyBox}>
                    <>
                      <p className={styles.labelColor}>Total requests:</p>
                      {isFetching ? (
                        <Placeholder
                          as="span"
                          animation="wave"
                          className="ms-2 me-2"
                        >
                          <Placeholder
                            xs={12}
                            bg="secondary"
                            size="md"
                            style={{ width: "56px" }}
                          />
                        </Placeholder>
                      ) : (
                        <h3 className={styles.inputValue}>2</h3>
                      )}
                    </>
                    <>
                      <p className={styles.labelColor}>Order Frequency:</p>
                      {isFetching ? (
                        <Placeholder
                          as="span"
                          animation="wave"
                          className="ms-2 me-2"
                        >
                          <Placeholder
                            xs={12}
                            bg="secondary"
                            size="md"
                            style={{ width: "56px" }}
                          />
                        </Placeholder>
                      ) : (
                        <h3 className={styles.inputValue}>0.22 p/m</h3>
                      )}
                    </>
                    <>
                      <p className={styles.labelColor}>Average order:</p>
                      {isFetching ? (
                        <Placeholder
                          as="span"
                          animation="wave"
                          className="ms-2 me-2"
                        >
                          <Placeholder
                            xs={12}
                            bg="secondary"
                            size="md"
                            style={{ width: "56px" }}
                          />
                        </Placeholder>
                      ) : (
                        <h3 className={styles.inputValue}>$</h3>
                      )}
                    </>
                  </div>
                </Col>
              </Row>
            </div>
            {/* Grey Box */}
            {/* Grey Box */}

            <div className={`mt-4 ${styles.greyBox}`}>
              <Row className="pt-2">
                <Col md={12}>
                  <>
                    <p className={styles.labelColor}>Date Entered:</p>
                    {isFetching ? (
                      <Placeholder
                        as="span"
                        animation="wave"
                        className="ms-2 me-2"
                      >
                        <Placeholder
                          xs={12}
                          bg="secondary"
                          size="md"
                          style={{ width: "56px" }}
                        />
                      </Placeholder>
                    ) : (
                      <h3 className={styles.inputValue}>14.09.2023</h3>
                    )}
                  </>
                </Col>
              </Row>
            </div>
            {/* Grey Box */}
          </div>
          <div className={styles.FooterClientView}>
            <Button className={styles.deleteClient}>Delete Client</Button>
          </div>
                       </>
                     )
                   }
         
        </>
      )}
    </>
  );
};

export default ClientView;
