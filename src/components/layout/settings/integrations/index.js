import React, { useEffect, useState } from "react";
import { Envelope } from "react-bootstrap-icons";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import EmailIntegrations from "./email-integration";
import GoogleIntegrations from "./google-review-integration";
import style from "./integration.module.scss";
import MailchimpIntegration from "./mailchimp-integration";
import StripeIntegrations from "./stripe-integrations";
import TwilioIntegrations from "./twilio-integration";
import XeroIntegration from "./xero-integration";
import { getEmailIntegrations, getGoogleReviewIntegrations, getStripeIntegrations, getTwilioIntegrations, getXeroIntegrations } from "../../../../APIs/integrations-api";
import { useAuth } from "../../../../app/providers/auth-provider";
import googleAnalyticLogo from "../../../../assets/images/icon/googleAnalyticLogo.png";
import googleCalLogo from "../../../../assets/images/icon/googleCalLogo.png";
import googleLogo from "../../../../assets/images/icon/googleLogo.png";
import stripelogo from "../../../../assets/images/icon/stripeLogo.png";
import xeroLogo from "../../../../assets/images/icon/xeroLogo.png";
import mailchimpLogo from "../../../../assets/images/mailchimp_icon.png";
import twilioLogo from '../../../../assets/images/twilio-logo.png';

const Integrations = () => {
  const location = useLocation();
  const { session } = useAuth();
  const [googleVisible, setGoogleVisible] = useState(false);
  const [stripeVisible, setStripeVisible] = useState(false);
  const [twilioVisible, setTwilioVisible] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);
  const [mailchimpVisible, setMailchimpVisible] = useState(false);

  const stripeIntegrationsQuery = useQuery({ queryKey: ['stripeIntegrations'], queryFn: getStripeIntegrations });
  const googleReviewIntegrationsQuery = useQuery({ queryKey: ['googleReviewIntegrations'], queryFn: getGoogleReviewIntegrations });
  const twilioIntegrationsQuery = useQuery({ queryKey: ['twilioIntegrations'], queryFn: getTwilioIntegrations });
  const emailIntegrationsQuery = useQuery({ queryKey: ['getEmailIntegrations'], queryFn: getEmailIntegrations, retry: 1 });
  const xeroIntegrationsQuery = useQuery({ queryKey: ['getXeroIntegrations'], queryFn: getXeroIntegrations, retry: 1 });

  const integrationsData = [
    {
      id: 4,
      title: "Google Calendar",
      method: "googlecalendar",
      content: `Connect your company's Google Calendar to automatically send booking notifications to your clients.`,
      status: false,
      isConnected: false,
      img: googleCalLogo,
    },
    {
      id: 5,
      title: "Google Analytic Widgets",
      method: "googleanalytic",
      content: `Add Google Analytics to monitor your website's online performance effortlessly.`,
      status: false,
      isConnected: false,
      img: googleAnalyticLogo,
    },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const openTwilioParam = params.get('openTwilio');
    const emailParam = params.get('openEmail');
    setTwilioVisible(openTwilioParam === 'true');
    setEmailVisible(emailParam === 'true');
  }, [location]);
  return (
    <>
      <Helmet>
        <title>MeMate - Integrations</title>
      </Helmet>
      <div className="headSticky">
        <h1>Integrations</h1>
      </div>
      <div className={`content_wrap_main`}>
        <div className="content_wrapper">
          <div className="listwrapper">
            <Row>
              <Col xs={4} className="pb-4">
                <div className={clsx(style.BoxGridWrap, 'h-100')} style={{ position: 'relative' }}>
                  <div className={style.head}>
                    <img src={stripelogo} alt={"Stripe Settings"} />
                    {
                      <button className={stripeIntegrationsQuery?.data?.stripe_secret_key ? style.connected : style.disconnected}>
                        {stripeIntegrationsQuery?.data?.stripe_secret_key ? "Connected" : "Disconnected"}
                        <span className={style.dots}></span>
                      </button>
                    }
                  </div>
                  <div className={style.body}>
                    <h3>{"Stripe Settings"}</h3>
                    <p>{"Integrate Stripe to enable easy online invoice payments via credit card, ensuring quick and secure money transfers to your account."}</p>
                  </div>
                  <div className={style.bottom}>
                    <button className={style.infoButton} onClick={() => { setStripeVisible(true); }}>
                      {!stripeIntegrationsQuery?.data?.stripe_secret_key ? 'Connect' : 'Update'}
                    </button>
                  </div>
                </div>
              </Col>
              <Col xs={4} className="pb-4">
                <div className={clsx(style.BoxGridWrap, 'h-100')} style={{ position: 'relative' }}>
                  <div className={style.head}>
                    <img src={googleLogo} alt={"Google Review Link"} />
                    {
                      <button className={stripeIntegrationsQuery?.data?.stripe_secret_key ? style.connected : style.disconnected}>
                        {googleReviewIntegrationsQuery?.data?.google_review_link ? "Connected" : "Disconnected"}
                        <span className={style.dots}></span>
                      </button>
                    }
                  </div>
                  <div className={style.body}>
                    <h3>{"Google Review Link"}</h3>
                    <p>{"Incorporate your Google Review link  to easily send emails to customers requesting Google reviews with just one click."}</p>
                  </div>
                  <div className={style.bottom}>
                    <button className={style.infoButton} onClick={() => { setGoogleVisible(true); }}>
                      {!googleReviewIntegrationsQuery?.data?.google_review_link ? 'Connect' : 'Update'}
                    </button>
                  </div>
                </div>
              </Col>
              <Col xs={4} className="pb-4">
                <div className={clsx(style.BoxGridWrap, 'h-100')} style={{ position: 'relative' }}>
                  <div className={style.head}>
                    <img src={twilioLogo} style={{ width: '120px', position: 'relative', left: '-20px' }} alt={"Twilio"} />
                    {
                      <button className={twilioIntegrationsQuery?.data?.twilio_token ? style.connected : style.disconnected}>
                        {twilioIntegrationsQuery?.data?.twilio_token ? "Connected" : "Disconnected"}
                        <span className={style.dots}></span>
                      </button>
                    }
                  </div>
                  <div className={style.body}>
                    <h3>{"Twilio"}</h3>
                    <p>{"Integrate Twilio to send SMS notifications to your customers directly from the platform."}</p>
                  </div>
                  <div className={style.bottom}>
                    <button className={style.infoButton} onClick={() => { setTwilioVisible(true); }}>
                      {!twilioIntegrationsQuery?.data?.twilio_token ? 'Connect' : 'Update'}
                    </button>
                  </div>
                </div>
              </Col>
              <Col xs={4} className="pb-4">
                <div className={clsx(style.BoxGridWrap, 'h-100')} style={{ position: 'relative' }}>
                  <div className={style.head}>
                    <img src={mailchimpLogo} style={{ width: '65px', position: 'relative' }} alt={"Mailchimp"} />
                    {
                      <button className={session?.has_mailchimp ? style.connected : style.disconnected}>
                        {session?.has_mailchimp ? "Connected" : "Disconnected"}
                        <span className={style.dots}></span>
                      </button>
                    }
                  </div>
                  <div className={style.body}>
                    <h3>{"Mailchimp"}</h3>
                    <p>{"Integrate Mailchimp to send email notifications to your customers directly from the platform."}</p>
                  </div>
                  <div className={style.bottom}>
                    <button className={style.infoButton} onClick={() => { setMailchimpVisible(true); }}>
                      {!session?.has_mailchimp ? 'Connect' : 'Update'}
                    </button>
                  </div>
                </div>
              </Col>
              <Col xs={4} className="pb-4">
                <div className={clsx(style.BoxGridWrap, 'h-100')} style={{ position: 'relative' }}>
                  <div className={style.head}>
                    <div style={{ background: '#F9FAFB', }} className="d-flex justify-content-center align-items-center p-3 rounded-circle">
                      <Envelope size={32} color="#667085" />
                    </div>
                    {
                      <button className={emailIntegrationsQuery?.data?.outgoing_email && emailIntegrationsQuery?.data?.outgoing_email_verified ? style.connected : emailIntegrationsQuery?.data?.outgoing_email ? style.disconnected : style.disconnected}>
                        {emailIntegrationsQuery?.data?.outgoing_email &&
                          emailIntegrationsQuery?.data?.outgoing_email_verified
                          ? "Verified"
                          : emailIntegrationsQuery?.data?.outgoing_email
                            ? "Pending"
                            : "Not connected"
                        }
                        <span className={style.dots}></span>
                      </button>
                    }
                  </div>
                  <div className={style.body}>
                    <h3>{"Outgoing Email"}</h3>
                    <p>{"Link your email to be used for  all outgoing communications, including quotes, invoices, and reminders, etc."}</p>
                  </div>
                  <div className={style.bottom}>
                    <button className={style.infoButton} onClick={() => { setEmailVisible(true); }}>
                      {!emailIntegrationsQuery?.data?.outgoing_email || emailIntegrationsQuery?.data?.outgoing_email === 'no-reply@memate.com.au' ? 'Connect' : 'Update'}
                    </button>
                  </div>
                </div>
              </Col>
              <Col xs={4} className="pb-4">
                <div className={clsx(style.BoxGridWrap, 'h-100')} style={{ position: 'relative' }}>
                  <div className={style.head}>
                    <img src={xeroLogo} alt="xeroLogo" />

                    {
                      <button className={xeroIntegrationsQuery?.data?.connected ? style.connected : style.disconnected}>
                        {xeroIntegrationsQuery?.data?.connected ? "Connected" : "Disconnected"}
                        <span className={style.dots}></span>
                      </button>
                    }
                  </div>
                  <div className={style.body}>
                    <h3>{"Xero"}</h3>
                    <p>{"Connect Xero to directly send expenses and invoices to your Xero account, simplifying your accounting process."}</p>
                  </div>
                  <XeroIntegration refetch={xeroIntegrationsQuery?.refetch} connected={xeroIntegrationsQuery?.data?.connected} />
                </div>
              </Col>


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
                        <button disabled className={style.infoButton}>
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
      <StripeIntegrations visible={stripeVisible} setVisible={setStripeVisible} stripe={stripeIntegrationsQuery?.data} refetch={stripeIntegrationsQuery?.refetch} />
      <TwilioIntegrations visible={twilioVisible} setVisible={setTwilioVisible} twilio={twilioIntegrationsQuery?.data} refetch={twilioIntegrationsQuery?.refetch} />
      <GoogleIntegrations visible={googleVisible} setVisible={setGoogleVisible} data={googleReviewIntegrationsQuery?.data} refetch={googleReviewIntegrationsQuery?.refetch} />
      <EmailIntegrations visible={emailVisible} setVisible={setEmailVisible} email={emailIntegrationsQuery?.data} refetch={emailIntegrationsQuery?.refetch} />
      <MailchimpIntegration visible={mailchimpVisible} setVisible={setMailchimpVisible} mailchimp={{ mailchimp_api_key: "" }} refetch={() => window.location.reload()} />
    </>
  );
};

export default Integrations;
