import React, { useState, useRef, useEffect } from 'react';
import DateRangePicker from '../../../../Work/Pages/tasks/DateRangePicker';
import OrdersIcon from "../../../../../assets/images/icon/OrdersIcon.svg";
// import { fetchTasksNew } from '../../../../APIs/TasksApi';
import { Button } from 'react-bootstrap';

const formatDateRange = (startDate, endDate) => {
    const options = { month: 'short', day: 'numeric' };
    const start = new Date(startDate).toLocaleDateString('en-US', options);
    const end = new Date(endDate).toLocaleDateString('en-US', options);
    return `${start} - ${end}`;
};

const DateRangeComponent = ({ startDate, endDate }) => (
    <div className='dateSelectdTaskBar'>
        {formatDateRange(startDate, endDate)}
    </div>
);

const ScheduleUpdate = ({ setDateRange, dateRange }) => {
    console.log('dateRange: ', dateRange);
    const [isPickerVisible, setIsPickerVisible] = useState(false);
    const selectDateRef = useRef(null);

    const togglePicker = () => setIsPickerVisible(prev => !prev);

    const handleDataApply = (data) => {
        setDateRange(data);
        setIsPickerVisible(false);
    };

    const handleClickOutside = (event) => {
        if (selectDateRef.current && !selectDateRef.current.contains(event.target)) {
            setIsPickerVisible(false);
        }
    };

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
                    <DateRangeComponent startDate={dateRange.startDate} endDate={dateRange.endDate} />
                ) : (
                    <span className={`  ${isPickerVisible ? 'active' : ''}`}>
                       Schedule Project  <img src={OrdersIcon} alt="OrdersIcon" /> 
                    </span>
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
