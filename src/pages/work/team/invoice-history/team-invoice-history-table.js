import { forwardRef, useEffect, useRef, useState } from 'react';
import { Envelope } from 'react-bootstrap-icons';
import { Link, useParams } from 'react-router-dom';
import { Badge } from 'primereact/badge';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import style from './team-invoice-history.module.scss';
import { getTeamInvoiceHistory } from '../../../../APIs/team-api';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { formatDate } from '../../../../shared/lib/date-format';
import { formatAUD } from '../../../../shared/lib/format-aud';
import Loader from '../../../../shared/ui/loader/loader';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';


const TeamInvoiceHistoryTable = forwardRef(({ selected, setSelected, searchValue }, ref) => {
  const { id } = useParams();
  const { trialHeight } = useTrialHeight();
  const observerRef = useRef(null);
  const [userInvoices, setUserInvoices] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ sortField: '', sortOrder: -1 });
  const [tempSort, setTempSort] = useState({ sortField: '', sortOrder: -1 });
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 25;

  useEffect(() => {
    setHasMoreData(true);
    setPage(1);  // Reset to page 1 whenever searchValue changes
  }, [searchValue]);

  useEffect(() => {
    const fetchUserInvoices = async () => {
      setLoading(true);

      let order = "";
      if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
      else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

      const data = await getTeamInvoiceHistory(id, page, limit, searchValue, order);
      if (page === 1) setUserInvoices(data?.results || []);
      else {
        if (data?.results?.length > 0)
          setUserInvoices(prev => {
            const existingIds = new Set(prev.map(history => history.id));
            const newData = data.results.filter(history => !existingIds.has(history.id));
            return [...prev, ...newData];
          });
      }
      setSort(tempSort);
      setHasMoreData(data?.count !== userInvoices?.length);
      setLoading(false);
    };

    if (id) fetchUserInvoices();
  }, [id, page, searchValue, tempSort]);

  useEffect(() => {
    if (userInvoices?.length > 0 && hasMoreData) {
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
      });

      const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
      if (lastRow) observerRef.current.observe(lastRow);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [userInvoices, hasMoreData]);

  const onSort = (event) => {
    const { sortField, sortOrder } = event;

    setPage(1);  // Reset to page 1 whenever searchValue changes
    setHasMoreData(true);
    setTempSort({ sortField, sortOrder });
  };

  const sendEmailBodyTemplate = (rowData) => {
    return <div className='d-flex align-items-center justify-content-center'>
      <Link to='#'
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `mailto:${rowData?.email}`;
        }}
      >
        <Envelope size={20} color='#98A2B3' className='email-icon' />
      </Link>
    </div>;
  };

  const statusBodyTemplate = (rowData) => {
    return rowData.status === "1" ?
      <div className={`${style.status} ${style.paid}`}>
        <Badge severity="success"></Badge> Paid
      </div> : <div className={`${style.status} ${style.unpaid}`}>
        Not Paid <Badge severity="warning"></Badge>
      </div>;
  };

  return (
    <DataTable ref={ref} value={userInvoices} scrollable selectionMode={'checkbox'}
      columnResizeMode="expand" resizableColumns showGridlines size={'large'}
      scrollHeight={`calc(100vh - 175px - ${trialHeight}px)`} className="border" selection={selected}
      onSelectionChange={(e) => setSelected(e.value)}
      loading={loading}
      loadingIcon={Loader}
      emptyMessage={<NoDataFoundTemplate isDataExist={!!userInvoices?.length} />}
      sortField={sort?.sortField}
      sortOrder={sort?.sortOrder}
      onSort={onSort}
    >
      <Column field="number" header="Invoice ID" frozen sortable style={{ minWidth: '100px' }} headerClassName='shadowRight' bodyClassName='shadowRight'></Column>
      <Column field="date_from" header="Date From" body={(rowData) => formatDate(rowData.date_from)} style={{ minWidth: '154px' }}></Column>
      <Column field="date_to" header="Date To" body={(rowData) => formatDate(rowData.date_to)} sortable style={{ minWidth: '113px' }}></Column>
      <Column field='total_hours' header="Total Hours" body={(rowData) => `${rowData.total_hours}h`} style={{ minWidth: '114px' }}></Column>
      <Column field='total_amount' header="Total Amount" body={(rowData) => `$${formatAUD(rowData.total_amount)}`} style={{ minWidth: '114px' }}></Column>
      <Column field='status' header="Status" body={statusBodyTemplate} style={{ minWidth: '114px' }}></Column>
      <Column field='id' header="Send Receipt" body={sendEmailBodyTemplate} style={{ minWidth: '114px' }}></Column>
    </DataTable>
  );
});

export default TeamInvoiceHistoryTable;