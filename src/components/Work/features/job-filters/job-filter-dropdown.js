import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { CardChecklist, Check, Filter, People } from 'react-bootstrap-icons';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Checkbox } from 'primereact/checkbox';
import { Chip } from 'primereact/chip';
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import style from './job-filters.module.scss';
import { getTeamMobileUser } from '../../../../APIs/team-api';
import { FallbackImage } from '../../../../shared/ui/image-with-fallback/image-avatar';

const JobFilterDropdown = ({ setFilters, filter }) => {
    const [showFilter, setShowFilter] = useState(false);
    const [key, setKey] = useState('worker');
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState([]);
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const status = [
        { label: 'Draft', value: 'draft', className: 'DRAFT' },
        { label: 'Open', value: '1', className: 'OPEN' },
        { label: 'Assigned', value: '2', className: 'ASSIGNED' },
        { label: 'Submitted', value: '3', className: 'SUBMITTED' },
        { label: 'Finished', value: '4', className: 'FINISHED' },
        { label: 'In Progress', value: 'in_progress', className: 'IN_PROGRESS' },
        { label: 'Declined', value: '6', className: 'DECLINED' },
        { label: 'Confirmed', value: 'a', className: 'CONFIRMED' },
    ];

    const mobileUserQuery = useQuery({
        queryKey: ["mobileUser"],
        queryFn: getTeamMobileUser,
    });

    const statusCancel = () => {
        setShowFilter(false);
        setFilters((prev) => {
            const { status, ...rest } = prev;
            return rest;
        });
        setSelectedStatus([]);
    };

    const statusApply = () => {
        setShowFilter(false);
        if (!selectedStatus?.length) return;
        const newFilteredStatus = status.filter(item => selectedStatus.includes(item.value));
        setFilters((prev) => ({ ...prev, status: newFilteredStatus }));
    };

    useEffect(() => {
        document.addEventListener('click', (event) => {
            if (event.target.closest('.job-filters') || event.target.closest('.job-filters *')) return;
            setShowFilter(false);
        });

        return () => {
            document.removeEventListener('click', (event) => {
                if (event.target.closest('.job-filters') || event.target.closest('.job-filters *')) return;
                setShowFilter(false);
            });
        };
    }, []);

    useEffect(() => {
        if (!filter['status']) {
            setSelectedStatus([]);
        } else if (filter['status']?.length) {
            setSelectedStatus(filter['status'].map(item => item.value));
        } 
        if (!filter['worker']) {
            setSelectedWorker([]);
        } else if (filter['worker']?.length) {
            setSelectedWorker(filter['worker'] || []);
        }
    }, [filter]);


    const workerCancel = () => {
        setShowFilter(false);
        setFilters((prev) => {
            const { worker, ...rest } = prev;
            return rest;
        });
        setSelectedWorker([]);
    };

    const workerApply = () => {
        setShowFilter(false);
        if (!selectedWorker?.length) return;
        let selectedWorkers = selectedWorker.map(worker => ({ ...worker, label: worker.first_name + ' ' + worker.last_name }));
        setFilters((prev) => ({ ...prev, worker: [...selectedWorkers] }));
    };

    useEffect(() => {
        const mobileUsers = mobileUserQuery?.data?.users?.filter(user => user.status !== 'disconnected') || [];
        if (inputValue?.trim() === '') {
            setFilteredWorkers(mobileUsers);
            return;
        }

        const filtered = mobileUsers.filter(user =>
        (user.first_name?.toLowerCase().includes(inputValue.toLowerCase()) ||
            user.last_name?.toLowerCase().includes(inputValue.toLowerCase()))
        );
        setFilteredWorkers(filtered);
    }, [inputValue, mobileUserQuery?.data]);

    return (
        <div className='job-filters'>
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
                        eventKey="Worker"
                        title={
                            <>
                                <People color="#667085" size={16} />Worker
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
                        {
                            filteredWorkers?.map(user => (
                                <div key={user.id} className={clsx(style.DropdownItem)}
                                    onClick={() => setSelectedWorker(prev => {
                                        if (prev?.some(worker => worker.id === user.id)) {
                                            return prev.filter(worker => worker.id !== user.id);
                                        }
                                        if (!prev) return [user];
                                        return [...prev, user];
                                    })}
                                >
                                    <div className='d-flex gap-2 align-items-center w-100'>
                                        <div className='d-flex justify-content-center align-items-center' style={{ width: '24px', height: '24px', borderRadius: '40px', overflow: 'hidden', border: '1px solid #dedede' }}>
                                            <FallbackImage photo={user?.photo} has_photo={user?.has_photo} is_business={false} size={17} />
                                        </div>
                                        <div className='ellipsis-width' style={{ maxWidth: '200px' }}>{user.first_name} {user.last_name}</div>
                                    </div>
                                    {
                                        selectedWorker?.some(worker => worker.id === user.id) ? (
                                            <Check color="#1AB2FF" size={20} />
                                        ) : null
                                    }
                                </div>
                            ))
                        }
                        <div className='d-flex justify-content-end gap-2 p-3 border-top'>
                            <Button className='outline-button' style={{ width: '115px', padding: '8px 14px' }} onClick={workerCancel}>Cancel</Button>
                            <Button className='solid-button' style={{ width: '115px', padding: '8px 14px' }} onClick={workerApply}>Apply</Button>
                        </div>
                    </Tab>
                    <Tab
                        eventKey="status"
                        title={
                            <>
                                <CardChecklist color="#667085" size={16} />Status
                            </>
                        }
                    >
                        <div className='job-status' style={{ height: '350px', overflow: 'auto', marginLeft: '0px', padding: '6px 10px' }}>

                            {status.map((item) => (
                                <div className='d-flex align-items-center gap-3 p-2 mb-2' key={item.value}>
                                    <Checkbox checked={selectedStatus.includes(item.value)} onChange={(e) => {
                                        setSelectedStatus(prev => {
                                            if (e.checked) return [...prev, item.value];
                                            return prev.filter(i => i !== item.value);
                                        });
                                    }} />

                                    <Chip className={`status ${style[item.className]} font-14`} label={item.label} />
                                </div>
                            ))}
                        </div>
                        <div className='d-flex justify-content-end gap-2 p-3 border-top'>
                            <Button className='outline-button' style={{ width: '115px', padding: '8px 14px' }} onClick={statusCancel}>Cancel</Button>
                            <Button className='solid-button' style={{ width: '115px', padding: '8px 14px' }} onClick={statusApply}>Apply</Button>
                        </div>
                    </Tab>
                </Tabs>
            }
        </div>
    );
};

export default JobFilterDropdown;