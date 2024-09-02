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

export const SupplierTable = forwardRef(({ setTotalSuppliers, selectedSuppliers, setSelectedSuppliers }, ref) => {
    const navigate = useNavigate();
    const observerRef = useRef(null);
    const [suppliers, setSuppliers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const limit = 25;


    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await getListOfSuppliers(page, limit);
            if(data.count) setTotalSuppliers(() => data.count)
        
            if (data?.results?.length > 0) setSuppliers(prev => {
                const existingSupplierIds = new Set(prev.map(supplier => supplier.id));
                const newSuppliers = data.results.filter(supplier => !existingSupplierIds.has(supplier.id));
                return [...prev, ...newSuppliers];
            });
            else setHasMoreData(false);
            setLoading(false);
        };

        loadData();
    }, [page]);

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


    return (
        <DataTable ref={ref} value={suppliers} scrollable selectionMode={'checkbox'} removableSort
            columnResizeMode="expand" resizableColumns showGridlines size={'large'}
            scrollHeight={"calc(100vh - 182px)"} className="border" selection={selectedSuppliers}
            onSelectionChange={(e) => setSelectedSuppliers(e.value)}
            loading={loading}
            emptyMessage={NoDataFoundTemplate}
        >
            <Column selectionMode="multiple" headerClassName='ps-4' bodyClassName={'show-on-hover ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
            <Column field="number" header="Supplier ID"  style={{ minWidth: '100px' }} frozen sortable></Column>
            <Column field="name" header="Supplier A→Z"  headerClassName='shadowRight' bodyClassName='shadowRight' style={{ minWidth: '254px' }} frozen></Column>
            <Column field="services" header="Supplier Services" style={{ minWidth: '600px' }}></Column>
            <Column field="email" header="Email"  style={{ minWidth: '68px' }}></Column>
            <Column header="Address" style={{ minWidth: '313px' }}></Column>
            <Column header="State" style={{ minWidth: '60px' }}></Column>
            <Column header="Post Code" style={{ minWidth: '88px' }}></Column>
            <Column field='total_spent' header="Total Spent" style={{ minWidth: '111px' }} sortable></Column>
            <Column field="website" header="Website" body={websiteBody} style={{ minWidth: '56px', textAlign: 'center' }}></Column>



            {/* <Column field="category" header="Category" style={{ minWidth: '94px' }}></Column>
            <Column field="days_in_company" header="Days in company" body={daysBody} style={{ minWidth: '56px' }} className='text-center'></Column>
            <Column field='jobsdone' header="Jobs" body={JobBody} style={{ minWidth: '56px', textAlign: 'center' }}></Column>
            <Column field='total_turnover' header="Total turnover" body={totalTurnoverBody} style={{ minWidth: '123px', textAlign: 'right' }} sortable></Column>
            <Column field='average_pd' header="Average P/D" body={averagePD} style={{ minWidth: '114px', textAlign: 'center' }} sortable></Column>
            <Column field='total_requests' header="Projects" body={projectBody} style={{ minWidth: '89px', textAlign: 'center' }} sortable></Column>
            <Column field='order_frequency' header="Order Frequency" body={orderFrequencyBody} style={{ minWidth: '140px' }} sortable></Column>
            <Column field='country' header="Country" style={{ minWidth: '75px' }} bodyStyle={{ color: '#667085' }}></Column>
            <Column header="Address" body={addressesBody} style={{ minWidth: '469px' }}></Column>
            <Column field="abn" header="ABN" style={{ minWidth: '140px' }}></Column>
            <Column field="website" header="Website" body={websiteBody} style={{ minWidth: '56px', textAlign: 'center' }}></Column> */}
        </DataTable>
    )
})
