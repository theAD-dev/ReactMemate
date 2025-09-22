import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Bank, Cash, CreditCard, FilePdf, Link as LinkIcon, Stripe } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputNumber } from 'primereact/inputnumber';
import { ProgressSpinner } from 'primereact/progressspinner';
import { SelectButton } from 'primereact/selectbutton';
import { toast } from 'sonner';
import style from './invoice-partial-payment.module.scss';
import { getInvoicePartialHistory, partialPaymentCreate } from '../../../../../APIs/invoice-api';
import { formatAUD } from '../../../../../shared/lib/format-aud';

const headerElement = (
    <div className={`${style.modalHeader}`}>
        <div className="d-flex align-items-center gap-2">
            Confirm Payment
        </div>
    </div>
);

const InvoicePartialPayment = ({ show, setShow, invoice, setRefetch }) => {
    console.log('invoice: ', invoice);
    const [isShowHistory, setIsShowHistory] = useState(false);
    const [isShowExpense, setIsShowExpense] = useState(false);
    const [isShowCostBreakdown, setIsShowCostBreakdown] = useState(false);
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

    const historyData = useQuery({ queryKey: ['invoicePartialHistory', invoice?.unique_id], queryFn: () => getInvoicePartialHistory(invoice?.unique_id), enabled: !!invoice?.unique_id });
    console.log('historyData: ', historyData?.data);

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
        setDeposit(0.00);
        setType(2);
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
                        <div className='d-flex flex-column flex-fill'>
                            <label className="mb-2">Enter Amount</label>
                            <IconField className='w-100' iconPosition="left">
                                <InputIcon><span style={{ position: 'relative', top: '-4px' }}>$</span></InputIcon>
                                <InputNumber
                                    value={deposit}
                                    onValueChange={(e) => setDeposit(e.target.value || 0)}
                                    style={{ width: '100%', minWidth: '420px', padding: '0px 16px' }}
                                    className={clsx(style.inputText, { [style.error]: errors?.deposit })}
                                    maxFractionDigits={2}
                                    minFractionDigits={2}
                                    placeholder='0.00'
                                    inputId="minmaxfraction"
                                />
                            </IconField>
                            {errors?.deposit && (
                                <p className="error-message mb-0">{"Payment type is required"}</p>
                            )}
                        </div>
                        <div className={clsx(style.box, 'd-flex flex-column flex-fill')} onClick={() => setDeposit(parseFloat(invoice?.amount || 0).toFixed(2))}>
                            <label>Total invoice</label>
                            <h1 className={clsx(style.text, 'mt-2')}>${formatAUD(invoice?.amount || 0)}</h1>
                        </div>
                        <div className={clsx(style.box, 'd-flex flex-column flex-fill')} onClick={() => setDeposit(parseFloat(invoice?.to_be_paid || 0).toFixed(2))}>
                            <label>To Be Paid</label>
                            <h1 className={clsx(style.text, 'mt-2')}>${formatAUD(invoice?.to_be_paid || 0)}</h1>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className={clsx(style.border, 'mb-3')}>
                <Card.Body>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className={clsx(style.box3, 'd-flex flex-column text-start justify-content-center')}>
                            <label style={{ fontWeight: 400 }}>Budget</label>
                            <h1 className={clsx(style.text, 'mt-2')}>${formatAUD(invoice?.budget || 0)}</h1>
                        </div>
                        <div className='d-flex flex-column' style={{ flex: 1 }}>
                            <div className={clsx(style.box4, 'd-flex flex-column align-items-center text-left w-100 h-100')}>
                                <label style={{ fontWeight: 400 }}>Real Cost</label>
                                <h1 className={clsx(style.text, 'mt-2')}>${formatAUD(invoice?.real_cost || 0)}</h1>
                            </div>
                            <div className='d-flex align-items-center'>
                                <div className={clsx(style.box5, 'd-flex flex-column text-end flex-fill')}>
                                    <label style={{ fontWeight: 400 }}>Cost Of Sale</label>
                                    <h1 className={clsx(style.text, 'mt-2')}>${formatAUD(invoice?.cost_of_sale || 0)}</h1>
                                </div>
                                <div className={clsx(style.box6, 'd-flex flex-column text-end flex-fill')}>
                                    <label>Labour</label>
                                    <h1 className={clsx(style.text, 'mt-2')}>${formatAUD(invoice?.labor_expenses || 0)}</h1>
                                </div>
                                <div className={clsx(style.box8, 'd-flex flex-column text-end flex-fill')}>
                                    <label>Operating Expense</label>
                                    <h1 className={clsx(style.text, 'mt-2')}>${formatAUD(invoice?.labor_expenses || 0)}</h1>
                                </div>
                            </div>
                        </div>
                        <div className={clsx(style.box7, 'd-flex flex-column text-end justify-content-center')}>
                            <label>Operational Profit</label>
                            <h1 className={clsx(style.text, 'mt-2')}>${formatAUD(invoice?.profit || 0)}</h1>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className={clsx(style.border, 'mb-3')}>
                <Card.Body className='d-flex justify-content-end gap-2'>
                    <Button className='outline-button' onClick={() => setShow(false)}>Cancel</Button>
                    <Button className='success-button' disabled={mutation?.isPending} onClick={onsubmit}>Process Payment
                        {mutation?.isPending && (
                            <ProgressSpinner
                                style={{ width: "20px", height: "20px", color: "#fff" }}
                            />
                        )}
                    </Button>
                </Card.Body>
                <div className='mb-2 d-flex justify-content-center text-center' style={{ borderTop: '.5px solid #F2F4F7', gap: '72px' }}>
                    <Button className={`${isShowExpense ? style.activeTextButton : style.deactiveTextButton}`} onClick={() => { setIsShowExpense(!isShowExpense); setIsShowHistory(false); setIsShowCostBreakdown(false); }}>{isShowExpense ? "Hide" : "Show"} Expense</Button>
                    <Button className={`${isShowHistory ? style.activeTextButton : style.deactiveTextButton}`} onClick={() => { setIsShowHistory(!isShowHistory); setIsShowExpense(false); setIsShowCostBreakdown(false); }}>{isShowHistory ? "Hide" : "Show"} History</Button>
                    <Button className={`${isShowCostBreakdown ? style.activeTextButton : style.deactiveTextButton}`} onClick={() => { setIsShowCostBreakdown(!isShowCostBreakdown); setIsShowExpense(false); setIsShowHistory(false); }} style={{ minWidth: '182px' }}>{isShowCostBreakdown ? "Hide" : ""} Cost Breakdown</Button>
                </div>
            </Card>

            {isShowExpense && <InvoiceExpense expense={historyData?.data?.expenses || []} />}
            {isShowHistory && <InvoiceHistory history={invoice?.billing_history || []} />}
            {isShowCostBreakdown && <InvoiceCostBreakdown calculations={historyData?.data?.calculations || []} />}
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
                <span>Stripe</span>
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
                    <Column field="deposit" style={{ width: '210px', textAlign: 'right' }} body={(rowData) => <>${formatAUD(rowData?.deposit)}</>} header="Amount"></Column>
                    <Column field="manager.name" style={{ width: '210px' }} header="Manager" body={nameBody}></Column>
                    <Column field="created" style={{ width: '147px' }} header="Created at" body={depositDate}></Column>
                </DataTable>
            </Card.Body>
        </Card>
    );
};

const InvoiceCostBreakdown = ({ calculations }) => {
    const total = calculations.reduce((acc, item) => acc + +(item?.total || 0), 0);
    console.log('total: ', total);

    return (
        <>
            <DataTable value={calculations || []} showGridlines className="border-top">
                <Column field="id" header="Order" bodyClassName='text-center' headerClassName='text-center' style={{ width: '60px' }} body={(_, options) => options.rowIndex + 1}></Column>
                <Column field="subindex" header="Department" style={{ minWidth: '192px' }} body={(rowData) => <div className="ellipsis-width" title={rowData.subindex} style={{ maxWidth: '192px' }}>{rowData.subindex}</div>}></Column>
                <Column field="description" header="Description" style={{ minWidth: '300px' }} bodyClassName={"ellipsis-width"} body={(rowData) => <div className="ellipsis-width" title={rowData.description} style={{ maxWidth: '300px' }}>{rowData.description}</div>}></Column>
                <Column field="cost" header="Cost" style={{ width: '100%' }} body={(rowData) => `$${formatAUD(rowData.cost)}`}></Column>
                <Column field="profit_type_value" header="Markup/Margin" body={(rowData) => `${rowData.profit_type_value} ${rowData.profit_type === "AMN" ? "AMT $" : rowData.profit_type === "MRG" ? "MRG %" : "MRK %"}`} style={{ width: '100%', whiteSpace: 'nowrap' }}></Column>
                <Column field="unit_price" header="Unit Price" style={{ width: '100%' }} body={(rowData) => `$${formatAUD(rowData.unit_price)}`}></Column>
                <Column field="quantity" header="Qty/Unit" style={{ width: '100%' }}></Column>
                <Column field="discount" header="Discount" style={{ width: '100%' }} body={(rowData) => `${rowData.discount}%`}></Column>
                <Column field="total" header="Amount" style={{ width: '100%' }} body={(rowData) => `$${formatAUD(rowData.total)}`}></Column>
            </DataTable>
            <div className='w-100 d-flex align-items-center justify-content-end gap-4' style={{ background: '#EBF8FF', padding: '8px 24px 8px 40px' }}>
                {/* <div className='d-flex flex-column align-items-end'>
                    <p className='font-16 mb-0' style={{ color: '#106B99', fontWeight: 400 }}>Sub Total</p>
                    <p className='font-18 mb-0' style={{ color: '#106B99', fontWeight: 600 }}>${formatAUD(cardData?.sub_total)}</p>
                </div>
                <div>
                    <PlusCircle size={20} color='#106B99' />
                </div>
                <div className='d-flex flex-column align-items-end'>
                    <p className='font-16 mb-0' style={{ color: '#106B99', fontWeight: 400 }}>Tax</p>
                    <p className='font-18 mb-0' style={{ color: '#106B99', fontWeight: 600 }}>${formatAUD(cardData?.gst)}</p>
                </div>
                <div>
                    <div>
                        <PauseCircle size={20} color='#106B99' style={{ transform: 'rotate(90deg)' }} />
                    </div>
                </div> */}
                <div className='d-flex flex-column align-items-end'>
                    <p className='font-16 mb-0' style={{ color: '#106B99', fontWeight: 400 }}>Total Invoice Amount</p>
                    <p className='font-18 mb-0' style={{ color: '#106B99', fontWeight: 600 }}>${formatAUD(total)}</p>
                </div>
            </div>
        </>
    );
};

const InvoiceExpense = ({ expense }) => {
    return (
        <DataTable value={expense || []} showGridlines className="border-top">
            <Column field="expense" header="#" bodyClassName='text-center' headerClassName='text-center' style={{ width: '60px' }}></Column>
            <Column field="invoice_reference" header="Reference" style={{ minWidth: '192px' }} body={(rowData) => <div className="ellipsis-width" title={rowData.invoice_reference} style={{ maxWidth: '192px' }}>{rowData.invoice_reference}</div>}></Column>
            <Column field="supplier.name" header="Provider" style={{ minWidth: '300px' }} bodyClassName={"ellipsis-width"} body={(rowData) => <div className="ellipsis-width" title={rowData.supplier.name} style={{ maxWidth: '300px' }}>{rowData.supplier.name}</div>}></Column>
            <Column field="total" header="Estimate/Total" style={{ width: '100%' }} body={(rowData) => `$${formatAUD(rowData.total)}`}></Column>
            <Column field="paid" header="Status" style={{ width: '100%', whiteSpace: 'nowrap' }}></Column>
        </DataTable>
    );
};

export default InvoicePartialPayment;