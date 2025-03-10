import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClientById } from "../../../../../APIs/ClientsApi";
import { resendQuoteEmail } from "../../../../../APIs/management-api";
import SendDynamicEmailForm from "../../../../../ui/send-email-2/send-email";

const ResendQuoteEmail = ({ viewShow, setViewShow, clientId, projectId, projectCardData }) => {
    const [, setPayload] = useState({});

    const clientQuery = useQuery({
        queryKey: ['getClientById', clientId],
        queryFn: () => getClientById(clientId),
        enabled: !!clientId && viewShow,
        retry: 1,
    });

    const mutation = useMutation({
        mutationFn: (data) => resendQuoteEmail(projectId, data),
        onSuccess: () => {
            setViewShow(false);
            projectCardData();
            toast.success(`Email send successfully.`);
        },
        onError: (error) => {
            console.error('Error sending email:', error);
            toast.error(`Failed to send email. Please try again.`);
        }
    });

    return (
        <SendDynamicEmailForm show={viewShow} setShow={setViewShow} mutation={mutation} contactPersons={clientQuery?.data?.contact_persons || []} setPayload={setPayload} defaultTemplateId={"Resend Quote"} />
    );
};

export default ResendQuoteEmail;
