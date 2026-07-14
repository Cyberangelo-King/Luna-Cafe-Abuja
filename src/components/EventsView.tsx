/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, Mail, Minus, Plus, Lock, CheckCircle, ArrowLeft, ArrowRight, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import { CommunityEvent } from '../types';
import { getStoredEvents } from '../services/cafeDataService';
import { EventCardSkeleton } from './SkeletonLoader';

interface EventsViewProps {
  onBackToHome?: () => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function EventsView({ onBackToHome, triggerToast }: EventsViewProps) {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);
  
  // Checkout State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [ticketQty, setTicketQty] = useState(2);
  const [isCompleted, setIsCompleted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  });

  const refreshEvents = () => {
    setEvents(getStoredEvents());
  };

  useEffect(() => {
    refreshEvents();
    
    // Subscribe to live owner-boardroom changes
    window.addEventListener('luna_events_updated', refreshEvents);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => {
      window.removeEventListener('luna_events_updated', refreshEvents);
      clearTimeout(timer);
    };
  }, []);

  const handleStartBooking = (event: CommunityEvent) => {
    setSelectedEvent(event);
    setFirstName('');
    setLastName('');
    setEmail('');
    setTicketQty(2);
    setIsCompleted(false);
  };

  const handlePaySecurely = (e: FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      if (triggerToast) {
        triggerToast("Please fill out your name and email to proceed with the booking.", 'error');
      }
      return;
    }
    // Generate randomized receipt details
    const randId = `LCA-PTN-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketRef(randId);
    setIsCompleted(true);
    if (triggerToast) {
      triggerToast(`Successfully secured spot for: ${selectedEvent?.title}`, 'success');
    }
  };

  const handleCloseBooking = () => {
    setSelectedEvent(null);
  };

  const calculateSubtotal = () => {
    if (!selectedEvent) return 0;
    if (selectedEvent.price === 'Free') return 0;
    return (selectedEvent.price as number) * ticketQty;
  };

  const calculateServiceCharge = () => {
    if (!selectedEvent || selectedEvent.price === 'Free') return 0;
    return 1500; // Fixed naira ticketing system charge
  };

  const calculateTotalPayable = () => {
    return calculateSubtotal() + calculateServiceCharge();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-16 py-12 md:py-20 animate-fadeIn">
      
      {!selectedEvent ? (
        /* LIST OF EVENTS */
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-outline-cafe/10 pb-6 gap-6 text-left">
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-primary-cafe mb-3 font-bold">Upcoming Gatherings</h1>
              <p className="font-sans text-base text-on-surface-variant-cafe max-w-xl leading-relaxed">
                Reserve your spot in our hushed, sunlit courtyard. Designed for deep connection, creative hands, and culinary discovery in Abuja CBD.
              </p>
            </div>
            
            <button
              onClick={() => {
                if (triggerToast) {
                  triggerToast("Calendar Feed Connected! Add LCA calendar to your Apple/Google Account.", 'success');
                }
              }}
              className="font-sans text-xs font-semibold tracking-wider uppercase text-secondary-cafe border border-secondary-cafe hover:bg-secondary-cafe/5 rounded px-4 py-2 transition-all cursor-pointer whitespace-nowrap"
            >
              View Calendar Feed
            </button>
          </div>

          {/* Bento Grid layout for events list */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {Array.from({ length: 2 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-lowest-cafe border border-outline-cafe/10 rounded-2xl">
              <CalendarIcon className="w-12 h-12 text-outline-cafe/30 mx-auto mb-3" />
              <p className="font-sans text-sm text-on-surface-variant-cafe font-semibold">No Scheduled Gatherings Yet</p>
              <p className="font-sans text-xs text-on-surface-variant-cafe/60 mt-1">Open the Staff Lounge to post your first event card.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {events.map(event => (
                <article
                  key={event.id}
                  className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl flex flex-col md:flex-row overflow-hidden hover:border-secondary-cafe/30 transition-all duration-300 shadow-sm hover:shadow-md text-left"
                >
                  {/* Left Date Side (Desktop-only ticket layout style) */}
                  <div className="md:w-1/3 bg-surface-container-cafe flex flex-col justify-between p-6 md:p-8 relative border-b md:border-b-0 md:border-r border-dashed border-outline-cafe/30 items-center text-center shrink-0">
                    <div className="space-y-1">
                      <div className="font-sans text-xs font-bold text-secondary-cafe tracking-widest uppercase">{event.month}</div>
                      <div className="font-display text-4xl text-primary-cafe font-bold">{event.date}</div>
                      <div className="font-sans text-xs text-on-surface-variant-cafe font-medium">{event.day}</div>
                    </div>
                    
                    <div className="mt-4 md:mt-auto">
                      <span className="font-sans text-lg font-bold text-primary-cafe block">
                        {event.price === 'Free' ? 'Free' : formatter.format(event.price)}
                      </span>
                    </div>

                    {/* Perforation Slit details */}
                    <div className="hidden md:block absolute -top-3.5 -right-3.5 w-7 h-7 bg-surface-cafe rounded-full border border-outline-cafe/15" />
                    <div className="hidden md:block absolute -bottom-3.5 -right-3.5 w-7 h-7 bg-surface-cafe rounded-full border border-outline-cafe/15" />
                  </div>

                  {/* Right Info Side */}
                  <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-between relative">
                    <div>
                      <div className="flex items-center gap-1.5 text-tertiary-cafe mb-3 opacity-90 text-xs font-bold tracking-wider uppercase font-sans">
                        <span className="w-2 h-2 rounded-full bg-secondary-cafe animate-pulse" /> {event.category}
                      </div>
                      <h3 className="font-display text-xl text-primary-cafe font-bold mb-3">{event.title}</h3>
                      <p className="font-sans text-sm text-on-surface-variant-cafe leading-relaxed mb-6 line-clamp-3">
                        {event.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto gap-4">
                      <div className="flex items-center gap-1 font-sans text-xs font-semibold text-on-surface-variant-cafe">
                        <Clock className="w-4 h-4 text-outline-cafe" /> {event.time}
                      </div>
                      <button
                        onClick={() => handleStartBooking(event)}
                        className="font-sans font-semibold tracking-wider uppercase text-xs text-secondary-cafe border border-secondary-cafe hover:bg-secondary-cafe hover:text-on-secondary rounded px-5 py-2.5 transition-all cursor-pointer shadow-sm"
                      >
                        {event.price === 'Free' ? 'RSVP Spot' : 'Get Tickets'}
                      </button>
                    </div>
                  </div>

                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* BOOKING FLOW VIEW */
        <div className="w-full max-w-6xl mx-auto animate-fadeIn">
          
          {/* Top navigation back button */}
          <div className="flex items-center mb-8 text-left">
            <button
              onClick={handleCloseBooking}
              className="text-on-surface-variant-cafe p-2 -ml-2 rounded-full hover:bg-surface-variant-cafe/50 transition-colors flex items-center justify-center cursor-pointer font-sans text-xs font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-5 h-5 mr-1 text-primary-cafe" /> Back to Gatherings
            </button>
          </div>

          {!isCompleted ? (
            /* ACTIVE FORM CHECKOUT PANEL */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
              
              {/* Form Input Fields (Left column) */}
              <div className="lg:col-span-7 bg-surface-container-lowest-cafe p-6 md:p-10 rounded-2xl border border-outline-cafe/15 shadow-sm">
                <h3 className="font-display text-xl text-primary-cafe mb-6 border-b border-outline-cafe/10 pb-4 font-bold">Guest Details</h3>
                
                <form onSubmit={handlePaySecurely} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">First Name</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Amina"
                        className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Last Name</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Bello"
                        className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Email Address (for ticket delivery)</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amina.bello@example.com"
                      className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors focus:outline-none"
                    />
                  </div>

                  {/* Quantity and dynamic pricing calculation details */}
                  <div className="pt-6 border-t border-outline-cafe/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-bold uppercase tracking-wider text-primary-cafe">Ticket Quantity</span>
                      <div className="flex items-center border border-outline-cafe/20 rounded-lg bg-surface-cafe">
                        <button
                          type="button"
                          onClick={() => setTicketQty(q => Math.max(1, q - 1))}
                          className="px-3 py-1.5 text-on-surface-variant-cafe hover:text-primary-cafe transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 font-sans font-bold text-sm border-x border-outline-cafe/20 min-w-[32px] text-center">
                          {ticketQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setTicketQty(q => q + 1)}
                          className="px-3 py-1.5 text-on-surface-variant-cafe hover:text-primary-cafe transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Secure checkout disclaimer */}
                  <div className="pt-6 border-t border-outline-cafe/10">
                    <div className="flex items-start gap-3 bg-surface-cafe/50 p-4 rounded-xl border border-outline-cafe/10">
                      <Lock className="w-5 h-5 text-secondary-cafe shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-sans text-xs font-bold text-primary-cafe uppercase tracking-wider">Secured Local Processing</p>
                        <p className="font-sans text-xs text-on-surface-variant-cafe leading-normal">
                          All payments are integrated directly with safe, encrypted, standard token endpoints. Your personal account metadata is fully protected.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Checkout Submission */}
                  <button
                    type="submit"
                    className="w-full bg-primary-cafe text-on-primary rounded-xl py-4 font-sans font-bold text-xs tracking-wider uppercase hover:bg-primary-container-cafe transition-all cursor-pointer shadow-md mt-6"
                  >
                    {selectedEvent.price === 'Free' ? 'RSVP Spot Free' : `Pay ${formatter.format(calculateTotalPayable())} Securely`}
                  </button>

                </form>
              </div>

              {/* Booking Summary Sidebar Detail (Right column) */}
              <div className="lg:col-span-5 bg-surface-container-low-cafe p-6 md:p-8 rounded-2xl border border-outline-cafe/15 sticky top-32">
                <h3 className="font-display text-lg text-primary-cafe mb-6 border-b border-outline-cafe/10 pb-4 font-bold">Booking Summary</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-outline-cafe/10">
                      <img
                        className="w-full h-full object-cover"
                        src={selectedEvent.imageUrl}
                        alt={selectedEvent.title}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-secondary-cafe bg-secondary-cafe/10 px-2.5 py-0.5 rounded-full">
                        {selectedEvent.category}
                      </span>
                      <h4 className="font-display text-base font-bold text-primary-cafe mt-1">{selectedEvent.title}</h4>
                      <p className="font-sans text-xs text-on-surface-variant-cafe mt-0.5">{selectedEvent.month} {selectedEvent.date}, {selectedEvent.time}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-outline-cafe/10 text-xs font-sans text-on-surface-variant-cafe">
                    <div className="flex justify-between">
                      <span>Rate per Guest</span>
                      <span className="font-semibold text-primary-cafe">
                        {selectedEvent.price === 'Free' ? 'Free' : formatter.format(selectedEvent.price as number)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity Selected</span>
                      <span className="font-bold text-primary-cafe">{ticketQty} Guests</span>
                    </div>
                    
                    {selectedEvent.price !== 'Free' && (
                      <>
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-semibold text-primary-cafe">{formatter.format(calculateSubtotal())}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ticketing service charge</span>
                          <span className="font-semibold text-primary-cafe">{formatter.format(calculateServiceCharge())}</span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-baseline pt-4 border-t border-outline-cafe/10 font-bold text-sm text-primary-cafe">
                      <span>Total Payable</span>
                      <span className="text-base text-secondary-cafe">
                        {selectedEvent.price === 'Free' ? 'Free' : formatter.format(calculateTotalPayable())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* CONGRATULATIONS SUCCESS VOUCHER SHEET */
            <div className="max-w-xl mx-auto bg-surface-container-lowest-cafe border border-outline-cafe/20 rounded-3xl p-8 md:p-12 text-center shadow-xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-secondary-cafe to-primary-cafe" />
              
              <div className="w-16 h-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl text-primary-cafe font-bold">You are Booked!</h3>
                <p className="font-sans text-xs text-secondary-cafe font-extrabold uppercase tracking-widest">A Cozy Seat Awaits</p>
                <p className="font-sans text-sm text-on-surface-variant-cafe max-w-sm mx-auto leading-relaxed pt-2">
                  We have secured {ticketQty} spots for <span className="font-bold text-primary-cafe">{selectedEvent.title}</span>. A luxury digital ticket PDF has been sent to <span className="font-bold text-primary-cafe">{email}</span>.
                </p>
              </div>

              {/* Simulated QR Code Pass */}
              <div className="border border-outline-cafe/10 p-6 rounded-2xl bg-surface-cafe/50 max-w-xs mx-auto space-y-4">
                <div className="flex items-center justify-between border-b border-outline-cafe/10 pb-3 text-left">
                  <div>
                    <p className="font-sans text-[10px] uppercase font-bold text-on-surface-variant-cafe/70">REFERENCE</p>
                    <p className="font-mono text-sm font-black text-primary-cafe">{ticketRef}</p>
                  </div>
                  <QrCode className="w-10 h-10 text-primary-cafe opacity-90" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-left text-xs font-sans">
                  <div>
                    <p className="text-[10px] text-on-surface-variant-cafe/60 font-bold uppercase">DATE</p>
                    <p className="font-semibold text-primary-cafe">{selectedEvent.month} {selectedEvent.date}, 2026</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant-cafe/60 font-bold uppercase">TIME</p>
                    <p className="font-semibold text-primary-cafe">{selectedEvent.time}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCloseBooking}
                  className="w-full py-3 border border-outline-cafe/20 hover:bg-surface-container-low-cafe text-primary-cafe font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Return to Gatherings
                </button>
                <button
                  onClick={() => {
                    if (onBackToHome) onBackToHome();
                  }}
                  className="w-full py-3 bg-primary-cafe hover:bg-primary-container-cafe text-on-primary font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0 shadow-md"
                >
                  Home Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
