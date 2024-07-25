// src/CustomSelect.js
import React, { useState, useEffect, useRef } from 'react';
import CustomOption from '../tasks/CustomOption';
import { fetchTasksUsers } from "../../../../APIs/TasksApi";
import { Person } from 'react-bootstrap-icons';

const CustomSelect = ({ onSelect, assigneduser }) => {
  const modalRef = useRef(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const users = await fetchTasksUsers();
      const formattedUsers = users.map(user => ({
        value: user.id,
        text: user.name,
        image: user.photo // Adjust according to the actual user data structure
      }));
      setOptions(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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

  const handelselect = () => {
    setIsOpen(!isOpen);
  }

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(()=> {
    if(assigneduser) {
      setSelectedOption({
        value: assigneduser.id,
        text: assigneduser.full_name,
        image: assigneduser.photo
      })
    }
  }, [assigneduser]);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [isOpen])

  return (
    <div className="custom-select-container">
      {isOpen && (
        <div className="custom-select-options" ref={modalRef}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="custom-select-search"
            style={{ width: '96%' }}
          />
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="custom-select-option"
              onClick={() => handleOptionClick(option)}
            >
              {
                <CustomOption
                  image={option.image}
                  text={option.text}
                  isSelected={option.value === selectedOption?.value}
                />
              }
            </div>
          ))}
        </div>
      )}
      {selectedOption ? (
        <div className="custom-select-selected" onClick={() => setIsOpen(!isOpen)}>
          <CustomOption image={selectedOption.image} text={selectedOption.text} isSelected={true} />
        </div>
      ) : (
        <span className={`iconStyleCircle iconStyleCircleRight ${isOpen ? 'isOpen' : ''}`}>
          <Person color="#475467" size={18} onClick={handelselect} />
        </span>
      )
      }
    </div>
  );
};

export default CustomSelect;
