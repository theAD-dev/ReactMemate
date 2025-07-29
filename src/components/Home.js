import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { CheckCircle, PlusLg, ChevronDoubleUp, ChevronDoubleDown, InfoCircle, Check } from "react-bootstrap-icons";
import CountUp from 'react-countup';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
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
import { useTrialHeight } from '../app/providers/trial-height-provider';

const updateTaskStatus = async ({ id, status }) => {
    // Simulate backend call
    return new Promise((resolve) => setTimeout(() => resolve({ id, status }), 500));
};

const initialTasks = [
    { id: 1, title: 'Link Your Email', desc: 'Connect your email to manage communications.', status: 'complete', type: 'Starter' },
    { id: 2, title: 'Enter Bank Details', desc: 'Provide your bank details to secure transactions.', status: 'pending', type: 'Starter' },
    { id: 3, title: 'Check Your Calculators', desc: 'Make sure your pricing calculators are correctly set up and ready to use in quotes.', status: 'pending', type: 'Starter' },
    { id: 4, title: 'Your First Project', desc: 'Start your first project and begin tracking progress.', status: 'pending', type: 'Starter' },
    { id: 5, title: 'Set Up Your Company Profile', desc: 'Set up your company profile and begin tracking progress.', status: 'pending', type: 'Starter' },
    { id: 6, title: 'Set Up Your Invoicing Process', desc: 'Set up your invoicing process and begin tracking progress.', status: 'pending', type: 'Starter' },
];

const Home = () => {
    const { trialHeight } = useTrialHeight();
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
    const [tasks, setTasks] = useState(initialTasks);

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

    const taskMutation = useMutation({
        mutationFn: updateTaskStatus,
        onSuccess: ({ id, status }) => {
            setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
        },
    });

    const handleTaskAction = (id, status) => {
        taskMutation.mutate({ id, status });
    };

    const completedCount = tasks.filter(t => t.status === 'complete').length;
    const progress = Math.round((completedCount / tasks.length) * 100);

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
        <div className='homeDashboardPage' style={{ position: 'relative' }}>
            <Helmet>
                <title>MeMate - Dashboard</title>
            </Helmet>
            <div className='HomePageWrap' style={{ height: `calc(100vh - 149px - ${trialHeight}px)` }}>
                <div className="goodHeading" >
                    <h1 style={{ fontSize: '26px' }}>{getGreeting()}, {profileData?.first_name ? profileData.first_name : 'Guest'} 👋</h1>
                </div>
                {/* My Tasks Card */}
                <div className="myTasksCard" style={{ width: '942px', margin: '0px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '8px', maxHeight: 400, overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div style={{ fontWeight: 600, fontSize: 16, color: '#1D2939', marginBottom: '0px' }}>Let's get you started</div>
                        <Button variant="link" size="sm" style={{ fontWeight: 600, fontSize: 14, color: '#158ECC', textDecoration: 'none', padding: 0, marginRight: 2 }}>New Task <PlusLg size={14} color={"#158ECC"} /></Button>
                    </div>
                    <div style={{ color: '#475467', fontSize: 14, textAlign: 'left', width: '100%', marginBottom: 14 }}>A Few Essential Tasks to Set Up Your Account and Start Using MeMate</div>
                    <div style={{ width: '100%', margin: '0 auto 2px auto', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: 12, background: '#EAECF0', borderRadius: 17, overflow: 'hidden', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: 'radial-gradient(2061.16% 127.06% at -1.24% 2.75%, #1AB2FF 0%, #FFB258 100%)', borderRadius: 4, transition: 'width 0.3s' }}></div>
                        </div>
                        <div style={{ color: '#344054', fontSize: 14, fontWeight: 500, minWidth: 90, textAlign: 'right', margin: '8px 0px 0px 0px' }}>{progress}% Completed</div>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 16, textAlign: 'left', width: '100%', marginBottom: 10 }}>My Tasks</div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
                        {tasks.map((task) => (
                            <li className="dashboardTask" key={task.id} style={{ borderRadius: 8, marginBottom: 8, padding: '6px 24px 6px 16px', display: 'flex', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <div className='gap-2' style={{ display: 'flex', alignItems: 'center', fontWeight: 700, color: '#101828', fontSize: 17 }}>
                                        {task.status === 'complete' ?
                                            <div style={{ border: '3px solid #F2F4F7', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#BAE8FF' }}>
                                                <Check size={16} color="#158ECC" />
                                            </div>
                                            : <div style={{ border: '3px solid #F2F4F7', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                                <Check size={16} />
                                            </div>
                                        }
                                        <div className='d-flex flex-column align-items-start'>
                                            <div className='d-flex gap-2'>
                                                <span className='font-14' style={{ color: '#101828', fontWeight: '500' }}>{task.title}</span>
                                                <div className='d-flex align-items-center gap-1 gradientBorder'>
                                                    <span className='gradientContentText' style={{ color: '#344054', fontWeight: '500', fontSize: 12 }}>Starter</span>
                                                </div>
                                            </div>
                                            <span className='font-14' style={{ color: '#475467', fontWeight: '400' }}>{task.desc}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
                                    {task.status === 'complete' ? (
                                        <Button className='outline-complete-button' onClick={() => handleTaskAction(task.id, 'incomplete')}>
                                            Complete <CheckCircle size={16} color="#079455" />
                                        </Button>
                                    ) : (<div className='d-flex gap-3 hoverButtonHide'>
                                        <Button className='dashboard-text-button-link hover-hide'>Start</Button>
                                        <Button className='dashboard-text-button-link hover-show'>Let's Do it </Button>
                                        <Button className='dashboard-text-button'>Skip</Button>
                                    </div>)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <Container>
                    <Row className='d-flex flex-nowrap'>
                        <Col className='mt-4'>
                            <Link to="/expenses?isShowUnpaid=true">
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
                            </Link>
                        </Col>
                        <Col className='mt-4'>
                            <Link to="/invoices?isShowUnpaid=true">
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
                            </Link>
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
                <button className='downArrowIcon' style={{ position: 'relative', top: '-35px', margin: 'auto' }} onClick={toggleVisibility}>

                    Additional Services {isVisible ? (
                        <ChevronDoubleUp size={20} color="#6941C6" />
                    ) : (
                        <ChevronDoubleDown size={20} color="#6941C6" />
                    )}
                </button>
                <div className='w-100 mx-auto'>
                    <ul className='pt-0'>
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