import React, { useEffect, useRef, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { ChevronLeft, FiletypePdf, PlusSlashMinus } from 'react-bootstrap-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import isEqual from 'lodash.isequal';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import DepartmentQuote from './department-quote';
import CustomRadioButton from './ui/custom-radio-button';
import { createNewCalculationQuoteRequest, createNewMergeQuote, deleteMergeQuote, getQuoteByUniqueId, updateNewCalculationQuoteRequest } from '../../../../../APIs/CalApi';
import { linkEnquiryToSale } from '../../../../../APIs/enquiries-api';
import { useTrialHeight } from '../../../../../app/providers/trial-height-provider';
import useNavigationGuard from '../../../../../shared/hooks/use-navigation-guard';
import { formatAUD } from '../../../../../shared/lib/format-aud';
import CreateProposal from '../../../features/sales-features/create-proposal/create-proposal';
import SendQuote from '../../../features/sales-features/send-quote/send-quote';


const CalculateQuote = () => {
    const hasSetInitial = useRef(false);
    const initialPayloadTimerRef = useRef(null);
    const navigate = useNavigate();
    const { trialHeight } = useTrialHeight();
    const [isDirty, setIsDirty] = useState(false);
    const [contactPersons, setContactPersons] = useState([]);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [quoteType, setQuoteType] = useState('Standard');
    const [payload, setPayload] = useState({});
    const [initialPayload, setInitialPayload] = useState(null);
    const [mergeDeletedItems, setMergeDeletedItems] = useState([]);
    const [totals, setTotals] = useState({ budget: 0, operationalProfit: 0, subtotal: 0, tax: 0, total: 0 });
    const { unique_id } = useParams();
    const { isBlocked, confirmNavigation, cancelNavigation, blockNavigation } = useNavigationGuard(isDirty);
    const newRequestQuery = useQuery({
        queryKey: ['unique_id', unique_id],
        queryFn: () => getQuoteByUniqueId(unique_id),
        enabled: !!unique_id,
        retry: 1,
        cacheTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!unique_id) {
            const storedSessionData = JSON.parse(window.sessionStorage.getItem(`new-request`) || "{}");
            const profileData = JSON.parse(window.localStorage.getItem('profileData') || "{}");
            const newPayload = {
                xero_tax: "ex",
                display_discount: true,
                managers: [{ manager: profileData?.desktop_user_id }],
                client: storedSessionData?.id || "",
                reference: storedSessionData?.reference || "",
                description: storedSessionData?.requirements || "",
                recurring: {
                    frequency: "M",
                    start_date: new Date(),
                    end_by: 0,
                    upfront_projects: 0,
                    initial_projects: 0,
                },
            };

            setPayload(newPayload);
        } else if (newRequestQuery?.data) {
            let quoteType = newRequestQuery?.data?.recurring?.frequency ? 'Recurring' : 'Standard';
            setQuoteType(quoteType);
            const newData = { ...newRequestQuery?.data };
            if (quoteType === 'Recurring') {
                const sydneyFormatter = new Intl.DateTimeFormat('en-AU', {
                    timeZone: 'Australia/Sydney',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                });

                // Check if timestamp is in seconds, then multiply by 1000
                const startTimestamp = +newData.recurring.start_date;
                newData.recurring.start_date = new Date(startTimestamp < 1e12 ? startTimestamp * 1000 : startTimestamp);
                console.log("Start Date (Sydney):", sydneyFormatter.format(newData.recurring.start_date));

                newData.recurring.end_by = +newData.recurring.end_by;
                newData.recurring.upfront_projects = +newData.recurring.upfront_projects;
                newData.recurring.initial_projects = +newData.recurring.initial_projects;

                if (newData.recurring.end_by === 1) {
                    const endTimestamp = +newData.recurring.end_date;
                    newData.recurring.end_date = new Date(endTimestamp < 1e12 ? endTimestamp * 1000 : endTimestamp);
                    console.log("End Date (Sydney):", sydneyFormatter.format(newData.recurring.end_date));
                }
            } else {
                newData.recurring = {
                    frequency: "M",
                    start_date: new Date(),
                    end_by: 0,
                    upfront_projects: 0,
                    initial_projects: 0
                };
            }

            setPayload(newData);
        }
    }, [unique_id, newRequestQuery?.data]);

    useEffect(() => {
        if (initialPayloadTimerRef.current) {
            clearTimeout(initialPayloadTimerRef.current);
        }

        if (Object.keys(payload).length > 0 && !initialPayload) {
            initialPayloadTimerRef.current = setTimeout(() => {
                console.log('Setting initial payload after 2 seconds');
                setInitialPayload(structuredClone(payload));
            }, 2000);
        }

        return () => {
            if (initialPayloadTimerRef.current) {
                clearTimeout(initialPayloadTimerRef.current);
            }
        };
    }, [payload, initialPayload]);

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
            console.log('Error updating new calculation quote:', error, error?.data?.client?.[0]);

            if (error?.status === 400) {
                const msg = error?.data?.client?.[0];
                if (msg?.includes('Invalid pk') && msg?.includes('object does not exist')) {
                    return toast.error("This client has been deleted. Please restore it before continuing.");
                }
            }

            toast.error(`Failed to update calculation quote. Please try again.`);
        }
    });

    function formatDateToYMD(date) {
        if (!date) return '';
        date = new Date(date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const createNewRequest = async (action) => {
        // Reset dirty state for save actions (we're intentionally saving)
        if (action === "save" || action === "draft" || action === "quote-pdf-open" || action === "create-proposal" || action === "send") {
            setIsDirty(false);
        }

        payload.action = action;
        if (action !== "send") {
            delete payload.subject;
            delete payload.email_body;
            delete payload.to;
            delete payload.cc;
            delete payload.bcc;
            delete payload.from_email;
            delete payload.signature;
        }

        if (action === "saveAndsend") {
            if ((!payload?.calculations || !payload.calculations.length) && action !== "draft") return toast.error('At least one calculation is required');
            setShowQuoteModal(true);
            return;
        }

        if (action === "quote-pdf-open" || action === "create-proposal") {
            payload.action = "save";
        }

        const merges = payload.merges;
        if (payload.merges) delete payload.merges;

        if (!payload?.client) return toast.error('Client is required');
        // if (!payload?.contact_person && action !== "draft") return toast.error('Contact person is required');
        if ((!payload?.managers || !payload.managers?.length) && action !== "draft") return toast.error('Project manager is required');
        if ((!payload?.calculations || !payload.calculations.length) && action !== "draft") return toast.error('At least one calculation is required');
        if (!payload?.xero_tax && action !== "draft") return toast.error('Tax details is required');
        if (!payload?.expense && action !== "draft") return toast.error('Expense is required');

        if (quoteType === 'Recurring' && !payload?.recurring) return toast.error('Recurring details is required');
        if (quoteType === 'Recurring' && !payload?.recurring?.frequency) return toast.error('Recurring frequency is required');
        if (quoteType === 'Recurring' && !payload?.recurring?.start_date) return toast.error('Recurring start date is required');
        if (quoteType === 'Recurring' && !([0, 1, 2].includes(payload?.recurring?.end_by))) return toast.error('Recurring end by is required');
        if (quoteType === 'Recurring' && payload?.recurring?.end_by === 1 && !payload?.recurring?.end_date) return toast.error('Recurring end date is required');
        if (quoteType === 'Recurring' && payload?.recurring?.end_by === 2 && !payload?.recurring?.occurrences) return toast.error('Recurring projects is required');
        if (quoteType === 'Recurring') {
            if (payload.recurring.start_date)
                payload.recurring.start_date = formatDateToYMD(payload.recurring.start_date);
            if (payload.recurring.end_date && payload.recurring.end_by === 1)
                payload.recurring.end_date = formatDateToYMD(payload.recurring.end_date);
            else {
                delete payload.recurring.end_date;
            }
        } else {
            payload.recurring = null;
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

        try {
            const storedEnquiryData = JSON.parse(sessionStorage.getItem('enquiry-to-sale'));
            if (storedEnquiryData?.enquiryId) {
                let uniqueid = result?.unique_id;
                await linkEnquiryToSale(storedEnquiryData.enquiryId, { sale_unique_id:uniqueid});
                sessionStorage.removeItem('enquiry-to-sale');
            }            
        } catch (error) {
            console.error('Failed to parse enquiry data from sessionStorage', error);
            toast.error('Failed to link enquiry to sale.');
        }

        if (action === "quote-pdf-open") {
            if (result?.quote_url) {
                window.location.href = `${process.env.REACT_APP_URL}${result.quote_url}`;
            } else {
                toast.error('Quote PDF not found.');
            }
        } else if (action === "create-proposal") {
            let uniqueid = result?.unique_id;
            if (uniqueid) navigate(`/sales/quote-calculation/${uniqueid}`);
            setShowProposalModal(true);
        } else {
            navigate(`/sales`);
        }

        setIsLoading(false);
        setShowQuoteModal(false);
    };

    const handleCancel = () => {
        const wasBlocked = blockNavigation(() => navigate('/sales'));
        if (!wasBlocked) {
            navigate('/sales');
        }
    };

    const handleDiscardChanges = () => {
        setIsDirty(false);
        setShowUnsavedChangesModal(false);

        // If navigation was blocked, proceed with it
        if (isBlocked) {
            confirmNavigation();
        } else {
            // Direct navigation for cancel action
            navigate('/sales');
        }
    };

    const handleGoBack = () => {
        const wasBlocked = blockNavigation(() => navigate(-1));
        if (!wasBlocked) {
            navigate(-1);
        }
    };

    useEffect(() => {
        if (!hasSetInitial.current && initialPayload && Object.keys(payload).length > 0) {
            hasSetInitial.current = true;
            return;
        }

        if (hasSetInitial.current && initialPayload) {
            const hasChanges = !isEqual(payload, initialPayload);
            setIsDirty(hasChanges);
        }
    }, [payload, initialPayload]);

    useEffect(() => {
        if (isBlocked) {
            setShowUnsavedChangesModal(true);
        }
    }, [isBlocked]);

    return (
        <div className='newQuotePage'>
            <div className='topbar d-flex justify-content-between' style={{ padding: '16px 32px', height: '72px', position: 'relative', boxShadow: "rgba(0, 0, 0, 0.05) 0px 1px 2px 0px" }}>
                <div>
                    <button className='back-button' style={{ padding: "10px 16px" }} onClick={handleGoBack}>
                        <ChevronLeft color="#000000" size={17} /> &nbsp;Go Back
                    </button>
                </div>
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
                        <button type="button" onClick={handleCancel} className="button-custom text-button text-danger px-0 me-3" style={{ color: '#B42318' }}>
                            Cancel
                        </button>
                        {
                            <button type="button" onClick={() => createNewRequest('quote-pdf-open')} className="button-custom text-button px-0">
                                Quote PDF
                            </button>
                        }
                        {
                            newRequestQuery?.data?.proposal_pdf ? (
                                <div className='d-flex align-items-center'>
                                    <button type="button" className="text-button px-0 ms-3" onClick={() => setShowProposalModal(true)}>
                                        Edit Proposal
                                    </button>
                                    <Link to={`${process.env.REACT_APP_URL}${newRequestQuery?.data?.proposal_pdf}`} target='_blank' rel="noreferrer" style={{ position: 'relative', top: '-2px', left: '6px' }}>
                                        <FiletypePdf color='#106B99' size={20} />
                                    </Link>
                                </div>
                            ) : (
                                <button type="button" className="button-custom text-button px-2" onClick={() => createNewRequest('create-proposal')}>
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

            {/* Unsaved Changes Modal */}
            <Modal
                show={showUnsavedChangesModal}
                onHide={() => {
                    setShowUnsavedChangesModal(false);
                    if (isBlocked) {
                        cancelNavigation();
                    }
                }}

                contentClassName="border rounded-3"
                dialogClassName='w-100 position-absolute bottom-40 right-10'

            >
                <Modal.Body style={{ padding: '24px', position: 'relative' }}>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={() => {
                            setShowUnsavedChangesModal(false);
                            if (isBlocked) {
                                cancelNavigation();
                            }
                        }}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            padding: '0',
                            width: '14px',
                            height: '14px',
                            opacity: '0.4',
                            backgroundSize: '14px'
                        }}
                    ></button>

                    <div className="d-flex align-items-start">
                        <div
                            className="d-flex align-items-center justify-content-center flex-shrink-0 me-3"
                            style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                backgroundColor: '#FEE4E2'
                            }}
                        >
                            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="9" y="9" width="20" height="20" rx="10" fill="white" />
                                <g opacity="0.3">
                                    <rect x="6" y="6" width="26" height="26" rx="13" stroke="#D92D20" strokeWidth="2" />
                                </g>
                                <g opacity="0.1">
                                    <rect x="1" y="1" width="36" height="36" rx="18" stroke="#D92D20" strokeWidth="2" />
                                </g>
                                <g clipPath="url(#clip0_17777_93388)">
                                    <path d="M19.0003 15.6665V18.9998M19.0003 22.3332H19.0087M27.3337 18.9998C27.3337 23.6022 23.6027 27.3332 19.0003 27.3332C14.398 27.3332 10.667 23.6022 10.667 18.9998C10.667 14.3975 14.398 10.6665 19.0003 10.6665C23.6027 10.6665 27.3337 14.3975 27.3337 18.9998Z" stroke="#D92D20" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_17777_93388">
                                        <rect width="20" height="20" fill="white" transform="translate(9 9)" />
                                    </clipPath>
                                </defs>
                            </svg>

                        </div>
                        <div style={{ flex: 1, paddingRight: '8px' }}>
                            <h5 style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#344054',
                                marginBottom: '4px',
                                lineHeight: '28px',
                                marginTop: '10px'
                            }}>
                                Are you sure you want to close it without Saving?
                            </h5>
                            {/* <p style={{
                                color: '#475467',
                                fontSize: '14px',
                                margin: '0 0 20px 0',
                                lineHeight: '20px',
                                fontWeight: '400'
                            }}>
                                You have unsaved changes on the quote. Following fields are changed.
                            </p> */}

                            <div className="d-flex justify-content-end" style={{ gap: '12px', marginTop: '24px' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowUnsavedChangesModal(false);
                                        if (isBlocked) {
                                            cancelNavigation();
                                        }
                                    }}
                                    style={{
                                        padding: '0px 5px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        border: '0px solid #D0D5DD',
                                        color: '#475467',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        lineHeight: '20px',
                                        minWidth: 'auto'
                                    }}
                                >
                                    Dismiss
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDiscardChanges}
                                    style={{
                                        padding: '0px 5px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        backgroundColor: '#fff',
                                        border: 'none',
                                        color: '#B42318',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        lineHeight: '20px',
                                        whiteSpace: 'nowrap',
                                        minWidth: 'auto'
                                    }}
                                >
                                    Close Without Saving
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

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