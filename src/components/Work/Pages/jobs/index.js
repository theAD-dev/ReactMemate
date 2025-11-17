import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { useDebounce } from 'primereact/hooks';
import JobsTable from './jobs-table';
import style from './jobs.module.scss';
import CreateJob from '../../features/create-job/create-job';
import JobChat from '../../features/job-chat';
import JobFilterDropdown from '../../features/job-filters/job-filter-dropdown';
import JobFilters from '../../features/job-filters/job-filters';

const JobsPage = () => {
    const dt = useRef(null);
    const [total, setTotal] = useState(0);
    const [visible, setVisible] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);
    const [selected, setSelected] = useState([]);
    const [filter, setFilters] = useState({});

    const exportCSV = (selectionOnly) => {
        if (dt.current) {
            dt.current.exportCSV({ selectionOnly });
        } else {
            console.error('DataTable ref is null');
        }
    };
    return (
        <div className='jobs-page'>
            <Helmet>
                <title>MeMate - Jobs</title>
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
                                    <JobFilterDropdown setFilters={setFilters} filter={filter} />
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

                <div className="featureName d-flex align-items-center" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <h1 className="title p-0" style={{ marginRight: '16px' }}>Jobs</h1>
                    <Button className={`${style.newButton}`} onClick={() => setVisible(true)}>New Job</Button>
                </div>
                <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
                    <h1 className={`${style.total} mb-0`}>Total</h1>
                    <div className={`${style.totalCount}`}>{total} Jobs</div>
                </div>
            </div>
            {Object.keys(filter).length > 0 && (
                <JobFilters setFilters={setFilters} filter={filter} />
            )}
            <JobsTable ref={dt} searchValue={debouncedValue} setTotal={setTotal} selected={selected} setSelected={setSelected} refetch={refetch}
                setRefetch={setRefetch} createJobVisible={setVisible} isCreateJobVisible={visible} isFilterEnabled={Object.keys(filter).length > 0} filters={filter} />
            <JobChat />
            <CreateJob visible={visible} setVisible={setVisible} setRefetch={setRefetch}/>
        </div>
    );
};

export default JobsPage;