// src/CustomSelect.js
import React, { useState, useEffect } from 'react';
import CustomOption from '../tasks/CustomOption';
import { fetchTasksUsers } from "../../../../APIs/TasksApi";

const CustomSelect = ({ onSelect }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await fetchTasksUsers();
        const formattedUsers = users.map(user => ({
          value: user.id,
          text: user.name,
          image: user.photo // Adjust according to the actual user data structure
        }));
        setOptions(formattedUsers);
        setSelectedOption(formattedUsers[0]); // Default to the first user if exists
        onSelect(formattedUsers[0].value); // Pass the initial selected value to the parent component
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option.value); // Pass the selected value to the parent component
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOptions = options.filter(option =>
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="custom-select-container">
      {isOpen && (
        <div className="custom-select-options">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="custom-select-search"
          />
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="custom-select-option"
              onClick={() => handleOptionClick(option)}
            >
              <CustomOption
                image={option.image}
                text={option.text}
                isSelected={option.value === selectedOption?.value}
              />
            </div>
          ))}
        </div>
      )}
      {selectedOption && (
        <div className="custom-select-selected" onClick={() => setIsOpen(!isOpen)}>
          <CustomOption image={selectedOption.image} text={selectedOption.text} isSelected={true} />
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
