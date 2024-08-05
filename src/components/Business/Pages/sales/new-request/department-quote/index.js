import React, { useState } from 'react'
import DepartmentCalculationTable from './department-calculation-table';
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import CustomRadioButton from '../../newquote/CustomRadioButton';
import { FormControl, MenuItem, Select } from '@mui/material';
import { ChevronDown } from 'react-bootstrap-icons';

const DepartmentQuote = React.memo(({ totals, setTotals }) => {
  const [isDiscountDisplayed, setIsDiscountDisplayed] = useState(true);
  const [paymentCollection, setPaymentCollection] = useState('')
  const [notes, setNotes] = useState("");
  const [xero_tax, setXero_tax] = useState('ex');

  return (
    <div className='DepartmentQuote' style={{ background: '#fff', borderRadius: '4px', padding: '16px' }}>
      <DepartmentCalculationTable totals={totals} setTotals={setTotals} xero_tax={xero_tax} isDiscountActive={isDiscountDisplayed} />
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3 text-start note-textarea" controlId="exampleForm.ControlTextarea1">
            <Form.Label style={{ color: '#475467', fontSize: '14px' }}>Notes on the quote/invoice</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder='Enter a description...'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className='textarea'
              style={{ height: '220px', padding: '12px 14px', resize: 'none' }}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Row>
            <Col>
              <Row>
                <Col sm={12} className='text-start'>
                  <div className="formgroupboxs mb-2 mt-3">
                    <label>Amounts are</label>
                    <div className={`inputInfo `}>
                      <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                        <Select
                          value={xero_tax}
                          onChange={(e) => {
                            setXero_tax(e.target.value);
                          }}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          IconComponent={ChevronDown}
                        >
                          <MenuItem value="ex">Tax exclusive</MenuItem>
                          <MenuItem value={"in"}>Tax Inclusive</MenuItem>
                          <MenuItem value={"no"}>No tax</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </Col>
              </Row>



            </Col>
            <Col>
              <Row>
                <Col sm={12} className='quoteInvoice'>
                  <div className="radio-buttons mt-5">
                    <CustomRadioButton
                      label={<><b>Request Payment </b> <span> Create an invoice requesting <br></br>payment on a specific date</span></>}
                      name="payment"
                      value="request"
                      checked={paymentCollection === 'request'}
                      onChange={() => setPaymentCollection("request")}
                    />
                    <CustomRadioButton
                      label={<><b>Autocharge Customer </b> <span> Automatically charge a payment<br></br> method on file</span></>}
                      name="payment"
                      value="auto"
                      checked={paymentCollection === 'auto'}
                      onChange={() => setPaymentCollection("auto")}
                    />
                  </div>
                </Col>
                <Col sm={12}>
                  <div className='toggle-switch-wrap'>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={isDiscountDisplayed} onChange={() => setIsDiscountDisplayed(!isDiscountDisplayed)} />
                      <span className="switch" />
                    </label>
                    <em>Display Discounts</em>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
});

export default DepartmentQuote