import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { EnvelopeSlash, XCircle } from 'react-bootstrap-icons';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { toast } from 'sonner';
import { getListOfSubmissions } from '../../../APIs/enquiries-api';
import { useAuth } from '../../../app/providers/auth-provider';
import { useTrialHeight } from '../../../app/providers/trial-height-provider';
import Loader from '../../../shared/ui/loader/loader';
import NoDataFoundTemplate from '../../../ui/no-data-template/no-data-found-template';

const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    // Handle Unix timestamp (in seconds)
    const date = new Date(+timestamp * 1000);
    const formatter = new Intl.DateTimeFormat("en-AU", {
        timeZone: 'Australia/Sydney',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    return formatter.format(date);
};

const EnquiriesTable = forwardRef(({ searchValue, selectedSubmissions, setSelectedSubmissions, isShowDeleted, filterType, refetchTrigger }, ref) => {
    const { trialHeight } = useTrialHeight();
    const { session } = useAuth();
    const observerRef = useRef(null);
    const [submissions, setSubmissions] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [tempSort, setTempSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [editData, setEditData] = useState(null);
    const limit = 25;

    useEffect(() => {
        setPage(1);
    }, [searchValue, isShowDeleted, filterType, refetchTrigger]);

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

            // Map filterType to API filter parameter
            let filterParam = '';
            if (filterType && filterType !== 'all') {
                filterParam = filterType;
            }

            const data = await getListOfSubmissions(orgId, page, limit, searchValue, order, isShowDeleted, filterParam);

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
    }, [page, searchValue, tempSort, isShowDeleted, filterType, session?.organization?.id, submissions.length, refetchTrigger]);

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

    const formTitleBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <div className='d-flex flex-column' style={{ lineHeight: '1.385' }}>
                <span style={{ color: '#344054', fontWeight: 500 }}>{rowData.form_title || "-"}</span>
                <span className='font-12' style={{ color: '#98A2B3' }}>{formatDate(rowData.submitted_at)}</span>
            </div>
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

    const assignedToBody = (rowData) => {
        return <div className='d-flex align-items-center'>
            <span style={{ color: '#667085' }}>
                {rowData.assigned_to?.name || 'Unassigned'}
            </span>
        </div>;
    };

    const spamActionBody = (rowData) => {
        const handleSpam = async () => {
            try {
                toast.success(`Marked as spam: ${rowData.data?.name}`);
                // TODO: Call API endpoint for marking as spam
            } catch (error) {
                toast.error('Failed to mark as spam');
            }
        };

        return (
            <button
                onClick={handleSpam}
                style={{
                    padding: '6px',
                    borderRadius: '16px',
                    border: '1px solid #EAECF0',
                    background: 'transparent',
                    color: '#667085',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#344054';
                    e.currentTarget.style.background = '#F9FAFB';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#667085';
                    e.currentTarget.style.background = 'transparent';
                }}
                title="Mark as spam"
            >
                <EnvelopeSlash size={20} color='#667085' />
            </button>
        );
    };

    const noGoActionBody = (rowData) => {
        const handleNoGo = async () => {
            try {
                toast.success(`Marked as No Go: ${rowData.data?.name}`);
                // TODO: Call API endpoint for marking as No Go
            } catch (error) {
                toast.error('Failed to mark as No Go');
            }
        };

        return (
            <button
                onClick={handleNoGo}
                style={{
                    padding: '0',
                    borderRadius: '8px',
                    border: '1px solid #EAECF0',
                    background: '#FFFFFF',
                    color: '#F04438',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '42px',
                    height: '42px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FEF3F2';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                }}
                title="Mark as No Go"
            >
                <XCircle size={20} color="#D92D20" />
            </button>
        );
    };

    const moveToQuoteActionBody = (rowData) => {
        const handleMoveToQuote = async () => {
            try {
                toast.success(`Moved to Quote: ${rowData.data?.name}`);
                // TODO: Call API endpoint for moving to quote
            } catch (error) {
                toast.error('Failed to move to quote');
            }
        };

        return (
            <button
                onClick={handleMoveToQuote}
                style={{
                    padding: '8px 18px',
                    borderRadius: '24px',
                    border: '1px solid #A9EFC5',
                    background: '#ECFDF3',
                    color: '#067647',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#D1FAE5';
                    e.currentTarget.style.borderColor = '#A7F3D0';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ECFDF5';
                    e.currentTarget.style.borderColor = '#D1FAE5';
                }}
                title="Move to Quote"
            >
                Move
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.55806 2.05806C4.80214 1.81398 5.19786 1.81398 5.44194 2.05806L12.9419 9.55806C13.186 9.80214 13.186 10.1979 12.9419 10.4419L5.44194 17.9419C5.19786 18.186 4.80214 18.186 4.55806 17.9419C4.31398 17.6979 4.31398 17.3021 4.55806 17.0581L11.6161 10L4.55806 2.94194C4.31398 2.69786 4.31398 2.30214 4.55806 2.05806Z" fill="#079455" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.55806 2.05806C9.80214 1.81398 10.1979 1.81398 10.4419 2.05806L17.9419 9.55806C18.186 9.80214 18.186 10.1979 17.9419 10.4419L10.4419 17.9419C10.1979 18.186 9.80214 18.186 9.55806 17.9419C9.31398 17.6979 9.31398 17.3021 9.55806 17.0581L16.6161 10L9.55806 2.94194C9.31398 2.69786 9.31398 2.30214 9.55806 2.05806Z" fill="#079455" />
                </svg>
            </button>
        );
    };

    const onSort = (event) => {
        const { sortField, sortOrder } = event;
        setTempSort({ sortField, sortOrder });
        setPage(1);
    };

    return (
        <>
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
                field="form_title"
                header="Lead Source"
                body={formTitleBody}
                style={{ minWidth: '160px' }}
                sortable
            />
            <Column
                field="data.name"
                header="Name"
                body={nameBody}
                style={{ minWidth: '160px' }}
                headerClassName='shadowRight'
                bodyClassName='shadowRight'
            />
            <Column
                field="data.phone"
                header="Phone"
                body={phoneBody}
                style={{ minWidth: '140px' }}
            />
            <Column
                field="data.email"
                header="Email"
                body={emailBody}
                style={{ minWidth: '220px' }}
            />
            <Column
                header={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Assign To
                        <span style={{ fontSize: '11px', color: '#98A2B3', fontWeight: 400 }}>A→Z</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#98A2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </span>
                }
                body={assignedToBody}
                style={{ minWidth: '180px' }}
                sortable
                field="assigned_to.name"
            />
            <Column
                header="Spam"
                body={spamActionBody}
                style={{ minWidth: '90px', maxWidth: '90px', width: '90px', textAlign: 'center' }}
            />
            <Column
                header="No Go"
                body={noGoActionBody}
                style={{ minWidth: '90px', maxWidth: '90px', width: '90px', textAlign: 'center' }}
            />
            <Column
                header="Move to Quote"
                body={moveToQuoteActionBody}
                style={{ minWidth: '130px', maxWidth: '150px', width: '150px' }}
            />
        </DataTable>
    </>
    );
});

export default EnquiriesTable;