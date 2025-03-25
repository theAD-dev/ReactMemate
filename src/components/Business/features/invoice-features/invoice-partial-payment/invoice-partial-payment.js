import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Bank, Cash, CreditCard, FilePdf, Link as LinkIcon, Stripe } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SelectButton } from 'primereact/selectbutton';
import { toast } from 'sonner';
import style from './invoice-partial-payment.module.scss';
import { partialPaymentCreate } from '../../../../../APIs/invoice-api';



const headerElement = (
    <div className={`${style.modalHeader}`}>
        <div className="d-flex align-items-center gap-2">
            Confirm Payment
        </div>
    </div>
);

const InvoicePartialPayment = ({ show, setShow, invoice, setRefetch }) => {
    const [isShowHistory, setIsShowHistory] = useState(false);
    const [deposit, setDeposit] = useState(0.00);
    const [type, setType] = useState(2);
    const [errors, setErrors] = useState({});
    const options = [
        { icon: <Bank size={20} />, label: 'Bank', value: 2 },
        { icon: <Cash size={20} />, label: 'Cash', value: 1 },
        { icon: <CreditCard size={20} />, label: 'EFTPOS', value: 4 },
    ];
    const justifyTemplate = (option) => {
        return <div className='d-flex align-items-center gap-2'>
            {option.icon}
            {option.label}
        </div>;
    };
    const mutation = useMutation({
        mutationFn: (data) => partialPaymentCreate(invoice?.unique_id, data),
        onSuccess: () => {
            setShow(false);
            setRefetch((old) => !old);
            toast.success(`Partial payment is completed successfully.`);
        },
        onError: (error) => {
            console.error('Failed to payment:', error);
            toast.error(`Failed to payment. Please try again.`);
        }
    });

    const onsubmit = () => {
        let errorCount = 0;
        setErrors({});

        if (!type) {
            errorCount++;
            setErrors((others) => ({ ...others, type: true }));
        }
        if (!deposit) {
            errorCount++;
            setErrors((others) => ({ ...others, deposit: true }));
        }
        if (errorCount) return;
        mutation.mutate({ deposit, type });
    };

    useEffect(() => {
        setErrors({});
    }, [show]);

    return (
        <Dialog
            visible={show}
            modal={true}
            header={headerElement}
            onHide={setShow}
            className={`${style.modal} custom-modal custom-scroll-integration`}
        >
            <Card className={clsx(style.border, 'mb-3')}>
                <Card.Body>
                    <label>Select Payment Method</label>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='d-flex flex-column pt-2'>
                            <SelectButton className='rounded' value={type} onChange={(e) => setType(e.value)} itemTemplate={justifyTemplate} optionLabel="label" options={options} />
                            {errors?.type && (
                                <p className="error-message mb-0">{"Payment type is required"}</p>
                            )}
                        </div>

                        <div className='d-flex gap-2 align-items-center'>
                            <Link to={`${invoice?.invoice_url}`} target='_blank'>
                                <Button className="danger-outline-button px-3 py-2">
                                    <FilePdf color='#F04438' size={17} />
                                </Button>
                            </Link>
                            <Link to={`/invoice/${invoice?.unique_id}`} target='_blank'>
                                <Button className="info-button px-3 py-2">
                                    <LinkIcon color='#158ECC' size={17} />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className={clsx(style.border, 'mb-3')}>
                <Card.Body>
                    <div className='d-flex justify-content-between gap-3 align-items-center'>
                        <div className='d-flex flex-column'>
                            <label>Enter Amount</label>
                            <IconField iconPosition="left">
                                <InputIcon><span style={{ position: 'relative', top: '-4px' }}>$</span></InputIcon>
                                <InputText value={deposit} onChange={(e) => setDeposit(e.target.value)} onBlur={(e) => setDeposit(parseFloat(e?.target?.value || 0).toFixed(2))} style={{ width: '380px', paddingLeft: '30px' }} className={clsx(style.inputText, { [style.error]: errors?.deposit })} />
                            </IconField>
                            {errors?.deposit && (
                                <p className="error-message mb-0">{"Payment type is required"}</p>
                            )}
                        </div>
                        <div className={clsx(style.box, 'd-flex flex-column')} onClick={() => setDeposit(parseFloat(invoice?.amount || 0).toFixed(2))}>
                            <label>Total invoice</label>
                            <h1 className={clsx(style.text, 'mt-2')}>${parseFloat(invoice?.amount || 0).toFixed(2)}</h1>
                        </div>
                        <div className={clsx(style.box, 'd-flex flex-column')} onClick={() => setDeposit(parseFloat(invoice?.to_be_paid || 0).toFixed(2))}>
                            <label>To Be Paid</label>
                            <h1 className={clsx(style.text, 'mt-2')}>${parseFloat(invoice?.to_be_paid || 0).toFixed(2)}</h1>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className={clsx(style.border, 'mb-3')}>
                <Card.Body>
                    <div className='d-flex justify-content-between gap-2 align-items-center'>
                        <div className={clsx(style.box3, 'd-flex flex-column text-end')}>
                            <label>Budget</label>
                            <h1 className={clsx(style.text, 'mt-2')}>${parseFloat(invoice?.budget || 0).toFixed(2)}</h1>
                        </div>
                        <div className={clsx(style.box4, 'd-flex flex-column text-end')}>
                            <label>Real Cost</label>
                            <h1 className={clsx(style.text, 'mt-2')}>${parseFloat(invoice?.real_cost || 0).toFixed(2)}</h1>
                        </div>
                        <div className={clsx(style.box5, 'd-flex flex-column text-end')}>
                            <label>Cost Of Sale</label>
                            <h1 className={clsx(style.text, 'mt-2')}>${parseFloat(invoice?.cost_of_sale || 0).toFixed(2)}</h1>
                        </div>
                        <div className={clsx(style.box6, 'd-flex flex-column text-end')}>
                            <label>Labour</label>
                            <h1 className={clsx(style.text, 'mt-2')}>${parseFloat(invoice?.labor_expenses || 0).toFixed(2)}</h1>
                        </div>
                        <div className={clsx(style.box7, 'd-flex flex-column text-end')}>
                            <label>Operational Profit</label>
                            <h1 className={clsx(style.text, 'mt-2')}>${parseFloat(invoice?.profit || 0).toFixed(2)}</h1>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className={clsx(style.border, 'mb-3')}>
                <Card.Body className='d-flex justify-content-end gap-2'>
                    <Button className='outline-button' onClick={() => setShow(false)}>Cancel</Button>
                    <Button className='success-button' onClick={onsubmit}>Submit Payment
                        {mutation?.isPending && (
                            <ProgressSpinner
                                style={{ width: "20px", height: "20px", color: "#fff" }}
                            />
                        )}
                    </Button>
                </Card.Body>
                <div className='mb-2 text-center' style={{ borderTop: '.5px solid #F2F4F7' }}>
                    <Button className='text-button m-auto' onClick={() => setIsShowHistory(!isShowHistory)}>{isShowHistory ? "Hide" : "Show"} History</Button>
                </div>
            </Card>

            {isShowHistory && <InvoiceHistory history={invoice?.billing_history || []} />}

        </Dialog>
    );
};

const InvoiceHistory = ({ history }) => {
    const nameBody = (rowData) => {
        return (
            <div className='d-flex align-items-center gap-2'>
                <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={rowData?.manager?.photo} style={{ widows: '24px' }} />
                </div>
                <span>{rowData?.manager?.name}</span>
            </div>
        );
    };

    const referenceBody = (rawData) => {
        let type = rawData.type;
        if (type === 2)
            return <div className='d-flex align-items-center gap-2'>
                <Bank size={18} />
                <span>Bank</span>
            </div>;
        else if (type === 1) {
            return <div className='d-flex align-items-center gap-2'>
                <Cash size={18} />
                <span>Cash</span>
            </div>;
        } else if (type === 3) {
            return <div className='d-flex align-items-center gap-2'>
                <Stripe size={18} />
                <span>Strip</span>
            </div>;
        } else if (type === 4) {
            return <div className='d-flex align-items-center gap-2'>
                <CreditCard size={18} />
                <span>EFTPOS</span>
            </div>;
        }

    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
            month: "short",
        }).format(date);
        const year = date.getFullYear();
        return `${day} ${monthAbbreviation} ${year}`;
    };

    const depositDate = (rawData) => {
        return <span>{formatDate(rawData?.created)}</span>;
    };

    return (
        <Card className={clsx(style.border, 'mb-3 mt-2')}>
            <Card.Body>
                <h1 style={{ fontSize: '16px' }}>History</h1>
                <DataTable value={history} className={style.borderTable} showGridlines>
                    <Column field="" style={{ width: 'auto' }} body={(rowData, { rowIndex }) => <>#{rowIndex + 1}</>} header="ID"></Column>
                    <Column field="type" style={{ width: '150px' }} header="Reference" body={referenceBody}></Column>
                    <Column field="deposit" style={{ width: '210px', textAlign: 'right' }} body={(rowData) => <>${rowData?.deposit}</>} header="Amount"></Column>
                    <Column field="manager.name" style={{ width: '210px' }} header="Manager" body={nameBody}></Column>
                    <Column field="created" style={{ width: '147px' }} header="Created at" body={depositDate}></Column>
                </DataTable>
            </Card.Body>
        </Card>
    );
};

export default InvoicePartialPayment;