import React from 'react';
import { Calendar as CalendarIcon, MapPin, Users, Clock } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const EventManager: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Calendar Side */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{t('events.title')}</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">{t('events.view.month')}</button>
            <button className="px-3 py-1 text-sm bg-[#7A0019] text-white rounded-md shadow-sm">{t('events.view.week')}</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">{t('events.view.day')}</button>
          </div>
        </div>

        {/* Mock Calendar Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-7 gap-2 mb-4 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-xs font-semibold text-gray-500 uppercase">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 2; // Offset for mock
              const isToday = day === 17; // Mock today
              const hasEvent = [5, 20].includes(day); // Mock event dates
              
              return (
                <div key={i} className={`
                  h-24 border border-gray-100 rounded-lg p-2 relative hover:bg-gray-50 transition-colors
                  ${day <= 0 || day > 31 ? 'bg-gray-50 text-gray-300' : 'bg-white'}
                `}>
                  <span className={`
                    text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-[#7A0019] text-white' : 'text-gray-700'}
                  `}>
                    {day > 0 && day <= 31 ? day : ''}
                  </span>
                  {hasEvent && (
                    <div className="mt-2 text-[10px] p-1 bg-indigo-100 text-indigo-700 rounded truncate">
                      {day === 5 ? 'Workshop' : 'Hackathon'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events List Side */}
      <div className="w-full lg:w-96 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('events.upcoming')}</h3>
          <div className="space-y-6">
            {MOCK_EVENTS.map((event) => (
              <div key={event.id} className="relative pl-6 border-l-2 border-gray-200 pb-2 last:pb-0">
                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${event.status === 'Completed' ? 'bg-gray-400' : 'bg-[#D4A017]'}`}></div>
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <h4 className="text-base font-bold text-gray-900 mb-1">{event.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                  
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={14} className="mr-2" />
                      {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin size={14} className="mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users size={14} className="mr-2" />
                      {event.attendees} {t('events.registered')}
                    </div>
                  </div>
                  
                  {event.status === 'Upcoming' && (
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-1.5 bg-[#7A0019] text-white text-xs font-medium rounded hover:bg-[#600014]">
                        {t('events.manage')}
                      </button>
                      <button className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50">
                        {t('events.edit')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManager;