import React, { useContext, useState } from 'react'
import DepartmentCalculationTable from './department-calculation-table';
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import CustomRadioButton from '../../newquote/custom-radio-button';
import { FormControl, MenuItem, Select } from '@mui/material';
import { ChevronDown, InfoCircle } from 'react-bootstrap-icons';
import { components } from 'react-select';
import Select1 from 'react-select';
import QuoteToBusiness from './quote-to-business';
import QuoteToClient from './quote-to-client';
import { ClientContext } from '../client-provider';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getClientById } from '../../../../../../APIs/ClientsApi';

const CustomOption = (props) => {
  return (
    <components.Option {...props}>
      <img
        src={props.data.image}
        alt={props.data.label}
        style={{ width: 20, height: 20, marginRight: 10 }}
      />
      {props.data.label}
    </components.Option>
  );
};

const DepartmentQuote = React.memo(({ totals, setTotals }) => {
  const { id } = useParams();
  let quoteFormData = {};
    try {
        const storedData = window.sessionStorage.getItem(`formData-${id}`);
        if (storedData) {
            quoteFormData = JSON.parse(storedData);
        }
    } catch (error) {
        console.error('Failed to parse form data from sessionStorage', error);
    }
  const [isDiscountDisplayed, setIsDiscountDisplayed] = useState(true);
  const [paymentCollection, setPaymentCollection] = useState('')
  const [notes, setNotes] = useState("");
  const [xero_tax, setXero_tax] = useState('ex');
  const [purchase_order, set_purchase_order] = useState("");
  const { isLoading, data, isError, refetch } = useQuery({
    queryKey: ['id', id],
    queryFn: () => getClientById(id),
    enabled: !!id,
    retry: 1,
  });
  console.log('data: ', data);

  return (
    <React.Fragment>
      <div className='company-info text-left' style={{ background: '#fff', borderRadius: '4px', padding: '16px', marginBottom: '16px' }}>
        <Row>
          <Col md={8} style={{ borderRight: '1px solid #F2F4F7' }}>
            <h3 style={{ color: '#344054', fontSize: '16px', fontWeight: '600' }}>Reference  <InfoCircle color="#667085" size={16} /></h3>
            <p style={{ color: '#475467', fontSize: '16px', fontWeight: '400', marginBottom: '16px' }}>{quoteFormData?.reference || ""}</p>

            <h3 style={{ color: '#344054', fontSize: '16px', fontWeight: '600' }}>Description</h3>
            <p style={{ color: '#475467', fontSize: '16px', fontWeight: '400', marginBottom: '16px' }}>{quoteFormData?.requirements || ""}</p>
          </Col>
          <Col md={4}>
            <h3 style={{ color: '#344054', fontSize: '16px', fontWeight: '600' }}>Quote To  <InfoCircle color="#667085" size={16} /></h3>
            <Row>
              {
                data?.is_business ?
                  <QuoteToBusiness data={data} />
                  :
                  <QuoteToClient data={data} />
              }
            </Row>
          </Col>
        </Row>
      </div>
      <div className='DepartmentQuote' style={{ background: '#fff', borderRadius: '4px', padding: '16px' }}>
        <DepartmentCalculationTable totals={totals} setTotals={setTotals} xero_tax={xero_tax} isDiscountActive={true} />
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
                style={{ height: '229px', padding: '12px 14px', resize: 'none' }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Row>
              <Col>
                <Row>
                  <Col sm={12} className='text-start'>
                    <div className='formgroupboxs mb-3 mt-1'>
                      <label style={{ color: '#475467', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Project Manager</label>
                      <div className={`inputInfo px-0`} style={{ height: '46px' }}>
                        <Select1
                          placeholder="Select Manager"
                          className="basic-multi-select w-100 border-0"
                          closeMenuOnSelect={false}
                          components={{ Option: CustomOption }}
                          defaultValue={""}
                          isMulti
                          styles={{
                            control: (styles) => ({
                              ...styles, boxShadow: 'none',
                            }),
                            multiValueRemove: (styles) => {
                              return {
                                ...styles,
                                ':hover': {
                                  backgroundColor: '#fff'
                                },
                              }
                            },
                            multiValue: (styles, { data }) => {
                              console.log('data: ', data);
                              return {
                                ...styles,
                                backgroundColor: '#fff',
                                border: '1px solid #D0D5DD',
                                borderRadius: '4px',
                                ':before': {
                                  borderRadius: '50%',
                                  content: '" "',
                                  backgroundImage: `url(${data.image})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat',
                                  display: 'block',
                                  marginRight: 8,
                                  position: 'relative',
                                  top: '5px',
                                  left: '5px',
                                  height: 16,
                                  width: 16,
                                  border: '0.3px solid #101828'
                                },
                              };
                            },
                          }}
                          options={[
                            {
                              value: '1',
                              label: 'Olivia',
                              image: 'https://dev.memate.com.au/media/no_org.png'
                            },
                            {
                              value: '2',
                              label: 'Olivia',
                              image: 'https://dev.memate.com.au/media/no_org.png'
                            }
                          ]}
                        />
                      </div>
                    </div>

                  </Col>
                  <Col sm={12} className='text-start'>
                    <div className="formgroupboxs mb-3">
                      <label style={{ color: '#475467', fontSize: '14px', marginBottom: '6px' }}>PO</label>
                      <div className={`inputInfo px-0`} style={{ height: '46px' }}>
                        <Form.Control
                          required
                          type="text"
                          placeholder="Purchase Order #"
                          value={purchase_order}
                          style={{ color: '#101828' }}
                          className='w-100 m-0 border-0 no-border-outline'
                          onChange={(e) => set_purchase_order(e.target.value)}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col sm={12} className='text-start'>
                    <Form.Group className="mb-3 mui-select-custom">
                      <Form.Label style={{ color: '#475467', fontSize: '14px', marginBottom: '6px' }}>Task Title</Form.Label>
                      <FormControl sx={{ m: 0, minWidth: `100%`, color: '#101828' }}>
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
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col sm={12} className='quoteInvoice'>
                    <div className="radio-buttons mt-4 pt-3">
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
    </React.Fragment>
  )
});

export default DepartmentQuote