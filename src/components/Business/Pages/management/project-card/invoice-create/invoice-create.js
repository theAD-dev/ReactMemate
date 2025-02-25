import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { getClientById } from '../../../../../../APIs/ClientsApi';
import InvoicesIcon from "../../../../../../assets/images/icon/InvoicesIcon.svg";
import SendInvoiceEmailForm from '../../../../../../ui/send-invoice/send-invoice';

const InvoiceCreate = ({ clientId, projectId, isLoading, create, projectCardData, isCreated }) => {
    const [show, setShow] = useState(false);
    const [payload, setPayload] = useState({});
    const clientQuery = useQuery({
        queryKey: ['id', clientId],
        queryFn: () => getClientById(clientId),
        enabled: !!clientId,
        retry: 1,
    });

    return (
        <>
            <Button className='InvoiceAction InvoiceActive me-3' onClick={() => setShow(true)}>
              {isCreated ? "Resend" : "Create"} Invoice  <img src={InvoicesIcon} alt="Invoices" />
            </Button>
            <SendInvoiceEmailForm projectId={projectId} show={show} create={create} isLoading={isLoading} setShow={setShow} setPayload={setPayload} contactPersons={clientQuery?.data?.contact_persons || []} projectCardData={projectCardData} isCreated={isCreated}/>
        </>
    );
};

export default InvoiceCreate;