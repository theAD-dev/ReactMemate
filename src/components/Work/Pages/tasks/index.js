import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Download, Filter } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';
import { useDebounce } from 'primereact/hooks';
import TaskTable from './task-table';
import style from './task.module.scss';
import CreateTask from '../../features/task/create-task/create-task';

const TaskPage = () => {
    const dt = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchParamValue = searchParams.get('search');
    const targetId = searchParams.get('targetId');
    const [total, setTotal] = useState(0);
    const [visible, setVisible] = useState(false);
    const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);
    const [selected, setSelected] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const [showStatusFilter, setShowStatusFilter] = useState(false);
    const [filter, setFilter] = useState({ status: 'not-complete' });
    const [shouldHighlight, setShouldHighlight] = useState(false);

    const exportCSV = (selectionOnly) => {
        if (dt.current) {
            dt.current.exportCSV({ selectionOnly });
        } else {
            console.error('DataTable ref is null');
        }
    };

    // close the status filter when clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showStatusFilter && !event.target.closest(`.${style.statusFilter}`) && !event.target.closest('.p-button')) {
                setShowStatusFilter(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showStatusFilter]);

    // Handle search from notification redirect
    useEffect(() => {
        if (searchParamValue && targetId) {
            setInputValue(searchParamValue);
            setShouldHighlight(true);
            // Set filter to 'all' to include completed tasks in search
            setFilter({ status: 'all' });
        }
    }, [searchParamValue, targetId, setInputValue]);

    // Wait for debounced value to change and data to load, then highlight
    useEffect(() => {
        if (!shouldHighlight || !targetId || debouncedValue !== searchParamValue) return;

        const highlightAndScroll = (row) => {
            row.classList.add('highlight-row');
            
            // Scroll within the table container without affecting page scroll
            setTimeout(() => {
                const tableContainer = row.closest('.p-datatable-wrapper');
                if (tableContainer) {
                    const rowTop = row.offsetTop;
                    const containerHeight = tableContainer.clientHeight;
                    const scrollPosition = rowTop - (containerHeight / 2) + (row.clientHeight / 2);
                    tableContainer.scrollTo({ top: scrollPosition, behavior: 'smooth' });
                }
            }, 100);
            
            setTimeout(() => {
                row.classList.remove('highlight-row');
                setShouldHighlight(false);
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete('search');
                newSearchParams.delete('targetId');
                setSearchParams(newSearchParams, { replace: true });
            }, 6000);
        };

        const attemptHighlight = (delay, isRetry = false) => {
            return setTimeout(() => {
                const targetRow = document.querySelector(`.row-id-${targetId}`);
                if (targetRow) {
                    highlightAndScroll(targetRow);
                } else if (!isRetry) {
                    const retryTimer = attemptHighlight(1500, true);
                    return () => clearTimeout(retryTimer);
                } else {
                    setShouldHighlight(false);
                    console.warn('Target row not found:', targetId);
                }
            }, delay);
        };

        const timer = attemptHighlight(800);
        return () => clearTimeout(timer);
    }, [shouldHighlight, targetId, debouncedValue, searchParamValue, searchParams, setSearchParams]);

    return (
        <div className='jobs-page'>
            <Helmet>
                <title>MeMate - Tasks</title>
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
                        ) : (
                            <>
                                <div className='filtered-box'>
                                    <button className={`${style.filterBox}`} onClick={() => {}}><Filter size={20}/></button>
                                </div>
                                <div className="searchBox" style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '2px', left: '6px' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                                        </svg>
                                    </div>
                                    <input type="text" placeholder="Search" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="border search-resource" style={{ borderRadius: '4px', width: '184px', border: '1px solid #D0D5DD', color: '#424242', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Button className='outline-button' style={{ padding: '4px 8px', height: '32px', fontSize: '14px', color: '#667085', border: '1px solid #D0D5DD', backgroundColor: '#FFFFFF' }} onClick={() => setShowStatusFilter(!showStatusFilter)}>
                                        <Filter size={16} style={{ marginRight: '0px' }}/>
                                        <span style={{ color: '#667085', fontSize: '14px', fontWeight: '400' }}>Status</span>
                                        {/* {
                                            filter.status === 'complete' ? <span style={{ fontSize: '12px', color: '#067647' }}>Complete</span> :
                                            filter.status === 'not-complete' ? <span style={{ fontSize: '12px', color: '#93370d' }}>Not Complete</span> :
                                            <span style={{ color: '#667085', fontSize: '14px', fontWeight: '400' }}>Status</span>
                                        } */}
                                    </Button>
                                    {
                                        showStatusFilter &&
                                        <div className={`${style.statusFilter}`}>
                                            <div className='d-flex align-items-center p-2 mb-2'>
                                                <Checkbox checked={filter.status === 'complete'} label="complete" onClick={() => setFilter({ status: 'complete' })} />
                                                <div onClick={() => setFilter({ status: 'complete' })} className={style.complete} style={{ marginLeft: '16px' }}>Complete</div>
                                            </div>
                                            <div className='d-flex align-items-center p-2 mb-2'>
                                                <Checkbox checked={filter.status === 'not-complete'} label="not-complete" onClick={() => setFilter({ status: 'not-complete' })} />
                                                <div onClick={() => setFilter({ status: 'not-complete' })} className={`${style.pending} cursor-pointer`} style={{ marginLeft: '16px' }}>Not Complete</div>
                                            </div>
                                            <div className='d-flex align-items-center p-2 mb-2'>
                                                <Checkbox checked={filter.status === 'all'} label="all" onClick={() => setFilter({ status: 'all' })} />
                                                <div onClick={() => setFilter({ status: 'all' })} className={`${style.pending} cursor-pointer`} style={{ marginLeft: '16px' }}>All</div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </>
                        )
                    }
                </div>

                <div className="featureName d-flex align-items-center" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <h1 className="title p-0" style={{ marginRight: '16px' }}>Tasks</h1>
                    <Button onClick={()=> setVisible(true)} className={`${style.newButton}`}>Create New Task </Button>
                </div>
                <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
                    <h1 className={`${style.total} mb-0`}>Total</h1>
                    <div className={`${style.totalCount}`}>{total} Jobs</div>
                </div>
            </div>
            <TaskTable ref={dt} searchValue={debouncedValue} setTotal={setTotal} selected={selected} setSelected={setSelected} refetch={refetch} setRefetch={setRefetch} filter={filter} />
            <CreateTask show={visible} setShow={setVisible} refetch={() => setRefetch((refetch)=> !refetch)}/>
        </div>
    );
};

export default TaskPage;