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
import stripHeadLogo from "../../../../assets/images/icon/stripHeadLogo.png";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
  const [visible, setVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      keys: [{ secret: "", public: "", commission: "" }],
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const integrationsData = [
    {
      id: 1,
      title: "Stripe Settings",
      content:
        "Integrate Stripe to enable easy online invoice payments via credit card, ensuring quick and secure money transfers to your account.",
      status: false,
      img: stripelogo,
    },
    {
      id: 2,
      title: "Xero",
      content:
        "Connect Xero to directly send expenses and invoices to your Xero account, simplifying your accounting process.",
      status: true,
      img: xeroLogo,
    },
    {
      id: 3,
      title: "Google Review Link",
      content:
        "Incorporate your Google Review link  to easily send emails to customers requesting Google reviews with just one click.",
      status: true,
      img: googleLogo,
    },
    {
      id: 4,
      title: "Google Calendar",
      content: `Connect your company's Google Calendar to automatically send booking notifications to your clients.`,
      status: true,
      img: googleCalLogo,
    },
    {
      id: 5,
      title: "Google Analytic Widgets",
      content: `Add Google Analytics to monitor your website's online performance effortlessly.`,
      status: true,
      img: googleAnalyticLogo,
    },
  ];

  const handleClose = (e) => {
    setVisible(false);
  };
  const footerContent = (
    <div className="d-flex justify-content-end gap-2">
      <Button className="outline-button" onClick={handleClose}>
        Cancel
      </Button>
      <Button className="solid-button" style={{ width: "132px" }}>
        Save Details
      </Button>
    </div>
  );

  const headerElement = (
    <div className={`${style.modalHeader}`}>
      <div className="d-flex align-items-center gap-2">
        <img src={stripHeadLogo} alt={stripHeadLogo} />
        Stripe Settings
      </div>
    </div>
  );

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
                      <Col key={item.id} xs={4}>
                        <div className={style.BoxGridWrap}>
                          <div className={style.head}>
                            <img src={item.img} alt={item.title} />

                            {item.status === true ? (
                              <button>Connected</button>
                            ) : (
                                <button className={item.status ? style.connected : style.disconnected}>
                                {item.status ? "Connected" : "Disconnected"}
                                <span className={style.dots}></span>
                                </button>

                              
                            )}
                          </div>
                          <div className={style.body}>
                            <h3>{item.title}</h3>
                            <p>{item.content}</p>
                          </div>
                          <div className={style.bottom}>
                            {item.status === true ? (
                              <></>
                            ) : (
                              <button onClick={() => setVisible(true)}>
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

      <Dialog
        visible={visible}
        modal={true}
        header={headerElement}
        footer={footerContent}
        className={`${style.modal} custom-modal custom-scroll-integration `}
        onHide={handleClose}
      >
        <div className="d-flex flex-column">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={style.formWrapEmail}>
              <div className={style.boxGroupList}>
                <div className="d-flex mb-5">
                  <label htmlFor="keys.secret">Stripe Secret Key</label>
                  <Controller
                    name="keys.secret"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="keys.secret"
                        placeholder="sk_live_51K8dr3FsxeMMC1vRbmv4mdEFh"
                        type="text"
                      />
                    )}
                  />
                </div>
                {errors.keys?.secret && <p>{errors.keys.secret.message}</p>}
              </div>
              <div className={style.boxGroupList}>
                <div className="d-flex mb-5">
                  <label htmlFor="keys.public">Stripe Public Key</label>
                  <Controller
                    name="keys.public"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="keys.public"
                        placeholder="pk_live_51K8dr3FsxeMMC1vRkqTTiEJgDN"
                        type="text"
                      />
                    )}
                  />
                </div>
                {errors.keys?.public && <p>{errors.keys.public.message}</p>}
              </div>
              <div className={style.boxGroupList}>
                <div className="d-flex mb-5">
                  <label htmlFor="keys.commission">Commission</label>
                  <Controller
                    name="keys.commission"
                    control={control}
                    render={({ field }) => (
                      <div className={style.commesionBox}>
                        <span>$</span>
                        <input
                          style={{ width: "93px" }}
                          {...field}
                          id="keys.commission"
                          placeholder="2.00"
                          type="number"
                        />
                      </div>
                    )}
                  />
                </div>
                {errors.keys?.commission && (
                  <p>{errors.keys.commission.message}</p>
                )}
              </div>
            </div>
          </form>
          <div className={style.tmsCondition}>
            <ul>
              <h3 className="mt-0">Step 1: Sign in to Your Stripe Account</h3>
              <li>
                    Access Your Stripe Account: Log in to your Stripe account at
                    stripe.com. If you don’t have an account yet, create and verify
                    one.
              </li>
              <h3>Step 2: Navigate to API Keys</h3>
              <li>Dashboard: In your Stripe dashboard, go to the “Developers” section.</li>
              <li>API Keys: Click on “API keys” to find your publishable and secret keys.</li>
              <h3>Sep 3: Connect Stripe to Your App</h3>
              <li>Open Your App Settings: Go to the settings section in your app.</li>
              <li>Find Stripe Integration: Look for the Stripe integration under “Payment Settings” or “Integrations”.</li>
              <h3>Step 4: Enter Your Stripe API Keys</h3>
              <li>Publishable Key: Copy the publishable key from Stripe and paste it into your app settings.</li>
              <li>Secret Key: Copy the secret key and paste it into your app settings.</li>
              <li>Save Your Settings: Click “Save” or “Connect” to link your Stripe account.</li>
              <h3>Step 5: Test the Integration</h3>
              <li>Publishable Key: Copy the publishable key from Stripe and paste it into your app settings.</li>
              <li>Test Mode: Run test transactions using Stripe’s test keys.</li>
              <li>Live Mode: Replace test keys with live keys once testing is successful.</li>
            </ul>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Integrations;
