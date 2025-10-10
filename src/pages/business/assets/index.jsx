import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { BoxSeam, Download, Filter, Truck } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useDebounce } from 'primereact/hooks';
import style from './assets.module.scss';
import VehiclesTable from './vehicles-table';
import { getListOfAssetCategories } from '../../../APIs/assets-api';
import { CreateNewVehicle } from '../../../features/business/assets/create-new-vehicle/create-new-vehicle';

const existingAssetsColorCode = {
    "vehicles": {
        color: '#17B26A',
        backgroundColor: '#ecfdf3',
        icon: <Truck color='#17B26A' size={16} className='me-2' />,
    },
    "equipment": {
        color: '#1AB2FF',
        backgroundColor: '#f0f9ff',
        icon: <BoxSeam color='#1AB2FF' size={16} className='me-2' />,
    }
};

// Default icon component for unknown asset types
const DefaultAssetIcon = ({ color = '#000000', size = 16 }) => (
    <BoxSeam color={color} size={size} className='me-2' />
);

const Assets = () => {
    const dt = useRef(null);
    const [refetch, setRefetch] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState(null);
    const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);
    const [searchParams, setSearchParams] = useSearchParams();

    // Get active asset from URL params
    const activeAssetType = searchParams.get('type');

    const listOfAssetCategoriesQuery = useQuery({
        queryKey: ['assetCategories'],
        queryFn: getListOfAssetCategories
    });

    const enrichedAssetCategories = useMemo(() => {
        const assetCategories = listOfAssetCategoriesQuery?.data || [];
        return assetCategories?.results?.filter(category => category.enabled)?.map(category => {
            const existingConfig = existingAssetsColorCode[category.asset_slug];
            return {
                ...category,
                label: category.asset_name,
                value: category.id,
                color: existingConfig?.color || '#6B7280',
                backgroundColor: existingConfig?.backgroundColor || '#F3F4F6',
                icon: existingConfig?.icon || <DefaultAssetIcon color={existingConfig?.color || '#6B7280'} />
            };
        }) || [];
    }, [listOfAssetCategoriesQuery?.data]);

    // Set default active asset type when data loads
    useEffect(() => {
        if (enrichedAssetCategories.length > 0 && !activeAssetType) {
            const firstCategory = enrichedAssetCategories[0];
            setSearchParams({ type: firstCategory.asset_slug });
        }
    }, [enrichedAssetCategories, activeAssetType, setSearchParams]);

    // Handle asset type change
    const handleAssetTypeChange = (assetSlug) => {
        setSearchParams({ type: assetSlug });
        setSelected(null); // Clear selections when changing asset type
    };

    // Get current active asset category
    const currentActiveAsset = enrichedAssetCategories.find(
        category => category.asset_slug === activeAssetType
    ) || enrichedAssetCategories[0];

    const exportCSV = (selectionOnly) => {
        if (dt.current) {
            dt.current.exportCSV({ selectionOnly });
        } else {
            console.error('DataTable ref is null');
        }
    };
    return (
        <>
            <Helmet>
                <title>MeMate - {currentActiveAsset?.label || 'Assets'}</title>
            </Helmet>
            <div className={`topbar ${selected?.length ? style.active : ''}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <div className='left-side d-flex align-items-center' style={{ gap: '16px' }}>
                    {
                        selected?.length ? (
                            <>
                                <h6 className={style.selectedCount}>Selected: {selected?.length}</h6>
                                <div className='filtered-box'>
                                    <button className={`${style.filterBox}`} onClick={() => exportCSV(true)}><Download /></button>
                                </div>
                            </>
                        )
                            : (
                                <>
                                    <div className='filtered-box'>
                                        <button className={`${style.filterBox}`} onClick={() => { }}><Filter size={20} /></button>
                                    </div>

                                    <div className="searchBox" style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: '2px', left: '6px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                                            </svg>
                                        </div>
                                        <input type="text" placeholder="Search" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="border search-resource" style={{ borderRadius: '4px', width: '184px', border: '1px solid #D0D5DD', color: '#424242', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
                                    </div>
                                </>
                            )
                    }
                </div>
                <div className="featureName d-flex align-items-center gap-3" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    {
                        enrichedAssetCategories && enrichedAssetCategories.length > 0 && enrichedAssetCategories.map((category) => {
                            const isActive = activeAssetType === category.asset_slug || (!activeAssetType && category === enrichedAssetCategories[0]);
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => handleAssetTypeChange(category.asset_slug)}
                                    className={clsx('d-flex align-items-center px-2 py-1', style.subMenuLink, {
                                        [style.activeVehicle]: isActive
                                    })}
                                    style={{
                                        backgroundColor: isActive ? category.backgroundColor : 'transparent',
                                        color: isActive ? category.color : '#6B7280',
                                        border: 'none',
                                        cursor: 'pointer',
                                        borderRadius: '4px'
                                    }}
                                >
                                    {React.cloneElement(category.icon, {
                                        color: isActive ? category.color : '#6B7280'
                                    })}
                                    <span className={style.topBarText}>{category.label}</span>
                                </button>
                            );
                        })
                    }
                </div>
                <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
                    <Button onClick={() => setVisible(true)} className={`${style.newButton}`}>
                        New {currentActiveAsset?.label || 'Asset'}
                    </Button>
                </div>
            </div>
            {
                activeAssetType && activeAssetType === 'vehicles' && currentActiveAsset && (
                    <>
                        <VehiclesTable ref={dt} searchValue={debouncedValue} selected={selected} setSelected={setSelected} refetch={refetch} setRefetch={setRefetch} />
                        <CreateNewVehicle visible={visible} setVisible={setVisible} setRefetch={setRefetch} />
                    </>
                )
            }
        </>
    );
};

export default Assets;