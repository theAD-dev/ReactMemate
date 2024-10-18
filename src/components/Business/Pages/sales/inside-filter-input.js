import React, { useState } from 'react';
import { Search } from 'react-bootstrap-icons';

const InsideFilterInput = ({ ItemNameFilter,onRowsFilterChange1 }) => {
  const [query, setQuery] = useState('');
  const [key, setKey] = useState(null);


// Search Filter
const filterRows = (searchQuery) => {
  setQuery(searchQuery);
  const filteredRows = ItemNameFilter.filter((item) =>
    item.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  onRowsFilterChange1(filteredRows);
  if (searchQuery === '') {
    setKey(null);
  }
};

const handleInputChange = (event) => {
  setQuery(event.target.value);
  if (event.target.value === '') {
    setKey(null);
  }
};

  return (
    <div key={key}>
      <span className='mr-3' onClick={() => filterRows(query)}>
        <Search color='#98A2B3' size={20} />
      </span>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
        onKeyUp={() => filterRows(query)}
        key={key}
      />
    </div>
  );
};

export default InsideFilterInput
