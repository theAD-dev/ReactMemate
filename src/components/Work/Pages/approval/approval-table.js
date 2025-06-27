import React, { useEffect, useState } from 'react';
import { ClockHistory, Link45deg, Repeat } from 'react-bootstrap-icons';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Chip } from 'primereact/chip';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';
import { Row } from 'primereact/row';
import { Tag } from 'primereact/tag';
import { toast } from 'sonner';
import style from './approval.module.scss';
import { getJobsToApprove } from '../../../../APIs/approval-api';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { formatAUD } from '../../../../shared/lib/format-aud';
import Loader from '../../../../shared/ui/loader/loader';
import { FallbackImage } from '../../../../ui/image-with-fallback/image-avatar';
import ApproveJob from '../../features/approve-job/approve-job';

const ApprovalTable = React.memo(() => {
    const { trialHeight } = useTrialHeight();
    const [selectedApprovals, setSelectedApprovals] = useState(null);

    const [isApproveJobVisible, setIsApproveJobVisible] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);

    const {
        data: approveData = [],
        isLoading: isLoadingApprove,
        error: approveError,
        refetch: refetchApproveData
    } = useQuery({
        queryKey: ['jobsToApprove'],
        queryFn: getJobsToApprove,
        refetchOnWindowFocus: false,
        onError: (error) => {
            toast.error('Failed to load jobs to approve');
            console.error('Error loading jobs to approve:', error);
        }
    });

    const jobIDTemplate = (rowData) => {
        return <div className={`d-flex gap-2 align-items-center justify-content-center show-on-hover`}>
            <div className='d-flex flex-column' style={{ lineHeight: '1.385' }}>
                <span>{rowData.number}</span>
                <span className='font-12' style={{ color: '#98A2B3' }}>{formatDate(rowData.created || rowData.start_date)}</span>
            </div>
            {rowData?.is_recurring && <Repeat color='#158ECC' />}
        </div>;
    };

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

    const workerHeader = () => {
        return <div className='d-flex align-items-center gap-1'>
            Name
            <small>A→Z</small>
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
        if (!rowData?.project) return '-';

        return <div className='d-flex align-items-center'>
            <div className={`d-flex justify-content-center align-items-center ${style.clientImg} ${rowData?.client?.is_business ? style.square : 'rounded-circle'}`}>
                <FallbackImage photo={rowData?.client?.photo} is_business={rowData?.client?.is_business || false} has_photo={rowData?.client?.has_photo || false} />
            </div>
            <div className='d-flex flex-column'>
                <span>{rowData?.project?.reference}</span>
                <span className='font-12' style={{ color: '#98A2B3' }}>{rowData?.project?.number} | {rowData?.client?.name}</span>
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
        return <Tag value={`$${formatAUD(rowData.total)}`} style={{ border: "2px solid var(--Orange-200, #FFE0BC)", background: '#FFF7EE', color: '#FFB258', fontSize: '12px', fontWeight: 500 }} rounded></Tag>;
    };

    const realTotalBody = (rowData) => {
        return <span>${formatAUD(rowData.real_total)}</span>;
    };

    const approveTotal = React.useMemo(() => {
        if (!approveData || approveData.length === 0) return 0;
        return approveData.reduce((sum, job) => sum + parseFloat(job.total || 0), 0);
    }, [approveData]);

    const approveFooterGroup = React.useMemo(() => {
        const formattedTotal = approveTotal.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        return (
            <ColumnGroup>
                <Row className='w-100'>
                    <Column colSpan={11} />
                    <Column
                        footer={`Total= $${formattedTotal}`}
                        footerStyle={{ position: 'sticky', right: 0 }}
                    />
                </Row>
            </ColumnGroup>
        );
    }, [approveTotal]);


    useEffect(() => {
        if (approveError) {
            toast.error(`Error loading jobs to approve: ${approveError.message || 'Please try again later'}`);
        }
    }, [approveError]);

    return (
        <>
            {/* Jobs to Approve DataTable */}
            <DataTable
                value={approveData}
                footerColumnGroup={approveFooterGroup}
                scrollable
                selectionMode={'checkbox'}
                removableSort
                columnResizeMode="expand"
                resizableColumns
                showGridlines
                size={'large'}
                scrollHeight={`calc(100vh - 175px - ${trialHeight}px)`}
                className="border"
                selection={selectedApprovals}
                onSelectionChange={(e) => setSelectedApprovals(e.value)}
                emptyMessage="No jobs to approve"
                loading={isLoadingApprove}
                loadingIcon={Loader}
            >
                <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
                <Column field="number" header="Job ID" body={jobIDTemplate} style={{ minWidth: '100px' }} frozen sortable></Column>
                <Column field='type' header="Job Type" body={jobTypeBody} style={{ minWidth: '100px' }} bodyClassName={`${style.shadowRight}`} headerClassName={`${style.shadowRight}`} frozen sortable></Column>
                <Column field="submitted" header="Submitted" style={{ minWidth: '122px' }} sortable body={(rowData) => formatDate(rowData.submitted)}></Column>
                <Column field="worker.first_name" header={workerHeader} body={nameBody} style={{ minWidth: '205px' }}></Column>
                <Column field="short_description" header="Job Reference" style={{ minWidth: '270px' }}></Column>
                <Column field='project.number' header="Linked To Project" body={linkToBody} style={{ minWidth: '105px' }} />
                <Column field="variations" header="Variations" style={{ minWidth: '105px' }} sortable></Column>
                <Column field="real_total" header="Real Total" body={realTotalBody} style={{ minWidth: '105px' }} sortable></Column>
                <Column field="spent_time" header="Real Time" body={realTimeBody} style={{ minWidth: '105px' }}></Column>
                <Column field="total" header="Total" body={totalBody} style={{ minWidth: '105px' }} sortable></Column>
                <Column field="id" header="Actions" body={actionBody} style={{ minWidth: '120px' }} bodyClassName={`${style.shadowLeft}`} headerClassName={clsx(`${style.shadowLeft}`, 'd-flex justify-content-center')} frozen alignFrozen="right"></Column>
            </DataTable>
            <ApproveJob visible={isApproveJobVisible} setVisible={setIsApproveJobVisible} jobId={selectedJobId} refetch={refetchApproveData} />
        </>
    );
});

export default ApprovalTable;