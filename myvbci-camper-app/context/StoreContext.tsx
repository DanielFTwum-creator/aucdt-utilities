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