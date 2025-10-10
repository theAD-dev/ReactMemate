import { forwardRef, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import style from './assets.module.scss';
import { getListOfVehicles } from '../../../APIs/assets-api';
import { getMobileUserList, getUserList } from '../../../APIs/task-api';
import { useTrialHeight } from '../../../app/providers/trial-height-provider';
import ViewVehicle from '../../../features/business/assets/view-vehicle/view-vehicle';
import { FallbackImage } from '../../../shared/ui/image-with-fallback/image-avatar';
import Loader from '../../../shared/ui/loader/loader';
import NoDataFoundTemplate from '../../../ui/no-data-template/no-data-found-template';

const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(+timestamp * 1000);
    const day = date.getDate();
    const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
        month: "short",
    }).format(date);
    const year = date.getFullYear();
    return `${day} ${monthAbbreviation} ${year}`;
};

const VehiclesTable = forwardRef(({ searchValue, selected, setSelected, refetch, setRefetch }, ref) => {
    const { trialHeight } = useTrialHeight();
    const observerRef = useRef(null);
    const [drivers, setDrivers] = useState({});
    const [assets, setAssets] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [tempSort, setTempSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const limit = 25;

    const [visible, setVisible] = useState(false);
    const [editData, setEditData] = useState(null);

    const usersList = useQuery({ queryKey: ['getUserList'], queryFn: getUserList });
    const mobileUsersList = useQuery({ queryKey: ['getMobileUserList'], queryFn: getMobileUserList });

    useEffect(() => {
        const combinedUsers = {};
        if (usersList?.data?.users?.length > 0) {
            usersList.data.users.forEach(user => {
                combinedUsers[user.id] = user;
            });
        }
        if (mobileUsersList?.data?.users?.length > 0) {
            mobileUsersList.data.users.forEach(user => {
                combinedUsers[user.id] = user;
            });
        }
        setDrivers(combinedUsers);
    }, [usersList?.data, mobileUsersList?.data]);

    useEffect(() => {
        setPage(1);  // Reset to page 1 whenever searchValue changes
    }, [searchValue, refetch]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            let order = "";
            if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
            else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

            const data = await getListOfVehicles(page, limit, searchValue, order);
            if (page === 1) {
                setAssets(data.results);
                setHasMoreData(data.count > data.results.length);
            } else {
                if (data?.results?.length > 0)
                    setAssets(prev => {
                        const existingAssetIds = new Set(prev.map(asset => asset.id));
                        const newAssets = data.results.filter(asset => !existingAssetIds.has(asset.id));
                        const updatedAssets = [...prev, ...newAssets];
                        setHasMoreData(data.count > updatedAssets.length);
                        return updatedAssets;
                    });
                else {
                    setHasMoreData(false);
                }
            }
            setSort(tempSort);
            setLoading(false);
        };

        loadData();

    }, [page, searchValue, tempSort, refetch]);

    useEffect(() => {
        if (assets.length > 0 && hasMoreData) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
            });

            const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
            if (lastRow) observerRef.current.observe(lastRow);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [assets, hasMoreData]);

    const VehicleNameBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <div className='d-flex flex-column' style={{ lineHeight: '1.385' }}>
                <span>{rowData.make || "-"}</span>
                <span className='font-12' style={{ color: '#98A2B3' }}>{formatDate(rowData.created_at)}</span>
            </div>
            <Button label="Open" onClick={() => { setVisible(true); setEditData({ id: rowData?.id }); }} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
        </div>;
    };

    const modelBody = (rowData) => {
        return <span>{rowData.model || "-"}</span>;
    };

    const yearBody = (rowData) => {
        return <span>{rowData.year_manufactured || "-"}</span>;
    };

    const regoBody = (rowData) => {
        return <span>{rowData.registration_number || "-"}</span>;
    };

    const driverBody = (rowData) => {
        const driver = drivers[rowData.driver];
        if (!driver) return <span>-</span>;
        
        return <div className='d-flex gap-2 align-items-center'>
            <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #dedede' }}>
                <FallbackImage photo={driver?.photo} has_photo={driver?.has_photo} is_business={false} size={17} />
            </div>
            {driver?.first_name} {driver?.last_name}
        </div>;
    };

    const regoDueBody = (rowData) => {
        return <span>{formatDate(rowData.insurance_expiry)}</span>;
    };

    const nextServiceBody = (rowData) => {
        return <span>{formatDate(rowData.next_service)}</span>;
    };

    const serviceBody = () => {
        return <Tag value="Service" style={{
            height: '22px',
            minWidth: '60px',
            borderRadius: '16px',
            border: '1px solid #1AB2FF',
            background: '#EBF8FF',
            color: '#1AB2FF',
            fontSize: '12px',
            fontWeight: 500
        }} />;
    };

    const currentOdometerBody = (rowData) => {
        return <span>{rowData.odometer_km ? `${parseInt(rowData.odometer_km).toLocaleString()} km` : "-"}</span>;
    };

    const daysOfOwnershipBody = (rowData) => {
        return <span>{rowData.days_of_ownership || "-"}</span>;
    };

    const costPerKmBody = (rowData) => {
        return <span>{rowData.cost_per_km ? `$${parseFloat(rowData.cost_per_km).toFixed(2)} per km` : "-"}</span>;
    };

    const costPerDayBody = (rowData) => {
        return <span>{rowData.cost_per_day ? `$${parseFloat(rowData.cost_per_day).toFixed(2)} per day` : "-"}</span>;
    };


    const rowClassName = (data) => (data?.deleted ? style.deletedRow : '');

    const onSort = (event) => {
        const { sortField, sortOrder } = event;

        setTempSort({ sortField, sortOrder });
        setPage(1);  // Reset to page 1 whenever searchValue changes
    };

    return (
        <>
            <DataTable ref={ref} value={assets} scrollable selectionMode={'checkbox'}
                columnResizeMode="expand" resizableColumns showGridlines size={'large'}
                scrollHeight={`calc(100vh - 175px - ${trialHeight}px)`} className="border" selection={selected}
                onSelectionChange={(e) => setSelected(e.value)}
                loading={loading}
                loadingIcon={Loader}
                emptyMessage={<NoDataFoundTemplate isDataExist={!!searchValue} />}
                sortField={sort?.sortField}
                sortOrder={sort?.sortOrder}
                onSort={onSort}
                rowClassName={rowClassName}
            >
                <Column selectionMode="multiple" headerClassName='ps-4 border-end-0' bodyClassName={'show-on-hover border-end-0 ps-4'} style={{ zIndex: 2 }} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
                <Column field='make' header='Make' body={VehicleNameBody} headerClassName='paddingLeftHide' bodyClassName='paddingLeftHide' style={{ minWidth: '150px' }} sortable />
                <Column field='model' header='Model' body={modelBody} style={{ minWidth: '120px' }} />
                <Column field='year_manufactured' header='Year' body={yearBody} style={{ minWidth: '80px' }} />
                <Column field='registration_number' header='Rego' body={regoBody} style={{ minWidth: '100px' }} />
                <Column field='driver' header='Driver' body={driverBody} style={{ minWidth: '120px' }} />
                <Column field='rego_due' header='Rego Due' body={regoDueBody} style={{ minWidth: '120px' }} />
                <Column field='next_service' header='Next Service' body={nextServiceBody} style={{ minWidth: '120px' }} />
                <Column header='Service' body={serviceBody} style={{ minWidth: '80px' }} />
                <Column field='current_odometer' header='Current Odometer' body={currentOdometerBody} style={{ minWidth: '130px' }} />
                <Column field='days_of_ownership' header='Days of Ownership' body={daysOfOwnershipBody} style={{ minWidth: '140px' }} />
                <Column field='cost_per_km' header='Cost per km' body={costPerKmBody} style={{ minWidth: '120px' }} />
                <Column field='cost_per_day' header='Cost per day' body={costPerDayBody} style={{ minWidth: '120px' }} />
            </DataTable>
            {visible && editData?.id && <ViewVehicle visible={visible} setVisible={setVisible} editData={editData} setEditData={setEditData} onClose={() => { setVisible(false); setEditData(null); }} setRefetch={setRefetch} drivers={drivers} />}
        </>
    );
});

export default VehiclesTable;