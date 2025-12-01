import React from 'react';
import { ClipboardData, Google, PieChart, ShopWindow, Speedometer2, TextParagraph, WindowDesktop } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import style from '../statistics.module.scss';

const StatisticsHeader = ({ page }) => {
  return (
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
      <Link to={"/statistics/profitability"} style={ page === "profitability" ? { background: "#ECFDF3", color: "#26786C" } : {}} className={clsx( page === "profitability" ? style.activeTab : '', 'd-flex align-items-center px-2 py-1')}>
        <ShopWindow color='#15B79E' size={16} className='me-2' />
        <span className={style.topbartext} style={ page === "profitability" ? { color: "#26786C" } : {}}>Profitability</span>
      </Link>
    </div>
  );
};

export default StatisticsHeader;