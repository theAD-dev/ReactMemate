import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Calendar3 } from 'react-bootstrap-icons';
import clsx from 'clsx';
import { Calendar } from 'primereact/calendar';
import './time-picker-calendar.scss';

// Generate hour and minute options
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
const DEFAULT_MINUTES = ['00', '15', '30', '45'];

/**
 * TimePickerCalendar - A Calendar component with enhanced time picker popups
 * 
 * @param {Object} props - Component props
 * @param {Date} props.value - The selected date value
 * @param {Function} props.onChange - Callback when date changes
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.dateFormat - Date format string (default: "dd M yy")
 * @param {string} props.hourFormat - Hour format "12" or "24" (default: "24")
 * @param {Array} props.minuteOptions - Custom minute options (default: ['00', '15', '30', '45'])
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @param {React.ReactNode} props.icon - Custom icon component
 * @param {Function} props.onClearError - Callback to clear error state
 * @param {string} props.popupId - Unique identifier for popups (useful when multiple instances)
 * @param {Function} props.onDone - Callback when Done button is clicked (for inline mode)
 */
export const TimePickerCalendar = ({
    value,
    onChange,
    placeholder = '17 Jun 2021',
    dateFormat = 'dd M yy',
    hourFormat = '24',
    minuteOptions = DEFAULT_MINUTES,
    className = '',
    style = {},
    icon = <Calendar3 color='#667085' size={20} />,
    onClearError,
    popupId = 'default',
    onDone,
    ...restProps
}) => {
    const [showHourPopup, setShowHourPopup] = useState({ show: false, top: 0, left: 0 });
    const [showMinutePopup, setShowMinutePopup] = useState({ show: false, top: 0, left: 0 });
    const calendarRef = useRef(null);
    const hourPickerRef = useRef(null);
    const minutePickerRef = useRef(null);
    const popupContainerRef = useRef(null);
    
    // Check if inline mode
    const isInline = restProps.inline === true;

    // Hide the calendar popup (or call onDone for inline mode)
    const hideCalendar = useCallback(() => {
        if (isInline && onDone) {
            onDone();
        } else if (calendarRef.current) {
            calendarRef.current.hide();
        }
    }, [isInline, onDone]);

    // Handle Now button click
    const handleNowClick = useCallback(() => {
        const now = new Date();
        onChange({ value: now });
        onClearError?.();
    }, [onChange, onClearError]);

    // Handle Clear button click
    const handleClearClick = useCallback(() => {
        onChange({ value: null });
    }, [onChange]);

    // Custom footer template
    const footerTemplate = useCallback(() => {
        return (
            <div className="time-picker-footer">
                <div className="time-picker-footer-left">
                    <button type="button" className="time-picker-footer-link" onClick={handleNowClick}>
                        Now
                    </button>
                    <span className="time-picker-footer-divider">|</span>
                    <button type="button" className="time-picker-footer-link" onClick={handleClearClick}>
                        Clear
                    </button>
                </div>
                <button type="button" className="time-picker-footer-done" onClick={hideCalendar}>
                    Done
                </button>
            </div>
        );
    }, [handleNowClick, handleClearClick, hideCalendar]);

    // Helper to safely get Date object
    const getDateValue = useCallback(() => {
        if (value instanceof Date) return new Date(value);
        if (value) return new Date(value);
        return new Date();
    }, [value]);

    // Handle hour selection
    const handleHourSelect = useCallback((hour) => {
        const newDate = getDateValue();
        newDate.setHours(parseInt(hour));
        if (!value) {
            newDate.setMinutes(0, 0, 0);
        }
        onChange({ value: newDate });
        setShowHourPopup({ show: false, top: 0, left: 0 });
        onClearError?.();
    }, [value, onChange, onClearError, getDateValue]);

    // Handle minute selection
    const handleMinuteSelect = useCallback((minute) => {
        const newDate = getDateValue();
        newDate.setMinutes(parseInt(minute));
        if (!value) {
            newDate.setSeconds(0, 0);
        }
        onChange({ value: newDate });
        setShowMinutePopup({ show: false, top: 0, left: 0 });
        onClearError?.();
    }, [value, onChange, onClearError, getDateValue]);

    // Handle hour span click
    const handleHourSpanClick = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();

        const hourPicker = document.querySelector(`.time-picker-${popupId} .p-hour-picker`);
        if (!hourPicker) return;

        const rect = hourPicker.getBoundingClientRect();
        const datepickerPanel = document.querySelector(`.time-picker-${popupId}`);

        if (datepickerPanel) {
            const panelRect = datepickerPanel.getBoundingClientRect();
            setShowHourPopup({
                show: true,
                top: rect.bottom - panelRect.top - 40,
                left: rect.left - panelRect.left - 45
            });
            setShowMinutePopup({ show: false, top: 0, left: 0 });
        }
    }, [popupId]);

    // Handle minute span click
    const handleMinuteSpanClick = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();

        const minutePicker = document.querySelector(`.time-picker-${popupId} .p-minute-picker`);
        if (!minutePicker) return;

        const rect = minutePicker.getBoundingClientRect();
        const datepickerPanel = document.querySelector(`.time-picker-${popupId}`);

        if (datepickerPanel) {
            const panelRect = datepickerPanel.getBoundingClientRect();
            setShowMinutePopup({
                show: true,
                top: rect.bottom - panelRect.top - 40,
                left: rect.right - panelRect.left - 14
            });
            setShowHourPopup({ show: false, top: 0, left: 0 });
        }
    }, [popupId]);

    // Effect to handle popup visibility and positioning
    useEffect(() => {
        const datepickerPanel = document.querySelector(`.time-picker-${popupId}`);
        if (!datepickerPanel) return;

        // Get or create popup container
        let container = datepickerPanel.querySelector('.time-popup-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'time-popup-container';
            datepickerPanel.appendChild(container);
            popupContainerRef.current = container;
        }

        // Handle clicks outside popups
        const handleOutsideClick = (e) => {
            const hourPopup = datepickerPanel.querySelector('.time-popup-hour');
            const minutePopup = datepickerPanel.querySelector('.time-popup-minute');

            const isHourSpan = e.target.closest('[data-pc-section="hour"]');
            const isMinuteSpan = e.target.closest('[data-pc-section="minute"]');
            const isInsideHourPopup = hourPopup && hourPopup.contains(e.target);
            const isInsideMinutePopup = minutePopup && minutePopup.contains(e.target);
            const isCalendarControl = e.target.closest('.p-hour-picker button') ||
                e.target.closest('.p-minute-picker button') ||
                e.target.closest('.p-datepicker-buttonbar') ||
                e.target.closest('.p-datepicker-header');

            if (!isInsideHourPopup && !isInsideMinutePopup && !isHourSpan && !isMinuteSpan && !isCalendarControl) {
                setShowHourPopup({ show: false, top: 0, left: 0 });
                setShowMinutePopup({ show: false, top: 0, left: 0 });
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [popupId, showHourPopup.show, showMinutePopup.show]);

    // Render hour popup
    useEffect(() => {
        const datepickerPanel = document.querySelector(`.time-picker-${popupId}`);
        if (!datepickerPanel) return;

        let hourPopup = datepickerPanel.querySelector('.time-popup-hour');

        if (showHourPopup.show) {
            if (!hourPopup) {
                hourPopup = document.createElement('div');
                hourPopup.className = 'time-popup time-popup-hour';
                datepickerPanel.appendChild(hourPopup);
            }

            const currentHour = (value instanceof Date) ? value.getHours().toString().padStart(2, '0') : '';

            hourPopup.innerHTML = `
                <div class="time-popup-header">Hour</div>
                <div class="time-popup-items">
                    ${HOURS.map(hour => `
                        <div 
                            data-hour="${hour}"
                            class="time-popup-item ${currentHour === hour ? 'time-popup-item-selected' : ''}"
                        >
                            ${hour}
                        </div>
                    `).join('')}
                </div>
            `;

            hourPopup.style.cssText = `
                position: absolute;
                top: ${showHourPopup.top}px;
                left: ${showHourPopup.left}px;
                z-index: 9999;
            `;

            // Scroll to selected hour
            const selectedItem = hourPopup.querySelector('.time-popup-item-selected');
            if (selectedItem) {
                const itemsContainer = hourPopup.querySelector('.time-popup-items');
                if (itemsContainer) {
                    itemsContainer.scrollTop = selectedItem.offsetTop - itemsContainer.offsetHeight / 2 + selectedItem.offsetHeight / 2;
                }
            }

            // Add click handlers
            hourPopup.querySelectorAll('[data-hour]').forEach(element => {
                element.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleHourSelect(element.getAttribute('data-hour'));
                });
            });
        } else if (hourPopup) {
            hourPopup.remove();
        }
    }, [showHourPopup, value, handleHourSelect, popupId]);

    // Render minute popup
    useEffect(() => {
        const datepickerPanel = document.querySelector(`.time-picker-${popupId}`);
        if (!datepickerPanel) return;

        let minutePopup = datepickerPanel.querySelector('.time-popup-minute');

        if (showMinutePopup.show) {
            if (!minutePopup) {
                minutePopup = document.createElement('div');
                minutePopup.className = 'time-popup time-popup-minute';
                datepickerPanel.appendChild(minutePopup);
            }

            const currentMinute = (value instanceof Date) ? value.getMinutes().toString().padStart(2, '0') : '';

            minutePopup.innerHTML = `
                <div class="time-popup-header">Minute</div>
                <div class="time-popup-items">
                    ${minuteOptions.map(minute => `
                        <div 
                            data-minute="${minute}"
                            class="time-popup-item ${currentMinute === minute ? 'time-popup-item-selected' : ''}"
                        >
                            ${minute}
                        </div>
                    `).join('')}
                </div>
            `;

            minutePopup.style.cssText = `
                position: absolute;
                top: ${showMinutePopup.top}px;
                left: ${showMinutePopup.left}px;
                z-index: 9999;
            `;

            // Add click handlers
            minutePopup.querySelectorAll('[data-minute]').forEach(element => {
                element.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleMinuteSelect(element.getAttribute('data-minute'));
                });
            });
        } else if (minutePopup) {
            minutePopup.remove();
        }
    }, [showMinutePopup, value, minuteOptions, handleMinuteSelect, popupId]);

    const handleShow = useCallback(() => {
        setTimeout(() => {
            const hourPicker = document.querySelector(`.time-picker-${popupId} .p-hour-picker [data-pc-section="hour"]`);
            const minutePicker = document.querySelector(`.time-picker-${popupId} .p-minute-picker [data-pc-section="minute"]`);

            if (hourPicker) {
                hourPickerRef.current = hourPicker;
                hourPicker.style.cursor = 'pointer';
                hourPicker.addEventListener('click', handleHourSpanClick);
            }

            if (minutePicker) {
                minutePickerRef.current = minutePicker;
                minutePicker.style.cursor = 'pointer';
                minutePicker.addEventListener('click', handleMinuteSpanClick);
            }
        }, 100);
    }, [handleHourSpanClick, handleMinuteSpanClick, popupId]);

    const handleHide = useCallback(() => {
        if (hourPickerRef.current) {
            hourPickerRef.current.removeEventListener('click', handleHourSpanClick);
            hourPickerRef.current = null;
        }
        if (minutePickerRef.current) {
            minutePickerRef.current.removeEventListener('click', handleMinuteSpanClick);
            minutePickerRef.current = null;
        }
        setShowHourPopup({ show: false, top: 0, left: 0 });
        setShowMinutePopup({ show: false, top: 0, left: 0 });
    }, [handleHourSpanClick, handleMinuteSpanClick]);

    // For inline mode, we need to trigger handleShow after mount
    useEffect(() => {
        if (isInline) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                handleShow();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isInline, handleShow]);

    const calendarElement = (
        <Calendar
            ref={calendarRef}
            value={value}
            onChange={onChange}
            showButtonBar={false}
            placeholder={placeholder}
            dateFormat={dateFormat}
            locale="en"
            showIcon={!isInline}
            style={isInline ? style : { height: '46px', width: '230px', overflow: 'hidden', ...style }}
            icon={icon}
            className={clsx('time-picker-calendar', isInline && 'time-picker-calendar-inline', className)}
            hourFormat={hourFormat}
            showTime
            panelClassName={`time-picker-${popupId}`}
            onShow={handleShow}
            onHide={handleHide}
            footerTemplate={footerTemplate}
            {...restProps}
        />
    );

    // For inline mode, wrap in a container that has the popupId class for time picker popups
    if (isInline) {
        return (
            <div className={`time-picker-wrapper time-picker-${popupId}`}>
                {calendarElement}
            </div>
        );
    }

    return calendarElement;
};

export default TimePickerCalendar;
