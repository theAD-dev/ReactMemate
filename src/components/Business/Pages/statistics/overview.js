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
import Loader from '../../../../shared/ui/loader/loader';

const Overview = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const { trialHeight } = useTrialHeight();
    const [type, setType] = useState('Month to Date');
    const [dates, setDates] = useState([startOfMonth, today]);
    const [range, setRange] = useState('Previous month');

    const overviewQuery = useQuery({
        queryKey: ["getOverviewStatistics", dates[0], dates[1]],
        queryFn: () => getOverviewStatistics(dates[0], dates[1]),
        enabled: !!dates,
        retry: 1
    });

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

    const [grossVolumeChartData, setGrossVolumeChartData] = useState({});
    const [activeQuotesChartData, setActiveQuotesChartData] = useState({});
    const [ordersChartData, setOrdersChartData] = useState({});
    const [unpaidInvoicesChartData, setUnpaidInvoicesChartData] = useState({});
    const [spendPerOrderChartData, setSpendPerOrderChartData] = useState({});
    const [jobsCompletedChartData, setJobsCompletedChartData] = useState({});
    const [contractorExpenseChartData, setContractorExpenseChartData] = useState({});

    useEffect(() => {
        if (!overviewQuery.data) return;

        const documentStyle = window.getComputedStyle(document.documentElement);
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary') || '#475467';
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border') || '#E0E0E0';

        const getPreviousPeriodDateLabel = (currentDate) => {
            const date = new Date(currentDate);
            if (range === 'Previous year') {
                date.setFullYear(date.getFullYear() - 1);
            } else if (range === 'Previous month') {
                date.setMonth(date.getMonth() - 1);
            }
            return date.toISOString().slice(0, 10); // Format as YYYY-MM-DD
        };

        const formatMonthYear = (date) => {
            return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
        };

        const labels = overviewQuery.data.gross_volume.current_data.map(d => d.date);

        const baseOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: { display: false },
                title: { display: false },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#fff',
                    titleColor: '#667085',
                    bodyColor: '#667085',
                    borderColor: '#f2f2f2',
                    borderWidth: 1,
                    callbacks: {
                        title: function (tooltipItems) {
                            return tooltipItems[0].label; // Display date like 2025-05-08
                        },
                        label: function (tooltipItem) {
                            const datasetLabel = tooltipItem.dataset.label; // "This Year" or "Last Year"
                            const value = tooltipItem.raw; // The value for the hovered dataset
                            const prevDate = getPreviousPeriodDateLabel(tooltipItem.label);
                            return `${datasetLabel} (${(datasetLabel === 'This Year' || datasetLabel === 'This Month') ? tooltipItem.label : prevDate}): $${formatAUD(value)}`;
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                elements: {
                    line: {
                        borderWidth: 2,
                    },
                    point: {
                        radius: 4,
                    },
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        callback: function (value, index, values) {
                            if (index === 0) {
                                return formatMonthYear(new Date(labels[0]));
                            } else if (index === values.length - 1) {
                                return formatMonthYear(new Date(labels[labels.length - 1]));
                            }
                            return '';
                        },
                        padding: 10,
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0,
                        maxTicksLimit: labels.length,
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
                    tension: 0,
                    borderWidth: 2,
                },
                point: {
                    radius: 0,
                    hoverRadius: 5,
                    hitRadius: 10,
                },
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
        };

        const createChartData = (key) => {
            const currentData = overviewQuery.data[key].current_data || [];
            const previousData = overviewQuery.data[key].previous_data || [];

            // Validate and map data, default to 0 if invalid
            const thisYearData = currentData.map(d => {
                const value = parseFloat(d.value);
                return isNaN(value) ? 0 : value;
            });
            const lastYearData = previousData.map(d => {
                const value = parseFloat(d.value);
                return isNaN(value) ? 0 : value;
            });

            return {
                labels: currentData.map(d => d.date),
                datasets: [
                    {
                        label: range === 'Previous year' ? 'This Year' : 'This Month',
                        data: thisYearData,
                        fill: true,
                        tension: 0,
                        borderColor: '#1AB2FF',
                        backgroundColor: getGradient('#1AB2FF', 0.2, 0.04),
                        borderWidth: 2,
                    },
                    {
                        label: range === 'Previous year' ? 'Last Year' : 'Last Month',
                        data: lastYearData,
                        fill: false, // No fill for Last Year to avoid overlap
                        tension: 0,
                        borderColor: '#EAECF0', // Gray for Last Year
                        borderWidth: 2,
                    },
                ],
            };
        };

        setGrossVolumeChartData({ ...createChartData('gross_volume', 'Gross Volume'), options: baseOptions });
        setActiveQuotesChartData({ ...createChartData('active_quotes', 'Active Quotes'), options: baseOptions });
        setOrdersChartData({ ...createChartData('orders', 'Orders'), options: baseOptions });
        setUnpaidInvoicesChartData({ ...createChartData('unpaid_invoices', 'Unpaid Invoices'), options: baseOptions });
        setSpendPerOrderChartData({ ...createChartData('spend_per_order', 'Spend per Order'), options: baseOptions });
        setJobsCompletedChartData({ ...createChartData('jobs_completed', 'Jobs Completed'), options: baseOptions });
        setContractorExpenseChartData({ ...createChartData('contractor_expense', 'Contractor Expense'), options: baseOptions });
    }, [overviewQuery.data, range]);

    const getGradient = (color, startOpacity, endOpacity) => {
        const ctx = document.createElement('canvas').getContext('2d');
        if (!ctx) return `rgba(${hexToRgb(color)}, ${startOpacity})`;

        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, `rgba(${hexToRgb(color)}, ${startOpacity})`);
        gradient.addColorStop(1, `rgba(${hexToRgb(color)}, ${endOpacity})`);
        return gradient;
    };

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0, 0, 0';
    };

    const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous * 100).toFixed(2);
    };

    const formatDateForLabel = (date) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const getPreviousPeriodDate = () => {
        const startDate = new Date(dates[0]);
        if (range === 'Previous year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
        } else if (range === 'Previous month') {
            startDate.setMonth(startDate.getMonth() - 1);
        }
        return formatDateForLabel(startDate);
    };

    const reportsData = overviewQuery.data ? {
        grossVolume: {
            value: parseFloat(overviewQuery.data.gross_volume.current_total),
            change: calculateChange(
                parseFloat(overviewQuery.data.gross_volume.current_total),
                parseFloat(overviewQuery.data.gross_volume.previous_total)
            ),
            date: getPreviousPeriodDate(),
            prevValue: parseFloat(overviewQuery.data.gross_volume.previous_total)
        },
        activeQuotesVolume: {
            value: parseFloat(overviewQuery.data.active_quotes.current_total),
            change: calculateChange(
                parseFloat(overviewQuery.data.active_quotes.current_total),
                parseFloat(overviewQuery.data.active_quotes.previous_total)
            ),
            date: getPreviousPeriodDate(),
            prevValue: parseFloat(overviewQuery.data.active_quotes.previous_total)
        },
        orders: {
            value: parseFloat(overviewQuery.data.orders.current_total),
            change: calculateChange(
                parseFloat(overviewQuery.data.orders.current_total),
                parseFloat(overviewQuery.data.orders.previous_total)
            ),
            date: getPreviousPeriodDate(),
            prevValue: parseFloat(overviewQuery.data.orders.previous_total)
        },
        unpaidInvoicesVolume: {
            value: parseFloat(overviewQuery.data.unpaid_invoices.current_total),
            change: calculateChange(
                parseFloat(overviewQuery.data.unpaid_invoices.current_total),
                parseFloat(overviewQuery.data.unpaid_invoices.previous_total)
            ),
            date: getPreviousPeriodDate(),
            prevValue: parseFloat(overviewQuery.data.unpaid_invoices.previous_total)
        },
        spendPerOrder: {
            value: parseFloat(overviewQuery.data.spend_per_order.current_total),
            change: calculateChange(
                parseFloat(overviewQuery.data.spend_per_order.current_total),
                parseFloat(overviewQuery.data.spend_per_order.previous_total)
            ),
            date: getPreviousPeriodDate(),
            prevValue: parseFloat(overviewQuery.data.spend_per_order.previous_total)
        },
        jobsCompleted: {
            value: parseFloat(overviewQuery.data.jobs_completed.current_total),
            change: calculateChange(
                parseFloat(overviewQuery.data.jobs_completed.current_total),
                parseFloat(overviewQuery.data.jobs_completed.previous_total)
            ),
            date: getPreviousPeriodDate(),
            prevValue: parseFloat(overviewQuery.data.jobs_completed.previous_total)
        },
        contractorExpense: {
            value: parseFloat(overviewQuery.data.contractor_expense.current_total),
            change: calculateChange(
                parseFloat(overviewQuery.data.contractor_expense.current_total),
                parseFloat(overviewQuery.data.contractor_expense.previous_total)
            ),
            date: getPreviousPeriodDate(),
            prevValue: parseFloat(overviewQuery.data.contractor_expense.previous_total)
        },
    } : {
        grossVolume: { value: 0, change: 0, date: formatDateForLabel(new Date()), prevValue: 0 },
        activeQuotesVolume: { value: 0, change: 0, date: formatDateForLabel(new Date()), prevValue: 0 },
        orders: { value: 0, change: 0, date: formatDateForLabel(new Date()), prevValue: 0 },
        unpaidInvoicesVolume: { value: 0, change: 0, date: formatDateForLabel(new Date()), prevValue: 0 },
        spendPerOrder: { value: 0, change: 0, date: formatDateForLabel(new Date()), prevValue: 0 },
        jobsCompleted: { value: 0, change: 0, date: formatDateForLabel(new Date()), prevValue: 0 },
        contractorExpense: { value: 0, change: 0, date: formatDateForLabel(new Date()), prevValue: 0 },
    };

    return (
        <>
            <Helmet>
                <title>MeMate - Overview</title>
            </Helmet>
            <div className={`topbar ${style.borderTopbar}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <Link to="/statistics/executive" className={clsx('d-flex align-items-center px-2 py-1')}>
                    <PieChart color='#9E77ED' size={16} className='me-2' />
                    <span className={style.topbartext}>Executive</span>
                </Link>
                <Link to="/statistics/sales-conversion" className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <Speedometer2 color='#17B26A' size={16} className='me-2' />
                    <span className={style.topbartext}>Conversion</span>
                </Link>
                <Link to="/statistics-overview" style={{ background: "#FEF3F2" }} className={clsx(style.activeTab, 'd-flex align-items-center px-2 py-1')}>
                    <TextParagraph color='#F04438' size={16} className='me-2' />
                    <span className={style.topbartext} style={{ color: "#F04438" }}>Overview</span>
                </Link>
                <Link to="/statistics/key-results" className='d-flex align-items-center px-2 py-1'>
                    <WindowDesktop color='#667085' size={16} className='me-2' />
                    <span className={style.topbartext}>Key Results</span>
                </Link>
                <Link to={"#"} className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <ClipboardData color='#084095' size={16} className='me-2' />
                    <span className={style.topbartext}>Reports</span>
                </Link>
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
                            <Col sm={4} className='border-top border-left border-right' style={{ height: '340px', padding: '20px' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Gross Volume</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={reportsData.grossVolume.change > 0 ? style.changePositive : style.changeNeutral}>
                                            {Math.abs(reportsData.grossVolume.change) || 'N/A'}%
                                        </span>
                                    </div>
                                    <span className={style.dateLabel}>{reportsData.grossVolume.date}<br /> ${formatAUD(reportsData.grossVolume.prevValue)}</span>
                                </div>
                                <div className={style.value}>${formatAUD(reportsData.grossVolume.value)}</div>
                                <Chart type="line" data={grossVolumeChartData} options={grossVolumeChartData.options} style={{ height: '200px' }} />
                            </Col>

                            <Col sm={4} className='border-top' style={{ height: '340px', padding: '20px', position: 'relative' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Active Quotes Volume</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={reportsData.activeQuotesVolume.change > 0 ? style.changePositive : style.changeNeutral}>
                                            {Math.abs(reportsData.activeQuotesVolume.change) || 'N/A'}%
                                        </span>
                                    </div>
                                    <span className={style.dateLabel}>{reportsData.activeQuotesVolume.date}<br /> ${formatAUD(reportsData.activeQuotesVolume.prevValue)}</span>
                                </div>
                                <div className={style.value}>${formatAUD(reportsData.activeQuotesVolume.value)}</div>
                                <Chart type="line" data={activeQuotesChartData} options={activeQuotesChartData.options} style={{ height: '200px' }} />
                            </Col>

                            <Col sm={4} className='border-top border-right border-left' style={{ height: '340px', padding: '20px' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Orders</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={reportsData.orders.change > 0 ? style.changePositive : style.changeNeutral}>
                                            {Math.abs(reportsData.orders.change) || 'N/A'}%
                                        </span>
                                    </div>
                                    <span className={style.dateLabel}>{reportsData.orders.date}<br /> ${formatAUD(reportsData.orders.prevValue)}</span>
                                </div>
                                <div className={style.value}>${formatAUD(reportsData.orders.value)}</div>
                                <Chart type="line" data={ordersChartData} options={ordersChartData.options} style={{ height: '200px' }} />
                            </Col>

                            <Col sm={4} className='border' style={{ height: '340px', padding: '20px' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Unpaid Invoices Volume</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={reportsData.unpaidInvoicesVolume.change > 0 ? style.changePositive : style.changeNeutral}>
                                            {Math.abs(reportsData.unpaidInvoicesVolume.change) || 'N/A'}%
                                        </span>
                                    </div>
                                    <span className={style.dateLabel}>{reportsData.unpaidInvoicesVolume.date}<br /> ${formatAUD(reportsData.unpaidInvoicesVolume.prevValue)}</span>
                                </div>
                                <div className={style.value}>${formatAUD(reportsData.unpaidInvoicesVolume.value)}</div>
                                <Chart type="line" data={unpaidInvoicesChartData} options={unpaidInvoicesChartData.options} style={{ height: '200px' }} />
                            </Col>

                            <Col sm={4} className='border-top border-bottom' style={{ height: '340px', padding: '20px' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Spend per Order</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={reportsData.spendPerOrder.change > 0 ? style.changePositive : style.changeNeutral}>
                                            {Math.abs(reportsData.spendPerOrder.change) || 'N/A'}%
                                        </span>
                                    </div>
                                    <span className={style.dateLabel}>{reportsData.spendPerOrder.date}<br /> ${formatAUD(reportsData.spendPerOrder.prevValue)}</span>
                                </div>
                                <div className={style.value}>${formatAUD(reportsData.spendPerOrder.value)}</div>
                                <Chart type="line" data={spendPerOrderChartData} options={spendPerOrderChartData.options} style={{ height: '200px' }} />
                            </Col>

                            <Col sm={4} className='border' style={{ height: '340px', padding: '20px' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Jobs Completed</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={reportsData.jobsCompleted.change > 0 ? style.changePositive : style.changeNeutral}>
                                            {Math.abs(reportsData.jobsCompleted.change) || 'N/A'}%
                                        </span>
                                    </div>
                                    <span className={style.dateLabel}>{reportsData.jobsCompleted.date}<br /> ${formatAUD(reportsData.jobsCompleted.prevValue)}</span>
                                </div>
                                <div className={style.value}>${formatAUD(reportsData.jobsCompleted.value)}</div>
                                <Chart type="line" data={jobsCompletedChartData} options={jobsCompletedChartData.options} style={{ height: '200px' }} />
                            </Col>

                            <Col sm={4} className='border' style={{ height: '340px', padding: '20px' }}>
                                <div className={style.graphHeader}>
                                    <div className={style.graphHeaderLeft}>
                                        <span className={style.graphHeaderLeftText}>Contractor Expense</span>
                                        <InfoSquareFill size={12} color='#8792A2' />
                                        <span className={reportsData.contractorExpense.change > 0 ? style.changePositive : style.changeNeutral}>
                                            {Math.abs(reportsData.contractorExpense.change) || 'N/A'}%
                                        </span>
                                    </div>
                                    <span className={style.dateLabel}>{reportsData.contractorExpense.date}<br /> ${formatAUD(reportsData.contractorExpense.prevValue)}</span>
                                </div>
                                <div className={style.value}>${formatAUD(reportsData.contractorExpense.value)}</div>
                                <Chart type="line" data={contractorExpenseChartData} options={contractorExpenseChartData.options} style={{ height: '200px' }} />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>
            {overviewQuery?.isFetching && <Loader />}
        </>
    );
};

export default Overview;