import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import Button from "react-bootstrap/Button";
import { toast } from "sonner";
import * as yup from "yup";
import style from "./integration.module.scss";
import { twilioIntegrationsSet } from "../../../../APIs/integrations-api";
import twilioLogo from '../../../../assets/images/twilio-logo.png';


// Updated validation schema
const schema = yup.object().shape({
    twilio_sid: yup
        .string()
        .required("Twilio sid is required"),
    twilio_token: yup
        .string()
        .required("Twilio token is required"),
    twilio_phone: yup.string()
        .required("Phone number is required")
        .matches(/^\+[1-9][0-9]{1,14}$/, 'Invalid twilio phone number format')
});

const TwilioIntegrations = ({ visible, setVisible, twilio, refetch }) => {
    const formRef = useRef();
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            twilio_sid: "",
            twilio_token: "",
            twilio_phone: "",
        },
    });

    const handleClose = () => {
        setVisible(false);
    };

    useEffect(() => {
        if (twilio) {
            reset({
                twilio_sid: twilio.twilio_sid || "",
                twilio_token: twilio.twilio_token || "",
                twilio_phone: twilio.twilio_phone || "",
            });
        }
    }, [twilio, reset]);

    const handleSaveClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(
                new Event("submit", { bubbles: true, cancelable: true })
            );
        }
    };

    const mutation = useMutation({
        mutationFn: (data) => twilioIntegrationsSet(data),
        onSuccess: () => {
            refetch();
            handleClose();
            toast.success(`Twilio integration has been updated successfully.`);
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to update twilio integration. Please try again.`);
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <img src={twilioLogo} style={{ width: '60px', position: 'relative', left: '-10px' }} alt="Twilio Logo" />
                <span style={{ position: 'relative', left: '-20px' }}>Twilio Settings</span>
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
                                <label htmlFor="twilio_sid">Twilio sid</label>
                                <div className="flex flex-column">
                                    <Controller
                                        name="twilio_sid"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="twilio_sid"
                                                placeholder="sk_live_51K8dr3FsxeMMC1vRbmv4mdEFh"
                                                type="text"
                                            />
                                        )}
                                    />
                                    {errors.twilio_sid && <p className="mb-0 error-message">{errors.twilio_sid.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className={style.boxGroupList}>
                            <div className="d-flex mb-5">
                                <label htmlFor="twilio_token">Twilio token</label>
                                <div className="flex flex-column">
                                    <Controller
                                        name="twilio_token"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="twilio_token"
                                                placeholder="pk_live_51K8dr3FsxeMMC1vRkqTTiEJgDN"
                                                type="text"
                                            />
                                        )}
                                    />
                                    {errors.twilio_token && <p className="mb-0 error-message">{errors.twilio_token.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className={style.boxGroupList}>
                            <div className="d-flex mb-5">
                                <label htmlFor="twilio_phone">Twilio phone</label>
                                <div className="flex flex-column">
                                    <Controller
                                        name="twilio_phone"
                                        control={control}
                                        render={({ field }) => (
                                            <PhoneInput
                                                defaultCountry='au'
                                                value={typeof field.value === 'string' ? field.value : ''}
                                                className='phoneInput w-100'
                                                containerClass={style.countrySelector}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {errors.twilio_phone && <p className="mb-0 error-message">{errors.twilio_phone.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className={style.tmsCondition}>
                    <ul>
                        <h3 className="mt-0">Step 1: Sign in to Your Twilio Account</h3>
                        <li>Access Your Twilio Account: Log in to your Twilio account at twilio.com. If you don’t have an account yet, create and verify one.</li>
                        <h3>Step 2: Navigate to API Keys</h3>
                        <li>Dashboard: In your Twilio dashboard, go to the “Settings” section.</li>
                        <li>API Keys: Click on “API keys” to find your Account SID and Auth Token.</li>
                        <h3>Step 3: Connect Twilio to Your App</h3>
                        <li>Open Your App Settings: Go to the settings section in your app.</li>
                        <li>Find Twilio Integration: Look for the Twilio integration under “Communication Settings” or “Integrations”.</li>
                        <h3>Step 4: Enter Your Twilio API Keys</h3>
                        <li>Account SID: Copy the Account SID from Twilio and paste it into your app settings.</li>
                        <li>Auth Token: Copy the Auth Token and paste it into your app settings.</li>
                        <li>Twilio Phone Number: Enter your Twilio phone number into your app settings.</li>
                        <li>Save Your Settings: Click “Save” or “Connect” to link your Twilio account.</li>
                        <h3>Step 5: Test the Integration</h3>
                        <li>Test Mode: Run test SMS messages using Twilio’s test credentials.</li>
                        <li>Live Mode: Replace test credentials with live credentials once testing is successful.</li>
                    </ul>
                </div>
            </div>
        </Dialog>
    );
};

export default TwilioIntegrations;
