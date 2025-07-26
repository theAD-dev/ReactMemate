import React, { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Envelope, FilePdf } from 'react-bootstrap-icons';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import style from './create-statement.module.scss';
import { downloadStatement, sendStatementEmail } from '../../../../../APIs/expenses-api';

const CreateStatement = ({ invoices }) => {
    const [show, setShow] = useState(false);
    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="d-flex align-items-center gap-2">
                Create Statement
            </div>
        </div>
    );

    const downloadStatementMutation = useMutation({
        mutationFn: (data) => downloadStatement(data),
        onSuccess: (data) => { 
            const url = data?.pdf_url || data;
            if (!url) return;
            window.open(url, '_blank');
            setShow(false);
            toast.success(`Statement downloaded successfully.`);
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

    const handleSendEmail = () => {
        const invoiceIds = invoices.map(item => item.id);
        sendStatementEmailMutation.mutate(invoiceIds);
    };

    return (
        <>
            <Button className={"solid-button font-14"} style={{ height: '32px' }} onClick={() => setShow(true)}>Create Statement</Button>
            <Dialog visible={show} modal={true} header={headerElement} onHide={() => setShow(false)}>
                <Row className='mt-4'>
                    <Col sm={6}>
                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body>
                                <Button disabled={downloadStatementMutation?.isPending} className='d-flex flex-column align-items-center gap-3 text-center text-button w-100 cursor-pointer' onClick={handleDownload}>
                                    <div className='BoxNo'>
                                        <FilePdf color='#FFFFFF' size={24} />
                                    </div>
                                    <label className={style.label}>Download Statement as PDF</label>
                                    {downloadStatementMutation?.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={6}>
                        <Card className={clsx(style.border, 'mb-3')}>
                            <Card.Body>
                                <Button disabled={sendStatementEmailMutation?.isPending} className='d-flex flex-column align-items-center gap-3 text-center text-button w-100 cursor-pointer' onClick={handleSendEmail}>
                                    <div className='BoxNo'>
                                        <Envelope color='#FFFFFF' size={24} />
                                    </div>
                                    <label className={style.label}>Send Statement<br /> via Email</label>
                                    {sendStatementEmailMutation?.isPending && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Dialog>
        </>
    );
};

export default CreateStatement;