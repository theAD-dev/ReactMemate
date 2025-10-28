import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import style from './service-history.module.scss';
import { getVehicleServices } from '../../../../APIs/assets-api';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { formatAUD } from '../../../../shared/lib/format-aud';
import Loader from '../../../../shared/ui/loader/loader';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';

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

const ServiceHistoryTable = forwardRef(({ selected, setSelected, searchValue, refetch }, ref) => {
  const { id } = useParams();
  const { trialHeight } = useTrialHeight();
  const observerRef = useRef(null);
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ sortField: 'date', sortOrder: -1 });
  const [tempSort, setTempSort] = useState({ sortField: 'date', sortOrder: -1 });
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 25;

  useEffect(() => {
    setHasMoreData(true);
    setPage(1);
  }, [searchValue, refetch]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);

      let order = "";
      if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
      else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

      try {
        const data = await getVehicleServices(id, page, limit, searchValue, order);
        if (page === 1) {
          setServices(data?.results || []);
        } else {
          if (data?.results?.length > 0) {
            setServices(prev => {
              const existingIds = new Set(prev.map(service => service.id));
              const newData = data.results.filter(service => !existingIds.has(service.id));
              return [...prev, ...newData];
            });
          }
        }
        setSort(tempSort);
        setHasMoreData(data?.results?.length === limit);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchServices();
  }, [id, page, searchValue, tempSort, refetch]);

  useEffect(() => {
    if (services?.length > 0 && hasMoreData) {
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
  }, [services, hasMoreData, loading]);

  const serviceIdBodyTemplate = (rowData) => {
    return (
      <div className='d-flex flex-column' style={{ lineHeight: '1.385' }}>
        <span style={{ fontWeight: '500' }}>{rowData.id || '-'}</span>
        <span className='font-12' style={{ color: '#98A2B3' }}>
          {rowData.date ? formatDate(rowData.date) : '-'}
        </span>
      </div>
    );
  };

  const odometerBodyTemplate = (rowData) => {
    return (
      <span>{rowData.odometer_km ? `${rowData.odometer_km?.toLocaleString()} km` : '-'}</span>
    );
  };

  const dateBodyTemplate = (rowData) => {
    return (
      <span>{rowData.date ? formatDate(rowData.date) : '-'}</span>
    );
  };

  const upcomingDateBodyTemplate = (rowData) => {
    if (!rowData.upcoming_date) return '-';

    const upcoming = new Date(rowData.upcoming_date);
    const today = new Date();
    const diffTime = upcoming - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let tagClass = style.upcomingDefault;
    if (diffDays < 0) tagClass = style.overdue;
    else if (diffDays <= 7) tagClass = style.upcomingSoon;
    else if (diffDays <= 30) tagClass = style.upcomingMonth;

    return (
      formatDate(rowData.upcoming_date)
    );
  };

  const costBodyTemplate = (rowData) => {
    return (
      <span className='text-end d-block' style={{ fontWeight: '500' }}>
        ${formatAUD(rowData.cost || 0)}
      </span>
    );
  };

  const notesBodyTemplate = (rowData) => {
    if (!rowData.notes) return '-';

    const truncatedNotes = rowData.notes.length > 50
      ? `${rowData.notes.substring(0, 50)}...`
      : rowData.notes;

    return (
      <span title={rowData.notes} style={{ fontSize: '13px', color: '#667085' }}>
        {truncatedNotes}
      </span>
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
      value={services}
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
      emptyMessage={<NoDataFoundTemplate isDataExist={!!services?.length} />}
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
        field="number"
        header="Service ID"
        body={serviceIdBodyTemplate}
        frozen
        sortable
        style={{ minWidth: '150px', width: '150px', maxWidth: '150px' }}
        headerClassName='shadowRight'
        bodyClassName='shadowRight'
      />
      <Column
        field="number"
        header="Expense"
        style={{ minWidth: '150px', width: '150px', maxWidth: '150px' }}
      />
      <Column
        field="odometer_km"
        header="Odometer (km)"
        body={odometerBodyTemplate}
        sortable
        style={{ minWidth: '200px', maxWidth: '200px', width: '200px' }}
        bodyClassName="text-end"
      />
      <Column
        field="date"
        header="Service Date"
        body={dateBodyTemplate}
        sortable
        style={{ minWidth: '150px', maxWidth: '150px', width: '150px' }}
      />
      <Column
        field="upcoming_date"
        header="Upcoming Service"
        body={upcomingDateBodyTemplate}
        sortable
        style={{ minWidth: '150px', maxWidth: '150px', width: '150px' }}
      />
      <Column
        field="cost"
        header="Cost"
        body={costBodyTemplate}
        sortable
        style={{ minWidth: '200px', maxWidth: '200px', width: '200px' }}
        bodyClassName="text-end"
      />
      <Column
        field="notes"
        header="Notes"
        body={notesBodyTemplate}
        style={{ minWidth: '250px' }}
      />
    </DataTable>
  );
});

ServiceHistoryTable.displayName = 'ServiceHistoryTable';

export default ServiceHistoryTable;
