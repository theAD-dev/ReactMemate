import React, { useEffect, useRef, useState } from 'react';
import { Col } from 'react-bootstrap';
import clsx from 'clsx';
import { Dropdown } from 'primereact/dropdown';
import { getListOfVehicles } from '../../../../../../APIs/assets-api';
import styles from '../expenses-form.module.scss';

function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

export const VehicleDropdown = ({ asset, setAsset, errors }) => {
    const vehicleObserverRef = useRef(null);
    const [vehicles, setVehicles] = useState([]);
    const [vehiclePage, setVehiclePage] = useState(1);
    const [vehicleSearchValue, setVehicleSearchValue] = useState("");
    const [hasMoreVehicles, setHasMoreVehicles] = useState(true);
    const limit = 25;

    // Vehicle search debounce function
    const searchVehicle = debounce((event) => {
        const query = event?.filter?.toLowerCase() || '';
        setVehicleSearchValue(query);
    }, 300);

    // Reset page when search value changes
    useEffect(() => {
        setVehiclePage(1);
    }, [vehicleSearchValue]);

    // Load vehicles
    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const data = await getListOfVehicles(vehiclePage, limit, vehicleSearchValue, 'registration_number');
                
                if (vehiclePage === 1) {
                    setVehicles(data?.results || []);
                } else {
                    if (data?.results?.length > 0) {
                        setVehicles(prev => {
                            const existingIds = new Set(prev.map(vehicle => vehicle.id));
                            const newVehicles = data.results.filter(vehicle => !existingIds.has(vehicle.id));
                            return [...prev, ...newVehicles];
                        });
                    }
                }
                setHasMoreVehicles(data?.results?.length === limit);
            } catch (error) {
                console.error('Error loading vehicles:', error);
            }
        };

        loadVehicles();
    }, [vehiclePage, vehicleSearchValue]);

    // Infinite scroll observer
    useEffect(() => {
        if (vehicles.length > 0 && hasMoreVehicles) {
            const timeout = setTimeout(() => {
                const lastRow = document.querySelector('.vehicle-dropdown .p-dropdown-items li.p-dropdown-item:last-child');

                if (lastRow) {
                    vehicleObserverRef.current = new IntersectionObserver(entries => {
                        if (entries[0].isIntersecting) {
                            setVehiclePage(prevPage => prevPage + 1);
                        }
                    });
                    vehicleObserverRef.current.observe(lastRow);
                }
            }, 1000);

            return () => {
                clearTimeout(timeout);
                if (vehicleObserverRef.current) vehicleObserverRef.current.disconnect();
            };
        }
    }, [vehicles, hasMoreVehicles]);

    return (
        <Col sm={6}>
            <label className={clsx(styles.lable)}>Select Vehicle</label>
            <Dropdown
                value={asset?.id || null}
                options={vehicles}
                optionLabel="registration_number"
                optionValue="id"
                onChange={(e) => {
                    setAsset(() => ({ ...asset, id: e.value }));
                }}
                itemTemplate={(option) => {
                    return (
                        <div className='d-flex gap-2 align-items-center w-100'>
                            <div className='ellipsis-width' style={{ maxWidth: '350px' }}>
                                <div style={{ fontWeight: '400' }}>{option?.make} {option?.model}</div>
                                <div style={{ fontSize: '12px', color: '#98A2B3' }}>
                                    {option?.registration_number || '-'} {option?.year_manufactured && `(${option?.year_manufactured})`}
                                </div>
                            </div>
                        </div>
                    );
                }}
                valueTemplate={(option) => {
                    return (
                        asset?.id === option?.id ? (
                            <div className='d-flex gap-2 align-items-center w-100'>
                                <div className='ellipsis-width' style={{ maxWidth: '350px' }}>
                                    {option?.make} {option?.model}
                                </div>
                            </div>
                        ) : null
                    );
                }}
                className={clsx(styles.dropdownSelect, 'dropdown-height-fixed')}
                panelClassName={"vehicle-dropdown"}
                style={{ height: '46px' }}
                scrollHeight="350px"
                placeholder="Search for vehicle"
                filter
                onFilter={searchVehicle}
                filterInputAutoFocus={true}
            />
            {errors?.assetId && <p className="error-message">{errors.assetId?.message}</p>}
        </Col>
    );
};
