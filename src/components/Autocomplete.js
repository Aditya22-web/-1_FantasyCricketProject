import React, { useState, useEffect, useRef } from 'react';

const Autocomplete = ({ suggestions, searchTerm, onSearchChange, onSuggestionClick, placeholder }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (searchTerm && typeof searchTerm === 'string') {
      const filtered = suggestions.filter(
        suggestion => suggestion.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [searchTerm, suggestions]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  const handleChange = (e) => {
    onSearchChange(e);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    onSuggestionClick(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={handleChange}
        value={searchTerm || ''}
        placeholder={placeholder}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="cursor-pointer p-2 hover:bg-gray-100"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
