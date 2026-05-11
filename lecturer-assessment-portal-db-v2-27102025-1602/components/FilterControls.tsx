import React from 'react';
import { Search } from 'lucide-react';
import { Programme } from '../types';

interface FilterControlsProps {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterByProgramme: string | null;
  handleProgrammeFilter: (id: string | null) => void;
  programmes: Programme[];
  filterBySemester: number | null;
  handleSemesterFilter: (semester: number | null) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  handleSearchChange,
  filterByProgramme,
  handleProgrammeFilter,
  programmes,
  filterBySemester,
  handleSemesterFilter,
}) => {
  return (
    <div className="bg-[#F8F6F0] dark:bg-slate-800 [.high-contrast_&]:bg-black [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 rounded-lg p-5 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label htmlFor="search-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 [.high-contrast_&]:text-white mb-2">
            Search Lecturers or Courses
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-400 [.high-contrast_&]:bg-black [.high-contrast_&]:border-yellow-300 [.high-contrast_&]:text-white [.high-contrast_&]:placeholder-slate-400 rounded-md focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 [.high-contrast_&]:focus:ring-cyan-400 focus:border-sky-500 dark:focus:border-sky-400 [.high-contrast_&]:focus:border-cyan-400 transition"
              placeholder="e.g., Jane Doe, cs2101..."
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 [.high-contrast_&]:text-white mb-2">
            Filter by Programme
          </label>
          <div className="bg-[#F8F6F0] dark:bg-slate-900/50 [.high-contrast_&]:bg-black border border-slate-200 dark:border-slate-700 [.high-contrast_&]:border-yellow-300 rounded-md p-2 h-32 overflow-y-auto">
            <div className="flex flex-col items-start gap-1">
                 <button
                    onClick={() => handleProgrammeFilter(null)}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                    filterByProgramme === null
                        ? 'bg-sky-600 text-white font-semibold shadow-sm dark:bg-sky-500 [.high-contrast_&]:bg-cyan-500 [.high-contrast_&]:text-black'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 [.high-contrast_&]:text-white [.high-contrast_&]:hover:bg-cyan-500 [.high-contrast_&]:hover:text-black'
                    }`}
                >
                    All
                </button>
                {programmes.map(prog => (
                <button
                    key={prog.id}
                    onClick={() => handleProgrammeFilter(prog.id)}
                    title={prog.name}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors duration-200 whitespace-nowrap text-ellipsis overflow-hidden ${
                    filterByProgramme === prog.id
                        ? 'bg-sky-600 text-white font-semibold shadow-sm dark:bg-sky-500 [.high-contrast_&]:bg-cyan-500 [.high-contrast_&]:text-black'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 [.high-contrast_&]:text-white [.high-contrast_&]:hover:bg-cyan-500 [.high-contrast_&]:hover:text-black'
                    }`}
                >
                    {prog.id.replace(/_/g, ' ').toUpperCase()}
                </button>
                ))}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 [.high-contrast_&]:text-white mb-2">
            Filter by Semester
          </label>
          <div className="flex flex-wrap gap-2 items-center">
            <button
                onClick={() => handleSemesterFilter(null)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                filterBySemester === null
                    ? 'bg-sky-600 text-white shadow-sm dark:bg-sky-500 [.high-contrast_&]:bg-cyan-500 [.high-contrast_&]:text-black'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 [.high-contrast_&]:bg-black [.high-contrast_&]:text-white [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 [.high-contrast_&]:hover:bg-cyan-500 [.high-contrast_&]:hover:text-black'
                }`}
            >
              All
            </button>
            {[1, 2, 3, 4, 5, 6].map(sem => (
              <button
                key={sem}
                onClick={() => handleSemesterFilter(sem)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                filterBySemester === sem
                    ? 'bg-sky-600 text-white shadow-sm dark:bg-sky-500 [.high-contrast_&]:bg-cyan-500 [.high-contrast_&]:text-black'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 [.high-contrast_&]:bg-black [.high-contrast_&]:text-white [.high-contrast_&]:border [.high-contrast_&]:border-yellow-300 [.high-contrast_&]:hover:bg-cyan-500 [.high-contrast_&]:hover:text-black'
                }`}
              >
                {sem}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;