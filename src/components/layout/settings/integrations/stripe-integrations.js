import React, { useEffect, useRef } from "react";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import { Dialog } from "primereact/dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputNumber } from 'primereact/inputnumber';

import style from "./integration.module.scss";
import stripHeadLogo from "../../../../assets/images/icon/stripHeadLogo.png";
import { stripeIntegrationsSet } from "../../../../APIs/integrations-api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ProgressSpinner } from "primereact/progressspinner";

// Updated validation schema
const schema = yup.object().shape({
    stripe_secret_key: yup
        .string()
        .required("Stripe Secret Key is required"),
    stripe_public_key: yup
        .string()
        .required("Stripe Public Key is required"),
    commission: yup
        .number()
        .typeError("Commission must be a number")
        .min(0, "Commission cannot be negative")
        .max(100, "Commission cannot exceed 100%")
        .required("Commission is required"),
});

const StripeIntegrations = ({ visible, setVisible, stripe, refetch }) => {
    const formRef = useRef();
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            stripe_secret_key: "",
            stripe_public_key: "",
            commission: "",
        },
    });

    const handleClose = () => {
        setVisible(false);
    };

    useEffect(() => {
        if (stripe) {
            reset({
                stripe_secret_key: stripe.stripe_secret_key || "",
                stripe_public_key: stripe.stripe_public_key || "",
                commission: stripe.commission || "",
            });
        }
    }, [stripe, reset]);

    const handleSaveClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(
                new Event("submit", { bubbles: true, cancelable: true })
            );
        }
    };

    const mutation = useMutation({
        mutationFn: (data) => stripeIntegrationsSet(data),
        onSuccess: () => {
            refetch();
            handleClose();
            toast.success(`Stripe integration has been updated successfully.`);
        },
        onError: (error) => {
            toast.error(`Failed to update stripe integration. Please try again.`);
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <img src={stripHeadLogo} alt="Stripe Logo" />
                Stripe Settings
            </div>
        </div>
    );

    const footerContent = (
        <div className="d-flex justify-content-end gap-2">
            <Button className="outline-button" onClick={handleClose}>
                Cancel
            </Button>
            <Button type="submit" className="solid-button" style={{ minWidth: "132px" }} onClick={handleSaveClick}>
                Save Details
                {mutation?.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
            </Button>
        </div>
    );

    return (
        <Dialog
            visible={visible}
            modal={true}
            header={headerElement}
            footer={footerContent}
            className={`${style.modal} custom-modal custom-scroll-integration `}
            onHide={handleClose}
        >
            <div className="d-flex flex-column">
                <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                    <div className={style.formWrapEmail}>
                        <div className={style.boxGroupList}>
                            <div className="d-flex mb-5">
                                <label htmlFor="stripe_secret_key">Stripe Secret Key</label>
                                <div className="flex flex-column">
                                    <Controller
                                        name="stripe_secret_key"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="stripe_secret_key"
                                                placeholder="sk_live_51K8dr3FsxeMMC1vRbmv4mdEFh"
                                                type="text"
                                            />
                                        )}
                                    />
                                    {errors.stripe_secret_key && <p className="mb-0 error-message">{errors.stripe_secret_key.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className={style.boxGroupList}>
                            <div className="d-flex mb-5">
                                <label htmlFor="stripe_public_key">Stripe Public Key</label>
                                <div className="flex flex-column">
                                    <Controller
                                        name="stripe_public_key"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="stripe_public_key"
                                                placeholder="pk_live_51K8dr3FsxeMMC1vRkqTTiEJgDN"
                                                type="text"
                                            />
                                        )}
                                    />
                                    {errors.stripe_public_key && <p className="mb-0 error-message">{errors.stripe_public_key.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className={style.boxGroupList}>
                            <div className="d-flex mb-5">
                                <label htmlFor="commission">Commission</label>
                                <div className="flex flex-column">
                                    <Controller
                                        name="commission"
                                        control={control}
                                        render={({ field }) => (
                                            <div className={style.commissionBox}>
                                                <InputNumber
                                                    {...field}
                                                    prefix="% "
                                                    placeholder="2.00"
                                                    style={{ width: "93px" }}
                                                    value={field.value}
                                                    onChange={(e) => {
                                                        field.onChange(e.value);
                                                    }}
                                                    maxFractionDigits={2}
                                                />
                                            </div>
                                        )}
                                    />
                                    {errors.commission && <p className="mb-0 error-message">{errors.commission.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className={style.tmsCondition}>
                    <ul>
                        <h3 className="mt-0">Step 1: Sign in to Your Stripe Account</h3>
                        <li>Access Your Stripe Account: Log in to your Stripe account at stripe.com. If you don’t have an account yet, create and verify one.</li>
                        <h3>Step 2: Navigate to API Keys</h3>
                        <li>Dashboard: In your Stripe dashboard, go to the “Developers” section.</li>
                        <li>API Keys: Click on “API keys” to find your publishable and secret keys.</li>
                        <h3>Step 3: Connect Stripe to Your App</h3>
                        <li>Open Your App Settings: Go to the settings section in your app.</li>
                        <li>Find Stripe Integration: Look for the Stripe integration under “Payment Settings” or “Integrations”.</li>
                        <h3>Step 4: Enter Your Stripe API Keys</h3>
                        <li>Publishable Key: Copy the publishable key from Stripe and paste it into your app settings.</li>
                        <li>Secret Key: Copy the secret key and paste it into your app settings.</li>
                        <li>Save Your Settings: Click “Save” or “Connect” to link your Stripe account.</li>
                        <h3>Step 5: Test the Integration</h3>
                        <li>Test Mode: Run test transactions using Stripe’s test keys.</li>
                        <li>Live Mode: Replace test keys with live keys once testing is successful.</li>
                    </ul>
                </div>
            </div>
        </Dialog>
    );
};

export default StripeIntegrations;
