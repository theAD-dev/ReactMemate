import React, { useEffect, useState } from 'react'
import DepartmentCalculationTable from './department-calculation-table';
import { Col, Row, Placeholder } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import CustomRadioButton from '../ui/custom-radio-button';
import { FormControl, MenuItem, Select } from '@mui/material';
import { ChevronDown, InfoCircle, PencilSquare } from 'react-bootstrap-icons';
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

const DepartmentQuote = React.memo(({ payload, setPayload, setTotals, refetch, preExistCalculation, preExistMerges, setMergeDeletedItems, setContactPersons }) => {
  const [paymentCollection, setPaymentCollection] = useState('request');
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [editedReference, setEditedReference] = useState('');
  const [isEditingReference, setIsEditingReference] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const handleEditReference = () => {
    setIsEditingReference(true);
    setEditedReference(payload.reference || '');
  };
  const handleEditDescription = () => {
    setIsEditingDescription(true);
    setEditedDescription(payload.description || '');
  };

  const handleDataChange = (e) => {
    setEditedReference(e.target.value);
    setEditedDescription(e.target.value);
  };

  const handleSaveReference = () => {
    setIsEditingReference(false);
    setPayload((prev) => ({ ...prev, reference: editedReference }));
  };
  const handleSaveDescription = () => {
    setIsEditingDescription(false);
    setPayload((prev) => ({ ...prev, description: editedDescription }));
  };


  const projectManagerQuery = useQuery({ queryKey: ['project-manager'], queryFn: getProjectManager });
  const clientQuery = useQuery({
    queryKey: ['id', payload.client],
    queryFn: () => getClientById(payload.client),
    enabled: !!payload.client,
    retry: 1,
  });

  useEffect(() => {
    if (clientQuery.data?.contact_persons?.length) {
      let person = clientQuery.data?.contact_persons[0];
      let find = clientQuery.data?.contact_persons.find((contact) => contact.is_main === true);
      if (find) {
        setPayload((others) => ({ ...others, contact_person: find.id }));
      } else {
        setPayload((others) => ({ ...others, contact_person: person.id }));
      }
      setContactPersons(clientQuery.data?.contact_persons);
    }
  }, [clientQuery.data])

  useEffect(() => {
    if (payload.managers) {
      const uniqueManagers = payload.managers.reduce((acc, manager) => {
        if (!acc.some(item => item.manager === manager.manager)) {
          acc.push(manager);
        }
        return acc;
      }, []);

      const initialManagers = uniqueManagers.map(manager => ({
        value: manager.manager,
        label: projectManagerQuery?.data?.find(user => user.id === manager.manager)?.name || 'Unknown',
        image: projectManagerQuery?.data?.find(user => user.id === manager.manager)?.photo || 'https://dev.memate.com.au/media/no_org.png'
      }));
      setSelectedManagers(initialManagers);
    }
  }, [payload.managers, projectManagerQuery.data]);

  return (
    <React.Fragment>
      <div className='company-info text-left' style={{ background: '#fff', borderRadius: '4px', padding: '16px', marginBottom: '16px' }}>
        <Row>
          <Col md={8} style={{ borderRight: '1px solid #F2F4F7' }}>
            <h3 style={{ color: '#344054', fontSize: '16px', fontWeight: '600' }}>Reference  <InfoCircle color="#667085" size={16} /></h3>
            {clientQuery.isLoading ? (
              <Placeholder as="p" animation="wave">
                <Placeholder xs={12} bg="secondary" className="rounded-0" size="sm" style={{ width: '120px', height: '20px' }} />
              </Placeholder>
            ) : isEditingReference ? (
              <p>
                <input
                  type="text"
                  value={editedReference}
                  onChange={handleDataChange}
                  onBlur={handleSaveReference}
                  autoFocus
                  className="border rounded p-2 w-100"
                />
              </p>
            ) : (
              <div>
                <p style={{ color: '#475467', fontSize: '16px', fontWeight: '400', marginBottom: '16px', whiteSpace: "pre-line" }}>
                  {payload.reference}
                  <PencilSquare size={16} color="#106B99" onClick={handleEditReference} className='ms-2' style={{ cursor: 'pointer' }} />
                </p>
              </div>
            )}


            <h3 style={{ color: '#344054', fontSize: '16px', fontWeight: '600' }}>Description</h3>
            {clientQuery.isLoading ? (
              <Placeholder as="p" animation="wave">
                <Placeholder xs={12} bg="secondary" className="rounded-0" size="sm" style={{ width: '120px', height: '20px' }} />
              </Placeholder>
            ) : isEditingDescription ? (
              <p>
                <textarea
                  type="text"
                  value={editedDescription}
                  onChange={handleDataChange}
                  onBlur={handleSaveDescription}
                  autoFocus
                  className="border rounded p-2"
                  style={{ resize: 'none', width: '100%', height: '120px' }}
                ></textarea>
              </p>
            ) : (
              <div>
                <p style={{ color: '#475467', fontSize: '16px', fontWeight: '400', marginBottom: '16px', whiteSpace: "pre-line" }}>
                  {payload.description}
                  <PencilSquare size={16} color="#106B99" onClick={handleEditDescription} className='ms-2' style={{ cursor: 'pointer' }} /></p>
              </div>
            )}

          </Col>
          <Col md={4}>
            <h3 style={{ color: '#344054', fontSize: '16px', fontWeight: '600' }}>Quote To  <InfoCircle color="#667085" size={16} /></h3>
            <Row>
              {
                clientQuery?.data?.is_business ?
                  <QuoteToBusiness isLoading={clientQuery?.isLoading} data={clientQuery?.data} setPayload={setPayload} />
                  :
                  <QuoteToClient isLoading={clientQuery?.isLoading} data={clientQuery?.data} setPayload={setPayload} />
              }
            </Row>
          </Col>
        </Row>
      </div>
      <div className='DepartmentQuote' style={{ background: '#fff', borderRadius: '4px', padding: '16px' }}>

        <DepartmentCalculationTable setTotals={setTotals} setPayload={setPayload} xero_tax={payload.xero_tax} defaultDiscount={clientQuery?.data?.category?.value || 0} preExistCalculation={preExistCalculation} preMerges={preExistMerges} refetch={refetch} setMergeDeletedItems={setMergeDeletedItems} />

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
                          value={selectedManagers}
                          onChange={(selected) => {
                            const managers = selected
                              ? [...new Map(selected.map((obj) => [obj.value, { manager: obj.value }])).values()]
                              : [];

                            setSelectedManagers(selected);
                            setPayload((others) => ({ ...others, managers: managers || [] }));
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
                          options={projectManagerQuery?.data?.map((user) => ({
                            value: user.id,
                            label: user.name,
                            image: user.photo || 'https://dev.memate.com.au/media/no_org.png',
                          }))}
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
                          value={payload?.purchase_order || ""}
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
                          value={payload?.xero_tax || ""}
                          onChange={(e) => setPayload((data) => ({ ...data, xero_tax: e.target.value }))}
                          displayEmpty
                          inputProps={{ 'aria-label': 'Without label' }}
                          IconComponent={ChevronDown}
                        >
                          <MenuItem value={"ex"}>Tax exclusive</MenuItem>
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
                    <div className="toggle-switch-wrap">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={Boolean(payload.display_discount)}
                          onChange={(e) => setPayload((prevPayload) => ({
                            ...prevPayload,
                            display_discount: e.target.checked
                          }))}
                        />
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