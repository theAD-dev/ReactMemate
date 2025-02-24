import React, { useState } from 'react';
import { Search } from 'react-bootstrap-icons';

const SearchFilter = ({ rows, onRowsFilterChange1 }) => {
  console.log('rows: ', rows);
  const [query, setQuery] = useState('');
  const [key, setKey] = useState(null);

  // Search Filter
  const filterRows = (searchQuery) => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    setQuery(searchQuery);

    if (!trimmedQuery) {
      setKey(null);
      onRowsFilterChange1(rows ?? []); // Reset to original rows if search is empty
      return;
    }

    const filteredRows = (rows ?? []).filter((item) =>
      item?.Client?.toLowerCase().includes(trimmedQuery)
    );

    onRowsFilterChange1(filteredRows);
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
        placeholder="Search"
        value={query}
        onChange={handleInputChange}
        onKeyUp={() => filterRows(query)}
        key={key}
      />
    </div>
  );
};

export default SearchFilter
