import React, { useEffect, useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Calendar as CalendarIcon, ClipboardData, Google, PieChart, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import Dropdown from 'react-bootstrap/Dropdown';
import { getKeyResultStatics } from './api/statistics-api';
import style from './statistics.module.scss';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { formatAUD } from '../../../../shared/lib/format-aud';
import Loader from '../../../../shared/ui/loader/loader';

const KeyResultsPage = () => {
    const { trialHeight } = useTrialHeight();
    const [selectedType, setSelectedType] = useState("Invoice Generated");
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [outerProgress, setOuterProgress] = useState(0);
    const [uptoDate, setUptoDate] = useState(0);
    const [totalTarget, setTotalTarget] = useState(0);
    const [innerProgress, setInnerProgress] = useState(0);

    const keyResultStaticsQuery = useQuery({
        queryKey: ["getKeyResultStatics", selectedYear, selectedMonth],
        queryFn: () => getKeyResultStatics(selectedYear, months.indexOf(selectedMonth) + 1),
        enabled: !!(selectedMonth && selectedYear),
        retry: 1
    });

    // Path lengths (approximated)
    const outerRadius = 95.1661; // From the existing outer circle
    const outerPathLength = 2 * Math.PI * outerRadius; // Full circle circumference ≈ 597.65
    const innerRadius = 67.9758; // From the existing circle
    const innerPathLength = 2 * Math.PI * innerRadius; // Full circle circumference ≈ 426.94

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const daysInMonth = new Date(selectedYear || currentYear, months.indexOf(selectedMonth) + 1, 0).getDate();
    const daysCompleted = (selectedYear === currentYear && currentMonthIndex === months.indexOf(selectedMonth)) ? Math.min(currentDate.getDate(), daysInMonth) : daysInMonth;

    const isMonthDisabled = (month, year) => {
        const monthIndex = months.indexOf(month);
        return year === currentDate.getFullYear() && monthIndex > currentMonthIndex;
    };

    const handleYearSelect = (year) => {
        setSelectedYear(year);
    };

    const handleTypeSelect = (type) => {
        setSelectedType(type);
    };

    const handleMonthSelect = (month) => {
        if (!isMonthDisabled(month, selectedYear)) {
            setSelectedMonth(month);
        }
    };

    useEffect(() => {
        if (keyResultStaticsQuery.data) {
            let statisticsData = keyResultStaticsQuery?.data?.statistics || [];
            if (selectedType === 'Generated revenue') statisticsData = keyResultStaticsQuery?.data?.revenue || [];

            const totalTarget = statisticsData.reduce((acc, curr) =>
                acc + parseFloat(curr.target_value), 0);
            const totalSum = statisticsData.reduce((acc, curr) =>
                acc + parseFloat(curr.sum), 0);
            const progress = totalTarget > 0 ? (totalSum / totalTarget) * 100 : 0;
            setOuterProgress(progress);
            setUptoDate(totalSum);
            setTotalTarget(totalTarget);
        }

        // Update inner progress based on days
        const daysProgress = daysInMonth > 0 ? (daysCompleted / daysInMonth) * 100 : 0;
        setInnerProgress(daysProgress);
    }, [keyResultStaticsQuery.data, selectedMonth, selectedYear, daysCompleted, daysInMonth, selectedType]);

    useEffect(() => {
        const currentDate = new Date();
        setSelectedYear(currentDate.getUTCFullYear());
        setSelectedMonth(months[currentDate.getMonth()]);
    }, []);

    // Calculate dash offsets dynamically
    const outerDashOffset = outerPathLength * (1 - outerProgress / 100);
    const innerDashOffset = innerPathLength * (1 - innerProgress / 100);

    const statistics = selectedType === 'Generated revenue' ? (keyResultStaticsQuery?.data?.revenue || []) : (keyResultStaticsQuery?.data?.statistics || []);
    const topStatistics = [...statistics]
        .sort((a, b) => parseFloat(b.sum) - parseFloat(a.sum));

    return (
        <div className='peoples-page'>
            <div className={`topbar ${style.borderTopbar}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                {/* Executive - disabled */}
                <Link to={"/statistics/executive"} className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <PieChart color='#9E77ED' size={16} className='me-2' />
                    <span className={style.topbartext}>Executive</span>
                </Link>
                {/* Sales Conversion - disabled */}
                <Link to={"/statistics/sales-conversion"} className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <Speedometer2 color='#17B26A' size={16} className='me-2' />
                    <span className={style.topbartext}>Conversion</span>
                </Link>
                {/* Overview - disabled */}
                <Link to={"/statistics/overview"} className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <TextParagraph color='#F04438' size={16} className='me-2' />
                    <span className={style.topbartext}>Overview</span>
                </Link>
                {/* Key Results - enabled (current page) */}
                <Link to={"/statistics/key-results"} className={clsx(style.activeTab, 'd-flex align-items-center px-2 py-1')}>
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
            <div className={clsx(style.keyResults)} style={{ padding: "24px", marginBottom: '20px', overflow: 'auto', height: `calc(100vh - 175px - ${trialHeight}px)` }}>
                <OverlayTrigger
                    key={'top'}
                    placement={'top'}
                    overlay={
                        <Tooltip className='TooltipOverlay width-300' id={`tooltip-${top}`}>
                            The key result has to be measurable. But at the end you can look, and without any arguments No judgments in it.
                        </Tooltip>
                    }
                >
                    <h2 className={clsx(style.keyResultsTitle)}>Key Results</h2>
                </OverlayTrigger>

                <div className='d-flex justify-content-center gap-3'>
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

                    <Dropdown>
                        <Dropdown.Toggle as={Button} className={clsx(style.button, "outline-button mx-auto")}>
                            {selectedType}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                key={'Invoice Generated'}
                                eventKey={'Invoice Generated'}
                                active={selectedType === 'Invoice Generated'}
                                onClick={() => handleTypeSelect('Invoice Generated')}
                            >
                                Invoice Generated
                            </Dropdown.Item>
                            <Dropdown.Item
                                key={'Generated revenue'}
                                eventKey={'Generated revenue'}
                                active={selectedType === 'Generated revenue'}
                                onClick={() => handleTypeSelect('Generated revenue')}
                            >
                                Generated revenue
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

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
                                    d="M108,12.334 A95.1661,95.1661 0 0 1 203.1661,107.5 A95.1661,95.1661 0 0 1 108,202.6661 A95.1661,95.1661 0 0 1 12.8339,107.5 A95.1661,95.1661 0 0 1 108,12.334 Z"
                                    stroke="url(#paint1_linear_9278_365206)"
                                    strokeWidth="24"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeDasharray={outerPathLength}
                                    strokeDashoffset={outerDashOffset}
                                />
                                <path
                                    id="progress-path"
                                    d="M108,39.5237 A67.9758,67.9758 0 0 1 175.9758,107.499 A67.9758,67.9758 0 0 1 108,175.4746 A67.9758,67.9758 0 0 1 40.0242,107.499 A67.9758,67.9758 0 0 1 108,39.5237 Z"
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
        </div>
    );
};

export default KeyResultsPage;