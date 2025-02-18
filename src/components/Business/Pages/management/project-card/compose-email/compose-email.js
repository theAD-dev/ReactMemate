import { useState } from "react";
import SendEmailForm from "../../../../../../ui/send-email/send-email-form";
import { getClientById } from "../../../../../../APIs/ClientsApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import SendDynamicEmailForm from "../../../../../../ui/send-email-2/send-email";
import { sendComposeEmail } from "../../../../../../APIs/management-api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getOutgoingEmail } from "../../../../../../APIs/email-template";

const ComposeEmail = ({ clientId, projectId, projectCardData }) => {
  const navigate = useNavigate();
  const [payload, setPayload] = useState({})
  const [viewShow, setViewShow] = useState(false);
  const outgoingEmailTemplateQuery = useQuery({
    queryKey: ["getOutgoingEmail"],
    queryFn: getOutgoingEmail
  });

  const handleShow = () => {
    if (outgoingEmailTemplateQuery?.data?.outgoing_email !== 'no-reply@memate.com.au') {
      setViewShow(true);
    } else {
      navigate('/settings/integrations?openEmail=true');
    }
  }
  const clientQuery = useQuery({
    queryKey: ['getClientById', clientId],
    queryFn: () => getClientById(clientId),
    enabled: !!clientId,
    retry: 1,
  });

  const mutation = useMutation({
    mutationFn: (data) => sendComposeEmail(projectId, "", data),
    onSuccess: (response) => {
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
    <>
      <div className="linkByttonStyle py-2 ps-0" onClick={handleShow}>Compose Email</div>
      <SendDynamicEmailForm show={viewShow} isLoading={false} mutation={mutation} setShow={setViewShow} setPayload={setPayload} contactPersons={clientQuery?.data?.contact_persons || []} isComposeEmail={true} />
    </>
  );
};

export default ComposeEmail;
