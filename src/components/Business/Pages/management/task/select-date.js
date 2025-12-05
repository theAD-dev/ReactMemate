import React, { useState, useRef, useEffect } from 'react';
import { Calendar2Event } from "react-bootstrap-icons";
import DateRangePicker from '../../../../Work/Pages/tasks/old-development/DateRangePicker';

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

const SelectDate = ({ setDateRange, dateRange }) => {
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
                    <div style={{ border: '1px dashed #98A2B3', width: '24px', height: '24px', borderRadius: '50%'}} className={`iconStyleCircle d-flex justify-content-center align-items-center iconStyleCircleRight ${isPickerVisible ? 'active' : ''}`}>
                        <Calendar2Event color={isPickerVisible ? "#1AB2FF" : "#475467"} size={14} />
                    </div>
                )}
            </div>
            {isPickerVisible && (
                <div className='select-date-range' style={{ position: 'absolute', top: '-100px', background: '#fff', zIndex: 1000 }}>
                    <DateRangePicker onDataApply={handleDataApply} dateRange={dateRange} onClose={() => setIsPickerVisible(false)} />
                </div>
            )}
        </div>
    );
};

export default SelectDate;
