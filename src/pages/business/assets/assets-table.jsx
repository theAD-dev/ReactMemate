import { forwardRef, useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import style from './assets.module.scss';
import { getListOfVehicles } from '../../../APIs/assets-api';
import { useTrialHeight } from '../../../app/providers/trial-height-provider';
import ViewVehicle from '../../../features/business/assets/view-vehicle/view-vehicle';
import Loader from '../../../shared/ui/loader/loader';
import NoDataFoundTemplate from '../../../ui/no-data-template/no-data-found-template';

const formatDate = (timestamp) => {
    if (!timestamp) return '';
    console.log('timestamp: ', timestamp);
    const date = new Date(+timestamp * 1000);
    const day = date.getDate();
    const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
        month: "short",
    }).format(date);
    const year = date.getFullYear();
    return `${day} ${monthAbbreviation} ${year}`;
};

const AssetsTable = forwardRef(({ searchValue, selected, setSelected, refetch, setRefetch }, ref) => {
    const { trialHeight } = useTrialHeight();
    const observerRef = useRef(null);
    const [assets, setAssets] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [tempSort, setTempSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const limit = 25;

    const [visible, setVisible] = useState(false);
    const [editData, setEditData] = useState(null);

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
            if (page === 1) setAssets(data.results);
            else {
                if (data?.results?.length > 0)
                    setAssets(prev => {
                        const existingAssetIds = new Set(prev.map(asset => asset.id));
                        const newAssets = data.results.filter(asset => !existingAssetIds.has(asset.id));
                        return [...prev, ...newAssets];
                    });
            }
            setSort(tempSort);
            setHasMoreData(data.count !== assets.length);
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
                <span>{rowData.make || "NA"}</span>
                <span className='font-12' style={{ color: '#98A2B3' }}>{formatDate(rowData.created_at)}</span>
            </div>
            <Button label="Open" onClick={() => { setVisible(true); setEditData({ id: rowData?.id }); }} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
        </div>;
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
                <Column selectionMode="multiple" headerClassName='ps-4 border-end-0' bodyClassName={'show-on-hover border-end-0 ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
                <Column field='make' header='Make' body={VehicleNameBody} headerClassName='paddingLeftHide shadowRight' bodyClassName='paddingLeftHide shadowRight' sortable frozen/>
                <Column field='model' header='Model' />
                <Column field='year_manufactured' header='Year' />
                <Column field='registration_number' header='Rego' />
                <Column field='driver' header='Driver' />
                <Column field='vin_number' header='VIN' />
                <Column field='odometer_km' header='Odometer (km)' />
                <Column field='fuel_type' header='Fuel Type' />
                <Column field='insurance_expiry' header='Insurance Expiry' />
                <Column field='date_of_expiry' header='Rego Expiry' />
                <Column field='is_insurance_expired' header='Is Insurance Expired?' body={(rowData) => (rowData.is_insurance_expired ? 'Yes' : 'No')} />
                <Column field='disabled' header='Disabled' body={(rowData) => (rowData.disabled ? 'Yes' : 'No')} />
            </DataTable>
            {visible && editData?.id && <ViewVehicle visible={visible} setVisible={setVisible} editData={editData} setEditData={setEditData} onClose={() => { setVisible(false); setEditData(null); }} setRefetch={setRefetch} />}
        </>
    );
});

export default AssetsTable;