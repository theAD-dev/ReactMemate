// DatePickerComponent.jsx
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Calendar = ({ selectedDate, handleDateChange }) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat="dd/MM/yyyy"
    />
  );
};

export default Calendar
