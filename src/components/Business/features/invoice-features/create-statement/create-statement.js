import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import style from './create-statement.module.scss';
import { downloadStatement, sendStatementEmail } from '../../../../../APIs/expenses-api';
import { FilePreview } from '../../../../../shared/ui/file-preview';
import SendEmailForm from '../../../../../ui/send-email/send-email-form';

const CreateStatement = ({ invoices }) => {
    const [file, setFile] = useState([]);
    const [show, setShow] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [payload, setPayload] = useState({});
    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                Account Statement
            </div>
        </div>
    );

    const downloadStatementMutation = useMutation({
        mutationFn: (data) => downloadStatement(data),
        onSuccess: (data) => {
            const url = data?.pdf_url || data;
            if (!url) return;
            setFile([url]);
            setShow(true);
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to download statement. Please try again.`);
        }
    });

    const sendStatementEmailMutation = useMutation({
        mutationFn: (data) => sendStatementEmail(data),
        onSuccess: () => {
            setShow(false);
            setShowEmail(false);
            toast.success(`Statement sent successfully.`);
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to send statement. Please try again.`);
        }
    });

    const handleDownload = () => {
        const invoiceIds = invoices.map(item => item.id);
        downloadStatementMutation.mutate(invoiceIds);
    };

    const handleSendEmail = async () => {
        let newPayload = {
            from_email: payload.from_email,
            to_email: payload.to,
            subject: payload.subject,
            body: payload.email_body
        };
        await sendStatementEmailMutation.mutateAsync(newPayload);
    };

    const downloadFormLink = async () => {
        const fileLink = file[0];
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
            setFile([]);
            setShow(false);
            setShowEmail(false);
        }
    };

    const footerElement = (
        <div className={`${style.modalFooter}`}>
            <Button className={"outline-button"} onClick={downloadFormLink}>
                Download Statement
            </Button>
            <Button className={"solid-button"} onClick={() => setShowEmail(true)}>
                Send Statement
            </Button>
        </div>
    );

    return (
        <>
            <Button className={"solid-button font-14"} style={{ height: '32px' }} onClick={handleDownload}>
                Create Statement
                {downloadStatementMutation?.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
            </Button>
            <Dialog visible={show} modal={true} header={headerElement} footer={footerElement} headerClassName='border-bottom' footerClassName='border-top py-3' onHide={() => setShow(false)} className={style.modal}>
                {
                    showEmail ? <>
                        <SendEmailForm show={showEmail} setShow={setShowEmail} contactPersons={[]} setPayload={setPayload} save={handleSendEmail} defaultTemplate={null} />
                    </> : <div className='d-flex justify-content-center align-items-center pt-3'>
                        <FilePreview files={file} />
                    </div>
                }
            </Dialog>
        </>
    );
};

export default CreateStatement;