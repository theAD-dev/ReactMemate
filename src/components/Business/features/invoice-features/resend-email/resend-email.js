import React, { useState } from 'react';
import { Send } from 'react-bootstrap-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { toast } from 'sonner';
import { getClientById } from '../../../../../APIs/ClientsApi';
import { resendInvoiceEmail } from '../../../../../APIs/invoice-api';
import SendDynamicEmailForm from '../../../../../ui/send-email-2/send-email';

const ResendInvoiceEmail = ({ projectId, clientId, isAction }) => {
    const [show, setShow] = useState(false);
    const [payload, setPayload] = useState({});
    const clientQuery = useQuery({
        queryKey: ['id', clientId],
        queryFn: () => getClientById(clientId),
        enabled: !!clientId && !!show,
        retry: 1,
    });

    const mutation = useMutation({
        mutationFn: (data) => resendInvoiceEmail(projectId, data),
        onSuccess: () => {
            setShow(false);
            toast.success(`Email resent successfully.`);
        },
        onError: (error) => {
            console.error('Error sending email:', error);
            toast.error(`Failed to resent email. Please try again.`);
        }
    });

    return (
        <>
            {
                isAction ? <div className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2' onClick={() => setShow(true)}>
                    <Send color='#667085' size={20} />
                    <span style={{ color: '#101828', fontSize: '16px', fontWeight: 500 }}>Resend invoice</span>
                </div>
                    : <Button label="Resend" style={{ position: 'static' }} onClick={() => setShow(true)} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
            }
            <SendDynamicEmailForm show={show} setShow={setShow} setPayload={setPayload} mutation={mutation} contactPersons={clientQuery?.data?.contact_persons || []} projectCardData={() => { }} defaultTemplateId={'Resend Invoice'} />
        </>

    );
};

export default ResendInvoiceEmail;