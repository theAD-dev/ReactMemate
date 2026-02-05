import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { CardChecklist, Eye, EyeSlash, Filter, Trash } from 'react-bootstrap-icons';
import clsx from 'clsx';
import { Checkbox } from 'primereact/checkbox';
import { Chip } from 'primereact/chip';
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import style from './enquiry-filters.module.scss';

const EnquiryFilterDropdown = ({ setFilters, filter, isShowDeleted, setIsShowDeleted }) => {
    const [showFilter, setShowFilter] = useState(false);
    const [key, setKey] = useState('status');
    const [selectedStatus, setSelectedStatus] = useState([]);

    const status = [
        { label: 'New', value: 0, className: 'NEW' },
        { label: 'Assigned', value: 1, className: 'ASSIGNED' },
        { label: 'Moved to Sale', value: 2, className: 'MOVED_TO_SALE' },
        { label: 'No Go', value: 3, className: 'NO_GO' },
        { label: 'Spam', value: 4, className: 'SPAM' },
    ];

    const statusCancel = () => {
        setShowFilter(false);
        setFilters((prev) => {
            // eslint-disable-next-line no-unused-vars
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

    const handleToggleShowDeleted = () => {
        setIsShowDeleted(prev => !prev);
        setShowFilter(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.closest('.enquiry-filters') || event.target.closest('.enquiry-filters *')) return;
            setShowFilter(false);
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!filter['status']) {
            setSelectedStatus([]);
        } else if (filter['status']?.length) {
            setSelectedStatus(filter['status'].map(item => item.value));
        }
    }, [filter]);

    return (
        <div className='enquiry-filters'>
            <button className={clsx(style.filterBox, { [style.filterBoxActive]: isShowDeleted })} onClick={() => setShowFilter(!showFilter)}>
                <Filter />
            </button>
            {showFilter && (
                <Tabs
                    id="enquiry-filter-tabs"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="filtterBoxWrapper"
                    style={{ marginLeft: '22px', marginTop: '-7px' }}
                >
                    <Tab
                        eventKey="status"
                        title={
                            <>
                                <CardChecklist color="#667085" size={16} />Status
                            </>
                        }
                    >
                        <div className='enquiry-status' style={{ overflow: 'auto', marginLeft: '0px', padding: '6px 10px' }}>
                            {status.map((item) => (
                                <div className='d-flex align-items-center gap-3 p-2 mb-2' key={item.value}>
                                    <Checkbox 
                                        checked={selectedStatus.includes(item.value)} 
                                        onChange={(e) => {
                                            setSelectedStatus(prev => {
                                                if (e.checked) return [...prev, item.value];
                                                return prev.filter(i => i !== item.value);
                                            });
                                        }} 
                                    />
                                    <Chip className={clsx('status', style[item.className], 'font-14')} label={item.label} />
                                </div>
                            ))}
                        </div>
                        <div className='d-flex justify-content-end gap-2 p-3 border-top'>
                            <Button className='outline-button' style={{ width: '115px', padding: '8px 14px' }} onClick={statusCancel}>Cancel</Button>
                            <Button className='solid-button' style={{ width: '115px', padding: '8px 14px' }} onClick={statusApply}>Apply</Button>
                        </div>
                    </Tab>
                    <Tab
                        eventKey="deleted"
                        title={
                            <>
                                <Trash color="#667085" size={16} />Deleted
                            </>
                        }
                    >
                        <div className='enquiry-deleted' style={{ padding: '8px' }}>
                            <div 
                                className={clsx('d-flex align-items-center gap-1 p-2', style.deletedOption)}
                                onClick={handleToggleShowDeleted}
                                style={{ cursor: 'pointer' }}
                            >
                                {isShowDeleted ? (
                                    <>
                                        <EyeSlash color="#D92D20" size={20} />
                                        <span style={{ color: '#344054', fontSize: '14px' }}>Hide Deleted Enquiries</span>
                                    </>
                                ) : (
                                    <>
                                        <Eye color="#667085" size={20} />
                                        <span style={{ color: '#344054', fontSize: '14px' }}>Show Deleted Enquiries</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            )}
        </div>
    );
};

export default EnquiryFilterDropdown;
