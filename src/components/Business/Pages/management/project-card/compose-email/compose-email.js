import { useState } from "react";
import { X } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Modal from "react-bootstrap/Modal";
import { toast } from "sonner";
import style from "./compose-email.module.scss";
import { getClientById } from "../../../../../../APIs/ClientsApi";
import { getOutgoingEmail } from "../../../../../../APIs/email-template";
import { sendComposeEmail } from "../../../../../../APIs/management-api";
import SendDynamicEmailForm from "../../../../../../ui/send-email-2/send-email";

const ComposeEmail = ({ clientId, projectId, projectCardData }) => {
  const [, setPayload] = useState({});
  const [viewShow, setViewShow] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const outgoingEmailTemplateQuery = useQuery({
    queryKey: ["getOutgoingEmail"],
    queryFn: getOutgoingEmail
  });

  const handleShow = () => {
    if (outgoingEmailTemplateQuery?.data?.outgoing_email && outgoingEmailTemplateQuery?.data?.outgoing_email !== 'no-reply@memate.com.au') {
      setViewShow(true);
    } else {
      setShowInstructions(true);
    }
  };
  const clientQuery = useQuery({
    queryKey: ['getClientById', clientId],
    queryFn: () => getClientById(clientId),
    enabled: !!clientId,
    retry: 1,
  });

  const mutation = useMutation({
    mutationFn: (data) => sendComposeEmail(projectId, "", data),
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
    <>
      <div className="linkByttonStyle py-2 ps-0" onClick={handleShow}>Compose Email</div>

      {/* Instructions modal */}
      <Modal
        show={showInstructions}
        onHide={() => setShowInstructions(false)}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="taskModelProject"
        animation={false}
      >
        <Modal.Header className="mb-0 pb-0 border-0">
          <div className="modelHeader d-flex justify-content-between align-items-start">
            <span>
              <svg width="56" height="57" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4.5" width="48" height="48" rx="24" fill="#FEE4E2" />
                <rect x="4" y="4.5" width="48" height="48" rx="24" stroke="#FEF3F2" strokeWidth="8" />
                <path d="M18 21.5H38C39.1 21.5 40 22.4 40 23.5V33.5C40 34.6 39.1 35.5 38 35.5H18C16.9 35.5 16 34.6 16 33.5V23.5C16 22.4 16.9 21.5 18 21.5ZM38 23.5L28 29.5L18 23.5V25.5L28 31.5L38 25.5V23.5Z" fill="#F04438" />
              </svg>

              <span className='ms-3'>Email is currently unavailable</span>
            </span>
          </div>
          <button className='CustonCloseModal' onClick={() => setShowInstructions(false)}>
            <X size={24} color='#667085' />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="ContactModel">
            <p className={style.emailUnavailableText}>Email functionality is currently unavailable. To use this feature, please configure an email account via <Link to="/settings/integrations?openEmail=true" style={{ color: '#158ECC' }}>Settings &gt; Integrations</Link>.</p>
          </div>
        </Modal.Body>
      </Modal>

      {/* Compose email modal */}
      <SendDynamicEmailForm show={viewShow} isLoading={false} mutation={mutation} setShow={setViewShow} setPayload={setPayload} contactPersons={clientQuery?.data?.contact_persons || []} isComposeEmail={true} />
    </>
  );
};

export default ComposeEmail;
