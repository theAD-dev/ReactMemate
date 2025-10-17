import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { toast } from 'sonner';
import { getListOfSubmissions } from '../../../APIs/enquiries-api';
import { useAuth } from '../../../app/providers/auth-provider';
import { useTrialHeight } from '../../../app/providers/trial-height-provider';
import { formatDate } from '../../../shared/lib/date-format';
import Loader from '../../../shared/ui/loader/loader';
import NoDataFoundTemplate from '../../../ui/no-data-template/no-data-found-template';

const EnquiriesTable = forwardRef(({ searchValue, selectedSubmissions, setSelectedSubmissions, isShowDeleted }, ref) => {
    const { trialHeight } = useTrialHeight();
    const { session } = useAuth();
    const observerRef = useRef(null);
    const [submissions, setSubmissions] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [tempSort, setTempSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const limit = 25;

    useEffect(() => {
        setPage(1);
    }, [searchValue, isShowDeleted]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            let orgId = session?.organization?.id;
            if (!orgId) {
                toast.error('Organization ID is not available in session');
                setLoading(false);
                return;
            }

            let order = "";
            if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
            else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

            const data = await getListOfSubmissions(orgId, page, limit, searchValue, order, isShowDeleted);

            if (page === 1) setSubmissions(data.results);
            else {
                if (data?.results?.length > 0)
                    setSubmissions(prev => {
                        const existingIds = new Set(prev.map(sub => sub.id));
                        const newSubmissions = data.results.filter(sub => !existingIds.has(sub.id));
                        return [...prev, ...newSubmissions];
                    });
            }
            setSort(tempSort);
            setHasMoreData(data.count !== submissions.length);
            setLoading(false);
        };

        loadData();
    }, [page, searchValue, tempSort, isShowDeleted]);

    useEffect(() => {
        if (submissions.length > 0 && hasMoreData) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
            });

            const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
            if (lastRow) observerRef.current.observe(lastRow);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [submissions, hasMoreData]);

    const submissionIDBody = (rowData) => {
        return <div className="d-flex align-items-center justify-content-between">
            <span>#{rowData.id}</span>
        </div>;
    };

    const formTitleBody = (rowData) => {
        return <div className='d-flex flex-column'>
            <span style={{ color: '#344054', fontWeight: 500 }}>{rowData.form_title}</span>
        </div>;
    };

    const nameBody = (rowData) => {
        return <div className='d-flex flex-column'>
            <span style={{ color: '#344054' }}>{rowData.data?.name || '-'}</span>
        </div>;
    };

    const emailBody = (rowData) => {
        return <div className='d-flex flex-column'>
            <span style={{ color: '#344054' }}>{rowData.data?.email || '-'}</span>
        </div>;
    };

    const phoneBody = (rowData) => {
        return <div className='d-flex flex-column'>
            <span style={{ color: '#344054' }}>{rowData.data?.phone || '-'}</span>
        </div>;
    };

    const messageBody = (rowData) => {
        const message = rowData.data?.message || rowData.data?.text_field || '-';
        return <div className='d-flex align-items-center'>
            <span
                style={{
                    color: '#667085',
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
                title={message}
            >
                {message}
            </span>
        </div>;
    };

    const sourceBody = (rowData) => {
        return <div className='d-flex align-items-center'>
            {rowData.source_url ? (
                <Link to={rowData.source_url} target="_blank" style={{ color: '#1AB2FF', textDecoration: 'none' }}>
                    View Source
                </Link>
            ) : (
                <span style={{ color: '#667085' }}>-</span>
            )}
        </div>;
    };

    const statusBody = (rowData) => {
        const statusMap = {
            1: { label: 'New', color: '#1AB2FF', bg: '#F0F9FF', border: '#B9E6FE' },
            2: { label: 'In Progress', color: '#F79009', bg: '#FFFAEB', border: '#FEDF89' },
            3: { label: 'Contacted', color: '#17B26A', bg: '#ECFDF3', border: '#ABEFC6' },
            4: { label: 'Converted', color: '#7A5AF8', bg: '#F4F3FF', border: '#D9D6FE' },
            5: { label: 'Closed', color: '#667085', bg: '#F9FAFB', border: '#EAECF0' },
            6: { label: 'Spam', color: '#F04438', bg: '#FEF3F2', border: '#FECDCA' }
        };

        const status = statusMap[rowData.status] || statusMap[1];

        return (
            <Tag
                value={status.label}
                style={{
                    height: '22px',
                    borderRadius: '16px',
                    border: `1px solid ${status.border}`,
                    background: status.bg,
                    color: status.color,
                    fontSize: '12px',
                    fontWeight: 500
                }}
            />
        );
    };

    const assignedToBody = (rowData) => {
        return <div className='d-flex align-items-center'>
            <span style={{ color: '#667085' }}>
                {rowData.assigned_to?.name || 'Unassigned'}
            </span>
        </div>;
    };

    const submittedAtBody = (rowData) => {
        return <div className='d-flex flex-column' style={{ lineHeight: '1.385' }}>
            <span style={{ color: '#344054' }}>{formatDate(rowData.submitted_at)}</span>
        </div>;
    };

    const onSort = (event) => {
        const { sortField, sortOrder } = event;
        setTempSort({ sortField, sortOrder });
        setPage(1);
    };

    return (
        <DataTable
            ref={ref}
            value={submissions}
            scrollable
            selectionMode={'checkbox'}
            columnResizeMode="expand"
            resizableColumns
            showGridlines
            size={'large'}
            scrollHeight={`calc(100vh - 175px - ${trialHeight}px)`}
            className="border"
            selection={selectedSubmissions}
            onSelectionChange={(e) => setSelectedSubmissions(e.value)}
            loading={loading}
            loadingIcon={Loader}
            emptyMessage={<NoDataFoundTemplate isDataExist={!!searchValue} />}
            sortField={sort?.sortField}
            sortOrder={sort?.sortOrder}
            onSort={onSort}
        >
            <Column
                selectionMode="multiple"
                headerClassName='ps-4 border-end-0'
                bodyClassName={'show-on-hover border-end-0 ps-4'}
                headerStyle={{ width: '3rem', textAlign: 'center' }}
                frozen
            />
            <Column
                field="id"
                header="ID"
                body={submissionIDBody}
                headerClassName='paddingLeftHide'
                bodyClassName='paddingLeftHide'
                style={{ minWidth: '80px' }}
                frozen
                sortable
            />
            <Column
                field="form_title"
                header="Form Title"
                body={formTitleBody}
                headerClassName='shadowRight'
                bodyClassName='shadowRight'
                style={{ minWidth: '200px' }}
                frozen
                sortable
            />
            <Column
                field="data.name"
                header="Name"
                body={nameBody}
                style={{ minWidth: '180px' }}
            />
            <Column
                field="data.email"
                header="Email"
                body={emailBody}
                style={{ minWidth: '220px' }}
            />
            <Column
                field="data.phone"
                header="Phone"
                body={phoneBody}
                style={{ minWidth: '140px' }}
            />
            <Column
                header="Message"
                body={messageBody}
                style={{ minWidth: '300px' }}
            />
            <Column
                field="status"
                header="Status"
                body={statusBody}
                style={{ minWidth: '120px', textAlign: 'center' }}
                sortable
            />
            <Column
                header="Assigned To"
                body={assignedToBody}
                style={{ minWidth: '150px' }}
            />
            <Column
                header="Source"
                body={sourceBody}
                style={{ minWidth: '120px' }}
            />
            <Column
                field="submitted_at"
                header="Submitted At"
                body={submittedAtBody}
                style={{ minWidth: '150px' }}
                sortable
            />
        </DataTable>
    );
});

export default EnquiriesTable;