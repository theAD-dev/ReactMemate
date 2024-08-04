import React, { useState } from 'react'
import { ChevronLeft, PlusSlashMinus } from 'react-bootstrap-icons'
import { NavLink, useNavigate } from 'react-router-dom'
import CustomRadioButton from '../newquote/CustomRadioButton';
import DepartmentQuote from './department-quote';

const CalculateQuote = () => {
    const navigate = useNavigate();
    const [quoteType, setQuoteType] = useState('Standard');
    const [totals, setTotals] = useState({
        budget: 0,
        operationalProfit: 0,
        subtotal: 0,
        tax: 0,
        total: 0,
    });


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

            <div className='w-100' style={{ overflow: 'auto', height: 'calc(100% - 208px)', border: '0px solid green', padding: '16px 32px' }}>

                <DepartmentQuote totals={totals} setTotals={setTotals} />
                <h1 style={{ marginTop: '1000px', }}>Hi!</h1>
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
                        <button type="button" className="button-custom submit-button-light">
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