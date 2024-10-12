import React, { useEffect, useState } from 'react'
import { ChevronLeft, PlusSlashMinus } from 'react-bootstrap-icons'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import CustomRadioButton from './ui/custom-radio-button';
import DepartmentQuote from './department-quote';
import { toast } from 'sonner';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createNewCalculationQuoteRequest, createNewMergeQuote, deleteMergeQuote, getQuoteByUniqueId, updateNewCalculationQuoteRequest } from '../../../../../APIs/CalApi';
import { Spinner } from 'react-bootstrap';
import SendQuote from '../../../features/sales-features/send-quote/send-quote';
import CreateProposal from '../../../features/sales-features/create-proposal/create-proposal';

const CalculateQuote = () => {
    const navigate = useNavigate();
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
        cacheTime: 0
    });

    useEffect(() => {
        if (!unique_id) {
            const storedSessionData = JSON.parse(window.sessionStorage.getItem(`new-request`) || "{}");
            const profileData = JSON.parse(window.localStorage.getItem('profileData') || "{}");
            setPayload((others) => ({
                ...others,
                xero_tax: "ex",
                display_discount: true,
                managers: [{ manager: profileData?.id }],
                client: storedSessionData?.id || "",
                reference: storedSessionData?.reference || "",
                description: storedSessionData?.requirements || ""
            }))
        } else {
            setPayload((others) => ({ ...others, ...newRequestQuery?.data }))
        }
    }, [unique_id, newRequestQuery?.data])

    const newRequestMutation = useMutation({
        mutationFn: (data) => createNewCalculationQuoteRequest(data),
        onSuccess: (response) => {
            if (response) {
            } else {
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
            if (response) {
            } else {
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

        payload.recurring = { frequency: "1", occurrences: 10, start_date: new Date() } // dummy
        console.log('payload.........: ', payload);

        const merges = payload.merges;
        console.log('merges: ', merges);
        if (payload.merges) delete payload.merges;

        if (!payload?.client) return toast.error('Client is required');
        if (!payload?.contact_person) return toast.error('Contact person is required');
        if (!payload?.managers || !payload.managers?.length) return toast.error('Project manager is required');
        if (!payload?.calculations || !payload.calculations.length) return toast.error('At least one calculation is required');
        if (!payload?.xero_tax) return toast.error('Tax details is required');
        if (!payload?.expense) return toast.error('Expense is required');

        let result;
        setIsLoading(true);
        if (mergeDeletedItems.length) {
            for (const id of mergeDeletedItems) {
                try {
                    if (id) await deleteMergeQuote(id);
                } catch (error) {
                    console.log('Error during with deleting merge: ', error);
                }
            };
        }
        if (unique_id) {
            console.log('After update managers payload.....: ', payload);
            console.log('merges: ', merges);

            result = await updateRequestMutation.mutateAsync(payload);
            let uniqueid = result?.unique_id;

            if (merges && merges?.length) {
                let calculatorMap = result.calculations?.reduce((map, item) => {
                    map[item.calculator] = item.id;
                    return map;
                }, {});

                console.log('calculatorMap: ', calculatorMap);

                const updateMerges = merges?.map(item => ({
                    ...item,
                    unique_id: uniqueid,
                    calculations: item.calculators.map(calc => ({
                        calculator: calculatorMap[calc.calculator]
                    }))
                }));

                console.log('updateMerges: ', updateMerges);
                for (const merge of updateMerges) {
                    try {
                        if (merge.id) await deleteMergeQuote(merge.id);
                        await createNewMergeQuote(merge);
                    } catch (error) {
                        setIsLoading(false);
                        console.log('Error during with creating merge: ', error);
                    }
                };
                toast.success(`Calculations and merge items updated successfully.`);
            } else {
                toast.success(`Calculations updated successfully.`);
            }

        } else {
            result = await newRequestMutation.mutateAsync(payload);
            let uniqueid = result?.unique_id;

            if (merges && merges?.length) {
                let calculatorMap = result.calculations?.reduce((map, item) => {
                    map[item.calculator] = item.id;
                    return map;
                }, {});

                const updateMerges = merges?.map(item => ({
                    ...item,
                    unique_id: uniqueid,
                    calculations: item.calculators.map(calc => ({
                        calculator: calculatorMap[calc.calculator]
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
                return navigate(`${result?.quote_url}`);
            } else {
                toast.error('Quote PDF not found.');
            }
        }

        navigate(`/sales`)
        setIsLoading(false);
        setShowQuoteModal(false);
    }

    console.log('newRequestMutation.isPending || newRequestQuery.isFetching || isLoading: ', newRequestMutation.isPending , newRequestQuery.isFetching , isLoading);
    return (
        <div className='newQuotePage'>
            <div className='topbar d-flex justify-content-between' style={{ padding: '16px 32px', height: '72px', position: 'relative' }}>
                <NavLink to={""}>
                    <button className='back-button' style={{ padding: "10px 16px" }} onClick={() => { navigate(-1) }}>
                        <ChevronLeft color="#000000" size={20} /> &nbsp;Go Back
                    </button>
                </NavLink>
                <h2 className='m-0' style={{ fontSize: '22px', fontWeight: '600', position: 'absolute', left: '42.5%' }}><PlusSlashMinus color="#1D2939" size={16} />&nbsp; Calculate a Quote</h2>
                <div className='d-flex align-items-center justify-content-end'>
                    <CustomRadioButton
                        label="Standard"
                        name="customRadio"
                        value="Standard"
                        checked={quoteType === 'Standard'}
                        onChange={(e) => setQuoteType(e.target.value)}
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
                    />
                    <CustomRadioButton
                        label="Retainer"
                        name="customRadio"
                        value="Retainer"
                        checked={quoteType === 'Retainer'}
                        onChange={(e) => setQuoteType(e.target.value)}
                    />
                </div>
            </div>

            <div className='w-100' style={{ overflow: 'auto', height: 'calc(100% - 208px)', padding: '16px 32px' }}>
                <DepartmentQuote payload={payload} setPayload={setPayload} totals={totals} setTotals={setTotals} refetch={newRequestQuery?.refetch} preExistMerges={newRequestQuery?.data?.merges || []} preExistCalculation={newRequestQuery?.data?.calculations || []} setMergeDeletedItems={setMergeDeletedItems} setContactPersons={setContactPersons} />
            </div>

            <div className='calculation-quote-bottom w-100' style={{ padding: '8px 24px', height: '136px', background: '#fff', borderTop: '1px solid #EAECF0', boxShadow: '0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)' }}>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                    <div className='d-flex align-items-center' style={{ gap: '16px' }}>
                        <div className='item'>
                            <label>Budget</label>
                            <div className='amount'>$ {totals.budget}</div>
                        </div>
                        <div className='item'>
                            <label>Operational Profit</label>
                            <div className='amount' style={{ color: '#079455' }}>$ {totals.operationalProfit}</div>
                        </div>
                    </div>
                    <div className='d-flex align-items-center' style={{ gap: '16px' }}>
                        <div className='item'>
                            <label>Subtotal</label>
                            <div className='amount'>$ {totals.subtotal}</div>
                        </div>
                        <div className='item'>
                            <label>Tax ( 10% )</label>
                            <div className='amount'>$ {totals.tax}</div>
                        </div>
                        <div className='item' style={{ minWidth: 'fit-content' }}>
                            <label>Total</label>
                            <div className='amount'>$ {totals.total}</div>
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                    <div className='d-flex align-items-center' style={{ gap: '0px' }}>
                        <a href='/sales' type="button" className="button-custom text-button padding-left-0" style={{ color: '#B42318' }}>
                            Cancel
                        </a>
                        {
                            (unique_id && newRequestQuery?.data?.quote_url) ? (
                                <a href={`${newRequestQuery?.data?.quote_url}`} target='_blank' type="button" className="button-custom text-button px-2">
                                    Quote PDF
                                </a>
                            ) : (
                                <a href='#' onClick={() => createNewRequest('quote-pdf-open')} type="button" className="button-custom text-button px-2">
                                    Quote PDF
                                </a>
                            )
                        }
                        <button type="button" className="button-custom text-button px-2" onClick={() => setShowProposalModal(true)}>
                            Create Proposal
                        </button>
                    </div>
                    <div className='d-flex align-items-center' style={{ gap: '8px' }}>
                        <button type="button" onClick={() => createNewRequest('draft')} className="button-custom text-button">
                            Save Draft
                            {(newRequestMutation.isPending || updateRequestMutation.isPending)
                                && (newRequestMutation?.variables?.action === "draft" || updateRequestMutation?.variables?.action === "draft")
                                && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                        </button>
                        <button type="button" onClick={() => createNewRequest('save')} className="button-custom submit-button-light">
                            Save
                            {(newRequestMutation.isPending || updateRequestMutation.isPending)
                                && (newRequestMutation?.variables?.action === "save" || updateRequestMutation?.variables?.action === "save")
                                && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                        </button>
                        <button type="button" onClick={() => createNewRequest('saveAndsend')} className="submit-button">
                            Save and Send
                            {(newRequestMutation.isPending || updateRequestMutation.isPending)
                                && (newRequestMutation?.variables?.action === "send" || updateRequestMutation?.variables?.action === "send")
                                && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
                        </button>
                    </div>
                </div>
            </div>

            <SendQuote show={showQuoteModal} setShow={setShowQuoteModal} contactPersons={contactPersons} setPayload={setPayload} createNewRequest={createNewRequest} />
            <CreateProposal show={showProposalModal} setShow={setShowProposalModal} />

            {
                (newRequestMutation.isPending || newRequestQuery.isFetching || isLoading) && <div style={{ position: 'absolute', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            }
        </div>
    )
}



export default CalculateQuote