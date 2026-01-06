
import React from 'react';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';

const Timetable: React.FC = () => {
  return (
    <div className="py-16 md:py-24 max-w-5xl mx-auto px-4 font-sans text-left">
      <h2 className="text-4xl font-black text-tuc-maroon dark:text-white text-center mb-16 uppercase tracking-tighter">Academic Timetables</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { dept: 'Design Computing & AI', venue: 'Innovation Lab A' },
          { dept: 'Digital Media', venue: 'Studio 1' },
          { dept: 'Fashion Technology', venue: 'Design Studio B' },
          { dept: 'Jewellery Design', venue: 'Manufacturing Lab' }
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 group">
            <div className="bg-tuc-maroon/5 dark:bg-tuc-gold/5 p-3 rounded-2xl w-fit mb-6">
              <CalendarIcon className="text-tuc-maroon dark:text-tuc-gold" />
            </div>
            <h3 className="text-xl font-black text-tuc-maroon dark:text-white uppercase mb-4">{item.dept}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
              <MapPin size={16} className="text-tuc-gold" /> {item.venue}
            </div>
            <button className="w-full bg-tuc-maroon text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-tuc-gold hover:text-tuc-maroon transition-all shadow-md">Download PDF Schedule</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;
