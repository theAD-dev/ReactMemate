import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import Button from "react-bootstrap/Button";
import { toast } from "sonner";
import * as yup from "yup";
import style from "./integration.module.scss";
import { mailchimpIntegrationsDelete, mailchimpIntegrationsSet } from "../../../../APIs/integrations-api";
import mailchimpLogo from "../../../../assets/images/mailchimp_icon.png";

// Validation schema
const schema = yup.object().shape({
    mailchimp_api_key: yup
        .string()
        .required("Mailchimp API Key is required")
        .matches(/^[a-f0-9]{32}-[a-z]{2,3}\d+$/, "Invalid Mailchimp API Key format (e.g., abc123...xyz-us7)"),
});

const MailchimpIntegration = ({ visible, setVisible, mailchimp, refetch }) => {
    const formRef = useRef();
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            mailchimp_api_key: "",
        },
    });

    const handleClose = () => {
        setVisible(false);
    };

    useEffect(() => {
        if (mailchimp) {
            reset({
                mailchimp_api_key: mailchimp.mailchimp_api_key || "",
            });
        }
    }, [mailchimp, reset]);

    const handleSaveClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(
                new Event("submit", { bubbles: true, cancelable: true })
            );
        }
    };

    const mutation = useMutation({
        mutationFn: (data) => mailchimpIntegrationsSet(data),
        onSuccess: () => {
            refetch();
            handleClose();
            toast.success(`Mailchimp integration has been updated successfully.`);
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to update Mailchimp integration. Please try again.`);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: () => mailchimpIntegrationsDelete(),
        onSuccess: () => {
            refetch();
            handleClose();
            toast.success(`Mailchimp integration has been deleted successfully.`);
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to delete Mailchimp integration. Please try again.`);
        }
    });

    const onSubmit = (data) => {
        // Extract server code from API key (e.g., "us7" from "abc123-us7")
        const apiKey = data.mailchimp_api_key;
        const serverMatch = apiKey.match(/-([a-z]{2,3}\d+)$/);
        const serverCode = serverMatch ? serverMatch[1] : "us7";

        const payload = {
            mailchimp_api_key: apiKey,
            mailchimp_api_key_server: serverCode,
        };

        mutation.mutate(payload);
    };

    const handleDelete = () => {
        deleteMutation.mutate();
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <img src={mailchimpLogo} alt="Mailchimp Logo" style={{ width: '40px' }} />
                Mailchimp Settings
            </div>
        </div>
    );

    const footerContent = (
        <div className="d-flex justify-content-between gap-2">
            <Button className="text-button text-danger" disabled={deleteMutation.isPending} onClick={handleDelete}>
                Delete {" "}
                {deleteMutation.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
            </Button>
            <div className="d-flex align-items-center justify-content-end gap-2">
                <Button className="outline-button" onClick={handleClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={mutation?.isPending} className="solid-button" style={{ minWidth: "132px" }} onClick={handleSaveClick}>
                    Save Details
                    {mutation?.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                </Button>
            </div>
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
                        <div className={style.boxGroupList} style={{ position: 'relative' }}>
                            <div className="d-flex align-items-center">
                                <label htmlFor="mailchimp_api_key">Mailchimp API Key</label>
                                <div className="flex flex-column">
                                    <Controller
                                        name="mailchimp_api_key"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="mailchimp_api_key"
                                                placeholder="5ade5bd49db01e7b35340b98aaadb3252-us7"
                                                type="text"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            {errors.mailchimp_api_key && <p className="mb-0 error-message" style={{ position: 'absolute', left: '180px', top: '45px' }}>{errors.mailchimp_api_key.message}</p>}
                        </div>
                    </div>
                </form>
                <div className={clsx(style.tmsCondition, 'mt-5')}>
                    <ul>
                        <h3 className="mt-0">Step 1: Sign in to Your Mailchimp Account</h3>
                        <li>Access Your Mailchimp Account: Log in to your Mailchimp account at mailchimp.com. If you don't have an account yet, create and verify one.</li>
                        <h3>Step 2: Navigate to API Keys</h3>
                        <li>Profile: Click on your profile name in the bottom left corner.</li>
                        <li>Account & Billing: Select "Account & Billing" from the dropdown menu.</li>
                        <li>Extras: Click on the "Extras" dropdown and select "API keys".</li>
                        <h3>Step 3: Create Your API Key</h3>
                        <li>Create New Key: If you don't have an API key, click "Create A Key".</li>
                        <li>Copy API Key: Once created, copy the entire API key (it will include your server prefix, e.g., us7, us19, etc.).</li>
                        <h3>Step 4: Enter Your Mailchimp API Key</h3>
                        <li>Paste API Key: Copy the API key from Mailchimp and paste it into the field above.</li>
                        <li>Server Code: The server code (e.g., us7) will be automatically extracted from your API key.</li>
                        <li>Save Your Settings: Click "Save Details" to link your Mailchimp account.</li>
                        <h3>Step 5: Test the Integration</h3>
                        <li>Send Test Email: Try sending a test email notification to verify the integration works correctly.</li>
                        <li>Monitor Activity: Check your Mailchimp dashboard to see email activity from your platform.</li>
                    </ul>
                </div>
            </div>
        </Dialog>
    );
};

export default MailchimpIntegration;
