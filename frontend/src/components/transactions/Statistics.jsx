import React from 'react';

const Statistics = ({ statistics }) => {
  if (!statistics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Sale Amount</h3>
        <p className="text-3xl font-bold text-blue-600">${statistics.totalSaleAmount.toFixed(2)}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Sold Items</h3>
        <p className="text-3xl font-bold text-green-600">{statistics.totalSoldItems}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Not Sold Items</h3>
        <p className="text-3xl font-bold text-red-600">{statistics.totalNotSoldItems}</p>
      </div>
    </div>
  );
};

export default Statistics;
