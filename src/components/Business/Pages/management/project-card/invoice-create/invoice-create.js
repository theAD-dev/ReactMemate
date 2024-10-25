import React, { useState } from 'react'
import InvoicesIcon from "../../../../../../assets/images/icon/InvoicesIcon.svg";
import { Button } from 'react-bootstrap';
import SendInvoiceEmailForm from '../../../../../../ui/send-invoice/send-invoice';

const InvoiceCreate = ({ isLoading, create }) => {
    const [show, setShow] = useState(false)
    const [payload, setPayload] = useState({});

    return (
        <>
            <Button className='InvoiceAction InvoiceActive me-3' onClick={()=> setShow(true)}>
                Invoice  <img src={InvoicesIcon} alt="Invoices" />
            </Button>
            <SendInvoiceEmailForm show={show} create={create} isLoading={isLoading} setShow={setShow} setPayload={setPayload} contactPersons={[]}/>
        </>
    )
}

export default InvoiceCreate;