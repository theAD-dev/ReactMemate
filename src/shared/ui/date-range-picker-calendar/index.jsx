import React, { useCallback, useState, useEffect } from 'react';
import clsx from 'clsx';
import { Calendar } from 'primereact/calendar';
import { ChevronLeftIcon } from 'primereact/icons/chevronleft';
import { ChevronRightIcon } from 'primereact/icons/chevronright';
import './date-range-picker-calendar.scss';

/**
 * DateRangePickerCalendar - A Calendar component for selecting date ranges
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onDataApply - Callback when date range is applied ({ startDate, endDate })
 * @param {Object} props.dateRange - Initial date range { startDate, endDate }
 * @param {Function} props.onClose - Callback when picker is closed/cancelled
 * @param {string} props.className - Additional CSS classes
 */
export const DateRangePickerCalendar = ({
    onDataApply,
    dateRange,
    onClose,
    className = '',
}) => {
    const [dates, setDates] = useState(null);

    // Initialize with provided dateRange
    useEffect(() => {
        if (dateRange?.startDate && dateRange?.endDate) {
            const start = dateRange.startDate instanceof Date ? dateRange.startDate : new Date(dateRange.startDate);
            const end = dateRange.endDate instanceof Date ? dateRange.endDate : new Date(dateRange.endDate);
            setDates([start, end]);
        }
    }, [dateRange]);

    // Handle Apply
    const handleApply = useCallback(() => {
        if (dates && dates.length === 2 && dates[0] && dates[1]) {
            onDataApply({ startDate: dates[0], endDate: dates[1] });
        } else if (dates && dates.length === 1 && dates[0]) {
            // If only one date selected, use it as both start and end
            onDataApply({ startDate: dates[0], endDate: dates[0] });
        }
    }, [dates, onDataApply]);

    // Handle Cancel
    const handleCancel = useCallback(() => {
        setDates(null);
        if (onClose) onClose();
    }, [onClose]);

    // Handle Today
    const handleToday = useCallback(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        setDates([today, today]);
    }, []);

    // Custom footer template
    const footerTemplate = useCallback(() => {
        const hasValidRange = dates && dates.length >= 1 && dates[0];
        
        return (
            <div className="date-range-footer">
                <button 
                    type="button" 
                    className="date-range-footer-btn date-range-footer-btn-today" 
                    onClick={handleToday}
                >
                    Today
                </button>
                <button 
                    type="button" 
                    className="date-range-footer-btn date-range-footer-btn-cancel" 
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button 
                    type="button" 
                    className="date-range-footer-btn date-range-footer-btn-apply" 
                    onClick={handleApply}
                    disabled={!hasValidRange}
                >
                    Apply
                </button>
            </div>
        );
    }, [dates, handleToday, handleCancel, handleApply]);

    // Format selected range for display
    const getHeaderText = useCallback(() => {
        if (!dates || dates.length === 0) return 'Select date range';
        
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const start = dates[0]?.toLocaleDateString('en-US', options) || '';
        const end = dates[1]?.toLocaleDateString('en-US', options) || '';
        
        if (start && end) {
            return `${start} - ${end}`;
        } else if (start) {
            return `${start} - Select end date`;
        }
        return 'Select date range';
    }, [dates]);

    return (
        <div className={clsx('date-range-picker-calendar', className)}>
            <div className="date-range-header">
                <span className="date-range-header-text">{getHeaderText()}</span>
            </div>
            <Calendar
                value={dates}
                onChange={(e) => setDates(e.value)}
                selectionMode="range"
                inline
                numberOfMonths={1}
                locale="en"
                dateFormat="dd M yy"
                footerTemplate={footerTemplate}
                firstDayOfWeek={1}
                showButtonBar={false}
                prevIcon={<ChevronLeftIcon />}
                nextIcon={<ChevronRightIcon />}
            />
        </div>
    );
};

export default DateRangePickerCalendar;
