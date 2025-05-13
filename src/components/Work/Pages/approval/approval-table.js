import React, { useCallback, useEffect, useState } from 'react';
import { Link45deg, Person, Repeat } from 'react-bootstrap-icons';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Chip } from 'primereact/chip';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Row } from 'primereact/row';
import { Tag } from 'primereact/tag';
import { toast } from 'sonner';
import style from './approval.module.scss';
import WeekNavigator from './week-navigator';
import { getJobsToApprove, getApproveNotInvoice } from '../../../../APIs/approval-api';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { FallbackImage } from '../../../../ui/image-with-fallback/image-avatar';
import ApproveJob from '../../features/approve-job/approve-job';

const ApprovalTable = React.memo(() => {
    const { trialHeight } = useTrialHeight();
    const [selectedApprovals, setSelectedApprovals] = useState(null);
    const [selectedInvoiceApprovals, setSelectedInvoiceApprovals] = useState(null);
    const [weekData, setSelectedPeriod] = useState({
        week: null,
        year: null,
        startDate: null,
        endDate: null
    });

    const [isApproveJobVisible, setIsApproveJobVisible] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);

    const handleWeekChange = useCallback((periodData) => {
        setSelectedPeriod(periodData);
    }, []);

    const {
        data: approveData = [],
        isLoading: isLoadingApprove,
        error: approveError
    } = useQuery({
        queryKey: ['jobsToApprove'],
        queryFn: getJobsToApprove,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error('Failed to load jobs to approve');
            console.error('Error loading jobs to approve:', error);
        }
    });

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
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error('Failed to load approved jobs for invoicing');
            console.error('Error loading jobs to invoice:', error);
        }
    });

    const paymentBody = (rowData) => {
        const paymentType = rowData.time_type === "1" ? "Hours" : "Fix";
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ gap: '10px' }}>
                <div className={`${style.payment} ${paymentType === 'Hours' ? style.paymentHours : style.paymentFix}`}>
                    {paymentType}
                </div>
                <Repeat color='#158ECC' />
            </div>
        );
    };

    const timeBody = (rowData) => {
        const timeType = rowData.type === "2" ? "TimeFrame" : "TimeTracker";
        return (
            <div className={`d-flex align-items-center show-on-hover`}>
                <div className={`${style.time} ${timeType === 'TimeFrame' ? style.frame : style.tracker}`}>
                    {timeType}
                </div>
            </div>
        );
    };

    const clientHeader = () => {
        return <div className='d-flex align-items-center'>
            Client
            <small>A→Z</small>
        </div>;
    };

    const clientBody = (rowData) => {
        return <div className='d-flex align-items-center'>
            <div className={`d-flex justify-content-center align-items-center ${style.clientImg}`}>
                <FallbackImage
                    has_photo={rowData.client?.has_photo}
                    photo={rowData.client?.photo}
                    is_business={true}
                    size={16}
                />
            </div>
            {rowData.client?.name || 'N/A'}
        </div>;
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

    const actionBody = (rowData) => {
        return (
            <div className='d-flex justify-content-center gap-2'>
                <Chip
                    className={`status ${style.finishedAction} cursor-pointer`}
                    label="Approve"
                    onClick={() => handleApprove(rowData.id)}
                />
            </div>
        );
    };

    const statusBody = () => {
        return <Chip className={`status ${style.approved}`} label="Approved" />;
    };

    const handleApprove = React.useCallback((id) => {
        setSelectedJobId(id);
        setIsApproveJobVisible(true);
    }, []);


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
        return rowData.project ? (
            <div className='d-flex align-items-center' style={{ gap: '10px' }}>
                {rowData.project.number}
                <Link45deg color='#3366CC' />
            </div>
        ) : 'N/A';
    };

    const totalBody = (rowData) => {
        return <Tag value={rowData.total} style={{ border: "2px solid var(--Orange-200, #FFE0BC)", background: '#FFF7EE', color: '#FFB258', fontSize: '12px', fontWeight: 500 }} rounded></Tag>;
    };

    const thisWeekTotalBody = (rowData) => {
        return <span style={{ fontWeight: 'bold' }}>{rowData.total}</span>;
    };

    const header = (
        <div className="d-flex align-items-center justify-content-end gap-2" style={{ position: 'relative' }}>
            <p style={{ color: '#344054', fontWeight: 400 }} className='m-0 font-14'>Review & Approve</p>
            {isLoadingApprove && <ProgressSpinner style={{ width: '20px', height: '20px', marginLeft: '8px', position: 'absolute', right: '-40px' }} />}
        </div>
    );

    const header2 = (
        <div className="d-flex align-items-center justify-content-between gap-2" style={{ position: 'relative' }}>
            <p style={{ color: '#344054', fontWeight: 500 }} className='m-0 font-14'>
                {weekData?.week && weekData?.year
                    ? `Week ${weekData.week}, ${weekData.year} - Approved Jobs (Not Invoiced)`
                    : 'Approved Jobs - Not Invoiced'}
            </p>
            {isLoadingInvoice && <ProgressSpinner style={{ width: '20px', height: '20px', marginRight: '8px', position: 'absolute', right: '-40px' }} />}
        </div>
    );

    const approveTotal = React.useMemo(() => {
        if (!approveData || approveData.length === 0) return 0;
        return approveData.reduce((sum, job) => sum + parseFloat(job.total || 0), 0);
    }, [approveData]);

    const invoiceTotal = React.useMemo(() => {
        if (!invoiceData || invoiceData.length === 0) return 0;
        return invoiceData.reduce((sum, job) => sum + parseFloat(job.total || 0), 0);
    }, [invoiceData]);

    const approveFooterGroup = React.useMemo(() => {
        const formattedTotal = approveTotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return (
            <ColumnGroup>
                <Row className='w-100'>
                    <Column colSpan={12} />
                    <Column
                        footer={`Total= $${formattedTotal}`}
                        footerStyle={{ position: 'sticky', right: 0 }}
                    />
                </Row>
            </ColumnGroup>
        );
    }, [approveTotal]);

    const invoiceFooterGroup = React.useMemo(() => {
        const formattedTotal = invoiceTotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return (
            <ColumnGroup>
                <Row className='w-100'>
                    <Column colSpan={12} />
                    <Column
                        footer={`Total= $${formattedTotal}`}
                        footerStyle={{ position: 'sticky', right: 0 }}
                    />
                </Row>
            </ColumnGroup>
        );
    }, [invoiceTotal]);

    useEffect(() => {
        if (approveError) {
            toast.error(`Error loading jobs to approve: ${approveError.message || 'Please try again later'}`);
        }
        if (invoiceError) {
            toast.error(`Error loading jobs to invoice: ${invoiceError.message || 'Please try again later'}`);
        }
    }, [approveError, invoiceError]);

    return (
        <>
            {/* Jobs to Approve DataTable */}
            <DataTable
                value={approveData}
                header={header}
                footerColumnGroup={approveFooterGroup}
                scrollable
                selectionMode={'checkbox'}
                removableSort
                columnResizeMode="expand"
                resizableColumns
                showGridlines
                size={'large'}
                scrollHeight="calc(50vh - 150px)"
                className="border-0"
                selection={selectedApprovals}
                onSelectionChange={(e) => setSelectedApprovals(e.value)}
                emptyMessage="No jobs to approve"
                loading={isLoadingApprove}
                loadingIcon={<></>}
            >
                <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
                <Column field="number" header="Job ID" style={{ minWidth: '100px' }} frozen sortable></Column>
                <Column field="time_type" header="Payment Type" body={paymentBody} style={{ minWidth: '130px' }} frozen sortable></Column>
                <Column field="type" header="Time" body={timeBody} style={{ minWidth: '118px' }} bodyClassName={`${style.shadowRight}`} headerClassName={`${style.shadowRight}`} frozen></Column>
                <Column
                    field="submitted"
                    header="Submitted"
                    style={{ minWidth: '122px' }}
                    sortable
                    body={(rowData) => formatDate(rowData.submitted)}
                ></Column>
                <Column field="short_description" header="Job Reference" style={{ minWidth: '270px' }}></Column>
                <Column field="client.name" header={clientHeader} body={clientBody} style={{ minWidth: '162px' }}></Column>
                <Column field="project.number" header="Linked To Project" body={linkToBody} style={{ minWidth: '105px' }}></Column>
                <Column field="worker.first_name" header="Worker" body={nameBody} style={{ minWidth: '205px' }}></Column>
                <Column field="spent_time" header="Spent Time" style={{ minWidth: '105px' }} sortable></Column>
                <Column field="real_total" header="Real Total" body={thisWeekTotalBody} style={{ minWidth: '105px' }} sortable></Column>
                <Column field="total" header="Total" body={totalBody} style={{ minWidth: '105px' }} sortable></Column>
                <Column field="id" header="Actions" body={actionBody} style={{ minWidth: '120px' }} bodyClassName={`${style.shadowLeft}`} headerClassName={clsx(`${style.shadowLeft}`, 'd-flex justify-content-center')} frozen alignFrozen="right"></Column>
            </DataTable>

            <div className="topbar d-flex justify-content-center text-center w-100" style={{ padding: '4px 0px', position: 'relative', height: '48px', borderTop: '1px solid #dedede', borderBottom: '0px solid #dedede', background: '#F9FAFB' }}>
                <WeekNavigator onWeekChange={handleWeekChange} />
            </div>

            {/* Jobs to Invoice DataTable */}
            <DataTable
                value={invoiceData || []}
                header={header2}
                footerColumnGroup={invoiceFooterGroup}
                scrollable
                selectionMode={'checkbox'}
                removableSort
                columnResizeMode="expand"
                resizableColumns
                showGridlines
                size={'large'}
                scrollHeight={`calc(50vh - 150px - ${trialHeight}px)`}
                className="border-0"
                selection={selectedInvoiceApprovals}
                onSelectionChange={(e) => setSelectedInvoiceApprovals(e.value)}
                emptyMessage="No approved jobs waiting to be invoiced"
                loading={isLoadingInvoice}
                loadingIcon={<></>}
            >
                <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
                <Column field="number" header="Job ID" style={{ minWidth: '100px' }} frozen sortable></Column>
                <Column field="time_type" header="Payment Type" body={paymentBody} style={{ minWidth: '130px' }} frozen sortable></Column>
                <Column field="type" header="Time" body={timeBody} style={{ minWidth: '118px' }} bodyClassName={`${style.shadowRight}`} headerClassName={`${style.shadowRight}`} frozen></Column>
                <Column
                    field="submitted"
                    header="Submitted"
                    style={{ minWidth: '122px' }}
                    sortable
                    body={(rowData) => formatDate(rowData.submitted)}
                ></Column>
                <Column field="short_description" header="Job Reference" style={{ minWidth: '270px' }}></Column>
                <Column field="client.name" header={clientHeader} body={clientBody} style={{ minWidth: '162px' }}></Column>
                <Column field="project.number" header="Linked To Project" body={linkToBody} style={{ minWidth: '105px' }}></Column>
                <Column field="worker.first_name" header="Worker" body={nameBody} style={{ minWidth: '205px' }}></Column>
                <Column field="spent_time" header="Spent Time" style={{ minWidth: '105px' }} sortable></Column>
                <Column field="real_total" header="Real Total" body={thisWeekTotalBody} style={{ minWidth: '105px' }} sortable></Column>
                <Column field="total" header="Total" body={totalBody} style={{ minWidth: '105px' }} sortable></Column>
                <Column field="id" header="Status" body={statusBody} style={{ minWidth: '120px' }} bodyClassName={clsx(`${style.shadowLeft}`, 'text-center')} headerClassName={clsx(`${style.shadowLeft}`, 'd-flex justify-content-center')} frozen alignFrozen="right"></Column>
            </DataTable>

            <ApproveJob visible={isApproveJobVisible} setVisible={setIsApproveJobVisible} jobId={selectedJobId} />
        </>
    );
});

export default ApprovalTable;