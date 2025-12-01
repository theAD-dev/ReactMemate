import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClientById } from "../../../../../APIs/ClientsApi";
import { resendQuoteEmail } from "../../../../../APIs/management-api";
import { fetchContacts } from "../../../../../APIs/SalesApi";
import SendDynamicEmailForm from "../../../../../ui/send-email-2/send-email";

const ResendQuoteEmail = ({ viewShow, setViewShow, clientId, projectId, projectCardData }) => {
    const [, setPayload] = useState({});
    const [isAddingContact, setIsAddingContact] = useState(false);

    function formatDateToYMD(date) {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const addContact = async () => {
        setIsAddingContact(true);
        const nowSydney = new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
        const formData = {
            type: "E",
            date: formatDateToYMD(nowSydney),
            note: "Contacted by Email.",
        };
        try {
            await fetchContacts(projectId, formData);
        } catch (error) {
            setIsAddingContact(false);
            console.error("Error while saving:", error);
            toast.error("Failed to add contact. Please try again.");
        } finally {
            setIsAddingContact(false);
        }
    };

    const clientQuery = useQuery({
        queryKey: ['getClientById', clientId],
        queryFn: () => getClientById(clientId),
        enabled: !!clientId && viewShow,
        retry: 1,
    });
    const contactPersons = [
        ...(clientQuery?.data?.contact_persons || []),
        ...(clientQuery?.data?.email ? [{email: clientQuery?.data?.email}] : [])
    ];

    const mutation = useMutation({
        mutationFn: (data) => resendQuoteEmail(projectId, data),
        onSuccess: async () => {
            await addContact();
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
        <SendDynamicEmailForm show={viewShow} setShow={setViewShow} mutation={mutation} contactPersons={contactPersons} setPayload={setPayload} defaultTemplateId={"Resend Quote"} isAddingContact={isAddingContact}/>
    );
};

export default ResendQuoteEmail;
