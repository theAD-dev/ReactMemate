import React from 'react';
import './customradiobutton.css';

const CustomRadioButton = ({ label, name, value, checked, onChange, disabled }) => {
  return (
    <label className={`custom-radio-button ${disabled ? 'disabled' : ''}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="custom-radio-button__checkmark"></span>
      {label}
    </label>
  );
};

export default CustomRadioButton;
