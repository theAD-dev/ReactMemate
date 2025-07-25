import { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Check, Filter, People } from 'react-bootstrap-icons';
import clsx from 'clsx';
import { useDebounce } from 'primereact/hooks';
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import style from './invoice-dropdown.module.scss';
import { getListOfSuppliers } from '../../../../../APIs/SuppliersApi';
import { FallbackImage } from '../../../../../shared/ui/image-with-fallback/image-avatar';

const InvoiceDropdown = ({ setFilters, filter }) => {
    const observerRef = useRef(null);
    const [showFilter, setShowFilter] = useState(false);
    const [key, setKey] = useState('suppliers');
    const [supplierValue, setSupplierValue] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);
    const limit = 25;

    useEffect(() => {
        setPage(1);
    }, [debouncedValue]);

    useEffect(() => {
        const loadData = async () => {
            const data = await getListOfSuppliers(page, limit, debouncedValue, 'name');
            if (page === 1) {
                if (supplierValue) {
                    const filteredSuppliers = data.results.filter(supplier => supplier.id !== supplierValue);
                    return setSuppliers([selectedSupplier, ...filteredSuppliers]);
                }

                setSuppliers(data.results);
            }

            else {
                if (data?.results?.length > 0) {
                    let results = data.results;
                    if (supplierValue) {
                        results = [selectedSupplier, ...data.results];
                    }
                    setSuppliers(prev => {
                        let previous = prev;
                        if (supplierValue) {
                            previous = [...prev, selectedSupplier];
                        }
                        const existingSupplierIds = new Set(previous.map(supplier => supplier.id));
                        const newSuppliers = results.filter(supplier => !existingSupplierIds.has(supplier.id));
                        return [...prev, ...newSuppliers];
                    });
                }
            }
            setHasMoreData(data.count !== suppliers.length);
        };

        loadData();
    }, [page, debouncedValue, supplierValue, selectedSupplier]);

    useEffect(() => {
        if (suppliers.length > 0 && hasMoreData) {
            const timeout = setTimeout(() => {
                const lastRow = document.querySelector('.supplier-dropdown .supplier-dropdown-item:last-child');

                if (lastRow) {
                    observerRef.current = new IntersectionObserver(entries => {
                        if (entries[0].isIntersecting) {
                            setPage(prevPage => prevPage + 1);
                        }
                    });
                    observerRef.current.observe(lastRow);
                }
            }, 1000); // Wait for DOM paint

            return () => {
                clearTimeout(timeout);
                if (observerRef.current) observerRef.current.disconnect();
            };
        }
    }, [suppliers, hasMoreData, showFilter]);

    const handleCancel = () => {
        setShowFilter(false);
        setKey('suppliers');
        setSupplierValue('');
        setSelectedSupplier(null);
        setInputValue('');
        setPage(1);
        setHasMoreData(true);
        setSuppliers([]);
        setFilters((prev) => {
            const { supplier, ...rest } = prev;
            return rest;
        });
    };

    const handleApply = () => {
        setShowFilter(false);
        if (!selectedSupplier) return;
        setFilters((prev) => ({ ...prev, supplier: [selectedSupplier?.name] }));
    };

    useEffect(()=> {
        if (!filter['supplier']) {
            setSelectedSupplier(null);
        }
    }, [filter]);

    return (
        <div className='supplier-filters'>
            <button className={`${style.filterBox}`} onClick={() => setShowFilter(!showFilter)}>
                <Filter />
            </button>
            {showFilter &&
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="filtterBoxWrapper"
                    style={{ marginLeft: '5px', marginTop: '5px' }}
                >
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
                            <input type="text" placeholder="Search" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="border search-resource" style={{ borderRadius: '4px', width: '260px', border: '1px solid #D0D5DD', color: '#424242', padding: '10px 10px 10px 36px', fontSize: '14px', height: '40px' }} />
                        </div>
                        <div className='supplier-dropdown' style={{ height: '350px', overflow: 'auto', marginLeft: '0px' }}>
                            {
                                suppliers?.map(option =>
                                    <div key={option.id} className={clsx(style.supplierDropdownItem, 'supplier-dropdown-item')} onClick={() => setSelectedSupplier(option)}>
                                        <div className='d-flex gap-2 align-items-center w-100'>
                                            <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #dedede' }}>
                                                <FallbackImage photo={option?.photo} has_photo={option?.has_photo} is_business={true} size={17} />
                                            </div>
                                            <div className='ellipsis-width' style={{ maxWidth: '200px' }}>{option?.name}</div>
                                        </div>
                                        {
                                            selectedSupplier?.id === option.id ? (
                                                <Check color="#1AB2FF" size={20} />
                                            ) : null
                                        }
                                    </div>
                                )
                            }
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

export default InvoiceDropdown;