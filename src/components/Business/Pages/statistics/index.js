import React, { useState } from 'react';
import { ClipboardData, Google, PieChart, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import style from './statistics.module.scss';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';

const StatisticsPage = () => {
    const { trialHeight } = useTrialHeight();
    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedMonth, setSelectedMonth] = useState('Mar');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // List of months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Determine if a month should be disabled (future months in the current year)
    const currentDate = new Date('2025-03-03'); // Current date as per system info
    const currentMonthIndex = currentDate.getMonth(); // 2 (March)
    const isMonthDisabled = (month, year) => {
        const monthIndex = months.indexOf(month);
        return year === currentDate.getFullYear() && monthIndex > currentMonthIndex;
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        // Optionally update progress based on year selection
        // e.g., fetch data and setOuterProgress/setInnerProgress here
    };

    const handleMonthSelect = (month) => {
        if (!isMonthDisabled(month, selectedYear)) {
            setSelectedMonth(month);
        }
    };

    return (
        <PrimeReactProvider className='peoples-page'>
            <div className={`topbar ${style.borderTopbar}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <Link to={"/statistics/executive"} className='d-flex align-items-center px-2 py-1'>
                    <PieChart color='#9E77ED' size={16} className='me-2' />
                    <span className={style.topbartext}>Executive</span>
                </Link>
                <Link to={"/statistics/sales-conversion"} className='d-flex align-items-center px-2 py-1'>
                    <Speedometer2 color='#17B26A' size={16} className='me-2' />
                    <span className={style.topbartext}>Conversion</span>
                </Link>
                <Link to={"/statistics/overview"} className='d-flex align-items-center px-2 py-1'>
                    <TextParagraph color='#F04438' size={16} className='me-2' />
                    <span className={style.topbartext}>Overview</span>
                </Link>
                <Link to={"/statistics/key-results"} className='d-flex align-items-center px-2 py-1'>
                    <WindowDesktop color='#667085' size={16} className='me-2' />
                    <span className={style.topbartext}>Key Results</span>
                </Link>
                <Link className='d-flex align-items-center px-2 py-1'>
                    <ClipboardData color='#084095' size={16} className='me-2' />
                    <span className={style.topbartext}>Reports</span>
                </Link>
                <Link className='d-flex align-items-center px-2 py-1'>
                    <Google color='#F79009' size={16} className='me-2' />
                    <span className={style.topbartext}>GA Widgets</span>
                </Link>
            </div>
            <div style={{ padding: "72px 128px", marginBottom: '20px', overflow: 'auto', height: `calc(100vh - 175px - ${trialHeight}px)` }}>
                <div className='d-flex justify-content-center' style={{ gap: '24px' }}>
                    <Link to={"/statistics/executive"} className={style.box}>
                        <div className={style.executiveBox}>
                            <PieChart color='#9E77ED' size={40} />
                        </div>
                        <h4 className={style.boxTitle}>Executive</h4>
                        <p className={style.boxSubtitle}>
                            Provides analytics that display the overall direction of turnover, along with the proportions of operational profit and expenses.
                        </p>
                    </Link>
                    <Link to={"/statistics/sales-conversion"} className={style.box}>
                        <div className={clsx(style.executiveBox, style.executiveBox2)}>
                            <Speedometer2 color='#17B26A' size={40} />
                        </div>
                        <h4 className={style.boxTitle}>Conversion</h4>
                        <p className={style.boxSubtitle}>
                            Provides analytics that display the overall direction of turnover, along with the proportions of operational profit and expenses.
                        </p>
                    </Link>
                    <Link to={"/statistics/overview"} className={style.box}>
                        <div className={clsx(style.executiveBox, style.executiveBox3)}>
                            <TextParagraph color='#F04438' size={40} />
                        </div>
                        <h4 className={style.boxTitle}>Overview</h4>
                        <p className={style.boxSubtitle}>
                            Quick widgets enable you to compare and view performance based on chosen timeframes.
                        </p>
                    </Link>
                </div>
                <div className='d-flex justify-content-center' style={{ gap: '24px' }}>
                    <Link to={"/statistics/key-results"} className={style.box}>
                        <div className={clsx(style.executiveBox, style.executiveBox4)}>
                            <WindowDesktop color='#667085' size={40} />
                        </div>
                        <h4 className={style.boxTitle}>Objectives</h4>
                        <p className={style.boxSubtitle}>
                            Sets monthly targets and tracks month-to-month invoice volume or income, segmented by departments.
                        </p>
                    </Link>
                    <Link className={style.box}>
                        <div className={clsx(style.executiveBox, style.executiveBox5)}>
                            <ClipboardData color='#084095' size={40} />
                        </div>
                        <h4 className={style.boxTitle}>Reports</h4>
                        <p className={style.boxSubtitle}>
                            Offers various reports to assist in analysing business directions and the details of money flow.
                        </p>
                    </Link>
                    <Link className={style.box}>
                        <div className={clsx(style.executiveBox, style.executiveBox6)}>
                            <Google color='#F79009' size={40} />
                        </div>
                        <h4 className={style.boxTitle}>GA Widget</h4>
                        <p className={style.boxSubtitle}>
                            Displays activity on your website and allows you to compare it with other business statistics.
                        </p>
                    </Link>
                </div>
            </div>
        </PrimeReactProvider>
    );
};

export default StatisticsPage;