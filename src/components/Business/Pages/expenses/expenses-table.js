import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Building, GeoAlt, Plus, Person } from 'react-bootstrap-icons';
import { Tag } from 'primereact/tag';

import style from './expenses.module.scss';
import { Link, useNavigate } from 'react-router-dom';

import { getListOfExpensens } from "../../../../APIs/ExpensesApi";
import { Button } from 'primereact/button';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';
import { Spinner } from 'react-bootstrap';

const ExpensesTable = forwardRef(({ searchValue, setTotalClients, selectedClients, setSelectedClients, isShowDeleted }, ref) => {
    const navigate = useNavigate();
    const observerRef = useRef(null);
    const [clients, setCients] = useState([]);
    console.log('clients: ', clients);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [tempSort, setTempSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const limit = 25;

    useEffect(() => {
        setPage(1);  // Reset to page 1 whenever searchValue changes
    }, [searchValue, isShowDeleted]);


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

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            let order = "";
            if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
            else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

            const data = await getListOfExpensens(page, limit, searchValue, order, isShowDeleted);
            setTotalClients(() => (data?.count || 0))
            if (page === 1) setCients(data.results);
            else {
                if (data?.results?.length > 0)
                    setCients(prev => {
                        const existingClientIds = new Set(prev.map(client => client.id));
                        const newClients = data.results.filter(client => !existingClientIds.has(client.id));
                        return [...prev, ...newClients];
                    });
            }
            setSort(tempSort);
            setHasMoreData(data.count !== clients.length)
            setLoading(false);
        };

        loadData();

    }, [page, searchValue, tempSort, isShowDeleted]);

    useEffect(() => {
        if (clients.length > 0 && hasMoreData) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
            });

            const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
            if (lastRow) observerRef.current.observe(lastRow);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [clients, hasMoreData]);

    const ExpensesIDBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <span>{rowData.order?.number}</span>
            <Button label="Open" onClick={() => navigate(`/expenses/${rowData.id}/expenses-history`)} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
        </div>
    }

    
    const nameBody = (rowData) => {
        return <div className='d-flex align-items-center'>
            <div style={{ overflow: 'hidden' }} className={`d-flex justify-content-center align-items-center ${style.clientImg} ${rowData.is_business ? "" : "rounded-circle"}`}>
                {rowData.supplier?.photo ? <img src={rowData.supplier?.photo} alt='clientImg' className='w-100' /> : rowData.is_business ? <Building color='#667085' /> : <Person color='#667085' />}
            </div>
            <div className='d-flex flex-column gap-1'>
            <div className={`${style.ellipsis}`}>{rowData.supplier?.name}</div>
            {rowData.deleted ?
                    <Tag value="Deleted" style={{ height: '22px', width: '59px', borderRadius: '16px', border: '1px solid #FECDCA', background: '#FEF3F2', color: '#912018', fontSize: '12px', fontWeight: 500 }}></Tag> : ''}
            </div>
            
        </div>
    }


    const dueDate = (rowData) => {
   
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`} style={{ color: "#98A2B3" }}>
           {formatDate(rowData.created)}
        </div>
    }
    const totalBody = (rowData) => {
   
        return <div className={`d-flex align-items-center justify-content-end show-on-hover ${style.fontStanderdSize}`} style={{ color: "#7a271a"}}> 
              $ {(rowData.total).toFixed(2)}<span className={style.plusIcon}><Plus size={12} color="#7a271a" /></span>
        </div>
    }
    const accountCode = (rowData) => {
   
        return <div className={`d-flex align-items-center justify-content-start show-on-hover ${style.fontStanderdSize}`}> 
            {rowData.account_code?.code} : {rowData.account_code?.name}             
        </div>
    }
    const departmentBody = (rowData) => {
           return <div className={`d-flex align-items-center justify-content-start show-on-hover ${style.fontStanderdSize}`}> 
           {rowData?.department?.name}        
        </div>
    }
    const StatusBody = (rowData) => {
   
        return <div className={`d-flex align-items-center justify-content-between show-on-hover ${style.expensesStatus}`}>
            <div className={`styleGrey01 exstatus paid ${rowData.paid}`}>
            {rowData.paid === true ? (
                <><span className="dots"></span> Paid </>
              ) : (
                <>Not Paid <span className="dots"></span></>
              )}
               
            </div>
        </div>
    }

    const loadingIconTemplate = () => {
        return <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    }

    const rowClassName = (data) => (data?.deleted ? style.deletedRow : '');
    
    const onSort = (event) => {
        const { sortField, sortOrder } = event;

        setTempSort({ sortField, sortOrder })
        setPage(1);  // Reset to page 1 whenever searchValue changes
    };

    return (
        <DataTable ref={ref} value={clients} scrollable selectionMode={'checkbox'}
            columnResizeMode="expand" resizableColumns showGridlines size={'large'}
            scrollHeight={"calc(100vh - 175px)"} className="border" selection={selectedClients}
            onSelectionChange={(e) => setSelectedClients(e.value)}
            loading={loading}
            loadingIcon={loadingIconTemplate}
            emptyMessage={NoDataFoundTemplate}
            sortField={sort?.sortField}
            sortOrder={sort?.sortOrder}
            onSort={onSort}
            rowClassName={rowClassName}
        >
            <Column selectionMode="multiple" headerClassName='ps-4 border-end-0' bodyClassName={'show-on-hover border-end-0 ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
            <Column field="id" header="Expense ID" body={ExpensesIDBody} headerClassName='paddingLeftHide' bodyClassName='paddingLeftHide' style={{ minWidth: '100px' }} frozen sortable></Column>
            <Column field="name" header="Supplier A→Z" body={nameBody} headerClassName='shadowRight' bodyClassName='shadowRight' style={{ minWidth: '224px' }} frozen sortable></Column>
            <Column field="invoice_reference" header="Reference"  style={{ minWidth: '94px' }}></Column>
            <Column field="created" header="Due Date" body={dueDate}  style={{ minWidth: '56px' }} className='text-center'></Column>
            <Column field='jobsdone' header="Total" body={totalBody}  style={{ minWidth: '56px', textAlign: 'end' }}></Column>
            <Column field='type' header="Interval/Order"  style={{ minWidth: '123px', textAlign: 'right' }} sortable></Column>
            <Column field='average_pd' header="Account Code" body={accountCode} style={{ minWidth: '114px', textAlign: 'left' }} sortable></Column>
            <Column field='total_requests' header="Xero/Myob"  style={{ minWidth: '89px', textAlign: 'center' }} sortable></Column>
            <Column field='department' header="Departments" body={departmentBody} style={{ minWidth: '140px' }} sortable></Column>
            <Column field='paid' header="Status" body={StatusBody} style={{ minWidth: '75px' }} bodyStyle={{ color: '#667085' }}></Column>
           
            
        </DataTable>
    )
})

export default ExpensesTable