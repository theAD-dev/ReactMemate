import { useState } from "react";
import SendEmailForm from "../../../../../ui/send-email/send-email-form";




const ComposeEmail = () => {
  const [viewShow, setViewShow] = useState(false);
  const handleShow = () => setViewShow(true);


  return (
    <>
      <div className="linkByttonStyle" onClick={handleShow}>Compose Email</div>
      <SendEmailForm show={viewShow} setShow={setViewShow} contactPersons={[]} setPayload={() => { }} save={() => { }} />
    </>
  );
};

export default ComposeEmail;
