import React from 'react';
import { ClipboardData, Google, PieChart, ShopWindow, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import style from './statistics.module.scss';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';

const StatisticsPage = () => {
    const { trialHeight } = useTrialHeight();

    return (
        <div className='peoples-page'>
            <Helmet>
                <title>MeMate - Statistics</title>
            </Helmet>
            <div className={`topbar ${style.borderTopbar}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <Link to={"/statistics/executive"} className={clsx('d-flex align-items-center px-2 py-1')}>
                    <PieChart color='#9E77ED' size={16} className='me-2' />
                    <span className={style.topbartext}>Executive</span>
                </Link>
                <Link to={"/statistics/sales-conversion"} className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <Speedometer2 color='#17B26A' size={16} className='me-2' />
                    <span className={style.topbartext}>Conversion</span>
                </Link>
                <Link to={"/statistics/overview"} className={clsx('d-flex align-items-center px-2 py-1')}>
                    <TextParagraph color='#F04438' size={16} className='me-2' />
                    <span className={style.topbartext}>Overview</span>
                </Link>
                <Link to={"/statistics/key-results"} className='d-flex align-items-center px-2 py-1'>
                    <WindowDesktop color='#667085' size={16} className='me-2' />
                    <span className={style.topbartext}>Key Results</span>
                </Link>
                <Link className={clsx('d-flex align-items-center px-2 py-1', style.disabledLink)}>
                    <ClipboardData color='#084095' size={16} className='me-2' />
                    <span className={style.topbartext}>Reports</span>
                </Link>
                <Link to={"/statistics/google-analytics"} className={clsx('d-flex align-items-center px-2 py-1')}>
                    <Google color='#F79009' size={16} className='me-2' />
                    <span className={style.topbartext}>GA Widgets</span>
                </Link>
                <Link to={"/statistics/profitability"} className={clsx('d-flex align-items-center px-2 py-1')}>
                    <ShopWindow color='#15B79E' size={16} className='me-2' />
                    <span className={style.topbartext}>Profitability</span>
                </Link>
            </div>
            <div style={{ padding: "72px 128px", marginBottom: '20px', overflow: 'auto', height: `calc(100vh - 175px - ${trialHeight}px)` }}>
                <div className='d-flex justify-content-center' style={{ gap: '24px' }}>
                    <Link to={"/statistics/executive"} className={clsx(style.box)}>
                        <div className={style.executiveBox}>
                            <PieChart color='#9E77ED' size={40} />
                        </div>
                        <h4 className={style.boxTitle}>Executive</h4>
                        <p className={style.boxSubtitle}>
                            Provides analytics that display the overall direction of turnover, along with the proportions of operational profit and expenses.
                        </p>
                    </Link>
                    <Link to={"/statistics/sales-conversion"} className={clsx(style.box, style.disabledLink)}>
                        <div className={clsx(style.executiveBox, style.executiveBox2)}>
                            <Speedometer2 color='#17B26A' size={40} />
                        </div>
                        <h4 className={style.boxTitle}>Conversion</h4>
                        <p className={style.boxSubtitle}>
                            Provides analytics that display the overall direction of turnover, along with the proportions of operational profit and expenses.
                        </p>
                    </Link>
                    <Link to={"/statistics/overview"} className={clsx(style.box)}>
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
                        <h4 className={style.boxTitle}>Key Results</h4>
                        <p className={style.boxSubtitle}>
                            Sets monthly targets and tracks month-to-month invoice volume or income, segmented by departments.
                        </p>
                    </Link>
                    <Link className={clsx(style.box, style.disabledLink)}>
                        <div className={clsx(style.executiveBox, style.executiveBox5)}>
                            <ClipboardData color='#084095' size={40} />
                        </div>
                        <h4 className={style.boxTitle}>Reports</h4>
                        <p className={style.boxSubtitle}>
                            Offers various reports to assist in analysing business directions and the details of money flow.
                        </p>
                    </Link>
                    <Link to={"/statistics/google-analytics"} className={clsx(style.box)}>
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
        </div>
    );
};

export default StatisticsPage;