import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, Col, Dropdown, Row } from 'react-bootstrap';
import { Calendar as CalendarIcon, ClipboardData, Google, PieChart, ShopWindow, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import { Helmet } from "react-helmet-async";
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import clsx from 'clsx';
import { Chart } from 'primereact/chart';
import { toast } from "sonner";
import style from './statistics.module.scss';
import { getGaProperties, getGaReports } from "../../../../APIs/analytics-api";
import { useAuth } from '../../../../app/providers/auth-provider';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';

const AnalyticsPage = () => {
    const { trialHeight } = useTrialHeight();
    const { session } = useAuth();
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [connecting, setConnecting] = useState(false);
    const chartRef = useRef(null);

    const API_BASE = process.env.REACT_APP_BACKEND_API_URL;
    const uid = session?.id;

    // 1) Load properties
    const propertiesQuery = useQuery({
        queryKey: ["gaProperties"],
        queryFn: getGaProperties,
        retry: 1,
    });

    // 2) When property selected, load reports
    const reportsQuery = useQuery({
        queryKey: ["gaReports", selectedPropertyId, selectedYear, selectedMonth],
        queryFn: () => {
            // Format month as YYYY-MM
            const monthIndex = months.indexOf(selectedMonth) + 1;
            const monthStr = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
            const formattedMonth = `${selectedYear}-${monthStr}`;

            return getGaReports({
                property_id: selectedPropertyId,
                params: {
                    month: formattedMonth
                },
            });
        },
        enabled: !!selectedPropertyId && !!selectedYear && !!selectedMonth,
        retry: 1,
    });

    const properties = propertiesQuery.data?.properties || [];
    const kpis = reportsQuery.data?.kpis || {};
    const topPages = reportsQuery.data?.top_pages || [];

    // Calculate total page views from top_pages
    const totalPageViews = topPages.reduce((sum, page) => sum + (page.views || 0), 0);

    // Date configuration
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const isMonthDisabled = (month, year) => {
        const monthIndex = months.indexOf(month);
        return year === currentYear && monthIndex > currentMonthIndex;
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        // Reset month if current month is disabled for selected year
        if (selectedMonth && isMonthDisabled(selectedMonth, year)) {
            setSelectedMonth('');
        }
    };

    const handleMonthSelect = (month) => {
        if (!isMonthDisabled(month, selectedYear)) {
            setSelectedMonth(month);
        }
    };

    const checkLinked = useCallback(async () => {
        try {
            const p = await getGaProperties();
            return Array.isArray(p?.properties) && p.properties.length > 0;
        } catch (e) {
            return false;
        }
    }, []);

    // OAuth connection handler
    const startOAuth = useCallback(() => {
        if (!uid) {
            toast.error("Missing user id. Please login again.");
            return;
        }

        setConnecting(true);
        const oauthUrl = `${API_BASE}/analytics/auth/google?uid=${encodeURIComponent(uid)}&next=/statistics/google-analytics`;
        const popup = window.open(oauthUrl, "GoogleAnalyticsOAuth", "width=600,height=700");

        if (!popup) {
            toast.error("Popup blocked. Please allow popups for this site.");
            setConnecting(false);
            return;
        }
    }, [uid, API_BASE]);

    // Initialize with current year and month
    useEffect(() => {
        if (!selectedYear) {
            setSelectedYear(currentYear);
            setSelectedMonth(months[currentMonthIndex]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Chart data preparation - use daily users and sessions data
    const dailyData = reportsQuery.data?.users_sessions_by_day || [];

    // Sort by date and format for display
    const sortedDailyData = [...dailyData].sort((a, b) => a.date.localeCompare(b.date));

    const chartData = {
        labels: sortedDailyData.map(d => {
            // Format date from YYYYMMDD to readable format (e.g., "Nov 1")
            const dateStr = d.date;
            const year = dateStr.substring(0, 4);
            const month = dateStr.substring(4, 6);
            const day = dateStr.substring(6, 8);
            const date = new Date(year, parseInt(month) - 1, day);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
            {
                label: 'Sessions',
                data: sortedDailyData.map(d => d.sessions),
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                borderColor: '#F79009',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(247, 144, 9, 0.20)');
                    gradient.addColorStop(1, 'rgba(247, 144, 9, 0.00)');
                    return gradient;
                },
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#F79009',
                pointBorderColor: '#FFF',
                pointBorderWidth: 2
            },
            {
                label: 'Total Users',
                data: sortedDailyData.map(d => d.totalUsers),
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                borderColor: '#17B26A',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0.0596, 'rgba(23, 178, 106, 0.20)');
                    gradient.addColorStop(0.9749, 'rgba(23, 178, 106, 0.04)');
                    return gradient;
                },
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#17B26A',
                pointBorderColor: '#FFF',
                pointBorderWidth: 2
            }
        ]
    };

    const chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    color: '#667085',
                    boxHeight: 8,
                    padding: 15,
                    font: {
                        size: 13,
                        weight: 500,
                        family: 'Inter'
                    },
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
                text: 'Daily Users & Sessions Trend',
                position: 'top',
                align: 'start',
                color: '#101828',
                font: {
                    size: 18,
                    weight: 600,
                    family: 'Inter'
                },
                padding: { top: 5, bottom: 5 }
            },
            subtitle: {
                display: true,
                text: 'Track daily user activity and session engagement throughout the month.',
                position: 'top',
                align: 'start',
                font: {
                    size: 14,
                    family: 'Inter'
                },
                color: '#475467',
                padding: { bottom: 15 }
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: '#fff',
                titleColor: '#101828',
                bodyColor: '#475467',
                borderColor: '#EAECF0',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleFont: {
                    size: 13,
                    weight: 600,
                    family: 'Inter'
                },
                bodyFont: {
                    size: 13,
                    family: 'Inter'
                },
                displayColors: true,
                boxWidth: 8,
                boxHeight: 8,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: function (tooltipItem) {
                        return ' ' + tooltipItem.dataset.label + ': ' + tooltipItem.formattedValue;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: '#667085',
                    maxRotation: 0,
                    minRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 15,
                    font: {
                        size: 12,
                        family: 'Inter'
                    }
                },
                border: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#F2F4F7',
                    drawBorder: false
                },
                ticks: {
                    color: '#667085',
                    padding: 10,
                    font: {
                        size: 12,
                        family: 'Inter'
                    }
                },
                border: {
                    display: false
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        }
    };

    return (
        <>
            <Helmet>
                <title>MeMate - Google Analytics</title>
            </Helmet>

            <div className={clsx("topbar", style.borderTopbar, style.analyticsTopbar)}>
                <Link to="/statistics/executive" className={clsx('d-flex align-items-center px-2 py-1')}>
                    <PieChart color='#9E77ED' size={16} className='me-2' />
                    <span className={style.topbartext}>Executive</span>
                </Link>
                <Link to="/statistics/sales-conversion" className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <Speedometer2 color='#17B26A' size={16} className='me-2' />
                    <span className={style.topbartext}>Conversion</span>
                </Link>
                <Link to="/statistics/overview" className={clsx('d-flex align-items-center px-2 py-1')}>
                    <TextParagraph color='#F04438' size={16} className='me-2' />
                    <span className={style.topbartext}>Overview</span>
                </Link>
                <Link to="/statistics/key-results" className='d-flex align-items-center px-2 py-1'>
                    <WindowDesktop color='#667085' size={16} className='me-2' />
                    <span className={style.topbartext}>Key Results</span>
                </Link>
                <Link to={"#"} className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <ClipboardData color='#084095' size={16} className='me-2' />
                    <span className={style.topbartext}>Reports</span>
                </Link>
                <Link to="/statistics/google-analytics" className={clsx(style.activeTab, style.gaWidgetsTab, 'd-flex align-items-center px-2 py-1')}>
                    <Google color='#F79009' size={16} className='me-2' />
                    <span className={clsx(style.topbartext, style.gaWidgetsTabText)}>GA Widgets</span>
                </Link>
                <Link to={"/statistics/profitability"} className={clsx('d-flex align-items-center px-2 py-1')}>
                    <ShopWindow color='#15B79E' size={16} className='me-2' />
                    <span className={style.topbartext}>Profitability</span>
                </Link>
            </div>

            <div className={clsx(style.keyResults, style.analyticsContainer)} style={{ height: `calc(100vh - 175px - ${trialHeight}px)` }}>
                <h2 className={clsx(style.keyResultsTitle)}>Google Analytics Widget</h2>

                {/* Show loading state while fetching properties initially */}
                {propertiesQuery.isLoading && (
                    <div className={style.centerContent}>
                        <div className="text-center">
                            <div className={clsx("spinner-border text-primary", style.loadingSpinner)} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className={clsx("mt-3", style.loadingText)}>Connecting to Google Analytics...</p>
                        </div>
                    </div>
                )}

                {/* Show error/reconnect state if API failed (session expired) */}
                {!propertiesQuery.isLoading && propertiesQuery.isError && (
                    <div className={style.centerContent}>
                        <div className={style.sessionExpiredWrapper}>
                            <div className={style.sessionExpiredContent}>
                                {/* Animated warning icon */}
                                <div className={style.warningIconOuter}>
                                    <div className={style.warningIconInner}>
                                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                            <path d="M24 16V26M24 32H24.02M42 24C42 33.9411 33.9411 42 24 42C14.0589 42 6 33.9411 6 24C6 14.0589 14.0589 6 24 6C33.9411 6 42 14.0589 42 24Z"
                                                stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    {/* Pulse rings */}
                                    <div className={style.pulseRing} />
                                    <div className={style.pulseRingDelayed} />
                                </div>

                                <h3 className={style.sessionExpiredTitle}>Session Expired</h3>
                                <p className={style.sessionExpiredDesc}>
                                    Your Google Analytics connection has expired or been disconnected.
                                </p>
                                <p className={style.sessionExpiredSubDesc}>
                                    Please reconnect your account to continue viewing analytics data.
                                </p>

                                <div className={style.buttonCenter}>
                                    <Button
                                        onClick={startOAuth}
                                        disabled={connecting}
                                        className="solid-button"
                                    >
                                        {connecting ? (
                                            <>
                                                <span className={clsx("spinner-border spinner-border-sm me-2", style.spinnerSmall)} role="status">
                                                    <span className="visually-hidden">Connecting...</span>
                                                </span>
                                                Connecting...
                                            </>
                                        ) : (
                                            'Reconnect Google Analytics'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Show connect first state if no properties */}
                {!propertiesQuery.isLoading && !propertiesQuery.isError && propertiesQuery.data && properties.length === 0 && (
                    <div className={style.centerContent400}>
                        <Card className={clsx('rounded-0 border-0', style.connectCard)}>
                            <Card.Body className={style.connectCardBody}>
                                <div className={style.googleIconWrapper}>
                                    <Google size={40} color='#F79009' />
                                </div>
                                <h3 className={style.connectTitle}>Connect Google Analytics</h3>
                                <p className={style.connectDesc}>
                                    Link your Google Analytics account to view detailed insights about users, sessions, page views, and engagement metrics directly in your dashboard.
                                </p>
                                <Button
                                    onClick={startOAuth}
                                    disabled={connecting}
                                    className={clsx("solid-button", style.connectButton)}
                                >
                                    {connecting ? (
                                        <>
                                            <span className={clsx("spinner-border spinner-border-sm me-2", style.spinnerSmall)} role="status">
                                                <span className="visually-hidden">Connecting...</span>
                                            </span>
                                            Connecting...
                                        </>
                                    ) : (
                                        'Connect Google Analytics'
                                    )}
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                )}

                {/* Show property selector and data if properties exist */}
                {!propertiesQuery.isLoading && properties.length > 0 && (
                    <>
                        {/* Year and Property Selectors */}
                        <div className='d-flex justify-content-center gap-3 mb-3'>
                            <Dropdown>
                                <Dropdown.Toggle as={Button} className={clsx(style.button, "outline-button")}>
                                    <CalendarIcon color='#475467' size={16} className='me-2' />
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

                            <Dropdown>
                                <Dropdown.Toggle as={Button} className={clsx(style.button, style.propertyDropdown, "outline-button")} disabled={propertiesQuery.isLoading}>
                                    <span className={style.propertyName}>
                                        {selectedPropertyId
                                            ? properties.find(p => p.property_id === selectedPropertyId)?.display_name || 'Select Property'
                                            : 'Select Property'}
                                    </span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {properties.map((p) => (
                                        <Dropdown.Item
                                            key={p.property_id}
                                            active={selectedPropertyId === p.property_id}
                                            onClick={() => setSelectedPropertyId(p.property_id)}
                                        >
                                            {p.display_name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        {/* Month Selector */}
                        <div className={clsx('d-flex justify-content-center gap-0', style.monthSelector)}>
                            {months.map((month) => (
                                <Button
                                    key={month}
                                    className={clsx(style.monthName, { [style.activeButton]: month === selectedMonth })}
                                    disabled={isMonthDisabled(month, selectedYear)}
                                    onClick={() => handleMonthSelect(month)}
                                >
                                    {month}
                                </Button>
                            ))}
                        </div>

                        {/* KPI Cards */}
                        {selectedPropertyId && reportsQuery.data && (
                            <>
                                <Row className='mt-4 mb-4'>
                                    <Col sm={3}>
                                        <Card className={clsx('rounded-0 border-0', style.kpiCard, style.kpiCardOrange)}>
                                            <Card.Body className={style.kpiCardBody}>
                                                <div className='d-flex align-items-center justify-content-between mb-3'>
                                                    <div className={clsx(style.kpiIconWrapper, style.kpiIconOrange)}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                                                                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className={style.kpiLabelOrange}>USERS</div>
                                                <div className={style.kpiValue}>{kpis.newUsers?.toLocaleString() || 0}</div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col sm={3}>
                                        <Card className={clsx('rounded-0 border-0', style.kpiCard, style.kpiCardGreen)}>
                                            <Card.Body className={style.kpiCardBody}>
                                                <div className='d-flex align-items-center justify-content-between mb-3'>
                                                    <div className={clsx(style.kpiIconWrapper, style.kpiIconGreen)}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z"
                                                                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z"
                                                                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className={style.kpiLabelGreen}>PAGE VIEWS</div>
                                                <div className={style.kpiValue}>{totalPageViews?.toLocaleString() || 0}</div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col sm={3}>
                                        <Card className={clsx('rounded-0 border-0', style.kpiCard, style.kpiCardPurple)}>
                                            <Card.Body className={style.kpiCardBody}>
                                                <div className='d-flex align-items-center justify-content-between mb-3'>
                                                    <div className={clsx(style.kpiIconWrapper, style.kpiIconPurple)}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                                                                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className={style.kpiLabelPurple}>SESSIONS</div>
                                                <div className={style.kpiValue}>{kpis.engagedSessions?.toLocaleString() || 0}</div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col sm={3}>
                                        <Card className={clsx('rounded-0 border-0', style.kpiCard, style.kpiCardBlue)}>
                                            <Card.Body className={style.kpiCardBody}>
                                                <div className='d-flex align-items-center justify-content-between mb-3'>
                                                    <div className={clsx(style.kpiIconWrapper, style.kpiIconBlue)}>
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <path d="M17 21V13H7V21M7 3V8H15M19 21V8H17M7 8V3M7 3H3V8H7M21 8V3H17M17 3V8H21"
                                                                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M9 17H11M13 17H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className={style.kpiLabelBlue}>NEW USERS</div>
                                                <div className={style.kpiValue}>{kpis.newUsers?.toLocaleString() || 0}</div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Chart and Summary Section */}
                                <Row>
                                    <Col xs={8}>
                                        <Card className='border-0'>
                                            <CardBody className='ps-3 pe-1'>
                                                <Chart ref={chartRef} type="line" data={chartData} options={chartOptions} />
                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col xs={4}>
                                        <div className={clsx(style.rightBoxDiv, style.summaryBoxOrange, 'w-100 mb-3')}>
                                            <div className='d-flex gap-1 align-items-center mb-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                    <circle cx="4" cy="4" r="4" fill="#F79009" />
                                                </svg>
                                                <span className={style.title}>Total Page Views</span>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <span className={style.money}>{totalPageViews?.toLocaleString() || 0}</span>
                                            </div>
                                        </div>

                                        <div className={clsx(style.rightBoxDiv, style.summaryBoxGreen, 'w-100 mb-3')}>
                                            <div className='d-flex gap-1 align-items-center mb-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                    <circle cx="4" cy="4" r="4" fill="#17B26A" />
                                                </svg>
                                                <span className={style.title}>Total Users</span>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <span className={style.money}>{kpis.newUsers?.toLocaleString() || 0}</span>
                                            </div>
                                        </div>

                                        <div className={clsx(style.rightBoxDiv, style.summaryBoxPurple, 'w-100 mb-3')}>
                                            <div className='d-flex gap-1 align-items-center mb-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                    <circle cx="4" cy="4" r="4" fill="#7F56D9" />
                                                </svg>
                                                <span className={style.title}>Engaged Sessions</span>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <span className={style.money}>{kpis.engagedSessions?.toLocaleString() || 0}</span>
                                            </div>
                                        </div>

                                        <div className={clsx(style.rightBoxDiv, style.summaryBoxBlue, 'w-100 mb-3')}>
                                            <div className='d-flex gap-1 align-items-center mb-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                    <circle cx="4" cy="4" r="4" fill="#1AB2FF" />
                                                </svg>
                                                <span className={style.title}>Avg. Time on Page</span>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <span className={style.money}>{kpis.avgSessionDuration ? `${Math.round(kpis.avgSessionDuration)}s` : '0s'}</span>
                                            </div>
                                        </div>

                                        <div className={clsx(style.rightBoxDiv, style.summaryBoxRed, 'w-100 mb-3')}>
                                            <div className='d-flex gap-1 align-items-center mb-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                    <circle cx="4" cy="4" r="4" fill="#F04438" />
                                                </svg>
                                                <span className={style.title}>Total Events</span>
                                            </div>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <span className={style.money}>{kpis.eventCount?.toLocaleString() || 0}</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Top Pages Section */}
                                <Row className='mt-4'>
                                    <Col xs={12}>
                                        <Card className={clsx('border-0', style.topPagesCard)}>
                                            <CardBody className={style.topPagesCardBody}>
                                                <div className={style.topPagesHeader}>
                                                    <div className={style.topPagesHeaderLeft}>
                                                        <div className={style.topPagesIcon}>
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <h4 className={style.topPagesTitle}>Top Performing Pages</h4>
                                                            <p className={style.topPagesSubtitle}>Pages ranked by total views and engagement</p>
                                                        </div>
                                                    </div>
                                                    <div className={style.topPagesCount}>{topPages.length} total</div>
                                                </div>

                                                <div className={style.topPagesTableWrapper}>
                                                    <table className={style.topPagesTable}>
                                                        <thead>
                                                            <tr>
                                                                <th className={clsx(style.topPagesTableHeader, style.topPagesTableHeaderFirst)}>
                                                                    Rank & Page
                                                                </th>
                                                                <th className={clsx(style.topPagesTableHeader, style.topPagesTableHeaderMiddle)}>
                                                                    <div className={style.topPagesTableHeaderIcon}>
                                                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                            <path d="M7 1L7 13M7 13L12 8M7 13L2 8" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        Views
                                                                    </div>
                                                                </th>
                                                                <th className={clsx(style.topPagesTableHeader, style.topPagesTableHeaderLast)}>
                                                                    <div className={style.topPagesTableHeaderIcon}>
                                                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                            <path d="M7 5C8.10457 5 9 4.10457 9 3C9 1.89543 8.10457 1 7 1C5.89543 1 5 1.89543 5 3C5 4.10457 5.89543 5 7 5Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                            <path d="M11 13C12.1046 13 13 12.1046 13 11C13 9.89543 12.1046 9 11 9C9.89543 9 9 9.89543 9 11C9 12.1046 9.89543 13 11 13Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                            <path d="M3 13C4.10457 13 5 12.1046 5 11C5 9.89543 4.10457 9 3 9C1.89543 9 1 9.89543 1 11C1 12.1046 1.89543 13 3 13Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        Users
                                                                    </div>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {topPages.map((page, index) => {
                                                                const maxViews = topPages[0]?.views || 1;
                                                                const viewsPercent = (page.views / maxViews) * 100;
                                                                const isTopThree = index < 3;

                                                                return (
                                                                    <tr key={index} className={clsx(style.topPagesTableRow, { [style.topThree]: isTopThree })}>
                                                                        <td className={style.topPagesTableCellFirst}>
                                                                            {/* Progress bar background */}
                                                                            <div 
                                                                                className={clsx(style.progressBarBg, isTopThree ? style.progressBarBgTop : style.progressBarBgNormal)}
                                                                                style={{ width: `${viewsPercent}%` }}
                                                                            />

                                                                            <div className={style.rankContentWrapper}>
                                                                                {/* Rank badge */}
                                                                                <div className={clsx(style.rankBadge, isTopThree ? style.rankBadgeTop : style.rankBadgeNormal)}>
                                                                                    {index + 1}
                                                                                    {isTopThree && (
                                                                                        <div className={style.starBadge}>
                                                                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                                                                <path d="M5 0L6.12257 3.87743L10 5L6.12257 6.12257L5 10L3.87743 6.12257L0 5L3.87743 3.87743L5 0Z" fill="#FFD700" />
                                                                                            </svg>
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                                {/* Page path */}
                                                                                <div className={style.pagePathWrapper}>
                                                                                    <div className={style.pagePathText}>{page.pagePath}</div>
                                                                                    {isTopThree && (
                                                                                        <div className={style.topPerformerLabel}>Top Performer 🏆</div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </td>

                                                                        <td className={style.topPagesTableCellMiddle}>
                                                                            <div className={style.viewsBadge}>
                                                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                                    <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" fill="#6366F1" fillOpacity="0.15" />
                                                                                    <path d="M10 6L7 9L6 8" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                </svg>
                                                                                {page.views.toLocaleString()}
                                                                            </div>
                                                                        </td>

                                                                        <td className={style.topPagesTableCellLast}>
                                                                            <div className={style.usersBadge}>
                                                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                                                    <path d="M13 14C13 12.9391 13 12.4087 12.7956 12.0052C12.6159 11.6516 12.3484 11.3841 11.9948 11.2044C11.5913 11 11.0609 11 10 11H6C4.93913 11 4.40869 11 4.00518 11.2044C3.65161 11.3841 3.3841 11.6516 3.20439 12.0052C3 12.4087 3 12.9391 3 14M10.5 5C10.5 6.38071 9.38071 7.5 8 7.5C6.61929 7.5 5.5 6.38071 5.5 5C5.5 3.61929 6.61929 2.5 8 2.5C9.38071 2.5 10.5 3.61929 10.5 5Z" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                </svg>
                                                                                {page.users.toLocaleString()}
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        )}

                        {/* Loading state */}
                        {selectedPropertyId && reportsQuery.isLoading && (
                            <div className={style.centerContent300}>
                                <div className="text-center">
                                    <div className={clsx("spinner-border text-primary", style.loadingSpinner)} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className={clsx("mt-3", style.loadingText)}>Loading analytics data...</p>
                                </div>
                            </div>
                        )}

                        {/* Select property state */}
                        {!selectedPropertyId && !propertiesQuery.isLoading && (
                            <div className={clsx(style.centerContent400, 'mt-5')}>
                                <div className={style.selectPropertyWrapper}>
                                    {/* Animated icon container */}
                                    <div className={style.selectPropertyIcon}>
                                        <div className={style.selectPropertyIconGlow} />
                                        <Google size={52} color='#FFFFFF' />
                                    </div>

                                    <h3 className={style.selectPropertyTitle}>Select a Property</h3>
                                    <p className={style.selectPropertyDesc}>
                                        Choose a Google Analytics property from the dropdown above to view detailed insights and analytics data
                                    </p>

                                    {/* Feature list */}
                                    <div className={style.featureList}>
                                        <div className={style.featureTagOrange}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" fill="#F79009" fillOpacity="0.2" />
                                                <path d="M5.5 8L7 9.5L10.5 6" stroke="#F79009" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            User Analytics
                                        </div>
                                        <div className={style.featureTagGreen}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" fill="#17B26A" fillOpacity="0.2" />
                                                <path d="M5.5 8L7 9.5L10.5 6" stroke="#17B26A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Page Views
                                        </div>
                                        <div className={style.featureTagPurple}>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" fill="#7F56D9" fillOpacity="0.2" />
                                                <path d="M5.5 8L7 9.5L10.5 6" stroke="#7F56D9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Engagement
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default AnalyticsPage;
