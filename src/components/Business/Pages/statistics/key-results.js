import React, { useState } from 'react'
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import style from './statistics.module.scss';
import { Calendar as CalendarIcon, Clipboard, ClipboardData, Google, PieChart, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { Button } from 'react-bootstrap';

const KeyResultsPage = () => {
    const [date, setDate] = useState(null);
    return (
        <PrimeReactProvider className='peoples-page'>
            <div className={`topbar ${style.borderTopbar}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <Link className='d-flex align-items-center px-2'>
                    <PieChart color='#9E77ED' size={16} className='me-2' />
                    <span className={style.topbartext}>Executive</span>
                </Link>
                <Link className='d-flex align-items-center px-2'>
                    <Speedometer2 color='#17B26A' size={16} className='me-2' />
                    <span className={style.topbartext}>Conversion</span>
                </Link>
                <Link className='d-flex align-items-center px-2'>
                    <TextParagraph color='#F04438' size={16} className='me-2' />
                    <span className={style.topbartext}>Overview</span>
                </Link>
                <Link className={clsx(style.activeTab, 'd-flex align-items-center px-2 py-1')}>
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
            <div className={clsx(style.keyResults)} style={{ padding: "24px", marginBottom: '20px', overflow: 'auto', height: 'calc(100vh - 175px)' }}>
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
                    <div className={style.chartBox}></div>
                    <div className={style.rightBox}>
                        <div className={style.firstBox}></div>
                        <div className={style.secondBox}></div>
                    </div>
                </div>

                <div className={style.divider}></div>

                <div className='d-flex flex-column align-items-center'>
                    <div className={style.chartTextBox}></div>
                    <div className={style.chartTextBox}></div>
                    <div className={style.chartTextBox}></div>
                    <div className={style.chartTextBox}></div>
                </div>
            </div>

        </PrimeReactProvider>
    )
}

export default KeyResultsPage