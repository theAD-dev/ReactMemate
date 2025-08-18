import { useEffect, useState } from 'react';
import { CardList, CheckCircle, Filter } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ProgressSpinner } from 'primereact/progressspinner';
import ApprovalTable from './approval-table';
import style from './approval.module.scss';
import ApprovedTable from './approved-table';
import { getToApprovedJobsInvoice } from '../../../../APIs/approval-api';
import { formatAUD } from '../../../../shared/lib/format-aud';

const ApprovalPage = () => {
    const [tab, setTab] = useState('review-approve');
    const handleSearch = () => { };
    const [currentWeek, setCurrentWeek] = useState(null);
    const [currentYear, setCurrentYear] = useState(() => {
        const nowSydney = new Date(
            new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })
        );
        return nowSydney.getFullYear();
    });
    const [weekInfo, setWeekInfo] = useState({ start: '', end: '' });
    let countDown = '';
    if (weekInfo?.end) {
        // Get current Sydney time as a Date object
        const nowSydney = new Date(
            new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })
        );

        // Use the existing Sydney date object from weekInfo without re-parsing
        const diff = weekInfo.end.getTime() - nowSydney.getTime();

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        countDown = `${days}d ${hours}h ${minutes}m`;
    }

    const toInvoiceQuery = useQuery({
        queryKey: ['toInvoice', currentYear, currentWeek],
        queryFn: () => getToApprovedJobsInvoice(currentYear, currentWeek),
        enabled: !!currentWeek && !!currentYear,
        retry: 1,
    });
    console.log('toInvoiceQuery: ', toInvoiceQuery?.data);

    const getWeekDates = (weekNumber, year) => {
        const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
        const dayOfWeek = firstDayOfYear.getUTCDay(); // Sunday = 0
        const daysOffset = (weekNumber - 1) * 7 - ((dayOfWeek + 6) % 7);
        const mondayUTC = new Date(Date.UTC(year, 0, 1 + daysOffset));

        // Convert to Sydney time
        const options = { timeZone: 'Australia/Sydney' };
        const mondaySydney = new Date(mondayUTC.toLocaleString('en-US', options));

        // Week start (if you need it)
        mondaySydney.setHours(12, 1, 0, 0);

        // Default deadline = next Monday 12:00 PM
        let endSydney = new Date(mondaySydney);
        endSydney.setDate(endSydney.getDate() + 7);
        endSydney.setHours(12, 0, 0, 0);

        // 👇 Adjust if today is Monday
        const todaySydney = new Date(
            new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })
        );

        if (todaySydney.getDay() === 1) { // Monday
            if (todaySydney.getHours() < 12) {
                // Before noon → deadline = today 12:00 PM
                endSydney = new Date(todaySydney);
                endSydney.setHours(12, 0, 0, 0);
            } else {
                // After noon → deadline = next Monday 12:00 PM
                endSydney = new Date(todaySydney);
                endSydney.setDate(endSydney.getDate() + 7);
                endSydney.setHours(12, 0, 0, 0);
            }
        }

        return { start: mondaySydney, end: endSydney };
    };

    const updateWeekDates = (week, year) => {
        const { start, end } = getWeekDates(week, year);
        setWeekInfo({
            start: start,
            end: end
        });
    };

    const getWeekNumber = (date) => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    useEffect(() => {
        const todaySydney = new Date(
            new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' })
        );
        const weekNum = getWeekNumber(todaySydney);
        setCurrentWeek(weekNum);

        updateWeekDates(weekNum, currentYear);
    }, []);

    return (
        <div className='approval-page'>
            <Helmet>
                <title>MeMate - Approval</title>
            </Helmet>
            <div className="topbar" style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <div className='left-side d-flex align-items-center' style={{ gap: '16px' }}>
                    <div className='filtered-box'>
                        <button className={`${style.filterBox}`}><Filter size={20} /></button>
                    </div>
                    <div className="searchBox" style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2px', left: '6px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                            </svg>
                        </div>
                        <input type="text" placeholder="Search" onChange={handleSearch} className="border search-resource" style={{ borderRadius: '4px', width: '184px', border: '1px solid #D0D5DD', color: '#424242', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
                    </div>
                </div>

                <div className="featureName d-flex align-items-center" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className={clsx(style.approvalTab, 'd-flex align-items-center gap-2')}>
                        <button className={clsx(style.tabButton, tab === 'review-approve' && style.activeReviewApprove)} onClick={() => setTab('review-approve')}><CardList size={20} color={'#17B26A'} /> Review & Approve</button>
                        <button className={clsx(style.tabButton, tab === 'approved' && style.activeApproved)} onClick={() => setTab('approved')}><CheckCircle size={20} color={'#1AB2FF'} /> Approved Current Week:
                            <div style={{ minWidth: '50px', textAlign: 'left' }}>{toInvoiceQuery?.isFetching ? <ProgressSpinner style={{ width: '18px', height: '18px' }} /> : <span style={{ color: '#106B99', fontWeight: 600 }}>${formatAUD(toInvoiceQuery?.data?.total_amount || 0.00)}</span>}</div>
                        </button>

                    </div>
                </div>

                <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
                    <div className='d-flex gap-1'>
                        <span className='font-12'>This Week’s Approval Period Closes In: </span>
                        <span className='font-12' style={{ fontWeight: 600 }}>{countDown}</span>
                    </div>
                </div>
            </div>
            {tab === 'review-approve' && <ApprovalTable refetchApprovedTotal={() => toInvoiceQuery.refetch()} />}
            {tab === 'approved' && <ApprovedTable />}
        </div>
    );
};

export default ApprovalPage;
