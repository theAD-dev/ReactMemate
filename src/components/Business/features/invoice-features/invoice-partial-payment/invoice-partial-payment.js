import React from 'react'
import style from './invoice-partial-payment.module.scss';
import { Dialog } from 'primereact/dialog';
import { Card } from 'react-bootstrap';
import clsx from 'clsx';
import { Button } from 'primereact/button';
import { FilePdf, Link } from 'react-bootstrap-icons';
import { Input } from '@mui/material';
import { InputText } from 'primereact/inputtext';

const headerElement = (
    <div className={`${style.modalHeader}`}>
        <div className="d-flex align-items-center gap-2">
            Confirm Payment
        </div>
    </div>
);

const InvoicePartialPayment = ({ show, setShow }) => {
    return (
        <Dialog
            visible={show}
            modal={true}
            header={headerElement}
            onHide={setShow}
            className={`${style.modal} custom-modal custom-scroll-integration `}
        >
            <Card className={clsx(style.border, 'mb-3')}>
                <Card.Body>
                    <label>Select Payment Method</label>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='d-flex align-items-center'></div>
                        <div className='d-flex gap-2 align-items-center'>
                            <Button className="danger-outline-button px-3 py-2">
                                <FilePdf color='#F04438' size={17} />
                            </Button>
                            <Button className="info-button px-3 py-2">
                                <Link color='#158ECC' size={17} />
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className={clsx(style.border, 'mb-3')}>
                <Card.Body>
                    <div className='d-flex justify-content-between gap-3 align-items-center'>
                        <div className='d-flex flex-column'>
                            <label>Enter Amount</label>
                            <InputText className={clsx(style.inputText, { [style.error]: '' })} />
                        </div>
                        <div className={clsx(style.box, 'd-flex flex-column')}>
                            <label>Total invoice</label>
                            <h1 className={clsx(style.text, 'mt-2')}>$13,159.32</h1>
                        </div>
                        <div className={clsx(style.box2, 'd-flex flex-column')}>
                            <label>To Be Paid</label>
                            <h1 className={clsx(style.text, 'mt-2')}>$13,159.32</h1>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className={clsx(style.border, 'mb-3')}>
                <Card.Body>
                    <div className='d-flex justify-content-between gap-2 align-items-center'>
                        <div className={clsx(style.box3, 'd-flex flex-column text-end')}>
                            <label>Budget</label>
                            <h1 className={clsx(style.text, 'mt-2')}>$13,159.32</h1>
                        </div>
                        <div className={clsx(style.box4, 'd-flex flex-column text-end')}>
                            <label>Real Cost</label>
                            <h1 className={clsx(style.text, 'mt-2')}>$13,159.32</h1>
                        </div>
                        <div className={clsx(style.box5, 'd-flex flex-column text-end')}>
                            <label>Cost Of Sale</label>
                            <h1 className={clsx(style.text, 'mt-2')}>$13,159.32</h1>
                        </div>
                        <div className={clsx(style.box6, 'd-flex flex-column text-end')}>
                            <label>Labour</label>
                            <h1 className={clsx(style.text, 'mt-2')}>$13,159.32</h1>
                        </div>
                        <div className={clsx(style.box7, 'd-flex flex-column text-end')}>
                            <label>Operational Profit</label>
                            <h1 className={clsx(style.text, 'mt-2')}>$13,159.32</h1>
                        </div>
                    </div>
                </Card.Body>
            </Card>

        </Dialog>
    )
}

export default InvoicePartialPayment