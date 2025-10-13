import React, { useEffect, useState } from 'react';
import { Col, Row, Placeholder, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { ChevronDown, InfoCircle, PencilSquare } from 'react-bootstrap-icons';
import { components } from 'react-select';
import Select1 from 'react-select';
import { FormControl, MenuItem, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import Form from 'react-bootstrap/Form';
import DepartmentCalculationTable from './department-calculation-table';
import QuoteToBusiness from './quote-to-business';
import QuoteToClient from './quote-to-client';
import { getClientById, getProjectManager } from '../../../../../../APIs/ClientsApi';
import ImageAvatar from '../../../../../../ui/image-with-fallback/image-avatar';
import CustomRadioButton from '../ui/custom-radio-button';

const CustomOption = (props) => {
  return (
    <components.Option {...props}>
      <div className='d-flex align-items-center'>
        <ImageAvatar has_photo={props?.data.has_photo} photo={props.data.image} is_business={false} />
        {props.data.label}
      </div>
    </components.Option>
  );
};

const DepartmentQuote = React.memo(({ payload, setPayload, setTotals, refetch, preExistCalculation, preExistMerges, setMergeDeletedItems, setContactPersons, quoteType }) => {
  const [paymentCollection, setPaymentCollection] = useState('request');
  const [selectedManagers, setSelectedManagers] = useState([]);
  const [editedReference, setEditedReference] = useState('');
  const [isEditingReference, setIsEditingReference] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [maxUpfront, setMaxUpfront] = useState(21);

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
  }, [clientQuery.data]);

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
        has_photo: projectManagerQuery?.data?.find(user => user.id === manager.manager)?.has_photo,
        label: projectManagerQuery?.data?.find(user => user.id === manager.manager)?.name || 'Unknown',
        image: projectManagerQuery?.data?.find(user => user.id === manager.manager)?.photo || 'https://dev.memate.com.au/media/no_org.png'
      }));
      setSelectedManagers(initialManagers);
    }
  }, [payload.managers, projectManagerQuery.data]);

  useEffect(()=> {
    if (payload.recurring && quoteType === 'Recurring') {
      const frequency = payload.recurring.frequency || null;
      const start_date = new Date(payload.recurring.start_date);
      const end_by = payload.recurring.end_by || 0;
      console.log('end_by: ', end_by);

      if (end_by === 1) {
        const end_date = new Date(payload.recurring.end_date);
        let divider = 1;
        if (frequency === 'D') divider = 1000 * 60 * 60 * 24; // Daily
        else if (frequency === 'W') divider = 1000 * 60 * 60 * 24 * 7; // Weekly
        else if (frequency === 'B') divider = 1000 * 60 * 60 * 24 * 14; // Biweekly
        else if (frequency === 'M' || frequency === 'L') divider = 1000 * 60 * 60 * 24 * 30; // Monthly or Last Day of the Month
        else if (frequency === 'Q') divider = 1000 * 60 * 60 * 24 * 91; // Quarterly
        else if (frequency === 'Y') divider = 1000 * 60 * 60 * 24 * 365; // Yearly
        const daysBetweenStartAndEnd = Math.ceil((end_date - start_date) / divider); 
        console.log('daysBetweenStartAndEnd: ', daysBetweenStartAndEnd);
        setMaxUpfront(daysBetweenStartAndEnd);
      } else if (end_by === 2) {
        const occurrences = payload.recurring.occurrences || 0;
        setMaxUpfront(occurrences);
        if (payload.recurring.upfront_projects > occurrences)
        setPayload((data) => ({ ...data, recurring: { ...data?.recurring, initial_projects: occurrences, upfront_projects: occurrences } }));
      } else {
        setMaxUpfront(21);
      }
    }
  }, [payload.recurring, quoteType]);

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
              <div className='mb-4'>
                <p style={{ color: '#475467', fontSize: '16px', fontWeight: '400', marginBottom: '0px', whiteSpace: "pre-line", maxHeight: '200px', overflow: 'auto' }}>
                  {payload.description}
                </p>
                <PencilSquare size={16} color="#106B99" onClick={handleEditDescription} className='ms-1' style={{ cursor: 'pointer' }} />
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
      <div className='DepartmentQuote mb-3' style={{ background: '#fff', borderRadius: '4px', padding: '16px', width: '100%' }}>

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
                      <label style={{ color: '#475467', fontSize: '14px', display: 'block', marginBottom: '6px' }}>Project Manager<span className='required'>*</span></label>
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
                              };
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
                                  backgroundImage: data?.has_photo ? `url(${data.image})` : 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgd2lkdGg9IjFlbSIgaGVpZ2h0PSIxZW0iIGZpbGw9IiM2NjcwODUiIGNsYXNzPSJiaSBiaS1wZXJzb24iPjxwYXRoIGQ9Ik04IDhhMyAzIDAgMSAwIDAtNiAzIDMgMCAwIDAgMCA2bTItM2EyIDIgMCAxIDEtNCAwIDIgMiAwIDEgMSA0IDBtNCA4YzAgMS0xIDEtMSAxSDMscy0xIDAtMS0xIDEtNCA2LTQgNiAzIDYgNG0tMS0uMDA0Yy0uMDAxLS4yNDYtLjE1NC0uOTg2LS44MzItMS42NjRDMTEuNTE2IDEwLjY4IDEwLjI4OSAxMCA4IDEwcy0zLjUxNi42OC00LjE2OCAxLjMzMmMtLjY3OC42NzgtLjgzIDEuNDE4LS44MzIgMS42NjR6Ij48L3BhdGg+PC9zdmc+")',
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
                            image: user.photo,
                            has_photo: user.has_photo
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
                      <Form.Label style={{ color: '#475467', fontSize: '14px', marginBottom: '6px' }}>Amounts are<span className='required'>*</span></Form.Label>
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

      {quoteType === 'Recurring' &&
        <div style={{ background: '#fff', borderRadius: '4px', padding: '16px', width: '100%' }} >
          <h3 style={{ color: 'rgb(52, 64, 84)', fontSize: '16px', fontWeight: '600', textAlign: 'left' }}>
            Recurring Details {" "}
            {['top'].map((placement) => (
              <OverlayTrigger
                key={placement}
                placement={placement}
                overlay={
                  <Tooltip className='TooltipOverlay width-300' id={`tooltip-${placement}`}>
                    <div className='text-start'>
                      1. Daily - 15 Upfront <br />
                      2. Weekly - Day of the Week - 5 Upfront<br />
                      3. Biweekly - Day of the week - 4 Upfront<br />
                      4. Monthly - Date - 3 Upfront<br />
                      5. Last Day of the Month - Date - 3 Upfront<br />
                      6. Quarterly - Date - 4 Upfront<br />
                      7. Yearly - 2 Upfront
                    </div>

                  </Tooltip>
                }
              >
                <Button className='ms-1 bg-transparent border-0 p-0'><InfoCircle size={16} color="#667085" /> </Button>
              </OverlayTrigger>
            ))}
          </h3>

          <div className='d-flex align-items-center gap-3'>
            <div className="formgroupboxs mb-3 text-start">
              <label style={{ color: '#475467', fontSize: '14px', marginBottom: '6px', display: 'block' }}>Frequency <span className='required'>*</span></label>
              <Dropdown
                style={{ height: '46px',  minWidth: '250px', maxWidth: '250px'  }}
                value={payload?.recurring?.frequency || null}
                onChange={(e) => setPayload((data) => ({ ...data, recurring: { ...data?.recurring, frequency: e.value } }))}
                options={[
                  { label: "Daily", value: "D" },
                  { label: "Weekly", value: "W" },
                  { label: "Biweekly", value: "B" },
                  { label: "Monthly", value: "M" },
                  { label: "Last Day of the Month", value: "L" },
                  { label: "Quarterly", value: "Q" },
                  { label: "Yearly", value: "Y" },
                ]}
                className="w-100 outline-none"
                placeholder="Select frequency"
                filterInputAutoFocus={true}
              />
            </div>

            <div className="formgroupboxs mb-3 text-start">
              <label style={{ color: '#475467', fontSize: '14px', marginBottom: '6px' }}>Start <span className='required'>*</span></label>
              <Calendar
                value={payload?.recurring?.start_date || null}
                onChange={(e) => setPayload((data) => ({ ...data, recurring: { ...data?.recurring, start_date: e.value } }))}
                showButtonBar
                placeholder='DD/MM/YY'
                dateFormat="dd/mm/yy"
                locale="en"
                style={{ height: '46px' }}
                className='w-100 outline-none border rounded'
              />
            </div>

            <div className="formgroupboxs mb-3 text-start">
              <label style={{ color: '#475467', fontSize: '14px', marginBottom: '6px' }}>End <span className='required'>*</span></label>
              <Dropdown
                value={payload?.recurring?.end_by}
                onChange={(e) => setPayload((data) => ({ ...data, recurring: { ...data?.recurring, end_by: e.value } }))}
                options={[
                  { label: "No end", value: 0 },
                  { label: "Number of Occurrences", value: 2 },
                  { label: "By date", value: 1 },
                ]}
                style={{ height: '46px', minWidth: '260px' }}
                className="w-100 outline-none"
                placeholder="Select an end"
                filterInputAutoFocus={true}
              />
            </div>

            {
              payload?.recurring?.end_by === 2 ?
                <div className="formgroupboxs mb-3 text-start">
                  <label style={{ color: '#475467', fontSize: '14px', marginBottom: '6px' }}>Number of Occurrences <span className='required'>*</span></label>
                  <InputNumber
                    value={payload?.recurring?.occurrences || 0}
                    onValueChange={(e) => setPayload((data) => ({ ...data, recurring: { ...data?.recurring, occurrences: e.target.value } }))}
                    style={{ height: '46px' }}
                    placeholder='Enter number of occurrences'
                    inputStyle={{ width: '80px' }}
                    className='w-100 outline-none border rounded'
                  />
                </div>
                : payload?.recurring?.end_by === 1 ?
                  <div className="formgroupboxs mb-3 text-start">
                    <label style={{ color: '#475467', fontSize: '14px', marginBottom: '6px' }}>By Date <span className='required'>*</span></label>
                    <Calendar
                      value={payload?.recurring?.end_date || null}
                      onChange={(e) => setPayload((data) => ({ ...data, recurring: { ...data?.recurring, end_date: e.value } }))}
                      showButtonBar
                      placeholder='DD/MM/YY'
                      dateFormat="dd/mm/yy"
                      minDate={payload?.recurring?.start_date || null}
                      locale="en"
                      style={{ height: '46px' }}
                      className='w-100 outline-none border rounded'
                    />
                  </div>
                  : null
            }

            <div className="formgroupboxs mb-3 text-start">
              <label style={{ color: '#475467', fontSize: '14px', marginBottom: '6px' }}>Upfront Projects <span className='required'>*</span></label>
              <Dropdown
                value={payload?.recurring?.upfront_projects || 0}
                onChange={(e) => setPayload((data) => ({ ...data, recurring: { ...data?.recurring, upfront_projects: e.value, initial_projects: 1 } }))}
                options={[
                  { label: "0", value: 0, disabled: maxUpfront < 0 },
                  { label: "1", value: 1, disabled: maxUpfront < 1 },
                  { label: "2", value: 2, disabled: maxUpfront < 2 },
                  { label: "3", value: 3, disabled: maxUpfront < 3 },
                  { label: "4", value: 4, disabled: maxUpfront < 4 },
                  { label: "5", value: 5, disabled: maxUpfront < 5 },
                  { label: "6", value: 6, disabled: maxUpfront < 6 },
                  { label: "7", value: 7, disabled: maxUpfront < 7 },
                  { label: "8", value: 8, disabled: maxUpfront < 8 },
                  { label: "9", value: 9, disabled: maxUpfront < 9 },
                  { label: "10", value: 10, disabled: maxUpfront < 10 },
                  { label: "11", value: 11, disabled: maxUpfront < 11 },
                  { label: "12", value: 12, disabled: maxUpfront < 12 },
                  { label: "13", value: 13, disabled: maxUpfront < 13 },
                  { label: "14", value: 14, disabled: maxUpfront < 14 },
                  { label: "15", value: 15, disabled: maxUpfront < 15 },
                  { label: "16", value: 16, disabled: maxUpfront < 16 },
                  { label: "17", value: 17, disabled: maxUpfront < 17 },
                  { label: "18", value: 18, disabled: maxUpfront < 18 },
                  { label: "19", value: 19, disabled: maxUpfront < 19 },
                  { label: "20", value: 20, disabled: maxUpfront < 20 },
                  { label: "21", value: 21, disabled: maxUpfront < 21 },
                ]}
                style={{ height: '46px', minWidth: '260px' }}
                className="w-100 outline-none"
                placeholder="Select upfront projects"
                filterInputAutoFocus={true}
              />
            </div>

          </div>
        </div>
      }

    </React.Fragment>
  );
});

export default DepartmentQuote;