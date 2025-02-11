import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Envelope, GeoAlt, Globe } from 'react-bootstrap-icons';
import { Button } from 'primereact/button';
import { Link, useNavigate } from 'react-router-dom';
import { OverlayPanel } from "primereact/overlaypanel";

import style from './suppliers.module.scss';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';
import { getListOfSuppliers } from '../../../../APIs/SuppliersApi';
import { Spinner } from 'react-bootstrap';
import ImageAvatar from '../../../../ui/image-with-fallback/image-avatar';
import { Tag } from 'primereact/tag';

export const SupplierTable = forwardRef(({ searchValue, setTotalSuppliers, selectedSuppliers, setSelectedSuppliers, refetch }, ref) => {
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
    }, [searchValue, refetch]);

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

    }, [page, searchValue, sort, refetch]);

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

    const supplierIdBodyTemplate = (rowData) => {
        return <div className='d-flex align-items-center'>
            <span>{rowData.number}</span>
        </div>
    }

    const nameBodyTemplate = (rowData) => {
        return <div className='d-flex align-items-center gap-1 show-on-hover'>
            <ImageAvatar has_photo={rowData.has_photo} photo={rowData.photo} is_business={true} />
            <div className={`${style.ellipsis}`}>{rowData.name}</div>
            <Button label="Open" onClick={() => navigate(`/suppliers/${rowData.id}/history`)} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
        </div>
    }

    const ServicesBodyTemplate = (rowData) => {
        const op = useRef(null);
        const handleServiceClick = (event) => {
            if (op.current) op.current.toggle(event);
        };

        let services = rowData?.services?.split(",") || [];

        const displayedServices = services.slice(0, 5);
        const hiddenServices = services.slice(5);
        const hiddenCount = services.length - 5;

        return (
            <div className='d-flex align-items-center gap-2'>
                {displayedServices.map((service, index) => (
                    <div key={`${rowData.id}-service-${index}`} className={style.serviceTag}>
                        <span className={style.serviceName} title={service}>{service}</span>
                    </div>
                ))}
                {hiddenCount > 0 && (
                    <div
                        className={style.serviceTag}
                        onClick={handleServiceClick}
                        style={{ color: '#106B99', cursor: "pointer", border: '1px solid #76D1FF', background: '#F2FAFF' }}
                    >
                        +{hiddenCount}
                    </div>
                )}
                <OverlayPanel ref={op} className="servicesOverlay">
                    <div className="flex flex-column">
                        {hiddenServices.map((service, index) => (
                            <div key={`${rowData.id}-service-full-${index}`} className={style.serviceTag}>{service}</div>
                        ))}
                    </div>
                </OverlayPanel>
            </div>
        );
    };

    const emailBodyTemplate = (rowData) => {
        return <div className='d-flex align-items-center justify-content-center'>
            <Link to='#'
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `mailto:${rowData?.email}`;
                }}
            >
                <Envelope size={20} color='#98A2B3' className='email-icon' />
            </Link>
        </div>
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

    const addressesStateBodyTemplate = (rowData) => {
        let defaultState = (rowData?.addresses?.length && rowData?.addresses[0]?.state_alias) || "";
        let address = rowData?.addresses?.length && rowData?.addresses?.find((address) => address.is_main === true);
        return address?.state_alias || defaultState || "-";
    }

    const addressesPostCodeBodyTemplate = (rowData) => {
        let defaultPost = (rowData?.addresses?.length && rowData?.addresses[0]?.postcode) || "";
        let address = rowData?.addresses?.length && rowData?.addresses?.find((address) => address.is_main === true);
        return address?.postcode || defaultPost || "-";
    }

    const websiteBody = (rowData) => {
        return rowData.website ? <Link to={rowData.website} target="_blank"><Globe className='show-on-hover-element' color='#98A2B3' /></Link> : "-"
    }

    const totalSpentBody = (rowData) => {
        return <Tag value={`$ ${rowData.total_spent}`} style={{ height: '22px', minWidth: '26px', borderRadius: '20px', border: '1px solid #D0D5DD', background: '#fff', color: '#344054', fontSize: '12px', fontWeight: 500 }}></Tag>
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
        <DataTable ref={ref} value={suppliers} scrollable selectionMode={'checkbox'} removableSort
            columnResizeMode="expand" resizableColumns
            onColumnResizeEnd={onResizeColumn}
            showGridlines size={'large'}
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
            <Column field="id" header="Supplier ID" body={supplierIdBodyTemplate} headerClassName='paddingLeftHide' bodyClassName='paddingLeftHide' style={{ minWidth: '100px' }} frozen sortable></Column>
            <Column field="name" header="Supplier A→Z" body={nameBodyTemplate} headerClassName='shadowRight' bodyClassName='shadowRight' style={{ minWidth: '254px' }} frozen sortable></Column>
            <Column field="services" header="Supplier Services" body={ServicesBodyTemplate} style={{ minWidth: '469px' }}></Column>
            <Column field="email" header="Email" body={emailBodyTemplate} style={{ minWidth: '68px' }}></Column>
            <Column header="Address" body={addressesBody} style={{ minWidth: '313px' }}></Column>
            <Column header="State" body={addressesStateBodyTemplate} style={{ minWidth: '60px', textAlign: 'center' }}></Column>
            <Column header="Post Code" body={addressesPostCodeBodyTemplate} style={{ minWidth: '88px', textAlign: 'center' }}></Column>
            <Column field='total_spent' body={totalSpentBody} header="Total Spent" style={{ minWidth: '111px' }} sortable></Column>
            <Column field="website" header="Website" body={websiteBody} style={{ minWidth: '56px', textAlign: 'center' }}></Column>
        </DataTable>
    )
})
