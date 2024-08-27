import React, { useState, useEffect } from "react";
import { supplierstReadApi } from "../../../../APIs/SuppliersApi";
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
import styles from "./suppliers.module.scss";
import { Col, Row } from "react-bootstrap";
import { Placeholder } from "react-bootstrap";
import SuppliersEdit from "./suppliers-edit";

const SuppliersView = ({ id, close }) => {
    const [suppView, setsuppView] = useState();
    const [isFetching, setIsFetching] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [errors, setErrors] = useState({
      name: false,
    });
  
    useEffect(() => {
      const fetchData = async () => {
        setIsFetching(true);
        try {
          const data = await supplierstReadApi(id);
          setsuppView(data);
        } catch (error) {
          console.error("Error fetching Suppliers information:", error);
        } finally {
          setIsFetching(false);
        }
      };
  
      fetchData();
    }, [id]);

    

    const handleEditSupp = () => {
    
    };


  return (
    <>
      
     
         {isEdit ? (
                    <>

                 <SuppliersEdit isFetching={isFetching} suppView={suppView } close={close} errors={errors} isEdit={isEdit}/>
                    </>
                     )
                     : (
                       <>
           <div className={styles.mainHead}>
            <div className="d-flex align-items-center">
              <div className={styles.suppliersImgOpacity}>
                {isFetching ? (
                  <Placeholder as="span" animation="wave" className="ms-2 me-2">
                    <Placeholder
                      xs={12}
                      bg="secondary"
                      size="md"
                      style={{ width: "56px" }}
                    />
                  </Placeholder>
                ) : suppView?.photo ? (
                  <img
                    src={suppView.photo}
                    alt="Client photo"
                   
                    onError={(e) => {
                      e.target.src = defaultIcon;
                      e.target.alt = "Image Not Found";
                    }}
                  />
                ) : (
                  <img src={defaultIcon} alt="defaultIcon" />
                )}
              </div>
              <strong>{suppView?.name}</strong>
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
              <span>Client ID: PVG-SP001	</span>
            </div>
            <div className={styles.greyBox}>
              <Row>
                <Col md={6}>
                  <p className={styles.labelColor}>Company Name</p>
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
                      {suppView?.name}
                    </h3>
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
                        <span>{suppView?.email}</span>
                        <ArrowUpRight size={20} color="#106B99" />
                      </a>
                    </h3>
                  )}
                </Col>
              </Row>
              <Row className="pt-2">
               
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
                       <span>{suppView?.website}</span>
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
                   <h3 className={styles.inputValue}>{suppView?.phone}</h3>
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
                    <h3 className={styles.inputValue}>{suppView?.abn}</h3>
                  )}
                </Col>
                
              </Row>
             
            </div>
            {/* Grey Box */}
            {/* Grey Box */}
            <div className={styles.displayFlexGrid}>
              <strong>Services</strong>
            </div>
         
            <div className={`${styles.greyBox} ${styles.servicesTags}`}>
              <Row>
                <Col md={12}>
                <ul>
                  <li>Office Cleaning</li>
                  <li>Internet Bills</li>
                </ul>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
               <p>At the heart of our operations, we pride ourselves on offering a comprehensive suite of 
                supplier services designed to streamline and enhance your business processes. Our services 
                are meticulously tailored to meet the diverse needs of our clients, ensuring optimal 
                outcomes and unparalleled efficiency.</p>
                </Col>
              </Row>
            </div>
            {/* Grey Box */}
            {/* Grey Box */}
            <div className={`${styles.displayFlexGrid} ${styles.marginBottom}`}>
              <strong>Contact Person</strong>
            </div>
            {suppView?.contact_persons.map(({ id }, index) => {
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

            {suppView?.addresses.map(
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
                      {suppView?.description}
                    </p>
                  )}
                </Col>
              </Row>
            </div>
            {/* Grey Box */}
          </div>
    
          <div className={styles.FooterSuppliersView}>
            <div className="d-flex justify-content-end align-items-center">
              <Button className={styles.cancelBut} onClick={close}>Cancel</Button>
              <Button onClick={handleEditSupp} className={styles.savesupplier}>Edit</Button>
            </div>
          </div>
                       </>
       
      
         
        
      )}
    </>
  );
};

export default SuppliersView;
