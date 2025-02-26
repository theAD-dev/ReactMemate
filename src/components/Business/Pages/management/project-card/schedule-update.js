import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import Button from 'react-bootstrap/Button';
import { updateProjectScheduleById } from '../../../../../APIs/management-api';
import OrdersIcon from "../../../../../assets/images/icon/OrdersIcon.svg";
import DateRangePicker from '../../../../Work/Pages/tasks/old-development/DateRangePicker';

const formatDateRange = (startDate, endDate) => {
    const options = { month: 'short', day: 'numeric' };
    const start = new Date(startDate).toLocaleDateString('en-US', options);
    const end = new Date(endDate).toLocaleDateString('en-US', options);
    return `${start} - ${end}`;
};

const DateRangeComponent = ({ startDate, endDate }) => (
         <Button className='dateSelectdTaskBar schedule schActive' style={{ minWidth: '160px', minHeight: '46px' }}>
        {formatDateRange(startDate, endDate)} <img src={OrdersIcon} alt="OrdersIcon" /></Button>
);

const ScheduleUpdate = ({ projectId, startDate, endDate }) => {
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const selectDateRef = useRef(null);
    const togglePicker = () => setIsPickerVisible(prev => !prev);
    const updateMutation = useMutation({
        mutationFn: (data) => updateProjectScheduleById(projectId, data),
        onSuccess: async () => { },
        onError: (error) => {
            setDateRange({ startDate: null, endDate: null });
            console.error('Error creating task:', error);
        }
    });
    const handleDataApply = (data) => {
        updateMutation.mutate({ booking_start: data.startDate, booking_end: data.endDate });
        setDateRange(data);
        setIsPickerVisible(false);
    };
    const handleClickOutside = (event) => {
        if (selectDateRef.current && !selectDateRef.current.contains(event.target)) {
            setIsPickerVisible(false);
        }
    };

    useEffect(() => {
        if (startDate && endDate) setDateRange({ startDate: new Date(1000 * +startDate), endDate: new Date(1000 * +endDate) });
    }, [startDate, endDate]);

    useEffect(() => {
        if (isPickerVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPickerVisible]);

    return (
        <div className='select-date' style={{ position: 'relative' }} ref={selectDateRef}>
            <div onClick={togglePicker} style={{ cursor: 'pointer' }}>
                {dateRange?.startDate && dateRange?.endDate ? (
                    <DateRangeComponent isPending={updateMutation.isPending} startDate={dateRange.startDate} endDate={dateRange.endDate} />
                ) : (
                    <Button className={`schedule schActive  ${isPickerVisible ? 'active' : ''}`}>
                        Schedule Project  <img src={OrdersIcon} alt="OrdersIcon" />
                    </Button>
                )}
            </div>
            {isPickerVisible && (
                <div className='select-date-range' style={{ position: 'absolute', bottom: '40px', background: '#fff', zIndex: 1000 }}>
                    <DateRangePicker onDataApply={handleDataApply} dateRange={dateRange} onClose={() => setIsPickerVisible(false)} />
                </div>
            )}
        </div>
    );
};

export default ScheduleUpdate;