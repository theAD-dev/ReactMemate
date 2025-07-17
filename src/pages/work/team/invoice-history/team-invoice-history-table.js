import { forwardRef, useEffect, useRef, useState } from 'react';
import { CheckCircle, Envelope, FilePdf, XCircle } from 'react-bootstrap-icons';
import { Link, useParams } from 'react-router-dom';
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

  const calculateWeekNumberByStartAndEndDate = (rowData) => {
    const getISOWeekNumber = (date) => {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const day = d.getUTCDay() || 7; // Make Sunday = 7
      d.setUTCDate(d.getUTCDate() + 4 - day); // Nearest Thursday
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      return weekNumber;
    };

    const startDate = new Date(rowData.date_from * 1000);
    const endDate = new Date(rowData.date_to * 1000);

    const startWeek = getISOWeekNumber(startDate);
    const endWeek = getISOWeekNumber(endDate);

    if (startWeek === endWeek) {
      return `Week ${startWeek}`;
    } else {
      return `Week ${startWeek} - Week ${endWeek}`;
    }
  };

  const statusBodyTemplate = (rowData) => {
    return rowData.status === "1" ?
      <div className={`${style.clickButton} ${style.paid}`}>
        Paid <CheckCircle color='#079455' size={16} />
      </div> : <div className={`${style.clickButton} ${style.unpaid}`}>
        Not Paid <XCircle color='#F04438' size={16} />
      </div>;
  };

  const InvoiceIDBody = (rowData) => {
    return <div className={`d-flex align-items-center justify-content-between gap-2`}>
      <span>{rowData.number}</span>
      {
        rowData?.pdf_path && <Link to={`${process.env.REACT_APP_URL}${rowData.pdf_path}`} target='_blank'><FilePdf color='#FF0000' size={16} /></Link>
      }
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
      <Column selectionMode="multiple" bodyClassName={'show-on-hover'} headerStyle={{ width: '3rem' }} frozen></Column>
      <Column field="number" header="Invoice ID" body={InvoiceIDBody} frozen sortable style={{ minWidth: '180px', maxWidth: '180px', width: '180px' }} headerClassName='shadowRight' bodyClassName='shadowRight'></Column>
      <Column field="date_from" header="Week" body={calculateWeekNumberByStartAndEndDate} style={{ minWidth: '154px' }}></Column>
      <Column field="date_to" header="Date" body={(rowData) => `${formatDate(rowData.date_from)} - ${formatDate(rowData.date_to)}`} sortable style={{ minWidth: '113px' }}></Column>
      <Column field='total_hours' header="Total Hours" body={(rowData) => `${rowData.total_hours}h`} bodyClassName={'text-end'} style={{ minWidth: '114px' }}></Column>
      <Column field='total_amount' header="Total Amount" body={(rowData) => `$${formatAUD(rowData.total_amount)}`} style={{ minWidth: '114px' }}></Column>
      <Column field='status' header="Status" body={statusBodyTemplate} style={{ minWidth: '140px', maxWidth: '140px', width: '140px' }}></Column>
    </DataTable>
  );
});

export default TeamInvoiceHistoryTable;