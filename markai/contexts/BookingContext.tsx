import React, { createContext, useContext, useState } from 'react';

type BookingType = 'MASTERCLASS' | 'PRIVATE';

interface BookingContextType {
  bookingType: BookingType;
  setBookingType: (type: BookingType) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingType, setBookingType] = useState<BookingType>('MASTERCLASS');
  return <BookingContext.Provider value={{ bookingType, setBookingType }}>{children}</BookingContext.Provider>;
};

export const useBookingMode = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBookingMode must be used within BookingProvider');
    return context;
};
