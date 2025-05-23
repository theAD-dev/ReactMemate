import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Dropdown, Row } from 'react-bootstrap';
import { Calendar3 as CalendarIcon, ClipboardData, Google, InfoSquareFill, PieChart, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Calendar } from 'primereact/calendar';
import { Chart } from 'primereact/chart';
import { getOverviewStatistics } from './api/statistics-api';
import style from './statistics.module.scss';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { formatAUD } from '../../../../shared/lib/format-aud';

const Overview = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const { trialHeight } = useTrialHeight();
    const [type, setType] = useState('Month to Date');
    const [dates, setDates] = useState([startOfMonth, today]);
    const [range, setRange] = useState('Previous year');

    const overviewQuery = useQuery({
        queryKey: ["getOverviewStatistics", dates[0], dates[1]],
        queryFn: () => getOverviewStatistics(dates[0], dates[1]),
        enabled: !!dates,
        retry: 1
    });
    console.log('overviewQuery: ', overviewQuery.data);

    useEffect(() => {
        if (type === 'Month to Date') {
            setDates([startOfMonth, today]);
        } else if (type === 'Last Month') {
            const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
            setDates([lastMonth, lastMonthEnd]);
        } else if (type === 'Last 7 Days') {
            const last7Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
            setDates([last7Days, today]);
        } else if (type === 'Last 4 Weeks') {
            const last4Weeks = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 28);
            setDates([last4Weeks, today]);
        } else if (type === 'Last 12 Months') {
            const last12Months = new Date(today.getFullYear() - 1, today.getMonth(), 1);
            setDates([last12Months, today]);
        }
    }, [type]);

    // Sample data based on the image with 12 months
    const reportsData = {
        grossVolume: { value: 1402.50, change: 38.28, date: 'Feb 26, 2024', prevValue: 1014.38 },
        activeQuotesVolume: { value: 47, change: null, date: 'Feb 26, 2024', prevValue: 26.48, auto: 485.00 },
        orders: { value: 1, change: 0.0, date: 'Feb 26, 2024', prevValue: 1014.38 },
        unpaidInvoicesVolume: { value: 3444.69, change: 38.28, date: 'Feb 26, 2024', prevValue: 1014.38 },
        spendPerOrder: { value: 0.00, change: null, date: 'Feb 26, 2024', prevValue: 1014.38 },
        jobsCompleted: { value: 0, change: 0.0, date: 'Feb 26, 2024', prevValue: 1014.38 },
        contractorExpense: { value: 3444.69, change: null, date: 'Feb 26, 2024', prevValue: 0.00 },
    };

    const [grossVolumeChartData, setGrossVolumeChartData] = useState({});
    const [activeQuotesChartData, setActiveQuotesChartData] = useState({});
    const [ordersChartData, setOrdersChartData] = useState({});
    const [unpaidInvoicesChartData, setUnpaidInvoicesChartData] = useState({});
    const [spendPerOrderChartData, setSpendPerOrderChartData] = useState({});
    const [jobsCompletedChartData, setJobsCompletedChartData] = useState({});
    const [contractorExpenseChartData, setContractorExpenseChartData] = useState({});

    useEffect(() => {
        const documentStyle = window.getComputedStyle(document.documentElement);
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#475467';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#E0E0E0';

        // Common chart configuration
        const baseOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: { display: false },
                title: { display: false },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        callback: function (value) {
                            const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            return value === 0 ? labels[0] : value === labels.length - 1 ? labels[labels.length - 1] : '';
                        },
                        padding: 10,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: { display: false },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
            elements: {
                line: {
                    tension: 0, // Matches the curved line in the image
                    borderWidth: 2,
                },
                point: {
                    radius: 0, // Hide data points to match minimalist design
                },
            },
        };

        // Gross Volume Chart
        const grossVolumeData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Gross Volume',
                    data: [1014.38, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1375, 1390, 1400, 1402.50],
                    fill: true,
                    tension: 0,
                    borderColor: '#1AB2FF', // Blue line to match the image
                    backgroundColor: getGradient('#1AB2FF', 0.2, 0.04), // Light blue gradient
                },
            ],
        };
        setGrossVolumeChartData({ ...grossVolumeData, options: baseOptions });

        // Active Quotes Volume Chart
        const activeQuotesData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Active Quotes',
                    data: [26.48, 30, 35, 38, 40, 42, 44, 45, 46, 46.5, 47, 47],
                    fill: true,
                    tension: 0,
                    borderColor: '#1AB2FF',
                    backgroundColor: getGradient('#1AB2FF', 0.2, 0.04),
                },
            ],
        };
        setActiveQuotesChartData({ ...activeQuotesData, options: baseOptions });

        // Orders Chart
        const ordersData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Orders',
                    data: [1014.38, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50, 1],
                    fill: true,
                    tension: 0,
                    borderColor: '#1AB2FF',
                    backgroundColor: getGradient('#1AB2FF', 0.2, 0.04),
                },
            ],
        };
        setOrdersChartData({ ...ordersData, options: baseOptions });

        // Unpaid Invoices Volume Chart
        const unpaidInvoicesData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Unpaid Invoices',
                    data: [1014.38, 1200, 1400, 1600, 1800, 2000, 2200, 2500, 2800, 3000, 3200, 3444.69],
                    fill: true,
                    tension: 0,
                    borderColor: '#1AB2FF',
                    backgroundColor: getGradient('#1AB2FF', 0.2, 0.04),
                },
            ],
        };
        setUnpaidInvoicesChartData({ ...unpaidInvoicesData, options: baseOptions });

        // Spend per Order Chart
        const spendPerOrderData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Spend per Order',
                    data: [1014.38, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50, 0.00],
                    fill: true,
                    tension: 0,
                    borderColor: '#1AB2FF',
                    backgroundColor: getGradient('#1AB2FF', 0.2, 0.04),
                },
            ],
        };
        setSpendPerOrderChartData({ ...spendPerOrderData, options: baseOptions });

        // Jobs Completed Chart
        const jobsCompletedData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Jobs Completed',
                    data: [1014.38, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50, 0],
                    fill: true,
                    tension: 0,
                    borderColor: '#1AB2FF',
                    backgroundColor: getGradient('#1AB2FF', 0.2, 0.04),
                },
            ],
        };
        setJobsCompletedChartData({ ...jobsCompletedData, options: baseOptions });

        // Contractor Expense Chart
        const contractorExpenseData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Contractor Expense',
                    data: [0, 500, 1000, 1500, 2000, 2500, 3000, 3200, 3300, 3400, 3422, 3444.69],
                    fill: true,
                    tension: 0,
                    borderColor: '#1AB2FF',
                    backgroundColor: getGradient('#1AB2FF', 0.2, 0.04),
                },
            ],
        };
        setContractorExpenseChartData({ ...contractorExpenseData, options: baseOptions });
    }, []);

    // Gradient function
    const getGradient = (color, startOpacity, endOpacity) => {
        const ctx = document.createElement('canvas').getContext('2d');
        if (!ctx) return `rgba(${hexToRgb(color)}, ${startOpacity})`;

        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, `rgba(${hexToRgb(color)}, ${startOpacity})`);
        gradient.addColorStop(1, `rgba(${hexToRgb(color)}, ${endOpacity})`);
        return gradient;
    };

    // Helper to convert hex to RGB
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    };

    return (
        <>
            <Helmet>
                <title>MeMate - Overview</title>
            </Helmet>
            <div className={`topbar ${style.borderTopbar}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                {/* Executive */}
                <Link to="/statistics/executive" className={clsx('d-flex align-items-center px-2 py-1')}>
                    <PieChart color='#9E77ED' size={16} className='me-2' />
                    <span className={style.topbartext}>Executive</span>
                </Link>
                {/* Sales Conversion - disabled */}
                <Link to="/statistics/sales-conversion" className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <Speedometer2 color='#17B26A' size={16} className='me-2' />
                    <span className={style.topbartext}>Conversion</span>
                </Link>
                {/* Overview - (current page) */}
                <Link to="/statistics/overview" style={{ background: "#FEF3F2" }} className={clsx(style.activeTab, 'd-flex align-items-center px-2 py-1')}>
                    <TextParagraph color='#F04438' size={16} className='me-2' />
                    <span className={style.topbartext} style={{ color: "#F04438" }}>Overview</span>
                </Link>
                {/* Key Results - enabled */}
                <Link to="/statistics/key-results" className='d-flex align-items-center px-2 py-1'>
                    <WindowDesktop color='#667085' size={16} className='me-2' />
                    <span className={style.topbartext}>Key Results</span>
                </Link>
                {/* Reports - disabled */}
                <Link to={"#"} className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <ClipboardData color='#084095' size={16} className='me-2' />
                    <span className={style.topbartext}>Reports</span>
                </Link>
                {/* GA Widgets - disabled */}
                <Link to={"#"} className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <Google color='#F79009' size={16} className='me-2' />
                    <span className={style.topbartext}>GA Widgets</span>
                </Link>
            </div>

            <div className={clsx(style.keyResults)} style={{ padding: "24px", marginBottom: '20px', overflow: 'auto', height: `calc(100vh - 175px - ${trialHeight}px)`, background: '#F8F9FC', position: 'relative' }}>
                <h2 className={clsx(style.keyResultsTitle)}>Reports Overview</h2>

                <div className={clsx(style.dateRangeSelector)}>
                    <div className='d-flex align-items-center'>
                        <Dropdown>
                            <Dropdown.Toggle as={Button} className={clsx(style.button, style.borderRadiusRightZero, "outline-button mx-auto")}>
                                <span style={{ color: '#344054', fontWeight: 600 }}>{type}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    key={'Month to Date'}
                                    eventKey={'Month to Date'}
                                    active={type === 'Month to Date'}
                                    onClick={() => setType('Month to Date')}
                                >
                                    Month to Date
                                </Dropdown.Item>
                                <Dropdown.Item
                                    key={'Last Month'}
                                    eventKey={'Last Month'}
                                    active={type === 'Last Month'}
                                    onClick={() => setType('Last Month')}
                                >
                                    Last Month
                                </Dropdown.Item>
                                <Dropdown.Item
                                    key={'Last 7 Days'}
                                    eventKey={'Last 7 Days'}
                                    active={type === 'Last 7 Days'}
                                    onClick={() => setType('Last 7 Days')}
                                >
                                    Last 7 Days
                                </Dropdown.Item>
                                <Dropdown.Item
                                    key={'Last 4 Weeks'}
                                    eventKey={'Last 4 Weeks'}
                                    active={type === 'Last 4 Weeks'}
                                    onClick={() => setType('Last 4 Weeks')}
                                >
                                    Last 4 Weeks
                                </Dropdown.Item>
                                <Dropdown.Item
                                    key={'Last 12 Months'}
                                    eventKey={'Last 12 Months'}
                                    active={type === 'Last 12 Months'}
                                    onClick={() => setType('Last 12 Months')}
                                >
                                    Last 12 Months
                                </Dropdown.Item>
                                <Dropdown.Item
                                    key={'Custom'}
                                    eventKey={'Custom'}
                                    active={type === 'Custom'}
                                    onClick={() => setType('Custom')}
                                >
                                    Custom
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <div style={{ position: 'relative', marginTop: '16px' }}>
                            <CalendarIcon color='#475467' size={16} style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }} />
                            <Calendar
                                value={dates}
                                onChange={(e) => setDates(e.value)}
                                selectionMode="range"
                                readOnlyInput
                                disabled={type !== 'Custom'}
                                hideOnRangeSelection
                                numberOfMonths={2}
                                className={clsx(style.calendar)}
                                dateFormat='dd M yy'
                            />
                        </div>

                    </div>


                    <div className='mt-3'>Compared to </div>

                    <Dropdown>
                        <Dropdown.Toggle as={Button} className={clsx(style.button, "outline-button mx-auto")}>
                            <span style={{ color: '#344054', fontWeight: 600 }}>{range}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                key={'Previous year'}
                                eventKey={'Previous year'}
                                active={range === 'Previous year'}
                                onClick={() => setRange('Previous year')}
                            >
                                Previous year
                            </Dropdown.Item>
                            <Dropdown.Item
                                key={'Previous month'}
                                eventKey={'Previous month'}
                                active={range === 'Previous month'}
                                onClick={() => setRange('Previous month')}
                            >
                                Previous month
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <Card className='rounded-0 border-0'>
                    <Card.Body className='p-0'>
                        <Row className='p-0 m-0 w-100'>
                            {/* Gross Volume */}
                            <Col sm={4} className='border-top border-left border-right' style={{ height: '340px', padding: '20px' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Gross Volume</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={style.changePositive}>{reportsData.grossVolume.change}%</span>
                                    </div>
                                    <span className={style.dateLabel}>{reportsData.grossVolume.date}<br /> ${reportsData.grossVolume.prevValue}</span>
                                </div>
                                <div className={style.value}>${formatAUD(reportsData.grossVolume.value)}</div>
                                <Chart type="line" data={grossVolumeChartData} options={grossVolumeChartData.options} style={{ height: '200px' }} />
                            </Col>

                            {/* Active Quotes Volume */}
                            <Col sm={4} className='border-top' style={{ height: '340px', padding: '20px', position: 'relative' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Active Quotes Volume</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={style.changeNeutral}>{reportsData.activeQuotesVolume.change || 'N/A'}</span>
                                    </div>
                                    <span className={style.dateLabel}>{reportsData.activeQuotesVolume.date} <br />${reportsData.activeQuotesVolume.prevValue}</span>
                                </div>
                                <div className={style.value}>{formatAUD(reportsData.activeQuotesVolume.value)}</div>
                                <Chart type="line" data={activeQuotesChartData} options={activeQuotesChartData.options} style={{ height: '200px' }} />
                            </Col>

                            {/* Orders */}
                            <Col sm={4} className='border-top border-right border-left' style={{ height: '340px', padding: '20px' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Orders</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={style.changeNeutral}>{reportsData.orders.change}%</span>
                                    </div>
                                    <span className={style.dateLabel}>{reportsData.orders.date} <br /> ${reportsData.orders.prevValue}</span>
                                </div>
                                <div className={style.value}>{formatAUD(reportsData.orders.value)}</div>
                                <Chart type="line" data={ordersChartData} options={ordersChartData.options} style={{ height: '200px' }} />
                            </Col>

                            {/* Unpaid Invoices Volume */}
                            <Col sm={4} className='border' style={{ height: '340px', padding: '20px' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Unpaid Invoices Volume</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={style.changePositive}>{reportsData.unpaidInvoicesVolume.change}%</span>
                                    </div>
                                    <span className={style.dateLabel}>{reportsData.unpaidInvoicesVolume.date} <br /> ${reportsData.unpaidInvoicesVolume.prevValue}</span>
                                </div>
                                <div className={style.value}>${formatAUD(reportsData.unpaidInvoicesVolume.value)}</div>
                                <Chart type="line" data={unpaidInvoicesChartData} options={unpaidInvoicesChartData.options} style={{ height: '200px' }} />
                            </Col>

                            {/* Spend per Order */}
                            <Col sm={4} className='border-top border-bottom' style={{ height: '340px', padding: '20px' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Spend per Order</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={style.changeNeutral}>{reportsData.spendPerOrder.change || 'N/A'}</span>
                                    </div>

                                    <span className={style.dateLabel}>{reportsData.spendPerOrder.date}<br /> ${reportsData.spendPerOrder.prevValue}</span>
                                </div>
                                <div className={style.value}>${formatAUD(reportsData.spendPerOrder.value)}</div>
                                <Chart type="line" data={spendPerOrderChartData} options={spendPerOrderChartData.options} style={{ height: '200px' }} />
                            </Col>

                            {/* Jobs Completed */}
                            <Col sm={4} className='border' style={{ height: '340px', padding: '20px' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Job Completed </span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={style.changeNeutral}>{reportsData.jobsCompleted.change}%</span>
                                    </div>

                                    <span className={style.dateLabel}>{reportsData.jobsCompleted.date}<br /> ${reportsData.jobsCompleted.prevValue}</span>
                                </div>
                                <div className={style.value}>{formatAUD(reportsData.jobsCompleted.value)}%</div>
                                <Chart type="line" data={jobsCompletedChartData} options={jobsCompletedChartData.options} style={{ height: '200px' }} />
                            </Col>

                            {/* Contractor Expense */}
                            <Col sm={4} className='border' style={{ height: '340px', padding: '20px' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Contractor Expense</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                    </div>

                                    <span className={style.dateLabel}>{reportsData.contractorExpense.date} <br /> ${reportsData.contractorExpense.prevValue}</span>
                                </div>
                                <div className={style.value}>${formatAUD(reportsData.contractorExpense.value)}</div>
                                <Chart type="line" data={contractorExpenseChartData} options={contractorExpenseChartData.options} style={{ height: '200px' }} />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

export default Overview;