import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Check, ChevronRight, ChevronLeft, User, Sparkles } from 'lucide-react';

const services = [
  { id: 'photography', name: 'Photography Session', duration: '2 hours', price: 'Starting at $200' },
  { id: 'web-design', name: 'Web Design Consultation', duration: '1 hour', price: 'Free' },
  { id: 'graphic-design', name: 'Graphic Design Project', duration: '30 mins', price: 'Consultation' },
  { id: 'editing', name: 'Photo Editing Review', duration: '45 mins', price: '$50' }
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

export default function Booking() {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: null as typeof services[0] | null,
    date: null as string | null,
    time: null as string | null,
    name: '',
    email: '',
    notes: ''
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const updateData = (field: string, value: any) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  // Generate next 14 days for calendar
  const getDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date: date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        fullDate: date.toISOString().split('T')[0]
      });
    }
    return days;
  };

  const days = getDays();

  return (
    <section id="booking" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 mb-4">
            <span className="h-px w-8 bg-orange-500"></span>
            <span className="text-orange-600 font-medium tracking-wider text-sm uppercase">Book Online</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">Start Your Project</h2>
          <p className="text-gray-600">Schedule a session or consultation with us directly.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= i ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > i ? <Check className="w-4 h-4" /> : i}
                </div>
                {i < 3 && (
                  <div className={`w-12 h-1 mx-4 rounded-full transition-colors ${
                    step > i ? 'bg-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="p-8 md:p-12 min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => updateData('service', service)}
                        className={`p-6 rounded-xl border-2 text-left transition-all hover:border-orange-300 ${
                          bookingData.service?.id === service.id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-100 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900">{service.name}</h4>
                          {bookingData.service?.id === service.id && (
                            <Check className="w-5 h-5 text-orange-500" />
                          )}
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {service.duration}</span>
                          <span className="font-medium text-orange-600">{service.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Select Date & Time</h3>
                    
                    {/* Date Scroll */}
                    <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
                      {days.map((day) => (
                        <button
                          key={day.fullDate}
                          onClick={() => updateData('date', day.fullDate)}
                          className={`flex-shrink-0 w-20 h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                            bookingData.date === day.fullDate
                              ? 'border-orange-500 bg-orange-500 text-white shadow-lg scale-105'
                              : 'border-gray-100 bg-white text-gray-600 hover:border-orange-200'
                          }`}
                        >
                          <span className="text-xs font-medium uppercase mb-1 opacity-80">{day.dayName}</span>
                          <span className="text-2xl font-bold">{day.dayNumber}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Grid */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Available Slots</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => updateData('time', time)}
                          disabled={!bookingData.date}
                          className={`py-3 px-4 rounded-lg text-sm font-medium border transition-all ${
                            bookingData.time === time
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                          } ${!bookingData.date ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h3>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={bookingData.name}
                          onChange={(e) => updateData('name', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-400">@</span>
                        <input
                          type="email"
                          value={bookingData.email}
                          onChange={(e) => updateData('email', e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => updateData('notes', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                        placeholder="Any specific requirements..."
                      />
                    </div>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 mt-6">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                      <Sparkles className="w-4 h-4 text-orange-500 mr-2" />
                      Booking Summary
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Service:</span> {bookingData.service?.name}</p>
                      <p><span className="font-medium">Date:</span> {bookingData.date} at {bookingData.time}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-8">
                    Thank you, {bookingData.name}. We've sent a confirmation email to {bookingData.email}. We look forward to seeing you on {bookingData.date}.
                  </p>
                  <button
                    onClick={() => {
                      setStep(1);
                      setBookingData({ service: null, date: null, time: null, name: '', email: '', notes: '' });
                    }}
                    className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                  >
                    Book Another Session
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          {step < 4 && (
            <div className="p-8 border-t border-gray-100 flex justify-between items-center bg-gray-50">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-200/50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !bookingData.service) ||
                  (step === 2 && (!bookingData.date || !bookingData.time)) ||
                  (step === 3 && (!bookingData.name || !bookingData.email))
                }
                className="flex items-center px-8 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
              >
                {step === 3 ? 'Confirm Booking' : 'Continue'}
                {step < 3 && <ChevronRight className="w-4 h-4 ml-2" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
