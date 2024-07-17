import React, { useState } from 'react';
import Select, { components } from "react-select";
import './select-component.css'; // Custom CSS for styling

const options = [
    {
        value: 'option1',
        label: 'Option 1',
        subOptions: [
            { value: 'sub1-1', label: 'Sub Option 1-1' },
            { value: 'sub1-2', label: 'Sub Option 1-2' },
        ],
    },
    {
        value: 'option2',
        label: 'Option 2',
        subOptions: [
            { value: 'sub2-1', label: 'Sub Option 2-1' },
            { value: 'sub2-2', label: 'Sub Option 2-2' },
        ],
    },
];

const CustomOption = (props) => {
    const [showSubOptions, setShowSubOptions] = useState(false);

    return (
        <div
            className="option-container"
            onMouseEnter={() => setShowSubOptions(true)}
            onMouseLeave={() => setShowSubOptions(false)}
        >
            <components.Option {...props} />
            {/* {showSubOptions && props.data.subOptions && ( */}
                <div className="sub-options-container">
                    <h1>Sourav</h1>
                    {props.data.subOptions.map((subOption) => (
                        <div key={subOption.value}>{subOption.label}</div>
                    ))}
                </div>
            {/* )} */}
        </div>
    );
};

const SelectComponent = () => {
    return (
        <Select
            options={options}
            components={{ Option: CustomOption }}
            placeholder="Select an option"
            className="main-select"
        />
    );
};

export default SelectComponent;
