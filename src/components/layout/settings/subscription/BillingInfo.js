import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { ExclamationCircle } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Skeleton } from "primereact/skeleton";
import { toast } from "sonner";
import Sidebar from "./../Sidebar";
import ChangePaymentMethod from "./features/change-payment-method";
import { getBillingPersonalInfo, getPaymentMethodInfo, updateBillingPersonalInfo } from "../../../../APIs/SettingsGeneral";
import { useTrialHeight } from "../../../../app/providers/trial-height-provider";


const BillingInfo = () => {
  const { trialHeight } = useTrialHeight();
  const [activeTab, setActiveTab] = useState("subscription");
  const [generalData, setGeneralData] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const billingInfoQuery = useQuery({
    queryKey: ['getBillingPersonalInfo'],
    queryFn: getBillingPersonalInfo,
    retry: 1,
  });

  const paymentMethodInfoQuery = useQuery({
    queryKey: ['getPaymentMethodInfo'],
    queryFn: getPaymentMethodInfo,
    retry: 1,
  });

  const mutation = useMutation({
    mutationFn: (data) => updateBillingPersonalInfo(data),
    onSuccess: () => {
      toast.success(`Payment Info updated successfully`);
      billingInfoQuery.refetch();
      setIsEdit(false);
    },
    onError: (error) => {
      console.log('error: ', error);
      toast.error(`Failed to update Payment Info. Please try again.`);
    }
  });

  const validateForm = () => {
    let newErrors = {};

    if (!generalData?.payment_name) {
      newErrors.payment_name = "Business name is required";
    }

    if (!generalData?.abn) {
      newErrors.abn = "ABN number is required";
    } else if (generalData?.abn?.length !== 11) {
      newErrors.abn = "Enter 11 digit ABN number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateBillingPaymentInfo = () => {
    if (validateForm()) {
      mutation.mutate(generalData);
    }
  };

  const handleInfoDetails = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === "abn" ? value.replace(/\D/g, "") : value;
    setGeneralData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  useEffect(() => {
    if (billingInfoQuery?.data) {
      setGeneralData(billingInfoQuery?.data);
    }
  }, [billingInfoQuery?.data]);

  return (
    <>
      <div className="settings-wrap settings-BillingInfo">
        <Helmet>
          <title>MeMate - Billing Info</title>
        </Helmet>
        <div className="settings-wrapper">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="settings-content ps-0">
            <div className="headSticky ps-4">
              <h1>Subscription </h1>
              <div className="contentMenuTab">
                <ul>
                  <li>
                    <Link to="/settings/generalinformation/subscription">
                      Subscription
                    </Link>
                  </li>
                  <li className="menuActive">
                    <Link to="/settings/generalinformation/billing-info">
                      Billing Info
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings/generalinformation/bills">Bills</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className={`content_wrap_main bg-grey p-4`} style={{ paddingBottom: `${trialHeight}px` }}>
              <div className="content_wrapper1">
                <div className="topHeadStyle rounded mb-3">
                  <div className="pt-3 ps-4">
                    <h2 className="Exclamation">
                      <span>
                        <ExclamationCircle color="#344054" size={20} />
                      </span>
                      <strong> Next Payment </strong> Your next monthly payment
                      $xxx is scheduled.
                    </h2>
                  </div>
                </div>

                <Row>
                  <Col xs={7}>
                    <Card className="border-0 rounded p-0">
                      <Card.Body>
                        <div className="d-flex justify-content-between mb-2">
                          <h1 className="font-18 m-0">Payment Info</h1>
                          {
                            isEdit ? <div className="d-flex align-items-center gap-3">
                              <button onClick={() => setIsEdit(false)} className="text-button p-0" style={{ fontSize: '13px' }}>Cancel</button>
                              <button disabled={mutation?.isPending} onClick={updateBillingPaymentInfo} className="text-button p-0">
                                {mutation?.isPending ? <ProgressSpinner className='me-2' style={{ width: '18px', height: '18px' }} /> : "Save"}
                              </button>
                            </div>
                              : <button onClick={() => setIsEdit(true)} className="text-button">Edit</button>
                          }

                        </div>

                        <div className="bg-grey p-3 mb-4">
                          <Row>
                            <Col sm={6}>
                              <div className="form-group">
                                <label className="lable d-block">Business Name</label>
                                {
                                  isEdit ? (
                                    <div>
                                      <InputText
                                        value={generalData?.payment_name || ""}
                                        className={`border py-2 ${errors.payment_name ? 'p-invalid' : ''}`}
                                        name="payment_name"
                                        onChange={handleInfoDetails}
                                        placeholder="Business name"
                                      />
                                      {errors.payment_name && (
                                        <small className="p-error d-block mt-1">{errors.payment_name}</small>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="mb-0 font-16 font-600">
                                      {
                                        billingInfoQuery?.isFetching
                                          ? <Skeleton width="6rem" className="mb-2 mt-1"></Skeleton>
                                          : (billingInfoQuery?.data?.payment_name || "-")
                                      }
                                    </p>
                                  )
                                }
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="form-group">
                                <label className="lable d-block mb-1">Australian Business Number</label>
                                {
                                  isEdit ? (
                                    <div>
                                      <InputText
                                        value={generalData?.abn || ""}
                                        className={`border py-2 ${errors.abn ? 'p-invalid' : ''}`}
                                        name="abn"
                                        onChange={handleInfoDetails}
                                        onPaste={(e) => {
                                          e.preventDefault();
                                          const pastedText = e.clipboardData.getData("text").replace(/\D/g, "");
                                          setGeneralData((prev) => ({ ...prev, abn: pastedText }));
                                        }}
                                        placeholder="ABN"
                                        maxLength={11}
                                      />
                                      {errors.abn && (
                                        <small className="p-error d-block mt-1">{errors.abn}</small>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="mb-0 font-16 font-600">
                                      {
                                        billingInfoQuery?.isFetching
                                          ? <Skeleton width="10rem" className="mb-2 mt-1"></Skeleton>
                                          : (billingInfoQuery?.data?.abn || "-")
                                      }
                                    </p>
                                  )}
                              </div>
                            </Col>
                          </Row>
                        </div>

                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xs={5}>
                    <Card className="border-0 rounded">
                      <Card.Body>
                        <h1 className="font-18 mt-0">Payment Method</h1>
                        <div className="bg-grey p-3 mb-4 d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="32" viewBox="0 0 46 32" fill="none">
                              <path d="M0.5 4C0.5 2.067 2.067 0.5 4 0.5H42C43.933 0.5 45.5 2.067 45.5 4V28C45.5 29.933 43.933 31.5 42 31.5H4C2.067 31.5 0.5 29.933 0.5 28V4Z" fill="white" />
                              <path d="M0.5 4C0.5 2.067 2.067 0.5 4 0.5H42C43.933 0.5 45.5 2.067 45.5 4V28C45.5 29.933 43.933 31.5 42 31.5H4C2.067 31.5 0.5 29.933 0.5 28V4Z" stroke="#EAECF0" />
                              <path fillRule="evenodd" clipRule="evenodd" d="M14.3321 21.1444H11.5858L9.52638 13.0565C9.42863 12.6845 9.22108 12.3556 8.91579 12.2006C8.15389 11.811 7.31432 11.501 6.39844 11.3446V11.0332H10.8225C11.4331 11.0332 11.8911 11.501 11.9674 12.0442L13.0359 17.8782L15.7809 11.0332H18.4509L14.3321 21.1444ZM19.9774 21.1444H17.3837L19.5195 11.0332H22.1131L19.9774 21.1444ZM25.4687 13.8343C25.545 13.2898 26.003 12.9784 26.5372 12.9784C27.3768 12.9002 28.2914 13.0566 29.0546 13.4448L29.5125 11.2678C28.7493 10.9564 27.9097 10.8 27.1478 10.8C24.6305 10.8 22.7987 12.2006 22.7987 14.1444C22.7987 15.6231 24.0962 16.3995 25.0121 16.8673C26.003 17.3337 26.3846 17.6451 26.3083 18.1114C26.3083 18.811 25.545 19.1224 24.7831 19.1224C23.8672 19.1224 22.9514 18.8892 22.1131 18.4997L21.6552 20.678C22.5711 21.0662 23.5619 21.2226 24.4778 21.2226C27.3005 21.2994 29.0546 19.9002 29.0546 17.8001C29.0546 15.1553 25.4687 15.0003 25.4687 13.8343ZM38.1318 21.1444L36.0724 11.0332H33.8603C33.4024 11.0332 32.9444 11.3446 32.7918 11.811L28.9783 21.1444H31.6483L32.1812 19.667H35.4618L35.7671 21.1444H38.1318ZM34.2419 13.7562L35.0038 17.5669H32.8681L34.2419 13.7562Z" fill="#172B85" />
                            </svg>
                            <div className="d-flex flex-column">
                              {
                                paymentMethodInfoQuery?.isFetching
                                  ? <Skeleton width="10rem" className="mb-1"></Skeleton>
                                  : <p className="mb-0 font-500 color-344054 font-14"><span className="text-capitalize">{paymentMethodInfoQuery?.data?.card_brand || "-"}</span> ending in {paymentMethodInfoQuery?.data?.last4 || "-"}</p>
                              }
                              {
                                paymentMethodInfoQuery?.isFetching
                                  ? <Skeleton width="10rem" className=""></Skeleton>
                                  : <p className="mb-0 color-475467 font-14">Expiry {paymentMethodInfoQuery?.data?.exp_month > 9 ? paymentMethodInfoQuery?.data?.exp_month : "0" + paymentMethodInfoQuery?.data?.exp_month}/{paymentMethodInfoQuery?.data?.exp_year || "-"}</p>
                              }
                            </div>
                          </div>
                          <Button className="text-button bg-transparent" onClick={() => setVisible(true)}>Change</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePaymentMethod visible={visible} setVisible={setVisible} refetch={() => paymentMethodInfoQuery.refetch()} />
    </>
  );
};

export default BillingInfo;
