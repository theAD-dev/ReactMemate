import React, { useEffect, useState, useMemo } from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Bank, Cash, CreditCard, FilePdf, Link as LinkIcon, PauseCircle, PlusCircle, FileEarmark, FileText, CardChecklist, Envelope, Check2Circle, Link45deg, Briefcase, FolderSymlink } from 'react-bootstrap-icons';
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
import ImageAvatar from '../../../../../shared/ui/image-with-fallback/image-avatar';
import JobStatus from '../../../../Business/Pages/management/project-card/ui/job-status/job-status';

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

    const historyData = useQuery({ queryKey: ['invoicePartialHistory', invoice?.unique_id], queryFn: () => getInvoicePartialHistory(invoice?.unique_id), enabled: !!invoice?.unique_id, staleTime: 0, cacheTime: 0 });

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

            {isShowExpense && <InvoiceJobsAndExpense jobs={historyData?.data?.jobs || []} expenses={historyData?.data?.expenses || []} />}
            {isShowHistory && <InvoiceHistoryTimeline history={historyData?.data?.history || []} projectId={invoice?.unique_id} />}
            {isShowCostBreakdown && <InvoiceCostBreakdown calculations={historyData?.data?.calculations || []} invoice={historyData?.data} />}
        </Dialog>
    );
};

// History type icon and label configuration for scalability
const HISTORY_TYPE_CONFIG = {
    quote: {
        icon: <FileEarmark size={16} color="#1AB2FF" />,
        label: 'Quote'
    },
    invoice: {
        icon: <FileText size={16} color="#1AB2FF" />,
        label: 'Invoice'
    },
    note: {
        icon: <CardChecklist size={16} color="#1AB2FF" />,
        label: 'Note'
    },
    email: {
        icon: <Envelope size={16} color="#1AB2FF" />,
        label: 'Email'
    },
    job: {
        icon: <Briefcase size={16} color="#1AB2FF" />,
        label: 'Job'
    },
    expense: {
        icon: <FolderSymlink size={16} color="#1AB2FF" />,
        label: 'Expense'
    },
    task: {
        icon: <Check2Circle size={16} color="#1AB2FF" />,
        label: 'Task'
    },
    billing: {
        icon: <Bank size={16} color="#1AB2FF" />,
        label: 'Billing'
    }
};

// Email component to parse and display email data
const EmailComponent = ({ emailData }) => {
    const lines = emailData?.split("\n") || [];
    const subject = lines.find((line) => line.startsWith("Subject:"))?.replace("Subject: ", "") || "";
    const recipients = lines.find((line) => line.startsWith("Recipient(s):"))?.replace("Recipient(s): ", "") || "";
    const bodyLine = lines.find((line) => line.startsWith("Body:"));
    const body = bodyLine ? bodyLine.replace("Body:", "") : "";

    return (
        <div className="d-flex flex-column gap-1">
            {subject && <span><strong>Subject:</strong> {subject}</span>}
            {recipients && <span><strong>To:</strong> {recipients}</span>}
            {body && <span><strong>Body:</strong> {body}</span>}
        </div>
    );
};

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dayOptions = { weekday: 'short' };
    const timeString = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
    const dayString = new Intl.DateTimeFormat('en-US', dayOptions).format(date);
    const day = date.getDate();
    const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
        month: "short",
    }).format(date);
    const year = date.getFullYear();
    const dateString = `${day} ${monthAbbreviation} ${year}`;
    return `${timeString} | ${dayString} | ${dateString}`;
};

const InvoiceHistoryTimeline = ({ history, projectId }) => {
    // Sort history by created timestamp (newest first)
    const sortedHistory = useMemo(() => {
        if (!history?.length) return [];
        return [...history].sort((a, b) => parseInt(b.created) - parseInt(a.created));
    }, [history]);

    // Types that show icon + label header
    const typesWithHeader = ['quote', 'invoice', 'note', 'email', 'task', 'billing', 'job', 'expense'];

    const renderHistoryIcon = (type, links, title) => {
        const config = HISTORY_TYPE_CONFIG[type];
        if (!config || !typesWithHeader.includes(type)) return null;

        return (
            <ul>
                <li>
                    {type === "quote" ? (
                        <div className='d-flex align-items-center'>
                            <FileEarmark size={16} color="#1AB2FF" />{" "}
                            <strong>&nbsp; Quote &nbsp;</strong>
                            &nbsp;{links?.quote_pdf && <Link to={`${links?.quote_pdf || "#"}`} target='_blank'><FilePdf color='#FF0000' size={14} /></Link>}
                            &nbsp;&nbsp;{projectId && title === "Quote Created" && <Link to={`/quote/${projectId}`} target='_blank'><Link45deg color='#3366CC' size={16} /></Link>}
                        </div>
                    ) : type === "task" ? (
                        <>
                            <Check2Circle size={16} color="#1AB2FF" />{" "}
                            <strong>&nbsp; Task</strong>
                        </>
                    ) : type === "note" ? (
                        <>
                            <CardChecklist size={16} color="#1AB2FF" />{" "}
                            <strong>&nbsp; Note</strong>
                        </>
                    ) : type === "invoice" ? (
                        <div className='d-flex align-items-center'>
                            <FileText size={16} color="#1AB2FF" />{" "}
                            <strong>&nbsp; Invoice&nbsp;</strong>
                            &nbsp;{links?.invoice_pdf && <Link to={`${links?.invoice_pdf || "#"}`} target='_blank'><FilePdf color='#FF0000' size={14} /></Link>}
                            &nbsp;&nbsp;{projectId && title === "Invoice Created" && <Link to={`/invoice/${projectId}`} target='_blank'><Link45deg color='#3366CC' size={16} /></Link>}
                        </div>
                    ) : type === "billing" ? (
                        <>
                            <Bank size={16} color="#1AB2FF" />{" "}
                            <strong>&nbsp; Billing</strong>
                        </>
                    ) : type === "email" ? (
                        <>
                            <Envelope size={16} color="#1AB2FF" />{" "}
                            <strong>&nbsp; Email</strong>
                        </>
                    ) : type === "job" ? (
                        <>
                            <Briefcase size={16} color="#1AB2FF" />{" "}
                            <strong>&nbsp; Job</strong>
                        </>
                    ) : type === "expense" ? (
                        <>
                            <FolderSymlink size={16} color="#1AB2FF" />{" "}
                            <strong>&nbsp; Expense</strong>
                        </>
                    ) : null}
                </li>
            </ul>
        );
    };

    return (
        <Card className={clsx(style.border, 'mb-3 mt-2')}>
            <Card.Body>
                <h3 className='projectHistoryTitle' style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>History</h3>
                <div className='projectHistoryScroll' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {sortedHistory?.length ? (
                        sortedHistory.map(({ type, text, title, created, manager, links }, index) => (
                            <div className='projectHistorygroup' key={`history-${index}`}>
                                {renderHistoryIcon(type, links, title)}
                                <h5 style={{ whiteSpace: "pre-line" }}>{type !== "email" && title || ""}</h5>
                                {
                                    type === "email" ? <EmailComponent emailData={text} />
                                        :
                                        <h6 style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: text }} />
                                }
                                <p>{formatTimestamp(created)} by {manager}</p>
                            </div>
                        ))
                    ) : (
                        <p className='text-center text-muted'>No history available</p>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

const InvoiceCostBreakdown = ({ calculations, invoice }) => {
    console.log('invoice: ', invoice);
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
                <div className='d-flex flex-column align-items-end'>
                    <p className='font-16 mb-0' style={{ color: '#106B99', fontWeight: 400 }}>Sub Total</p>
                    <p className='font-18 mb-0' style={{ color: '#106B99', fontWeight: 600 }}>${formatAUD(invoice?.sub_total)}</p>
                </div>
                <div>
                    <PlusCircle size={20} color='#106B99' />
                </div>
                <div className='d-flex flex-column align-items-end'>
                    <p className='font-16 mb-0' style={{ color: '#106B99', fontWeight: 400 }}>Tax</p>
                    <p className='font-18 mb-0' style={{ color: '#106B99', fontWeight: 600 }}>${formatAUD(invoice?.gst)}</p>
                </div>
                <div>
                    <div>
                        <PauseCircle size={20} color='#106B99' style={{ transform: 'rotate(90deg)' }} />
                    </div>
                </div>
                <div className='d-flex flex-column align-items-end'>
                    <p className='font-16 mb-0' style={{ color: '#106B99', fontWeight: 400 }}>Total Invoice Amount</p>
                    <p className='font-18 mb-0' style={{ color: '#106B99', fontWeight: 600 }}>${formatAUD(invoice?.total)}</p>
                </div>
            </div>
        </>
    );
};

const InvoiceJobsAndExpense = ({ jobs, expenses }) => {
    // Combine jobs and expenses with type identifier and sort by created date
    const combinedData = useMemo(() => {
        const expensesWithType = (expenses || []).map(item => ({ ...item, itemType: 'expense' }));
        const jobsWithType = (jobs || []).map(item => ({ ...item, itemType: 'job' }));
        const combined = [...expensesWithType, ...jobsWithType];
        return combined.sort((a, b) => parseInt(b.created) - parseInt(a.created));
    }, [jobs, expenses]);

    const numberBody = (rowData) => {
        if (rowData.itemType === 'job') {
            return (
                <Link to={`/work/jobs?jobId=${rowData?.id}`} className='linkText' target='_blank'>
                    JOB-{rowData?.number}
                </Link>
            );
        }
        return (
            <Link to={`/expenses?expenseId=${rowData?.id}&supplierName=${rowData?.supplier?.name}`} className='linkText' target='_blank'>
                {rowData?.number}
            </Link>
        );
    };

    const typeBody = (rowData) => {
        if (rowData.itemType === 'job') {
            return (
                <div className='d-flex align-items-center gap-1'>
                    <Briefcase size={14} color="#1AB2FF" />
                    <span>Job</span>
                </div>
            );
        }
        return (
            <div className='d-flex align-items-center gap-1'>
                <FolderSymlink size={14} color="#1AB2FF" />
                <span>Expense</span>
            </div>
        );
    };

    const referenceBody = (rowData) => {
        const reference = rowData.itemType === 'job' 
            ? rowData?.reference 
            : rowData?.invoice_reference;
        return (
            <div className="ellipsis-width" title={reference || '-'} style={{ maxWidth: '192px' }}>
                {reference || '-'}
            </div>
        );
    };

    const providerBody = (rowData) => {
        const isJob = rowData.itemType === 'job';
        const name = isJob ? rowData?.worker?.full_name : rowData?.supplier?.name;
        const hasPhoto = isJob ? rowData?.worker?.has_photo : rowData?.supplier?.has_photo;
        const photo = isJob ? rowData?.worker?.photo : rowData?.supplier?.photo;

        return (
            <OverlayTrigger
                key={'top'}
                placement={'top'}
                overlay={
                    <Tooltip className='TooltipOverlay' id={`tooltip-provider`}>
                        {name || ""}
                    </Tooltip>
                }
            >
                <div className='mr-auto d-flex align-items-center justify-content-center ps-2' style={{ width: 'fit-content' }}>
                    <ImageAvatar has_photo={hasPhoto} photo={photo} is_business={!isJob} size={16} />
                    <div className='ellipsis-width'>{name || "N/A"}</div>
                </div>
            </OverlayTrigger>
        );
    };

    const statusBody = (rowData) => {
        if (rowData.itemType === 'job') {
            return (
                <div className='expenseStatus'>
                    <JobStatus status={rowData?.status} actionStatus={rowData?.action_status} published={rowData?.published} />
                </div>
            );
        }
        return (
            <div className='expenseStatus'>
                <span className={rowData?.paid ? 'paid' : 'unpaid'}>
                    {rowData?.paid ? 'Paid' : 'Not Paid'}
                </span>
            </div>
        );
    };

    return (
        <DataTable value={combinedData} showGridlines className="border-top">
            <Column 
                field="number" 
                header="#" 
                body={numberBody} 
                bodyClassName='text-center' 
                headerClassName='text-center' 
                style={{ width: '100px', whiteSpace: 'nowrap' }}
            />
            <Column 
                field="itemType" 
                header="Type" 
                body={typeBody} 
                style={{ width: '100px' }}
            />
            <Column 
                field="reference" 
                header="Reference" 
                style={{ minWidth: '192px' }} 
                body={referenceBody}
            />
            <Column 
                field="provider" 
                header="Provider" 
                body={providerBody} 
                style={{ minWidth: '100px', width: '300px', maxWidth: '300px' }} 
                bodyClassName={"d-flex justify-content-between"}
            />
            <Column 
                field="total" 
                header="Estimate/Total" 
                body={(rowData) => `$${formatAUD(rowData.total)}`}
            />
            <Column 
                field="status" 
                header="Status" 
                body={statusBody} 
                style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}
            />
        </DataTable>
    );
};

export default InvoicePartialPayment;