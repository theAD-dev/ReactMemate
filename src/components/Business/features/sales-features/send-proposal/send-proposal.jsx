import React from 'react'
import { toast } from 'sonner';
import SendProposalEmailForm from '../../../../../ui/send-proposal/send-proposal-email-form';

const SendProposal = ({ show, setShow, contactPersons, setPayload, onSubmit, handleClose }) => {
  const save = async () => {
    const res = await onSubmit('send');
    return res;
  }

  return (
    <SendProposalEmailForm show={show} setShow={setShow} contactPersons={contactPersons} setPayload={setPayload} save={save} handleOtherClose={handleClose} />
  )
}

export default SendProposal