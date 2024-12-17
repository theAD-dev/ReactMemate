import React, { useState, useEffect } from 'react'
import style from './statistics.module.scss';
import { Calendar as CalendarIcon, ClipboardData, Google, PieChart, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import { Chart } from 'primereact/chart';

const Overview = () => {
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
                <Link to={"/statistics/sales-conversion"} className='d-flex align-items-center px-2'>
                    <Speedometer2 color='#17B26A' size={16} className='me-2' />
                    <span className={style.topbartext}>Conversion</span>
                </Link>
                <Link to={"/statistics/overview"} className={clsx(style.activeTab, 'd-flex align-items-center px-2 py-1')}>
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
                <h2 className={clsx(style.keyResultsTitle)}>Reports Overview</h2>
            </div>
        </>
    )
}

export default Overview