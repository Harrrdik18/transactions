import React from 'react';

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className="flex justify-center items-center gap-4 my-8">
      <button 
        onClick={() => setCurrentPage(prev => prev - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-lg font-medium ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
        }`}
      >
        Previous
      </button>
      
      <span className="text-gray-700">
        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
      </span>
      
      <button 
        onClick={() => setCurrentPage(prev => prev + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded-lg font-medium ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
