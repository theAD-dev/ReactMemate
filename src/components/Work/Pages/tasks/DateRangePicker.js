import React, { useState, useRef, useEffect } from "react";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";

const DateRangePicker = ({ onDataApply }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const calendarRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [formattedCurrentDate, setFormattedCurrentDate] = useState("");

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
    }
  }, [selectedDates]);

  const updateCustomDiv = () => {
    const monthElement = document.querySelector(".flatpickr-months");
    const existingCustomDiv = document.querySelector(".custom-div p");
    if (startDate && endDate) {
      if (existingCustomDiv) {
        existingCustomDiv.textContent = `${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`;
      } else {
        if (monthElement) {
          const customDiv = document.createElement('div');
          customDiv.className = "custom-div";
          customDiv.innerHTML = `<p>${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}</p>`;
          monthElement.parentNode.insertBefore(customDiv, monthElement.nextSibling);
        }
      }
    }
  };

  const handleApply = () => {
    updateCustomDiv();
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
    inline: true,
    onDayCreate: function(dObj, dStr, fp, dayElem){
      if (Math.random() < 0.15)
          dayElem.innerHTML += "<span class='event'></span>";
      else if (Math.random() > 0.85)
          dayElem.innerHTML += "<span class='event busy'></span>";
    }
  };

  useEffect(() => {
    if (isApplying) {
      // Custom logic when applying
    }
  }, [isApplying]);

  useEffect(() => {
    if (!startDate && !endDate) {
      const currentDate = new Date();
      setStartDate(currentDate);
      setEndDate(currentDate);
    } else if (startDate && endDate) {
      const currentDate = new Date();
      const formattedCurrentDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      const textContent = `${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`;
      const newContent = `<p>${textContent}</p><span>${formattedCurrentDate}</span>`;
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
