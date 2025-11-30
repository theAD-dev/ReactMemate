import React, { useState, useRef, useEffect } from "react";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";

// Helper function to get Sydney timezone date
const getSydneyDate = () => {
  const sydneyFormatter = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = sydneyFormatter.formatToParts(new Date());
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  return new Date(`${year}-${month}-${day}T00:00:00`);
};

const DateRangePicker = ({ onDataApply, dateRange, onClose }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const calendarRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [formattedCurrentDate, setFormattedCurrentDate] = useState("");

  useEffect(() => {
    if (dateRange) {
      setSelectedDates([dateRange?.startDate, dateRange?.endDate]);
      setStartDate(dateRange?.startDate);
      setEndDate(dateRange?.endDate);
    }
  }, [dateRange]);

  useEffect(() => {
    const sydneyFormatter = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = sydneyFormatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    setFormattedCurrentDate(`${year}-${month}-${day}`);
  }, []);

  const handleChange = (selectedDates) => {
    setSelectedDates(selectedDates);
  };

  useEffect(() => {
    if (selectedDates.length === 2) {
      const startDate = selectedDates[0];
      const endDate = selectedDates[1];
      setStartDate(startDate);
      setEndDate(endDate);
    } else if (selectedDates.length === 1) {
      const startDate = selectedDates[0];
      setStartDate(startDate);
    }
  }, [selectedDates]);

  const handleApply = () => {
    setIsApplying(true);
    onDataApply({ startDate, endDate });
    const taggingElement = document.querySelector(".tags-input-container .rangedatepicker .mainWrapperTags");
    if (taggingElement) {
      taggingElement.textContent = `${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`;
    }
  };

  const handleCancel = () => {
    setSelectedDates([]);
    setStartDate(null);
    setEndDate(null);
    setIsApplying(false);
    if (onClose) onClose();

    const existingCustomDiv = document.querySelector(".custom-div p");
    if (existingCustomDiv) {
      existingCustomDiv.textContent = `${formattedCurrentDate}`;
    }
  };

  const flatpickrOptions = {
    dateFormat: "Y-m-d",
    mode: "range",
    locale: {
      firstDayOfWeek: 1
    },
    inline: true,
  };

  useEffect(() => {
    if (isApplying) {
      // Custom logic when applying
    }
  }, [isApplying]);

  const handleTodayClick = () => {
    const sydneyDate = getSydneyDate();
    setSelectedDates([sydneyDate, sydneyDate]);
  };

  useEffect(() => {
    if (!startDate && !endDate) {
      const sydneyDate = getSydneyDate();
      setStartDate(sydneyDate);
      setEndDate(sydneyDate);
    } else if (startDate && endDate) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const start = new Date(startDate);
      const formattedStartDate = start.toLocaleDateString('en-US', options);
      const end = new Date(endDate);
      const formattedEndDate = end.toLocaleDateString('en-US', options);

      const textContent = `${formattedStartDate} - ${formattedEndDate}`;
      const newContent = `<p>${textContent}</p><span class="today-span" style="cursor: pointer">Today</span>`;
      const monthsElement = document.querySelector(".flatpickr-months");
      if (monthsElement) {
        const existingCustomDiv = document.querySelector(".custom-div");
        if (existingCustomDiv) {
          existingCustomDiv.innerHTML = newContent;
        } else {
          const customDiv = document.createElement('div');
          customDiv.className = "custom-div";
          customDiv.innerHTML = newContent;
          monthsElement.parentNode.insertBefore(customDiv, monthsElement.nextSibling);
        }
      }
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const todaySpan = document.querySelector(".today-span");
    if (todaySpan) {
      todaySpan.addEventListener("click", handleTodayClick);
    }

    return () => {
      if (todaySpan) {
        todaySpan.removeEventListener("click", handleTodayClick);
      }
    };
  }, [startDate, endDate]);

  return (
    <div>
      <Flatpickr
        options={flatpickrOptions}
        value={selectedDates}
        onChange={handleChange}
        ref={calendarRef}
      />
      <div className="calenderBut">
        <button className="tabCancel" onClick={handleCancel}>Cancel</button>
        <button className="tabApply" onClick={handleApply}>Apply</button>
      </div>
    </div>
  );
};

export default DateRangePicker;
