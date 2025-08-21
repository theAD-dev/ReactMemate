import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { FilePdf } from 'react-bootstrap-icons';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import style from './statement.module.scss';
import { sendStatementEmail } from '../../../../../APIs/expenses-api';
import { FilePreview } from '../../../../../shared/ui/file-preview';
import SendEmailForm from '../../../../../ui/send-email/send-email-form';

const AccountStatement = () => {
    const [showEmail, setShowEmail] = useState(false);
    const [payload, setPayload] = useState({});
    const pdfUrl = new URLSearchParams(window.location.search).get('pdf');
    const clientName = new URLSearchParams(window.location.search).get('client');

    const downloadFormLink = async () => {
        const fileLink = pdfUrl;
        if (fileLink) {
            const res = await fetch(fileLink);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `statement-${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
            setShowEmail(false);
        }
    };

    const sendStatementEmailMutation = useMutation({
        mutationFn: (data) => sendStatementEmail(data),
        onSuccess: () => {
            setShowEmail(false);
            toast.success(`Statement sent successfully.`);
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to send statement. Please try again.`);
        }
    });

    const handleSendEmail = async () => {
        let newPayload = {
            from_email: payload.from_email,
            to_email: payload.to,
            subject: payload.subject,
            body: payload.email_body,
            signature: payload.signature
        };

        // replace word in the payload
        newPayload.subject = newPayload.subject.replace('_CLIENT_NAME_', clientName);
        newPayload.body = newPayload.body.replace('_CLIENT_NAME_', clientName);
        newPayload.body = newPayload.body.replace('_LINK_', pdfUrl);

        await sendStatementEmailMutation.mutateAsync(newPayload);
    };

    return (
        <div className={style.accountStatementWrapper}>
            <div className={style.accountStatement}>
                <FilePreview files={[pdfUrl]} width={600}/>
            </div>
            <div className={`${style.footer}`}>
                <div className={style.innerFooter}>
                    <Button className={"outline-button"} onClick={downloadFormLink}>
                        Download Statement <FilePdf size={16} color='' />
                    </Button>
                    <Button className={"solid-button"} onClick={() => setShowEmail(true)}>
                        Send Statement
                    </Button>
                </div>
            </div>

            {showEmail && <SendEmailForm show={showEmail} setShow={setShowEmail} contactPersons={[]} setPayload={setPayload} save={handleSendEmail} defaultTemplate={'Invoice statement'} />}
        </div>
    );
};

export default AccountStatement;