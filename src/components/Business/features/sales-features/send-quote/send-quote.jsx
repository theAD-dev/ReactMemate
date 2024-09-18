import React from 'react'
import SendEmail from '../../../../../ui/send-email/send-email'

const SendQuote = ({ show, setShow }) => {
  return (
    <SendEmail show={show} setShow={setShow} />
  )
}

export default SendQuote