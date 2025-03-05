import React, { useEffect, useState } from 'react';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button } from 'react-bootstrap';
import { Calendar as CalendarIcon, ClipboardData, Google, PieChart, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { PrimeReactProvider } from 'primereact/api';
import Dropdown from 'react-bootstrap/Dropdown';
import { getKeyResultStatics } from './api/statistics-api';
import style from './statistics.module.scss';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { formatAUD } from '../../../../shared/lib/format-aud';
import Loader from '../../../../shared/ui/loader/loader';

const KeyResultsPage = () => {
    const { trialHeight } = useTrialHeight();
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [outerProgress, setOuterProgress] = useState(0); // Start at 0
    const [uptoDate, setUptoDate] = useState(0);
    const [totalTarget, setTotalTarget] = useState(0);
    const [innerProgress, setInnerProgress] = useState(0);

    const keyResultStaticsQuery = useQuery({
        queryKey: ["getKeyResultStatics", selectedYear, selectedMonth],
        queryFn: () => getKeyResultStatics(selectedYear, months.indexOf(selectedMonth)),
        enabled: !!(selectedMonth && selectedYear),
        retry: 1
    });

    // Path lengths (approximated)
    const outerPathLength = 596.9;
    const innerPathLength = 471.24;

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const daysInMonth = new Date(selectedYear || currentYear, months.indexOf(selectedMonth) + 1, 0).getDate();
    const daysCompleted = Math.min(currentDate.getDate(), daysInMonth);

    const isMonthDisabled = (month, year) => {
        const monthIndex = months.indexOf(month);
        return year === currentDate.getFullYear() && monthIndex > currentMonthIndex;
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
    };

    const handleMonthSelect = (month) => {
        if (!isMonthDisabled(month, selectedYear)) {
            setSelectedMonth(month);
        }
    };

    useEffect(() => {
        if (keyResultStaticsQuery.data) {
            const statisticsData = keyResultStaticsQuery.data || {};
            const totalTarget = statisticsData.statistics.reduce((acc, curr) =>
                acc + parseFloat(curr.target_value), 0);
            const totalSum = statisticsData.statistics.reduce((acc, curr) =>
                acc + parseFloat(curr.sum), 0);
            const progress = totalTarget > 0 ? (totalSum / totalTarget) * 100 : 0;
            setOuterProgress(progress);
            setUptoDate(totalSum);
            setTotalTarget(totalTarget);
        }

        // Update inner progress based on days
        const daysProgress = daysInMonth > 0 ? (daysCompleted / daysInMonth) * 100 : 0;
        setInnerProgress(daysProgress);
    }, [keyResultStaticsQuery.data, selectedMonth, selectedYear]);

    useEffect(() => {
        const currentDate = new Date('2025-03-03');
        setSelectedYear(currentDate.getUTCFullYear().toString());
        setSelectedMonth(months[currentDate.getMonth()]);
    }, []);

    // Calculate dash offsets dynamically
    const outerDashOffset = outerPathLength * (1 - outerProgress / 100);
    const innerDashOffset = innerPathLength * (1 - innerProgress / 100);

    // Sort statistics by sum (descending) and take top 4
    const statistics = keyResultStaticsQuery?.data?.statistics || [];
    const topStatistics = [...statistics]
        .filter(stat => parseFloat(stat.target_value) > 0)
        .sort((a, b) => parseFloat(b.sum) - parseFloat(a.sum));
        // .slice(0, 4);

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
                <Link to={"/statistics/key-results"} className={clsx(style.activeTab, 'd-flex align-items-center px-2 py-1')}>
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
            <div className={clsx(style.keyResults)} style={{ padding: "24px", marginBottom: '20px', overflow: 'auto', height: `calc(100vh - 175px - ${trialHeight}px)` }}>
                <h2 className={clsx(style.keyResultsTitle)}>Key Results</h2>
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

                <div className='d-flex justify-content-center gap-0' style={{ marginTop: '16px', borderBottom: "1px solid var(--Gray-200, #EAECF0)" }}>
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

                <div className='d-flex justify-content-center gap-3' style={{ padding: '24px' }}>
                    <div className={style.chartBox}>
                        <div style={{ width: 200, height: 200 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="216" height="215" viewBox="0 0 216 215" fill="none">
                                <circle cx="108" cy="107.499" r="67.9758" stroke="url(#paint0_linear_9278_365203)" strokeOpacity="0.2" strokeWidth="24" />
                                <circle cx="108" cy="107.5" r="95.1661" stroke="url(#paint1_linear_9278_365203)" strokeOpacity="0.2" strokeWidth="24" />
                                <path
                                    id="outer-progress"
                                    d="M108 12.334C126.822 12.334 145.222 17.9154 160.872 28.3724C176.521 38.8293 188.719 53.6923 195.922 71.0816C203.125 88.4709 205.01 107.606 201.338 126.066C197.666 144.526 188.602 161.483 175.293 174.793C161.983 188.102 145.026 197.166 126.566 200.838C108.106 204.51 88.9709 202.625 71.5816 195.422C54.1923 188.219 39.3293 176.021 28.8724 160.371C18.4154 144.722 12.834 126.322 12.834 107.5"
                                    stroke="url(#paint1_linear_9278_365206)"
                                    strokeWidth="24"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray={outerPathLength}
                                    strokeDashoffset={outerDashOffset}
                                />
                                <path
                                    id="progress-path"
                                    d="M108 39.5237C119.269 39.5237 130.361 42.3253 140.279 47.6765C150.196 53.0276 158.628 60.7605 164.815 70.1792C171.002 79.5979 174.75 90.4071 175.722 101.634C176.695 112.861 174.861 124.154 170.385 134.496C165.91 144.838 158.933 153.905 150.084 160.882C141.234 167.859 130.788 172.526 119.687 174.463C108.586 176.4 97.1772 175.548 86.4874 171.981C75.7976 168.415 66.1622 162.247 58.448 154.032"
                                    stroke="url(#paint0_linear_9278_365206)"
                                    strokeWidth="24"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray={innerPathLength}
                                    strokeDashoffset={innerDashOffset}
                                />
                                <defs>
                                    <linearGradient id="paint0_linear_9278_365203" x1="108" y1="39.5237" x2="108" y2="175.475" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#EDF0F3" />
                                        <stop offset="1" stopColor="#D4DBE2" />
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_9278_365203" x1="12.831" y1="202.665" x2="203.164" y2="12.3317" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#FFB258" />
                                        <stop offset="1" stopColor="#1AB2FF" />
                                    </linearGradient>
                                    <linearGradient id="paint0_linear_9278_365206" x1="98.8011" y1="32.6437" x2="12.1132" y2="165.393" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#F3B541" />
                                        <stop offset="1" stopColor="#E4572A" />
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_9278_365206" x1="124.471" y1="-4.15025" x2="7.36385" y2="107.5" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#A3F3AE" />
                                        <stop offset="1" stopColor="#64CAEC" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    <div className={style.rightBox}>
                        <div className={style.firstBox}>
                            <div className='text-center' style={{ width: '240px' }}>
                                <p className={clsx(style.boxlable, 'mb-2')}>Up to date</p>
                                <h1 className={clsx(style.uptoDate)}>${formatAUD(uptoDate)}</h1>
                            </div>
                            <div className={clsx(style.circularProgressDiv)}>
                                {parseFloat(outerProgress).toFixed(2)}%
                            </div>
                            <div className='text-center' style={{ width: '229px' }}>
                                <p className={clsx(style.boxlable, 'mb-2')}>Target</p>
                                <h1 className={clsx(style.target, 'text-nowrap')}>${formatAUD(totalTarget)}</h1>
                            </div>
                        </div>
                        <div className={style.secondBox}>
                            <div className='text-center' style={{ width: '240px' }}>
                                <p className={clsx(style.boxlable, 'mb-2')}>Days Completed</p>
                                <h1 className={clsx(style.daysComplete)}>{daysCompleted}</h1>
                            </div>
                            <div className={clsx(style.circularProgressDiv)}>
                                {parseFloat(innerProgress).toFixed(2)}%
                            </div>
                            <div className='text-center' style={{ width: '229px' }}>
                                <p className={clsx(style.boxlable, 'mb-2')}>Days in Total</p>
                                <h1 className={clsx(style.daysTotal)}>{daysInMonth}</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.divider}></div>

                <div className='d-flex flex-column align-items-center'>
                    {topStatistics?.map((stat, index) => {
                        let progressWidth = parseFloat(stat.target_value) > 0
                            ? (parseFloat(stat.sum) / parseFloat(stat.target_value) * 100)
                            : 0;
                        const progressWidthText = progressWidth;
                        progressWidth = progressWidth > 100 ? 100 : progressWidth;

                        const progressClass = [
                            style.ProgressBarInner,
                            style.ProgressBarInner2,
                            style.ProgressBarInner3,
                            style.ProgressBarInner4
                        ][index];
                        const colors = ['#67a9fd', '#73CEE1', '#34A339', '#D6CC27'];

                        return (
                            <div className={style.chartTextBox} key={stat.name}>
                                <div style={{ width: '150px', textAlign: 'left' }}>
                                    <span className={clsx(style.chartTextLabel)} title={stat.name}>{stat.name}</span>
                                </div>
                                <div className={clsx(style.ProgressBar)}>
                                    <div
                                        style={{ width: `${progressWidth}%` }}
                                        className={clsx(progressClass || style.progressDefaultClass, style.ProgressInnerBar)}
                                    >
                                        <div className={style.ProgressInnerBarPercentage} style={{ right: parseInt(progressWidth) > 10 ? '0px' : '-50px' }}>{parseFloat(progressWidthText).toFixed(2)}%</div>
                                    </div>
                                </div>
                                <div className={style.chartProgressText} style={{ width: '170px', textAlign: 'left' }}>
                                    <span style={{ color: colors[index] }} className={clsx(style.text1)}>
                                        ${formatAUD(stat.sum, true)}
                                    </span> / ${formatAUD(stat.target_value, true)}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <p className={style.bottomText}>Targets can be set under Settings &gt; Accounting &gt; Department Targets.</p>
            </div>
            {keyResultStaticsQuery?.isFetching && <Loader />}
        </PrimeReactProvider>
    );
};

export default KeyResultsPage;