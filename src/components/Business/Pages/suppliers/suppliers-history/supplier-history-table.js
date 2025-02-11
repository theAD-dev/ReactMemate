import clsx from 'clsx';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import style from './supplier-history.module.scss';
import NoDataFoundTemplate from '../../../../../ui/no-data-template/no-data-found-template';
import { ArrowLeftCircle, FilePdf, Files, FileText, InfoCircle, Link45deg, PlusSlashMinus } from 'react-bootstrap-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { getSupplierHistory } from '../../../../../APIs/SuppliersApi';

const SupplierHistoryTable = forwardRef(({ searchValue, selected, setSelected, isShowDeleted }, ref) => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    return <>{rowData?.account_code?.code}: {rowData?.account_code?.name}</>
  }

  const loadingIconTemplate = () => {
    return <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  }

  const onResizeColumn = (event) => {
    console.log('event: ', event);
  }

  const onSort = (event) => {
    const { sortField, sortOrder } = event;

    setPage(1);  // Reset to page 1 whenever searchValue changes
    setTempSort({ sortField, sortOrder })
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
    </div>
  }

  const TotalBody = (rowData) => {

    return <div className={` show-on-hover ${style.boxBorderRound}`}>
      $ {(rowData.total).toFixed(2)}
    </div>
  }

  const PaidDate = (rowData) => {
    return <div className={`d-flex align-items-center justify-content-between show-on-hover`} style={{ color: "#98A2B3" }}>
      {formatDate(rowData.date)}
    </div>
  }

  const gstbody = (rowData) => {
    return <div className={` show-on-hover ${style.boxBorderCorner}`} >
      $ {rowData.gst}
    </div>
  }

  const StatusBody = (rowData) => {

    return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
      <div className={`styleGrey01 exstatus paid${rowData.paid}`}>
        {rowData.paid === true ? (
          <><span className="dots"></span> Paid </>
        ) : (
          <>Not Paid <span className="dots"></span></>
        )}
      </div>
    </div>
  }

  const rowClassName = (data) => (data?.deleted ? style.deletedRow : data?.paid ? style.paidRow : style.unpaidRow);
  
  return (
    <DataTable ref={ref} value={expenses} scrollable selectionMode={'checkbox'} removableSort
      columnResizeMode="expand" resizableColumns showGridlines size={'large'}
      scrollHeight={"calc(100vh - 182px)"} className="border" selection={selected}
      onSelectionChange={(e) => setSelected(e.value)}
      loading={loading}
      loadingIcon={loadingIconTemplate}
      emptyMessage={NoDataFoundTemplate}
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
  )
})

export default SupplierHistoryTable