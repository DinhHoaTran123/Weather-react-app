// src/components/SearchBar.js
import React, { useState } from 'react';

const SearchBar = ({ onAddCity }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() === '') return;
    onAddCity(city);
    setCity('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Nhập tên thành phố..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: '8px', width: '250px' }}
      />
      <button type="submit" style={{ padding: '8px 12px', marginLeft: '8px' }}>
        Thêm Widget
      </button>
    </form>
  );
};

export default SearchBar;
