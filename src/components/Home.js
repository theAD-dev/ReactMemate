import React, { useState, useEffect } from 'react';
import { CheckCircle, PlusLg, ChevronDoubleUp, ChevronDoubleDown, InfoCircle } from "react-bootstrap-icons";
import CountUp from 'react-countup';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
import { getOutgoingEmail } from '../APIs/email-template';
import { fetchHomePage } from "../APIs/HomeApi";
import { fetchProfile } from '../APIs/ProfileApi';
import AccountingContact from './layout/modals/accounting-contact';
import BookkeepingContact from './layout/modals/book-keeping-contact';
import InsuranceContact from './layout/modals/insurance-contact';
import ModalSalesContactFinance from './layout/modals/modal-sales-contact-finance';

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [hasBankDetails, setHasBankDetails] = useState(true);
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
    const [homeData, setHomeData] = useState({
        expense: {},
        invoices_due: {},
        quote_this_week: {},
        active_quotes: {},
        waiting_for_approval: {},
        projects: {}
    });

    const outgoingEmailTemplateQuery = useQuery({
        queryKey: ["getOutgoingEmail"],
        queryFn: getOutgoingEmail
    });
    const isConnectedEmail = outgoingEmailTemplateQuery?.data?.outgoing_email !== 'no-reply@memate.com.au';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchProfile();
                setHasBankDetails(!!data?.bank_detail?.account_number);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        if (!profileData?.bank_details?.account_number) fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchHomePage();
                setHomeData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

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

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div style={{ position: 'relative' }}>
            <Helmet>
                <title>MeMate - Dashboard</title>
            </Helmet>
            <div className='HomePageWrap'>
                <div className="goodHeading" >
                    <h1 style={{ fontSize: '26px' }}>{getGreeting()}, {profileData?.first_name ? profileData.first_name : 'Guest'} 👋</h1>
                </div>
                <div className='d-flex justify-content-center px-5'>
                    <Row className='d-flex flex-nowrap'>
                        {
                            !isConnectedEmail &&
                            <Col style={{ minWidth: '306px' }}>
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
                                        <Link to={"/settings/integrations?openEmail=true"}><Button variant="link">Connected</Button></Link>
                                    </div>
                                </div>
                            </Col>
                        }

                        {
                            !hasBankDetails &&
                            <Col style={{ minWidth: '306px' }}>
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
                                            <span>{isConnectedEmail ? 1 : 2}</span>
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
                        }

                        {/* <Col style={{ minWidth: '306px' }}>
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
                                    <Link to={"/settings/users/desktop"}><Button variant="link">Add Members</Button></Link>
                                </div>
                            </div>
                        </Col>
                        <Col style={{ minWidth: '306px' }}>
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
                                    <Link to="/sales/newquote/selectyourclient"><Button variant="link">Create New Request</Button></Link>
                                </div>
                            </div>
                        </Col> */}
                    </Row>
                </div>
                <Container>

                    <Row className='d-flex flex-nowrap'>
                        <Col className='mt-4'>
                            <div className="bigBoxHome tobePaidWrap" >
                                <div className='TooltipWrapper'>
                                    {['top'].map((placement) => (
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
                                <div className='countNoBox tobePaidH'> <span><CountUp start={0} end={homeData?.expense?.cnt != null ? homeData?.expense?.cnt : 0} duration={10} /></span>
                                </div>
                                <h4>{formatCurrency(homeData?.expense?.sum || 0)}</h4>
                            </div>
                        </Col>
                        <Col className='mt-4'>
                            <div className="bigBoxHome invoiceDuewrap" >
                                <div className='TooltipWrapper'>
                                    {['top'].map((placement) => (
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
                                <div className='countNoBox invoiceDueH'> <span> <CountUp start={0} end={homeData?.invoices_due?.cnt} duration={9} /></span></div>
                                <h4>{formatCurrency(homeData?.invoices_due?.sum)}</h4>
                            </div>
                        </Col>
                    </Row>
                    <Row className='mb-5'>
                        <Col className='mt-4'>
                            <div className="bigBoxHome h-100">
                                <div className='TooltipWrapper'>
                                    {['top'].map((placement) => (
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
                                    <span><CountUp start={0} end={homeData?.quote_this_week?.cnt} duration={2} /></span></div>
                                <h4>{formatCurrency(homeData?.quote_this_week?.sum)}</h4>
                            </div>
                        </Col>
                        <Col className='mt-4'>
                            <div className="bigBoxHome h-100">
                                <div className='TooltipWrapper'>
                                    {['top'].map((placement) => (
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
                                    <Link to="/sales">
                                        <div className='pluslgIcon'> <PlusLg size={20} color="#106B99" /></div></Link>
                                    <span> <CountUp start={0} end={homeData?.active_quotes?.cnt} duration={5} /></span></div>
                                <h4>{formatCurrency(homeData?.active_quotes?.sum)}</h4>
                            </div>
                        </Col>
                        <Col className='mt-4'>
                            <div className="bigBoxHome h-100">
                                <div className='TooltipWrapper'>
                                    {['top'].map((placement) => (
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
                                <div className='countNoBox jobWaitingH'> <span> <CountUp start={0} end={homeData?.waiting_for_approval?.count} duration={8} /></span></div>
                                <h4>{formatCurrency(homeData?.waiting_for_approval?.sum)}</h4>
                            </div>
                        </Col>
                        <Col className='mt-4'>
                            <div className="bigBoxHome h-100">
                                <div className='TooltipWrapper'>
                                    {['top'].map((placement) => (
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
                                    <CountUp start={0} end={homeData?.projects?.cnt} duration={4} />
                                </span></div>
                                <h4>{formatCurrency(homeData?.projects?.sum)}</h4>
                            </div>
                        </Col>
                    </Row>

                </Container>
            </div>

            <div className={`my-component homeBottom ${isVisible ? 'show' : 'hide'}`}>
                <button className='downArrowIcon' style={{ position: 'relative', top: '5px' }} onClick={toggleVisibility}>

                    Additional Services {isVisible ? (
                        <ChevronDoubleUp size={20} color="#6941C6" />
                    ) : (
                        <ChevronDoubleDown size={20} color="#6941C6" />
                    )}
                </button>
                <div className='w-100 mx-auto'>
                    <ul className='pt-4'>
                        <li>
                            <ModalSalesContactFinance />
                        </li>
                        <li>
                            <BookkeepingContact />
                        </li>
                        <li>
                            <InsuranceContact />
                        </li>
                        <li>
                            <AccountingContact />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default Home;