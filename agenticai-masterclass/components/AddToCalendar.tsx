import React from 'react';
import { Calendar, Download, ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { BookingType } from '../types';

interface AddToCalendarProps {
  date: Date;
  type?: BookingType;
  onBookAnother?: () => void;
}

export const AddToCalendar: React.FC<AddToCalendarProps> = ({ date, type = 'MASTERCLASS', onBookAnother }) => {
  const eventDate = new Date(date);
  const endDate = new Date(eventDate);
  endDate.setMinutes(endDate.getMinutes() + 45);

  const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

  const isPrivate = type === 'PRIVATE';

  // Masterclass Details
  const rawTitle = 'Unlock Your Potential: The 15-Minute AI Agent Masterclass';
  const rawDescription = "Join us for a hands-on masterclass where you'll learn to create your very own AI agent in just 15 minutes.\n\nGoogle Meet Link: The meeting link has been sent to your registered email address.";
  const rawLocation = 'Google Meet (Online)';

  // URL Encode for web links
  const title = encodeURIComponent(rawTitle);
  const description = encodeURIComponent(rawDescription);
  const location = encodeURIComponent(rawLocation);
  
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGoogleDate(eventDate)}/${formatGoogleDate(endDate)}&details=${description}&location=${location}&recur=RRULE:FREQ=WEEKLY;BYDAY=TH`;
  
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${description}&location=${location}&startdt=${eventDate.toISOString()}&enddt=${endDate.toISOString()}`;
  
  const office365Url = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${title}&body=${description}&location=${location}&startdt=${eventDate.toISOString()}&enddt=${endDate.toISOString()}`;

  const generateICS = () => {
    // Escape special characters for ICS format (simple replacement for newlines)
    const icsDescription = rawDescription.replace(/\n/g, '\\n');
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AI Agent Masterclass//EN
BEGIN:VEVENT
UID:${Date.now()}@aucdt.edu.gh
DTSTAMP:${formatGoogleDate(new Date())}
DTSTART:${formatGoogleDate(eventDate)}
DTEND:${formatGoogleDate(endDate)}
SUMMARY:${rawTitle}
DESCRIPTION:${icsDescription}
LOCATION:${rawLocation}
RRULE:FREQ=WEEKLY;BYDAY=TH
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    return URL.createObjectURL(blob);
  };

  const formattedDisplayDate = eventDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });

  if (isPrivate) {
    return (
        <div className="w-full animate-in fade-in zoom-in-95 duration-500">
           <div className="bg-white/95 backdrop-blur-xl rounded-[24px] p-8 border border-white/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <div className="relative z-10 text-center mb-6">
                 <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20 rotate-3">
                    <Clock className="w-8 h-8 text-white" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 mb-2">Request Received</h3>
                 <p className="text-slate-600 font-medium px-4">
                    Thank you for your interest in a private session.
                 </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5 text-center mb-6">
                  <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                      Our team will contact you within 24 hours to schedule your session.
                  </p>
              </div>
              
              {onBookAnother && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={onBookAnother}
                    className="text-amber-600 font-bold hover:underline text-sm"
                  >
                    Book Another Session
                  </button>
                </div>
              )}
           </div>
        </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in zoom-in-95 duration-500">
       <div className="bg-white/95 backdrop-blur-xl rounded-[24px] p-8 border border-white/20 shadow-2xl relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10 text-center mb-8">
             <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/20 rotate-3">
                <CheckCircle className="w-8 h-8 text-white" />
             </div>
             <h3 className="text-2xl font-black text-slate-800 mb-2">You're Booked!</h3>
             <p className="text-slate-600 font-medium">
                We've reserved your spot for <br/>
                <span className="text-slate-800 font-bold">{formattedDisplayDate} at 7:00 PM GMT</span>
             </p>
          </div>
          
          <div className="grid gap-3 max-w-sm mx-auto">
             <a 
               href={googleUrl} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="flex items-center justify-between w-full bg-white border-2 border-slate-100 hover:border-[#4285F4] hover:bg-[#4285F4]/5 text-slate-700 hover:text-[#4285F4] font-bold py-4 px-6 rounded-2xl transition-all group shadow-sm hover:shadow-md"
             >
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#4285F4]" />
                  <span>Google Calendar</span>
                </div>
                <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
             </a>
             
             <div className="grid grid-cols-2 gap-3">
                 <a href={outlookUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-2 w-full bg-blue-50 hover:bg-blue-100 text-[#0078D4] font-bold py-4 px-4 rounded-2xl transition-all border border-blue-100 hover:border-blue-200">
                    <Calendar className="w-6 h-6" />
                    <span className="text-sm">Outlook</span>
                 </a>
                 <a href={office365Url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-2 w-full bg-orange-50 hover:bg-orange-100 text-[#d83b01] font-bold py-4 px-4 rounded-2xl transition-all border border-orange-100 hover:border-orange-200">
                    <Calendar className="w-6 h-6" />
                    <span className="text-sm">Office 365</span>
                 </a>
             </div>

             <a href={generateICS()} download="masterclass.ics" className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 px-4 rounded-2xl transition-all shadow-lg hover:shadow-slate-800/20 mt-2">
                <Download className="w-5 h-5" />
                Download for Google Meet / Apple
             </a>
          </div>

          <div className="mt-6 text-center text-sm text-slate-400 font-medium">
            Check your email for the direct Google Meet link
          </div>

          {onBookAnother && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onBookAnother}
                className="text-[#667eea] font-bold hover:underline text-sm"
              >
                Book Another Session
              </button>
            </div>
          )}
       </div>
    </div>
  );
};