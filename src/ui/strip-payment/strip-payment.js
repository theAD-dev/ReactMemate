import React, { forwardRef, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Elements } from '@stripe/react-stripe-js';
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

const StripPayment = forwardRef(({ amount, close, setIsPaymentProcess }, ref) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsPaymentProcess(true);
        setMessage("Payment in Progress");

        const resp = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: '/',
            },
        });

        if (resp.error) toast.error("Some Error Occurred !!");
        setIsPaymentProcess(false);
    };

    return (
        <form ref={ref} onSubmit={handleSubmit}>
            <PaymentElement />
            {/* <div className="d-flex justify-content-end gap-3 w-100 mt-5 border-top">
                <Button className={`outline-button mt-4`} onClick={close}>Cancel</Button>
                <Button type='submit' className='solid-button mt-4' disabled={!stripe || isLoading}>Pay {parseFloat(amount || 0).toFixed(2)} AUD {isLoading && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}</Button>
            </div> */}
        </form>
    );
});

const StripeContainer = forwardRef(({ clientSecret, publishKey, amount, close, setIsPaymentProcess }, ref) => {
    // const { clientSecret, publishKey } = useParams();
    const stripePromise = loadStripe(publishKey);
    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            rules: {
                '.Tab': {
                    border: '1px solid #E0E6EB',
                    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02)',
                },

                '.Tab:hover': {
                    color: 'var(--colorText)',
                },

                '.Tab--selected': {
                    borderColor: '#E0E6EB',
                    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02), 0 0 0 2px var(--colorPrimary)',
                },

                '.Input--invalid': {
                    boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.07), 0 0 0 2px var(--colorDanger)',
                },

                // See all supported class names and selector syntax below
            }
        },
    };

    return (
        clientSecret ? (
            <Card className='w-100 m-auto border-0 p-0 bg-tranparent h-100' style={{ position: 'relative' }}>
                <Card.Body className='border-0 p-0'>
                    <Elements stripe={stripePromise} options={options}>
                        <StripPayment ref={ref} amount={amount} close={close} setIsPaymentProcess={setIsPaymentProcess}/>
                    </Elements>
                    <div className='pt-2 d-flex align-items-center gap-1'>
                        <div className='d-flex justify-content-center align-items-center' style={{ width: '16px', height: '16px', border: '1px solid #1AB2FF', borderRadius: '4px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                                <path d="M10.8926 3L5.39258 8.5L2.89258 6" stroke="#1AB2FF" strokeWidth="1.6666" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span style={{ color: '#344054', fontSize: '14px', fontWeight: 500 }}>Billing address same as shipping</span>
                    </div>
                </Card.Body>
                <div className='d-flex justify-content-center align-items-center gap-2 w-100' style={{ position: 'absolute', bottom: '40px' }}>
                    <span style={{ color: "#667085", fontSize: '12px' }}>Powered by:</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="47" height="32" viewBox="0 0 47 32" fill="none">
                        <rect x="0.892578" y="0.5" width="45" height="31" rx="3.5" fill="white" />
                        <rect x="0.892578" y="0.5" width="45" height="31" rx="3.5" stroke="#F2F4F7" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M24.7505 10.8559L22.4476 11.3647V9.44269L24.7505 8.94336V10.8559ZM29.5395 11.9205C28.6404 11.9205 28.0624 12.3539 27.7412 12.6554L27.622 12.0713H25.6036V23.0566L27.8972 22.5573L27.9064 19.891C28.2367 20.136 28.7229 20.4846 29.5303 20.4846C31.1726 20.4846 32.668 19.1279 32.668 16.1413C32.6588 13.4091 31.145 11.9205 29.5395 11.9205ZM28.989 18.4118C28.4477 18.4118 28.1266 18.214 27.9064 17.969L27.8972 14.4737C28.1357 14.2005 28.466 14.0121 28.989 14.0121C29.8239 14.0121 30.4019 14.973 30.4019 16.2072C30.4019 17.4697 29.833 18.4118 28.989 18.4118ZM39.8977 16.2355C39.8977 13.8236 38.7601 11.9205 36.5857 11.9205C34.4021 11.9205 33.081 13.8236 33.081 16.2167C33.081 19.0525 34.6407 20.4845 36.8793 20.4845C37.971 20.4845 38.7968 20.2302 39.4206 19.8722V17.9879C38.7968 18.3082 38.0811 18.5061 37.1729 18.5061C36.2829 18.5061 35.4939 18.1857 35.393 17.074H39.8794C39.8794 17.0221 39.8827 16.9041 39.8865 16.7682C39.8916 16.5835 39.8977 16.3658 39.8977 16.2355ZM35.3654 15.3405C35.3654 14.2759 35.9984 13.8331 36.5764 13.8331C37.1361 13.8331 37.7325 14.2759 37.7325 15.3405H35.3654ZM22.4475 12.0807H24.7503V20.3244H22.4475V12.0807ZM19.8329 12.0807L19.9797 12.7779C20.521 11.7604 21.5945 11.9676 21.888 12.0807V14.2476C21.6036 14.144 20.6862 14.0121 20.1449 14.7375V20.3244H17.8512V12.0807H19.8329ZM15.3923 10.0362L13.1537 10.5261L13.1445 18.0727C13.1445 19.467 14.1629 20.494 15.5207 20.494C16.273 20.494 16.8235 20.3526 17.1263 20.1831V18.2705C16.8327 18.393 15.3831 18.8264 15.3831 17.432V14.0874H17.1263V12.0807H15.3831L15.3923 10.0362ZM9.97017 13.965C9.48392 13.965 9.19033 14.1063 9.19033 14.4737C9.19033 14.8749 9.6956 15.0514 10.3224 15.2703C11.3443 15.6272 12.6894 16.097 12.695 17.8372C12.695 19.5236 11.3831 20.494 9.47474 20.494C8.68572 20.494 7.8233 20.3338 6.97006 19.957V17.7147C7.74073 18.1481 8.71324 18.4684 9.47474 18.4684C9.98852 18.4684 10.3555 18.3271 10.3555 17.8937C10.3555 17.4493 9.80778 17.2462 9.14653 17.001C8.13949 16.6275 6.86914 16.1564 6.86914 14.5868C6.86914 12.9192 8.10772 11.9205 9.97017 11.9205C10.7317 11.9205 11.484 12.043 12.2455 12.3539V14.5679C11.5482 14.1817 10.6674 13.965 9.97017 13.965Z" fill="#6461FC" />
                    </svg>
                </div>
            </Card>
        ) : (
            <p>Loading...</p>
        )
    );
});

export default StripeContainer;
