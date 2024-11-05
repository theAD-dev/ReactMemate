import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useParams } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';

const StripPayment = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);
        setMessage("Payment in Progress");

        const resp = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: '/',
            },
        });

        if (resp.error) setMessage("Some Error Occurred !!");
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <Button className='solid-button m-auto mt-4' disabled={!stripe || isLoading}>Submit</Button>
            {message && <p>{message}</p>}
        </form>
    );
};

const StripeContainer = () => {
    const { clientSecret, publishKey } = useParams();
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
            <Card className='w-50 m-auto mt-5'>
                <Card.Body>
                    <Elements stripe={stripePromise} options={options}>
                        <StripPayment />
                    </Elements>
                </Card.Body>
            </Card>
        ) : (
            <p>Loading...</p>
        )
    );
};

export default StripeContainer;
