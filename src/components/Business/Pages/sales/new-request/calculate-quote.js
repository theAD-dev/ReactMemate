import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { ChevronLeft, FiletypePdf, PlusSlashMinus } from 'react-bootstrap-icons';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import DepartmentQuote from './department-quote';
import CustomRadioButton from './ui/custom-radio-button';
import { createNewCalculationQuoteRequest, createNewMergeQuote, deleteMergeQuote, getQuoteByUniqueId, updateNewCalculationQuoteRequest } from '../../../../../APIs/CalApi';
import { useTrialHeight } from '../../../../../app/providers/trial-height-provider';
import { formatAUD } from '../../../../../shared/lib/format-aud';
import CreateProposal from '../../../features/sales-features/create-proposal/create-proposal';
import SendQuote from '../../../features/sales-features/send-quote/send-quote';


const CalculateQuote = () => {
    const navigate = useNavigate();
    const { trialHeight } = useTrialHeight();
    const [contactPersons, setContactPersons] = useState([]);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [quoteType, setQuoteType] = useState('Standard');
    const [payload, setPayload] = useState({});
    const [mergeDeletedItems, setMergeDeletedItems] = useState([]);
    const [totals, setTotals] = useState({ budget: 0, operationalProfit: 0, subtotal: 0, tax: 0, total: 0 });
    const { unique_id } = useParams();
    const newRequestQuery = useQuery({
        queryKey: ['unique_id', unique_id],
        queryFn: () => getQuoteByUniqueId(unique_id),
        enabled: !!unique_id,
        retry: 1,
        cacheTime: 0,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!unique_id) {
            const storedSessionData = JSON.parse(window.sessionStorage.getItem(`new-request`) || "{}");
            const profileData = JSON.parse(window.localStorage.getItem('profileData') || "{}");
            setPayload((others) => ({
                ...others,
                xero_tax: "ex",
                display_discount: true,
                managers: [{ manager: profileData?.desktop_user_id }],
                client: storedSessionData?.id || "",
                reference: storedSessionData?.reference || "",
                description: storedSessionData?.requirements || ""
            }));
        } else if (newRequestQuery?.data) {
            let quoteType = newRequestQuery?.data?.recurring?.frequency ? 'Recurring' : 'Standard';
            setQuoteType(quoteType);
            const newData = { ...newRequestQuery?.data };
            if (quoteType === 'Recurring') {
                newData.recurring.start_date = new Date(+newData.recurring.start_date * 1000);
                newData.recurring.end_by = +newData.recurring.end_by;
                if (newData.recurring.end_by === 1)
                    newData.recurring.end_date = new Date(+newData.recurring.end_date * 1000);
            }
            setPayload((others) => ({ ...others, ...newData }));
        }
    }, [unique_id, newRequestQuery?.data]);

    const newRequestMutation = useMutation({
        mutationFn: (data) => createNewCalculationQuoteRequest(data),
        onSuccess: (response) => {
            if (!response) {
                toast.error(`Failed to create new calculation quote. Please try again.`);
            }
        },
        onError: (error) => {
            setIsLoading(false);
            console.error('Error creating new calculation quote:', error);
            toast.error(`Failed to create new calculation quote. Please try again.`);
        }
    });

    const updateRequestMutation = useMutation({
        mutationFn: (data) => updateNewCalculationQuoteRequest(unique_id, data),
        onSuccess: (response) => {
            if (!response) {
                setIsLoading(false);
                toast.error(`Failed to update calculation quote. Please try again.`);
            }
        },
        onError: (error) => {
            setIsLoading(false);
            console.error('Error updating new calculation quote:', error);
            toast.error(`Failed to update calculation quote. Please try again.`);
        }
    });

    const createNewRequest = async (action) => {
        payload.action = action;
        if (action !== "send") {
            delete payload.subject;
            delete payload.email_body;
            delete payload.to;
            delete payload.cc;
            delete payload.bcc;
        }

        if (action === "saveAndsend") {
            setShowQuoteModal(true);
            return;
        }

        if (action === "quote-pdf-open") {
            payload.action = "save";
        }

        const merges = payload.merges;
        if (payload.merges) delete payload.merges;

        if (!payload?.client) return toast.error('Client is required');
        if (!payload?.contact_person) return toast.error('Contact person is required');
        if (!payload?.managers || !payload.managers?.length) return toast.error('Project manager is required');
        if (!payload?.calculations || !payload.calculations.length) return toast.error('At least one calculation is required');
        if (!payload?.xero_tax) return toast.error('Tax details is required');
        if (!payload?.expense) return toast.error('Expense is required');

        if (quoteType === 'Recurring' && !payload?.recurring) return toast.error('Recurring details is required');
        if (quoteType === 'Recurring' && !payload?.recurring?.frequency) return toast.error('Recurring frequency is required');
        if (quoteType === 'Recurring' && !payload?.recurring?.start_date) return toast.error('Recurring start date is required');
        if (quoteType === 'Recurring' && !([0, 1, 2].includes(payload?.recurring?.end_by))) return toast.error('Recurring end by is required');
        if (quoteType === 'Recurring' && payload?.recurring?.end_by === 1 && !payload?.recurring?.end_date) return toast.error('Recurring end date is required');
        if (quoteType === 'Recurring' && payload?.recurring?.end_by === 2 && !payload?.recurring?.occurrences) return toast.error('Recurring projects is required');
        if (quoteType === 'Recurring') {
            if (payload.recurring.start_date)
                payload.recurring.start_date = payload.recurring.start_date.toISOString().split('T')[0];
            if (payload.recurring.end_date && payload.recurring.end_by === 1)
                payload.recurring.end_date = payload.recurring.end_date.toISOString().split('T')[0];
            else {
                delete payload.recurring.end_date;
            }
        }

        let result;
        setIsLoading(true);
        if (mergeDeletedItems.length) {
            for (const id of mergeDeletedItems) {
                try {
                    if (id) await deleteMergeQuote(id);
                } catch (error) {
                    console.log('Error during with deleting merge: ', error);
                }
            }
        }
        if (unique_id) {
            result = await updateRequestMutation.mutateAsync(payload);
            let uniqueid = result?.unique_id;

            if (merges && merges?.length) {
                let calculatorMap = result.calculations?.reduce((map, item) => {
                    map[item.merge_id] = item.id;
                    return map;
                }, {});

                const updateMerges = merges?.map(item => ({
                    ...item,
                    unique_id: uniqueid,
                    calculations: item.calculators.map(calc => ({
                        calculator: calculatorMap[calc.merge_id]
                    }))
                }));

                for (const merge of updateMerges) {
                    try {
                        if (merge.id) await deleteMergeQuote(merge.id);
                        await createNewMergeQuote(merge);
                    } catch (error) {
                        setIsLoading(false);
                        console.log('Error during with creating merge: ', error);
                    }
                }
                toast.success(`Calculations and merge items updated successfully.`);
            } else {
                toast.success(`Calculations updated successfully.`);
            }

        } else {
            result = await newRequestMutation.mutateAsync(payload);
            let uniqueid = result?.unique_id;

            if (merges && merges?.length) {
                let calculatorMap = result.calculations?.reduce((map, item) => {
                    map[item.merge_id] = item.id;
                    return map;
                }, {});

                const updateMerges = merges?.map(item => ({
                    ...item,
                    unique_id: uniqueid,
                    calculations: item.calculators.map(calc => ({
                        calculator: calculatorMap[calc.merge_id]
                    }))
                }));

                updateMerges.forEach(async (merge) => {
                    try {
                        await createNewMergeQuote(merge);
                    } catch (error) {
                        setIsLoading(false);
                        console.log('Error during with creating merge: ', error);
                    }
                });
                toast.success(`Calculations and new merge items created successfully.`);
            } else {
                toast.success(`Calculations created successfully.`);
            }
        }

        if (action === "quote-pdf-open") {
            if (result?.quote_url) {
                window.open(result.quote_url, '_blank');
            } else {
                toast.error('Quote PDF not found.');
            }
        } else {
            navigate(`/sales`);
        }

        setIsLoading(false);
        setShowQuoteModal(false);
    };

    return (
        <div className='newQuotePage'>
            <div className='topbar d-flex justify-content-between' style={{ padding: '16px 32px', height: '72px', position: 'relative', boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px" }}>
                <NavLink to={""}>
                    <button className='back-button' style={{ padding: "10px 16px" }} onClick={() => { navigate(-1); }}>
                        <ChevronLeft color="#000000" size={17} /> &nbsp;Go Back
                    </button>
                </NavLink>
                <h2 className='m-0' style={{ fontSize: '22px', fontWeight: '600', position: 'absolute', left: '42.5%' }}>
                    <div className='d-flex flex-column align-items-center gap-1'>
                        <div className='d-flex align-items-center'><PlusSlashMinus color="#1D2939" size={16} />&nbsp; Calculate a Quote</div>
                        {newRequestQuery?.data?.number && <small className='font-14 border px-3 py-1 rounded' style={{ width: 'fit-content' }}>{newRequestQuery?.data?.number}</small>}
                    </div>
                </h2>
                <div className='d-flex align-items-center justify-content-end'>
                    <CustomRadioButton
                        label="Standard"
                        name="customRadio"
                        value="Standard"
                        checked={quoteType === 'Standard'}
                        onChange={(e) => setQuoteType(e.target.value)}
                        disabled={false}
                    />
                    <CustomRadioButton
                        label="Recurring"
                        name="customRadio"
                        value="Recurring"
                        checked={quoteType === 'Recurring'}
                        onChange={(e) => setQuoteType(e.target.value)}
                    />
                    <CustomRadioButton
                        label="Subscription"
                        name="customRadio"
                        value="Subscription"
                        checked={quoteType === 'Subscription'}
                        onChange={(e) => setQuoteType(e.target.value)}
                        disabled={true}
                    />
                    <CustomRadioButton
                        label="Retainer"
                        name="customRadio"
                        value="Retainer"
                        checked={quoteType === 'Retainer'}
                        onChange={(e) => setQuoteType(e.target.value)}
                        disabled={true}
                    />
                </div>
            </div>

            <div className='w-100' style={{ overflow: 'auto', height: `calc(100% - 208px - ${trialHeight}px)`, padding: '16px 32px' }}>
                <DepartmentQuote payload={payload} setPayload={setPayload} totals={totals} setTotals={setTotals} refetch={newRequestQuery?.refetch} preExistMerges={newRequestQuery?.data?.merges || []} preExistCalculation={newRequestQuery?.data?.calculations || []} setMergeDeletedItems={setMergeDeletedItems} setContactPersons={setContactPersons} quoteType={quoteType} />
            </div>

            <div className='calculation-quote-bottom w-100' style={{ padding: '8px 24px', height: '136px', background: '#fff', borderTop: '1px solid #f2f2f2', boxShadow: 'rgba(0, 0, 0, 0.06) 0px 0px 4px 0px inset' }}>
                <div className='d-flex justify-content-between align-items-center pb-3' style={{ gap: '20px', width: '100%', overflowX: 'auto' }}>
                    <div className='d-flex align-items-center' style={{ gap: '16px' }}>
                        <div className='item'>
                            <label>Budget</label>
                            <div className='amount'>${formatAUD(totals.budget)}</div>
                        </div>
                        <div className='item'>
                            <label>Operational Profit</label>
                            <div className='amount' style={{ color: '#079455' }}>${formatAUD(totals.operationalProfit)}</div>
                        </div>
                    </div>
                    <div className='d-flex align-items-center' style={{ gap: '16px' }}>
                        <div className='item'>
                            <label>Subtotal</label>
                            <div className='amount'>${formatAUD(totals.subtotal)}</div>
                        </div>
                        <div className='item'>
                            <label>Tax (10%)</label>
                            <div className='amount'>${formatAUD(totals.tax)}</div>
                        </div>
                        <div className='item' style={{ minWidth: 'fit-content' }}>
                            <label>Total</label>
                            <div className='amount'>${formatAUD(totals.total)}</div>
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <div className='d-flex align-items-center' style={{ gap: '0px' }}>
                        <a href='/sales' type="button" className="button-custom text-button text-danger padding-left-0" style={{ color: '#B42318' }}>
                            Cancel
                        </a>
                        {
                            <a href='#' onClick={() => createNewRequest('quote-pdf-open')} type="button" className="button-custom text-button px-0">
                                Quote PDF
                            </a>
                        }
                        {
                            newRequestQuery?.data?.proposal_pdf ? (
                                <div className='d-flex align-items-center gap-2'>
                                    <button type="button" className="button-custom text-button pe-0" onClick={() => setShowProposalModal(true)}>
                                        Edit Proposal
                                    </button>
                                    <a href={`${newRequestQuery?.data?.proposal_pdf}`} target='_blank' type="button" className="button-custom text-button ps-0" rel="noreferrer">
                                        <FiletypePdf color='#106B99' size={20} />
                                    </a>
                                </div>
                            ) : (
                                <button type="button" disabled={!unique_id} className="button-custom text-button px-2" onClick={() => setShowProposalModal(true)}>
                                    Create Proposal
                                </button>
                            )
                        }
                    </div>
                    <div className='d-flex align-items-center' style={{ gap: '8px' }}>
                        <button type="button" disabled={newRequestMutation.isPending || updateRequestMutation.isPending} onClick={() => createNewRequest('draft')} className="button-custom text-button">
                            Save Draft
                            {(newRequestMutation.isPending || updateRequestMutation.isPending)
                                && (newRequestMutation?.variables?.action === "draft" || updateRequestMutation?.variables?.action === "draft")
                                && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                        </button>
                        <button type="button" disabled={newRequestMutation.isPending || updateRequestMutation.isPending} onClick={() => createNewRequest('save')} className="button-custom submit-button-light">
                            Save
                            {(newRequestMutation.isPending || updateRequestMutation.isPending)
                                && (newRequestMutation?.variables?.action === "save" || updateRequestMutation?.variables?.action === "save")
                                && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                        </button>
                        <button type="button" disabled={newRequestMutation.isPending || updateRequestMutation.isPending} onClick={() => createNewRequest('saveAndsend')} className="submit-button">
                            Save and Send
                            {(newRequestMutation.isPending || updateRequestMutation.isPending)
                                && (newRequestMutation?.variables?.action === "send" || updateRequestMutation?.variables?.action === "send")
                                && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                        </button>
                    </div>
                </div>
            </div>

            <SendQuote show={showQuoteModal} setShow={setShowQuoteModal} contactPersons={contactPersons} setPayload={setPayload} createNewRequest={createNewRequest} />
            <CreateProposal show={showProposalModal} setShow={setShowProposalModal} refetch={newRequestQuery?.refetch} contactPersons={contactPersons} isExist={!!newRequestQuery?.data?.proposal_pdf} />

            {
                (newRequestMutation.isPending || newRequestQuery.isFetching || isLoading) && <div style={{ position: 'absolute', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            }
        </div >
    );
};



export default CalculateQuote;