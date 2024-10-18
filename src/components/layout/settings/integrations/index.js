import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Dialog } from "primereact/dialog";
import style from "./integration.module.scss";
import Button from "react-bootstrap/Button";
import { useForm, Controller } from "react-hook-form";
import stripelogo from "../../../../assets/images/icon/stripeLogo.png";
import xeroLogo from "../../../../assets/images/icon/xeroLogo.png";
import googleLogo from "../../../../assets/images/icon/googleLogo.png";
import googleCalLogo from "../../../../assets/images/icon/googleCalLogo.png";
import googleAnalyticLogo from "../../../../assets/images/icon/googleAnalyticLogo.png";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";
import StripeIntegrations from "./stripe-integrations";
import { useQuery } from "@tanstack/react-query";
import { getStripeIntegrations } from "../../../../APIs/integrations-api";
import GoogleIntegrations from "./google-review-integration";

const schema = yup.object().shape({
  emails: yup.array().of(
    yup.object().shape({
      secret: yup
        .string()
        .email("Invalid secret address")

        .required("secret is required"),
      public: yup.string().required("public is required"),
    })
  ),
});
const Integrations = () => {
  const [activeTab, setActiveTab] = useState("integrations");

  const [googleVisible, setGoogleVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [stripeVisible, setStripeVisible] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const stripeIntegrationsQuery = useQuery({ queryKey: ['stripeIntegrations'], queryFn: getStripeIntegrations });

  const integrationsData = [
    {
      id: 1,
      title: "Stripe Settings",
      method: "stripe",
      content:
        "Integrate Stripe to enable easy online invoice payments via credit card, ensuring quick and secure money transfers to your account.",
      status: false,
      isConnected: !!stripeIntegrationsQuery?.data?.stripe_secret_key || false,
      img: stripelogo,
    },
    {
      id: 2,
      title: "Xero",
      method: "xero",
      content:
        "Connect Xero to directly send expenses and invoices to your Xero account, simplifying your accounting process.",
      status: true,
      isConnected: false,
      img: xeroLogo,
    },
    {
      id: 3,
      title: "Google Review Link",
      method: "googlereview",
      content:
        "Incorporate your Google Review link  to easily send emails to customers requesting Google reviews with just one click.",
      status: false,
      isConnected: false,
      img: googleLogo,
    },
    {
      id: 4,
      title: "Google Calendar",
      method: "googlecalendar",
      content: `Connect your company's Google Calendar to automatically send booking notifications to your clients.`,
      status: true,
      isConnected: false,
      img: googleCalLogo,
    },
    {
      id: 5,
      title: "Google Analytic Widgets",
      method: "googleanalytic",
      content: `Add Google Analytics to monitor your website's online performance effortlessly.`,
      status: true,
      isConnected: false,
      img: googleAnalyticLogo,
    },
  ];

  return (
    <>
      <div className="settings-wrap">
        <div className="settings-wrapper">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="settings-content setModalelBoots">
            <div className="headSticky">
              <h1>Integrations</h1>
            </div>
            <div className={`content_wrap_main`}>
              <div className="content_wrapper">
                <div className="listwrapper">
                  <Row>
                    {integrationsData.map((item) => (
                      <Col key={item.id} xs={4} className="pb-4">
                        <div className={clsx(style.BoxGridWrap, 'h-100')} style={{ position: 'relative' }}>
                          <div className={style.head}>
                            <img src={item.img} alt={item.title} />
                            {
                              <button className={item.isConnected ? style.connected : style.disconnected}>
                                {item.isConnected ? "Connected" : "Disconnected"}
                                <span className={style.dots}></span>
                              </button>
                            }
                          </div>
                          <div className={style.body}>
                            <h3>{item.title}</h3>
                            <p>{item.content}</p>
                          </div>
                          <div className={style.bottom}>
                            {item.status === true ? (
                              <>
                                <Button className="danger-outline-button">Disconnect</Button>
                              </>
                            ) : (
                              <button className={style.infoButton} onClick={() => {
                                item.method === "stripe" ? setStripeVisible(true) : item.method === "googlereview" ? setGoogleVisible(true) : setVisible(true);
                              }}>
                                Connect
                              </button>
                            )}
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StripeIntegrations visible={stripeVisible} setVisible={setStripeVisible} stripe={stripeIntegrationsQuery?.data} refetch={stripeIntegrationsQuery?.refetch} />
      <GoogleIntegrations visible={googleVisible} setVisible={setGoogleVisible} />
    </>
  );
};

export default Integrations;
