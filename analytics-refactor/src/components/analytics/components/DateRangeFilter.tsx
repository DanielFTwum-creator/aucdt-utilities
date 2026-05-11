import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangeFilter = ({ value, onChange }) => {
  const { start, end } = value;

  const handlePreset = (preset) => {
    let newStart = new Date();
    const newEnd = new Date();
    switch (preset) {
      case '30d':
        newStart.setDate(newEnd.getDate() - 30);
        break;
      case '90d':
        newStart.setDate(newEnd.getDate() - 90);
        break;
      case 'ytd':
        newStart = new Date(newEnd.getFullYear(), 0, 1);
        break;
      case 'all':
        newStart = null;
        break;
      default:
        newStart = null;
    }
    onChange({ start: newStart, end: newStart === null ? null : newEnd });
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow">
      <div className="flex items-center space-x-2">
        <DatePicker
          selected={start}
          onChange={(date) => onChange({ ...value, start: date })}
          selectsStart
          startDate={start}
          endDate={end}
          maxDate={new Date()}
          placeholderText="Start Date"
          className="w-32 px-2 py-1 border border-gray-300 rounded-md"
        />
        <DatePicker
          selected={end}
          onChange={(date) => onChange({ ...value, end: date })}
          selectsEnd
          startDate={start}
          endDate={end}
          minDate={start}
          maxDate={new Date()}
          placeholderText="End Date"
          className="w-32 px-2 py-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="flex items-center space-x-1">
        <button type="button" onClick={() => handlePreset('30d')} className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">30d</button>
        <button type="button" onClick={() => handlePreset('90d')} className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">90d</button>
        <button type="button" onClick={() => handlePreset('ytd')} className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">YTD</button>
        <button type="button" onClick={() => handlePreset('all')} className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">All</button>
      </div>
      <button type="button" onClick={() => onChange({ start: null, end: null })} className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">Clear</button>
    </div>
  );
};

export default DateRangeFilter;
