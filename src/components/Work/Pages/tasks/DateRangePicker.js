import React, { useState, useRef, useEffect } from "react";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";

const DateRangePicker = ({ onDataApply, dateRange }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const calendarRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [formattedCurrentDate, setFormattedCurrentDate] = useState("");

  useEffect(()=> {
    if(dateRange) {
      setSelectedDates([dateRange?.startDate, dateRange?.endDate]);
      setStartDate(dateRange?.startDate);
      setEndDate(dateRange?.endDate);
    }
  }, [])

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    setFormattedCurrentDate(formattedDate);
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
    // onDayCreate: function (dObj, dStr, fp, dayElem) {
    //   if (Math.random() < 0.15)
    //     dayElem.innerHTML += "<span class='event'></span>";
    //   else if (Math.random() > 0.85)
    //     dayElem.innerHTML += "<span class='event busy'></span>";
    // }
  };

  useEffect(() => {
    if (isApplying) {
      // Custom logic when applying
    }
  }, [isApplying]);

  const handleTodayClick = () => {
    const currentDate = new Date();
    setSelectedDates([currentDate, currentDate]);
  };

  useEffect(() => {
    if (!startDate && !endDate) {
      const currentDate = new Date();
      setStartDate(currentDate);
      setEndDate(currentDate);
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
