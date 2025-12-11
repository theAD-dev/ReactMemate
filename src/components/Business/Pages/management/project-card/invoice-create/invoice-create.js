import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import InvoicesIcon from "../../../../../../assets/images/icon/InvoicesIcon.svg";
import SendInvoiceEmailForm from '../../../../../../ui/send-invoice/send-invoice';

const InvoiceCreate = ({ projectId, isLoading, create, projectCardData, isCreated, contactPersons = [] }) => {
    const [show, setShow] = useState(false);
    const [, setPayload] = useState({});

    return (
        <>
            <Button className='InvoiceAction InvoiceActive me-3' onClick={() => setShow(true)}>
              {isCreated ? "Resend" : "Create"} Invoice  <img src={InvoicesIcon} alt="Invoices" />
            </Button>
            <SendInvoiceEmailForm projectId={projectId} show={show} create={create} isLoading={isLoading} setShow={setShow} setPayload={setPayload} contactPersons={contactPersons} projectCardData={projectCardData} isCreated={isCreated}/>
        </>
    );
};

export default InvoiceCreate;