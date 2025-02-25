import React, { useState, useEffect, useRef } from 'react';
import { Spinner } from 'react-bootstrap';
import { Person } from 'react-bootstrap-icons';
import { useQuery } from '@tanstack/react-query';
import { fetchTasksUsers } from '../../../../../APIs/TasksApi';
import './task.css';

const CustomOption = ({ image, text, isSelected }) => (
    <div className="custom-option">
        <div className="custom-optionText">
            <img src={image} alt={text} className="option-image" />
            <span className="option-text">{text}</span>
        </div>
        {isSelected && (
            <span className="checkbox-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M15.9206 4.96209C16.2819 4.59597 16.8677 4.59597 17.229 4.96209C17.5859 5.32371 17.5903 5.90727 17.2422 6.27434L9.85031 15.0122C9.8432 15.0212 9.8356 15.0298 9.82756 15.0379C9.46625 15.404 8.88046 15.404 8.51915 15.0379L4.02098 10.4799C3.65967 10.1137 3.65967 9.52015 4.02098 9.15403C4.38229 8.78791 4.96808 8.78791 5.32939 9.15403L9.14548 13.0209L15.8961 4.99013C15.9037 4.98029 15.9119 4.97093 15.9206 4.96209Z" fill="#158ECC" />
                </svg>
            </span>
        )}
    </div>
);

const SelectUser = ({ onSelect, assignedUser }) => {
    const modalRef = useRef(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: options = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['users'],
        queryFn: fetchTasksUsers,
        select: users => users.map(user => ({
            value: user.id,
            text: user.name,
            image: user.photo,
        })),
        enabled: false, // Don't fetch automatically
    });

    useEffect(() => {
        if (assignedUser) {
            setSelectedOption({
                value: assignedUser.id,
                text: assignedUser.full_name,
                image: assignedUser.photo,
            });
        }
    }, [assignedUser]);

    useEffect(() => {
        if (isOpen) {
            refetch();
            const handleClickOutside = (event) => {
                if (modalRef.current && !modalRef.current.contains(event.target)) {
                    setIsOpen(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, refetch]);

    const filteredOptions = options.filter(option =>
        option.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setIsOpen(false);
        onSelect(option.value); // Pass the selected value to the parent component
    };

    const toggleOpen = () => {
        setIsOpen(prev => !prev);
    };

    return (
        <div className="custom-select-container" style={{ position: 'relative' }}>
            {isOpen && (
                <div className="custom-select-options" style={{ position: 'absolute', bottom: '0px' }} ref={modalRef}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search..."
                        className="custom-select-search"
                        style={{ width: '96%' }}
                    />
                    {isLoading ? (
                        <div className="d-flex justify-content-center my-2">
                            <Spinner animation="border" />
                        </div>
                    ) : isError ? (
                        <div className="text-danger">Error fetching users</div>
                    ) : (
                        filteredOptions.map((option) => (
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
                        ))
                    )}
                </div>
            )}
            <div style={{ position: 'relative' }}>
                {selectedOption ? (
                    <div className="custom-select-selected" onClick={toggleOpen}>
                        <CustomOption image={selectedOption.image} text={selectedOption.text} isSelected={true} />
                    </div>
                ) : (
                    <span className={`iconStyleCircle iconStyleCircleRight ${isOpen ? 'active' : ''}`}>
                        <Person color={isOpen ? "#1AB2FF" : "#475467"} size={18} onClick={toggleOpen} />
                    </span>
                )}
            </div>
        </div>
    );
};

export default SelectUser;
