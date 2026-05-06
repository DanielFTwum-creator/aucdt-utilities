
import React from 'react';
import { MOCK_TIMETABLE, MOCK_COURSES, MOCK_LECTURERS, MOCK_VENUES } from '../data/mockData';
import { TimetableEvent } from '../types';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 10 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

  const getEventDetails = (event: TimetableEvent) => {
    const course = MOCK_COURSES.find(c => c.id === event.courseId);
    const lecturer = MOCK_LECTURERS.find(l => l.id === event.lecturerId);
    const venue = MOCK_VENUES.find(v => v.id === event.venueId);
    return { course, lecturer, venue };
  };
  
  const calculateGridPosition = (event: TimetableEvent) => {
    const startHour = parseInt(event.startTime.split(':')[0]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    const duration = endHour - startHour; // Assumes hourly slots

    const rowStart = startHour - 7; // 8:00 is row 1
    return {
      gridRow: `${rowStart} / span ${duration}`,
    };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-aucdt-green">Weekly Timetable</h1>
        {user?.role === UserRole.ADMIN && (
          <button className="flex items-center bg-aucdt-green text-white px-4 py-2 rounded-lg shadow-md hover:bg-aucdt-green/90 transition">
            <PlusCircle size={20} className="mr-2"/>
            Add New Event
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="grid grid-cols-6">
          <div className="col-span-1 p-4 border-r border-b font-semibold text-center text-aucdt-brown bg-gray-50">Time</div>
          {days.map(day => (
            <div key={day} className="col-span-1 p-4 border-r border-b font-semibold text-center text-aucdt-brown bg-gray-50">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-6 h-[70vh] relative">
            <div className="col-span-1">
                 {timeSlots.map(time => (
                    <div key={time} className="h-16 border-r border-b p-2 text-sm text-gray-500 text-center">{time}</div>
                ))}
            </div>
            {days.map((day, dayIndex) => (
                <div key={day} className="col-span-1 relative grid grid-rows-10">
                     {timeSlots.map((_, timeIndex) => (
                        <div key={timeIndex} className="h-16 border-r border-b"></div>
                    ))}
                    {MOCK_TIMETABLE.filter(e => e.day === day).map(event => {
                        const { course, lecturer, venue } = getEventDetails(event);
                        const style = calculateGridPosition(event);
                        const isUserEvent = user?.role === UserRole.ADMIN || (user?.role === UserRole.LECTURER && event.lecturerId === user.id) || user?.role === UserRole.STUDENT; // simplified logic
                        if (!isUserEvent) return null;

                        return (
                            <div 
                                key={event.id}
                                className="absolute w-full p-2"
                                style={{ top: `${(parseInt(event.startTime.split(':')[0]) - 8) * 4}rem`, height: `${(parseInt(event.endTime.split(':')[0]) - parseInt(event.startTime.split(':')[0])) * 4}rem` }}
                            >
                              <div className="h-full bg-aucdt-gold/80 border-l-4 border-aucdt-gold text-aucdt-brown p-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer text-xs overflow-hidden">
                                  <p className="font-bold">{course?.name}</p>
                                  <p>{lecturer?.name}</p>
                                  <p className="text-aucdt-brown/70">{venue?.name}</p>
                                  <p className="text-aucdt-brown/70 mt-1">{event.startTime} - {event.endTime}</p>
                              </div>
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;
