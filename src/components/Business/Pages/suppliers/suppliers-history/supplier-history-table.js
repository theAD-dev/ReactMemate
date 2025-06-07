import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import style from './supplier-history.module.scss';
import { getSupplierHistory } from '../../../../../APIs/SuppliersApi';
import { formatAUD } from '../../../../../shared/lib/format-aud';
import Loader from '../../../../../shared/ui/loader/loader';
import NoDataFoundTemplate from '../../../../../ui/no-data-template/no-data-found-template';


const SupplierHistoryTable = forwardRef(({ searchValue, selected, setSelected, isShowDeleted }, ref) => {
  const { id } = useParams();
  const observerRef = useRef(null);
  const [expenses, setExpenses] = useState([]);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ sortField: 'id', sortOrder: -1 });
  const [tempSort, setTempSort] = useState({ sortField: 'id', sortOrder: -1 });
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 25;

  useEffect(() => {
    setPage(1);  // Reset to page 1 whenever searchValue changes
  }, [searchValue, isShowDeleted]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      let order = "";
      if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
      else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

      const data = await getSupplierHistory(id, page, limit, searchValue, order, isShowDeleted);
      if (page === 1) setExpenses(data.results);
      else {
        if (data?.results?.length > 0)
          setExpenses(prev => {
            const existingIds = new Set(prev.map(data => data.number));
            const newData = data.results.filter(data => !existingIds.has(data.number));
            return [...prev, ...newData];
          });
      }
      setSort(tempSort);
      setHasMoreData(data.count !== expenses.length);
      setLoading(false);
    };

    loadData();

  }, [page, searchValue, tempSort, isShowDeleted]);

  useEffect(() => {
    if (expenses.length > 0 && hasMoreData) {
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
      });

      const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
      if (lastRow) observerRef.current.observe(lastRow);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [expenses, hasMoreData]);

  const accountCodeBodyTemplate = (rowData) => {
    return <>{rowData?.account_code?.code}: {rowData?.account_code?.name}</>;
  };

  const onSort = (event) => {
    const { sortField, sortOrder } = event;

    setPage(1);  // Reset to page 1 whenever searchValue changes
    setTempSort({ sortField, sortOrder });
  };

  // Formate Date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
    const year = date.getFullYear();
    return `${day} ${monthAbbreviation} ${year}`;
  };

  const CreatedBody = (rowData) => {

    return <div className={`d-flex align-items-center justify-content-between show-on-hover`} style={{ color: "#98A2B3" }}>
      {formatDate(rowData.created)}
    </div>;
  };

  const TotalBody = (rowData) => {

    return <div className={` show-on-hover ${style.boxBorderRound}`}>
      ${formatAUD(rowData.total)}
    </div>;
  };

  const PaidDate = (rowData) => {
    return <div className={`d-flex align-items-center justify-content-between show-on-hover`} style={{ color: "#98A2B3" }}>
      {formatDate(rowData.date)}
    </div>;
  };

  const gstbody = (rowData) => {
    return <div className={` show-on-hover ${style.boxBorderCorner}`} >
      ${formatAUD(rowData.gst)}
    </div>;
  };

  const StatusBody = (rowData) => {

    return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
      <div className={`styleGrey01 ${style.status} ${rowData.paid ? style.active : style.inactive}`}>
        {rowData.paid === true ? (
          <><span className="dots"></span> Paid </>
        ) : (
          <>Not Paid <span className="dots"></span></>
        )}
      </div>
    </div>;
  };
  
  return (
    <DataTable ref={ref} value={expenses} scrollable selectionMode={'checkbox'} removableSort
      columnResizeMode="expand" resizableColumns showGridlines size={'large'}
      scrollHeight={"calc(100vh - 182px)"} className="border" selection={selected}
      onSelectionChange={(e) => setSelected(e.value)}
      loading={loading}
      loadingIcon={Loader}
      emptyMessage={<NoDataFoundTemplate isDataExist={!!searchValue}/>}
      sortField={sort?.sortField}
      sortOrder={sort?.sortOrder}
      onSort={onSort}
    >
      <Column selectionMode="multiple" headerClassName='ps-4' bodyClassName={'show-on-hover ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
      <Column field="number" header="Expense ID" frozen sortable style={{ minWidth: '122px', color: '#667085' }} headerClassName='shadowRight' bodyClassName='shadowRight'></Column>
      <Column field="created" body={CreatedBody} header="Date Input" style={{ minWidth: '122px' }} sortable></Column>
      <Column field='date' body={PaidDate} header="Date Payed" style={{ minWidth: '122px' }} sortable></Column>
      <Column field="reference" header="Reference" style={{ minWidth: '606px' }}></Column>
      <Column field='gst' body={gstbody} header="GST" style={{ minWidth: '107px' }} bodyClassName={"text-end"} sortable></Column>
      <Column field='total' header="Total" body={TotalBody} bodyClassName={"text-end"} style={{ minWidth: '111px' }} sortable></Column>
      <Column field='type' header="Interval/Order" style={{ minWidth: '130px' }}></Column>
      <Column field="department" header="Department" style={{ minWidth: '217px' }}></Column>
      <Column field='account_code.code' header="Account Code" body={accountCodeBodyTemplate} style={{ minWidth: '214px' }}></Column>
      <Column field='paid' body={StatusBody} header="Status" bodyClassName={"text-center"} style={{ minWidth: '123px' }}></Column>
    </DataTable>
  );
});

export default SupplierHistoryTable;