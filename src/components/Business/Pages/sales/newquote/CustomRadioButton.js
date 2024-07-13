import React from 'react';
import './customradiobutton.css';

const CustomRadioButton = ({ label, name, value, checked, onChange }) => {
  return (
    <label className="custom-radio-button">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span className="custom-radio-button__checkmark"></span>
      {label}
    </label>
  );
};

export default CustomRadioButton;
