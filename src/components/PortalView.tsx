/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, LayoutDashboard, Coffee, Calendar, FileText, Check, 
  Clock, ToggleLeft, ToggleRight, Trash2, Plus, RefreshCw, ChevronRight, X, AlertCircle,
  Smartphone, MessageSquare
} from 'lucide-react';
import { MenuItem, CommunityEvent, Reservation, Order, MenuCategory } from '../types';
import { 
  getStoredMenuItems, saveStoredMenuItems,
  getStoredEvents, saveStoredEvents,
  getStoredReservations, saveStoredReservations,
  getStoredOrders, saveStoredOrders 
} from '../services/cafeDataService';

interface PortalViewProps {
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function PortalView({ triggerToast }: PortalViewProps = {}) {
  const [activeTab, setActiveTab] = useState<'orders' | 'reservations' | 'menu' | 'events'>('orders');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Form states for creating new items
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<MenuCategory>('coffee');
  const [newItemImage, setNewItemImage] = useState('');

  // Form states for creating new events
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<'Art & Wine' | 'Community' | 'Music'>('Community');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventPrice, setNewEventPrice] = useState('');
  const [newEventDay, setNewEventDay] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventMonth, setNewEventMonth] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventImage, setNewEventImage] = useState('');

  // Loader state to simulate sync
  const [syncing, setSyncing] = useState(false);

  // Quick Notification Overlay for free dispatch pings
  const [notificationModal, setNotificationModal] = useState<{
    phone: string;
    name: string;
    details: string;
    code: string;
    type: 'order' | 'reservation';
    status: string;
  } | null>(null);

  const executeFreeNotification = (targetPhone: string, textPayload: string, commType: 'whatsapp' | 'sms') => {
    const cleaned = targetPhone.replace(/\D/g, '');
    let finalPhone = cleaned;
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      finalPhone = '234' + cleaned.slice(1);
    } else if (cleaned.length === 10 && !cleaned.startsWith('234')) {
      finalPhone = '234' + cleaned;
    }

    let url = '';
    if (commType === 'whatsapp') {
      url = finalPhone 
        ? `https://wa.me/${finalPhone}?text=${encodeURIComponent(textPayload)}`
        : `https://api.whatsapp.com/send?text=${encodeURIComponent(textPayload)}`;
    } else {
      url = `sms:${finalPhone || ''}?body=${encodeURIComponent(textPayload.replace(/\*/g, ''))}`;
    }

    window.open(url, '_blank');
    setNotificationModal(null);
    if (triggerToast) {
      triggerToast(`Opened native ${commType} intent!`, 'success');
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setMenuItems(getStoredMenuItems());
    setEvents(getStoredEvents());
    setReservations(getStoredReservations());
    setOrders(getStoredOrders());
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      loadAllData();
      setSyncing(false);
    }, 65000); // short simulation
  };

  // Status changers for orders
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updated = orders.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord);
    setOrders(updated);
    saveStoredOrders(updated);
  };

  // Status changers for reservations
  const updateReservationStatus = (resId: string, newStatus: Reservation['status']) => {
    const updated = reservations.map(res => res.id === resId ? { ...res, status: newStatus } : res);
    setReservations(updated);
    saveStoredReservations(updated);
  };

  // Toggle Menu Item Availability
  const toggleItemAvailability = (itemId: string) => {
    const updated = menuItems.map(item => 
      item.id === itemId ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item
    );
    setMenuItems(updated);
    saveStoredMenuItems(updated);
  };

  // Delete Menu Item
  const deleteMenuItem = (itemId: string) => {
    const updated = menuItems.filter(item => item.id !== itemId);
    setMenuItems(updated);
    saveStoredMenuItems(updated);
  };

  // Delete Event
  const deleteEvent = (eventId: string) => {
    const updated = events.filter(e => e.id !== eventId);
    setEvents(updated);
    saveStoredEvents(updated);
  };

  // Handle Menu Item Creation
  const handleCreateMenuItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const priceNum = parseFloat(newItemPrice);
    if (isNaN(priceNum)) return;

    const defaultImages: Record<MenuCategory, string> = {
      coffee: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpXZPKHKKGR-0I7o4Db4fMUdRIKW2AE36kgP6uvYmDur2iQ-_H67SA3STSNV-ikMKdDcn91JtkuCzmgoChHut_APD4xlSTfNAXno66GMNJYgoAFMZq2ZX-ID1ZefaIn29T4mgJ2thlHBOsvhzl91IOc2hHvzL8vsSQvJB1Qdo83NX2YWcB87bu2R5vWRVBBB7sLb6Pjb3FeqlF8045d93cp7slhl3ECSkhC2BT26e4kNGtlW2es1_Eag',
      waffles: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqInGEr4putBsouug9KPqudZ4E4XRRntdkujtZyaiwjsElAdN46D9lmuJiiRCci1L0A7o0oQzqZsmPkVApNAnyNrz8-RGPP7C-AzbYvxOmqd5iOs-atvR4VFBqQ7V4l1YLRvq2kwOCIfSUMf9LQ8F5Qb0bx4h9oUcuzRoLF22upVgnXoDkavxorcjzXqxAdRjDaOdHQqZXu_k6gJJzKIKGESF2Vs2A1-r0aMzCCY0JvjaAgzcWvNqThg',
      platters: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_PenHlK-TF2nIX3xB6if-aS8yZUnEaoXKyTP-2kbaZ_E88YBu94uYLjEBFAZwpwhR4A0FqXkdM8SiMWPcFmsq1IKKgWGjzjoIcTAztngb_zdQVgOPV647TUgsW7vJpkcq-ctbqSihoiqMKdHTGpDXOWr5tA3CCDNHAQ1cbGXnuxySqBvv3rnSl1xHL8-sBpGRzYBvUWvg4g-6deM3QZwvRoJ8NJRQqRlW-AEEq3wAQG1ElpnXRncMbQ'
    };

    const newItem: MenuItem = {
      id: `menu-custom-${Date.now()}`,
      name: newItemName,
      description: newItemDesc || 'Crafted fresh in house with premium local specialty ingredients.',
      price: priceNum,
      imageUrl: newItemImage || defaultImages[newItemCategory],
      category: newItemCategory,
      modifierCategory: newItemCategory === 'waffles' ? 'waffle' : newItemCategory === 'platters' ? 'platter' : 'coffee',
      isAvailable: true
    };

    const updated = [...menuItems, newItem];
    setMenuItems(updated);
    saveStoredMenuItems(updated);

    // Reset Form
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice('');
    setNewItemImage('');
  };

  // Handle Event Creation
  const handleCreateEvent = (e: FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDay || !newEventDate || !newEventMonth || !newEventTime) return;

    const eventPriceVal = newEventPrice === '' || newEventPrice.toLowerCase() === 'free' 
      ? 'Free' 
      : parseFloat(newEventPrice);

    const defaultEventImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqTvoHvZmN-G_1uiYCGJI20S5jDj6f9D8TLjTHhBXsdLin1kLapyDz7HZ9OgR_F93nZonX_Z1Q4CmMPhrAOi1At1o2E9IBPIiDqkeNKdun4xKFn4zitQGCFV2IS9RZSi0fnct46DGOqPhHYJ8Ex6nyFOaE97C8LK3VMa8bWInoChjdIH5v6F17apP_FxL8IRnU1CBtcUDSX0LPs31Sqj2zTHDczjV3iHFMMAXJTlJuu8DGOa6TzkYodg';

    const newEvent: CommunityEvent = {
      id: `event-custom-${Date.now()}`,
      title: newEventTitle,
      category: newEventCategory,
      description: newEventDesc || 'Gather in our signature courtyard for a spectacular session of local artisan craft.',
      price: eventPriceVal as any,
      date: parseInt(newEventDate) || 1,
      month: newEventMonth,
      day: newEventDay,
      time: newEventTime,
      imageUrl: newEventImage || defaultEventImage
    };

    const updated = [...events, newEvent];
    setEvents(updated);
    saveStoredEvents(updated);

    // Reset form
    setNewEventTitle('');
    setNewEventDesc('');
    setNewEventPrice('');
    setNewEventDay('');
    setNewEventDate('');
    setNewEventMonth('');
    setNewEventTime('');
    setNewEventImage('');
  };

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-12 py-8 text-left">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-outline-cafe/15 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-secondary-cafe/10 text-secondary-cafe">
              <LayoutDashboard className="w-4 h-4" />
            </span>
            <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-secondary-cafe">
              Live Staff Lounge
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-primary-cafe font-bold mt-1">
            Luna Staff Dashboard
          </h1>
          <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-1 leading-relaxed">
            Monitor incoming client orders, manage courtyard seatings, toggle menu availability, and notify guests for completely free.
          </p>
        </div>

        <button
          onClick={handleSync}
          className="flex items-center justify-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-primary-cafe border border-outline-cafe/20 bg-surface-container-low-cafe hover:bg-surface-container-cafe py-2 px-4 rounded-lg cursor-pointer transition-all self-start md:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-secondary-cafe' : ''}`} />
          {syncing ? 'Refreshing Live Feed...' : 'Sync Database'}
        </button>
      </div>

      {/* Grid of Key Performance Indexes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest-cafe border border-outline-cafe/10 rounded-xl p-4 shadow-sm">
          <p className="font-sans text-xs text-on-surface-variant-cafe/70 font-semibold uppercase tracking-wider">Active Orders</p>
          <p className="font-display text-2xl font-extrabold text-primary-cafe mt-1">
            {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}
          </p>
        </div>
        <div className="bg-surface-container-lowest-cafe border border-outline-cafe/10 rounded-xl p-4 shadow-sm">
          <p className="font-sans text-xs text-on-surface-variant-cafe/70 font-semibold uppercase tracking-wider">Pending Bookings</p>
          <p className="font-display text-2xl font-extrabold text-secondary-cafe mt-1">
            {reservations.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-surface-container-lowest-cafe border border-outline-cafe/10 rounded-xl p-4 shadow-sm">
          <p className="font-sans text-xs text-on-surface-variant-cafe/70 font-semibold uppercase tracking-wider">Active Menu Items</p>
          <p className="font-display text-2xl font-extrabold text-primary-cafe mt-1">
            {menuItems.length}
          </p>
        </div>
        <div className="bg-surface-container-lowest-cafe border border-outline-cafe/10 rounded-xl p-4 shadow-sm">
          <p className="font-sans text-xs text-on-surface-variant-cafe/70 font-semibold uppercase tracking-wider">Events Scheduled</p>
          <p className="font-display text-2xl font-extrabold text-primary-cafe mt-1">
            {events.length}
          </p>
        </div>
      </div>

      {/* Responsive Navigation Tabs with perfect contrast */}
      <div className="flex border-b border-outline-cafe/10 gap-2 mb-8 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 py-3 px-4 rounded-t-lg font-sans text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all shrink-0 ${
            activeTab === 'orders'
              ? 'text-secondary-cafe border-secondary-cafe bg-secondary-cafe/5'
              : 'text-on-surface-variant-cafe border-transparent hover:text-primary-cafe hover:bg-surface-container-low-cafe'
          }`}
        >
          <FileText className="w-4 h-4" />
          Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex items-center gap-2 py-3 px-4 rounded-t-lg font-sans text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all shrink-0 ${
            activeTab === 'reservations'
              ? 'text-secondary-cafe border-secondary-cafe bg-secondary-cafe/5'
              : 'text-on-surface-variant-cafe border-transparent hover:text-primary-cafe hover:bg-surface-container-low-cafe'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Reservations ({reservations.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-2 py-3 px-4 rounded-t-lg font-sans text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all shrink-0 ${
            activeTab === 'menu'
              ? 'text-secondary-cafe border-secondary-cafe bg-secondary-cafe/5'
              : 'text-on-surface-variant-cafe border-transparent hover:text-primary-cafe hover:bg-surface-container-low-cafe'
          }`}
        >
          <Coffee className="w-4 h-4" />
          Menu Items ({menuItems.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 py-3 px-4 rounded-t-lg font-sans text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition-all shrink-0 ${
            activeTab === 'events'
              ? 'text-secondary-cafe border-secondary-cafe bg-secondary-cafe/5'
              : 'text-on-surface-variant-cafe border-transparent hover:text-primary-cafe hover:bg-surface-container-low-cafe'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Calendar Events ({events.length})
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-lg text-primary-cafe font-bold">Client Meal Submissions</h2>
              <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-on-surface-variant-cafe/70 bg-surface-container-cafe px-2.5 py-1 rounded-full">
                Real-Time WebSockets Simulated
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-lowest-cafe border border-outline-cafe/10 rounded-2xl p-8">
                <FileText className="w-12 h-12 text-outline-cafe/30 mx-auto mb-4" />
                <p className="font-sans text-sm text-on-surface-variant-cafe font-semibold">No Client Orders Placed Yet</p>
                <p className="font-sans text-xs text-on-surface-variant-cafe/60 mt-1">Submit an order in the Checkout interface to watch it stream in live.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.slice().reverse().map((order) => {
                  const isPending = order.status === 'pending';
                  const isPreparing = order.status === 'preparing';
                  const isReady = order.status === 'ready';
                  const isCompleted = order.status === 'completed';
                  const isCancelled = order.status === 'cancelled';

                  return (
                    <div 
                      key={order.id} 
                      className={`bg-surface-container-lowest-cafe border rounded-2xl p-6 shadow-sm flex flex-col justify-between transition-all relative overflow-hidden ${
                        isPending ? 'border-amber-500/30' : isPreparing ? 'border-blue-500/30' : isReady ? 'border-green-500/30' : 'border-outline-cafe/15'
                      }`}
                    >
                      {/* Live Badge indicator */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                        <div className={`w-full h-full ${
                          isPending ? 'bg-amber-500' : isPreparing ? 'bg-blue-500' : isReady ? 'bg-green-600' : isCompleted ? 'bg-primary-cafe' : 'bg-red-500'
                        }`} />
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-start pt-2">
                          <div>
                            <span className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-secondary-cafe bg-secondary-cafe/10 px-2.5 py-0.5 rounded-full">
                              Code {order.code}
                            </span>
                            <h3 className="font-sans text-base text-primary-cafe font-bold mt-1">{order.name}</h3>
                            <p className="font-sans text-xs text-on-surface-variant-cafe/70">{order.phone} &bull; {order.diningType === 'dinein' ? 'Dine In' : 'Courtyard Pick-up'}</p>
                          </div>
                          
                          <span className={`font-sans text-[10px] uppercase font-black px-2.5 py-1 rounded-lg ${
                            isPending ? 'bg-amber-100 text-amber-800' :
                            isPreparing ? 'bg-blue-100 text-blue-800' :
                            isReady ? 'bg-green-100 text-green-800' :
                            isCompleted ? 'bg-primary-cafe/15 text-primary-cafe' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Order Items Summary */}
                        <div className="bg-surface-cafe rounded-xl p-3 space-y-1.5 border border-outline-cafe/5">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-baseline font-sans text-xs">
                              <span className="text-primary-cafe font-bold leading-tight">
                                {item.quantity}x {item.name}
                                {item.modifiers && item.modifiers.length > 0 && (
                                  <span className="block text-[10px] text-on-surface-variant-cafe/60 font-normal">
                                    + {item.modifiers.map(m => m.name).join(', ')}
                                  </span>
                                )}
                              </span>
                              <span className="text-on-surface-variant-cafe font-semibold shrink-0">
                                {formatter.format(item.total)}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-outline-cafe/10 pt-2 flex justify-between items-baseline text-xs font-bold text-primary-cafe">
                            <span>Total Charge {order.tip > 0 && <span className="font-normal text-[10px] text-secondary-cafe bg-secondary-cafe/10 px-1.5 rounded">(Includes Tip)</span>}</span>
                            <span>{formatter.format(order.total)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Actions for Owner (Mobile Touch Targets of 44px matched) */}
                      <div className="flex gap-2 pt-5 mt-4 border-t border-outline-cafe/10">
                        {isPending && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="flex-grow py-3 px-4 rounded-xl bg-amber-500 text-white font-sans text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-all hover:bg-amber-600 shadow-sm"
                          >
                            Prepare Meal
                          </button>
                        )}
                        {isPreparing && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="flex-grow py-3 px-4 rounded-xl bg-blue-500 text-white font-sans text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-all hover:bg-blue-600 shadow-sm"
                          >
                            Mark as Ready
                          </button>
                        )}
                        {isReady && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="flex-grow py-3 px-4 rounded-xl bg-green-600 text-white font-sans text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-all hover:bg-green-700 shadow-sm"
                          >
                            Settle &amp; Handover
                          </button>
                        )}
                        {!isCompleted && !isCancelled && (
                          <button
                            onClick={() => {
                              const itemsText = order.items.map(it => `${it.name} x${it.quantity}`).join(', ');
                              setNotificationModal({
                                type: 'order',
                                code: order.code,
                                name: order.name,
                                phone: order.phone,
                                status: order.status,
                                details: itemsText
                              });
                            }}
                            className="py-3 px-3.5 rounded-xl border border-secondary-cafe/40 text-secondary-cafe hover:bg-secondary-cafe/10 font-sans text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                            title="Notify Guest"
                          >
                            <MessageSquare className="w-4 h-4" /> Notify
                          </button>
                        )}
                        {!isCompleted && !isCancelled && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="py-3 px-3.5 rounded-xl border border-outline-cafe/20 hover:border-red-500 text-on-surface-variant-cafe hover:text-red-500 font-sans text-xs font-bold uppercase transition-all cursor-pointer"
                            aria-label="Cancel Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        {(isCompleted || isCancelled) && (
                          <span className="w-full text-center text-on-surface-variant-cafe/50 font-sans text-xs py-2 italic font-medium">
                            Order finalized on {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* RESERVATIONS TAB */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            <h2 className="font-display text-lg text-primary-cafe font-bold">Courtyard Bookings &amp; Layout</h2>
            
            {reservations.length === 0 ? (
              <div className="text-center py-16 bg-surface-container-lowest-cafe border border-outline-cafe/10 rounded-2xl p-8">
                <Calendar className="w-12 h-12 text-outline-cafe/30 mx-auto mb-4" />
                <p className="font-sans text-sm text-on-surface-variant-cafe font-semibold">No Current Reservations</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-outline-cafe/15 rounded-2xl bg-surface-container-lowest-cafe shadow-sm">
                <table className="w-full text-left font-sans border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low-cafe text-primary-cafe text-xs uppercase font-extrabold border-b border-outline-cafe/15">
                      <th className="py-4 px-6">Guest</th>
                      <th className="py-4 px-6">Time &amp; Date</th>
                      <th className="py-4 px-6">Party Size</th>
                      <th className="py-4 px-6">Requests</th>
                      <th className="py-4 px-6">Ref Code</th>
                      <th className="py-4 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-cafe/10 text-sm text-primary-cafe">
                    {reservations.slice().reverse().map((res) => (
                      <tr key={res.id} className="hover:bg-surface-container-low-cafe/50 transition-colors">
                        <td className="py-4 px-6 font-semibold">
                          <p>{res.guestName}</p>
                          <p className="text-xs text-on-surface-variant-cafe/60 font-normal">{res.guestEmail}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-secondary-cafe">{res.time}</p>
                          <p className="text-xs text-on-surface-variant-cafe/70">{res.date}</p>
                        </td>
                        <td className="py-4 px-6 font-bold">{res.guests} Pax</td>
                        <td className="py-4 px-6 max-w-xs text-xs text-on-surface-variant-cafe leading-snug">
                          {res.specialRequests || <span className="text-on-surface-variant-cafe/40 italic">None</span>}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-mono text-xs font-extrabold bg-surface-container-cafe px-2.5 py-1 rounded text-primary-cafe">
                            {res.reference}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            {res.status === 'pending' && (
                              <button
                                onClick={() => updateReservationStatus(res.id, 'confirmed')}
                                className="bg-green-600 text-white font-sans text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer hover:bg-green-700 transition-all shadow-sm"
                              >
                                Approve
                              </button>
                            )}
                            {res.status === 'confirmed' && (
                              <button
                                onClick={() => updateReservationStatus(res.id, 'seated')}
                                className="bg-primary-cafe text-white font-sans text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg cursor-pointer hover:bg-primary-container-cafe transition-all shadow-sm"
                              >
                                Seat Guest
                              </button>
                            )}
                            {res.status === 'seated' && (
                              <span className="font-sans text-[10px] font-extrabold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                                Seated at Table
                              </span>
                            )}
                            {res.status === 'cancelled' && (
                              <span className="font-sans text-[10px] font-extrabold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                                Cancelled
                              </span>
                            )}
                            {res.status !== 'seated' && res.status !== 'cancelled' && (
                              <button
                                onClick={() => {
                                  setNotificationModal({
                                    type: 'reservation',
                                    code: res.reference,
                                    name: res.guestName,
                                    phone: res.guestPhone || 'No Phone Number',
                                    status: res.status,
                                    details: `${res.guests} covers, Scheduled for ${res.date} at ${res.time}`
                                  });
                                }}
                                className="border border-secondary-cafe/40 hover:bg-secondary-cafe/10 text-secondary-cafe font-sans text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shrink-0"
                                title="Notify Guest"
                              >
                                <MessageSquare className="w-3.5 h-3.5" /> Notify
                              </button>
                            )}
                            {res.status !== 'seated' && res.status !== 'cancelled' && (
                              <button
                                onClick={() => updateReservationStatus(res.id, 'cancelled')}
                                className="border border-outline-cafe/20 hover:border-red-400 text-on-surface-variant-cafe hover:text-red-500 font-sans text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MENU ITEMS TAB */}
        {activeTab === 'menu' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Create New Menu Item Form */}
              <div className="lg:col-span-5 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl p-6 shadow-sm">
                <h3 className="font-display text-lg text-primary-cafe font-bold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-secondary-cafe" /> Craft New Recipe
                </h3>
                
                <form onSubmit={handleCreateMenuItem} className="space-y-4 font-sans text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-on-surface-variant-cafe uppercase">Item Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Avocado Toast Deluxe"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-on-surface-variant-cafe uppercase">Description</label>
                    <textarea
                      placeholder="Ingredients, culinary modifiers, artisan notes..."
                      value={newItemDesc}
                      onChange={(e) => setNewItemDesc(e.target.value)}
                      className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm h-20 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-on-surface-variant-cafe uppercase">Price (NGN)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="e.g. 5000"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-on-surface-variant-cafe uppercase">Category</label>
                      <select
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value as MenuCategory)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm cursor-pointer"
                      >
                        <option value="coffee">Coffee Craft</option>
                        <option value="waffles">Handcrafted Waffles</option>
                        <option value="platters">Abuja CBD Platters</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-on-surface-variant-cafe uppercase">Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="Paste high-res image link"
                      value={newItemImage}
                      onChange={(e) => setNewItemImage(e.target.value)}
                      className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm"
                    />
                    <p className="text-[10px] text-on-surface-variant-cafe/60 leading-none">Leave blank to assign our stunning default stock graphic.</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary-cafe hover:bg-primary-container-cafe text-on-primary font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm text-xs mt-2"
                  >
                    Publish to Client Menu
                  </button>
                </form>
              </div>

              {/* Right Column: Manage Live Menu Items */}
              <div className="lg:col-span-7 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-display text-lg text-primary-cafe font-bold">Active Board Menu</h3>
                
                <div className="divide-y divide-outline-cafe/10">
                  {menuItems.map((item) => {
                    const isAvailable = item.isAvailable !== false;
                    return (
                      <div key={item.id} className="py-4 flex justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-12 h-12 object-cover rounded-xl border border-outline-cafe/10" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className={`font-sans text-sm font-bold text-primary-cafe ${!isAvailable ? 'line-through opacity-50' : ''}`}>{item.name}</h4>
                            <p className="font-sans text-xs text-secondary-cafe font-bold">{formatter.format(item.price)}</p>
                            <span className="font-sans text-[10px] uppercase font-bold text-on-surface-variant-cafe/60">{item.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {/* Live Toggling with explicit button controls */}
                          <button
                            onClick={() => toggleItemAvailability(item.id)}
                            className="flex items-center gap-1 bg-surface-cafe border border-outline-cafe/15 px-2.5 py-1.5 rounded-lg font-sans text-[10px] font-extrabold uppercase transition-all hover:bg-surface-container-low-cafe cursor-pointer"
                          >
                            {isAvailable ? (
                              <>
                                <ToggleRight className="w-4 h-4 text-green-600" />
                                <span className="text-green-700">Available</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4 text-red-500" />
                                <span className="text-red-500">Sold Out</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="p-2 border border-outline-cafe/15 hover:border-red-400 text-on-surface-variant-cafe hover:text-red-500 rounded-lg transition-all cursor-pointer"
                            aria-label="Delete item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Create New Event Form */}
              <div className="lg:col-span-5 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl p-6 shadow-sm">
                <h3 className="font-display text-lg text-primary-cafe font-bold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-secondary-cafe" /> Schedule New Event
                </h3>
                
                <form onSubmit={handleCreateEvent} className="space-y-4 font-sans text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-on-surface-variant-cafe uppercase">Event Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abuja Jazz &amp; Coffee Jam"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-on-surface-variant-cafe uppercase">Event Description</label>
                    <textarea
                      placeholder="Activities, RSVP constraints, food menu perks..."
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm h-20 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-on-surface-variant-cafe uppercase">Date Number</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="31"
                        placeholder="e.g. 24"
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-on-surface-variant-cafe uppercase">Month Abbr</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Oct"
                        maxLength={3}
                        value={newEventMonth}
                        onChange={(e) => setNewEventMonth(e.target.value)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-on-surface-variant-cafe uppercase">Day of Week</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Saturday"
                        value={newEventDay}
                        onChange={(e) => setNewEventDay(e.target.value)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-on-surface-variant-cafe uppercase">Time Segment</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 6:30 PM"
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-on-surface-variant-cafe uppercase">Price / Entrance</label>
                      <input
                        type="text"
                        placeholder="e.g. 15000 or Free"
                        value={newEventPrice}
                        onChange={(e) => setNewEventPrice(e.target.value)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-on-surface-variant-cafe uppercase">Visual Motif</label>
                      <select
                        value={newEventCategory}
                        onChange={(e) => setNewEventCategory(e.target.value as any)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-lg px-3 py-2 text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe text-sm cursor-pointer"
                      >
                        <option value="Art & Wine">Art &amp; Wine Escape</option>
                        <option value="Music">Live Acoustics</option>
                        <option value="Community">Literary Community</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary-cafe hover:bg-primary-container-cafe text-on-primary font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm text-xs mt-2"
                  >
                    Deploy Courtyard Event
                  </button>
                </form>
              </div>

              {/* Right Column: Manage Live Events */}
              <div className="lg:col-span-7 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-display text-lg text-primary-cafe font-bold">Scheduled Gatherings</h3>
                
                <div className="divide-y divide-outline-cafe/10">
                  {events.map((evt) => (
                    <div key={evt.id} className="py-4 flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary-cafe/10 text-secondary-cafe font-display rounded-xl w-12 h-12 flex flex-col items-center justify-center font-bold">
                          <span className="text-[10px] uppercase font-bold tracking-widest">{evt.month}</span>
                          <span className="text-base font-black leading-none">{evt.date}</span>
                        </div>
                        <div>
                          <h4 className="font-sans text-sm font-bold text-primary-cafe">{evt.title}</h4>
                          <p className="font-sans text-xs text-on-surface-variant-cafe/70">{evt.day} &bull; {evt.time}</p>
                          <span className="font-sans text-[10px] font-semibold text-secondary-cafe italic">{evt.price === 'Free' ? 'Free Entrance' : formatter.format(evt.price as number)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteEvent(evt.id)}
                        className="p-2 border border-outline-cafe/15 hover:border-red-400 text-on-surface-variant-cafe hover:text-red-500 rounded-lg transition-all cursor-pointer"
                        aria-label="Remove Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* FREE GUEST DISPATCH MODAL TRIGGER */}
      <AnimatePresence>
        {notificationModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setNotificationModal(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-lg bg-surface-cafe border border-outline-cafe/20 rounded-2xl p-6 md:p-8 text-left shadow-2xl z-10 space-y-6"
            >
              <div className="flex justify-between items-start pb-4 border-b border-outline-cafe/15">
                <div>
                  <h3 className="font-display text-lg font-bold text-primary-cafe">Staff Dispatch Desk</h3>
                  <p className="font-sans text-xs text-on-surface-variant-cafe/70 mt-0.5">Notify guests about their active orders or seats for free</p>
                </div>
                <button
                  onClick={() => setNotificationModal(null)}
                  className="p-1 rounded-full text-on-surface-variant-cafe hover:bg-surface-container-low-cafe transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 font-sans text-xs text-on-surface-variant-cafe">
                <div className="grid grid-cols-2 gap-4 bg-surface-container-low-cafe/50 p-4 rounded-xl border border-outline-cafe/10">
                  <div>
                    <p className="font-bold text-[9px] uppercase tracking-wider text-outline-cafe">Patron</p>
                    <p className="font-semibold text-primary-cafe text-sm mt-0.5">{notificationModal.name}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[9px] uppercase tracking-wider text-outline-cafe">Phone Number</p>
                    <p className="font-semibold text-primary-cafe text-sm mt-0.5">{notificationModal.phone}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-[10px] uppercase tracking-wider text-primary-cafe">WhatsApp Dispatch Preview (100% Free)</p>
                  <div className="bg-green-50 border border-green-200 text-green-900 rounded-xl p-4 font-mono whitespace-pre-wrap text-[11px] leading-relaxed shadow-inner">
                    {`☕ *LUNA CAFE ABUJA* ☕\n\nHi *${notificationModal.name}*!\nYour ${notificationModal.type === 'order' ? 'order' : 'booking'} (*${notificationModal.code}*) is now: *${notificationModal.status.toUpperCase()}* 🌿\n\n📋 Details: ${notificationModal.details}\n\nSee you in our hushed CBD courtyard soon!`}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-[10px] uppercase tracking-wider text-primary-cafe">SMS Text Dispatch Preview (100% Free)</p>
                  <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-4 font-mono whitespace-pre-wrap text-[11px] leading-relaxed shadow-inner">
                    {`LUNA CAFE ABUJA\n\nHi ${notificationModal.name}!\nYour ${notificationModal.type === 'order' ? 'order' : 'booking'} (${notificationModal.code}) is now: ${notificationModal.status.toUpperCase()}.\nDetails: ${notificationModal.details}.\nSee you in our hushed CBD courtyard soon!`}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-cafe/15 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const textPayload = `☕ *LUNA CAFE ABUJA* ☕\n\nHi *${notificationModal.name}*!\nYour ${notificationModal.type === 'order' ? 'order' : 'booking'} (*${notificationModal.code}*) is now: *${notificationModal.status.toUpperCase()}* 🌿\n\n📋 Details: ${notificationModal.details}\n\nSee you in our hushed courtyard soon!`;
                    executeFreeNotification(notificationModal.phone, textPayload, 'whatsapp');
                  }}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-sans font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 border-0 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" /> Dispatch on WhatsApp
                </button>
                <button
                  onClick={() => {
                    const textPayload = `LUNA CAFE ABUJA\n\nHi ${notificationModal.name}!\nYour ${notificationModal.type === 'order' ? 'order' : 'booking'} (${notificationModal.code}) is now: ${notificationModal.status.toUpperCase()}.\nDetails: ${notificationModal.details}.\nSee you in our hushed courtyard soon!`;
                    executeFreeNotification(notificationModal.phone, textPayload, 'sms');
                  }}
                  className="w-full bg-primary-cafe hover:bg-primary-container-cafe text-on-primary font-sans font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 border-0 shadow-sm"
                >
                  <Smartphone className="w-4 h-4" /> Dispatch via Native SMS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
