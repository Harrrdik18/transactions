import React from 'react';

const TransactionFilters = ({ selectedMonth, setSelectedMonth, searchText, setSearchText, months }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white rounded-lg shadow">
      <select 
        value={selectedMonth} 
        onChange={(e) => setSelectedMonth(Number(e.target.value))}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {months.map((month, index) => (
          <option key={index + 1} value={index + 1}>
            {month}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search transactions..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default TransactionFilters;
