import React, { useEffect, useState } from 'react'
import { ChevronLeft, PlusSlashMinus } from 'react-bootstrap-icons'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import CustomRadioButton from './ui/custom-radio-button';
import DepartmentQuote from './department-quote';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createNewCalculationQuoteRequest, getQuoteByUniqueId } from '../../../../../APIs/CalApi';

const CalculateQuote = () => {
    const navigate = useNavigate();
    const { unique_id } = useParams();

    let id;
    let quoteFormData = {};
    try {
        const storedData = window.sessionStorage.getItem(`new-request`);
        if (storedData) {
            quoteFormData = JSON.parse(storedData);
            id = quoteFormData.id;
        }
    } catch (error) {
        console.error('Failed to parse form data from sessionStorage', error);
    }
    const [quoteType, setQuoteType] = useState('Standard');
    const [payload, setPayload] = useState({
        client: +id || "",
        contact_person: "",
        reference: quoteFormData?.reference || "",
        description: quoteFormData?.requirements || "",
        purchase_order: "",
        expense: "",
        xero_tax: "ex",
        note: "",
        recurring: {
            frequency: "1",
            occurrences: 10,
            start_date: new Date()
        },
        calculations: []
    });
    const [totals, setTotals] = useState({
        budget: 0,
        operationalProfit: 0,
        subtotal: 0,
        tax: 0,
        total: 0,
    });

    const newRequestMutation = useMutation({
        mutationFn: (data) => createNewCalculationQuoteRequest(data),
        onSuccess: (response) => {
            console.log('response: ', response);
            if (response) {
                window.sessionStorage.setItem('newRequestId', response);
                navigate(`/sales/quote-calculation/${response}`);
                toast.success("Calculation quote created successfully.");
            } else {
                toast.error(`Failed to create new calculation quote. Please try again.`);
            }
        },
        onError: (error) => {
            console.error('Error creating new calculation quote:', error);
            toast.error(`Failed to create new calculation quote. Please try again.`);
        }
    });

    const createNewRequest = () => {
        if (unique_id) return;

        if (!payload.client) return toast.error('Client is required');
        if (!payload.contact_person) return toast.error('Project manager is required');
        if (!payload.calculations || !payload.calculations.length) return toast.error('At least one calculation is required');
        if (!payload.xero_tax) return toast.error('Tax details is required');
        if (!payload.expense) return toast.error('Expense is required');
        newRequestMutation.mutate(payload);
    }

    const newRequestQuery = useQuery({
        queryKey: ['unique_id', unique_id],
        queryFn: () => getQuoteByUniqueId(unique_id),
        enabled: !!unique_id,
        retry: 1,
    });

    useEffect(()=> {
      if(newRequestQuery?.data) {
        console.log('read quote:', newRequestQuery?.data);
        setPayload(newRequestQuery?.data);
      }
    }, [newRequestQuery?.data])

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
                <DepartmentQuote id={id} payload={payload} setPayload={setPayload} totals={totals} setTotals={setTotals} preExistCalculation={newRequestQuery?.data?.calculations || {}}/>
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
                        <button type="button" className="button-custom text-button">
                            Save Draft
                        </button>
                        <button type="button" onClick={createNewRequest} className="button-custom submit-button-light">
                            Save
                        </button>
                        <button type="button" className="submit-button">
                            Save and Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default CalculateQuote