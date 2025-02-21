import { useState } from "react";
import { getClientById } from "../../../../../../APIs/ClientsApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import SendDynamicEmailForm from "../../../../../../ui/send-email-2/send-email";
import GoogleReview from "../../../../../../assets/images/icon/googleReviewIcon.svg";
import { Button } from "react-bootstrap";
import { toast } from "sonner";
import { sendComposeEmail } from "../../../../../../APIs/management-api";

const GoogleReviewEmail = ({ clientId, projectId }) => {
    const [payload, setPayload] = useState({})
    const [viewShow, setViewShow] = useState(false);
    const handleShow = () => setViewShow(true);
    const clientQuery = useQuery({
        queryKey: ['getClientById', clientId],
        queryFn: () => getClientById(clientId),
        enabled: !!clientId,
        retry: 1,
    });

    const mutation = useMutation({
        mutationFn: (data) => sendComposeEmail(projectId, "google-review", data),
        onSuccess: (response) => {
            setViewShow(false);
            toast.success(`Email send successfully.`);
        },
        onError: (error) => {
            console.error('Error sending email:', error);
            toast.error(`Failed to send email. Please try again.`);
        }
    });

    return (
        <>
            <Button className='googleBut googleActive' onClick={handleShow}>Google Review  <img src={GoogleReview} alt="GoogleReview" /></Button>
            <SendDynamicEmailForm show={viewShow} mutation={mutation} isLoading={false} setShow={setViewShow} setPayload={setPayload} contactPersons={clientQuery?.data?.contact_persons || []} defaultTemplateId={'Google Review'} />
        </>
    );
};

export default GoogleReviewEmail;
