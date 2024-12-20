import React, { useState, useEffect } from 'react'
import style from './statistics.module.scss';
import { Calendar as CalendarIcon, ClipboardData, Google, PieChart, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import { Chart as ChartJS, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart } from 'primereact/chart';

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

const Executive = () => {
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
                    label: 'Operational Profit',
                    data: [120, 140, 130, 150, 170, 160, 180, 200, 190, 210, 230, 220],
                    fill: true,
                    tension: 0.4,
                    borderColor: '#17B26A',
                    backgroundColor: getGradientForOperationalProfit(),
                },
                {
                    label: 'Cost of Sale',
                    data: [80, 90, 85, 88, 95, 92, 100, 110, 105, 115, 120, 118],
                    fill: true,
                    tension: 0.4,
                    borderColor: '#5A3FFF4D',
                    backgroundColor: getGradientCostofSale(),
                },
                {
                    label: 'Labor',
                    data: [50, 55, 52, 58, 60, 62, 65, 68, 70, 75, 78, 80],
                    fill: false,
                    tension: 0.4,
                    borderColor: '#FF8508',
                    backgroundColor: getGradientLabor(),
                },
                {
                    label: 'Operating Expense',
                    data: [40, 45, 42, 48, 50, 52, 55, 58, 60, 62, 65, 68],
                    fill: true,
                    borderColor: '#1AB2FF',
                    tension: 0.4,
                    backgroundColor: getGradientCyan()
                }
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
                    borderColor: '#fff',
                    borderWidth: 1,
                    callbacks: {
                        label: function(tooltipItem) {
                            const datasetIndex = tooltipItem.datasetIndex;
                            const datasetLabel = tooltipItem.dataset.label;
                            const value = tooltipItem.raw;
                            return `${datasetLabel}: ${value}`;  // Display dataset label and value
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
            },
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <>
            <div className={`topbar ${style.borderTopbar}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <Link to={"/statistics/executive"} className={clsx(style.activeTab, 'd-flex align-items-center px-2 py-1')}>
                    <PieChart color='#9E77ED' size={16} className='me-2' />
                    <span className={style.topbartext}>Executive</span>
                </Link>
                <Link to={"/statistics/sales-conversion"} className='d-flex align-items-center px-2'>
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
            <div className={clsx(style.keyResults)} style={{ padding: "24px", marginBottom: '20px', overflow: 'auto', height: 'calc(100vh - 175px)', background: '#F8F9FC' }}>
                <h2 className={clsx(style.keyResultsTitle)}>Executive</h2>
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
                                <span className={style.money}>$10,206.20</span>
                                <Button className='text-button p-0'>View  Invioces</Button>
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
                                <span className={style.money}>$3,256.21</span>
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
                                <span className={style.money}>$ 5,594.31</span>
                                <Button className='text-button p-0'>View Sales</Button>
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
                                <span className={style.money}>$ 1,754.46</span>
                                <Button className='text-button p-0'>View People</Button>
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
                                <span className={style.money}>$ 2,685.62</span>
                                <Button className='text-button p-0'>View Expenses</Button>
                            </div>
                        </div>

                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Executive