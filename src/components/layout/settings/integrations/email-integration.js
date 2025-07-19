import React, { useEffect, useRef } from "react";
import { Envelope } from "react-bootstrap-icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import Button from "react-bootstrap/Button";
import { toast } from "sonner";
import * as yup from "yup";
import style from "./integration.module.scss";
import { emailIntegrationsSet } from "../../../../APIs/integrations-api";


// Updated validation schema
const schema = yup.object().shape({
    outgoing_email: yup
        .string()
        .email("Invalid email address")
        .required("Outgoing email is required"),
});

const EmailIntegrations = ({ visible, setVisible, email, refetch }) => {
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || "{}");
    const formRef = useRef();
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            outgoing_email: "",
        },
    });

    const handleClose = () => {
        setVisible(false);
    };

    useEffect(() => {
        if (email && email?.outgoing_email !== 'no-reply@memate.com.au') {
            reset({
                outgoing_email: email.outgoing_email || "",
            });
        }
    }, [email, reset]);

    const handleSaveClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(
                new Event("submit", { bubbles: true, cancelable: true })
            );
        }
    };

    const mutation = useMutation({
        mutationFn: (data) => emailIntegrationsSet(data),
        onSuccess: () => {
            refetch();
            handleClose();
            toast.success(`Outgoing email has been updated successfully.`);
            toast.info(
                'You will receive an email from AWS shortly. Please click the confirmation link in that email to verify your address.',
                {
                    duration: Infinity,
                }
            );
        },
        onError: (error) => {
            toast.error(`Failed to update Outgoing email. Please try again.`);
        }
    });

    const onSubmit = (data) => {
        mutation.mutate({ outgoing_email: data?.outgoing_email });
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <div style={{ background: '#DCFAE6', border: '8px solid #ECFDF3' }} className="d-flex justify-content-center align-items-center rounded-circle p-2">
                    <Envelope color="#17B26A" size={24} />
                </div>
                <span>Add Outgoing Email</span>
            </div>
        </div>
    );

    const footerContent = (
        <div className="d-flex justify-content-end gap-2">
            <Button className="outline-button" onClick={handleClose}>
                Cancel
            </Button>
            <Button type="submit" disabled={mutation?.isPending} className="solid-button" style={{ minWidth: "132px" }} onClick={handleSaveClick}>
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
                                <label htmlFor="outgoing_email">Outgoing Email</label>
                                <div className="flex flex-column">
                                    <Controller
                                        name="outgoing_email"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="outgoing_email"
                                                placeholder="info@elitelife.com.au"
                                                type="text"
                                            />
                                        )}
                                    />
                                    {errors.outgoing_email && <p className="mb-0 error-message">{errors.outgoing_email.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className={style.boxGroupList}>
                            <div className="d-flex mb-5">
                                <label htmlFor="name">Full Name</label>
                                <div className="flex flex-column">
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="name"
                                                value={profileData?.full_name}
                                                disabled
                                                placeholder="John Doe"
                                                type="text"
                                                style={{ opacity: .6 }}
                                            />
                                        )}
                                    />
                                    {errors.name && <p className="mb-0 error-message">{errors.name.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className={style.tmsCondition}>
                    <ul>
                        <p><b>Linking your company email with Amazon Web Services</b> (AWS) Simple Email Service (SES) for all outgoing emails offers numerous benefits that can significantly enhance your email communication strategy. Here are key advantages:</p>
                        <h3>Scalability</h3>
                        <p>High Volume Sending: AWS SES is designed to handle high volumes of email, making it easy to scale your email sending as your business grows without compromising on performance or deliverability.</p>

                        <h3 className="mt-0">Deliverability</h3>
                        <p>Improved Email Deliverability: AWS SES has mechanisms in place to help improve the deliverability of your emails. By using a platform trusted by Internet Service Providers (ISPs) and email clients, your emails are less likely to be marked as spam.</p>
                    </ul>
                </div>
            </div>
        </Dialog>
    );
};

export default EmailIntegrations;
