import React, { useState ,useEffect} from 'react';
import { ChevronLeft,PlusSlashMinus ,InfoCircle,Telephone} from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CustomRadioButton from './CustomRadioButton';
import QuoteTable from './QuoteTable';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import dayjs from 'dayjs';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import CustomOption from './CustomOption';
import Select1 from 'react-select';
import { useLocation } from 'react-router-dom';
// import { fetchCalcIndexes } from "../../../../../APIs/ReferencesApi";
import { newQuoteClientListids } from "../../../../../APIs/NewQuoteApis";
import DepartmentQuote from './department-quote';

const colourOptions = [
  { value: 'red', label: 'Red', image: 'https://dev.memate.com.au/media/no_org.png' },
  { value: 'green', label: 'Green', image: 'https://dev.memate.com.au/media/no_org.png' },
  { value: 'blue', label: 'Blue', image: 'https://dev.memate.com.au/media/no_org.png ' },
  // Add more options here
];
const Calculation = () => {
  const [itemList, setItemList] = useState([]);
  const [selectedValue, setSelectedValue] = useState('Standard');
  const [paymentterms, setPaymentTerms] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState('The Creative Business');
  const [abn, setAbn] = useState('78 167 098 704');
  const [phone, setPhone] = useState('+61 299660414');
  const [address, setAddress] = useState('Unit 5 84 Reserve Rd. Artarmon NSW 2064');
  const [contactName, setContactName] = useState('Paul Stein1 / Manager');
  const [position, setPosition] = useState('Manager');
  const [contactPhone, setContactPhone] = useState('+61458987490');
  const [contactEmail, setContactEmail] = useState('personal@email.com');
  
  const [value, setValue] = useState(dayjs());
  const handleRadioChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const location = useLocation();
  const  {id}  = location.state;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await newQuoteClientListids(id);
        setItemList(response);
      } catch (error) {
        console.error('Error fetching client list:', error);
      }
    };

    fetchData();
  }, []);

  const [tempCompany, setTempCompany] = useState(company);
  const [tempAbn, setTempAbn] = useState(abn);
  const [tempPhone, setTempPhone] = useState(phone);
  const [tempAddress, setTempAddress] = useState(address);
  const [tempContactName, setTempContactName] = useState(contactName);
  const [tempContactTitle, setTempContactTitle] = useState(position);
  const [tempContactPhone, setTempContactPhone] = useState(contactPhone);
  const [tempContactEmail, setTempContactEmail] = useState(contactEmail);

  const handleEdit = () => {
    setIsEditing(true);
    
  };

  const handleSave = () => {
    setCompany(tempCompany);
    setAbn(tempAbn);
    setPhone(tempPhone);
    setAddress(tempAddress);
    setContactName(tempContactName);
    setPosition(tempContactTitle);
    setContactPhone(tempContactPhone);
    setContactEmail(tempContactEmail);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempCompany(company);
    setTempAbn(abn);
    setTempPhone(phone);
    setTempAddress(address);
    setTempContactName(contactName);
    setTempContactTitle(position);
    setTempContactPhone(contactPhone);
    setTempContactEmail(contactEmail);
    setIsEditing(false);
  };
  
  return (
    <div className="calMainWrap">
 


      <Row  className="mainHead justify-content-md-center align-items-center">
        <Col sm={4} className='text-start'>
          <div className="newQuoteBack">
            <button>
              <NavLink to="/sales/newquote/client-information/step1">
                <ChevronLeft color="#000000" size={20} /> Go Back
              </NavLink>
            </button>
          </div>
        </Col>
        <Col sm={4} className="text-center textMidde">
          <h2><PlusSlashMinus color="#1D2939" size={16} /> Calculate a Quote</h2>
        </Col>
        <Col sm={4} className='text-end'>
          <div className="radio-buttons">
            <CustomRadioButton
              label="Standard"
              name="customRadio"
              value="Standard"
              checked={selectedValue === 'Standard'}
              onChange={handleRadioChange}
            />
            <CustomRadioButton
              label="Recurring"
              name="customRadio"
              value="Recurring"
              checked={selectedValue === 'Recurring'}
              onChange={handleRadioChange}
            />
            <CustomRadioButton
              label="Subscription"
              name="customRadio"
              value="Subscription"
              checked={selectedValue === 'Subscription'}
              onChange={handleRadioChange}
            />
            <CustomRadioButton
              label="Retainer"
              name="customRadio"
              value="Retainer"
              checked={selectedValue === 'Retainer'}
              onChange={handleRadioChange}
            />
          </div>
        </Col>
      </Row>
      <div className='calScrollSec'>
        <Row className='boxGreyBox calStyleBox01'>
          <Col sm={8} className='text-start'>
            <h3>Reference 
            <div className='TooltipWrapper'>
                    {['top-end'].map((placement) => (
                        <OverlayTrigger 
                        key={placement}
                        placement={placement}
                        overlay={
                            <Tooltip className='TooltipOverlay' id={`tooltip-${placement}`}>
                            Number and Total value of all expenses to be paid
                            </Tooltip>}>
                        <button><InfoCircle color="#667085" size={16} /></button>
                        </OverlayTrigger>
                    ))} 
                     </div>
              </h3>
            <p>Website Redesign and Development</p>
            <h3>Description</h3>
            <p>{itemList.description}</p>
          </Col>
          <Col sm={4} className='QuoteToborder text-start'>
            <h3>Quote To 
            <div className='TooltipWrapper'>
                    {['top-end'].map((placement) => (
                        <OverlayTrigger 
                        key={placement}
                        placement={placement}
                        overlay={
                            <Tooltip className='TooltipOverlay' id={`tooltip-${placement}`}>
                            Number and Total value of all expenses to be paid
                            </Tooltip>}>
                        <button><InfoCircle color="#667085" size={16} /></button>
                        </OverlayTrigger>
                    ))} 
                    </div></h3>
            <Row>
              <Col sm={6} className='text-start'>
              <h5>Company</h5>
              {isEditing ? (
              <ul>
                <li>
                <div className="formgroup mb-2">
                    <div className={`inputInfo `}>
                    <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                      <Select
                       value={company}
                       onChange={(e) => setCompany(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        IconComponent={KeyboardArrowDownIcon} >
                        <MenuItem value="Business Name">
                        Business Name
                        </MenuItem>
                        <MenuItem value={1} data-value="1">1</MenuItem>
                        <MenuItem value={2} data-value="2">2</MenuItem>
                      </Select>
                    </FormControl>
                    </div>
                  </div>
               </li>
                <li><input type="text" value={itemList.abn} onChange={(e) => setAbn(e.target.value)} /></li>
                <li><input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} /></li>
                <li>
                <div className={`inputInfo `}>
                <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                      <Select
                       value={address}
                       onChange={(e) => setCompany(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        IconComponent={KeyboardArrowDownIcon}  >
                        <MenuItem value="Loacation1">
                        Loacation1
                        </MenuItem>
                        <MenuItem value={1} data-value="1">1</MenuItem>
                        <MenuItem value={2} data-value="2">2</MenuItem>
                      </Select>
                    </FormControl>
                    </div>
                    </li>
              </ul>
            ) : (
              <ul>
                <li>{itemList.name}</li>
                <li>ABN: {itemList.abn}</li>
                <li>{itemList.phone}<Telephone color="#9E77ED" size={16} /></li>
                <li>{itemList.address}</li>
              </ul>
            )}
              </Col>
              <Col sm={6} className='text-start'>
              <h5>Main Contact</h5>
              {isEditing ? (
              <ul>
                <li>
                <div className={`inputInfo `}>
                    <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                      <Select
                       value={contactName}
                       onChange={(e) => setCompany(e.target.value)}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        IconComponent={KeyboardArrowDownIcon} >
                        <MenuItem value={`${itemList.firstname} ${itemList.lastname}`}>
                         Paul Stein1 / Manager
                        </MenuItem>
                        <MenuItem value={1} data-value="1">1</MenuItem>
                        <MenuItem value={2} data-value="2">2</MenuItem>
                      </Select>
                    </FormControl>
                    </div></li>
                <li><input type="text" value={itemList.position} onChange={(e) => setPosition(e.target.value)} /></li>
                <li><input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} /></li>
                <li><input type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} /></li>
              </ul>
            ) : (
              <ul>
                <li>{itemList.firstname} {itemList.lastname}</li>
                <li>{itemList.position}</li>
                <li>{itemList.phone}</li>
                <li>{itemList.email}</li>
              </ul>
            )}
              </Col>
            </Row>
            <button onClick={isEditing ? handleSave : handleEdit}>
          {isEditing ? 'Save' : 'Edit info'}
           </button>
           {isEditing && <button onClick={handleCancel} className='ms-2'>Cancel</button>}
          </Col>
        </Row>
        <Row className='boxGreyBox mt-3 calStyleBox01'>
          <Col sm={12} className='text-start'>
        
             <DepartmentQuote />
             {/* <QuoteTable/> */}
    
          </Col>
        </Row>
        <Row className='boxGreyBox mt-3 quoteInvoice'>
          <Col sm={6} className='text-start'>
          <div className="formgroup">
                    <label>Notes on the quote/invoice</label>
                    <div className={`inputInfo1`}>
                      <textarea
                        rows={4}
                        name='company_description'
                        placeholder="Enter the detailed quote for the client contract here. Include all relevant information such as project scope, 
                        deliverables, timelines, costs, payment terms, and any special conditions. Ensure the quote is clear, comprehensive, and 
                        aligns with the client's requirements and expectations."/>
                    </div>
                  </div>
          </Col>
          <Col sm={3} className='text-start'>
          <div className="formgroup formgroupSelect mb-2 mt-3">
                    <label>Project Manager</label>
                    <div className={`inputInfo `}>
                    <Select1
                    isMulti
                    name="colors"
                    options={colourOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    components={{ Option: CustomOption }}/>
                    </div>
                  </div>

              <div className="formgroup mt-3">
                    <label>PO</label>
                    <div className={`inputInfo `}>
                    <input
                        type="text"
                        name="company_name"
                        placeholder='Purchase Order #'
                        // value={company_name}
                        // onChange={(e) => {
                        //   setCompanyname(e.target.value);
                        // }}
                      />
                    </div>
                  </div>
              <div className="formgroup mb-2 mt-3">
                    <label>Amounts are</label>
                    <div className={`inputInfo `}>
                    <FormControl className='customerCategory' sx={{ m: 0, minWidth: `100%` }}>
                      <Select
                        value={paymentterms}
                        onChange={(e) => {
                          setPaymentTerms(e.target.value);
                        }}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        IconComponent={KeyboardArrowDownIcon} 
                      >
                        <MenuItem value="">
                        Tax exclusive
                        </MenuItem>
                        <MenuItem value={1} data-value="1">1</MenuItem>
                        <MenuItem value={2} data-value="2">2</MenuItem>
                      </Select>
                    </FormControl>
                    </div>
                  </div>  
          </Col>
          <Col  sm={3}>
          <div className="radio-buttons mt-5">
            <CustomRadioButton
              label={<><b>Request Payment </b> <span> Create an invoice requesting <br></br>payment on a specific date</span></>}
              name="customRadio"
              value="Standard1"
              checked={selectedValue === 'Standard1'}
              onChange={handleRadioChange}
            />
           <CustomRadioButton
            label={<><b>Autocharge Customer </b> <span> Automatically charge a payment<br></br> method on file</span></>}
            name="customRadio"
            value="Recurring1"
            checked={selectedValue === 'Recurring1'}
            onChange={handleRadioChange}
          />
          </div>
          <div className='toggle-switch-wrap'>
            <label className="toggle-switch">
            <input type="checkbox" />
            <span className="switch" />
          </label>
          <em>Display Discounts</em>
          </div>
          </Col>
        </Row>
      </div>
      <div className='footerCalAction'>
        <Row className='rowWrapTop  '>
          <Col sm={5} className='text-start'>
            <ul className='left'>
              <li><span>Budget</span><p>$ 12,240.00</p></li>
              <li className='budgetColor'><span>Operational Profit</span><p>$ 8,200.00</p></li>
            </ul>
          </Col>
          <Col sm={7} className='text-end'>
          <ul className='right'>
              <li><span>Subtotal</span><p>$ 1,351.00</p></li>
              <li><span>Tax ( 10% ) </span><p>$ 1,250.42</p></li>
              <li className='total'><span>Total </span><p>$ 28,200.00</p></li>
            </ul>
          </Col>
        </Row>
        <Row className='calActionBottom mt-3 '>
          <Col sm={5} className='text-start'>
          <ul className='left'>
              <li className='cancel'><button>Cancel</button></li>
              <li className='invoicePDF'><NavLink to="">Invoice PDF</NavLink></li>
            </ul>
          </Col>
          <Col sm={7} className='text-end'>
          <ul className='right'>
          <li className='SaveDraftBut'><button>Save Draft</button></li>
          <li className='SaveButtonCal'><button>Save</button></li>
          <li className='SaveandSendBut'><button>Save and Send</button></li>
            </ul>
          </Col>
        </Row>
        </div>
    </div>
  );
};

export default Calculation;
