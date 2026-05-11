
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { MOCK_TIMETABLE, MOCK_NOTIFICATIONS } from '../data/mockData';
import { Calendar, Bell, Users, Clock } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const getUpcomingClass = () => {
    // This is a simplified logic, a real app would check current date/time
    return MOCK_TIMETABLE[0];
  }

  const upcomingClass = getUpcomingClass();

  const Card: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; color: string }> = ({ icon, title, children, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4" style={{borderColor: color}}>
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-full mr-4`} style={{backgroundColor: `${color}20`, color: color}}>{icon}</div>
        <h3 className="text-lg font-semibold text-aucdt-brown">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-aucdt-green mb-2">Welcome, {user?.name}!</h1>
      <p className="text-gray-600 mb-8">Here's your overview for today.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card icon={<Calendar size={24} />} title="Upcoming Class" color="#3D2B1F">
          <p className="text-gray-700"><strong>DES301</strong> - Advanced Typography</p>
          <p className="text-gray-500 text-sm">Today at {upcomingClass.startTime} in {upcomingClass.venueId === 'venue-01' ? 'Design Studio A' : 'N/A'}</p>
        </Card>

        <Card icon={<Bell size={24} />} title="Recent Notifications" color="#D4AF37">
          <p className="text-gray-700">{MOCK_NOTIFICATIONS.filter(n => !n.read).length} unread notifications</p>
          <p className="text-gray-500 text-sm truncate">{MOCK_NOTIFICATIONS[0].message}</p>
        </Card>
        
        {user?.role === UserRole.ADMIN && (
             <Card icon={<Users size={24} />} title="System Status" color="#004225">
                 <p className="text-gray-700"><strong>500</strong> Concurrent Users</p>
                 <p className="text-gray-500 text-sm">System performance is nominal.</p>
             </Card>
        )}
        
         {user?.role !== UserRole.ADMIN && (
             <Card icon={<Clock size={24} />} title="Today's Schedule" color="#004225">
                 <p className="text-gray-700">You have <strong>{MOCK_TIMETABLE.length}</strong> classes scheduled today.</p>
                 <p className="text-gray-500 text-sm">Your first class starts at 09:00.</p>
             </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
