import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Building, GeoAlt, Globe, Person } from 'react-bootstrap-icons';
import { Tag } from 'primereact/tag';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';

import style from './suppliers.module.scss';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';
import { getListOfSuppliers } from '../../../../APIs/SuppliersApi';
import { Spinner } from 'react-bootstrap';

export const SupplierTable = forwardRef(({ searchValue, setTotalSuppliers, selectedSuppliers, setSelectedSuppliers }, ref) => {
    const navigate = useNavigate();
    const observerRef = useRef(null);
    const [suppliers, setSuppliers] = useState([]);
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

            const data = await getListOfSuppliers(page, limit, searchValue, order);
            setTotalSuppliers(() => (data?.count || 0))
            if (page === 1) setSuppliers(data.results);
            else {
                if (data?.results?.length > 0)
                    setSuppliers(prev => {
                        const existingSupplierIds = new Set(prev.map(supplier => supplier.id));
                        const newSuppliers = data.results.filter(supplier => !existingSupplierIds.has(supplier.id));
                        return [...prev, ...newSuppliers];
                    });
            }
            setHasMoreData(data.count !== suppliers.length);
            setLoading(false);
        };

        loadData();

    }, [page, searchValue, sort]);

    useEffect(() => {
        if (suppliers.length > 0 && hasMoreData) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
            });

            const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
            if (lastRow) observerRef.current.observe(lastRow);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [suppliers, hasMoreData]);

    const websiteBody = (rowData) => {
        return rowData.website ? <Link to={rowData.website} target="_blank"><Globe className='show-on-hover-element' color='#98A2B3' /></Link> : "-"
    }

    const loadingIconTemplate = () => {
        return <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    }

    const onSort = (event) => {
        console.log('event: ', event);
        const { sortField, sortOrder } = event;
        setPage(1);  // Reset to page 1 whenever searchValue changes
        setSort({ sortField, sortOrder })
    };

    return (
        <DataTable ref={ref} value={suppliers} scrollable selectionMode={'checkbox'} removableSort
            columnResizeMode="expand" resizableColumns showGridlines size={'large'}
            scrollHeight={"calc(100vh - 175px)"} className="border" selection={selectedSuppliers}
            onSelectionChange={(e) => setSelectedSuppliers(e.value)}
            loading={loading}
            loadingIcon={loadingIconTemplate}
            emptyMessage={NoDataFoundTemplate}
            sortField={sort?.sortField}
            sortOrder={sort?.sortOrder}
            onSort={onSort}
        >
            <Column selectionMode="multiple" headerClassName='border-end-0 ps-4' bodyClassName={'show-on-hover border-end-0 ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
            <Column field="number" header="Supplier ID" headerClassName='paddingLeftHide' bodyClassName='paddingLeftHide' style={{ minWidth: '100px' }} frozen sortable></Column>
            <Column field="name" header="Supplier A→Z" headerClassName='shadowRight' bodyClassName='shadowRight' style={{ minWidth: '254px' }} frozen sortable></Column>
            <Column field="services" header="Supplier Services" style={{ minWidth: '469px' }}></Column>
            <Column field="email" header="Email" style={{ minWidth: '68px' }}></Column>
            <Column header="Address" style={{ minWidth: '313px' }}></Column>
            <Column header="State" style={{ minWidth: '60px' }}></Column>
            <Column header="Post Code" style={{ minWidth: '88px' }}></Column>
            <Column field='total_spent' header="Total Spent" style={{ minWidth: '111px' }} sortable></Column>
            <Column field="website" header="Website" body={websiteBody} style={{ minWidth: '56px', textAlign: 'center' }}></Column>
        </DataTable>
    )
})
