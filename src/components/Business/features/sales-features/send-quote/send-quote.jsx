import React from 'react'
import SendEmailForm from '../../../../../ui/send-email/send-email-form'
import { toast } from 'sonner';

const SendQuote = ({ show, setShow, contactPersons, setPayload, createNewRequest }) => {
  const save = async () => {
    try {
      await createNewRequest('send');
    } catch (err) {
    }
  }

  return (
    <SendEmailForm show={show} setShow={setShow} contactPersons={contactPersons} setPayload={setPayload} save={save} />
  )
}

export default SendQuote