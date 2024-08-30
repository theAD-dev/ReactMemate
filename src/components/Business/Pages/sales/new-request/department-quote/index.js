import React, { useEffect, useState } from 'react'
import DepartmentCalculationTable from './department-calculation-table';
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import CustomRadioButton from '../ui/custom-radio-button';
import { FormControl, MenuItem, Select } from '@mui/material';
import { ChevronDown, InfoCircle } from 'react-bootstrap-icons';
import { components } from 'react-select';
import Select1 from 'react-select';
import QuoteToBusiness from './quote-to-business';
import QuoteToClient from './quote-to-client';
import { useQuery } from '@tanstack/react-query';
import { getClientById, getProjectManager } from '../../../../../../APIs/ClientsApi';

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

const DepartmentQuote = React.memo(({ id, payload, setPayload, setTotals, preExistCalculation }) => {
  const [isDiscountDisplayed, setIsDiscountDisplayed] = useState(true);
  const [paymentCollection, setPaymentCollection] = useState('')

  const [contactPersonsOptions, setContactPersonsOptions] = useState("");
  const [selected_contact_persons, set_selected_contact_persons] = useState([]);
  const projectManagerQuery = useQuery({ queryKey: ['project-manager'], queryFn: getProjectManager });
  const clientQuery = useQuery({
    queryKey: ['id', id || payload.client],
    queryFn: () => getClientById(id || payload.client),
    enabled: !!id || !!payload.client,
    retry: 1,
  });

  useEffect(()=> {
    if(clientQuery.data?.contact_persons?.length) {
      let person = clientQuery.data?.contact_persons[0];
      console.log('person: ', person);
      let find = clientQuery.data?.contact_persons.find((contact)=> contact.is_main === true);
      console.log('find: ', find);
      if (find) {
        setPayload((others) => ({ ...others, contact_person: find.id }));
      }else {
        setPayload((others) => ({ ...others, contact_person: person.id }));
      }
    }
  }, [clientQuery.data])

  useEffect(() => {
    if (projectManagerQuery?.data) {
      const options = projectManagerQuery?.data?.map((user) => ({ value: user.id, label: user.name, image: user.photo || 'https://dev.memate.com.au/media/no_org.png' }))
      setContactPersonsOptions(options);
    }
  }, [projectManagerQuery?.data]);

  useEffect(() => {
    // if (payload.managers?.length && projectManagerQuery?.data) {
    //   let value = projectManagerQuery?.data?.find((option) => option.id === payload.contact_person);
    //   if (value)
    //     set_selected_contact_persons({ value: value.id, label: value.name, image: value.photo || 'https://dev.memate.com.au/media/no_org.png' });
    // }
  }, [payload])

  return (
    <React.Fragment>
      <div className='company-info text-left' style={{ background: '#fff', borderRadius: '4px', padding: '16px', marginBottom: '16px' }}>
        <Row>
          <Col md={8} style={{ borderRight: '1px solid #F2F4F7' }}>
            <h3 style={{ color: '#344054', fontSize: '16px', fontWeight: '600' }}>Reference  <InfoCircle color="#667085" size={16} /></h3>
            <p style={{ color: '#475467', fontSize: '16px', fontWeight: '400', marginBottom: '16px' }}>{payload.reference}</p>

            <h3 style={{ color: '#344054', fontSize: '16px', fontWeight: '600' }}>Description</h3>
            <p style={{ color: '#475467', fontSize: '16px', fontWeight: '400', marginBottom: '16px' }}>{payload.description}</p>
          </Col>
          <Col md={4}>
            <h3 style={{ color: '#344054', fontSize: '16px', fontWeight: '600' }}>Quote To  <InfoCircle color="#667085" size={16} /></h3>
            <Row>
              {
                clientQuery?.data?.is_business ?
                  <QuoteToBusiness isLoading={clientQuery?.isLoading} data={clientQuery?.data} />
                  :
                  <QuoteToClient isLoading={clientQuery?.isLoading} data={clientQuery?.data} />
              }
            </Row>
          </Col>
        </Row>
      </div>
      <div className='DepartmentQuote' style={{ background: '#fff', borderRadius: '4px', padding: '16px' }}>
        <DepartmentCalculationTable setTotals={setTotals} setPayload={setPayload} xero_tax={payload.xero_tax} isDiscountActive={true} preExistCalculation={preExistCalculation} />
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3 text-start note-textarea" controlId="exampleForm.ControlTextarea1">
              <Form.Label style={{ color: '#475467', fontSize: '14px' }}>Notes on the quote/invoice</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder='Enter a description...'
                value={payload.note || ""}
                onChange={(e) => setPayload((data) => ({ ...data, note: e.target.value }))}
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
                      <label style={{ color: '#475467', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Project Manager <sup className="text-danger">*</sup></label>
                      <div className={`inputInfo px-0`} style={{ minHeight: '46px', height: 'fit-content', padding: '0px 14px' }}>
                        <Select1
                          placeholder="Select Manager"
                          className="basic-multi-select w-100 border-0"
                          closeMenuOnSelect={false}
                          components={{ Option: CustomOption }}
                          value={selected_contact_persons}
                          onChange={(selected) => {
                            set_selected_contact_persons(selected)
                            let managers = [];
                            selected?.map((obj) => {
                              console.log('obj: ', obj);
                              managers.push({ manager: obj.value });
                              return obj;
                            })

                            setPayload((others) => ({ ...others, managers: managers }));
                          }}
                          isMulti
                          styles={{
                            control: (styles) => ({
                              ...styles, boxShadow: 'none',
                            }),
                            multiValueRemove: (styles) => {
                              return {
                                ...styles,
                                ':hover': {
                                  backgroundColor: '#fff',
                                  cursor: 'pointer'
                                },
                              }
                            },
                            multiValue: (styles, { data }) => {
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
                          options={contactPersonsOptions}
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
                          value={payload.purchase_order}
                          style={{ color: '#101828' }}
                          className='w-100 m-0 border-0 no-border-outline'
                          onChange={(e) => setPayload((data) => ({ ...data, purchase_order: e.target.value }))}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col sm={12} className='text-start'>
                    <Form.Group className="mb-3 mui-select-custom">
                      <Form.Label style={{ color: '#475467', fontSize: '14px', marginBottom: '6px' }}>Amounts are</Form.Label>
                      <FormControl sx={{ m: 0, minWidth: `100%`, color: '#101828' }}>
                        <Select
                          value={payload?.xero_tax}
                          onChange={(e) => setPayload((data) => ({ ...data, xero_tax: e.target.value }))}
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