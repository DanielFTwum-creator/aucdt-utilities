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