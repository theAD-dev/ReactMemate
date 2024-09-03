import clsx from 'clsx';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import style from './supplier-history.module.scss';
import NoDataFoundTemplate from '../../../../../ui/no-data-template/no-data-found-template';
import { ArrowLeftCircle, FilePdf, Files, FileText, InfoCircle, Link45deg, PlusSlashMinus } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { getListOfExpenses } from '../../../../../APIs/SuppliersApi';

const SupplierHistoryTable = forwardRef(({ searchValue }, ref) => {
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ sortField: null, sortOrder: null });
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 25;

  useEffect(() => {
    setPage(1);  // Reset to page 1 whenever searchValue changes
  }, [searchValue]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      let order = "";
      if (sort?.sortOrder === 1) order = `${sort.sortField}`;
      else if (sort?.sortOrder === -1) order = `-${sort.sortField}`;

      const data = await getListOfExpenses(page, limit, searchValue, order);
      if (page === 1) setExpenses(data.results);
      else {
        if (data?.results?.length > 0)
          setExpenses(prev => {
            const existingIds = new Set(prev.map(data => data.id));
            const newData = data.results.filter(data => !existingIds.has(data.id));
            return [...prev, ...newData];
          });
      }
      setHasMoreData(data.count !== expenses.length);
      setLoading(false);
    };

    loadData();

  }, [page, searchValue, sort]);

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
    console.log('event: ', event);
    const { sortField, sortOrder } = event;
    setPage(1);  // Reset to page 1 whenever searchValue changes
    setSort({ sortField, sortOrder })
  };

  return (
    <DataTable ref={ref} value={expenses} scrollable selectionMode={'checkbox'} removableSort
      columnResizeMode="expand" resizableColumns showGridlines size={'large'}
      scrollHeight={"calc(100vh - 182px)"} className="border"
      loading={loading}
      loadingIcon={loadingIconTemplate}
      emptyMessage={NoDataFoundTemplate}
      sortField={sort?.sortField}
      sortOrder={sort?.sortOrder}
      onSort={onSort}
    >
      <Column selectionMode="multiple" headerClassName='ps-4' bodyClassName={'show-on-hover ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
      <Column field="number" header="Expense ID" frozen sortable style={{ minWidth: '122px' }} headerClassName='shadowRight' bodyClassName='shadowRight'></Column>
      <Column field="created" header="Date Input" style={{ minWidth: '122px' }} sortable></Column>
      <Column header="Date Payed" style={{ minWidth: '122px' }} sortable></Column>
      <Column field="invoice_reference" header="Reference" style={{ minWidth: '606px' }}></Column>
      <Column header="GST" style={{ minWidth: '107px' }} bodyClassName={"text-end"} sortable></Column>
      <Column field='total' header="Total" bodyClassName={"text-center"} style={{ minWidth: '111px' }} sortable></Column>
      <Column field='order.number' header="Interval/Order" style={{ minWidth: '130px' }}></Column>
      <Column field="department.name" header="Department" style={{ minWidth: '217px' }}></Column>
      <Column field='account_code.code' header="Account Code" body={accountCodeBodyTemplate} style={{ minWidth: '214px' }}></Column>
      <Column field='paid' header="Status" bodyClassName={"text-center"} style={{ minWidth: '123px' }}></Column>
    </DataTable>
  )
})

export default SupplierHistoryTable