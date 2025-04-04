import React from 'react';

interface DateRangeFilterProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (startDate: Date, endDate: Date) => void;
}

// Helper to format date for input type="date" (YYYY-MM-DD)
const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export function DateRangeFilter({ startDate, endDate, onDateChange }: DateRangeFilterProps) {
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value + 'T00:00:00'); // Ensure time doesn't cause off-by-one day issues
    if (!isNaN(newStartDate.getTime()) && newStartDate <= endDate) {
      onDateChange(newStartDate, endDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value + 'T00:00:00');
     if (!isNaN(newEndDate.getTime()) && newEndDate >= startDate) {
      onDateChange(startDate, newEndDate);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <label htmlFor="start-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Date Range:
      </label>
      <div className="flex items-center gap-2">
        <input
          type="date"
          id="start-date"
          name="start-date"
          value={formatDateForInput(startDate)}
          onChange={handleStartDateChange}
          className="block w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <span className="text-gray-500 dark:text-gray-400">to</span>
        <input
          type="date"
          id="end-date"
          name="end-date"
          value={formatDateForInput(endDate)}
          onChange={handleEndDateChange}
          min={formatDateForInput(startDate)} // Prevent end date being before start date
          className="block w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
       {/* Placeholder for applying filter - often data refetch is triggered in parent */}
       {/* <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">Apply</button> */}
       <p className="text-xs text-gray-500 dark:text-gray-400 sm:ml-auto">
         Filtering data from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
       </p>
    </div>
  );
}
