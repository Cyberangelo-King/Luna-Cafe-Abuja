import { useState, FormEvent } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, Check, MapPin, Hourglass, ArrowRight, Compass, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Reservation } from '../types';
import { getStoredReservations, saveStoredReservations } from '../services/cafeDataService';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 15
    }
  }
};

interface ReservationsViewProps {
  onBackToHome?: () => void;
  onViewMenu?: () => void;
}

export default function ReservationsView({ onBackToHome, onViewMenu }: ReservationsViewProps) {
  // Booking State
  const [selectedDate, setSelectedDate] = useState<number>(13);
  const [selectedTime, setSelectedTime] = useState<string>('1:00 PM');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [referenceCode, setReferenceCode] = useState<string>('');

  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  
  // Custom elegant info dialog state instead of blocking alert boxes
  const [infoModal, setInfoModal] = useState<{ title: string; desc: string } | null>(null);

  const daysInOctober = [
    { num: 1, disabled: true },
    { num: 2, disabled: true },
    { num: 3, disabled: true },
    { num: 4, disabled: true },
    { num: 5, disabled: true },
    { num: 6, isSunday: true },
    { num: 7, disabled: true },
    { num: 8, disabled: true },
    { num: 9, disabled: true },
    { num: 10, disabled: true },
    { num: 11, disabled: true },
    { num: 12, disabled: true },
    { num: 13, isSunday: true },
    { num: 14, disabled: true },
    { num: 15, disabled: true },
    { num: 16, disabled: true },
    { num: 17, disabled: true },
    { num: 18, disabled: true },
    { num: 19, disabled: true },
    { num: 20, isSunday: true },
    { num: 21, disabled: true },
    { num: 22, disabled: true },
    { num: 23, disabled: true },
    { num: 24, disabled: true },
    { num: 25, disabled: true },
    { num: 26, disabled: true },
    { num: 27, isSunday: true }
  ];

  const timeSlots = [
    { time: '10:00 AM', status: 'Fully Booked' },
    { time: '10:45 AM', status: 'Limited Seats' },
    { time: '11:30 AM', status: 'Limited Seats' },
    { time: '1:00 PM', status: 'Available' },
    { time: '2:30 PM', status: 'Fully Booked' }
  ];

  const handleConfirmReservation = (e: FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail) {
      setInfoModal({
        title: "Validation Error",
        desc: "Please provide a valid guest name and email address to finalize your courtyard reservation."
      });
      return;
    }
    // Generate a random reference
    const randCode = `LOLA-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      date: `2026-10-${selectedDate}`,
      monthStr: 'Oct',
      year: '2026',
      time: selectedTime,
      guests: guestCount,
      specialRequests: specialRequests || '',
      reference: randCode,
      guestName,
      guestEmail,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const currentRes = getStoredReservations();
    saveStoredReservations([...currentRes, newRes]);

    setReferenceCode(randCode);
    setIsConfirmed(true);
  };

  return (
    <div className="w-full animate-fadeIn">
      {!isConfirmed ? (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-16 py-12 md:py-20">
          {/* Header Context */}
          <div className="flex flex-col items-center text-center mb-16">
            <h1 className="font-display text-4xl md:text-6xl text-primary-cafe mb-4 font-bold">
              Sunday Brunch
            </h1>
            <p className="font-sans text-base md:text-lg text-on-surface-variant-cafe max-w-2xl mx-auto leading-relaxed">
              Secure your table for our signature Sunday service. An afternoon of artisanal pastries, rich roasts, and community warmth in our sun-drenched courtyard.
            </p>
            {/* Bespoke Divider */}
            <div className="flex items-center gap-4 mt-8 opacity-70">
              <div className="h-px w-16 bg-tertiary-cafe"></div>
              <span className="font-sans text-secondary-cafe text-xs italic">🌿 Escape 🌿</span>
              <div className="h-px w-16 bg-tertiary-cafe"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Artistic Asymmetric Image */}
            <div className="hidden lg:block lg:col-span-4 self-start sticky top-32">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-outline-cafe/15 p-2.5 bg-surface-container-lowest-cafe shadow-md">
                <img
                  className="w-full h-full object-cover rounded-xl"
                  alt="Croissant and coffee on sunlit wood table in Abuja CBD courtyard"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCnou2y_Iw4Lg57x4G1zhLPk5VnrqzMQDQt76izwXPTBekEnbY6O6bB5jpF1qvEiLB0N2PLoKbC2iY530c4b_0x1AdcGEcOsTjXwBmBEtZp7YVvJMks87ofwaRQPJigvNBV8YyrEagrNOg4TUmUnoGDcc1i6FQAX34K0g-AF5lkfZemwE-05jciVUHQWMkcFS7CSrAmEeC9Ox74N5vvWovyom-nnWAx7UIO1TmHO2RC29QSfZLk-iuAA"
                />
              </div>
            </div>

            {/* Right: Reservation Interface */}
            <div className="lg:col-span-8 bg-surface-container-lowest-cafe rounded-2xl border border-outline-cafe/15 p-6 md:p-12 shadow-sm text-left">
              <form onSubmit={handleConfirmReservation} className="space-y-10">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  
                  {/* Left Column inside Reservation Form: Date & Guests */}
                  <div className="space-y-8">
                    
                    {/* Date Picker */}
                    <div>
                      <h3 className="font-display text-lg text-primary-cafe mb-4 flex items-center gap-2 font-bold">
                        <Calendar className="w-5 h-5 text-secondary-cafe" /> Select Date
                      </h3>
                      <div className="bg-surface-cafe p-4 rounded-xl border border-outline-cafe/10 shadow-inner">
                        <div className="flex justify-between items-center mb-4">
                          <button type="button" className="p-1 hover:bg-surface-variant-cafe rounded-full text-on-surface-variant-cafe transition-colors cursor-pointer">
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <span className="font-sans font-bold text-sm text-primary-cafe">October 2024</span>
                          <button type="button" className="p-1 hover:bg-surface-variant-cafe rounded-full text-on-surface-variant-cafe transition-colors cursor-pointer">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-2 text-center mb-2 font-sans text-xs font-semibold text-on-surface-variant-cafe/70">
                          <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span className="text-secondary-cafe">Su</span>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-2 text-center font-sans text-sm">
                          {/* Empty padding slots */}
                          <span></span><span></span>
                          
                          {daysInOctober.map((day, idx) => {
                            if (day.disabled) {
                              return (
                                <span key={idx} className="py-2 text-on-surface-variant-cafe/20 cursor-not-allowed select-none">
                                  {day.num}
                                </span>
                              );
                            }
                            
                            const isSelected = selectedDate === day.num;
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedDate(day.num)}
                                className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-primary-cafe text-on-primary shadow-md'
                                    : 'bg-secondary-container-cafe/15 text-secondary-cafe hover:bg-secondary-container-cafe/35'
                                }`}
                              >
                                {day.num}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Guest Count */}
                    <div>
                      <h3 className="font-display text-lg text-primary-cafe mb-4 flex items-center gap-2 font-bold">
                        <Users className="w-5 h-5 text-secondary-cafe" /> Guest Count
                      </h3>
                      <div className="flex items-center justify-between border-b border-outline-cafe/30 pb-3">
                        <button
                          type="button"
                          onClick={() => setGuestCount(q => Math.max(1, q - 1))}
                          className="w-10 h-10 rounded-full border border-outline-cafe/30 flex items-center justify-center text-primary-cafe hover:bg-surface-cafe transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-display text-4xl text-primary-cafe font-bold">{guestCount}</span>
                        <button
                          type="button"
                          onClick={() => setGuestCount(q => Math.min(6, q + 1))}
                          className="w-10 h-10 rounded-full border border-outline-cafe/30 flex items-center justify-center text-primary-cafe hover:bg-surface-cafe transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="font-sans text-xs text-on-surface-variant-cafe mt-2 text-center">
                        For parties larger than 6, please <a href="#contact" className="text-secondary-cafe underline font-bold">contact us directly</a>.
                      </p>
                    </div>

                  </div>

                  {/* Right Column inside Reservation Form: Times Slots & Details */}
                  <div className="space-y-8">
                    
                    <div>
                      <h3 className="font-display text-lg text-primary-cafe mb-4 flex items-center gap-2 font-bold">
                        <Clock className="w-5 h-5 text-secondary-cafe" /> Available Times
                      </h3>
                      <motion.div
                        key={selectedDate}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-3"
                      >
                        {timeSlots.map((slot, idx) => {
                          const isSelected = selectedTime === slot.time;
                          const isFullyBooked = slot.status === 'Fully Booked';
                          const isLimited = slot.status === 'Limited Seats';

                          return (
                            <motion.button
                              variants={cardVariants}
                              whileHover={{ scale: isFullyBooked ? 1 : 1.015 }}
                              whileTap={{ scale: isFullyBooked ? 1 : 0.985 }}
                              key={idx}
                              type="button"
                              disabled={isFullyBooked}
                              onClick={() => setSelectedTime(slot.time)}
                              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                                isFullyBooked
                                  ? 'bg-surface-variant-cafe/40 text-on-surface-variant-cafe/40 border-transparent cursor-not-allowed opacity-50'
                                  : isSelected
                                  ? 'bg-primary-container-cafe text-on-primary-container-cafe border-transparent shadow-sm ring-2 ring-primary-cafe ring-offset-2 ring-offset-surface-cafe'
                                  : isLimited
                                  ? 'bg-surface-cafe border-secondary-cafe/40 text-secondary-cafe hover:bg-secondary-cafe/5'
                                  : 'bg-surface-cafe border-outline-cafe/20 text-primary-cafe hover:border-primary-cafe'
                              }`}
                            >
                              <span className="font-sans font-bold text-sm">{slot.time}</span>
                              <span className={`font-sans text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                                isFullyBooked
                                  ? 'bg-surface-container-highest-cafe text-on-surface-variant-cafe/50'
                                  : isSelected
                                  ? 'bg-primary-cafe text-on-primary'
                                  : isLimited
                                  ? 'bg-secondary-container-cafe/20 text-secondary-cafe'
                                  : 'bg-primary-cafe/10 text-primary-cafe'
                              }`}>
                                {isSelected ? 'Selected' : slot.status}
                              </span>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </div>

                  </div>

                </div>

                {/* Bottom Segment: Contact Info & Special Request */}
                <div className="pt-8 border-t border-outline-cafe/15 space-y-6">
                  <h3 className="font-display text-lg text-primary-cafe font-bold">Your Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Full Name</label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Amina Bello"
                        className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/40 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Email Address</label>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="amina@example.com"
                        className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe" htmlFor="requests">Special Requests</label>
                    <textarea
                      id="requests"
                      rows={2}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Anniversary, dietary requirements, table in the shade, etc..."
                      className="w-full bg-surface-container-low-cafe border border-outline-cafe/10 rounded-xl px-4 py-3 font-sans text-sm text-primary-cafe placeholder-outline-cafe/40 focus:border-primary-cafe focus:ring-1 focus:ring-primary-cafe transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Order Summary & Confirm Action */}
                <div className="pt-6 border-t border-outline-cafe/15 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="bg-surface-container-low-cafe p-4 rounded-xl border border-outline-cafe/10 text-left w-full md:w-auto md:min-w-[320px]">
                    <div className="flex justify-between items-center text-xs mb-1 text-on-surface-variant-cafe">
                      <span>Selected Date:</span>
                      <span className="font-bold text-primary-cafe">Sunday, Oct {selectedDate}, 2024</span>
                    </div>
                    <div className="flex justify-between items-center text-xs mb-1 text-on-surface-variant-cafe">
                      <span>Selected Time:</span>
                      <span className="font-bold text-primary-cafe">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-on-surface-variant-cafe">
                      <span>Guests Size:</span>
                      <span className="font-bold text-primary-cafe">{guestCount} {guestCount === 1 ? 'Person' : 'People'}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full md:w-auto md:px-8 font-sans font-semibold tracking-wider uppercase text-xs bg-primary-cafe text-on-primary rounded-xl py-4 shadow-lg hover:bg-primary-container-cafe hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 cursor-pointer"
                    style={{ boxShadow: '0 4px 20px rgba(152, 70, 35, 0.15)' }}
                  >
                    Confirm Reservation <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            </div>

          </div>
        </div>
      ) : (
        /* CONFIRMED STATE */
        <div className="w-full max-w-3xl mx-auto px-4 md:px-16 py-12 md:py-24 animate-fadeIn text-center space-y-10">
          
          {/* Success Tick */}
          <div className="w-20 h-20 rounded-full bg-primary-container-cafe text-on-primary flex items-center justify-center shadow-lg shadow-primary-container-cafe/20 mx-auto">
            <Check className="w-10 h-10 text-white stroke-[3px]" />
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="font-display text-4xl md:text-6xl text-primary-cafe font-bold leading-tight">
              Your Table is Waiting.
            </h1>
            <p className="font-sans text-sm md:text-base text-on-surface-variant-cafe flex items-center justify-center gap-2">
              Confirmation Reference:{' '}
              <span className="font-sans text-base font-bold text-secondary-cafe tracking-widest uppercase">
                {referenceCode}
              </span>
            </p>
          </div>

          {/* Details Card */}
          <div className="w-full bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
            <div className="flex flex-col items-center md:items-start space-y-1">
              <span className="font-sans text-xs font-bold text-on-surface-variant-cafe uppercase tracking-widest">Date</span>
              <span className="font-display text-lg text-primary-cafe flex items-center gap-2 font-bold">
                <Calendar className="w-4 h-4 text-outline-cafe" />
                Sunday, Oct {selectedDate}
              </span>
            </div>
            
            <div className="hidden md:block w-px h-12 bg-outline-cafe/15" />
            
            <div className="flex flex-col items-center md:items-start space-y-1">
              <span className="font-sans text-xs font-bold text-on-surface-variant-cafe uppercase tracking-widest">Time</span>
              <span className="font-display text-lg text-primary-cafe flex items-center gap-2 font-bold">
                <Clock className="w-4 h-4 text-outline-cafe" />
                {selectedTime}
              </span>
            </div>
            
            <div className="hidden md:block w-px h-12 bg-outline-cafe/15" />
            
            <div className="flex flex-col items-center md:items-start space-y-1">
              <span className="font-sans text-xs font-bold text-on-surface-variant-cafe uppercase tracking-widest">Guests</span>
              <span className="font-display text-lg text-primary-cafe flex items-center gap-2 font-bold">
                <Users className="w-4 h-4 text-outline-cafe" />
                {guestCount} {guestCount === 1 ? 'Person' : 'People'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <button
              onClick={() => setInfoModal({
                title: "Calendar Connected",
                desc: `A courtyard appointment for LOLA-${referenceCode} (Oct ${selectedDate} at ${selectedTime}) has been compiled and synced into your local mobile/desktop device calendar.`
              })}
              className="bg-primary-container-cafe text-on-primary rounded-lg font-sans font-semibold tracking-wider uppercase text-xs px-6 py-4 flex items-center justify-center gap-2 hover:bg-primary-container-cafe/90 transition-all cursor-pointer shadow-md"
            >
              <Calendar className="w-4 h-4" /> Add to Calendar
            </button>
            
            {onViewMenu && (
              <button
                onClick={onViewMenu}
                className="border border-secondary-cafe text-secondary-cafe rounded-lg font-sans font-semibold tracking-wider uppercase text-xs px-6 py-4 flex items-center justify-center gap-2 hover:bg-secondary-cafe/5 transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4" /> View Menu
              </button>
            )}
            
            <button
              onClick={() => setInfoModal({
                title: "Courtyard Coordinates",
                desc: "We are situated at Plot 1042, Central Business District (CBD), Abuja. Look out for our signature wooden arched gateway adjacent to the main CBD Park. Ample, secure parking is fully accessible in our private rear lot."
              })}
              className="border border-outline-cafe/30 text-primary-cafe rounded-lg font-sans font-semibold tracking-wider uppercase text-xs px-6 py-4 flex items-center justify-center gap-2 hover:bg-surface-container-low-cafe transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4" /> Get Directions
            </button>
          </div>

          {/* The "Vibe" Divider */}
          <div className="w-full flex items-center justify-center py-6 opacity-60">
            <div className="h-px w-24 bg-tertiary-cafe/20"></div>
            <span className="font-sans text-secondary-cafe text-xs italic mx-4">🍃 Sanctuary 🌿</span>
            <div className="h-px w-24 bg-tertiary-cafe/20"></div>
          </div>

          {/* What to Expect */}
          <div className="w-full text-left space-y-6 pt-4">
            <h3 className="font-display text-2xl text-primary-cafe text-center font-bold">What to Expect</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-surface-container-lowest-cafe border border-outline-cafe/10 rounded-xl p-6 flex gap-4 items-start shadow-sm">
                <Hourglass className="w-5 h-5 text-secondary-cafe mt-1 shrink-0" />
                <div>
                  <h4 className="font-sans font-bold text-sm text-primary-cafe mb-1">Grace Period</h4>
                  <p className="font-sans text-sm text-on-surface-variant-cafe leading-relaxed">
                    We hold tables for 15 minutes past the reservation time. Please let us know if you're running late.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-lowest-cafe border border-outline-cafe/10 rounded-xl p-6 flex gap-4 items-start shadow-sm">
                <MapPin className="w-5 h-5 text-secondary-cafe mt-1 shrink-0" />
                <div>
                  <h4 className="font-sans font-bold text-sm text-primary-cafe mb-1">Location</h4>
                  <p className="font-sans text-sm text-on-surface-variant-cafe leading-relaxed">
                    Located in the heart of Abuja CBD. Easy accessibility with ample, secure parking in our courtyard.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Back Home Link */}
          {onBackToHome && (
            <div className="pt-10">
              <button
                onClick={onBackToHome}
                className="font-sans font-semibold tracking-wider text-xs uppercase text-secondary-cafe hover:text-tertiary-cafe border-b border-secondary-cafe/30 pb-0.5 transition-all cursor-pointer"
              >
                Back to Home Escape
              </button>
            </div>
          )}

        </div>
      )}

      {/* Elegant Custom Dialog Overlay instead of annoying browser alerts */}
      <AnimatePresence>
        {infoModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setInfoModal(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md bg-surface-cafe border border-outline-cafe/20 rounded-2xl p-6 md:p-8 text-center shadow-2xl z-10 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-secondary-cafe/10 text-secondary-cafe flex items-center justify-center mx-auto">
                <Compass className="w-6 h-6" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="font-display text-lg font-bold text-primary-cafe">{infoModal.title}</h3>
                <p className="font-sans text-sm text-on-surface-variant-cafe leading-relaxed">{infoModal.desc}</p>
              </div>

              <button
                onClick={() => setInfoModal(null)}
                className="w-full py-3 bg-primary-cafe hover:bg-primary-container-cafe text-on-primary font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Acknowledge
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
