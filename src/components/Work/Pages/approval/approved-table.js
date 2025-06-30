import React, { useCallback, useEffect, useState } from 'react';
import { ClockHistory } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Chip } from 'primereact/chip';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';
import { Row } from 'primereact/row';
import { toast } from 'sonner';
import style from './approval.module.scss';
import WeekNavigator from './week-navigator';
import { getApproveNotInvoice } from '../../../../APIs/approval-api';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { formatAUD } from '../../../../shared/lib/format-aud';
import Loader from '../../../../shared/ui/loader/loader';
import { FallbackImage } from '../../../../ui/image-with-fallback/image-avatar';

const ApprovedTable = React.memo(() => {
    const { trialHeight } = useTrialHeight();
    const [selectedInvoiceApprovals, setSelectedInvoiceApprovals] = useState(null);
    const [weekData, setSelectedPeriod] = useState({
        week: null,
        year: null,
        startDate: null,
        endDate: null
    });

    const handleWeekChange = useCallback((periodData) => {
        setSelectedPeriod(periodData);
    }, []);

    const fetchInvoiceData = React.useCallback(() => {
        if (!weekData?.week || !weekData?.year) {
            return Promise.resolve([]);
        }
        return getApproveNotInvoice(weekData.year, weekData.week);
    }, [weekData?.week, weekData?.year]);

    const {
        data: invoiceData = [],
        isLoading: isLoadingInvoice,
        error: invoiceError
    } = useQuery({
        queryKey: ['jobsToInvoice', weekData?.week, weekData?.year],
        queryFn: fetchInvoiceData,
        enabled: !!weekData?.week && !!weekData?.year,
        refetchOnWindowFocus: true,
        staleTime: 0,
        onError: (error) => {
            toast.error('Failed to load approved jobs for invoicing');
            console.error('Error loading jobs to invoice:', error);
        }
    });

    const jobTypeBody = (rowData) => {
        if (rowData.type === "2" && rowData.time_type === "1") {
            return <div className={style.type}>
                <div className={style.shift}>Shift</div>
                <div className={style.fix}>Fix</div>
            </div>;
        }

        if (rowData.type === "2" && rowData.time_type === "T") {
            return <div className={style.type}>
                <div className={style.timeFrame}>Time Frame</div>
                <div className={style.fix}>Fix</div>
            </div>;
        }

        if (rowData.type === "3" && rowData.time_type === "1") {
            return <div className={style.type}>
                <div className={style.shift}>Shift</div>
                <div className={style.hours}>Hours</div>
            </div>;
        }

        if (rowData.type === "3" && rowData.time_type === "T") {
            return <div className={style.type}>
                <div className={style.timeFrame}>Time Frame</div>
                <div className={style.hours}>Hours</div>
            </div>;
        }

        if (rowData.type === "Time Tracker" && rowData.time_type === "T") {
            return <div className={style.type}>
                <div className={style.timeTracker}>Time Tracker</div>
                <div className={style.timeFrame2}>Time Frame</div>
            </div>;
        }
        return "";
    };

    const nameBody = (rowData) => {
        const fullName = `${rowData.worker?.first_name || ''} ${rowData.worker?.last_name || ''}`.trim();
        const initials = fullName ? fullName.split(' ').map(word => word[0]).join('') : 'N/A';

        return <div className='d-flex align-items-center'>
            <div className={`d-flex justify-content-center align-items-center ${style.clientName}`}>
                {rowData.worker?.has_photo ? (
                    <FallbackImage
                        has_photo={rowData.worker?.has_photo}
                        photo={rowData.worker?.photo}
                        is_business={false}
                        size={16}
                    />
                ) : initials}
            </div>
            {fullName || 'N/A'}
        </div>;
    };

    const statusBody = () => {
        return <Chip className={`status ${style.approved}`} label="Approved" />;
    };


    const formatDate = React.useCallback((dateString) => {
        if (!dateString) return 'N/A';

        try {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months[date.getMonth()];

            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString || 'N/A';
        }
    }, []);

    const linkToBody = (rowData) => {
        if (!rowData?.project) return '-';

        return <div className='d-flex align-items-center'>
            <div className={`d-flex justify-content-center align-items-center ${style.clientImg} ${rowData?.client?.is_business ? style.square : 'rounded-circle'}`}>
                <FallbackImage photo={rowData?.client?.photo} is_business={rowData?.client?.is_business || false} has_photo={rowData?.client?.has_photo || false} />
            </div>
            <div className='d-flex flex-column'>
                <span>{rowData?.project?.reference}</span>
                <span className='font-12' style={{ color: '#98A2B3' }}><Link className={`${style.linkToProjectCard}`} to={`/management?unique_id=${rowData?.project?.unique_id}&reference=${rowData?.project?.reference}&number=${rowData?.project?.number}`}>{rowData?.project?.number}</Link> | {rowData?.client?.name}</span>
            </div>
        </div>;
    };

    const calculateHours = (spentTime) => {
        const [h, m, s] = spentTime.split(':');
        const totalSeconds = parseInt(h) * 3600 + parseInt(m) * 60 + parseFloat(s);
        const totalHours = totalSeconds / 3600;
        return totalHours.toFixed(2); // returns string like "0.01"
    };

    const realTimeBody = (rowData) => {
        const hours = calculateHours(rowData.spent_time || "0:00:00.000000");

        return (
            <div className="d-flex align-items-center gap-1">
                <span className="me-1">{hours}h</span>
                <ClockHistory color='#667085' size={16} />
            </div>
        );
    };

    const totalBody = (rowData) => {
        return `$${formatAUD(rowData.total)}`;
    };

    const realTotalBody = (rowData) => {
        return <span>${formatAUD(rowData.real_total)}</span>;
    };

    const workerHeader = () => {
        return <div className='d-flex align-items-center gap-1'>
            Name
            <small>A→Z</small>
        </div>;
    };

    const invoiceTotal = React.useMemo(() => {
        if (!invoiceData || invoiceData.length === 0) return 0;
        return invoiceData.reduce((sum, job) => sum + parseFloat(job.total || 0), 0);
    }, [invoiceData]);


    const invoiceFooterGroup = React.useMemo(() => {
        const formattedTotal = invoiceTotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return (
            <ColumnGroup>
                <Row className='w-100'>
                    <Column colSpan={10} />
                    <Column
                        footer={`Total= $${formattedTotal}`}
                        footerStyle={{ position: 'sticky', right: 0 }}
                    />
                    <Column colSpan={1} />
                </Row>
            </ColumnGroup>
        );
    }, [invoiceTotal]);

    useEffect(() => {
        if (invoiceError) {
            toast.error(`Error loading jobs to invoice: ${invoiceError.message || 'Please try again later'}`);
        }
    }, [invoiceError]);

    return (
        <>
            <div className="topbar d-flex justify-content-center text-center w-100" style={{ padding: '4px 0px', position: 'relative', height: '48px', borderTop: '1px solid #dedede', borderBottom: '0px solid #dedede', background: '#F9FAFB' }}>
                <WeekNavigator onWeekChange={handleWeekChange} />
            </div>

            {/* Jobs to Invoice DataTable */}
            <DataTable
                value={invoiceData || []}
                footerColumnGroup={invoiceFooterGroup}
                scrollable
                selectionMode={'checkbox'}
                removableSort
                columnResizeMode="expand"
                resizableColumns
                showGridlines
                size={'large'}
                scrollHeight={`calc(100vh - 175px - 45px - ${trialHeight}px)`}
                className="border-0"
                selection={selectedInvoiceApprovals}
                onSelectionChange={(e) => setSelectedInvoiceApprovals(e.value)}
                emptyMessage="No approved jobs waiting to be invoiced"
                loading={isLoadingInvoice}
                loadingIcon={Loader}
            >
                <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
                <Column field="number" header="Job ID" style={{ minWidth: '100px' }} frozen sortable></Column>
                <Column field='type' header="Job Type" body={jobTypeBody} style={{ minWidth: '100px' }} bodyClassName={`${style.shadowRight}`} headerClassName={`${style.shadowRight}`} frozen sortable></Column>
                <Column field="submitted" header="Approved" style={{ minWidth: '122px' }} sortable body={(rowData) => formatDate(rowData.submitted)}></Column>
               <Column field="worker.first_name" header={workerHeader} body={nameBody} style={{ minWidth: '205px' }}></Column>
                <Column field="short_description" header="Job Reference" style={{ minWidth: '270px' }}></Column>
                <Column field="project.number" header="Linked To Project" body={linkToBody} style={{ minWidth: '105px' }}></Column>
                <Column field="variations" header="Variations" style={{ minWidth: '105px' }} sortable></Column>
                <Column field="real_total" header="Real Total" body={realTotalBody} style={{ minWidth: '105px' }} sortable></Column>
                <Column field="spent_time" header="Real Time" body={realTimeBody} style={{ minWidth: '105px' }}></Column>
                <Column field="total" header="Total" body={totalBody} style={{ minWidth: '105px' }} sortable></Column>
                <Column field="id" header="Status" body={statusBody} style={{ minWidth: '120px' }} bodyClassName={clsx(`${style.shadowLeft}`, 'text-center')} headerClassName={clsx(`${style.shadowLeft}`, 'd-flex justify-content-center')} frozen alignFrozen="right"></Column>
            </DataTable>
        </>
    );
});

export default ApprovedTable;