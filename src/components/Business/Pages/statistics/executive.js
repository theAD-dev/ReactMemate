import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Col, Dropdown, Row } from 'react-bootstrap';
import { Calendar as CalendarIcon, ClipboardData, Google, PieChart, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Chart as ChartJS, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import clsx from 'clsx';
import { Chart } from 'primereact/chart';
import { getExecutiveStatistics } from './api/statistics-api';
import style from './statistics.module.scss';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { formatAUD } from '../../../../shared/lib/format-aud';


export const verticalLinePlugin = {
    id: 'verticalLine',
    beforeDatasetsDraw: (chart) => {
        const tooltip = chart?.tooltip;
        const ctx = chart?.ctx;
        const chartArea = chart?.chartArea;

        if (tooltip && tooltip._active && tooltip._active.length > 0) {
            const activePoint = tooltip._active[0];
            const xPos = activePoint.element.x;

            ctx.save();

            ctx.lineWidth = 2;
            ctx.strokeStyle = '#1AB2FF';

            ctx.beginPath();
            ctx.moveTo(xPos, chartArea.top);
            ctx.lineTo(xPos, chartArea.bottom);
            ctx.stroke();

            ctx.restore();
        }
    }
};

ChartJS.register(...registerables, annotationPlugin, verticalLinePlugin);

const Executive = () => {
    const { trialHeight } = useTrialHeight();
    const [selectedYear, setSelectedYear] = useState(2025);

    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [total, setTotal] = useState({});

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = React.useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], []);

    const handleYearSelect = (year) => {
        setSelectedYear(year);
    };

    const executiveQuery = useQuery({
        queryKey: ["getExecutiveStatistics", selectedYear],
        queryFn: () => getExecutiveStatistics(selectedYear),
        enabled: !!selectedYear,
        retry: 1
    });

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        const datasetObj = executiveQuery?.data?.statistics;

        let total_income = [];
        let operating_profit = [];
        let cost_of_sale = [];
        let labor = [];
        let operating_expense = [];

        for (const key in datasetObj) {
            total_income.push(parseFloat(datasetObj[key].total_income));
            operating_profit.push(parseFloat(datasetObj[key].operating_profit));
            cost_of_sale.push(parseFloat(datasetObj[key].cost_of_sale));
            labor.push(parseFloat(datasetObj[key].labor));
            operating_expense.push(parseFloat(datasetObj[key].operating_expense));
        }

        const isCurrentYear = selectedYear === currentYear;
        if (isCurrentYear) {
            const currentMonth = new Date().getMonth();
            total_income = total_income.slice(0, currentMonth);
            operating_profit = operating_profit.slice(0, currentMonth);
            cost_of_sale = cost_of_sale.slice(0, currentMonth);
            labor = labor.slice(0, currentMonth);
            operating_expense = operating_expense.slice(0, currentMonth);
        }

        const total_income_sum = total_income.reduce((sum, val) => sum + val, 0);
        const operating_profit_sum = operating_profit.reduce((sum, val) => sum + val, 0);
        const cost_of_sale_sum = cost_of_sale.reduce((sum, val) => sum + val, 0);
        const labor_sum = labor.reduce((sum, val) => sum + val, 0);
        const operating_expense_sum = operating_expense.reduce((sum, val) => sum + val, 0);

        setTotal({
            total_income: total_income_sum,
            operating_profit: operating_profit_sum,
            cost_of_sale: cost_of_sale_sum,
            labor: labor_sum,
            operating_expense: operating_expense_sum
        });

        const data = {
            labels: months,
            datasets: [
                {
                    label: 'Total Income',
                    data: total_income,
                    fill: true,
                    tension: 0,
                    borderWidth: 2,
                    borderColor: '#475467',
                    backgroundColor: getGradientForTotalIncome(),
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#475467',
                    pointBorderColor: '#475467',
                    pointBorderWidth: 0
                },
                {
                    label: 'Operational Profit',
                    data: operating_profit,
                    fill: true,
                    tension: 0,
                    borderWidth: 2,
                    borderColor: '#17B26A',
                    backgroundColor: getGradientForOperationalProfit(),
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#17B26A',
                    pointBorderColor: '#17B26A',
                    pointBorderWidth: 0
                },
                {
                    label: 'Cost of Sale',
                    data: cost_of_sale,
                    fill: true,
                    tension: 0,
                    borderWidth: 2,
                    borderColor: '#F04438',
                    backgroundColor: getGradientCostOfSale(),
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#F04438',
                    pointBorderColor: '#F04438',
                    pointBorderWidth: 0
                },
                {
                    label: 'Labor',
                    data: labor,
                    fill: true,
                    tension: 0,
                    borderWidth: 2,
                    borderColor: '#F79009',
                    backgroundColor: getGradientLabor(),
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#F79009',
                    pointBorderColor: '#F79009',
                    pointBorderWidth: 0
                },
                {
                    label: 'Operating Expense',
                    data: operating_expense,
                    tension: 0,
                    fill: true,
                    borderWidth: 2,
                    borderColor: '#1AB2FF',
                    backgroundColor: getGradientCyan(),
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#1AB2FF',
                    pointBorderColor: '#1AB2FF',
                    pointBorderWidth: 0
                }
            ]
        };

        function getGradientForTotalIncome() {
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return 'rgba(71, 84, 103, 0.2)';

            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(71, 84, 103, 0.20)');
            gradient.addColorStop(1, 'rgba(71, 84, 103, 0.00)');

            return gradient;
        }

        function getGradientForOperationalProfit() {
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return 'rgba(23, 178, 106, 0.2)';

            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0.0596, 'rgba(23, 178, 106, 0.20)');
            gradient.addColorStop(0.9749, 'rgba(23, 178, 106, 0.04)');

            return gradient;
        }

        function getGradientCostOfSale() {
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return 'rgba(240, 68, 56, 0.3)';

            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0.1, 'rgba(240, 68, 56, 0.30)');
            gradient.addColorStop(1, 'rgba(240, 68, 56, 0.06)');

            return gradient;
        }

        function getGradientLabor() {
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return 'rgba(247, 144, 9, 0.2)';

            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(247, 144, 9, 0.20)');
            gradient.addColorStop(1, 'rgba(247, 144, 9, 0.00)');

            return gradient;
        }

        function getGradientCyan() {
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return 'rgba(26, 178, 255, 0.2)';

            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(26, 178, 255, 0.20)');
            gradient.addColorStop(1, 'rgba(26, 178, 255, 0.00)');

            return gradient;
        }

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        color: textColor,
                        boxHeight: 5,
                        generateLabels: (chart) => {
                            return chart.data.datasets.map((dataset, i) => ({
                                text: dataset.label,
                                fillStyle: dataset.borderColor || dataset.backgroundColor,
                                strokeStyle: dataset.borderColor,
                                pointStyle: 'circle',
                                hidden: !chart.isDatasetVisible(i),
                                index: i
                            }));
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Financial Overview',
                    position: 'top',
                    align: 'start',
                    color: '#101828',
                    font: {
                        size: 18,
                    },
                    padding: 5
                },
                subtitle: {
                    display: true,
                    text: 'Track how your rating compares to your industry average.',
                    position: 'top',
                    align: 'start',
                    font: {
                        size: 14,
                    },
                    color: '#475467',
                    padding: 0
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#fff',  // Tooltip background color
                    titleColor: '#667085',
                    bodyColor: '#667085',
                    borderColor: '#f2f2f2',
                    borderWidth: 1,
                    callbacks: {
                        label: function (tooltipItem) {
                            const datasetLabel = tooltipItem.dataset.label;
                            const value = tooltipItem.raw;
                            return `${datasetLabel}: $${formatAUD(value)}`;  // Display dataset label and value with currency formatting
                        },
                        footer: function () {
                            return `Hover over the chart to see values`; // Optional footer
                        },
                    },
                },
                interaction: {
                    mode: 'index',  // To show tooltip for all datasets at the hover point
                    intersect: false,  // Tooltip will display even if the cursor isn't over a data point
                },
                elements: {
                    line: {
                        borderWidth: 2,  // Set line thickness
                    },
                    point: {
                        radius: 4,  // Set point radius
                    },
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    beginAtZero: false, // Allow negative values
                    ticks: {
                        color: textColorSecondary,
                        // Format the tick values to be more readable
                        callback: function (value) {
                            if (Math.abs(value) >= 1000) {
                                return '$' + (value / 1000).toFixed(1) + 'k';
                            }
                            return '$' + value;
                        }
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            },
        };

        setChartData(data);
        setChartOptions(options);
    }, [executiveQuery?.data]);

    useEffect(() => {
        const currentDate = new Date();
        setSelectedYear(currentDate.getUTCFullYear());
    }, []);

    return (
        <>
            <Helmet>
                <title>MeMate - Executive</title>
            </Helmet>
            <div className={`topbar ${style.borderTopbar}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                {/* Current page - Executive */}
                <Link to={"/statistics/executive"} style={{ background: "#F9F5FF" }} className={clsx(style.activeTab, 'd-flex align-items-center px-2 py-1')}>
                    <PieChart color='#9E77ED' size={16} className='me-2' />
                    <span className={style.topbartext} style={{ color: "#9E77ED" }}>Executive</span>
                </Link>
                {/* Conversion - disabled */}
                <Link to={"/statistics/sales-conversion"} className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <Speedometer2 color='#17B26A' size={16} className='me-2' />
                    <span className={style.topbartext}>Conversion</span>
                </Link>
                <Link to={"/statistics/overview"} className={clsx('d-flex align-items-center px-2 py-1')}>
                    <TextParagraph color='#F04438' size={16} className='me-2' />
                    <span className={style.topbartext}>Overview</span>
                </Link>
                {/* Key Results - enabled */}
                <Link to={"/statistics/key-results"} className='d-flex align-items-center px-2 py-1'>
                    <WindowDesktop color='#667085' size={16} className='me-2' />
                    <span className={style.topbartext}>Key Results</span>
                </Link>
                {/* Reports - disabled */}
                <Link className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <ClipboardData color='#084095' size={16} className='me-2' />
                    <span className={style.topbartext}>Reports</span>
                </Link>
                {/* GA Widgets - disabled */}
                <Link className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <Google color='#F79009' size={16} className='me-2' />
                    <span className={style.topbartext}>GA Widgets</span>
                </Link>
            </div>
            <div className={clsx(style.keyResults)} style={{ padding: "24px", marginBottom: '20px', overflow: 'auto', height: `calc(100vh - 175px - ${trialHeight}px)`, background: '#F8F9FC' }}>
                <h2 className={clsx(style.keyResultsTitle)}>Executive</h2>
                <Dropdown>
                    <Dropdown.Toggle as={Button} className={clsx(style.button, "outline-button mx-auto")}>
                        <CalendarIcon color='#475467' size={16} />
                        {selectedYear}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {years.map((year) => (
                            <Dropdown.Item
                                key={year}
                                eventKey={year}
                                active={year === selectedYear}
                                onClick={() => handleYearSelect(year)}
                            >
                                {year}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>

                <div className='d-flex justify-content-center gap-0' style={{ marginTop: '16px', borderBottom: "1px solid var(--Gray-200, #EAECF0)", background: '#F8F9FC' }}>
                </div>

                <Row>
                    <Col xs={8}>
                        <Card className='mt-3 border-0'>
                            <CardBody className='ps-3 pe-1'>
                                <Chart type="line" data={chartData} options={chartOptions} />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs={4} className='pt-3'>
                        <div className={clsx(style.rightBoxDiv, 'w-100 mb-3')} style={{ background: '#FCFCFD' }}>
                            <div className='d-flex gap-1 align-items-center mb-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                    <circle cx="4" cy="4" r="4" fill="#475467" />
                                </svg>
                                <span className={style.title}>Total Income</span>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <span className={style.money}>${formatAUD(total.total_income || 0)}</span>
                                <Button className={clsx('text-button p-0', style.disabledLink)}>View Invoices</Button>
                            </div>
                        </div>
                        <div className={clsx(style.rightBoxDiv, 'w-100 mb-3')} style={{ background: '#F6FEF9' }}>
                            <div className='d-flex gap-1 align-items-center mb-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                    <circle cx="4" cy="4" r="4" fill="#17B26A" />
                                </svg>
                                <span className={style.title}>Operational Profit</span>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <span className={style.money}>${formatAUD(total.operating_profit || 0)}</span>
                            </div>
                        </div>
                        <div className={clsx(style.rightBoxDiv, 'w-100 mb-3')} style={{ background: '#FFFBFA' }}>
                            <div className='d-flex gap-1 align-items-center mb-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                    <circle cx="4" cy="4" r="4" fill="#F04438" />
                                </svg>
                                <span className={style.title}>Cost of Sale</span>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <span className={style.money}>${formatAUD(total.cost_of_sale || 0)}</span>
                                <Button className={clsx('text-button p-0', style.disabledLink)}>View Sales</Button>
                            </div>
                        </div>
                        <div className={clsx(style.rightBoxDiv, 'w-100 mb-3')} style={{ background: '#FFFCF5' }}>
                            <div className='d-flex gap-1 align-items-center mb-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                    <circle cx="4" cy="4" r="4" fill="#F79009" />
                                </svg>
                                <span className={style.title}>Labor</span>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <span className={style.money}>${formatAUD(total.labor || 0)}</span>
                                <Button className={clsx('text-button p-0', style.disabledLink)}>View People</Button>
                            </div>
                        </div>
                        <div className={clsx(style.rightBoxDiv, 'w-100 mb-3')} style={{ background: '#F2FAFF' }}>
                            <div className='d-flex gap-1 align-items-center mb-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                    <circle cx="4" cy="4" r="4" fill="#1AB2FF" />
                                </svg>
                                <span className={style.title}>Operating Expense</span>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <span className={style.money}>${formatAUD(total.operating_expense || 0)}</span>
                                <Button className={clsx('text-button p-0', style.disabledLink)}>View Expenses</Button>
                            </div>
                        </div>

                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Executive;