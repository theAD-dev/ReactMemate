import React from 'react'
import SendEmail from '../../../../../ui/send-email/send-email'

const SendQuote = ({ show, setShow, contactPersons }) => {
  return (
    <SendEmail show={show} setShow={setShow} contactPersons={contactPersons} />
  )
}

export default SendQuote