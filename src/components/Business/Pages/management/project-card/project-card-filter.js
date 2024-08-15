import React, { useState } from 'react';
import { Filter, FileText, FileEarmarkText, Bezier2, CardChecklist, Envelope, PhoneVibrate, ListCheck, Check2Circle, FolderSymlink } from 'react-bootstrap-icons';

const OPTIONS = [
  { icon: <FileText size={16} color='#1AB2FF' />, label: 'Invoice', value: 'invoice' },
  { icon: <FileEarmarkText size={16} color='#1AB2FF' />, label: 'Quote', value: 'quote' },
  { icon: <Bezier2 size={16} color='#1AB2FF' />, label: 'System', value: '' },
  { icon: <CardChecklist size={16} color='#1AB2FF' />, label: 'Notes', value: 'note' },
  { icon: <Envelope size={16} color='#1AB2FF' />, label: 'Email', value: ''},
  { icon: <PhoneVibrate size={16} color='#1AB2FF' />, label: 'SMS', value: '' },
  { icon: <ListCheck size={16} color='#1AB2FF' />, label: 'Tasks', value: ''},
  { icon: <Check2Circle size={16} color='#1AB2FF' />, label: 'Job Created', value: ''},
  { icon: <FolderSymlink size={16} color='#1AB2FF' />, label: 'Expense Linked', value: ''}
];

const ProjectCardFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [tempSelectedOptions, setTempSelectedOptions] = useState([]);
  console.log('tempSelectedOptions: ', tempSelectedOptions);

  const toggleDropdown = () => setIsOpen(prev => !prev);

  const handleCheckboxChange = (label) => {
    setTempSelectedOptions(prev =>
      prev.includes(label)
        ? prev.filter(opt => opt !== label)
        : [...prev, label]
    );
  };

  const handleApply = () => {
    setSelectedOptions(tempSelectedOptions);
    setIsOpen(false);
  };

  const handleSelectAll = () => setTempSelectedOptions(OPTIONS.map(option => option.label));

  const handleClearSelection = () => setTempSelectedOptions([]);

  return (
    <div className='projectCardFilterDropdown'>
      <span onClick={toggleDropdown}>
        <Filter size={20} color='#344054' />
      </span>

      {isOpen && (
        <div className="dropdown-menuF">
          <button className='all' onClick={handleSelectAll}>All</button>
          <ul>
            {OPTIONS.map(({ icon, label }) => (
              <li
                key={label}
                className={tempSelectedOptions.includes(label) ? 'active' : ''}
                onClick={() => handleCheckboxChange(label)}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={tempSelectedOptions.includes(label)}
                    readOnly
                  />
                  {icon} {label}
                </label>
              </li>
            ))}
          </ul>
          <div className="dropdown-buttonsF">
            <button className='cancel' onClick={handleClearSelection}>Cancel</button>
            <button className='apply' onClick={handleApply}>Apply</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProjectCardFilter;
