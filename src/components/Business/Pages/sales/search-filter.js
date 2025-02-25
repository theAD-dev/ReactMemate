import React from 'react';
import { Search } from 'react-bootstrap-icons';

const SearchFilter = ({ setInputValue, inputValue }) => {
  return (
    <div>
      <span className='mr-3'>
        <Search color='#98A2B3' size={20} />
      </span>
      <input
        type="text"
        placeholder="Search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};

export default SearchFilter;
