import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import classNames from 'classnames';
import { CheckCircle,PlusLg ,ChevronDoubleUp,ChevronDoubleDown,InfoCircle} from "react-bootstrap-icons";
import homeboxImg01 from "../assets/images/img/homeboxImg01.png";
import homeboxImg02 from "../assets/images/img/homeboxImg02.png";
import homeboxImg03 from "../assets/images/img/homeboxImg03.png";
import homeboxImg04 from "../assets/images/img/homeboxImg04.png";
import { fetchHomePage } from "../APIs/HomeApi";
import { fetchProfile } from "../APIs/ProfileApi";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link } from 'react-router-dom';




import CountUp from 'react-countup';
import ModalSalesContactFinance from './layout/modals/modal-sales-contact-finance';
import BookkeepingContact from './layout/modals/book-keeping-contact';
import InsuranceContact from './layout/modals/insurance-contact';
import AccountingContact from './layout/modals/accounting-contact';
const Home = () => {
    const [selectedOption, setSelectedOption] = useState('');
    const [profileData, setProfileData] = useState(null);
    
    const [homeData, setHomeData] = useState({
       
        expense: {},
        invoices_due: {},
        quote_this_week: {},
        active_quotes: {},
        waiting_for_approval: {},
        projects: {}
    });
    useEffect(() => {       
        const fetchData = async () => {
            try {
                const result = await fetchHomePage();
                setHomeData(JSON.parse(result));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
    
      const fetchData = async () => {
        try {
          const data = await fetchProfile();
          const parsedData = JSON.parse(data);
          setProfileData(parsedData);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
  
     fetchData();
    }, []);

    const formatter = (value) => `${value}`;

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const formatCurrency = (value) => {
        if (value !== undefined && value !== null) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        } else {
            return 'N/A'; // Or any default value you prefer
        }
    };


    const [isVisible, setIsVisible] = useState(true);

    const toggleVisibility = () => {
      setIsVisible(!isVisible);
    };

  return (
    <>
    <div className='HomePageWrap'>
    <div className="goodHeading" >
        <h1>Hi, {profileData ? profileData.full_name : 'Guest'} 👋</h1>
    </div>
    <Container>
    <Row>
                <Col>
                    <div className={classNames('grid-item', { 'active': selectedOption === 'option1' })}>
                        <label>
                            <input
                                type="radio"
                                value="option1"
                                checked={selectedOption === 'option1'}
                                onChange={handleOptionChange}
                            />
                            <div className='boxCheckNo'>
                              <div className='ckeckIcon'><CheckCircle size={16} color="#1AB2FF" /></div>
                              <span>1</span>
                             </div>
                            <div className='boxItem'>
                                <h2>Link Your Email</h2>
                                <p>Connect your email to manage communications.</p>
                            </div>
                           
                        </label>
                        <div className='boxItemBut'>
                                <Button variant="link">Connected</Button>
                            </div>
                    </div>
                </Col>
               <Col>
                    <div className={classNames('grid-item', { 'active': selectedOption === 'option2' })}>
                        <label>
                        <input
                                type="radio"
                                value="option2"
                                checked={selectedOption === 'option2'}
                                onChange={handleOptionChange}
                            />
                            <div className='boxCheckNo'>
                            <div className='ckeckIcon'><CheckCircle size={16} color="#1AB2FF" /></div>
                              <span>2</span>
                             </div>
                            <div className='boxItem'>
                                <h2>Enter Bank Details</h2>
                                <p>Provide your bank details to secure transactions.</p>
                            </div>
                            
                        </label>
                        <div className='boxItemBut'>
                                <Link to="/settings/generalinformation/bank-details"><Button variant="link">Add Details</Button></Link>
                            </div>
                    </div>
                </Col>
                <Col>
                    <div className={classNames('grid-item', { 'active': selectedOption === 'option3' })}>
                        <label>
                            <input
                                type="radio"
                                value="option3"
                                checked={selectedOption === 'option3'}
                                onChange={handleOptionChange}
                            />
                            <div className='boxCheckNo'>
                            <div className='ckeckIcon'><CheckCircle size={16} color="#1AB2FF" /></div>
                              <span>3</span>
                             </div>
                            <div className='boxItem'>
                                <h2>Add Team Details</h2>
                                <p>Add team members and define roles for efficiency.</p>
                            </div>
                            
                        </label>
                        <div className='boxItemBut'>
                                <Button variant="link">Add Members</Button>
                            </div>
                    </div>
                </Col>
                <Col>
                    <div className={classNames('grid-item', { 'active': selectedOption === 'option4' })}>
                        <label>
                        <input
                                type="radio"
                                value="option4"
                                checked={selectedOption === 'option4'}
                                onChange={handleOptionChange}
                            />
                            <div className='boxCheckNo'>
                            <div className='ckeckIcon'>
                                <CheckCircle size={16} color="#1AB2FF" /> 
                                
                                </div>
                              <span>4</span>
                             </div>
                            <div className='boxItem'>
                                <h2>Your First Project</h2>
                                <p>Start your first project and begin tracking progress.</p>
                            </div> 
                        </label>
                        <div className='boxItemBut'>
                                <Link to="/sales/newquote/selectyourclient/step1"><Button variant="link">Create New Request</Button></Link>
                            </div>
                    </div>
                </Col>
            </Row>
      <Row className='mt-4'>
                <Col>
                <div className="bigBoxHome tobePaidWrap" >
                    <div className='TooltipWrapper'>
                    {['top-end'].map((placement) => (
                        <OverlayTrigger 
                        key={placement}
                        placement={placement}
                        overlay={
                            <Tooltip className='TooltipOverlay' id={`tooltip-${placement}`}>
                            Number and Total value of all expenses to be paid
                            </Tooltip>
                        }
                        >
                        <Button><InfoCircle size={16} color="#cdcfd2" /> </Button>
                        </OverlayTrigger>
                    ))} 
                     </div>
                    <h3>Expense to be paid</h3>
                    <div className='countNoBox tobePaidH'> <span><CountUp start={0} end={homeData.expense.cnt!=null?homeData.expense.cnt:0} duration={10} /></span>
                    </div>
                     <h4>{formatCurrency(homeData.expense.sum || 0)}</h4>
                </div>
                </Col>
                <Col>
                <div className="bigBoxHome invoiceDuewrap" >
                <div className='TooltipWrapper'>
                    {['top-end'].map((placement) => (
                        <OverlayTrigger 
                        key={placement}
                        placement={placement}
                        overlay={
                            <Tooltip className='TooltipOverlay' id={`tooltip-${placement}`}>
                            Number and value of all Invoices which are due to be paid.
                            </Tooltip>
                        }
                        >
                        <Button><InfoCircle size={16} color="#cdcfd2" /> </Button>
                        </OverlayTrigger>
                    ))} 
                     </div>
                    <h3>Invoices Due</h3>
                    <div className='countNoBox invoiceDueH'> <span> <CountUp start={0} end={homeData.invoices_due.cnt} duration={9} /></span></div>
                        <h4>{formatCurrency(homeData.invoices_due.sum)}</h4>
                </div>
                </Col>
                </Row>
      <Row className='mt-4'>
                <Col>
                <div className="bigBoxHome" >
                <div className='TooltipWrapper'>
                    {['top-end'].map((placement) => (
                        <OverlayTrigger 
                        key={placement}
                        placement={placement}
                        overlay={
                            <Tooltip className='TooltipOverlay' id={`tooltip-${placement}`}>
                            Total Amount and Value of all quotes Won this week
                            </Tooltip>
                        }
                        >
                        <Button><InfoCircle size={16} color="#cdcfd2" /> </Button>
                        </OverlayTrigger>
                    ))} 
                     </div>
                    <h3>Jobs scheduled this week</h3>
                    <div className='countNoBox jobScheduledH'>
                    <div className='pluslgIcon'><PlusLg size={20} color="#106B99" /></div>
                         <span><CountUp start={0} end={homeData.quote_this_week.cnt} duration={2} /></span></div>
                        <h4>{formatCurrency(homeData.quote_this_week.sum)}</h4>
                </div>
                </Col>
                <Col>
                <div className="bigBoxHome" >
                <div className='TooltipWrapper'>
                    {['top-end'].map((placement) => (
                        <OverlayTrigger 
                        key={placement}
                        placement={placement}
                        overlay={
                            <Tooltip className='TooltipOverlay' id={`tooltip-${placement}`}>
                            Summary of all Quotes in Sales excluding status Draft and Declined
                            </Tooltip>
                        }
                        >
                        <Button><InfoCircle size={16} color="#cdcfd2" /> </Button>
                        </OverlayTrigger>
                    ))} 
                     </div>
                    <h3>Active Quotes</h3>
                    <div className='countNoBox activeQouteH'> 
                    <Link to="/tasks">
                    <div className='pluslgIcon'> <PlusLg size={20} color="#106B99" /></div></Link>
                    <span> <CountUp start={0} end={homeData.active_quotes.cnt} duration={5} /></span></div>
                        <h4>{formatCurrency(homeData.active_quotes.sum)}</h4>
                </div>
                </Col>
                <Col>
                <div className="bigBoxHome" >
                <div className='TooltipWrapper'>
                    {['top-end'].map((placement) => (
                        <OverlayTrigger 
                        key={placement}
                        placement={placement}
                        overlay={
                            <Tooltip className='TooltipOverlay' id={`tooltip-${placement}`}>
                            Total Amount and Value of all Jobs and Timesheets waiting for approval by Employe and Contractors
                            </Tooltip>
                        }
                        >
                        <Button><InfoCircle size={16} color="#cdcfd2" /> </Button>
                        </OverlayTrigger>
                    ))} 
                     </div>
                    <h3>Job waiting for approval</h3>
                    <div className='countNoBox jobWaitingH'> <span> <CountUp start={0} end={homeData.waiting_for_approval.count} duration={8} /></span></div>
                        <h4>{formatCurrency(homeData.waiting_for_approval.sum)}</h4>
                </div>
                </Col>
                <Col>
                <div className="bigBoxHome" >
                <div className='TooltipWrapper'>
                    {['top-end'].map((placement) => (
                        <OverlayTrigger 
                        key={placement}
                        placement={placement}
                        overlay={
                            <Tooltip className='TooltipOverlay' id={`tooltip-${placement}`}>
                            Total of all projects in Management
                            </Tooltip>
                        }
                        >
                        <Button><InfoCircle size={16} color="#cdcfd2" /> </Button>
                        </OverlayTrigger>
                    ))} 
                     </div>
                    <h3>Active Projects</h3>
                    <div className='countNoBox ActiveProjectH'> <span> 
                    <CountUp start={0} end={homeData.projects.cnt} duration={4} />
                        {/* <CountUp start={0} end={homeData.projects.cnt} duration={4} formattingFn={formatter}  /> */}
                        </span></div>
                        <h4>{formatCurrency(homeData.projects.sum)}</h4>
                </div>
                </Col>
               
            
                </Row>
 
    </Container>
    </div>
 
    <div className={`my-component homeBottom ${isVisible ? 'show' : 'hide'}`}>
    <button className='downArrowIcon' onClick={toggleVisibility}>
        
    Additional Services {isVisible ? (
          <ChevronDoubleUp size={20} color="#6941C6" />
        ) : (
          <ChevronDoubleDown size={20} color="#6941C6" />
        )}
      </button>
        <Container>
        <ul className='pt-4'>
              
                <li>
                   <div className="imageBoxHome" style={{
                        backgroundImage: `url(${homeboxImg01})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        }} >
                      <div className='textOverly'>
                     <h3>Finance</h3>
                  <Button variant="link">
                    <ModalSalesContactFinance />
                  </Button>
                  </div>
                </div>
                </li>
                <li>
                   <div className="imageBoxHome" style={{
                        backgroundImage: `url(${homeboxImg02})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        }} >
                      <div className='textOverly'>
                     <h3>Bookkeeping</h3>
                  <Button variant="link">
                    <BookkeepingContact />
                  </Button>
                  </div>
                </div>
                </li>
                <li>
                   <div className="imageBoxHome" style={{
                        backgroundImage: `url(${homeboxImg03})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        }} >
                      <div className='textOverly'>
                     <h3>Insurance</h3>
                  <Button variant="link"><InsuranceContact /></Button>
                  </div>
                </div>
                </li>
                <li>
                   <div className="imageBoxHome" style={{
                        backgroundImage: `url(${homeboxImg04})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        }} >
                      <div className='textOverly'>
                     <h3>Accounting</h3>
                  <Button variant="link"><AccountingContact /></Button>
                  </div>
                </div>
                </li>
                
                </ul>
        </Container>
    </div>
    </>
  )
}
export default Home