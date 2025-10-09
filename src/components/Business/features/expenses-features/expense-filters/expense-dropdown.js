import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { CalendarWeek, CurrencyDollar, Filter, Gear, People } from 'react-bootstrap-icons';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import clsx from 'clsx';
import { Checkbox } from 'primereact/checkbox';
import { useDebounce } from "primereact/hooks";
import { ProgressSpinner } from 'primereact/progressspinner';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import style from './expense-dropdown.module.scss';
import { getDepartments } from '../../../../../APIs/CalApi';
import { getListOfSuppliers } from '../../../../../APIs/SuppliersApi';
import { FallbackImage } from '../../../../../shared/ui/image-with-fallback/image-avatar';

const ExpenseDropdown = ({ setFilters, filter }) => {
    const observerRef = useRef(null);
    const dropdownRef = useRef(null);
    const [showFilter, setShowFilter] = useState(false);
    const [key, setKey] = useState('status');
    const [statusValue, setStatusValue] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [suppliers, setSuppliers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [supplierPage, setSupplierPage] = useState(1);
    const [departmentPage, setDepartmentPage] = useState(1);
    const [selectedSuppliers, setSelectedSuppliers] = useState(null);
    const [selectedDepartments, setSelectedDepartments] = useState(null);
    const [hasMoreSuppliers, setHasMoreSuppliers] = useState(true);
    const [hasMoreDepartments, setHasMoreDepartments] = useState(true);
    const [supplierInputValue, supplierDebouncedValue, setSupplierInputValue] = useDebounce('', 400);
    const [departmentInputValue, departmentDebouncedValue, setDepartmentInputValue] = useDebounce('', 400);
    const [supplierLoading, setSupplierLoading] = useState(false);
    const [departmentLoading, setDepartmentLoading] = useState(false);
    const limit = 25;

    // Reset pages when search values change
    useEffect(() => {
        setSupplierPage(1);
        setHasMoreSuppliers(true);
    }, [supplierDebouncedValue]);

    useEffect(() => {
        setDepartmentPage(1);
        setHasMoreDepartments(true);
    }, [departmentDebouncedValue]);

    // Load suppliers
    useEffect(() => {
        const loadSuppliers = async () => {
            setSupplierLoading(true);
            try {
                console.log(`Loading suppliers - Page: ${supplierPage}, Search: "${supplierDebouncedValue}"`);
                const data = await getListOfSuppliers(supplierPage, limit, supplierDebouncedValue, 'name');
                console.log(`Suppliers loaded - Results: ${data?.results?.length || 0}, Total: ${data?.count || 'unknown'}`);
                
                if (supplierPage === 1) {
                    setSuppliers(data?.results || []);
                } else {
                    if (data?.results?.length > 0) {
                        setSuppliers(prev => {
                            const existingIds = new Set(prev.map(s => s.id));
                            const newSuppliers = data.results.filter(s => !existingIds.has(s.id));
                            console.log(`Adding ${newSuppliers.length} new suppliers to existing ${prev.length}`);
                            return [...prev, ...newSuppliers];
                        });
                    }
                }
                // Set hasMoreSuppliers based on whether we have more data
                const hasMore = data?.count ? (supplierPage * limit) < data.count : (data?.results?.length || 0) >= limit;
                console.log(`Has more suppliers: ${hasMore} (page: ${supplierPage}, limit: ${limit}, total: ${data?.count || 'unknown'})`);
                setHasMoreSuppliers(hasMore);
            } catch (error) {
                console.error('Error loading suppliers:', error);
                setSuppliers([]);
                setHasMoreSuppliers(false);
            }
            setSupplierLoading(false);
        };

        loadSuppliers();
    }, [supplierPage, supplierDebouncedValue]);

    // Load departments
    useEffect(() => {
        const loadDepartments = async () => {
            setDepartmentLoading(true);
            try {
                const data = await getDepartments(1); // Get all departments
                if (departmentPage === 1) {
                    setDepartments(Array.isArray(data) ? data : []);
                } else {
                    if (Array.isArray(data) && data.length > 0) {
                        setDepartments(prev => {
                            const existingIds = new Set(prev.map(d => d.id));
                            const newDepts = data.filter(d => !existingIds.has(d.id));
                            return [...prev, ...newDepts];
                        });
                    }
                }
                setHasMoreDepartments(Array.isArray(data) && data.length === limit);
            } catch (error) {
                console.error('Error loading departments:', error);
                setDepartments([]);
            }
            setDepartmentLoading(false);
        };

        loadDepartments();
    }, [departmentPage, departmentDebouncedValue, selectedDepartments]);

    // Infinite scroll observers
    useEffect(() => {
        if (suppliers?.length > 0 && hasMoreSuppliers && key === 'suppliers' && !supplierLoading) {
            const timeout = setTimeout(() => {
                const lastRow = document.querySelector('.supplier-dropdown .supplier-dropdown-item:last-child');
                if (lastRow && observerRef.current) {
                    observerRef.current.disconnect();
                }
                if (lastRow) {
                    observerRef.current = new IntersectionObserver(
                        (entries) => {
                            if (entries[0].isIntersecting && hasMoreSuppliers && !supplierLoading) {
                                console.log('Intersection detected - loading next page of suppliers');
                                setSupplierPage(prev => prev + 1);
                            }
                        },
                        { threshold: 0.8 }
                    );
                    observerRef.current.observe(lastRow);
                }
            }, 500);

            return () => {
                clearTimeout(timeout);
                if (observerRef.current) observerRef.current.disconnect();
            };
        }
    }, [suppliers, hasMoreSuppliers, showFilter, key, supplierLoading]);

    useEffect(() => {
        if (departments?.length > 0 && hasMoreDepartments && key === 'departments') {
            const timeout = setTimeout(() => {
                const lastRow = document.querySelector('.department-dropdown .department-dropdown-item:last-child');
                if (lastRow) {
                    observerRef.current = new IntersectionObserver(
                        (entries) => {
                            if (entries[0].isIntersecting) {
                                setDepartmentPage(prev => prev + 1);
                            }
                        },
                        { threshold: 1.0 }
                    );
                    observerRef.current.observe(lastRow);
                }
            }, 1000);

            return () => {
                clearTimeout(timeout);
                if (observerRef.current) observerRef.current.disconnect();
            };
        }
    }, [departments, hasMoreDepartments, showFilter, key]);

    function formatDateToYMD(date) {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    }

    const handleStatusChange = (status) => {
        setStatusValue((prev) => {
            if (prev.includes(status)) {
                return prev.filter((s) => s !== status);
            }
            return [...prev, status];
        });
    };

    const handleCancel = () => {
        setShowFilter(false);
        setKey('status');
    };

    const handleApply = () => {
        setShowFilter(false);

        // Apply suppliers filter
        if (selectedSuppliers?.length) {
            setFilters((prev) => ({ ...prev, suppliers: [...selectedSuppliers] }));
        }

        // Apply departments filter
        if (selectedDepartments?.length) {
            setFilters((prev) => ({ ...prev, departments: [...selectedDepartments] }));
        }

        // Apply status filter
        const formattedStatus = statusValue.map((status) => {
            return { name: status, value: status };
        });
        console.log('Status value from checkboxes:', statusValue);
        console.log('Formatted status for API:', formattedStatus);
        
        // Always set the status filter (even if empty) to ensure proper state management
        setFilters((prev) => ({ ...prev, status: [...formattedStatus] }));

        // Apply date range filter
        if (dateRange && dateRange[0] && dateRange[1]) {
            let dateName = `${formatDateToYMD(dateRange[0])} - ${formatDateToYMD(dateRange[1])}`;
            setFilters((prev) => ({ ...prev, date: [{ name: dateName, value: dateRange }] }));
        }
    };

    // Sync with external filter state
    useEffect(() => {
        if (!filter?.suppliers) {
            setSelectedSuppliers(null);
        } else if (filter?.suppliers) {
            setSelectedSuppliers(filter.suppliers);
        }

        if (!filter?.departments) {
            setSelectedDepartments(null);
        } else if (filter?.departments) {
            setSelectedDepartments(filter.departments);
        }

        if (!filter?.status) {
            setStatusValue([]);
        } else if (filter?.status) {
            setStatusValue(filter.status.map((status) => status.value));
        }

        if (!filter?.date) {
            setDateRange([null, null]);
        } else if (filter?.date) {
            setDateRange(filter.date[0].value);
        }
    }, [filter]);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowFilter(false);
            }
        };

        if (showFilter) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilter]);

    return (
        <div className='supplier-filters' ref={dropdownRef}>
            <button className={`${style.filterBox}`} onClick={() => setShowFilter(!showFilter)}>
                <Filter />
            </button>
            {showFilter &&
                <Tabs
                    id="expense-filter-tabs"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="filtterBoxWrapper"
                    style={{ marginLeft: '5px', marginTop: '5px' }}
                >
                    <Tab
                        eventKey="status"
                        title={
                            <>
                                <CurrencyDollar color="#667085" size={16} /> Status
                            </>
                        }
                    >
                        <div className='d-flex align-items-center gap-3 p-2 mb-2'>
                            <Checkbox inputId="paid" checked={statusValue?.includes("paid")} onChange={() => handleStatusChange("paid")} />
                            <label htmlFor="paid" className='mb-0'>Paid</label>
                        </div>
                        <div className='d-flex align-items-center gap-3 p-2 mb-2'>
                            <Checkbox inputId="not_paid" checked={statusValue?.includes("not_paid")} onChange={() => handleStatusChange("not_paid")} />
                            <label htmlFor="not_paid" className='mb-0'>Not Paid</label>
                        </div>

                        <div className='d-flex justify-content-end gap-2 p-3 border-top'>
                            <Button className='outline-button' style={{ width: '115px', padding: '8px 14px' }} onClick={handleCancel}>Cancel</Button>
                            <Button className='solid-button' style={{ width: '115px', padding: '8px 14px' }} onClick={handleApply}>Apply</Button>
                        </div>
                    </Tab>

                    <Tab
                        eventKey="suppliers"
                        title={
                            <>
                                <People color="#667085" size={16} />Suppliers
                            </>
                        }
                    >
                        <div className={style.searchBox}>
                            <div style={{ position: 'absolute', top: '7px', left: '18px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search suppliers" 
                                value={supplierInputValue} 
                                onChange={(e) => setSupplierInputValue(e.target.value)} 
                                className="border search-resource" 
                                style={{ borderRadius: '4px', width: '260px', border: '1px solid #D0D5DD', color: '#424242', padding: '10px 10px 10px 36px', fontSize: '14px', height: '40px' }} 
                            />
                        </div>
                        <div className='supplier-dropdown' style={{ height: '350px', overflow: 'auto', marginLeft: '0px' }}>
                            {
                                suppliers?.map(option =>
                                    <div key={option.id} className={clsx(style.supplierDropdownItem, 'supplier-dropdown-item')} onClick={() => setSelectedSuppliers(prev => {
                                        if (prev?.some(supplier => supplier.id === option.id)) {
                                            return prev.filter(supplier => supplier.id !== option.id);
                                        }
                                        if (!prev) return [option];
                                        return [...prev, option];
                                    })}>
                                        <div className='d-flex gap-2 align-items-center w-100'>
                                            <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #dedede' }}>
                                                <FallbackImage photo={option?.photo} has_photo={option?.has_photo} is_business={true} size={17} />
                                            </div>
                                            <div className='ellipsis-width' style={{ maxWidth: '200px' }}>{option?.name}</div>
                                        </div>
                                        {
                                            selectedSuppliers?.some(supplier => supplier.id === option.id) ? (
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M16.25 5.625L7.5 14.375L3.75 10.625" stroke="#1AB2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            ) : null
                                        }
                                    </div>
                                )
                            }
                            {supplierLoading && (
                                <div className='d-flex justify-content-center p-2'>
                                    <ProgressSpinner style={{ width: "20px", height: "20px", color: "#1AB2FF" }} />
                                </div>
                            )}
                            {!supplierLoading && !hasMoreSuppliers && suppliers?.length > 0 && (
                                <div className='d-flex justify-content-center p-2 text-muted' style={{ fontSize: '12px' }}>
                                    No more suppliers to load
                                </div>
                            )}
                        </div>
                        <div className='d-flex justify-content-end gap-2 p-3 border-top'>
                            <Button className='outline-button' style={{ width: '115px', padding: '8px 14px' }} onClick={handleCancel}>Cancel</Button>
                            <Button className='solid-button' style={{ width: '115px', padding: '8px 14px' }} onClick={handleApply}>Apply</Button>
                        </div>
                    </Tab>

                    <Tab
                        eventKey="departments"
                        title={
                            <>
                                <Gear color="#667085" size={16} />Departments
                            </>
                        }
                    >
                        <div className={style.searchBox}>
                            <div style={{ position: 'absolute', top: '7px', left: '18px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                                </svg>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Search departments" 
                                value={departmentInputValue} 
                                onChange={(e) => setDepartmentInputValue(e.target.value)} 
                                className="border search-resource" 
                                style={{ borderRadius: '4px', width: '260px', border: '1px solid #D0D5DD', color: '#424242', padding: '10px 10px 10px 36px', fontSize: '14px', height: '40px' }} 
                            />
                        </div>
                        <div className='department-dropdown' style={{ height: '350px', overflow: 'auto', marginLeft: '0px' }}>
                            {
                                departments?.map(option =>
                                    <div key={option.id} className={clsx(style.supplierDropdownItem, 'department-dropdown-item')} onClick={() => setSelectedDepartments(prev => {
                                        if (prev?.some(dept => dept.id === option.id)) {
                                            return prev.filter(dept => dept.id !== option.id);
                                        }
                                        if (!prev) return [option];
                                        return [...prev, option];
                                    })}>
                                        <div className='d-flex gap-2 align-items-center w-100'>
                                            <div className='ellipsis-width' style={{ maxWidth: '200px' }}>{option?.name}</div>
                                        </div>
                                        {
                                            selectedDepartments?.some(dept => dept.id === option.id) ? (
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M16.25 5.625L7.5 14.375L3.75 10.625" stroke="#1AB2FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            ) : null
                                        }
                                    </div>
                                )
                            }
                            {departmentLoading && <ProgressSpinner style={{ width: "20px", height: "20px", color: "#1AB2FF" }} />}
                        </div>
                        <div className='d-flex justify-content-end gap-2 p-3 border-top'>
                            <Button className='outline-button' style={{ width: '115px', padding: '8px 14px' }} onClick={handleCancel}>Cancel</Button>
                            <Button className='solid-button' style={{ width: '115px', padding: '8px 14px' }} onClick={handleApply}>Apply</Button>
                        </div>
                    </Tab>

                    <Tab
                        eventKey='date'
                        title={<><CalendarWeek color="#667085" size={16} /> Date</>}
                    >
                        <div className='px-3 pt-2'>
                            <Flatpickr
                                value={dateRange}
                                onChange={setDateRange}
                                options={{
                                    dateFormat: "Y-m-d",
                                    mode: "range",
                                    inline: true,
                                }}
                            />
                        </div>
                        <div className='d-flex justify-content-end gap-2 p-3 border-top'>
                            <Button className='outline-button' style={{ width: '115px', padding: '8px 14px' }} onClick={handleCancel}>Cancel</Button>
                            <Button className='solid-button' style={{ width: '115px', padding: '8px 14px' }} onClick={handleApply}>Apply</Button>
                        </div>
                    </Tab>
                </Tabs>
            }
        </div>
    );
};

export default ExpenseDropdown;