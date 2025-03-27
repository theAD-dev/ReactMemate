import React, { useState } from "react";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from "primereact/progressspinner";
import style from './change-payment-method.module.scss';
import { updatePaymentMethodInfo } from "../../../../../APIs/SettingsGeneral";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const Wrapper = ({ setVisible, refetch }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event) => {
    console.log('event: ', event);
    event.preventDefault();
    setIsPending(true);
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error(error.message);
      setError(error.message);
      setIsPending(false);
    } else {
      console.log("PaymentMethod:", paymentMethod);
      updatePaymentMethodInfo({ payment_method: paymentMethod.id })
        .then(() => {
          setVisible(false);
          refetch();
          setIsPending(false);
        })
        .catch((err) => {
          console.error("Error submitting form:", err);
          setError(err.message);
          setIsPending(false);
        });
    }
  };
  return (
    <div>
      {error && <div>
        <div className="d-flex gap-2 border rounded p-3">
          <svg width="39" height="39" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.1">
              <rect x="1.5" y="1.5" width="36" height="36" rx="18" stroke="#D92D20" strokeWidth="2" />
            </g>
            <path d="M19.5 28.25C14.6675 28.25 10.75 24.3325 10.75 19.5C10.75 14.6675 14.6675 10.75 19.5 10.75C24.3325 10.75 28.25 14.6675 28.25 19.5C28.25 24.3325 24.3325 28.25 19.5 28.25ZM19.5 29.5C25.0228 29.5 29.5 25.0228 29.5 19.5C29.5 13.9772 25.0228 9.5 19.5 9.5C13.9772 9.5 9.5 13.9772 9.5 19.5C9.5 25.0228 13.9772 29.5 19.5 29.5Z" fill="#D92D20" />
            <path d="M18.2519 23.25C18.2519 22.5596 18.8116 22 19.5019 22C20.1923 22 20.7519 22.5596 20.7519 23.25C20.7519 23.9404 20.1923 24.5 19.5019 24.5C18.8116 24.5 18.2519 23.9404 18.2519 23.25Z" fill="#D92D20" />
            <path d="M18.3744 15.7438C18.3078 15.0779 18.8307 14.5 19.5 14.5C20.1693 14.5 20.6922 15.0779 20.6256 15.7438L20.1872 20.1281C20.1519 20.4811 19.8548 20.75 19.5 20.75C19.1452 20.75 18.8481 20.4811 18.8128 20.1281L18.3744 15.7438Z" fill="#D92D20" />
          </svg>
          <div className="d-flex flex-column">
            <p className="font-14 mb-2" style={{ fontWeight: 600 }}>Payment Failed</p>
            <p className="mb-0">{error}</p>
          </div>
        </div>

      </div>
      }
      <form onSubmit={handleSubmit} className="mt-4">
        <CardElement
          options={{
            hidePostalCode: true
          }}
        />

        <Divider className="mt-5" />
        <div className="d-flex justify-content-between gap-2">
          <Button type='button' className='text-button text-danger bg-transparent' style={{ minWidth: '70px', borderRadius: '28px' }}>Cancel</Button>
          <Button disabled={isPending} type='submit' className='solid-button' style={{ minWidth: '70px', borderRadius: '28px' }}>
            Save Details
            {isPending && <ProgressSpinner className='me-2' style={{ width: '18px', height: '18px' }} />}
          </Button>
        </div>
      </form>
    </div>
  );
};

const ChangePaymentMethod = ({ visible, setVisible, refetch }) => {
  const headerElement = (
    <div className={`${style.modalHeader}`}>
      <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4.5" y="4.5" width="48" height="48" rx="24" fill="#BAE8FF" />
        <rect x="4.5" y="4.5" width="48" height="48" rx="24" stroke="#EBF8FF" strokeWidth="8" />
        <path d="M39.7524 19.409C40.0453 19.7019 40.0453 20.1768 39.7524 20.4697L38.1881 22.034L35.1881 19.034L36.7524 17.4697C37.0453 17.1768 37.5202 17.1768 37.8131 17.4697L39.7524 19.409Z" fill="#1AB2FF" />
        <path d="M37.1274 23.0947L34.1274 20.0947L23.9079 30.3141C23.8256 30.3965 23.7636 30.4968 23.7267 30.6073L22.5199 34.2278C22.4222 34.521 22.7011 34.7999 22.9942 34.7022L26.6148 33.4953C26.7252 33.4585 26.8256 33.3965 26.9079 33.3141L37.1274 23.0947Z" fill="#1AB2FF" />
        <path fillRule="evenodd" clipRule="evenodd" d="M18 36.75C18 37.9926 19.0074 39 20.25 39H36.75C37.9926 39 39 37.9926 39 36.75V27.75C39 27.3358 38.6642 27 38.25 27C37.8358 27 37.5 27.3358 37.5 27.75V36.75C37.5 37.1642 37.1642 37.5 36.75 37.5H20.25C19.8358 37.5 19.5 37.1642 19.5 36.75V20.25C19.5 19.8358 19.8358 19.5 20.25 19.5H30C30.4142 19.5 30.75 19.1642 30.75 18.75C30.75 18.3358 30.4142 18 30 18H20.25C19.0074 18 18 19.0074 18 20.25V36.75Z" fill="#1AB2FF" />
      </svg>
      <span className={`white-space-nowrap ${style.headerTitle}`}>Edit Payment Method</span>
    </div>
  );

  return (
    <Dialog visible={visible} modal header={headerElement} className={`${style.modal} custom-modal`} onHide={() => { setVisible(false); }}>
      <Elements stripe={stripePromise}>
        <Wrapper setVisible={setVisible} refetch={refetch} />
      </Elements>
    </Dialog>
  );
};

export default ChangePaymentMethod;