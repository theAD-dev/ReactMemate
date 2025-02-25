import React, { useState } from 'react';
import { Filter, FileText, FileEarmarkText, Bezier2, CardChecklist, Envelope, PhoneVibrate, ListCheck, Check2Circle, FolderSymlink } from 'react-bootstrap-icons';

const OPTIONS = [
  { icon: <FileText size={16} color='#1AB2FF' />, label: 'Invoice', value: 'invoice' },
  { icon: <FileEarmarkText size={16} color='#1AB2FF' />, label: 'Quote', value: 'quote' },
  { icon: <Bezier2 size={16} color='#1AB2FF' />, label: 'System', value: 'system' },
  { icon: <CardChecklist size={16} color='#1AB2FF' />, label: 'Notes', value: 'note' },
  { icon: <Envelope size={16} color='#1AB2FF' />, label: 'Email', value: 'email' },
  { icon: <PhoneVibrate size={16} color='#1AB2FF' />, label: 'SMS', value: 'sms' },
  { icon: <ListCheck size={16} color='#1AB2FF' />, label: 'Tasks', value: 'task' },
  { icon: <Check2Circle size={16} color='#1AB2FF' />, label: 'Job Created', value: 'job' },
  { icon: <FolderSymlink size={16} color='#1AB2FF' />, label: 'Expense Linked', value: 'order' }
];

const ProjectCardFilter = ({ setFilteredHistoryOptions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelectedOptions, setTempSelectedOptions] = useState([]);
  console.log('tempSelectedOptions: ', tempSelectedOptions);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleCheckboxChange = (value) => {
    setTempSelectedOptions(prev =>
      prev.includes(value)
        ? prev.filter(opt => opt !== value)
        : [...prev, value]
    );
  };

  const handleApply = () => {
    setFilteredHistoryOptions(tempSelectedOptions);
    setIsOpen(false);
  };

  const handleSelectAll = () => {
    if (tempSelectedOptions?.length > 0) setTempSelectedOptions([]);
    else setTempSelectedOptions(OPTIONS.map(option => option.value));
  };

  const handleClearSelection = () => setTempSelectedOptions([]);

  return (
    <div className='projectCardFilterDropdown'>
      <span onClick={toggleDropdown}>
        <Filter size={20} color='#344054' />
      </span>

      {isOpen && (
        <div className="dropdown-menuF px-0">
          <button className='all p-0 ps-2 pe-2 mx-2 text-left d-flex justify-content-between align-items-center rounded' style={{ background: '#F9FAFB', width: '94%' }} onClick={handleSelectAll}>
            <span className='border-0' style={{ background: 'transparent' }}>All</span>
            {
              OPTIONS.length === tempSelectedOptions?.length && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="#1AB2FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          </button>
          <ul className='ps-3'>
            {OPTIONS.map(({ icon, label, value }) => (
              <li
                key={label}
                className={tempSelectedOptions.includes(label) ? 'active' : ''}
                onClick={() => handleCheckboxChange(value)}
              >
                <label htmlFor={label} className='w-100 d-flex justify-content-between align-items-center'>
                  <input
                    id={label}
                    type="checkbox"
                    checked={tempSelectedOptions.includes(value)}
                    readOnly
                    style={{ cursor: 'pointer', height: '40px' }}
                  />
                  <span className='border-0'>{icon} {label}</span>
                  {
                    tempSelectedOptions.includes(value) && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="#1AB2FF" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                </label>
              </li>
            ))}
          </ul>
          <hr/>
          <div className="dropdown-buttonsF pb-2 px-3">
            <button className='cancel' onClick={handleClearSelection}>Cancel</button>
            <button className='apply' onClick={handleApply}>Apply</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectCardFilter;
