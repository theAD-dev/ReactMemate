import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";
import Button from "react-bootstrap/Button";
import { toast } from "sonner";
import * as yup from "yup";
import style from "./integration.module.scss";
import { googleReviewIntegrationsSet } from "../../../../APIs/integrations-api";
import googleReview from "../../../../assets/images/icon/googleReview.png";



// Updated validation schema
const schema = yup.object().shape({
    google_review_link: yup
        .string()
        .required("Google review link is required")
});

const GoogleIntegrations = ({ visible, setVisible, data, refetch }) => {
    const formRef = useRef();
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            google_review_link: "",
        },
    });

    const handleClose = () => {
        setVisible(false);
    };

    useEffect(() => {
        if (data?.google_review_link) {
            reset({
                google_review_link: data?.google_review_link
            });
        }
    }, [data, reset]);

    const handleSaveClick = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(
                new Event("submit", { bubbles: true, cancelable: true })
            );
        }
    };

    const mutation = useMutation({
        mutationFn: (data) => googleReviewIntegrationsSet(data),
        onSuccess: () => {
            refetch();
            handleClose();
            toast.success(`Google review link integration has been updated successfully.`);
        },
        onError: (error) => {
            toast.error(`Failed to update Google review link integration. Please try again.`);
        }
    });

    const onSubmit = (data) => {
        mutation.mutate(data);
    };

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                <img src={googleReview} alt={googleReview} />
                Google Review Link
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
                    <div className="d-flex flex-column mb-3">
                        <label htmlFor="stripe_secret_key">Link</label>
                        <Controller
                            name="google_review_link"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    className="border px-2 py-2 rounded "
                                    placeholder="link..."
                                    type="text"
                                />
                            )}
                        />
                        {errors.google_review_link && <p className="mb-0 error-message">{errors.google_review_link.message}</p>}
                    </div>
                </form>
                <div className={style.tmsCondition}>
                    <ul>
                        <h3 className="mt-0">Step 1: Sign in to Google My Business</h3>
                        <li>
                            Access Your GMB Account: Log in to your Google My Business account. If you haven't set up your business on GMB yet, you'll need to go through the process of claiming and verifying your business listing.
                        </li>
                        <h3>Step 2: Navigate to the "Home" Tab</h3>
                        <li>Dashboard: Once logged in, navigate to the "Home" tab on your GMB dashboard.</li>

                        <h3>Step 3: Get More Reviews</h3>
                        <li>Find the Get more reviews Card: In the "Home" tab, look for a card or section titled "Get more reviews". This section provides a direct link that you can share with customers to write reviews.</li>
                        <li>Copy Your Link: Click on the "Share review form" button or similar option to copy your unique link.</li>
                    </ul>
                </div>
            </div>
        </Dialog>
    );
};

export default GoogleIntegrations;
