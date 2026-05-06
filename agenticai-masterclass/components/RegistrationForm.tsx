import React, { useState } from 'react';
import { Loader2, AlertCircle, Calendar as CalendarIcon, ChevronDown, Check, Users, User, ArrowRight } from 'lucide-react';
import { registerUser } from '../services/api';
import { RegistrationStatus, BookingType } from '../types';
import { AddToCalendar } from './AddToCalendar';
import { useBookingMode } from './BookingContext';

// Helper to get upcoming 4 Thursdays
const getUpcomingThursdays = (count: number = 4) => {
  const dates: Date[] = [];
  const now = new Date();
  const target = new Date(now);
  
  // Set target to today at 19:00 UTC (Event time)
  target.setUTCHours(19, 0, 0, 0);

  // Check if today is Thursday and if the event hasn't passed (before 19:00 UTC)
  // 4 represents Thursday
  const isThursday = now.getUTCDay() === 4;
  const isBeforeEvent = now.getTime() < target.getTime();

  if (isThursday && isBeforeEvent) {
    // Keep target as today
  } else {
    // Find next Thursday
    const currentDay = now.getUTCDay();
    const daysUntilThursday = (4 - currentDay + 7) % 7;
    // If daysUntilThursday is 0 here, it means it is Thursday but AFTER event time, so add 7 days
    const addDays = daysUntilThursday === 0 ? 7 : daysUntilThursday;
    target.setUTCDate(now.getUTCDate() + addDays);
    // Ensure time is reset
    target.setUTCHours(19, 0, 0, 0);
  }

  for (let i = 0; i < count; i++) {
    const d = new Date(target);
    d.setUTCDate(target.getUTCDate() + (i * 7));
    dates.push(d);
  }
  return dates;
};

const formatDateForDisplay = (date: Date) => {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }) + ' - 7:00 PM GMT';
};

export const RegistrationForm: React.FC = () => {
  // Use Context instead of local state for activeTab
  const { bookingType: activeTab, setBookingType: setActiveTab } = useBookingMode();
  
  const [upcomingDates] = useState(getUpcomingThursdays());
  const [selectedDate, setSelectedDate] = useState<Date>(upcomingDates[0]);
  
  // Form State
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  
  const [status, setStatus] = useState<RegistrationStatus>(RegistrationStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (activeTab === 'PRIVATE' && !name) {
        setErrorMsg('Please enter your full name.');
        return;
    }

    setStatus(RegistrationStatus.LOADING);

    try {
      const displayDate = activeTab === 'MASTERCLASS' 
        ? formatDateForDisplay(selectedDate)
        : 'To Be Scheduled';

      await registerUser(email, displayDate, activeTab, name, notes);
      
      setStatus(RegistrationStatus.SUCCESS);
      
      // Clear form
      setEmail('');
      setName('');
      setNotes('');
    } catch (error) {
      console.error(error);
      setStatus(RegistrationStatus.ERROR);
      setErrorMsg('Sorry, there was an error submitting your request. Please try again or contact helpdesk@aucdt.edu.gh');
    }
  };

  if (status === RegistrationStatus.SUCCESS) {
    return <AddToCalendar date={selectedDate} type={activeTab} onBookAnother={() => setStatus(RegistrationStatus.IDLE)} />;
  }

  return (
    <div className="w-full mt-8 flex flex-col gap-0 bg-white/50 rounded-3xl border border-white/40 shadow-sm backdrop-blur-sm overflow-hidden">
        {/* Tabs */}
        <div role="tablist" aria-label="Booking Type" className="grid grid-cols-2 p-1 gap-1 bg-slate-100/50 border-b border-white/20">
            <button
                role="tab"
                aria-selected={activeTab === 'MASTERCLASS'}
                aria-controls="panel-masterclass"
                id="tab-masterclass"
                onClick={() => setActiveTab('MASTERCLASS')}
                className={`relative py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#667eea]/50 ${
                    activeTab === 'MASTERCLASS' 
                    ? 'bg-white text-[#667eea] shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
            >
                <Users className="w-4 h-4" aria-hidden="true" />
                Group Masterclass
            </button>
            <button
                role="tab"
                aria-selected={activeTab === 'PRIVATE'}
                aria-controls="panel-private"
                id="tab-private"
                onClick={() => setActiveTab('PRIVATE')}
                className={`relative py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                    activeTab === 'PRIVATE' 
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-50 text-amber-600 shadow-sm ring-1 ring-amber-500/10' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
            >
                <User className="w-4 h-4" aria-hidden="true" />
                Private Session
            </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
            {activeTab === 'MASTERCLASS' ? (
                <div role="tabpanel" id="panel-masterclass" aria-labelledby="tab-masterclass">
                    <div className="flex items-center gap-2 mb-1 animate-in fade-in slide-in-from-left-2 duration-300">
                        <h3 className="text-xl font-bold text-slate-800">Reserve Your Seat</h3>
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                            Spots Filling Fast
                        </span>
                    </div>

                    {/* Date Selector */}
                    <div className="relative w-full group animate-in fade-in slide-in-from-bottom-2 duration-500 mt-4">
                        <label htmlFor="date-select" className="block text-sm font-semibold text-slate-500 mb-2 ml-1">
                            Select Session Date
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667eea] pointer-events-none z-10">
                                <CalendarIcon className="w-5 h-5" aria-hidden="true" />
                            </div>
                            <select
                                id="date-select"
                                value={selectedDate.toISOString()}
                                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                disabled={status === RegistrationStatus.LOADING}
                                className="w-full appearance-none pl-12 pr-10 py-4 rounded-2xl border-2 border-[#667eea]/20 bg-white text-lg font-medium text-slate-800 focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all shadow-sm hover:border-[#667eea]/40 cursor-pointer disabled:opacity-60"
                            >
                                {upcomingDates.map((date) => (
                                <option key={date.toISOString()} value={date.toISOString()} className="text-slate-800 bg-white py-2">
                                    {formatDateForDisplay(date)}
                                </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#667eea] transition-colors z-10">
                                <ChevronDown className="w-5 h-5" aria-hidden="true" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-3 duration-500 mt-4">
                        <label htmlFor="email-input-master" className="block text-sm font-semibold text-slate-500 ml-1">
                            Your Email Address
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <input
                                id="email-input-master"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (status === RegistrationStatus.ERROR) setStatus(RegistrationStatus.IDLE);
                                    if (errorMsg) setErrorMsg(null);
                                }}
                                placeholder="name@example.com"
                                disabled={status === RegistrationStatus.LOADING}
                                className={`flex-1 min-w-0 px-6 py-4 rounded-2xl border-2 ${errorMsg ? 'border-red-500/50 focus:border-red-500' : 'border-[#667eea]/20 focus:border-[#667eea]'} bg-white text-lg font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#667eea]/10 transition-all shadow-sm disabled:opacity-60`}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            />
                            <button
                                onClick={() => handleSubmit()}
                                disabled={status === RegistrationStatus.LOADING}
                                className="relative overflow-hidden group bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg shadow-[#667eea]/30 transition-all hover:-translate-y-1 hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2 sm:min-w-[180px]"
                                aria-label={status === RegistrationStatus.LOADING ? "Booking your spot" : "Secure your spot"}
                            >
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                                <span className="relative z-10 flex items-center gap-2">
                                    {status === RegistrationStatus.LOADING ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" aria-hidden="true" />
                                        Booking...
                                    </>
                                    ) : (
                                    <>
                                        Secure Spot
                                        <Check className="w-5 h-5" aria-hidden="true" />
                                    </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div role="tabpanel" id="panel-private" aria-labelledby="tab-private" className="animate-in fade-in slide-in-from-right-2 duration-300 flex flex-col gap-4">
                     <div className="flex flex-col gap-1 mb-2">
                        <h3 className="text-xl font-bold text-slate-800">1-on-1 Strategy Session</h3>
                        <p className="text-sm text-slate-500">Get personalized guidance to build your specific AI solution.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                         <div className="flex flex-col gap-2">
                            <label htmlFor="name-input" className="block text-sm font-semibold text-slate-500 ml-1">Full Name</label>
                            <input
                                id="name-input"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl border-2 border-amber-200/50 focus:border-amber-400 bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
                            />
                         </div>
                         <div className="flex flex-col gap-2">
                            <label htmlFor="email-input-private" className="block text-sm font-semibold text-slate-500 ml-1">Work Email</label>
                            <input
                                id="email-input-private"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className={`w-full px-4 py-3 rounded-xl border-2 ${errorMsg && !email ? 'border-red-500' : 'border-amber-200/50 focus:border-amber-400'} bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all`}
                            />
                         </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="notes-input" className="block text-sm font-semibold text-slate-500 ml-1">Project Goals (Optional)</label>
                        <textarea
                            id="notes-input"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Briefly describe what you'd like to build..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border-2 border-amber-200/50 focus:border-amber-400 bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all resize-none"
                        />
                    </div>

                    <button
                        onClick={() => handleSubmit()}
                        disabled={status === RegistrationStatus.LOADING}
                        className="relative overflow-hidden group bg-gradient-to-br from-amber-400 to-orange-500 text-white w-full py-4 rounded-xl text-lg font-bold shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        aria-label={status === RegistrationStatus.LOADING ? "Sending request" : "Request Private Session"}
                    >
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                        <span className="relative z-10 flex items-center gap-2">
                            {status === RegistrationStatus.LOADING ? (
                                <>
                                    <Loader2 className="animate-spin w-5 h-5" aria-hidden="true" />
                                    Sending Request...
                                </>
                            ) : (
                                <>
                                    Request Private Session
                                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                                </>
                            )}
                        </span>
                    </button>
                </div>
            )}
            
            {errorMsg && (
                <div role="alert" className="flex items-center gap-2 text-red-500 text-sm font-medium px-2 animate-in slide-in-from-top-1 fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{errorMsg}</span>
                </div>
            )}
        </div>
    </div>
  );
};