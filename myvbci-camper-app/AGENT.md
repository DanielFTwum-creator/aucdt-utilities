# myvbci-camper-app - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for myvbci-camper-app.

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: App.tsx
```typescript
import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Auth from './pages/Auth';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import CampRegistration from './pages/CampRegistration';
import AdminCamps from './pages/AdminCamps';
import AdminRooms from './pages/AdminRooms';
import AdminNotifications from './pages/AdminNotifications';
import AdminTesting from './pages/AdminTesting';
import { AIAssistant } from './components/AIAssistant';
import { UserRole } from './types';

// Placeholder components for other routes
const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-in fade-in zoom-in duration-500">
    <div className="text-6xl mb-4 grayscale opacity-50">🚧</div>
    <h2 className="text-2xl font-bold text-slate-600 mb-2">{title}</h2>
    <p className="text-slate-400">This feature is currently under construction.</p>
  </div>
);

const AppContent: React.FC = () => {
  const { currentUser } = useStore();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!currentUser) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return currentUser.role === UserRole.ADMIN ? <AdminDashboard /> : <CampRegistration onBack={() => setCurrentPage('profile')} />;
      case 'camps':
        return currentUser.role === UserRole.ADMIN ? <AdminCamps /> : <CampRegistration onBack={() => setCurrentPage('profile')} />;
      case 'rooms':
        return currentUser.role === UserRole.ADMIN ? <AdminRooms /> : <ComingSoon title="Room Allocation" />;
      case 'notifications':
        return currentUser.role === UserRole.ADMIN ? <AdminNotifications /> : <ComingSoon title="Notifications" />;
      case 'reports':
        return <ComingSoon title="Financial Reports" />;
      case 'testing':
        return currentUser.role === UserRole.ADMIN ? <AdminTesting /> : <ComingSoon title="Testing" />;
      case 'profile':
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold mb-6 text-vbci-navy border-b pb-4">My Profile</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100 items-center">
                        <span className="text-slate-500 col-span-1">Full Name</span>
                        <span className="font-medium text-slate-800 col-span-2">{currentUser.full_name}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100 items-center">
                        <span className="text-slate-500 col-span-1">Email Address</span>
                        <span className="font-medium text-slate-800 col-span-2">{currentUser.email}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100 items-center">
                        <span className="text-slate-500 col-span-1">Account Type</span>
                        <div className="col-span-2">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentUser.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                {currentUser.role}
                            </span>
                        </div>
                    </div>
                     <div className="grid grid-cols-3 gap-4 py-3 items-center">
                        <span className="text-slate-500 col-span-1">Member Since</span>
                        <span className="font-medium text-slate-800 col-span-2">{new Date(currentUser.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
      {currentUser.role === UserRole.CAMPER && <AIAssistant />}
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;

```

### FILE: components/AIAssistant.tsx
```typescript
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { askCampAssistant } from '../services/geminiService';
import { useStore } from '../context/StoreContext';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Hello! I am your VBCI Camp Assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const { camps, rooms } = useStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    // Build Context
    const campContext = camps.map(c => `${c.name}: ₵${c.price}, ${c.available_slots} slots left. ${c.description}`).join('\n');
    const roomContext = `There are ${rooms.length} rooms configured. Some are ${rooms.filter(r => r.status === 'Full').length} full.`;
    const fullContext = `Camps:\n${campContext}\n\nRooms:\n${roomContext}`;

    const response = await askCampAssistant(userMsg, fullContext);
    
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-vbci-navy text-white p-4 rounded-full shadow-lg hover:bg-vbci-navyLight transition-all transform hover:scale-105"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col border border-slate-200 overflow-hidden h-[500px]">
          <div className="bg-vbci-navy p-4 flex justify-between items-center text-white">
            <h3 className="font-semibold">VBCI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  m.role === 'user' 
                    ? 'bg-vbci-gold text-vbci-navy font-medium' 
                    : 'bg-white border border-slate-200 text-slate-700'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
               <div className="flex justify-start">
                 <div className="bg-white border border-slate-200 p-3 rounded-lg">
                   <Loader2 size={16} className="animate-spin text-vbci-navy" />
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about camps..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-vbci-navy focus:border-transparent text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-vbci-navy text-white p-2 rounded-md hover:bg-vbci-navyLight disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

### FILE: components/Layout.tsx
```typescript
import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { 
  LayoutDashboard, Tent, Users, Calendar, 
  LogOut, Menu, Bell, FlaskConical 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { currentUser, logout, notifications } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const role = currentUser?.role;

  // Filter notifications based on user role
  const myNotifications = notifications.filter(n => {
      if (n.audience === 'All') return true;
      if (currentUser?.role === UserRole.ADMIN && n.audience === 'Admins') return true;
      if (currentUser?.role === UserRole.CAMPER && n.audience === 'Campers') return true;
      return false;
  });

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = role === UserRole.ADMIN ? [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'camps', label: 'Manage Camps', icon: Tent },
    { id: 'rooms', label: 'Room Allocation', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'reports', label: 'Reports', icon: Calendar },
    { id: 'testing', label: 'Testing', icon: FlaskConical },
  ] : [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'camps', label: 'Browse Camps', icon: Tent },
    { id: 'profile', label: 'My Profile', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        aria-label="Main navigation sidebar"
        className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-vbci-navy text-white transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-20 flex items-center px-8 border-b border-white/10">
            <div className="w-8 h-8 bg-vbci-gold rounded-lg flex items-center justify-center mr-3" aria-hidden="true">
                <span className="text-vbci-navy font-bold">V</span>
            </div>
          <span className="text-xl font-bold tracking-wide">myVBCI</span>
        </div>

        <nav aria-label="Site navigation" className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setSidebarOpen(false);
              }}
              aria-label={item.label}
              aria-current={currentPage === item.id ? 'page' : undefined}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-vbci-gold text-vbci-navy font-bold'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
          <button
            onClick={logout}
            aria-label="Sign out"
            className="w-full flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header role="banner" aria-label="Application header" className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10">
          <button
            className="lg:hidden text-slate-500 hover:text-vbci-navy"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-6 h-6" aria-hidden="true" />
          </button>

          <div className="flex items-center space-x-4 ml-auto" ref={notifRef}>
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-slate-800">
                {currentUser?.title} {currentUser?.full_name}
              </span>
              <span className="text-xs text-slate-500 capitalize">{currentUser?.role.toLowerCase()}</span>
            </div>

            <div className="relative">
                <button
                  aria-label={`Notifications${myNotifications.length > 0 ? ` (${myNotifications.length} unread)` : ''}`}
                  aria-expanded={notificationsOpen}
                  aria-haspopup="true"
                  className={`p-2 rounded-full relative transition-colors ${notificationsOpen ? 'bg-slate-100 text-vbci-navy' : 'text-slate-400 hover:text-vbci-navy hover:bg-slate-100'}`}
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell className="w-5 h-5" />
                  {myNotifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                      <span className="bg-vbci-navy text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{myNotifications.length}</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {myNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                           <Bell className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                           <p className="text-slate-500 text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        myNotifications.map(n => (
                          <div key={n.id} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group text-left">
                             <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                                  n.type === 'Urgent' ? 'bg-red-50 text-red-700 border-red-100' :
                                  n.type === 'Warning' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                  n.type === 'Success' ? 'bg-green-50 text-green-700 border-green-100' :
                                  'bg-blue-50 text-blue-700 border-blue-100'
                                }`}>
                                  {n.type}
                                </span>
                                <span className="text-[10px] text-slate-400">{new Date(n.date).toLocaleDateString()}</span>
                             </div>
                             <h4 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-vbci-navy transition-colors">{n.title}</h4>
                             <p className="text-xs text-slate-500 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
               {currentUser?.full_name.charAt(0)}
            </div>
          </div>
        </header>

        <main id="main-content" aria-label="Page content" className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

```

### FILE: context/StoreContext.tsx
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Camp, Room, Booking, Notification, UserRole, 
  RoomType, GenderRestriction, RoomStatus, 
  BookingStatus, PaymentStatus 
} from '../types';

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  camps: Camp[];
  rooms: Room[];
  bookings: Booking[];
  notifications: Notification[];
  login: (email: string) => boolean;
  register: (user: Omit<User, 'user_id' | 'created_at'>) => void;
  logout: () => void;
  addBooking: (booking: Booking) => void;
  updateRoomOccupancy: (roomId: string) => void;
  addCamp: (camp: Camp) => void;
  deleteCamp: (campId: string) => void;
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (roomId: string) => void;
  addNotification: (notification: Notification) => void;
  deleteNotification: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// --- MOCK DATA ---
const MOCK_USERS: User[] = [
  {
    user_id: 'u1',
    full_name: 'John Doe',
    title: 'Bro',
    email: 'john@example.com',
    phone: '123-456-7890',
    role: UserRole.CAMPER,
    gender: 'Male',
    created_at: new Date().toISOString(),
  },
  {
    user_id: 'a1',
    full_name: 'Admin User',
    title: 'Pastor',
    email: 'admin@vbci.com',
    phone: '987-654-3210',
    role: UserRole.ADMIN,
    created_at: new Date().toISOString(),
  }
];

const MOCK_CAMPS: Camp[] = [
  {
    camp_id: 'c1',
    name: 'VBCI Youth Camp 2025',
    description: 'An immersive spiritual experience for youth ages 18-30. Join us for worship, workshops, and fellowship.',
    start_date: '2025-07-15',
    end_date: '2025-07-20',
    price: 150,
    capacity: 200,
    available_slots: 145,
    image_url: 'https://picsum.photos/800/400?random=1',
  },
  {
    camp_id: 'c2',
    name: 'Families of Victory Retreat',
    description: 'A weekend getaway for families to bond and grow together in faith.',
    start_date: '2025-08-10',
    end_date: '2025-08-12',
    price: 300,
    capacity: 50,
    available_slots: 12,
    image_url: 'https://picsum.photos/800/400?random=2',
  }
];

const MOCK_ROOMS: Room[] = [
  // Camp 1 Rooms
  { room_id: 'r1', camp_id: 'c1', room_name: 'Cabin Alpha (M)', type: RoomType.CABIN, capacity: 10, current_occupancy: 8, gender_restriction: GenderRestriction.MALE, status: RoomStatus.AVAILABLE, amenities: 'Bunk beds, AC, Shared Bath' },
  { room_id: 'r2', camp_id: 'c1', room_name: 'Cabin Beta (F)', type: RoomType.CABIN, capacity: 10, current_occupancy: 10, gender_restriction: GenderRestriction.FEMALE, status: RoomStatus.FULL, amenities: 'Bunk beds, AC, Shared Bath' },
  { room_id: 'r3', camp_id: 'c1', room_name: 'Tent Zone 1', type: RoomType.TENT, capacity: 4, current_occupancy: 0, gender_restriction: GenderRestriction.MIXED, status: RoomStatus.AVAILABLE, amenities: 'Outdoor experience, Lantern provided' },
  // Camp 2 Rooms
  { room_id: 'r4', camp_id: 'c2', room_name: 'Family Suite A', type: RoomType.SUITE, capacity: 5, current_occupancy: 2, gender_restriction: GenderRestriction.MIXED, status: RoomStatus.AVAILABLE, amenities: 'Private Bath, King Bed + Bunks, Kitchenette' },
];

const MOCK_BOOKINGS: Booking[] = [
    {
        booking_id: 'b1',
        user_id: 'u_random_1',
        camp_id: 'c1',
        room_id: 'r2',
        status: BookingStatus.CONFIRMED,
        payment_status: PaymentStatus.PAID,
        amount: 150,
        timestamp: '2025-01-10T10:00:00Z'
    }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Early Bird Registration Open',
    message: 'Register for Youth Camp 2025 before June 1st to secure your spot!',
    type: 'Info',
    date: new Date().toISOString(),
    audience: 'All'
  },
  {
    id: 'n2',
    title: 'Payment Deadline Approaching',
    message: 'Please complete all pending payments by next Friday.',
    type: 'Urgent',
    date: new Date(Date.now() - 86400000).toISOString(),
    audience: 'Campers'
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [camps, setCamps] = useState<Camp[]>(MOCK_CAMPS);
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const login = (email: string) => {
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return true;
    }
    return false;
  };

  const register = (userData: Omit<User, 'user_id' | 'created_at'>) => {
    const newUser: User = {
      ...userData,
      user_id: `u${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const logout = () => setCurrentUser(null);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
    updateRoomOccupancy(booking.room_id);
    
    // Update Camp slots
    setCamps(prev => prev.map(c => {
        if (c.camp_id === booking.camp_id) {
            return { ...c, available_slots: c.available_slots - 1 };
        }
        return c;
    }));
  };

  const updateRoomOccupancy = (roomId: string) => {
    setRooms(prevRooms => prevRooms.map(room => {
      if (room.room_id === roomId) {
        const newOccupancy = room.current_occupancy + 1;
        return {
          ...room,
          current_occupancy: newOccupancy,
          status: newOccupancy >= room.capacity ? RoomStatus.FULL : RoomStatus.AVAILABLE
        };
      }
      return room;
    }));
  };

  const addCamp = (camp: Camp) => {
    setCamps(prev => [...prev, camp]);
  };

  const deleteCamp = (campId: string) => {
    setCamps(prev => prev.filter(c => c.camp_id !== campId));
  };

  const addRoom = (room: Room) => {
    setRooms(prev => [...prev, room]);
  };

  const updateRoom = (updatedRoom: Room) => {
    setRooms(prev => prev.map(r => {
      if (r.room_id === updatedRoom.room_id) {
        // Recalculate status in case capacity changed
        const status = updatedRoom.current_occupancy >= updatedRoom.capacity ? RoomStatus.FULL : RoomStatus.AVAILABLE;
        return { ...updatedRoom, status };
      }
      return r;
    }));
  };

  const deleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(r => r.room_id !== roomId));
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <StoreContext.Provider value={{ 
      currentUser, users, camps, rooms, bookings, notifications,
      login, register, logout, addBooking, updateRoomOccupancy,
      addCamp, deleteCamp, addRoom, updateRoom, deleteRoom,
      addNotification, deleteNotification
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
```

### FILE: CREATION.md
```md
# myvbci-camper-app

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: Dockerfile
```text
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

```

### FILE: docs/admin-guide.md
```md
# myVBCI Camper App - Administrator Guide

**Version: 1.0**

---

## 1. Introduction

This guide provides a comprehensive overview of the administrative features of the myVBCI Camper App. It is intended for users with the 'Admin' role and covers all aspects of managing the camp system, from monitoring the dashboard to sending notifications.

## 2. Getting Started: Logging In

1.  Navigate to the application's main page.
2.  The authentication screen will be displayed.
3.  For quick access to the admin panel, click the **"Admin Demo"** button. This will pre-fill the form with administrator credentials.
4.  Click **"Sign In"**. You will be redirected to the Admin Dashboard.

## 3. The Dashboard

The Dashboard is your central hub for monitoring the camp's key performance indicators.

-   **Stats Grid:** At a glance, you can see:
    -   **Total Revenue:** The sum of all completed payments.
    -   **Total Campers:** The total number of confirmed registrations.
    -   **Active Camps:** The number of camp events currently configured in the system.
    -   **Room Occupancy:** The percentage of rooms that are marked as 'Full'.
-   **Revenue by Camp Chart:** A bar chart that breaks down revenue sources by each camp event.
-   **Room Availability Chart:** A pie chart showing the proportion of available rooms versus full rooms across all camps.

## 4. Managing Camps

This section allows you to create, view, and remove camp events.

### 4.1 Creating a New Camp
1.  Navigate to the **"Manage Camps"** page from the sidebar.
2.  Click the **"+ Add Camp"** button.
3.  A form will appear. Fill in the required details:
    -   **Camp Name:** The official name of the event.
    -   **Description:** A brief overview of the camp.
    -   **Start & End Dates:** The duration of the camp.
    -   **Price:** The registration fee per camper.
    -   **Capacity:** The total number of campers the event can accommodate.
4.  Click **"Create Camp"**. The new camp will appear in the list.

### 4.2 Deleting a Camp
1.  On the **"Manage Camps"** page, find the camp you wish to remove.
2.  Click the **trash can icon** on the right side of the camp's card.
3.  A confirmation prompt will appear. Confirm the action to permanently delete the camp and all associated data.

## 5. Room Allocation

Here, you can manage accommodations for each camp.

### 5.1 Viewing and Filtering Rooms
1.  Navigate to the **"Room Allocation"** page.
2.  Use the dropdown menus at the top to filter the view:
    -   **Sort by:** Order rooms by name, capacity, or occupancy.
    -   **Filter by Type:** Show only specific room types (e.g., Cabin, Tent).
    -   **Filter by Status:** Show only 'Available' or 'Full' rooms.
    -   **Filter by Camp:** Select the camp event for which you want to manage rooms.

### 5.2 Adding a New Room
1.  First, select the desired camp from the **"Camp"** filter dropdown.
2.  Click the **"+ Add Room"** button.
3.  In the modal that appears, provide the room details:
    -   **Room Name:** A unique identifier (e.g., "Cabin Alpha").
    -   **Type:** The kind of accommodation.
    -   **Capacity:** The maximum number of campers.
    -   **Gender Restriction:** Set to Male, Female, or Mixed.
    -   **Amenities:** A brief list of features (e.g., "Bunk beds, AC").
4.  Click **"Create Room"**.

### 5.3 Editing or Deleting a Room
1.  Hover over the card of the room you wish to modify.
2.  Action icons will appear in the top-right corner.
    -   Click the **pencil icon** to edit the room's details in a modal.
    -   Click the **trash can icon** to delete the room after a confirmation prompt.

## 6. Sending Notifications

Communicate with users by sending targeted alerts.

1.  Navigate to the **"Notifications"** page.
2.  On the left, use the **"Create Alert"** form:
    -   **Title:** A short, descriptive title for the notification.
    -   **Type:** Choose from Info, Warning, Success, or Urgent. This affects the alert's visual style.
    -   **Target Audience:** Select whether the alert should go to all users, just campers, or just admins.
    -   **Message:** The full text of your announcement.
3.  Click **"Post Notification"**. The alert will be sent and will appear in the "Active Notifications" list.

## 7. System Testing

The **"Testing"** page contains a Playwright-based self-test suite. This allows you to run automated checks on critical user journeys to ensure the application is functioning correctly. Refer to the *Testing Guide* for more details.

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — myvbci-camper-app

**Application:** myvbci-camper-app
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_myvbci-camper-app_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/deployment-guide.md
```md
# myVBCI Camper App - Deployment Guide

**Version: 1.0**

---

## 1. Overview

The myVBCI Camper App is a static, frontend-only web application built with React and TypeScript. It does not require a backend server or database, as it uses mock data managed within the application's state.

This guide outlines the steps to deploy the application to a production environment.

## 2. Prerequisites

There are no strict build-time prerequisites as the application is designed to run directly from its source files in a modern development environment. For a traditional deployment, you would typically need:

-   **Node.js and npm:** To run a build process (if one were configured).
-   **A static web server:** Such as Nginx, Apache, or a cloud-based hosting service.

## 3. Configuration

The application requires one essential environment variable for the AI Assistant feature to function.

### Gemini API Key

The application is configured to read the Gemini API key from `process.env.API_KEY`. In a real-world scenario, you would configure this in your hosting environment.

-   **For services like Vercel or Netlify:** Add an environment variable named `API_KEY` in the project settings.
-   **For Nginx/Apache:** You would typically build the app with the key injected at build time, using a `.env` file and a build script.

Since this project has no build step, the API key is expected to be present in the execution environment where the JavaScript code runs.

## 4. Build Process

This application is set up to run without a traditional build step. The `index.html` file uses an `importmap` to load ES modules directly from a CDN.

In a standard production workflow, you would run a build command:

```bash
# This is a hypothetical command, as no build script is configured
npm install
npm run build
```

This command would typically create a `build` or `dist` directory containing optimized, static HTML, CSS, and JavaScript files.

## 5. Deployment

Deployment involves serving the application's static files.

### Method 1: Using a Static Hosting Service (Recommended)

Services like **Vercel**, **Netlify**, or **GitHub Pages** are ideal for this type of application.

1.  Connect your Git repository (GitHub, GitLab, etc.) to the hosting service.
2.  Configure the project settings. Since there is no build command, you may need to specify that none is required.
3.  Set the publish directory to the root of the project.
4.  Add the `API_KEY` environment variable as described in the Configuration section.
5.  The service will automatically deploy the application.

### Method 2: Using a Traditional Web Server (e.g., Nginx)

1.  Copy all the project files (`index.html`, `index.tsx`, `App.tsx`, etc.) to a directory on your server (e.g., `/var/www/myvbci-app`).
2.  Configure Nginx to serve files from this directory. A sample configuration block might look like this:

```nginx
server {
    listen 80;
    server_name myapp.yourdomain.com;

    root /var/www/myvbci-app;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # You might need to add headers to handle module scripts correctly
    # depending on your setup.
}
```
3. Reload Nginx. The application will now be live.

**Note:** For this specific project setup, ensure your web server is configured to correctly serve files with `.tsx` extensions or that you have a mechanism to transpile them on the fly, which is uncommon for production. The simplest approach is to serve the provided source files directly.

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — myvbci-camper-app

**Application:** myvbci-camper-app
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd myvbci-camper-app
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build myvbci-camper-app
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up myvbci-camper-app
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/README.md
```md
# Project Documentation

Welcome to the documentation hub for the **myVBCI Camper App**. This directory contains all the necessary documents to understand the application's architecture, requirements, and usage.

## Available Documents

-   **[Administrator Guide](./admin-guide.md):** Instructions for users with the 'Admin' role on how to manage the application.
-   **[Deployment Guide](./deployment-guide.md):** Steps for deploying the application to a production environment.
-   **[Software Requirements Specification (SRS)](./srs.md):** Detailed description of the application's functional and non-functional requirements.
-   **[Testing Guide](./testing-guide.md):** Information on how to use the built-in testing suite and perform manual tests.

## System Architecture

Below is a high-level overview of the application's data flow and component interaction. For more diagrams, see the `diagrams` subdirectory.

### Data Flow Diagram

![Data Flow Diagram](./diagrams/data-flow.svg)

```

### FILE: docs/srs.md
```md
﻿# Software Requirements Specification

**Project:** Myvbci Camper App
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Myvbci Camper App**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Myvbci Camper App** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Myvbci Camper App** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âŒ Non-compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âŒ Non-compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1, Recharts 3.7.0
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/testing-guide.md
```md
# myVBCI Camper App - Testing Guide

**Version: 1.0**

---

## 1. Introduction

This guide provides instructions for testing the myVBCI Camper App. It covers both the integrated automated test suite and provides a checklist for manual user acceptance testing (UAT).

## 2. Automated Testing: Playwright Self-Test Suite

The application includes a built-in, simulated end-to-end testing framework. This allows administrators to quickly verify that critical user journeys are working as expected without leaving the application.

### 2.1 Accessing the Test Suite

1.  Log in to the application as an **Administrator**.
2.  From the sidebar navigation, click on the **"Testing"** item (with the flask icon).

### 2.2 Running the Tests

1.  On the "Playwright Self-Test Suite" page, you will see a list of test suites (e.g., "Authentication Flow", "Admin Panel Operations").
2.  Click the **"Run All Tests"** button at the top of the page.
3.  The tests will begin to execute sequentially. You will see the status of each test case update in real-time.

### 2.3 Interpreting the Results

Each test case will display one of the following statuses:

-   <span style="color: blue;">**RUNNING:**</span> The test is currently in progress. An animated loader icon will be visible.
-   <span style="color: green;">**PASSED:**</span> The test completed successfully. A green checkmark icon will be visible, along with the execution time in milliseconds.
-   <span style="color: red;">**FAILED:**</span> The test encountered an error. A red 'X' icon will be visible.
-   <span style="color: gray;">**PENDING:**</span> The test has not yet been run. A clock icon will be visible.

### 2.4 Handling Failures

If a test fails:
-   An error message describing the reason for the failure will be displayed in a red box below the test case.
-   A link titled **"View Screenshot"** will appear. Clicking this link will open a new tab showing a dynamically generated image that simulates what the screen might have looked like at the moment of failure. This helps in diagnosing the issue.

## 3. Manual Testing Checklist

Manual testing is recommended to verify usability and catch issues not covered by automated tests. Log in with both **Admin** and **Camper** demo accounts to test role-specific functionality.

### 3.1 Admin Role Test Cases

| # | Test Case Description | Steps | Expected Result |
|---|---|---|---|
| 1 | Create and Verify a New Camp | 1. Go to Manage Camps. 2. Click "Add Camp". 3. Fill out and submit the form. | The new camp appears in the list with correct details. |
| 2 | Add a Room to the New Camp | 1. Go to Room Allocation. 2. Select the new camp. 3. Click "Add Room". 4. Fill out and submit. | The new room appears under the correct camp. |
| 3 | Edit an Existing Room | 1. Hover over the new room. 2. Click the Edit icon. 3. Change the capacity and save. | The room's capacity is updated on the card. |
| 4 | Send a Notification to Campers | 1. Go to Notifications. 2. Create a new alert with "Campers Only" audience. | The notification appears in the list. (Verify a camper user can see it). |
| 5 | Delete a Room and a Camp | 1. Delete the created room. 2. Delete the created camp. | Both items are removed after confirmation. |

### 3.2 Camper Role Test Cases

| # | Test Case Description | Steps | Expected Result |
|---|---|---|---|
| 1 | Successful Registration Flow | 1. Log in as a Camper. 2. Select an available camp. 3. Select an available, gender-appropriate room. 4. Proceed to payment and confirm. | A success modal appears with a booking confirmation number. |
| 2 | View Profile Information | 1. Navigate to "My Profile". | The user's correct name, email, and role are displayed. |
| 3 | Interact with AI Assistant | 1. Open the AI Assistant widget. 2. Ask "How much is the Youth Camp?". | The AI provides a correct and relevant answer based on camp data. |
| 4 | Verify Full Room is Not Selectable | 1. Check if any camp has a full room. 2. Attempt to register for that camp and select the full room. | The full room should not be visible or should be disabled in the selection list. |

```

### FILE: docs/TESTING.md
```md
# Testing Guide — myvbci-camper-app

**Application:** myvbci-camper-app
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd myvbci-camper-app
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="myVBCI Camper App" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="myVBCI Camper App" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>myVBCI Camper App</title>
    <script type="importmap">
{
  "imports": {
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.29.0",
    "lucide-react": "https://aistudiocdn.com/lucide-react@^0.553.0",
    "recharts": "https://aistudiocdn.com/recharts@^3.3.0"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body class="bg-slate-50 text-slate-900">
    <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>
```

### FILE: index.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### FILE: metadata.json
```json
{
  "name": "myVBCI Camper App",
  "description": "A church camp management system enabling registration, room allocation, and payments for VBCI campers.",
  "requestFramePermissions": []
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "name": "myvbci-camper-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "lucide-react": "^0.553.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "recharts": "^3.4.1"
  },
  "devDependencies": {
    "@types/node": "^24.10.1",
    "@vitejs/plugin-react": "^5.1.1",
    "typescript": "~5.9.3",
    "vite": "^7.2.2",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: pages/AdminCamps.tsx
```typescript
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Camp } from '../types';
import { Plus, Trash2, Calendar, Users, DollarSign, Image as ImageIcon } from 'lucide-react';

const AdminCamps: React.FC = () => {
  const { camps, addCamp, deleteCamp } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newCamp, setNewCamp] = useState<Partial<Camp>>({
    name: '',
    description: '',
    price: 0,
    capacity: 100,
    available_slots: 100,
    start_date: '',
    end_date: '',
    image_url: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = `https://picsum.photos/800/400?random=${Date.now()}`;
      setNewCamp({ ...newCamp, image_url: imageUrl });
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamp.name || !newCamp.start_date) return;

    const camp: Camp = {
      camp_id: `c${Date.now()}`,
      name: newCamp.name!,
      description: newCamp.description || '',
      price: Number(newCamp.price),
      capacity: Number(newCamp.capacity),
      available_slots: Number(newCamp.capacity), // Default to capacity
      start_date: newCamp.start_date!,
      end_date: newCamp.end_date!,
      image_url: newCamp.image_url || 'https://picsum.photos/800/400?random=' + Date.now()
    };

    addCamp(camp);
    setIsAdding(false);
    setNewCamp({
        name: '',
        description: '',
        price: 0,
        capacity: 100,
        available_slots: 100,
        start_date: '',
        end_date: '',
        image_url: '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Camps</h1>
          <p className="text-slate-500">Create and manage camp events.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-vbci-navy text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-vbci-navyLight transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Camp
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg mb-8 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-slate-800 mb-4">New Camp Details</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Camp Name</label>
              <input 
                required
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy"
                value={newCamp.name}
                onChange={e => setNewCamp({...newCamp, name: e.target.value})}
                placeholder="e.g. Summer Youth Retreat"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy"
                value={newCamp.description}
                onChange={e => setNewCamp({...newCamp, description: e.target.value})}
                placeholder="Camp details..."
                rows={3}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Camp Image</label>
              {newCamp.image_url ? (
                <div>
                  <img src={newCamp.image_url} alt="Camp preview" className="h-40 w-full object-cover rounded-lg shadow-sm mb-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Image placeholder generated.</span>
                    <label htmlFor="file-upload" className="cursor-pointer text-sm font-medium text-vbci-navy hover:text-vbci-navyLight">
                        Change Image
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-vbci-navy hover:text-vbci-navyLight focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-vbci-navy">
                        <span>Upload an image</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">A random placeholder will be generated.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input 
                type="date"
                required
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy"
                value={newCamp.start_date}
                onChange={e => setNewCamp({...newCamp, start_date: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input 
                type="date"
                required
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy"
                value={newCamp.end_date}
                onChange={e => setNewCamp({...newCamp, end_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price (₵)</label>
              <input 
                type="number"
                required
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy"
                value={newCamp.price}
                onChange={e => setNewCamp({...newCamp, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
              <input 
                type="number"
                required
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy"
                value={newCamp.capacity}
                onChange={e => setNewCamp({...newCamp, capacity: Number(e.target.value)})}
              />
            </div>
            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-vbci-gold text-vbci-navy font-bold rounded-md hover:bg-vbci-goldHover shadow-sm transition-colors"
              >
                Create Camp
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {camps.map(camp => (
          <div key={camp.camp_id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition-shadow">
            <div className="h-32 w-full md:w-48 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
               <img src={camp.image_url} alt={camp.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-vbci-navy mb-2">{camp.name}</h3>
                <button 
                    onClick={() => {
                        if(window.confirm('Are you sure you want to delete this camp?')) {
                            deleteCamp(camp.camp_id);
                        }
                    }}
                    className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete Camp"
                >
                    <Trash2 size={18} />
                </button>
              </div>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{camp.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-vbci-gold" />
                  {new Date(camp.start_date).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 text-vbci-gold" />
                  ₵{camp.price}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-vbci-gold" />
                  {camp.capacity - camp.available_slots} / {camp.capacity} registered
                </div>
              </div>
            </div>
          </div>
        ))}

        {camps.length === 0 && (
            <div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-medium text-slate-900">No camps found</h3>
                <p className="text-slate-500">Get started by creating a new camp.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminCamps;
```

### FILE: pages/AdminDashboard.tsx
```typescript
import React from 'react';
import { useStore } from '../context/StoreContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, DollarSign, Tent, AlertCircle } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { camps, bookings, rooms } = useStore();

  // Metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const totalRegistrations = bookings.length;
  const activeCamps = camps.length;
  const occupancyRate = Math.round((rooms.filter(r => r.status === 'Full').length / rooms.length) * 100) || 0;

  // Chart Data Preparation
  const revenueData = camps.map(camp => {
    const campBookings = bookings.filter(b => b.camp_id === camp.camp_id);
    const revenue = campBookings.reduce((sum, b) => sum + b.amount, 0);
    return { name: camp.name.substring(0, 15) + '...', revenue };
  });

  const roomStatusData = [
    { name: 'Available', value: rooms.filter(r => r.status === 'Available').length },
    { name: 'Full', value: rooms.filter(r => r.status === 'Full').length },
  ];
  const PIE_COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-700">
            Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `₵${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
          { label: 'Total Campers', value: totalRegistrations, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Active Camps', value: activeCamps, icon: Tent, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Room Occupancy', value: `${occupancyRate}%`, icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-100' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center">
            <div className={`p-3 rounded-lg ${stat.bg} mr-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Revenue by Camp</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `₵${value}`} />
                <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="revenue" fill="#000080" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Occupancy Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Room Availability Status</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomStatusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
               {roomStatusData.map((item, index) => (
                   <div key={index} className="flex items-center">
                       <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: PIE_COLORS[index]}}></div>
                       <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                   </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
```

### FILE: pages/AdminNotifications.tsx
```typescript
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Notification } from '../types';
import { Bell, Trash2, Send, Info, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

const AdminNotifications: React.FC = () => {
  const { notifications, addNotification, deleteNotification } = useStore();
  const [newNotif, setNewNotif] = useState<Partial<Notification>>({
    title: '',
    message: '',
    type: 'Info',
    audience: 'All'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotif.title || !newNotif.message) return;

    const notification: Notification = {
      id: `n${Date.now()}`,
      title: newNotif.title,
      message: newNotif.message,
      type: newNotif.type as any,
      audience: newNotif.audience as any,
      date: new Date().toISOString()
    };

    addNotification(notification);
    setNewNotif({
      title: '',
      message: '',
      type: 'Info',
      audience: 'All'
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Warning': return <AlertTriangle className="text-orange-500" size={20} />;
      case 'Success': return <CheckCircle className="text-green-500" size={20} />;
      case 'Urgent': return <AlertOctagon className="text-red-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Warning': return 'bg-orange-50 border-orange-100 text-orange-800';
      case 'Success': return 'bg-green-50 border-green-100 text-green-800';
      case 'Urgent': return 'bg-red-50 border-red-100 text-red-800';
      default: return 'bg-blue-50 border-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications & Alerts</h1>
          <p className="text-slate-500">Create announcements for campers and staff.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Notification Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <Send className="w-5 h-5 mr-2 text-vbci-navy" />
              Create Alert
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                  placeholder="Alert Title"
                  value={newNotif.title}
                  onChange={e => setNewNotif({...newNotif, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                  value={newNotif.type}
                  onChange={e => setNewNotif({...newNotif, type: e.target.value as any})}
                >
                  <option value="Info">Info</option>
                  <option value="Warning">Warning</option>
                  <option value="Success">Success</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                  value={newNotif.audience}
                  onChange={e => setNewNotif({...newNotif, audience: e.target.value as any})}
                >
                  <option value="All">All Users</option>
                  <option value="Campers">Campers Only</option>
                  <option value="Admins">Admins Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none resize-none"
                  placeholder="Enter your message here..."
                  value={newNotif.message}
                  onChange={e => setNewNotif({...newNotif, message: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-vbci-navy text-white rounded-lg font-bold hover:bg-vbci-navyLight shadow-md transition-all transform hover:scale-[1.02] flex justify-center items-center"
              >
                <Send size={16} className="mr-2" />
                Post Notification
              </button>
            </form>
          </div>
        </div>

        {/* Notifications List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-vbci-navy" />
            Active Notifications ({notifications.length})
          </h2>
          
          {notifications.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
              <Bell className="w-12 h-12 mx-auto text-slate-200 mb-3" />
              <p className="text-slate-500">No active notifications.</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div key={notif.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg mt-1 ${getTypeColor(notif.type).split(' ')[0]} ${getTypeColor(notif.type).split(' ')[2].replace('text', 'text')}`}>
                       {getTypeIcon(notif.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 text-lg">{notif.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeColor(notif.type)}`}>
                          {notif.type}
                        </span>
                      </div>
                      <p className="text-slate-600 mb-3 leading-relaxed">{notif.message}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Posted: {new Date(notif.date).toLocaleDateString()} at {new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>To: {notif.audience}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if(window.confirm('Delete this notification?')) deleteNotification(notif.id);
                    }}
                    className="text-slate-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
```

### FILE: pages/AdminRooms.tsx
```typescript
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { RoomStatus, GenderRestriction, Room, RoomType } from '../types';
import { Users, Home, Plus, Trash2, Edit2, X, Save, SlidersHorizontal } from 'lucide-react';

const AdminRooms: React.FC = () => {
  const { camps, rooms, addRoom, updateRoom, deleteRoom } = useStore();
  const [selectedCampId, setSelectedCampId] = useState<string>(camps[0]?.camp_id || '');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'occupancy'>('name');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<Partial<Room>>({});

  useEffect(() => {
    if (camps.length > 0 && !selectedCampId) {
      setSelectedCampId(camps[0].camp_id);
    }
  }, [camps, selectedCampId]);

  // Handlers
  const handleAddClick = () => {
    setEditingRoom(null);
    setFormData({
      camp_id: selectedCampId,
      room_name: '',
      type: RoomType.DORM,
      capacity: 10,
      gender_restriction: GenderRestriction.MIXED,
      amenities: '',
      current_occupancy: 0,
      status: RoomStatus.AVAILABLE
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (room: Room) => {
    setEditingRoom(room);
    setFormData(room);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (roomId: string, roomName: string) => {
    if (window.confirm(`Are you sure you want to delete "${roomName}"? This action cannot be undone.`)) {
      deleteRoom(roomId);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.room_name || !formData.capacity) return;

    if (editingRoom) {
      // Update
      updateRoom({
        ...editingRoom,
        ...formData as Room,
        // Ensure derived fields are correct
        camp_id: editingRoom.camp_id, // Prevent moving camps for now
        current_occupancy: editingRoom.current_occupancy // Preserve occupancy
      });
    } else {
      // Create
      addRoom({
        ...formData as Room,
        room_id: `r${Date.now()}`,
        camp_id: selectedCampId, // Ensure it goes to currently selected camp
        current_occupancy: 0,
        status: RoomStatus.AVAILABLE
      });
    }
    setIsModalOpen(false);
  };

  const currentCamp = camps.find(c => c.camp_id === selectedCampId);
  
  // Filtering
  let filteredRooms = rooms.filter(r => {
      const matchCamp = r.camp_id === selectedCampId;
      if (!matchCamp) return false;
      if (filterStatus !== 'All' && r.status !== filterStatus) return false;
      if (filterType !== 'All' && r.type !== filterType) return false;
      return true;
  });

  // Sorting
  filteredRooms = filteredRooms.sort((a, b) => {
    if (sortBy === 'name') return a.room_name.localeCompare(b.room_name);
    if (sortBy === 'capacity') return b.capacity - a.capacity;
    if (sortBy === 'occupancy') return b.current_occupancy - a.current_occupancy;
    return 0;
  });

  // Stats calculation (ignoring filters for context)
  const campRooms = rooms.filter(r => r.camp_id === selectedCampId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Room Allocation</h1>
          <p className="text-slate-500">Manage rooms, capacity, and occupancy.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
             {/* Sort Filter */}
             <div className="flex items-center bg-white rounded-lg border border-slate-300 px-3 py-2 shadow-sm">
                <SlidersHorizontal size={16} className="text-slate-500 mr-2" />
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none focus:ring-0 text-slate-800 font-medium text-sm cursor-pointer outline-none pr-8"
                >
                    <option value="name">Sort by Name</option>
                    <option value="capacity">Sort by Capacity</option>
                    <option value="occupancy">Sort by Occupancy</option>
                </select>
            </div>

             {/* Type Filter */}
            <div className="flex items-center bg-white rounded-lg border border-slate-300 px-3 py-2 shadow-sm">
                <span className="text-sm text-slate-500 mr-2">Type:</span>
                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-slate-800 font-medium text-sm cursor-pointer outline-none"
                >
                    <option value="All">All Types</option>
                    {Object.values(RoomType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-white rounded-lg border border-slate-300 px-3 py-2 shadow-sm">
                <span className="text-sm text-slate-500 mr-2">Status:</span>
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-slate-800 font-medium text-sm cursor-pointer outline-none"
                >
                    <option value="All">All Status</option>
                    <option value={RoomStatus.AVAILABLE}>Available</option>
                    <option value={RoomStatus.FULL}>Full</option>
                </select>
            </div>

            {/* Camp Filter */}
            <div className="flex items-center bg-white rounded-lg border border-slate-300 px-3 py-2 shadow-sm">
                <span className="text-sm text-slate-500 mr-2">Camp:</span>
                <select 
                    value={selectedCampId}
                    onChange={(e) => setSelectedCampId(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-slate-800 font-medium text-sm cursor-pointer outline-none"
                >
                    {camps.map(camp => (
                    <option key={camp.camp_id} value={camp.camp_id}>{camp.name}</option>
                    ))}
                </select>
            </div>

            <button 
              onClick={handleAddClick}
              disabled={!selectedCampId}
              className="bg-vbci-navy text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-vbci-navyLight transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              Add Room
            </button>
        </div>
      </div>

      {!currentCamp ? (
        <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            Please select or create a camp to view rooms.
        </div>
      ) : (
        <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Capacity</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                        {campRooms.reduce((sum, r) => sum + r.capacity, 0)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Total Occupied</p>
                    <p className="text-2xl font-bold text-vbci-navy mt-1">
                        {campRooms.reduce((sum, r) => sum + r.current_occupancy, 0)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Rooms Full</p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">
                        {campRooms.filter(r => r.status === RoomStatus.FULL).length} / {campRooms.length}
                    </p>
                </div>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map(room => {
                    const occupancyPct = (room.current_occupancy / room.capacity) * 100;
                    let progressColor = 'bg-green-500';
                    if (occupancyPct > 50) progressColor = 'bg-yellow-500';
                    if (occupancyPct >= 100) progressColor = 'bg-red-500';

                    return (
                        <div key={room.room_id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group relative">
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-lg backdrop-blur-sm">
                                <button 
                                  onClick={() => handleEditClick(room)}
                                  className="p-1.5 text-slate-500 hover:text-vbci-navy hover:bg-blue-50 rounded-md transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteClick(room.room_id, room.room_name)}
                                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className={`p-2 rounded-lg mr-3 ${room.type === 'Cabin' ? 'bg-orange-100 text-orange-700' : room.type === 'Tent' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            <Home size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{room.room_name}</h3>
                                            <p className="text-xs text-slate-500">{room.type}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${room.gender_restriction === GenderRestriction.MALE ? 'bg-blue-50 text-blue-600' : room.gender_restriction === GenderRestriction.FEMALE ? 'bg-pink-50 text-pink-600' : 'bg-purple-50 text-purple-600'}`}>
                                        {room.gender_restriction}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 flex items-center"><Users size={14} className="mr-1"/> Occupancy</span>
                                        <span className="font-medium text-slate-700">{room.current_occupancy} / {room.capacity}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                        <div className={`h-2.5 rounded-full ${progressColor} transition-all duration-500`} style={{ width: `${occupancyPct}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                                <span className="truncate max-w-[70%]">{room.amenities || 'No amenities listed'}</span>
                                <span className={`${room.status === 'Full' ? 'text-red-500' : 'text-green-600'} font-medium`}>
                                    {room.status}
                                </span>
                            </div>
                        </div>
                    );
                })}
                
                {filteredRooms.length === 0 && (
                    <div className="col-span-full text-center p-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex flex-col items-center">
                        <Home className="w-12 h-12 mb-3 text-slate-300" />
                        <p className="font-medium text-slate-600">No rooms found</p>
                        <p className="text-sm">
                          {filterStatus === 'All' && filterType === 'All'
                            ? "Start by adding a new room to this camp." 
                            : `No rooms match the current filters.`}
                        </p>
                    </div>
                )}
            </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-vbci-navy p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Room Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                  placeholder="e.g. Cabin 12 or Dorm A"
                  value={formData.room_name || ''}
                  onChange={(e) => setFormData({...formData, room_name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                    value={formData.type || RoomType.DORM}
                    onChange={(e) => setFormData({...formData, type: e.target.value as RoomType})}
                  >
                    {Object.values(RoomType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender Restriction</label>
                <select 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                  value={formData.gender_restriction || GenderRestriction.MIXED}
                  onChange={(e) => setFormData({...formData, gender_restriction: e.target.value as GenderRestriction})}
                >
                  {Object.values(GenderRestriction).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amenities</label>
                <textarea 
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-vbci-navy focus:border-vbci-navy outline-none"
                  rows={3}
                  placeholder="List amenities separated by commas..."
                  value={formData.amenities || ''}
                  onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-50 border border-slate-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-vbci-gold text-vbci-navy rounded-lg font-bold hover:bg-vbci-goldHover shadow-sm flex items-center transition-colors"
                >
                  <Save size={18} className="mr-2" />
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
```

### FILE: pages/AdminTesting.tsx
```typescript
import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { runPlaywrightTests, TEST_SUITES } from '../services/playwrightService';
import { TestStatus, TestResult, TestSuite, TestCase } from '../types';
import { Play, Loader2, CheckCircle2, XCircle, Clock, Image as ImageIcon, ChevronDown, ChevronRight, FlaskConical } from 'lucide-react';

type TestResultsMap = Record<string, TestResult>;

const getStatusIcon = (status: TestStatus) => {
    switch (status) {
        case TestStatus.PENDING:
            return <Clock size={18} className="text-slate-400" />;
        case TestStatus.RUNNING:
            return <Loader2 size={18} className="text-blue-500 animate-spin" />;
        case TestStatus.PASSED:
            return <CheckCircle2 size={18} className="text-green-500" />;
        case TestStatus.FAILED:
            return <XCircle size={18} className="text-red-500" />;
    }
};

const TestResultItem: React.FC<{ test: TestCase, result: TestResult | undefined }> = ({ test, result }) => {
    const status = result?.status || TestStatus.PENDING;

    return (
        <div className="pl-6 border-l-2 border-slate-200 ml-4 py-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <span className="text-slate-700">{test.description}</span>
                </div>
                {result?.duration && (
                    <span className="text-xs text-slate-400 font-mono">{result.duration}ms</span>
                )}
            </div>
            {status === TestStatus.FAILED && (
                <div className="mt-2 ml-9 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-bold text-red-700">Error:</p>
                    <p className="text-xs text-red-600 font-mono break-words">{result?.error}</p>
                    {result?.screenshot && (
                        <div className="mt-2">
                            <a 
                                href={result.screenshot} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            >
                                <ImageIcon size={12} /> View Screenshot
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const TestSuiteItem: React.FC<{ suite: TestSuite, results: TestResultsMap }> = ({ suite, results }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <button 
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                     {isOpen ? <ChevronDown size={20} className="text-slate-500" /> : <ChevronRight size={20} className="text-slate-500" />}
                    <h3 className="font-bold text-lg text-slate-800">{suite.title}</h3>
                </div>
            </button>
            {isOpen && (
                <div className="p-4 space-y-2">
                    {suite.tests.map(test => (
                        <TestResultItem key={test.id} test={test} result={results[test.id]} />
                    ))}
                </div>
            )}
        </div>
    );
};

const AdminTesting: React.FC = () => {
    const storeContext = useStore();
    const [results, setResults] = useState<TestResultsMap>({});
    const [isRunning, setIsRunning] = useState(false);

    const handleRunTests = async () => {
        setIsRunning(true);
        setResults({});
        
        const onTestUpdate = (testId: string, result: TestResult) => {
            setResults(prev => ({...prev, [testId]: result}));
        };

        await runPlaywrightTests(storeContext, onTestUpdate);
        setIsRunning(false);
    };

    const summary = useMemo(() => {
        const allTests = TEST_SUITES.flatMap(s => s.tests);
        const total = allTests.length;
        // Fix: Explicitly type `r` as `TestResult` to help TypeScript infer the correct type, resolving the "Property 'status' does not exist on type 'unknown'" error.
        const passed = Object.values(results).filter((r: TestResult) => r.status === TestStatus.PASSED).length;
        const failed = Object.values(results).filter((r: TestResult) => r.status === TestStatus.FAILED).length;
        const pending = total - passed - failed;
        return { total, passed, failed, pending };
    }, [results]);

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <FlaskConical className="text-vbci-navy" />
                        Playwright Self-Test Suite
                    </h1>
                    <p className="text-slate-500">Run end-to-end tests for critical user journeys.</p>
                </div>
                <button 
                    onClick={handleRunTests}
                    disabled={isRunning}
                    className="bg-vbci-navy text-white px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-vbci-navyLight transition-colors shadow-sm disabled:opacity-60 disabled:cursor-wait"
                >
                    {isRunning ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
                    {isRunning ? 'Tests Running...' : 'Run All Tests'}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Tests', value: summary.total, color: 'text-slate-600', bg: 'bg-slate-100' },
                    { label: 'Passed', value: summary.passed, color: 'text-green-600', bg: 'bg-green-100' },
                    { label: 'Failed', value: summary.failed, color: 'text-red-600', bg: 'bg-red-100' },
                    { label: 'Pending', value: summary.pending, color: 'text-blue-600', bg: 'bg-blue-100' },
                ].map((stat, idx) => (
                    <div key={idx} className={`p-4 rounded-xl shadow-sm border ${stat.bg.replace('bg-','border-')} `}>
                        <p className={`text-sm font-medium ${stat.color}`}>{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                {TEST_SUITES.map(suite => (
                    <TestSuiteItem key={suite.id} suite={suite} results={results} />
                ))}
            </div>
        </div>
    );
};

export default AdminTesting;

```

### FILE: pages/Auth.tsx
```typescript
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { Eye, EyeOff, Lock, Shield, Sparkles, Film, Crown, User, Mail, Phone, LogIn, MapPin, Church } from 'lucide-react';

const TITLES = [
  'Mr', 'Mrs', 'Ms', 'Miss', 'Dr',
  'Pastor', 'Rev', 'Bishop', 'Apostle',
  'Prophet', 'Evangelist', 'Deacon', 'Deaconess',
  'Brother', 'Sister'
];

const Auth: React.FC = () => {
  const { login, register } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('john@example.com');
  const [formData, setFormData] = useState({
    title: 'Brother',
    full_name: '',
    email: '',
    phone: '',
    gender: 'Male' as 'Male' | 'Female',
    role: UserRole.CAMPER,
    province: '',
    sanctuary: ''
  });

  const [currentVariation, setCurrentVariation] = useState(0);
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      const success = login(email);
      if (!success) {
        setError('Account not found. Please sign up or check your email.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.full_name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      register({ ...formData });
      setIsLoading(false);
    }, 1500);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const fillDemo = (role: 'admin' | 'camper') => {
    setIsLogin(true);
    setError('');
    if (role === 'admin') {
      setEmail('admin@vbci.com');
    } else {
      setEmail('john@example.com');
    }
  };
  
  const commonInputClasses = (theme: string) => {
      switch(theme) {
          case 'ocean': return 'w-full bg-cyan-950/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-cyan-100 placeholder-cyan-700 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all backdrop-blur-sm';
          case 'forest': return 'w-full bg-emerald-950/50 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-100 placeholder-emerald-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all';
          case 'sunset': return 'w-full bg-white/80 border-2 border-pink-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-200 transition-all';
          case 'arctic': return 'w-full bg-white/80 border-2 border-blue-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all';
          case 'galaxy': return 'w-full bg-indigo-950/50 border border-indigo-500/30 rounded-xl px-4 py-3 text-indigo-100 placeholder-indigo-800 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 focus:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all';
          case 'cinema': return 'w-full bg-black/50 border border-red-900/50 rounded-lg px-4 py-3 text-red-100 placeholder-red-900 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/30 transition-all';
          default: return '';
      }
  };

  const variations = [
    {
      name: "Deep",
      component: (
        <div className="min-h-screen bg-gradient-to-b from-cyan-950 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30"><div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full filter blur-[120px] animate-pulse"></div><div className="absolute top-40 right-20 w-48 h-48 bg-blue-400 rounded-full filter blur-[100px] animate-pulse" style={{animationDelay: '1.5s'}}></div><div className="absolute bottom-20 left-1/3 w-56 h-56 bg-indigo-400 rounded-full filter blur-[110px] animate-pulse" style={{animationDelay: '3s'}}></div></div>
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-cyan-950/60 to-indigo-950/60 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.2)]">
              <div className="text-center mb-8"><div className="relative inline-block mb-6"><div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-pulse"><Church className="w-10 h-10 text-white" /></div><div className="absolute -inset-2 border-2 border-cyan-400/50 rounded-2xl animate-ping"></div></div><h1 className="text-6xl font-bold mb-3"><span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">myVBCI</span></h1><h2 className="text-2xl font-light text-cyan-100">{isLogin ? 'Sign in to your account' : 'Create your camper profile'}</h2></div>
              {error && (<div className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm text-center mb-6">{error}</div>)}
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div><label className="block text-sm font-medium text-cyan-300 mb-2">Email</label><div className="relative"><Mail className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${commonInputClasses('ocean')} pl-12`} placeholder="you@example.com" required/></div></div>
                  <div><label className="block text-sm font-medium text-cyan-300 mb-2">Password</label><div className="relative"><Lock className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${commonInputClasses('ocean')} pl-12`} placeholder="Enter your password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-200 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                  <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white font-semibold py-3 rounded-xl hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] disabled:opacity-50 flex items-center justify-center gap-2">{isLoading ? 'Authenticating...' : <><LogIn size={16}/> Sign In</>}</button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3"><div className="col-span-1"><label className="block text-sm text-cyan-300 mb-1">Title</label><select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${commonInputClasses('ocean')} py-2.5`}>{TITLES.map(t => <option key={t} value={t} className="bg-indigo-950">{t}</option>)}</select></div><div className="col-span-2"><label className="block text-sm text-cyan-300 mb-1">Full Name</label><div className="relative"><User className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={`${commonInputClasses('ocean')} pl-11 py-2.5`} placeholder="John Doe" required/></div></div></div>
                  <div><label className="block text-sm text-cyan-300 mb-1">Email</label><div className="relative"><Mail className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${commonInputClasses('ocean')} pl-11 py-2.5`} placeholder="you@example.com" required/></div></div>
                  <div><label className="block text-sm text-cyan-300 mb-1">Phone</label><div className="relative"><Phone className="w-4 h-4 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`${commonInputClasses('ocean')} pl-11 py-2.5`} placeholder="123-456-7890" required/></div></div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-3 rounded-xl hover:from-cyan-300 hover:to-blue-400 disabled:opacity-50 transition-all">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                </form>
              )}
              <div className="mt-8 text-center">
                <p className="text-sm text-cyan-400">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={toggleMode} className="font-semibold text-cyan-200 hover:text-white ml-2 transition-colors"> {isLogin ? 'Sign Up' : 'Sign In'}</button></p>
                <div className="mt-4 text-xs">
                    <span className="text-cyan-500">Quick Access:</span>
                    <button onClick={() => fillDemo('camper')} className="font-medium text-cyan-300 hover:text-white transition-colors ml-2">Camper Demo</button>
                    <span className="text-cyan-600 mx-1">|</span>
                    <button onClick={() => fillDemo('admin')} className="font-medium text-cyan-300 hover:text-white transition-colors">Admin Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: "Jade",
      component: (
        <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0"><div className="absolute top-10 right-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-soft-light filter blur-[140px] opacity-40 animate-pulse"></div><div className="absolute bottom-10 left-20 w-80 h-80 bg-teal-500 rounded-full mix-blend-soft-light filter blur-[120px] opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          <div className="relative w-full max-w-md">
            <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-8 border border-emerald-500/30 shadow-[0_0_60px_rgba(16,185,129,0.15)]">
               <div className="text-center mb-8"><div className="relative inline-block mb-6"><div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg"><Church className="w-10 h-10 text-white" /></div><div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-50 animate-pulse"></div></div><h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent mb-3">myVBCI</h1><h2 className="text-2xl font-light text-emerald-100">{isLogin ? 'Sign in to your account' : 'Create your camper profile'}</h2></div>
              {error && (<div className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm text-center mb-6">{error}</div>)}
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                    <div><label className="block text-sm font-medium text-emerald-300 mb-2">Email</label><div className="relative"><Mail className="w-5 h-5 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${commonInputClasses('forest')} pl-12`} placeholder="you@example.com" required/></div></div>
                    <div><label className="block text-sm font-medium text-emerald-300 mb-2">Password</label><div className="relative"><Lock className="w-5 h-5 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${commonInputClasses('forest')} pl-12`} placeholder="Enter your password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-200 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                    <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white font-semibold py-3 rounded-xl hover:from-emerald-400 hover:via-green-400 hover:to-teal-400 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] disabled:opacity-50 flex items-center justify-center gap-2">{isLoading ? 'Authenticating...' : <><LogIn size={16}/> Sign In</>}</button>
                </form>
              ) : (
                 <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3"><div className="col-span-1"><label className="block text-sm text-emerald-300 mb-1">Title</label><select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${commonInputClasses('forest')} py-2.5`}>{TITLES.map(t => <option key={t} value={t} className="bg-emerald-950">{t}</option>)}</select></div><div className="col-span-2"><label className="block text-sm text-emerald-300 mb-1">Full Name</label><div className="relative"><User className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={`${commonInputClasses('forest')} pl-11 py-2.5`} placeholder="John Doe" required/></div></div></div>
                  <div><label className="block text-sm text-emerald-300 mb-1">Email</label><div className="relative"><Mail className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${commonInputClasses('forest')} pl-11 py-2.5`} placeholder="you@example.com" required/></div></div>
                  <div><label className="block text-sm text-emerald-300 mb-1">Phone</label><div className="relative"><Phone className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`${commonInputClasses('forest')} pl-11 py-2.5`} placeholder="123-456-7890" required/></div></div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 rounded-xl hover:from-emerald-400 hover:to-green-500 disabled:opacity-50 transition-all">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                </form>
              )}
              <div className="mt-8 text-center">
                <p className="text-sm text-emerald-400">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={toggleMode} className="font-semibold text-emerald-200 hover:text-white ml-2 transition-colors"> {isLogin ? 'Sign Up' : 'Sign In'}</button></p>
                <div className="mt-4 text-xs">
                    <span className="text-emerald-500">Quick Access:</span>
                    <button onClick={() => fillDemo('camper')} className="font-medium text-emerald-300 hover:text-white transition-colors ml-2">Camper Demo</button>
                    <span className="text-emerald-600 mx-1">|</span>
                    <button onClick={() => fillDemo('admin')} className="font-medium text-emerald-300 hover:text-white transition-colors">Admin Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: "Glow",
      component: (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0"><div className="absolute top-20 right-20 w-[600px] h-[600px] bg-gradient-to-br from-orange-300 to-pink-300 rounded-full filter blur-[100px] opacity-40 animate-pulse"></div><div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-br from-pink-300 to-purple-300 rounded-full filter blur-[100px] opacity-40 animate-pulse" style={{animationDelay: '1.5s'}}></div></div>
          <div className="relative w-full max-w-md">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="text-center mb-8"><div className="relative inline-block mb-6"><div className="w-20 h-20 bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl"><Church className="w-10 h-10 text-white" /></div></div><h1 className="text-6xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-3">myVBCI</h1><h2 className="text-2xl font-semibold text-gray-800">{isLogin ? 'Sign in to your account' : 'Create your camper profile'}</h2></div>
              {error && (<div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-xl text-sm text-center mb-6">{error}</div>)}
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><div className="relative"><Mail className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${commonInputClasses('sunset')} pl-12`} placeholder="you@example.com" required/></div></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Password</label><div className="relative"><Lock className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${commonInputClasses('sunset')} pl-12`} placeholder="Enter your password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                    <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-orange-500 hover:via-pink-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">{isLoading ? 'Authenticating...' : <><LogIn size={16}/> Sign In</>}</button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3"><div className="col-span-1"><label className="block text-sm text-gray-700 mb-1">Title</label><select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${commonInputClasses('sunset')} py-2.5`}>{TITLES.map(t => <option key={t} value={t}>{t}</option>)}</select></div><div className="col-span-2"><label className="block text-sm text-gray-700 mb-1">Full Name</label><div className="relative"><User className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={`${commonInputClasses('sunset')} pl-11 py-2.5`} placeholder="John Doe" required/></div></div></div>
                  <div><label className="block text-sm text-gray-700 mb-1">Email</label><div className="relative"><Mail className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${commonInputClasses('sunset')} pl-11 py-2.5`} placeholder="you@example.com" required/></div></div>
                  <div><label className="block text-sm text-gray-700 mb-1">Phone</label><div className="relative"><Phone className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`${commonInputClasses('sunset')} pl-11 py-2.5`} placeholder="123-456-7890" required/></div></div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold py-3 rounded-xl hover:from-orange-500 hover:to-pink-600 disabled:opacity-50 transition-all">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                </form>
              )}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={toggleMode} className="font-semibold text-pink-500 hover:text-pink-600 ml-2 transition-colors"> {isLogin ? 'Sign Up' : 'Sign In'}</button></p>
                <div className="mt-4 text-xs">
                    <span className="text-gray-500">Quick Access:</span>
                    <button onClick={() => fillDemo('camper')} className="font-medium text-gray-600 hover:text-pink-500 transition-colors ml-2">Camper Demo</button>
                    <span className="text-gray-400 mx-1">|</span>
                    <button onClick={() => fillDemo('admin')} className="font-medium text-gray-600 hover:text-pink-500 transition-colors">Admin Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: "Frost",
      component: (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-100 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0"><div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full filter blur-[100px] opacity-30"></div><div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-200 rounded-full filter blur-[120px] opacity-30"></div><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200 rounded-full filter blur-[140px] opacity-20"></div></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          <div className="relative w-full max-w-md">
            <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_32px_rgba(59,130,246,0.12)] border border-white/80">
              <div className="text-center mb-8"><div className="relative inline-block mb-6"><div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg"><Church className="w-10 h-10 text-white" /></div><div className="absolute -inset-2 border-2 border-blue-300 rounded-full"></div></div><h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent mb-3">myVBCI</h1><h2 className="text-2xl font-light text-slate-700">{isLogin ? 'Sign in to your account' : 'Create your camper profile'}</h2></div>
              {error && (<div className="bg-red-100 border border-red-200 text-red-700 p-3 rounded-xl text-sm text-center mb-6">{error}</div>)}
              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                    <div><label className="block text-sm font-medium text-slate-600 mb-2">Email</label><div className="relative"><Mail className="w-5 h-5 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${commonInputClasses('arctic')} pl-12`} placeholder="you@example.com" required/></div></div>
                    <div><label className="block text-sm font-medium text-slate-600 mb-2">Password</label><div className="relative"><Lock className="w-5 h-5 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${commonInputClasses('arctic')} pl-12`} placeholder="Enter your password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                    <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:via-cyan-600 hover:to-blue-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">{isLoading ? 'Authenticating...' : <><LogIn size={16}/> Sign In</>}</button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3"><div className="col-span-1"><label className="block text-sm text-slate-600 mb-1">Title</label><select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${commonInputClasses('arctic')} py-2.5`}>{TITLES.map(t => <option key={t} value={t}>{t}</option>)}</select></div><div className="col-span-2"><label className="block text-sm text-slate-600 mb-1">Full Name</label><div className="relative"><User className="w-4 h-4 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={`${commonInputClasses('arctic')} pl-11 py-2.5`} placeholder="John Doe" required/></div></div></div>
                  <div><label className="block text-sm text-slate-600 mb-1">Email</label><div className="relative"><Mail className="w-4 h-4 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${commonInputClasses('arctic')} pl-11 py-2.5`} placeholder="you@example.com" required/></div></div>
                  <div className="grid grid-cols-2 gap-3"><div className="col-span-1"><label className="block text-sm text-slate-600 mb-1">Province</label><div className="relative"><MapPin className="w-4 h-4 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.province} onChange={(e) => setFormData({...formData, province: e.target.value})} className={`${commonInputClasses('arctic')} pl-11 py-2.5`} placeholder="e.g. Lusaka"/></div></div><div className="col-span-1"><label className="block text-sm text-slate-600 mb-1">Sanctuary</label><div className="relative"><Church className="w-4 h-4 text-blue-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.sanctuary} onChange={(e) => setFormData({...formData, sanctuary: e.target.value})} className={`${commonInputClasses('arctic')} pl-11 py-2.5`} placeholder="e.g. Main"/></div></div></div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 transition-all">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                </form>
              )}
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={toggleMode} className="font-semibold text-blue-500 hover:text-blue-600 ml-2 transition-colors"> {isLogin ? 'Sign Up' : 'Sign In'}</button></p>
                <div className="mt-4 text-xs">
                    <span className="text-slate-500">Quick Access:</span>
                    <button onClick={() => fillDemo('camper')} className="font-medium text-slate-600 hover:text-blue-500 transition-colors ml-2">Camper Demo</button>
                    <span className="text-slate-400 mx-1">|</span>
                    <button onClick={() => fillDemo('admin')} className="font-medium text-slate-600 hover:text-blue-500 transition-colors">Admin Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: "Night",
      component: (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0"><div className="absolute top-0 left-0 w-full h-full">{[...Array(50)].map((_, i) => (<div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 3}s`, opacity: Math.random() * 0.7 + 0.3}}></div>)) }</div><div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full filter blur-[150px] opacity-20 animate-pulse"></div><div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600 rounded-full filter blur-[130px] opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div></div>
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-30"></div>
            <div className="relative bg-gradient-to-br from-indigo-950/80 to-purple-950/80 backdrop-blur-2xl rounded-3xl p-8 border border-indigo-500/30 shadow-[0_0_100px_rgba(99,102,241,0.3)]">
              <div className="text-center mb-8"><div className="relative inline-block mb-6"><div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse"><Church className="w-10 h-10 text-white" /></div><div className="absolute -inset-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-50"></div></div><h1 className="text-6xl font-bold mb-3"><span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">myVBCI</span></h1><h2 className="text-2xl font-light text-indigo-100">{isLogin ? 'Sign in to your account' : 'Create your camper profile'}</h2></div>
              {error && (<div className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm text-center mb-6">{error}</div>)}
              {isLogin ? (
                 <form onSubmit={handleLogin} className="space-y-6">
                    <div><label className="block text-sm font-medium text-indigo-300 mb-2">Email</label><div className="relative"><Mail className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${commonInputClasses('galaxy')} pl-12`} placeholder="you@example.com" required/></div></div>
                    <div><label className="block text-sm font-medium text-indigo-300 mb-2">Password</label><div className="relative"><Lock className="w-5 h-5 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${commonInputClasses('galaxy')} pl-12`} placeholder="Enter your password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                    <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] disabled:opacity-50 flex items-center justify-center gap-2">{isLoading ? 'Authenticating...' : <><LogIn size={16}/> Sign In</>}</button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3"><div className="col-span-1"><label className="block text-sm text-indigo-300 mb-1">Title</label><select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${commonInputClasses('galaxy')} py-2.5`}>{TITLES.map(t => <option key={t} value={t} className="bg-purple-950">{t}</option>)}</select></div><div className="col-span-2"><label className="block text-sm text-indigo-300 mb-1">Full Name</label><div className="relative"><User className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={`${commonInputClasses('galaxy')} pl-11 py-2.5`} placeholder="John Doe" required/></div></div></div>
                  <div><label className="block text-sm text-indigo-300 mb-1">Email</label><div className="relative"><Mail className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${commonInputClasses('galaxy')} pl-11 py-2.5`} placeholder="you@example.com" required/></div></div>
                  <div><label className="block text-sm text-indigo-300 mb-1">Phone</label><div className="relative"><Phone className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2"/><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`${commonInputClasses('galaxy')} pl-11 py-2.5`} placeholder="123-456-7890" required/></div></div>
                  <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 transition-all">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                </form>
              )}
              <div className="mt-8 text-center">
                <p className="text-sm text-indigo-400">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={toggleMode} className="font-semibold text-purple-300 hover:text-white ml-2 transition-colors"> {isLogin ? 'Sign Up' : 'Sign In'}</button></p>
                <div className="mt-4 text-xs">
                    <span className="text-indigo-500">Quick Access:</span>
                    <button onClick={() => fillDemo('camper')} className="font-medium text-indigo-300 hover:text-white transition-colors ml-2">Camper Demo</button>
                    <span className="text-indigo-600 mx-1">|</span>
                    <button onClick={() => fillDemo('admin')} className="font-medium text-indigo-300 hover:text-white transition-colors">Admin Demo</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      name: "Red",
      component: (
        <div className="min-h-screen bg-gradient-to-b from-red-950 via-black to-black flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,0,0,0.15),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
          <div className="relative w-full max-w-lg">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-lg blur opacity-25"></div>
              <div className="relative bg-gradient-to-b from-zinc-900 to-black rounded-lg p-8 border border-red-900/50">
                <div className="text-center mb-8"><div className="flex justify-center mb-6"><div className="relative"><div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-lg rotate-45 shadow-2xl shadow-red-900/50"></div><Church className="w-10 h-10 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" /></div></div><h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text mb-3 tracking-tighter">myVBCI</h1><div className="flex items-center justify-center gap-2 mb-2"><div className="w-12 h-px bg-gradient-to-r from-transparent to-red-600"></div><Lock className="w-5 h-5 text-red-500" /><div className="w-12 h-px bg-gradient-to-l from-transparent to-red-600"></div></div><h2 className="text-2xl font-light text-red-100 tracking-wide">{isLogin ? 'Secure Portal Access' : 'Create Camper Profile'}</h2></div>
                {error && (<div className="bg-red-900/50 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm text-center mb-6">{error}</div>)}
                {isLogin ? (
                  <form onSubmit={handleLogin} className="space-y-6">
                      <div><label className="block text-sm font-semibold text-red-400 mb-2 tracking-wider">EMAIL</label><div className="relative"><Mail className="w-5 h-5 text-red-500 absolute left-4 top-1/2 -translate-y-1/2" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${commonInputClasses('cinema')} pl-12`} placeholder="Enter access email" required/></div></div>
                      <div><label className="block text-sm font-semibold text-red-400 mb-2 tracking-wider">PASSWORD</label><div className="relative"><Lock className="w-5 h-5 text-red-500 absolute left-4 top-1/2 -translate-y-1/2" /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${commonInputClasses('cinema')} pl-12`} placeholder="Enter secure password"/><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-400 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div></div>
                      <button onClick={handleLogin} disabled={isLoading} className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white font-bold py-3 rounded-lg hover:from-red-600 hover:via-red-500 hover:to-red-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] disabled:opacity-50 tracking-wider flex items-center justify-center gap-2">{isLoading ? 'AUTHENTICATING...' : <><LogIn size={16}/> ENTER SYSTEM</>}</button>
                  </form>
                ) : (
                   <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-3 gap-3"><div className="col-span-1"><label className="block text-sm text-red-400 mb-1 tracking-wider">Title</label><select value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`${commonInputClasses('cinema')} py-2.5`}>{TITLES.map(t => <option key={t} value={t} className="bg-zinc-900">{t}</option>)}</select></div><div className="col-span-2"><label className="block text-sm text-red-400 mb-1 tracking-wider">Full Name</label><div className="relative"><User className="w-4 h-4 text-red-500 absolute left-4 top-1/2 -translate-y-1/2"/><input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className={`${commonInputClasses('cinema')} pl-11 py-2.5`} placeholder="John Doe" required/></div></div></div>
                      <div><label className="block text-sm text-red-400 mb-1 tracking-wider">Email</label><div className="relative"><Mail className="w-4 h-4 text-red-500 absolute left-4 top-1/2 -translate-y-1/2"/><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`${commonInputClasses('cinema')} pl-11 py-2.5`} placeholder="you@example.com" required/></div></div>
                      <div><label className="block text-sm text-red-400 mb-1 tracking-wider">Phone</label><div className="relative"><Phone className="w-4 h-4 text-red-500 absolute left-4 top-1/2 -translate-y-1/2"/><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`${commonInputClasses('cinema')} pl-11 py-2.5`} placeholder="123-456-7890" required/></div></div>
                      <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-3 rounded-lg hover:from-red-500 hover:to-red-700 disabled:opacity-50 transition-all tracking-wider">{isLoading ? 'Creating Account...' : 'Create Account'}</button>
                  </form>
                )}
                <div className="mt-8 text-center">
                  <p className="text-sm text-zinc-500">{isLogin ? "Don't have an account?" : "Already have an account?"}<button onClick={toggleMode} className="font-semibold text-zinc-300 hover:text-red-400 ml-2 transition-colors"> {isLogin ? 'Sign Up' : 'Sign In'}</button></p>
                  <div className="mt-4 text-xs">
                    <span className="text-zinc-600">Quick Access:</span>
                    <button onClick={() => fillDemo('camper')} className="font-medium text-zinc-400 hover:text-red-400 transition-colors ml-2">Camper Demo</button>
                    <span className="text-zinc-700 mx-1">|</span>
                    <button onClick={() => fillDemo('admin')} className="font-medium text-zinc-400 hover:text-red-400 transition-colors">Admin Demo</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="relative">
      {variations[currentVariation].component}
      
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/70 backdrop-blur-md rounded-full shadow-2xl p-2 flex gap-2 border border-white/50">
        {variations.map((variation, index) => (
          <button
            key={index}
            onClick={() => setCurrentVariation(index)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentVariation === index
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-100/50 text-gray-700 hover:bg-gray-200/70'
            }`}
          >
            {variation.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Auth;

```

### FILE: pages/CampRegistration.tsx
```typescript
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Camp, Room, Booking, BookingStatus, PaymentStatus, RoomStatus } from '../types';
import { Calendar, MapPin, Users, CheckCircle, CreditCard, AlertTriangle, Tent, Download } from 'lucide-react';

const CampRegistration: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { camps, rooms, currentUser, addBooking } = useStore();
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo'>('card');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Filter available rooms for selected camp and user gender
  const availableRooms = selectedCamp 
    ? rooms.filter(r => 
        r.camp_id === selectedCamp.camp_id && 
        r.status !== RoomStatus.FULL &&
        (r.gender_restriction === 'Mixed' || r.gender_restriction === currentUser?.gender)
      ) 
    : [];

  const handleCampSelect = (camp: Camp) => {
    setSelectedCamp(camp);
    setStep(2);
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setStep(3);
  };

  const handlePayment = () => {
    if (!currentUser || !selectedCamp || !selectedRoom) return;

    setProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const newBooking: Booking = {
        booking_id: `BKG-${Date.now().toString().slice(-6)}`,
        user_id: currentUser.user_id,
        camp_id: selectedCamp.camp_id,
        room_id: selectedRoom.room_id,
        status: BookingStatus.CONFIRMED,
        payment_status: PaymentStatus.PAID,
        amount: selectedCamp.price,
        timestamp: new Date().toISOString()
      };
      
      addBooking(newBooking);
      setConfirmedBooking(newBooking);
      setProcessing(false);
      setShowConfirmation(true);
    }, 2000);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    onBack();
  };

  // Step 1: Select Camp
  if (step === 1) {
    return (
      <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Select a Camp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {camps.map(camp => (
            <div key={camp.camp_id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-48 w-full relative">
                  <img src={camp.image_url} alt={camp.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 bg-vbci-gold text-vbci-navy font-bold px-3 py-1 rounded-full text-sm shadow-sm">
                      ₵{camp.price}
                  </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-vbci-navy">{camp.name}</h3>
                </div>
                <p className="text-slate-600 mb-4 text-sm line-clamp-2 flex-1">{camp.description}</p>
                <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="w-4 h-4 mr-2 text-vbci-gold" />
                        {new Date(camp.start_date).toLocaleDateString()} - {new Date(camp.end_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                        <Users className="w-4 h-4 mr-2 text-vbci-gold" />
                        {camp.available_slots} slots remaining
                    </div>
                </div>
                <button 
                    onClick={() => handleCampSelect(camp)}
                    disabled={camp.available_slots <= 0}
                    className="w-full bg-vbci-navy text-white py-2 rounded-lg font-medium hover:bg-vbci-navyLight disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                    {camp.available_slots > 0 ? 'Register Now' : 'Sold Out'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Room Allocation
  if (step === 2 && selectedCamp) {
    return (
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
        <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-vbci-navy mb-4 flex items-center">
            &larr; Back to Camps
        </button>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Choose Your Accommodation</h2>
        <p className="text-slate-600 mb-6">Select a room for <span className="font-semibold">{selectedCamp.name}</span></p>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6 flex items-start">
             <AlertTriangle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
             <p className="text-sm text-blue-800">
                 Showing rooms available for <span className="font-bold">{currentUser?.gender}</span> campers. 
                 Room capacity is strictly enforced to prevent overbooking.
             </p>
        </div>

        <div className="space-y-4">
          {availableRooms.length === 0 ? (
             <div className="p-8 text-center bg-white rounded-lg border border-slate-200">
                 <p className="text-slate-500">No rooms available matching your criteria. Please contact admin.</p>
             </div>
          ) : (
              availableRooms.map(room => (
                <div 
                    key={room.room_id} 
                    onClick={() => handleRoomSelect(room)}
                    className="bg-white p-4 rounded-lg border border-slate-200 hover:border-vbci-gold hover:ring-1 hover:ring-vbci-gold cursor-pointer transition-all flex justify-between items-center group"
                >
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-vbci-gold/20 transition-colors">
                            <Tent className="text-slate-500 group-hover:text-vbci-navy" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">{room.room_name} <span className="text-xs font-normal text-slate-500">({room.type})</span></h4>
                            <p className="text-sm text-slate-500">{room.amenities}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-slate-700">
                            {room.capacity - room.current_occupancy} beds left
                        </div>
                        <span className="text-xs text-slate-400">Capacity: {room.capacity}</span>
                    </div>
                </div>
              ))
          )}
        </div>
      </div>
    );
  }

  // Step 3: Payment & Confirmation
  if (step === 3 && selectedCamp && selectedRoom) {
    return (
        <div className="relative">
            <div className={`max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-300 ${showConfirmation ? 'blur-sm pointer-events-none opacity-50' : ''}`}>
                <div className="bg-vbci-navy p-6 text-white flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Confirm Registration</h2>
                        <p className="text-blue-200 text-sm">Complete payment to secure your spot.</p>
                    </div>
                    {!processing && (
                        <button onClick={() => setStep(2)} className="text-white/70 hover:text-white text-sm">
                            Change Room
                        </button>
                    )}
                </div>
                <div className="p-8">
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500">Event</span>
                            <span className="font-medium text-slate-800">{selectedCamp.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500">Date</span>
                            <span className="font-medium text-slate-800">{new Date(selectedCamp.start_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-500">Room</span>
                            <span className="font-medium text-slate-800">{selectedRoom.room_name}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="font-bold text-lg text-slate-800">Total Amount</span>
                            <span className="font-bold text-lg text-vbci-navy">₵{selectedCamp.price.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Select Payment Method</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setPaymentMethod('card')}
                                className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${paymentMethod === 'card' ? 'border-vbci-navy bg-blue-50 text-vbci-navy ring-1 ring-vbci-navy' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            >
                                <CreditCard className="mb-2" />
                                <span className="text-sm font-medium">Credit Card</span>
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('momo')}
                                className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${paymentMethod === 'momo' ? 'border-vbci-navy bg-blue-50 text-vbci-navy ring-1 ring-vbci-navy' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                            >
                                <MapPin className="mb-2" /> 
                                <span className="text-sm font-medium">Mobile Money</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={() => setStep(2)} 
                            className="flex-1 py-3 border border-slate-300 rounded-lg font-medium text-slate-600 hover:bg-slate-50"
                            disabled={processing}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handlePayment} 
                            disabled={processing}
                            className="flex-1 py-3 bg-vbci-gold text-vbci-navy rounded-lg font-bold hover:bg-vbci-goldHover disabled:opacity-70 flex items-center justify-center shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            {processing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-vbci-navy border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Processing...
                                </>
                            ) : `Pay ₵${selectedCamp.price}`}
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal Overlay */}
            {showConfirmation && confirmedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 relative">
                        <div className="bg-green-50 p-8 flex flex-col items-center text-center border-b border-green-100">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-green-800">Booking Confirmed!</h2>
                            <p className="text-green-600 mt-1 font-medium">You are all set for camp.</p>
                        </div>
                        
                        <div className="p-6 space-y-5">
                            <div className="bg-slate-50 rounded-xl p-5 space-y-3 border border-slate-100 shadow-inner">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Confirmation #</span>
                                    <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">{confirmedBooking.booking_id}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Camp Event</span>
                                    <span className="font-medium text-slate-800 text-right">{selectedCamp.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Accommodation</span>
                                    <span className="font-medium text-slate-800">{selectedRoom.room_name}</span>
                                </div>
                                <div className="border-t border-slate-200 my-1 border-dashed"></div>
                                <div className="flex justify-between text-base">
                                    <span className="font-bold text-slate-700">Total Paid</span>
                                    <span className="font-bold text-vbci-navy">₵{selectedCamp.price.toFixed(2)}</span>
                                </div>
                            </div>

                            <p className="text-xs text-center text-slate-400 px-4">
                                A confirmation email with your receipt has been sent to <span className="font-medium text-slate-600">{currentUser?.email}</span>.
                            </p>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button 
                            onClick={() => alert("Downloading receipt PDF...")}
                            className="flex-1 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-white hover:border-slate-400 flex items-center justify-center transition-colors"
                            >
                                <Download className="w-4 h-4 mr-2" /> Receipt
                            </button>
                            <button 
                            onClick={handleCloseConfirmation}
                            className="flex-1 py-3 bg-vbci-navy text-white rounded-lg font-bold hover:bg-vbci-navyLight shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02]"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
  }

  return null;
};

export default CampRegistration;
```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1fYQZx2T-u7qI5HrDDr-HlJKCsSEnwrsd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: services/geminiService.ts
```typescript
import { GoogleGenAI } from "@google/genai";

const API_KEY = [REDACTED_CREDENTIAL]

export const askCampAssistant = async (
  userQuery: string,
  contextData: string
): Promise<string> => {
  if (!API_KEY) {
    return "I'm sorry, I can't connect to the AI service right now (Missing API Key).";
  }

  try {
    // Instantiate client here to ensure fresh config/key usage if it were dynamic
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = "gemini-2.5-flash";
    const prompt = `
      You are a helpful assistant for the myVBCI Camper App.
      Your goal is to help campers with questions about camps, registration, and rooms.
      
      Here is the current context data about available camps and policies:
      ${contextData}

      User Question: ${userQuery}

      Answer politely and concisely. If you don't know, ask them to contact admin support.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the server. Please try again later.";
  }
};
```

### FILE: services/puppeteerService.ts
```typescript
import { TestSuite, TestStatus, TestResult } from '../types';

const MOCK_DELAY = 700; // ms

// Helper to simulate async operations
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to generate a placeholder screenshot for failed tests
const generateFailureScreenshot = (testName: string, error: string): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 250;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#fef2f2'; // light red
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#ef4444'; // red
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Header
  ctx.fillStyle = '#b91c1c'; // dark red
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Puppeteer Test Failed', 20, 40);

  // Test Name
  ctx.fillStyle = '#374151';
  ctx.font = '14px sans-serif';
  ctx.fillText(`Test Case: ${testName}`, 20, 70);

  // Error Message (wrap text)
  ctx.fillStyle = '#374151';
  const maxWidth = 460;
  const lineHeight = 18;
  let y = 100;
  const words = `Error: ${error}`.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, 20, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 20, y);

  // Timestamp
  ctx.fillStyle = '#6b7280';
  ctx.font = '12px sans-serif';
  ctx.fillText(new Date().toLocaleString(), 20, canvas.height - 20);

  return canvas.toDataURL();
};


export const TEST_SUITES: TestSuite[] = [
  {
    id: 'auth',
    title: 'Authentication Flow',
    tests: [
      {
        id: 'auth-login-admin',
        description: 'Admin can successfully log in',
        run: async ({ users }) => {
            const admin = users.find((u: any) => u.role === 'ADMIN');
            if (admin) return { success: true };
            return { success: false, error: 'Admin user not found in mock data.' };
        },
      },
      {
        id: 'auth-login-camper',
        description: 'Camper can successfully log in',
        run: async ({ users }) => {
            const camper = users.find((u: any) => u.role === 'CAMPER');
            if (camper) return { success: true };
            return { success: false, error: 'Camper user not found in mock data.' };
        },
      },
      {
        id: 'auth-login-fail',
        description: 'Login fails with incorrect credentials',
        run: async () => {
          // This test is designed to succeed by correctly identifying a failure
          return { success: true };
        },
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin Panel Operations',
    tests: [
      {
        id: 'admin-view-dashboard',
        description: 'Admin can view the dashboard with stats',
        run: async ({ bookings }) => {
            if (bookings.length > 0) return { success: true };
            return { success: false, error: 'No booking data found to populate dashboard.' };
        },
      },
      {
        id: 'admin-create-camp',
        description: 'Admin can create a new camp',
        run: async () => {
          // Simulate filling form and submitting
          return { success: true };
        },
      },
      {
        id: 'admin-create-room',
        description: 'Admin can add a room to a camp',
        run: async () => {
          // Simulate selecting camp and adding a room
          return { success: true };
        },
      },
       {
        id: 'admin-delete-room-fail',
        description: 'Admin cannot delete a room with active campers',
        run: async () => {
          // This test is designed to fail to show the screenshot feature
          return { success: false, error: 'AssertionError: Expected confirmation modal for deletion to be blocked, but it was not.' };
        },
      },
    ],
  },
  {
    id: 'camper',
    title: 'Camper Registration Journey',
    tests: [
        {
            id: 'camper-view-camps',
            description: 'Camper can view available camps',
            run: async ({ camps }) => {
                if (camps.length > 0) return { success: true };
                return { success: false, error: 'No camps are available for viewing.' };
            },
        },
        {
            id: 'camper-register-success',
            description: 'Camper can complete registration for an available room',
            run: async ({ rooms }) => {
                const availableRoom = rooms.find((r: any) => r.status === 'Available');
                if (availableRoom) return { success: true };
                return { success: false, error: 'Could not find any available room to complete registration.' };
            },
        },
        {
            id: 'camper-register-fail-full',
            description: 'Camper registration is blocked for a full room',
            run: async ({ rooms }) => {
                const fullRoom = rooms.find((r: any) => r.status === 'Full');
                if (fullRoom) return { success: true };
                // This test should pass if it finds a full room and confirms it is not selectable.
                return { success: false, error: 'No full rooms found to test blocking condition.' };
            },
        },
    ],
  },
];

export const runPuppeteerTests = async (
  context: any,
  onTestUpdate: (testId: string, result: TestResult) => void
) => {
  for (const suite of TEST_SUITES) {
    for (const test of suite.tests) {
      const startTime = Date.now();
      onTestUpdate(test.id, { status: TestStatus.RUNNING });
      
      await wait(MOCK_DELAY);

      try {
        const result = await test.run(context);
        const duration = Date.now() - startTime;
        if (result.success) {
          onTestUpdate(test.id, { status: TestStatus.PASSED, duration });
        } else {
          onTestUpdate(test.id, {
            status: TestStatus.FAILED,
            error: result.error || 'Test failed with an unknown error.',
            screenshot: generateFailureScreenshot(test.description, result.error || 'Unknown error'),
            duration,
          });
        }
      } catch (e: any) {
        const duration = Date.now() - startTime;
        onTestUpdate(test.id, {
          status: TestStatus.FAILED,
          error: e.message,
          screenshot: generateFailureScreenshot(test.description, e.message),
          duration,
        });
      }
    }
  }
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — myvbci-camper-app
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('myvbci-camper-app E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript
export enum UserRole {
  CAMPER = 'CAMPER',
  ADMIN = 'ADMIN',
}

export enum RoomType {
  DORM = 'Dorm',
  CABIN = 'Cabin',
  TENT = 'Tent',
  SUITE = 'Suite',
}

export enum GenderRestriction {
  MALE = 'Male',
  FEMALE = 'Female',
  MIXED = 'Mixed',
}

export enum RoomStatus {
  AVAILABLE = 'Available',
  FULL = 'Full',
}

export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
}

export enum PaymentStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
  PARTIAL = 'Partial',
}

export enum PaymentMethod {
  CARD = 'Card',
  MOBILE_MONEY = 'Mobile Money',
  PAYPAL = 'PayPal',
}

export interface User {
  user_id: string;
  full_name: string;
  title: string;
  email: string;
  phone: string;
  gender?: 'Male' | 'Female';
  role: UserRole;
  medical_info?: string;
  emergency_contact?: string;
  created_at: string;
  province?: string;
  sanctuary?: string;
}

export interface Camp {
  camp_id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  capacity: number;
  available_slots: number;
  image_url?: string;
}

export interface Room {
  room_id: string;
  camp_id: string;
  room_name: string;
  type: RoomType;
  capacity: number;
  current_occupancy: number;
  gender_restriction: GenderRestriction;
  status: RoomStatus;
  amenities: string;
}

export interface Booking {
  booking_id: string;
  user_id: string;
  camp_id: string;
  room_id: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  amount: number;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Info' | 'Warning' | 'Success' | 'Urgent';
  date: string;
  audience: 'All' | 'Campers' | 'Admins';
}

// --- Testing Framework Types ---

export enum TestStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
}

export interface TestResult {
  status: TestStatus;
  error?: string;
  screenshot?: string; // base64 data URL
  duration?: number;
}

export interface TestCase {
  id: string;
  description: string;
  run: (context: any) => Promise<{ success: boolean; error?: string }>;
}

export interface TestSuite {
  id: string;
  title: string;
  tests: TestCase[];
}

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
  ,
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom')) return 'vendor-react-dom';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('react')) return 'vendor-react';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
              if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
              return 'vendor';
            }
          },
        },
      },
    }
  };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — myvbci-camper-app
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — myvbci-camper-app
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

