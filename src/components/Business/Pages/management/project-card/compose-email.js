import { useState } from "react";
import SendEmailForm from "../../../../../ui/send-email/send-email-form";
import { getClientById } from "../../../../../APIs/ClientsApi";
import { useQuery } from "@tanstack/react-query";

const ComposeEmail = ({ clientId }) => {
  const[payload, setPayload] = useState({})
  console.log('payload: ', payload);
  const [viewShow, setViewShow] = useState(false);
  const handleShow = () => setViewShow(true);
  const clientQuery = useQuery({
    queryKey: ['id', clientId],
    queryFn: () => getClientById(clientId),
    enabled: !!clientId,
    retry: 1,
  });

  const save = async () => {
    try {
     
    } catch (err) {
    }
  }


  return (
    <>
      <div className="linkByttonStyle" onClick={handleShow}>Compose Email</div>
      <SendEmailForm show={viewShow} setShow={setViewShow} contactPersons={clientQuery?.data?.contact_persons || []} setPayload={setPayload} save={save} />
    </>
  );
};

export default ComposeEmail;
