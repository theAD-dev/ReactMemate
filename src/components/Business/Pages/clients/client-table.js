import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Building, GeoAlt, Globe, Person } from 'react-bootstrap-icons';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';

import style from './clients.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { getListOfClients } from '../../../../APIs/ClientsApi';
import { Button } from 'primereact/button';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';

const ClientTable = forwardRef(({ searchValue, setTotalClients, selectedClients, setSelectedClients }, ref) => {
    const navigate = useNavigate();
    const observerRef = useRef(null);
    const [clients, setCients] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({sortField: null, sortOrder: null});
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
            else if(sort?.sortOrder === -1) order = `-${sort.sortField}`;

            const data = await getListOfClients(page, limit, searchValue, order);
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
            setHasMoreData(data.count !== clients.length)
            setLoading(false);
        };

        loadData();

    }, [page, searchValue, sort]);

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

    const clientIDBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <span>{rowData.number?.split('-')?.[1]}</span>
            <Button label="Open" onClick={() => navigate(`/clients/${rowData.id}/order-history`)} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
        </div>
    }
    const nameBody = (rowData) => {
        return <div className='d-flex align-items-center'>
            <div style={{ overflow: 'hidden' }} className={`d-flex justify-content-center align-items-center ${style.clientImg} ${rowData.is_business ? "" : "rounded-circle"}`}>
                {rowData.photo ? <img src={rowData.photo} alt='clientImg' className='w-100' /> : rowData.is_business ? <Building color='#667085' /> : <Person color='#667085' />}
            </div>
            <div className={`${style.ellipsis}`}>{rowData.name}</div>
        </div>
    }

    const daysBody = (rowData) => {
        return <Tag value={rowData.days_in_company} style={{ height: '22px', minWidth: '26px', borderRadius: '4px', border: '1px solid #D0D5DD', background: '#fff', color: '#344054', fontSize: '12px', fontWeight: 500 }}></Tag>
    }

    const JobBody = (rowData) => {
        return <Tag value={rowData.jobsdone} style={{ height: '22px', minWidth: '32px', borderRadius: '16px', border: '1px solid #EAECF0', background: '#F9FAFB', color: '#344054', fontSize: '12px', fontWeight: 500 }}></Tag>
    }

    const totalTurnoverBody = (rowData) => {
        return <span style={{ color: '#667085' }}>${rowData.total_turnover}</span>
    }

    const averagePD = (rowData) => {
        return <Tag value={`$${rowData.average_pd}`} style={{ height: '22px', minWidth: '32px', borderRadius: '16px', border: '1px solid #ABEFC6', background: '#ECFDF3', color: '#067647', fontSize: '12px', fontWeight: 500 }}></Tag>
    }

    const projectBody = (rowData) => {
        return <Tag value={rowData.total_requests} style={{ height: '22px', minWidth: '32px', borderRadius: '16px', border: '1px solid #EAECF0', background: '#F9FAFB', color: '#344054', fontSize: '12px', fontWeight: 500 }}></Tag>
    }

    const orderFrequencyBody = (rowData) => {
        return <Tag value={`${rowData.order_frequency} p/m`} style={{ height: '22px', minWidth: '32px', borderRadius: '16px', border: '1px solid #A3E0FF', background: '#F2FAFF', color: '#1AB2FF', fontSize: '12px', fontWeight: 500 }}></Tag>
    }

    const addressesBody = (rowData) => {
        let defaultAddress = (rowData?.addresses?.length && rowData?.addresses[0]?.address) || "";
        let address = rowData?.addresses?.length && rowData?.addresses?.find((address) => address.is_main === true);
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <span style={{ color: '#98A2B3', fontSize: '14px' }}>{address?.address || defaultAddress || "-"}</span>
            {(address?.address || defaultAddress) &&
                <Link to={`http://maps.google.com/?q=${address?.address || defaultAddress}`} target='_blank' className={`${style.location} show-on-hover-element`}>
                    <GeoAlt />
                </Link>
            }
        </div>
    }

    const websiteBody = (rowData) => {
        return rowData.website ? <Link to={rowData.website} target="_blank"><Globe className='show-on-hover-element' color='#98A2B3' /></Link> : "-"
    }

    const onSort = (event) => {
        console.log('event: ', event);
        const { sortField, sortOrder } = event;
        setPage(1);  // Reset to page 1 whenever searchValue changes
        setSort({ sortField, sortOrder })
    };

    return (
        <DataTable ref={ref} value={clients} scrollable selectionMode={'checkbox'} removableSort
            columnResizeMode="expand" resizableColumns showGridlines size={'large'}
            scrollHeight={"calc(100vh - 182px)"} className="border" selection={selectedClients}
            onSelectionChange={(e) => setSelectedClients(e.value)} 
            loading={loading}
            emptyMessage={NoDataFoundTemplate}
            sortField={sort?.sortField}
            sortOrder={sort?.sortOrder}
            onSort={onSort}
        >
            <Column selectionMode="multiple" headerClassName='ps-4 border-end-0' bodyClassName={'show-on-hover border-end-0 ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
            <Column field="number" header="Client ID" body={clientIDBody} headerClassName='paddingLeftHide' bodyClassName='paddingLeftHide' style={{ minWidth: '100px' }} frozen sortable></Column>
            <Column field="name" header="Client A→Z" body={nameBody} headerClassName='shadowRight' bodyClassName='shadowRight' style={{ minWidth: '224px' }} frozen sortable></Column>
            <Column field="category" header="Category" style={{ minWidth: '94px' }}></Column>
            <Column field="days_in_company" header="Days in company" body={daysBody} style={{ minWidth: '56px' }} className='text-center'></Column>
            <Column field='jobsdone' header="Jobs" body={JobBody} style={{ minWidth: '56px', textAlign: 'center' }}></Column>
            <Column field='total_turnover' header="Total turnover" body={totalTurnoverBody} style={{ minWidth: '123px', textAlign: 'right' }} sortable></Column>
            <Column field='average_pd' header="Average P/D" body={averagePD} style={{ minWidth: '114px', textAlign: 'center' }} sortable></Column>
            <Column field='total_requests' header="Projects" body={projectBody} style={{ minWidth: '89px', textAlign: 'center' }} sortable></Column>
            <Column field='order_frequency' header="Order Frequency" body={orderFrequencyBody} style={{ minWidth: '140px' }} sortable></Column>
            <Column field='country' header="Country" style={{ minWidth: '75px' }} bodyStyle={{ color: '#667085' }}></Column>
            <Column header="Address" body={addressesBody} style={{ minWidth: '469px' }}></Column>
            <Column field="abn" header="ABN" style={{ minWidth: '140px' }}></Column>
            <Column field="website" header="Website" body={websiteBody} style={{ minWidth: '56px', textAlign: 'center' }}></Column>
        </DataTable>
    )
})

export default ClientTable