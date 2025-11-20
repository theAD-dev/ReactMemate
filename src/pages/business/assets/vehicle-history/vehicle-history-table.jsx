import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { getLinkedExpenses, getVehicleServices } from '../../../../APIs/assets-api';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { formatAUD } from '../../../../shared/lib/format-aud';
import ImageAvatar from '../../../../shared/ui/image-with-fallback/image-avatar';
import Loader from '../../../../shared/ui/loader/loader';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';

const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(+timestamp * 1000);
    const formatter = new Intl.DateTimeFormat("en-AU", {
        timeZone: 'Australia/Sydney',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    return formatter.format(date);
};

const VehicleHistoryTable = forwardRef(({ selected, setSelected, searchValue, refetch, filterType }, ref) => {
    const { id } = useParams();
    const { trialHeight } = useTrialHeight();
    const observerRef = useRef(null);
    const [combinedData, setCombinedData] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ sortField: 'date', sortOrder: -1 });
    const [tempSort, setTempSort] = useState({ sortField: 'date', sortOrder: -1 });
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const limit = 25;

    useEffect(() => {
        setHasMoreData(true);
        setPage(1);
    }, [searchValue, refetch, filterType]);

    useEffect(() => {
        const fetchCombinedData = async () => {
            setLoading(true);

            let order = "";
            if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
            else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

            try {
                const promises = [];

                // Fetch services
                if (filterType === 'all' || filterType === 'services') {
                    promises.push(
                        getVehicleServices(id, page, limit, searchValue, order)
                            .then(data => ({
                                type: 'service',
                                data: data?.results || []
                            }))
                    );
                }

                // Fetch expenses
                if (filterType === 'all' || filterType === 'expenses') {
                    promises.push(
                        getLinkedExpenses(1, id, page, limit, order)
                            .then(data => ({
                                type: 'expense',
                                data: data || []
                            }))
                    );
                }

                const results = await Promise.all(promises);
                
                // Transform and combine data
                let combined = [];
                results.forEach(result => {
                    if (result.type === 'service') {
                        const transformed = result.data.map(item => ({
                            ...item,
                            recordType: 'service',
                            date: item.date,
                            amount: item.cost,
                            description: item.notes,
                            reference: item.odometer_km ? `${item.odometer_km.toLocaleString()} km` : '-'
                        }));
                        combined = [...combined, ...transformed];
                    } else if (result.type === 'expense') {
                        const transformed = result.data.map(item => ({
                            ...item,
                            recordType: 'expense',
                            date: item.created,
                            amount: item.total,
                            description: item.invoice_reference,
                            reference: item.number
                        }));
                        combined = [...combined, ...transformed];
                    }
                });

                // Sort combined data by date
                combined.sort((a, b) => {
                    const dateA = a.date || 0;
                    const dateB = b.date || 0;
                    return tempSort?.sortOrder === 1 ? dateA - dateB : dateB - dateA;
                });

                if (page === 1) {
                    setCombinedData(combined);
                } else {
                    if (combined.length > 0) {
                        setCombinedData(prev => {
                            const existingIds = new Set(prev.map(item => `${item.recordType}-${item.id}`));
                            const newData = combined.filter(item => !existingIds.has(`${item.recordType}-${item.id}`));
                            return [...prev, ...newData];
                        });
                    }
                }
                setSort(tempSort);
                setHasMoreData(combined.length === limit * (filterType === 'all' ? 2 : 1));
            } catch (error) {
                console.error('Error fetching combined data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCombinedData();
    }, [id, page, searchValue, tempSort, refetch, filterType]);

    useEffect(() => {
        if (combinedData?.length > 0 && hasMoreData) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && !loading) {
                    setPage(prevPage => prevPage + 1);
                }
            });

            const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
            if (lastRow) observerRef.current.observe(lastRow);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [combinedData, hasMoreData, loading]);

    const idBodyTemplate = (rowData) => {
        return (
            <div className='d-flex flex-column' style={{ lineHeight: '1.385' }}>
                <div className='d-flex align-items-center gap-2'>
                    <span style={{ fontWeight: '500' }}>
                        {rowData.recordType === 'service' ? rowData.id : rowData.number?.split('-')[1] || rowData.number}
                    </span>
                    <Tag 
                        value={rowData.recordType === 'service' ? 'Service' : 'Expense'}
                        style={{
                            height: '22px',
                            minWidth: '60px',
                            borderRadius: '16px',
                            border: rowData.recordType === 'service' ? '1px solid #1AB2FF' : '1px solid #f96a94',
                            background: rowData.recordType === 'service' ? '#EBF8FF' : 'linear-gradient(135deg, rgba(247, 79, 172, 0.1) 0%, rgba(252, 178, 79, 0.1) 100%), #fff',
                            color: rowData.recordType === 'service' ? '#1AB2FF' : '#f96a94',
                            fontSize: '12px',
                            fontWeight: 500
                        }}
                    />
                </div>
                <span className='font-12' style={{ color: '#98A2B3' }}>
                    {rowData.date ? formatDate(rowData.date) : '-'}
                </span>
            </div>
        );
    };

    const supplierServiceBody = (rowData) => {
        if (rowData.recordType === 'service') {
            return <span style={{ color: '#667085' }}>Service Record</span>;
        }
        return (
            <div className='d-flex align-items-center gap-2'>
                <ImageAvatar 
                    has_photo={rowData?.supplier?.has_photo} 
                    photo={rowData?.supplier?.photo} 
                    is_business={true} 
                    size={24} 
                />
                <span style={{ fontSize: '14px', color: '#344054' }}>
                    {rowData.supplier?.name || '-'}
                </span>
            </div>
        );
    };

    const referenceBody = (rowData) => {
        return (
            <span style={{ color: '#667085', fontSize: '14px' }}>
                {rowData.reference || '-'}
            </span>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return <span>{rowData.date ? formatDate(rowData.date) : '-'}</span>;
    };

    const amountBodyTemplate = (rowData) => {
        return (
            <span className='text-end d-block' style={{ fontWeight: '500' }}>
                ${formatAUD(rowData.amount || 0)}
            </span>
        );
    };

    const descriptionBodyTemplate = (rowData) => {
        if (!rowData.description) return '-';

        const truncatedDesc = rowData.description.length > 50
            ? `${rowData.description.substring(0, 50)}...`
            : rowData.description;

        return (
            <span title={rowData.description} style={{ fontSize: '13px', color: '#667085' }}>
                {truncatedDesc}
            </span>
        );
    };

    const statusBodyTemplate = (rowData) => {
        if (rowData.recordType === 'service') {
            return rowData.upcoming_date ? (
                <span style={{ color: '#667085', fontSize: '14px' }}>
                    Next: {formatDate(rowData.upcoming_date)}
                </span>
            ) : (
                <span>-</span>
            );
        }

        // For expenses
        if (rowData.paid) {
            return (
                <Tag value="Paid" style={{
                    height: '22px',
                    borderRadius: '16px',
                    border: '1px solid #ABEFC6',
                    background: '#ECFDF3',
                    color: '#067647',
                    fontSize: '12px',
                    fontWeight: 500
                }} />
            );
        }
        return (
            <Tag value="Not Paid" style={{
                height: '22px',
                borderRadius: '16px',
                border: '1px solid #FECDCA',
                background: '#FEF3F2',
                color: '#B42318',
                fontSize: '12px',
                fontWeight: 500
            }} />
        );
    };

    const onSort = (event) => {
        const { sortField, sortOrder } = event;
        setPage(1);
        setHasMoreData(true);
        setTempSort({ sortField, sortOrder });
    };

    return (
        <DataTable
            ref={ref}
            value={combinedData}
            scrollable
            selectionMode={'checkbox'}
            columnResizeMode="expand"
            resizableColumns
            showGridlines
            size={'large'}
            scrollHeight={`calc(100vh - 175px - ${trialHeight}px)`}
            className="border"
            selection={selected}
            onSelectionChange={(e) => setSelected(e.value)}
            loading={loading}
            loadingIcon={Loader}
            emptyMessage={<NoDataFoundTemplate isDataExist={!!combinedData?.length} />}
            sortField={sort?.sortField}
            sortOrder={sort?.sortOrder}
            onSort={onSort}
        >
            <Column
                selectionMode="multiple"
                headerClassName='ps-4'
                bodyClassName={'show-on-hover border-right-0 ps-4'}
                headerStyle={{ width: '3rem', textAlign: 'center', border: 'none' }}
                frozen
            />
            <Column
                field="id"
                header="ID"
                body={idBodyTemplate}
                frozen
                sortable
                style={{ minWidth: '180px', width: '180px', maxWidth: '180px' }}
                headerClassName='shadowRight'
                bodyClassName='shadowRight'
            />
            <Column
                field="supplier.name"
                header="Supplier / Service"
                body={supplierServiceBody}
                style={{ minWidth: '200px' }}
            />
            <Column
                field="reference"
                header="Reference"
                body={referenceBody}
                style={{ minWidth: '150px' }}
            />
            <Column
                field="date"
                header="Date"
                body={dateBodyTemplate}
                sortable
                style={{ minWidth: '120px' }}
            />
            <Column
                field="amount"
                header="Amount"
                body={amountBodyTemplate}
                sortable
                style={{ minWidth: '120px' }}
                bodyClassName="text-end"
            />
            <Column
                field="description"
                header="Description / Notes"
                body={descriptionBodyTemplate}
                style={{ minWidth: '250px' }}
            />
            <Column
                header="Status / Next Service"
                body={statusBodyTemplate}
                style={{ minWidth: '180px' }}
            />
        </DataTable>
    );
});

VehicleHistoryTable.displayName = 'VehicleHistoryTable';

export default VehicleHistoryTable;
