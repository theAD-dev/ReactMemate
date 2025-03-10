import React from 'react';
import SendEmailForm from '../../../../../ui/send-email/send-email-form';

const SendQuote = ({ show, setShow, contactPersons, setPayload, createNewRequest }) => {
  const save = async () => {
    await createNewRequest('send');
  };

  return (
    <SendEmailForm show={show} setShow={setShow} contactPersons={contactPersons} setPayload={setPayload} save={save} />
  );
};

export default SendQuote;