import React, { useState } from 'react';
import MemateSelect from './memate-select';

const MemateSelectComponent = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [hasError, setHasError] = useState(false); // Example for error state

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        setHasError(false); // Update this based on your validation logic
    };

    return (
        <MemateSelect
            options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
            ]}
            onChange={handleChange}
            value={selectedOption}
            hasError={hasError}
        />
    );
};

export default MemateSelectComponent;
