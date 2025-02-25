import { PrimeReactProvider } from 'primereact/api';
import React, { } from 'react';

import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Button } from 'react-bootstrap';
import { Calendar as CalendarIcon, ClipboardData, Google, PieChart, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import style from './statistics.module.scss';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';

const KeyResultsPage = () => {
    const { trialHeight } = useTrialHeight();
    return (
        <PrimeReactProvider className='peoples-page'>
            <div className={`topbar ${style.borderTopbar}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <Link to={"/statistics/executive"} className='d-flex align-items-center px-2'>
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
                <Link to={"/statistics/key-results"} className={clsx(style.activeTab, 'd-flex align-items-center px-2 py-1')}>
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
            <div className={clsx(style.keyResults)} style={{ padding: "24px", marginBottom: '20px', overflow: 'auto', height: `calc(100vh - 175px - ${trialHeight}px)` }}>
                <h2 className={clsx(style.keyResultsTitle)}>Key Results</h2>
                <Button className={clsx(style.button, "outline-button mx-auto")}>
                    <CalendarIcon color='#475467' size={16} />
                    2024
                </Button>

                <div className='d-flex justify-content-center gap-0' style={{ marginTop: '16px', borderBottom: "1px solid var(--Gray-200, #EAECF0)" }}>
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

                <div className='d-flex justify-content-center gap-3' style={{ padding: '24px' }}>
                    <div className={style.chartBox}>
                        <div style={{ width: 200, height: 200 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="216" height="215" viewBox="0 0 216 215" fill="none">
                                <path d="M108 39.5237C119.269 39.5237 130.361 42.3253 140.279 47.6765C150.196 53.0276 158.628 60.7605 164.815 70.1792C171.002 79.5979 174.75 90.4071 175.722 101.634C176.695 112.861 174.861 124.154 170.385 134.496C165.91 144.838 158.933 153.905 150.084 160.882C141.234 167.859 130.788 172.526 119.687 174.463C108.586 176.4 97.1772 175.548 86.4874 171.981C75.7976 168.415 66.1622 162.247 58.448 154.032" stroke="#F41E5A" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M108 39.5237C119.269 39.5237 130.361 42.3253 140.279 47.6765C150.196 53.0276 158.628 60.7605 164.815 70.1792C171.002 79.5979 174.75 90.4071 175.722 101.634C176.695 112.861 174.861 124.154 170.385 134.496C165.91 144.838 158.933 153.905 150.084 160.882C141.234 167.859 130.788 172.526 119.687 174.463C108.586 176.4 97.1772 175.548 86.4874 171.981C75.7976 168.415 66.1622 162.247 58.448 154.032" stroke="url(#paint0_linear_9278_365206)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M108 12.334C126.822 12.334 145.222 17.9154 160.872 28.3724C176.521 38.8293 188.719 53.6923 195.922 71.0816C203.125 88.4709 205.01 107.606 201.338 126.066C197.666 144.526 188.602 161.483 175.293 174.793C161.983 188.102 145.026 197.166 126.566 200.838C108.106 204.51 88.9709 202.625 71.5816 195.422C54.1923 188.219 39.3293 176.021 28.8724 160.371C18.4154 144.722 12.834 126.322 12.834 107.5" stroke="url(#paint1_linear_9278_365206)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
                                <defs>
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
                                <h1 className={clsx(style.uptoDate)}>$ 6,487.00</h1>
                            </div>
                            <div className={clsx(style.circularProgressDiv)}>
                                70%
                            </div>
                            <div className='text-center' style={{ width: '229px' }}>
                                <p className={clsx(style.boxlable, 'mb-2')}>Target</p>
                                <h1 className={clsx(style.target, 'text-nowrap')}>$ 10,000,000.00</h1>
                            </div>
                        </div>
                        <div className={style.secondBox}>
                            <div className='text-center' style={{ width: '240px' }}>
                                <p className={clsx(style.boxlable, 'mb-2')}>Days Completed</p>
                                <h1 className={clsx(style.daysComplete)}>20</h1>
                            </div>
                            <div className={clsx(style.circularProgressDiv)}>
                                20%
                            </div>
                            <div className='text-center' style={{ width: '229px' }}>
                                <p className={clsx(style.boxlable, 'mb-2')}>Days in Total</p>
                                <h1 className={clsx(style.daysTotal)}>24</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.divider}></div>

                <div className='d-flex flex-column align-items-center'>
                    <div className={style.chartTextBox}>
                        <div style={{ width: '150px', textAlign: 'left' }}>
                            <span className={clsx(style.chartTextLable)}>Design</span>
                        </div>

                        <div className={clsx(style.ProgressBar)}>
                            <div style={{ width: '90%' }} className={clsx(style.ProgressBarInner)}></div>
                        </div>

                        <div className={style.chartProgressText} style={{ width: '170px', textAlign: 'left' }}>
                            <span style={{ color: '#67a9fd' }} className={clsx(style.text1)}>715.01</span>  / $1,000.00
                        </div>
                    </div>

                    <div className={style.chartTextBox}>
                        <div style={{ width: '150px', textAlign: 'left' }}>
                            <span className={clsx(style.chartTextLable)}>Development</span>
                        </div>

                        <div className={clsx(style.ProgressBar)}>
                            <div style={{ width: '70%' }} className={clsx(style.ProgressBarInner2)}></div>
                        </div>

                        <div className={style.chartProgressText} style={{ width: '170px', textAlign: 'left' }}>
                            <span style={{ color: '#73CEE1' }} className={clsx(style.text1)}>3,000.00</span>  / $3,000.00
                        </div>
                    </div>

                    <div className={style.chartTextBox}>
                        <div style={{ width: '150px', textAlign: 'left' }}>
                            <span className={clsx(style.chartTextLable)}>Mobile Application</span>
                        </div>

                        <div className={clsx(style.ProgressBar)}>
                            <div style={{ width: '60%' }} className={clsx(style.ProgressBarInner3)}></div>
                        </div>

                        <div className={style.chartProgressText} style={{ width: '170px', textAlign: 'left' }}>
                            <span style={{ color: '#34A339' }} className={clsx(style.text1)}>3,000.00</span>  / $3,000.00
                        </div>
                    </div>

                    <div className={style.chartTextBox}>
                        <div style={{ width: '150px', textAlign: 'left' }}>
                            <span className={clsx(style.chartTextLable)}>Web Application</span>
                        </div>

                        <div className={clsx(style.ProgressBar)}>
                            <div style={{ width: '50%' }} className={clsx(style.ProgressBarInner4)}></div>
                        </div>

                        <div className={style.chartProgressText} style={{ width: '170px', textAlign: 'left' }}>
                            <span style={{ color: '#D6CC27' }} className={clsx(style.text1)}>3,000.00</span>  / $3,000.00
                        </div>
                    </div>
                </div>
            </div>

        </PrimeReactProvider>
    );
};

export default KeyResultsPage;