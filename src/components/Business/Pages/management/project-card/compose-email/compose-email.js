import { useState } from "react";
import SendEmailForm from "../../../../../../ui/send-email/send-email-form";
import { getClientById } from "../../../../../../APIs/ClientsApi";
import { useQuery } from "@tanstack/react-query";
import SendDynamicEmailForm from "../../../../../../ui/send-email-2/send-email";

const ComposeEmail = ({ clientId }) => {
  const[payload, setPayload] = useState({})
  const [viewShow, setViewShow] = useState(false);
  const handleShow = () => setViewShow(true);
  const clientQuery = useQuery({
    queryKey: ['getClientById', clientId],
    queryFn: () => getClientById(clientId),
    enabled: !!clientId,
    retry: 1,
  });

  return (
    <>
      <div className="linkByttonStyle" onClick={handleShow}>Compose Email</div>
      <SendDynamicEmailForm show={viewShow} isLoading={false} setShow={setViewShow} setPayload={setPayload} contactPersons={clientQuery?.data?.contact_persons || []} />
    </>
  );
};

export default ComposeEmail;
