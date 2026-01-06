
import React from 'react';

const AcademicCalendar: React.FC = () => {
  const events = [
    { date: 'Oct 01, 2025', event: 'Academic Year Begins' },
    { date: 'Oct 15, 2025', event: '8th Matriculation Ceremony' },
    { date: 'Dec 15, 2025', event: 'End of Semester Break' },
    { date: 'Jan 05, 2026', event: 'New Year Session Resumes' }
  ];
  return (
    <div className="py-16 md:py-24 max-w-5xl mx-auto px-4 font-sans">
      <h2 className="text-4xl font-black text-tuc-maroon dark:text-white text-center mb-12 uppercase tracking-tighter">Academic Calendar 2025/2026</h2>
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-tuc-maroon text-white">
            <tr>
              <th className="px-8 py-6 text-xs font-black uppercase">Date</th>
              <th className="px-8 py-6 text-xs font-black uppercase">Event</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {events.map((e, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-8 py-6 text-sm font-bold text-tuc-maroon dark:text-tuc-gold">{e.date}</td>
                <td className="px-8 py-6 text-sm text-gray-700 dark:text-gray-300">{e.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AcademicCalendar;
