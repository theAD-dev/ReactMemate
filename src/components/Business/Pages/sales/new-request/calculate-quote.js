import React, { useEffect, useState } from 'react'
import { ChevronLeft, PlusSlashMinus } from 'react-bootstrap-icons'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import CustomRadioButton from './ui/custom-radio-button';
import DepartmentQuote from './department-quote';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createNewCalculationQuoteRequest, createNewMergeQuote, getQuoteByUniqueId } from '../../../../../APIs/CalApi';
import { Spinner } from 'react-bootstrap';

const CalculateQuote = () => {
    const navigate = useNavigate();
    const [quoteType, setQuoteType] = useState('Standard');
    const [payload, setPayload] = useState({});
    const [totals, setTotals] = useState({ budget: 0, operationalProfit: 0, subtotal: 0, tax: 0, total: 0 });
    const { unique_id } = useParams();
    const newRequestQuery = useQuery({
        queryKey: ['unique_id', unique_id],
        queryFn: () => getQuoteByUniqueId(unique_id),
        enabled: !!unique_id,
        retry: 1,
        cacheTime: 0
    });
    console.log('newRequestQuery......', newRequestQuery.data);

    useEffect(() => {
        if (!unique_id) {
            const storedSessionData = JSON.parse(window.sessionStorage.getItem(`new-request`) || "{}");
            setPayload((others) => ({
                ...others,
                xero_tax: "ex",
                managers: [{ manager: 20 }],
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
            console.error('Error creating new calculation quote:', error);
            toast.error(`Failed to create new calculation quote. Please try again.`);
        }
    });

    const createNewRequest = async (action) => {
        payload.action = action;
        payload.recurring = { frequency: "1", occurrences: 10, start_date: new Date() } // dummy
        console.log('payload: ', payload);

        const merges = payload.merges;
        delete payload.merges;


        if (!payload?.client) return toast.error('Client is required');
        if (!payload?.contact_person) return toast.error('Contact person is required');
        if (!payload?.managers || !payload.managers?.length) return toast.error('Project manager is required');
        if (!payload?.calculations || !payload.calculations.length) return toast.error('At least one calculation is required');
        if (!payload?.xero_tax) return toast.error('Tax details is required');
        if (!payload?.expense) return toast.error('Expense is required');

        if (unique_id) return toast.error('UPDATE API is under construction...');
        const result = await newRequestMutation.mutateAsync(payload);
        console.log('result: ', result);
        let uniqueid = result?.unique_id;
        if (merges?.length) {
            let calculatorMap = result.calculations?.reduce((map, item) => {
                map[item.calculator] = item.id;
                return map;
            }, {});

            const updateMerges = merges?.map(item => ({
                ...item,
                unique_id: uniqueid,
                calculations: item.calculators.map(calc => ({
                    calculator: calculatorMap[calc.id]
                }))
            }));

            updateMerges.forEach(async (merge) => {
                try {
                    const result = await createNewMergeQuote(merge);
                } catch(error) {
                    console.log('Error during with creating merge: ', error);
                }
            });
            toast.success(`Calculations and new merges items created successfully.`);
            navigate(`/sales/quote-calculation/${uniqueid}`);
        } else {
            toast.success(`Calculations created successfully.`);
            navigate(`/sales/quote-calculation/${uniqueid}`);
        }
    }

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
                <DepartmentQuote payload={payload} setPayload={setPayload} totals={totals} setTotals={setTotals} refetch={newRequestQuery?.refetch} preExistMerges={newRequestQuery?.data?.merges || []} preExistCalculation={newRequestQuery?.data?.calculations || []} />
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
                        <button type="button" className="button-custom text-button padding-left-0" style={{ color: '#B42318' }}>
                            Cancel
                        </button>
                        <button type="button" className="button-custom text-button px-2">
                            Quote PDF
                        </button>
                        <button type="button" className="button-custom text-button px-2">
                            Create Proposal
                        </button>
                    </div>
                    <div className='d-flex align-items-center' style={{ gap: '8px' }}>
                        <button type="button" onClick={() => createNewRequest('draft')} className="button-custom text-button">
                            Save Draft
                        </button>
                        <button type="button" onClick={() => createNewRequest('save')} className="button-custom submit-button-light">
                            Save
                        </button>
                        <button type="button" onClick={() => createNewRequest('send')} className="submit-button">
                            Save and Send
                        </button>
                    </div>
                </div>
            </div>
            {
                (newRequestMutation.isPending || newRequestQuery.isFetching) && <div style={{ position: 'absolute', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            }
        </div>
    )
}



export default CalculateQuote