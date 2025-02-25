import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import { Calendar as CalendarIcon, ClipboardData, Google, PieChart, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { Divider } from '@mui/material';
import { Chart as ChartJS, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import clsx from 'clsx';
import { Chart } from 'primereact/chart';
import style from './statistics.module.scss';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';


const verticalLinePlugin = {
    id: 'verticalLine',
    afterDraw: (chart) => {
        const tooltip = chart.tooltip;
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;

        // Only proceed if the tooltip is active and has data
        if (tooltip._active && tooltip._active.length > 0) {
            const activePoint = tooltip._active[0];
            const xPos = activePoint.element.x;

            // Save the current canvas state to avoid conflicts
            ctx.save();
            
            // Set the line style properties
            ctx.lineWidth = 2; // Single line with width of 2
            ctx.strokeStyle = '#1AB2FF'; // Blue color

            // Draw the vertical line at the xPos of the active point
            ctx.beginPath();
            ctx.moveTo(xPos, chartArea.top);
            ctx.lineTo(xPos, chartArea.bottom);
            ctx.stroke();

            // Restore the canvas state to avoid drawing multiple lines
            ctx.restore();
        }
    }
};

ChartJS.register(...registerables, annotationPlugin, verticalLinePlugin);

const SalesConversion = () => {
    const { trialHeight } = useTrialHeight();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Requests',
                    data: [120, 140, 130, 150, 170, 160, 180, 200, 190, 210, 230, 220],
                    fill: true,
                    tension: 0.4,
                    borderColor: '#17B26A',
                    backgroundColor: getGradientForOperationalProfit(),
                },
                {
                    label: 'Quotes',
                    data: [80, 90, 85, 88, 95, 92, 100, 110, 105, 115, 120, 118],
                    fill: true,
                    tension: 0.4,
                    borderColor: '#5A3FFF4D',
                    backgroundColor: getGradientCostofSale(),
                },
                {
                    label: 'Cost of Sale',
                    data: [50, 55, 52, 58, 60, 62, 65, 68, 70, 75, 78, 80],
                    fill: false,
                    tension: 0.4,
                    borderColor: '#FF8508',
                    backgroundColor: getGradientLabor(),
                },
            ]
        };

        function getGradientForOperationalProfit() {
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return 'rgba(76,175,80,0.2)';

            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0.0596, 'rgba(23, 178, 106, 0.20)');
            gradient.addColorStop(0.9749, 'rgba(23, 178, 106, 0.04)');

            return gradient;
        }

        function getGradientCostofSale() {
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return 'rgba(90, 63, 255, 0.3)';

            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0.1, 'rgba(90, 63, 255, 0.30)');
            gradient.addColorStop(1, 'rgba(90, 63, 255, 0.06)');

            return gradient;
        }

        function getGradientLabor() {
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return 'rgba(255,133,8,0.2)';

            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(255, 133, 8, 0.20)');
            gradient.addColorStop(1, 'rgba(255, 133, 8, 0.00)');

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
                        boxHeight: 4,
                    }
                },
                title: {
                    display: true,
                    text: 'Conversion Overview',
                    position: 'top',
                    align: 'start',
                    color: '#101828',
                    font: {
                        size: 18,
                        fontWeight: 600
                    },
                    padding: 5
                },
                subtitle: {
                    display: true,
                    text: 'Track how your conversion compares to your industry average.',
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
                    borderColor: '#fff',
                    borderWidth: 1,
                    callbacks: {
                        label: function(tooltipItem) {
                            const datasetIndex = tooltipItem.datasetIndex;
                            const datasetLabel = tooltipItem.dataset.label;
                            const value = tooltipItem.raw;
                            return `${datasetLabel}: $${value}`;  // Display dataset label and value
                        },
                        footer: function(tooltipItems) {
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
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <>
            <div className={`topbar ${style.borderTopbar}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <Link to={"/statistics/executive"} className={clsx('d-flex align-items-center px-2 py-1')}>
                    <PieChart color='#9E77ED' size={16} className='me-2' />
                    <span className={style.topbartext}>Executive</span>
                </Link>
                <Link to={"/statistics/sales-conversion"} className={clsx(style.activeTab, 'd-flex align-items-center px-2')}>
                    <Speedometer2 color='#17B26A' size={16} className='me-2' />
                    <span className={style.topbartext}>Conversion</span>
                </Link>
                <Link to={"/statistics/overview"} className='d-flex align-items-center px-2'>
                    <TextParagraph color='#F04438' size={16} className='me-2' />
                    <span className={style.topbartext}>Overview</span>
                </Link>
                <Link to={"/statistics/key-results"} className='d-flex align-items-center px-2'>
                    <WindowDesktop color='#667085' size={16} className='me-2' />
                    <span className={style.topbartext}>Key Results</span>
                </Link>
                <Link className='d-flex align-items-center px-2'>
                    <ClipboardData color='#084095' size={16} className='me-2' />
                    <span className={style.topbartext}>Reports</span>
                </Link>
                <Link className='d-flex align-items-center px-2'>
                    <Google color='#F79009' size={16} className='me-2' />
                    <span className={style.topbartext}>GA Widgets</span>
                </Link>
            </div>
            <div className={clsx(style.keyResults)} style={{ padding: "24px", marginBottom: '20px', overflow: 'auto', height: `calc(100vh - 175px - ${trialHeight}px)`, background: '#F8F9FC' }}>
                <h2 className={clsx(style.keyResultsTitle)}>Sales Conversion</h2>
                <Button className={clsx(style.button, "outline-button mx-auto")}>
                    <CalendarIcon color='#475467' size={16} />
                    2024
                </Button>

                <div className='d-flex justify-content-center gap-0' style={{ marginTop: '16px', borderBottom: "1px solid var(--Gray-200, #EAECF0)", background: '#F8F9FC' }}>
                    <Button className={clsx(style.monthName)}>Jan</Button>
                    <Button className={clsx(style.monthName)}>Feb</Button>
                    <Button className={clsx(style.monthName)}>Mar</Button>
                    <Button className={clsx(style.monthName, style.activeButton)}>Apr</Button>
                    <Button className={clsx(style.monthName)}>May</Button>
                    <Button className={clsx(style.monthName)}>Jun</Button>
                    <Button className={clsx(style.monthName)}>Jul</Button>
                    <Button className={clsx(style.monthName)}>Aug</Button>
                    <Button className={clsx(style.monthName)}>Sep</Button>
                    <Button disabled className={clsx(style.monthName)}>Oct</Button>
                    <Button disabled className={clsx(style.monthName)}>Nov</Button>
                    <Button disabled className={clsx(style.monthName)}>Dec</Button>
                </div>

                <Card className='border-0 mt-3'>
                    <Card.Body>
                        <div className='d-flex justify-content-between align-items-end mb-4'>
                            <div className='left text-start'>
                                <h1 style={{ color: '#101828', fontSize: '18px', fontWeight: 600 }}>Conversion Overview</h1>
                                <h6 style={{ color: '#475467', fontSize: '14px' }}>Track how your conversion compares to your industry average.</h6>
                            </div>
                            <div className='right d-flex gap-3 align-items-center pb-2'>
                                <div className='d-flex align-items-center gap-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                        <circle cx="4" cy="4" r="4" fill="#76D1FF" />
                                    </svg>
                                    <span className='font-14'>Requests</span>
                                </div>
                                <div className='d-flex align-items-center gap-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                        <circle cx="4" cy="4" r="4" fill="#FDB022" />
                                    </svg>
                                    <span className='font-14'>Quotes</span>
                                </div>
                                <div className='d-flex align-items-center gap-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                        <circle cx="4" cy="4" r="4" fill="#47CD89" />
                                    </svg>
                                    <span className='font-14'>Orders</span>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex flex-column w-100'>

                        </div>
                    </Card.Body>
                </Card>

                <Row>
                    <Col xs={8}>
                        <Card className='mt-3 border-0'>
                            <CardBody className='ps-3 pe-1'>
                                <Chart type="line" data={chartData} options={chartOptions} />
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs={4} className='pt-3'>
                        <div className={clsx(style.rightBoxDiv, 'w-100 mb-3')} style={{ background: '#F6FEF9', height: '141px' }}>
                            <div className='d-flex gap-1 align-items-center mb-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                    <circle cx="4" cy="4" r="4" fill="#17B26A" />
                                </svg>
                                <span className={style.title}>Requests</span>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <span className={style.money}>1502</span>
                            </div>
                        </div>
                        <div className={clsx(style.rightBoxDiv, 'w-100 mb-3')} style={{ background: '#FFFBFA', height: '141px' }}>
                            <div className='d-flex gap-1 align-items-center mb-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                    <circle cx="4" cy="4" r="4" fill="#F04438" />
                                </svg>
                                <span className={style.title}>Quotes</span>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <span className={style.money}>314</span>
                            </div>
                        </div>
                        <div className={clsx(style.rightBoxDiv, 'w-100 mb-3')} style={{ background: '#FFFCF5', height: '141px' }}>
                            <div className='d-flex gap-1 align-items-center mb-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                    <circle cx="4" cy="4" r="4" fill="#F79009" />
                                </svg>
                                <span className={style.title}>Cost of Sale </span>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                <span className={style.money}>57</span>
                            </div>
                        </div>

                    </Col>
                </Row>

                <Card className='border-0 mt-3'>
                    <Card.Body>
                        <div className='d-flex justify-content-between align-items-end mb-4'>
                            <div className='left text-start'>
                                <h1 style={{ color: '#101828', fontSize: '18px', fontWeight: 600 }}>Lead Source</h1>
                                <h6 style={{ color: '#475467', fontSize: '14px' }}>Leads are sourced from multiple channels like Instagram, Facebook, LinkedIn, and more, offering insight into the most effective platforms.</h6>
                            </div>
                        </div>
                        <Divider className='mt-0'/>
                        <div className='d-flex flex-column w-100 mt-3'>
                            <Row>
                                <Col xs={12}>
                                    <StackedBarDemo />
                                </Col>
                            </Row>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

function StackedBarDemo() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
        const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

        // Data for each category
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    type: 'bar',
                    label: 'Google / Website',
                    backgroundColor: '#75E0A7',
                    data: [120, 150, 180, 130, 140, 170, 190, 220, 240, 200, 210, 230],
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                    borderColor: "#fff"
                },
                {
                    type: 'bar',
                    label: 'Email',
                    backgroundColor: '#EAECF0',
                    data: [80, 100, 90, 120, 110, 130, 100, 140, 150, 130, 120, 100],
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                    borderColor: "#fff"
                },
                {
                    type: 'bar',
                    label: 'Instagram',
                    backgroundColor: '#D57DBF',
                    data: [70, 60, 80, 90, 100, 110, 120, 100, 80, 90, 60, 70],
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                    borderColor: "#fff"
                },
                {
                    type: 'bar',
                    label: 'Facebook',
                    backgroundColor: '#1877F2',
                    data: [50, 40, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                    borderColor: "#fff"
                },
                {
                    type: 'bar',
                    label: 'Previous Customer',
                    backgroundColor: '#EF8636',
                    data: [60, 70, 90, 80, 100, 110, 130, 120, 140, 150, 170, 160],
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                    borderColor: "#fff"
                },
                {
                    type: 'bar',
                    label: 'Recommendation / Word of Mouth',
                    backgroundColor: '#75E0A7',
                    data: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210],
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                    borderColor: "#fff"
                },
                {
                    type: 'bar',
                    label: 'Offline',
                    backgroundColor: '#F97066',
                    data: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                    borderColor: "#fff"
                },
                {
                    type: 'bar',
                    label: 'Promo Campaign',
                    backgroundColor: '#FF92E4',
                    data: [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150],
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false,
                    borderColor: "#fff"
                }
            ]
        };

        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            layout: {
                padding: {
                    bottom: 20,
                    left: 10
                }
            },
            plugins: {
                legend: {
                    position: 'right',
                    align: 'start',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        color: textColor,
                        boxHeight: 4,
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <Chart type="bar" data={chartData} options={chartOptions} />
    );
}

export default SalesConversion;