import React, { useState } from 'react'
import InvoicesIcon from "../../../../../../assets/images/icon/InvoicesIcon.svg";
import { Button } from 'react-bootstrap';
import SendInvoiceEmailForm from '../../../../../../ui/send-invoice/send-invoice';

const InvoiceCreate = ({ projectId, isLoading, create, projectCardData }) => {
    const [show, setShow] = useState(false)
    const [payload, setPayload] = useState({});

    return (
        <>
            <Button className='InvoiceAction InvoiceActive me-3' onClick={()=> setShow(true)}>
                Invoice  <img src={InvoicesIcon} alt="Invoices" />
            </Button>
            <SendInvoiceEmailForm projectId={projectId} show={show} create={create} isLoading={isLoading} setShow={setShow} setPayload={setPayload} contactPersons={[]} projectCardData={projectCardData}/>
        </>
    )
}

export default InvoiceCreate;