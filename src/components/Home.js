import React, { useState, useEffect, useRef } from 'react';
import { Placeholder } from 'react-bootstrap';
import { CheckCircle, PlusLg, ChevronDoubleUp, ChevronDoubleDown, InfoCircle, Check, Link as LinkIcon, X, ArrowBarLeft, ArrowRight, ArrowUpShort, Dash, BoxArrowUpLeft, ArrowsAngleExpand } from "react-bootstrap-icons";
import CountUp from 'react-countup';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Row from 'react-bootstrap/Row';
import Tooltip from 'react-bootstrap/Tooltip';
import { toast } from 'sonner';
import { getOutgoingEmail } from '../APIs/email-template';
import { fetchHomePage } from "../APIs/HomeApi";
import { fetchProfile } from '../APIs/ProfileApi';
import { getListOfTasks } from '../APIs/task-api';
import { TaskCompleteJob } from '../APIs/TasksApi';
import { dateFormat } from './Business/shared/utils/helper';
import AccountingContact from './layout/modals/accounting-contact';
import BookkeepingContact from './layout/modals/book-keeping-contact';
import InsuranceContact from './layout/modals/insurance-contact';
import ModalSalesContactFinance from './layout/modals/modal-sales-contact-finance';
import { useAuth } from '../app/providers/auth-provider';
import { useTrialHeight } from '../app/providers/trial-height-provider';
import joshImage from '../assets/images/Avatar.png';
import NOTaskSVG from '../assets/svg/no-task';
import RequestHelp from '../features/dashboard/request-help/request-help';
import SkipSetup from '../features/dashboard/skip-setup/skip-setup';
import CreateTask from './Work/features/task/create-task/create-task';
import ViewTaskModal from './Work/features/task/view-task/view-task';

const Home = () => {
    const { session } = useAuth();
    const observerRef = useRef(null);
    const { trialHeight } = useTrialHeight();
    const navigate = useNavigate();
    const [tasksLoading, setTasksLoading] = useState(true);
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [viewTask, setViewTask] = useState(false);
    const [taskId, setTaskId] = useState(null);
    const [completingTask, setCompletingTask] = useState({ id: null, isCompleting: false });
    const [visible, setVisible] = useState(false);
    const [isMinimize, setMinimize] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showSkipSetup, setShowSkipSetup] = useState(false);
    const [hasBankDetails, setHasBankDetails] = useState(true);
    const [showRequestDemo, setShowRequestDemo] = useState(false);
    const profileData = JSON.parse(window.localStorage.getItem('profileData') || '{}');
    const [homeData, setHomeData] = useState({
        expense: {},
        invoices_due: {},
        quote_this_week: {},
        active_quotes: {},
        waiting_for_approval: {},
        projects: {}
    });

    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const limit = 25;

    const loadData = async (pageToLoad = page, reset = false) => {
        setTasksLoading(true);
        const data = await getListOfTasks(pageToLoad, limit, '', '', false, true);
        if (reset) {
            setTasks(data.results);
        } else {
            setTasks(prev => {
                const existingIds = new Set(prev.map(item => item.id));
                const newData = data.results.filter(item => !existingIds.has(item.id));
                return [...prev, ...newData];
            });
        }
        const totalLoaded = reset ? data.results.length : tasks.length + data.results.length;
        setHasMoreData(totalLoaded < data.count);
        setTasksLoading(false);
    };

    useEffect(() => {
        loadData(page);
    }, [page]);

    const refetchTasks = async () => {
        setPage(1);
        await loadData(1, true);
    };

    useEffect(() => {
        if (tasks.length > 0 && hasMoreData) {
            const timeout = setTimeout(() => {
                const lastRow = document.querySelector('.tasks-container li.dashboardTask:last-child');

                if (lastRow) {
                    observerRef.current = new IntersectionObserver(entries => {
                        if (entries[0].isIntersecting) {
                            setPage(prevPage => prevPage + 1);
                        }
                    });
                    observerRef.current.observe(lastRow);
                }
            }, 1000); // Wait for DOM paint

            return () => {
                clearTimeout(timeout);
                if (observerRef.current) observerRef.current.disconnect();
            };
        }
    }, [tasks, hasMoreData]);

    const completeTaskMutation = useMutation({
        mutationFn: (taskId) => TaskCompleteJob(taskId, true),
        onSuccess: () => {
            refetchTasks();
            toast.success(`Task completed successfully`);
        },
        onError: (error) => {
            console.error('Error updating task:', error);
            toast.error(`Failed to complete task. Please try again.`);
        }
    });
    const handleTaskAction = async (id) => {
        setCompletingTask({ id, isCompleting: true });
        await completeTaskMutation.mutateAsync(id);
        setCompletingTask({ id: null, isCompleting: false });
    };
    const viewTaskDetails = (id) => {
        setViewTask(true);
        setTaskId(id);
    };






    // Week navigation
    const [currentWeek, setCurrentWeek] = useState(null);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const goToPreviousWeek = () => {
        if (currentWeek > 1) {
            setCurrentWeek(currentWeek - 1);
        } else {
            setCurrentYear(currentYear - 1);
            setCurrentWeek(52);
        }
    };
    const getWeekNumber = (date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    const isNextButtonDisabled = () => {
        // Check if next week button should be disabled
        const currentDate = new Date();
        const currentYearNum = currentDate.getFullYear();

        // Disable if we're in a future year
        if (currentYear > currentYearNum) {
            return true;
        }

        // Disable if we're in the current year and at or beyond the current week
        if (currentYear === currentYearNum) {
            const currentWeekNum = getWeekNumber(currentDate);
            if (currentWeek >= currentWeekNum) {
                return true;
            }
        }

        return false;
    };

    const goToNextWeek = () => {
        // Don't proceed if button is disabled
        if (isNextButtonDisabled()) {
            return;
        }

        // Normal week navigation logic
        if (currentWeek < 52) {
            setCurrentWeek(currentWeek + 1);
        } else {
            setCurrentYear(currentYear + 1);
            setCurrentWeek(1);
        }
    };

    useEffect(() => {
        const today = new Date();
        const weekNum = getWeekNumber(today);
        setCurrentWeek(weekNum);
    }, []);

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

    const initialTasks = [
        { id: 1, title: 'Link Your Email', desc: 'Connect your email to manage communications.', status: isConnectedEmail ? 'complete' : 'pending', type: 'Starter', link: '/settings/integrations?openEmail=true' },
        { id: 2, title: 'Enter Bank Details', desc: 'Provide your bank details to secure transactions.', status: hasBankDetails ? 'complete' : 'pending', type: 'Starter', link: '/settings/generalinformation/bank-details' },
    ];

    const completedCount = initialTasks.filter(t => t.status === 'complete').length;
    const progress = Math.round((completedCount / initialTasks.length) * 100) || 0;

    useEffect(() => {
        if (progress < 100) {
            if (localStorage.getItem('skipSetup') == "false" || !localStorage.getItem('skipSetup')) {
                setVisible(true);
            }
        }
    }, [progress]);

    const handleCloseInitialSetup = () => {
        setVisible(false);
        setShowSkipSetup(true);
    };

    return (
        <div className='homeDashboardPage' style={{ position: 'relative' }}>
            <Helmet>
                <title>MeMate - Dashboard</title>
            </Helmet>
            <div className='HomePageWrap' style={{ height: `calc(100vh - 95px - ${trialHeight}px)` }}>
                <div className="goodHeading" >
                    <h1 style={{ fontSize: '26px' }}>{getGreeting()}, {profileData?.first_name ? profileData.first_name : 'Guest'} 👋</h1>
                </div>
                {/* My Tasks Card */}
                <div className="myTasksCard" style={{ width: '942px', margin: '0px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '8px' }}>
                    <div className='d-flex justify-content-between w-100 mb-3'>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>My Tasks</div>
                        <Button variant="link" onClick={() => setShowCreateTask(true)} size="sm" style={{ fontWeight: 600, fontSize: 14, color: '#158ECC', textDecoration: 'none', padding: 0, marginRight: 2, display: 'flex', alignItems: 'center', gap: 4 }}>New Task <PlusLg size={14} color={"#158ECC"} /></Button>
                    </div>
                    <ul className='tasks-container' style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%', maxHeight: 270, overflowY: 'auto' }}>
                        {tasks.map((task) => (
                            <li className="dashboardTask cursor-pointer" onClick={() => viewTaskDetails(task.id)} key={task.id} style={{ borderRadius: 8, marginBottom: 8, padding: '6px 24px 6px 16px', display: 'flex', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '70%' }}>
                                    <div className='gap-2' style={{ display: 'flex', alignItems: 'center', fontWeight: 700, color: '#101828', fontSize: 17 }}>
                                        {task.finished ?
                                            <div style={{ border: '1px solid #F2F4F7', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#BAE8FF' }}>
                                                <Check size={16} color="#158ECC" />
                                            </div>
                                            : <div style={{ border: '1px solid #F2F4F7', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#F2F4F7' }}>
                                                <Check size={16} />
                                            </div>
                                        }
                                        <div className='d-flex flex-column align-items-start'>
                                            <div className='font-14 ellipsis-width' style={{ color: '#101828', fontWeight: '500', maxWidth: '565px' }}>{task.title}</div>
                                            <span className='font-14 ellipsis-width' style={{ color: '#475467', fontWeight: '400', maxWidth: '565px' }}>{task.description}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 'auto' }}>
                                    <span className='d-flex gap-2 me-2 text-nowrap'>
                                        <LinkIcon size={16} color="#1AB2FF" />
                                        <span
                                            className="font-12"
                                            style={{
                                                fontWeight: '400',
                                                color: new Date(+task?.to_date * 1000).getTime() < Date.now() ? '#DC6803' : '#475467',
                                            }}
                                        >
                                            {dateFormat(task?.to_date)}
                                            {new Date(task?.to_date).getTime() < Date.now()}
                                        </span>
                                    </span>
                                    <Button className='outline-complete-button' disabled={completingTask.isCompleting && completingTask.id === task.id} onClick={(e) => { e.stopPropagation(); handleTaskAction(task.id); }}>
                                        Complete
                                        {completingTask.isCompleting && completingTask.id === task.id ? (
                                            <ProgressSpinner style={{ width: '16px', height: '16px' }} />
                                        ) : (<>
                                            <CheckCircle size={16} color="#079455" />
                                        </>)}
                                    </Button>
                                </div>
                            </li>
                        ))}
                        {tasksLoading && <>
                            <Placeholder as="p" animation="wave" style={{ marginBottom: '4px', borderRadius: '8px' }}>
                                <Placeholder xs={12} bg="secondary" style={{ height: '56px', width: '100%', }} size='lg' />
                            </Placeholder>
                            <Placeholder as="p" animation="wave" style={{ marginBottom: '4px', borderRadius: '8px' }}>
                                <Placeholder xs={12} bg="secondary" style={{ height: '56px', width: '100%', }} size='lg' />
                            </Placeholder>
                            <Placeholder as="p" animation="wave" style={{ marginBottom: '4px', borderRadius: '8px' }}>
                                <Placeholder xs={12} bg="secondary" style={{ height: '56px', width: '100%', }} size='lg' />
                            </Placeholder>
                            <Placeholder as="p" animation="wave" style={{ marginBottom: '4px', borderRadius: '8px' }}>
                                <Placeholder xs={12} bg="secondary" style={{ height: '56px', width: '100%', }} size='lg' />
                            </Placeholder>
                        </>}
                        {!tasksLoading && tasks.length === 0 && (
                            <div style={{ position: 'relative', top: '-30px' }}>
                                <NOTaskSVG />
                            </div>
                        )}
                    </ul>
                </div>

                <div className='d-none'>
                    <div className='d-flex gap-3' style={{ width: '942px', margin: '16px auto' }}>
                        <div className='d-flex flex-column gap-2 justify-content-center'>
                            <span style={{ fontSize: '14px', color: '#344054', fontWeight: 600, whiteSpace: 'nowrap' }}>Your Weekly Activity</span>
                            <div className='d-flex align-items-center justify-content-between gap-2' style={{ color: '#344054', height: '36px', padding: "6px 12px", border: '1px solid #EAECF0', borderRadius: '46px', whiteSpace: 'nowrap' }}>
                                <button
                                    className='border-0'
                                    style={{
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        opacity: 1
                                    }}
                                    onClick={goToPreviousWeek}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.35355 1.80514C8.54882 2.0004 8.54882 2.31698 8.35355 2.51224L2.70711 8.15869L8.35355 13.8051C8.54882 14.0004 8.54882 14.317 8.35355 14.5122C8.15829 14.7075 7.84171 14.7075 7.64645 14.5122L1.64645 8.51224C1.45118 8.31698 1.45118 8.0004 1.64645 7.80514L7.64645 1.80514C7.84171 1.60988 8.15829 1.60988 8.35355 1.80514Z" fill="#344054" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12.3536 1.80514C12.5488 2.0004 12.5488 2.31698 12.3536 2.51224L6.70711 8.15869L12.3536 13.8051C12.5488 14.0004 12.5488 14.317 12.3536 14.5122C12.1583 14.7075 11.8417 14.7075 11.6464 14.5122L5.64645 8.51224C5.45118 8.31698 5.45118 8.0004 5.64645 7.80514L11.6464 1.80514C11.8417 1.60988 12.1583 1.60988 12.3536 1.80514Z" fill="#344054" />
                                    </svg>
                                </button>
                                <span className='font-14'>Week {currentWeek} </span>
                                <button
                                    className='border-0'
                                    style={{
                                        background: 'transparent',
                                        cursor: isNextButtonDisabled() ? 'not-allowed' : 'pointer',
                                        opacity: isNextButtonDisabled() ? 0.5 : 1
                                    }}
                                    onClick={goToNextWeek}
                                    disabled={isNextButtonDisabled()}
                                    aria-disabled={isNextButtonDisabled()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3.64645 1.80514C3.84171 1.60988 4.15829 1.60988 4.35355 1.80514L10.3536 7.80514C10.5488 8.0004 10.5488 8.31698 10.3536 8.51224L4.35355 14.5122C4.15829 14.7075 3.84171 14.7075 3.64645 14.5122C3.45118 14.317 3.45118 14.0004 3.64645 13.8051L9.29289 8.15869L3.64645 2.51224C3.45118 2.31698 3.45118 2.0004 3.64645 1.80514Z" fill="#344054" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M7.64645 1.80514C7.84171 1.60988 8.15829 1.60988 8.35355 1.80514L14.3536 7.80514C14.5488 8.0004 14.5488 8.31698 14.3536 8.51224L8.35355 14.5122C8.15829 14.7075 7.84171 14.7075 7.64645 14.5122C7.45118 14.317 7.45118 14.0004 7.64645 13.8051L13.2929 8.15869L7.64645 2.51224C7.45118 2.31698 7.45118 2.0004 7.64645 1.80514Z" fill="#344054" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className='d-flex flex-column justify-content-center align-items-start' style={{ width: '256px', border: '1px solid #EAECF0', borderRadius: 6, padding: '8px 32px' }}>
                            <span style={{ fontSize: '14px', color: '#344054', fontWeight: 600 }}>Email Sent</span>
                            <div className='d-flex gap-1 align-items-center'>
                                <span style={{ fontSize: '30px', color: '#98A2B3', fontWeight: 600 }}>256</span>
                                <ArrowUpShort size={16} color="#067647" />
                                <span className='font-14' style={{ color: '#067647', fontWeight: 500 }}>20%</span>
                            </div>
                        </div>
                        <div className='d-flex flex-column justify-content-center align-items-start' style={{ width: '256px', border: '1px solid #EAECF0', borderRadius: 6, padding: '8px 32px' }}>
                            <span style={{ fontSize: '14px', color: '#344054', fontWeight: 600 }}>Quotes Won</span>
                            <div className='d-flex gap-1 align-items-center'>
                                <span style={{ fontSize: '30px', color: '#98A2B3', fontWeight: 600 }}>32</span>
                                <ArrowUpShort size={16} color="#067647" />
                                <span className='font-14' style={{ color: '#067647', fontWeight: 500 }}>20%</span>
                            </div>
                        </div>
                        <div className='d-flex flex-column justify-content-center align-items-start' style={{ width: '256px', border: '1px solid #EAECF0', borderRadius: 6, padding: '8px 32px' }}>
                            <span style={{ fontSize: '14px', color: '#344054', fontWeight: 600 }}>New Customers</span>
                            <div className='d-flex gap-1 align-items-center'>
                                <span style={{ fontSize: '30px', color: '#98A2B3', fontWeight: 600 }}>15</span>
                                <ArrowUpShort size={16} color="#067647" />
                                <span className='font-14' style={{ color: '#067647', fontWeight: 500 }}>20%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Container style={{ maxWidth: '965px', margin: '0px auto' }}>
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
                                        <div className='pluslgIcon'> <PlusLg size={20} color="#106B99" /></div>
                                    </Link>
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
                                                    Total Amount and Value of all quotes Won this week
                                                </Tooltip>
                                            }
                                        >
                                            <Button><InfoCircle size={16} color="#cdcfd2" /> </Button>
                                        </OverlayTrigger>
                                    ))}
                                </div>
                                <div className='d-flex align-items-center gap-2 mx-auto' style={{ width: 'fit-content' }}>
                                    <h3 className='mb-0'>Quotes Won</h3>
                                    <div style={{ border: '1px solid #D0D5DD', borderRadius: '24px', padding: '2px 12px', fontSize: '10px' }}>{new Date().toLocaleString('default', { month: 'long' })}</div>
                                </div>
                                <div className='countNoBox activeQouteH'>
                                    <Link to="/sales">
                                        <div className='pluslgIcon'> <PlusLg size={20} color="#106B99" /></div>
                                    </Link>
                                    <span>
                                        <CountUp start={0} end={0} duration={4} />
                                    </span>
                                </div>
                                <h4>{formatCurrency(0)}</h4>
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
                                <div className='countNoBox ActiveProjectH'>
                                    <Link to="/sales">
                                        <div className='pluslgIcon'> <PlusLg size={20} color="#106B99" /></div>
                                    </Link>
                                    <span><CountUp start={0} end={homeData?.projects?.cnt} duration={4} /></span>
                                </div>
                                <h4>{formatCurrency(homeData?.projects?.sum)}</h4>
                            </div>
                        </Col>

                        {session?.has_work_subscription && (<>
                            <Col className='mt-4'>
                                <div className="bigBoxHome h-100">
                                    <div className='TooltipWrapper'>
                                        {['top'].map((placement) => (
                                            <OverlayTrigger
                                                key={placement}
                                                placement={placement}
                                                overlay={
                                                    <Tooltip className='TooltipOverlay' id={`tooltip-${placement}`}>
                                                        Total number of all jobs created this month, including those in progress, completed, and waiting for approval.
                                                    </Tooltip>
                                                }
                                            >
                                                <Button><InfoCircle size={16} color="#cdcfd2" /> </Button>
                                            </OverlayTrigger>
                                        ))}
                                    </div>
                                    <div className='d-flex align-items-center gap-2 mx-auto' style={{ width: 'fit-content' }}>
                                        <h3 className='mb-0'>Total Jobs </h3>
                                        <div style={{ border: '1px solid #D0D5DD', borderRadius: '24px', padding: '2px 12px', fontSize: '10px' }}>{new Date().toLocaleString('default', { month: 'long' })}</div>
                                    </div>
                                    <div className='countNoBox ActiveProjectH'>
                                        <Link to="/work/jobs">
                                            <div className='pluslgIcon'><PlusLg size={20} color="#106B99" /></div>
                                        </Link>
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
                                                        Total Amount and Value of all Jobs and Time sheets waiting for approval by Employee and Contractors
                                                    </Tooltip>
                                                }
                                            >
                                                <Button><InfoCircle size={16} color="#cdcfd2" /> </Button>
                                            </OverlayTrigger>
                                        ))}
                                    </div>
                                    <h3>Job waiting for approval</h3>
                                    <div className='countNoBox jobWaitingH'>
                                        <Link to="/work/approval">
                                            <div className='pluslgIcon'><PlusLg size={20} color="#106B99" /></div>
                                        </Link>
                                        <span> <CountUp start={0} end={homeData?.waiting_for_approval?.count} duration={8} /></span>
                                    </div>
                                    <h4>{formatCurrency(homeData?.waiting_for_approval?.sum)}</h4>
                                </div>
                            </Col>
                        </>)}
                    </Row>

                </Container>

                <div className='p-3 d-flex align-items-center gap-2 cursor-pointer' onClick={() => setShowRequestDemo(true)}>
                    <div className='outline-button ms-5 p-0' style={{ width: '46px', height: '46px', overflow: 'hidden' }}>
                        <img src={joshImage} alt='Josh' className='w-100 h-100' />
                    </div>
                    <div className='d-flex flex-column justify-content-center mt-1'>
                        <span className='font-14 text-left'>Need help with this?</span>
                        <Link to={"#"} style={{ color: '#158ECC' }}>Book a call with Josh <ArrowRight size={16} color="#158ECC" /></Link>
                    </div>
                </div>
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

            <Dialog headerClassName='p-1 border-0' contentClassName='pb-0' visible={visible} position={'bottom-right'} style={{ width: `${isMinimize ? '706px' : '706px'}`, height: `${isMinimize ? '68px' : 'auto'}`, boxShadow: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)', border: '1px solid #1AB2FF' }} closable={false} onHide={handleCloseInitialSetup} draggable={false} resizable={false} modal={false}>
                {isMinimize ? (
                    <div className='pt-1 d-flex justify-content-between align-items-center w-100'>
                        <div className='d-flex justify-content-center align-items-center gap-4 pb-1 h-100'>
                            <div style={{ fontWeight: 600, fontSize: 16, color: '#1D2939', marginBottom: '0px', whiteSpace: 'nowrap' }}>Let's get you started</div>
                            <div style={{ width: '289px', height: 12, background: '#EAECF0', borderRadius: 17, overflow: 'hidden', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: 'linear-gradient(to right, #4db8ff, #ffaa40)', borderRadius: 4, transition: 'width 0.3s' }}></div>
                            </div>
                        </div>
                        <div className='d-flex mb-3 align-items-center justify-content-end gap-2 w-100'>
                            <Button className='close-button' onClick={() => setMinimize(false)}>
                                <ArrowsAngleExpand size={12} color="#344054" />
                            </Button>
                            <Button className='close-button' onClick={handleCloseInitialSetup}>
                                <X size={20} color="#344054" />
                            </Button>
                        </div>
                    </div>) : (
                    <div className='p-3'>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <div style={{ fontWeight: 600, fontSize: 16, color: '#1D2939', marginBottom: '0px' }}>Let's get you started</div>
                            <div className='d-flex align-items-center gap-2'>
                                <Button className='close-button' onClick={() => setMinimize(true)}>
                                    <Dash size={20} color="#344054" />
                                </Button>
                                <Button className='close-button' onClick={handleCloseInitialSetup}>
                                    <X size={20} color="#344054" />
                                </Button>
                            </div>
                        </div>
                        <div style={{ color: '#475467', fontSize: 14, textAlign: 'left', width: '100%', marginBottom: 14 }}>A Few Essential Tasks to Set Up Your Account and Start Using MeMate</div>
                        <div style={{ width: '100%', margin: '0 auto 5px auto', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: 12, background: '#EAECF0', borderRadius: 17, overflow: 'hidden', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, background: 'linear-gradient(to right, #4db8ff, #ffaa40)', borderRadius: 4, transition: 'width 0.3s' }}></div>
                            </div>
                            <div style={{ color: '#344054', fontSize: 14, fontWeight: 500, minWidth: 90, textAlign: 'right', margin: '8px 0px 0px 0px' }}>{progress}% Completed</div>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%', maxHeight: 270, overflowY: 'auto' }}>
                            {initialTasks.map((task) => (
                                <li className="dashboardTask border cursor-pointer" onClick={() => navigate(task.link)} key={task.id} style={{ borderRadius: 8, marginBottom: 8, padding: '6px 24px 6px 16px', display: 'flex', alignItems: 'center' }}>
                                    <div className='gap-2' style={{ display: 'flex', alignItems: 'center', fontWeight: 700, color: '#101828', fontSize: 17 }}>
                                        {task.status === 'complete' ?
                                            <div style={{ border: '1px solid #F2F4F7', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#BAE8FF' }}>
                                                <Check size={16} color="#158ECC" />
                                            </div>
                                            : <div style={{ border: '1px solid #F2F4F7', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#F2F4F7' }}>
                                                <Check size={16} />
                                            </div>
                                        }
                                        <div className='d-flex flex-column align-items-start'>
                                            <div className='d-flex align-items-center gap-2'>
                                                <span className='font-14 ellipsis-width' style={{ color: '#101828', fontWeight: '500', maxWidth: '100%' }}>{task.title}</span>
                                                <div className='starterBadge'>Starter</div>
                                            </div>
                                            <span className='font-14 ellipsis-width' style={{ color: '#475467', fontWeight: '400', maxWidth: '100%' }}>{task.desc}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Dialog>
            <CreateTask show={showCreateTask} setShow={setShowCreateTask} refetch={refetchTasks} />
            <ViewTaskModal view={viewTask} setView={setViewTask} taskId={taskId} setTaskId={setTaskId} reInitialize={refetchTasks} />
            <RequestHelp visible={showRequestDemo} setVisible={setShowRequestDemo} />
            <SkipSetup visible={showSkipSetup} setVisible={setShowSkipSetup} progress={progress} />
        </div>
    );
};
export default Home;