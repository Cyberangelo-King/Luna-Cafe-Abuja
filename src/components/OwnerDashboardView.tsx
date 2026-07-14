/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, ShieldCheck, ChevronRight, LayoutDashboard, Coffee, Calendar, FileText, 
  Check, Clock, TrendingUp, DollarSign, Users, Award, Download, Sliders, 
  Smartphone, MessageSquare, Trash2, Plus, RefreshCw, X, AlertCircle, ToggleLeft, ToggleRight, CheckCircle2, ChevronLeft
} from 'lucide-react';
import { MenuItem, CommunityEvent, Reservation, Order, MenuCategory } from '../types';
import { 
  getStoredMenuItems, saveStoredMenuItems,
  getStoredEvents, saveStoredEvents,
  getStoredReservations, saveStoredReservations,
  getStoredOrders, saveStoredOrders 
} from '../services/cafeDataService';
import { getAuthConfig, saveAuthConfig, AuthConfig } from '../services/authService';
import PortalView from './PortalView';

interface OwnerDashboardViewProps {
  onBackToHome?: () => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function OwnerDashboardView({ onBackToHome, triggerToast }: OwnerDashboardViewProps) {
  // Passcode verification state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('lola_owner_auth') === 'true';
  });
  
  // Load Auth Config from local storage
  const [authConfig, setAuthConfig] = useState<AuthConfig>(getAuthConfig());
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'reservations' | 'menu' | 'events' | 'crm' | 'credentials' | 'staff-view'>('analytics');

  // Login inputs
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register inputs
  const [registerUsername, setRegisterUsername] = useState('admin');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('lola@lolascafe.ng');
  const [registerError, setRegisterError] = useState('');

  // Password recovery states
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<1 | 2 | 3>(1);
  const [simulatedResetCode, setSimulatedResetCode] = useState('');
  const [verificationCodeInput, setVerificationCodeInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  // Credentials change states (for logged-in owner dashboard)
  const [newOwnerUsername, setNewOwnerUsername] = useState(authConfig.ownerUsername);
  const [newOwnerPassword, setNewOwnerPassword] = useState(authConfig.ownerPasswordHash);
  const [newOwnerEmail, setNewOwnerEmail] = useState(authConfig.ownerEmail);

  const [newStaffUsername, setNewStaffUsername] = useState(authConfig.staffUsername);
  const [newStaffPassword, setNewStaffPassword] = useState(authConfig.staffPasswordHash);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Search and Filter States
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'>('all');
  const [resFilter, setResFilter] = useState<'all' | 'pending' | 'confirmed' | 'seated' | 'cancelled'>('all');
  const [crmSearch, setCrmSearch] = useState('');

  // Form states for creating new items
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<MenuCategory>('burgers');
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

  // Interactive Report Tool Selection
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders' | 'tips'>('revenue');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Quick Notification Overlay
  const [notificationModal, setNotificationModal] = useState<{
    phone: string;
    name: string;
    details: string;
    code: string;
    type: 'order' | 'reservation';
    status: string;
  } | null>(null);

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
      
      // Live event subscription
      const updateHandler = () => loadAllData();
      window.addEventListener('lola_orders_updated', updateHandler);
      window.addEventListener('lola_reservations_updated', updateHandler);
      window.addEventListener('lola_menu_updated', updateHandler);
      window.addEventListener('lola_events_updated', updateHandler);

      return () => {
        window.removeEventListener('lola_orders_updated', updateHandler);
        window.removeEventListener('lola_reservations_updated', updateHandler);
        window.removeEventListener('lola_menu_updated', updateHandler);
        window.removeEventListener('lola_events_updated', updateHandler);
      };
    }
  }, [isAuthenticated]);

  const loadAllData = () => {
    setMenuItems(getStoredMenuItems());
    setEvents(getStoredEvents());
    setReservations(getStoredReservations());
    setOrders(getStoredOrders());
  };

  // Auth handlers
  const handleOwnerRegister = (e: FormEvent) => {
    e.preventDefault();
    if (!registerUsername || !registerPassword || !registerEmail) {
      setRegisterError("Please fill in all registration fields.");
      return;
    }
    const updated: AuthConfig = {
      ownerRegistered: true,
      ownerUsername: registerUsername,
      ownerPasswordHash: registerPassword,
      ownerEmail: registerEmail,
      staffUsername: authConfig.staffUsername || 'staff',
      staffPasswordHash: authConfig.staffPasswordHash || 'lola2026',
    };
    setAuthConfig(updated);
    saveAuthConfig(updated);
    setIsAuthenticated(true);
    sessionStorage.setItem('lola_owner_auth', 'true');
    setRegisterError('');
    
    // Sync active inputs
    setNewOwnerUsername(updated.ownerUsername);
    setNewOwnerPassword(updated.ownerPasswordHash);
    setNewOwnerEmail(updated.ownerEmail);

    if (triggerToast) {
      triggerToast(`Registration Successful! Welcome, Lola (${registerUsername}).`, "success");
    }
  };

  const handleOwnerLogin = (e: FormEvent) => {
    e.preventDefault();
    if (loginUsername === authConfig.ownerUsername && loginPassword === authConfig.ownerPasswordHash) {
      setIsAuthenticated(true);
      sessionStorage.setItem('lola_owner_auth', 'true');
      setLoginError('');
      if (triggerToast) {
        triggerToast(`Boardroom Decrypted. Welcome back, ${authConfig.ownerUsername}!`, "success");
      }
    } else {
      setLoginError("Incorrect credentials. Intrusive access has been logged.");
    }
  };

  const handleSendRecoveryCode = (e: FormEvent) => {
    e.preventDefault();
    if (recoveryEmail.trim().toLowerCase() === authConfig.ownerEmail.trim().toLowerCase()) {
      const code = String(Math.floor(1000 + Math.random() * 9000));
      setSimulatedResetCode(code);
      setRecoveryStep(2);
      setRecoveryError('');
      if (triggerToast) {
        triggerToast(`Simulated dispatch code: ${code}`, "info");
      }
    } else {
      setRecoveryError("Email address does not match the registered owner's email.");
    }
  };

  const handleVerifyRecoveryCode = (e: FormEvent) => {
    e.preventDefault();
    if (verificationCodeInput.trim() === simulatedResetCode) {
      setRecoveryStep(3);
      setRecoveryError('');
      if (triggerToast) {
        triggerToast("Email ownership verified successfully!", "success");
      }
    } else {
      setRecoveryError("Invalid security token. Please inspect the simulated dispatch inbox.");
    }
  };

  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput) {
      setRecoveryError("Please enter a valid password.");
      return;
    }
    const updated: AuthConfig = {
      ...authConfig,
      ownerPasswordHash: newPasswordInput
    };
    setAuthConfig(updated);
    saveAuthConfig(updated);
    setIsAuthenticated(true);
    sessionStorage.setItem('lola_owner_auth', 'true');
    
    // Clear recovery states
    setIsRecoveryMode(false);
    setRecoveryEmail('');
    setRecoveryStep(1);
    setSimulatedResetCode('');
    setVerificationCodeInput('');
    setNewPasswordInput('');
    setRecoveryError('');

    // Sync active inputs
    setNewOwnerPassword(newPasswordInput);

    if (triggerToast) {
      triggerToast("Credentials successfully reset! Auto-authenticated to Boardroom.", "success");
    }
  };

  const handleUpdateCredentials = (e: FormEvent) => {
    e.preventDefault();
    const updated: AuthConfig = {
      ownerRegistered: true,
      ownerUsername: newOwnerUsername,
      ownerPasswordHash: newOwnerPassword,
      ownerEmail: newOwnerEmail,
      staffUsername: newStaffUsername,
      staffPasswordHash: newStaffPassword,
    };
    setAuthConfig(updated);
    saveAuthConfig(updated);
    if (triggerToast) {
      triggerToast("Lounge and board credentials successfully updated!", "success");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('lola_owner_auth');
    setLoginUsername('');
    setLoginPassword('');
  };

  // Status controls
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updated = orders.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord);
    setOrders(updated);
    saveStoredOrders(updated);
    if (triggerToast) triggerToast(`Order status marked as ${newStatus}`, "success");
  };

  const updateReservationStatus = (resId: string, newStatus: Reservation['status']) => {
    const updated = reservations.map(res => res.id === resId ? { ...res, status: newStatus } : res);
    setReservations(updated);
    saveStoredReservations(updated);
    if (triggerToast) triggerToast(`Reservation marked as ${newStatus}`, "success");
  };

  // Menu toggles
  const toggleItemAvailability = (itemId: string) => {
    const updated = menuItems.map(item => 
      item.id === itemId ? { ...item, isAvailable: item.isAvailable === false ? true : false } : item
    );
    setMenuItems(updated);
    saveStoredMenuItems(updated);
  };

  const deleteMenuItem = (itemId: string) => {
    const updated = menuItems.filter(item => item.id !== itemId);
    setMenuItems(updated);
    saveStoredMenuItems(updated);
  };

  const deleteEvent = (eventId: string) => {
    const updated = events.filter(e => e.id !== eventId);
    setEvents(updated);
    saveStoredEvents(updated);
  };

  // Create Handlers
  const handleCreateMenuItem = (e: FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      description: newItemDesc || 'Crafted daily by our courtyard pastry masters.',
      price: parseFloat(newItemPrice),
      category: newItemCategory,
      modifierCategory: 
        newItemCategory === 'burgers' ? 'burger' :
        newItemCategory === 'pizza' ? 'pizza' :
        newItemCategory === 'corndogs' ? 'corndog' :
        newItemCategory === 'fries_wings' ? 'wings' : 'boba',
      imageUrl: newItemImage || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=400',
      isAvailable: true
    };

    const currentItems = getStoredMenuItems();
    saveStoredMenuItems([...currentItems, newItem]);

    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice('');
    setNewItemImage('');
    if (triggerToast) triggerToast(`Menu Item: ${newItemName} added!`, 'success');
  };

  const handleCreateEvent = (e: FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventDay || !newEventDate || !newEventMonth || !newEventTime) return;

    const newEv: CommunityEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle,
      category: newEventCategory,
      description: newEventDesc || 'A lovely community meetup at Lola CBD courtyard.',
      price: newEventPrice === 'Free' || !newEventPrice ? 'Free' : parseFloat(newEventPrice),
      day: newEventDay,
      date: parseInt(newEventDate),
      month: newEventMonth,
      time: newEventTime,
      imageUrl: newEventImage || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600'
    };

    const currentEvents = getStoredEvents();
    saveStoredEvents([...currentEvents, newEv]);

    setNewEventTitle('');
    setNewEventDesc('');
    setNewEventPrice('');
    setNewEventDay('');
    setNewEventDate('');
    setNewEventMonth('');
    setNewEventTime('');
    setNewEventImage('');
    if (triggerToast) triggerToast(`Gathering: ${newEventTitle} published!`, 'success');
  };

  // Calculated Reporting Metrics
  const totalSales = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
  const totalTips = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.tip, 0);
  const totalActiveReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length;
  const activeOrdersCount = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;

  // Custom SVG report dataset mapping
  const reportDays = [
    { day: 'Mon', revenue: 95000, orders: 12, tips: 14000 },
    { day: 'Tue', revenue: 124000, orders: 16, tips: 18500 },
    { day: 'Wed', revenue: 88000, orders: 11, tips: 11000 },
    { day: 'Thu', revenue: 156000, orders: 19, tips: 22000 },
    { day: 'Fri', revenue: 210000, orders: 25, tips: 31000 },
    { day: 'Sat', revenue: 325000, orders: 38, tips: 48000 },
    { day: 'Sun', revenue: 280000, orders: 32, tips: 41000 },
  ];

  const getMetricMax = () => {
    if (chartMetric === 'revenue') return 350000;
    if (chartMetric === 'orders') return 45;
    return 55000;
  };

  const getMetricValue = (item: typeof reportDays[0]) => {
    return item[chartMetric];
  };

  // Customer CRM data mapping
  const getCustomerCRM = () => {
    const customerMap = new Map<string, { name: string; phone: string; email: string; orderCount: number; spend: number }>();
    
    // Map from stored orders
    orders.forEach(ord => {
      const emailKey = ord.email || ord.phone || 'Unknown';
      if (customerMap.has(emailKey)) {
        const prev = customerMap.get(emailKey)!;
        customerMap.set(emailKey, {
          ...prev,
          orderCount: prev.orderCount + 1,
          spend: prev.spend + ord.total
        });
      } else {
        customerMap.set(emailKey, {
          name: ord.name,
          phone: ord.phone,
          email: ord.email || 'None Provided',
          orderCount: 1,
          spend: ord.total
        });
      }
    });

    // Add some default active repeat clients if map is light
    if (customerMap.size <= 1) {
      customerMap.set('amina.b@example.com', { name: 'Amina Bello', phone: '08099887766', email: 'amina.b@example.com', orderCount: 5, spend: 84000 });
      customerMap.set('fatima.y@example.com', { name: 'Fatima Yar’Adua', phone: '08129876543', email: 'fatima.y@example.com', orderCount: 3, spend: 41200 });
      customerMap.set('chinedu@example.com', { name: 'Chinedu Okafor', phone: '08031234567', email: 'chinedu@example.com', orderCount: 2, spend: 32500 });
    }

    const list = Array.from(customerMap.values());
    if (crmSearch) {
      return list.filter(c => 
        c.name.toLowerCase().includes(crmSearch.toLowerCase()) || 
        c.phone.includes(crmSearch) || 
        c.email.toLowerCase().includes(crmSearch.toLowerCase())
      );
    }
    return list;
  };

  // Popular items tally
  const getPopularItems = () => {
    const itemScores = new Map<string, { count: number; rev: number }>();
    orders.forEach(o => {
      o.items.forEach(it => {
        if (itemScores.has(it.name)) {
          const prev = itemScores.get(it.name)!;
          itemScores.set(it.name, { count: prev.count + it.quantity, rev: prev.rev + it.total });
        } else {
          itemScores.set(it.name, { count: it.quantity, rev: it.total });
        }
      });
    });

    // Fallbacks
    if (itemScores.size === 0) {
      return [
        { name: 'The Lola Cortado', count: 24, rev: 108000 },
        { name: 'Sourdough & Organic Eggs Platter', count: 18, rev: 144000 },
        { name: 'Hushed Courtyard Waffles', count: 15, rev: 112500 },
      ];
    }

    return Array.from(itemScores.entries())
      .map(([name, data]) => ({ name, count: data.count, rev: data.rev }))
      .sort((a, b) => b.count - a.count);
  };

  // Safe Universal Notify Function (opens prefilled text window natively)
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
      triggerToast(`Fired native ${commType} intent! completely free.`, 'success');
    }
  };

  const handleOpenNotifier = (type: 'order' | 'reservation', code: string, name: string, phone: string, status: string, details: string) => {
    setNotificationModal({
      type,
      code,
      name,
      phone,
      status,
      details
    });
  };

  // CSV Report Generator (Simulated client export file)
  const handleExportReports = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Owner Report,Lola's Cafe Abuja,Generated: 2026\n\n";
    csvContent += "REPORT METRICS\n";
    csvContent += `Total Completed Sales,${totalSales} NGN\n`;
    csvContent += `Staff Appreciation Tips,${totalTips} NGN\n`;
    csvContent += `Active Seatings Count,${totalActiveReservations}\n\n`;
    
    csvContent += "WEEKLY REVENUE BREAKDOWN\n";
    csvContent += "Day,Revenue (NGN),Orders,Tips (NGN)\n";
    reportDays.forEach(d => {
      csvContent += `${d.day},${d.revenue},${d.orders},${d.tips}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lola_cafe_owner_report_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (triggerToast) {
      triggerToast("Bespoke report compiled and saved to device downloads!", "success");
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface-cafe">
      
      {/* SECURITY ACCESS GATE IF NOT AUTHENTICATED */}
      {!isAuthenticated ? (
        <div className="w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[85vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-surface-container-lowest-cafe border border-outline-cafe/20 rounded-3xl p-6 md:p-10 text-center shadow-xl space-y-6"
          >
            <div className="w-14 h-14 bg-primary-cafe text-secondary-container-cafe rounded-full flex items-center justify-center mx-auto border border-outline-cafe/15 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>

            {/* PASSWORD RECOVERY INTERACTIVE MODE */}
            {isRecoveryMode ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="font-display text-xl text-primary-cafe font-bold">Credential Recovery</h1>
                  <p className="font-sans text-xs text-on-surface-variant-cafe leading-relaxed">
                    Verify ownership of the registered email to bypass security and instantly set a new Boardroom access password.
                  </p>
                </div>

                {recoveryStep === 1 && (
                  <form onSubmit={handleSendRecoveryCode} className="space-y-4 text-left">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant-cafe/80">Registered Email</label>
                      <input
                        type="email"
                        required
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="Enter registered email..."
                        className="w-full bg-surface-cafe border border-outline-cafe/20 rounded-xl px-4 py-2.5 font-sans text-sm text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe"
                      />
                      {recoveryError && (
                        <p className="font-sans text-[11px] text-red-500 font-medium text-center mt-1 flex items-center justify-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {recoveryError}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary-cafe text-on-primary rounded-xl py-3 font-sans font-bold text-xs tracking-wider uppercase hover:bg-primary-container-cafe transition-all cursor-pointer shadow-sm"
                    >
                      Dispatch Security Token
                    </button>
                  </form>
                )}

                {recoveryStep === 2 && (
                  <form onSubmit={handleVerifyRecoveryCode} className="space-y-4 text-left">
                    <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-3 text-[11px] font-mono whitespace-pre-wrap leading-relaxed space-y-1">
                      <p className="font-bold uppercase tracking-wide text-blue-800">[SIMULATION ENGINE STATUS: DISPATCHED]</p>
                      <p>An email was routed to: <span className="underline">{authConfig.ownerEmail}</span></p>
                      <p className="font-black bg-blue-100 px-1.5 py-0.5 rounded text-blue-950 inline-block mt-1">Verification Code: {simulatedResetCode}</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant-cafe/80">4-Digit Security Code</label>
                      <input
                        type="text"
                        required
                        maxLength={4}
                        value={verificationCodeInput}
                        onChange={(e) => setVerificationCodeInput(e.target.value)}
                        placeholder="Enter 4-digit code..."
                        className="w-full bg-surface-cafe border border-outline-cafe/20 rounded-xl px-4 py-2.5 font-sans text-sm text-center tracking-widest text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe"
                      />
                      {recoveryError && (
                        <p className="font-sans text-[11px] text-red-500 font-medium text-center mt-1 flex items-center justify-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {recoveryError}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-700 hover:bg-green-800 text-white rounded-xl py-3 font-sans font-bold text-xs tracking-wider uppercase transition-all cursor-pointer shadow-sm"
                    >
                      Verify Token
                    </button>
                  </form>
                )}

                {recoveryStep === 3 && (
                  <form onSubmit={handleResetPassword} className="space-y-4 text-left">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant-cafe/80">New Boardroom Password</label>
                      <input
                        type="password"
                        required
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        placeholder="Enter new password..."
                        className="w-full bg-surface-cafe border border-outline-cafe/20 rounded-xl px-4 py-2.5 font-sans text-sm text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary-cafe text-on-primary rounded-xl py-3 font-sans font-bold text-xs tracking-wider uppercase hover:bg-primary-container-cafe transition-all cursor-pointer shadow-sm"
                    >
                      Save &amp; Enter Lounge
                    </button>
                  </form>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryMode(false);
                    setRecoveryStep(1);
                    setRecoveryError('');
                  }}
                  className="font-sans text-[11px] text-on-surface-variant-cafe/70 hover:text-primary-cafe underline block mx-auto pt-2"
                >
                  Back to Login
                </button>
              </div>
            ) : !authConfig.ownerRegistered ? (
              
              /* OWNER INITIAL REGISTRATION FLOW */
              <div className="space-y-4">
                <div className="space-y-1">
                  <h1 className="font-display text-xl text-primary-cafe font-bold">Register Owner Boardroom</h1>
                  <p className="font-sans text-xs text-secondary-cafe font-extrabold uppercase tracking-widest">Lola's Secure Desk</p>
                  <p className="font-sans text-[11px] text-on-surface-variant-cafe leading-relaxed max-w-sm mx-auto">
                    Welcome, Lola. Create your master owner credentials. This email enables secure retrieval if details are updated.
                  </p>
                </div>

                <form onSubmit={handleOwnerRegister} className="space-y-3 text-left">
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[9px] font-bold uppercase tracking-wider text-on-surface-variant-cafe/80">Master Username</label>
                    <input
                      type="text"
                      required
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-4 py-2 text-primary-cafe font-sans text-xs focus:outline-none focus:border-secondary-cafe"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[9px] font-bold uppercase tracking-wider text-on-surface-variant-cafe/80">Owner Email</label>
                    <input
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="e.g. faithakinboyejo@gmail.com"
                      className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-4 py-2 text-primary-cafe font-sans text-xs focus:outline-none focus:border-secondary-cafe"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[9px] font-bold uppercase tracking-wider text-on-surface-variant-cafe/80">Master Password</label>
                    <input
                      type="password"
                      required
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      placeholder="Choose private password..."
                      className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-4 py-2 text-primary-cafe font-sans text-xs focus:outline-none focus:border-secondary-cafe"
                    />
                  </div>

                  {registerError && (
                    <p className="font-sans text-[11px] text-red-500 font-medium text-center mt-1 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {registerError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-primary-cafe text-on-primary rounded-xl py-3 font-sans font-bold text-xs tracking-wider uppercase hover:bg-primary-container-cafe transition-all cursor-pointer shadow-md mt-2"
                  >
                    Register and Initialize
                  </button>
                </form>
              </div>
            ) : (
              
              /* STANDARD OWNER LOGIN FLOW */
              <div className="space-y-4">
                <div className="space-y-1">
                  <h1 className="font-display text-xl text-primary-cafe font-bold">Owner's Boardroom</h1>
                  <p className="font-sans text-xs text-secondary-cafe font-extrabold uppercase tracking-widest">Lola's Sanctuary</p>
                  <p className="font-sans text-[11px] text-on-surface-variant-cafe leading-relaxed max-w-sm mx-auto">
                    Enter the master credentials set during registration to gain administrative access.
                  </p>
                </div>

                <form onSubmit={handleOwnerLogin} className="space-y-3.5 text-left">
                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[9px] font-bold uppercase tracking-wider text-on-surface-variant-cafe/80">Username</label>
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="Username..."
                      className="w-full bg-surface-cafe border border-outline-cafe/20 rounded-xl px-4 py-2.5 font-sans text-xs text-primary-cafe focus:outline-none focus:border-secondary-cafe"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-sans text-[9px] font-bold uppercase tracking-wider text-on-surface-variant-cafe/80">Password</label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Password..."
                      className="w-full bg-surface-cafe border border-outline-cafe/20 rounded-xl px-4 py-2.5 font-sans text-xs text-primary-cafe focus:outline-none focus:border-secondary-cafe"
                    />
                  </div>

                  {loginError && (
                    <p className="font-sans text-[11px] text-red-500 font-medium text-center mt-1 flex items-center justify-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {loginError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-primary-cafe text-on-primary rounded-xl py-3 font-sans font-bold text-xs tracking-wider uppercase hover:bg-primary-container-cafe transition-all cursor-pointer shadow-md mt-2"
                  >
                    Authenticate Owner
                  </button>
                </form>

                <div className="pt-2 flex justify-between items-center text-[10px] text-on-surface-variant-cafe/70">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRecoveryMode(true);
                      setRecoveryStep(1);
                      setRecoveryError('');
                    }}
                    className="hover:text-primary-cafe underline cursor-pointer"
                  >
                    Forgot Credentials or Reset?
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-outline-cafe/10">
              <button
                onClick={onBackToHome}
                className="font-sans text-[11px] font-bold text-on-surface-variant-cafe hover:text-primary-cafe transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                Return to Escape Home
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        
        /* THE EXCLUSIVE PRIVILEGED OWNER PORTAL */
        <div className="w-full max-w-7xl mx-auto px-4 md:px-16 py-10 md:py-16 space-y-10 animate-fadeIn text-left">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-outline-cafe/15 pb-8 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-secondary-cafe/10 text-secondary-cafe text-[9px] uppercase tracking-widest font-black px-2.5 py-1 rounded-full border border-secondary-cafe/20 flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3 h-3" /> Private Boardroom
                </span>
                <span className="font-sans text-xs text-on-surface-variant-cafe/60 font-semibold">Lola's Office</span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl text-primary-cafe font-extrabold tracking-tight">Lola Control &amp; Analytics</h1>
              <p className="font-sans text-sm text-on-surface-variant-cafe mt-1 max-w-xl">
                Real-time financial audits, menu modification systems, courtyard capacity monitors, and free WhatsApp CRM notify platforms.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="font-sans text-[10px] font-bold tracking-wider uppercase border border-outline-cafe/30 text-on-surface-variant-cafe hover:bg-surface-container-low-cafe px-4 py-2.5 rounded-lg transition-all"
              >
                Lock Boardroom
              </button>
              <button
                onClick={onBackToHome}
                className="font-sans text-[10px] font-black tracking-wider uppercase bg-primary-cafe hover:bg-primary-container-cafe text-on-primary px-5 py-2.5 rounded-lg transition-all shadow-sm"
              >
                Exit to Cafe
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-on-surface-variant-cafe/70">
                <span className="font-sans text-xs font-bold uppercase tracking-wider">Completed Sales</span>
                <TrendingUp className="w-4 h-4 text-secondary-cafe" />
              </div>
              <p className="font-display text-2xl md:text-3xl font-black text-primary-cafe">{formatter.format(totalSales)}</p>
              <p className="font-sans text-[10px] text-green-600 font-semibold flex items-center gap-0.5">
                &bull; Live Decrypted Data
              </p>
            </div>

            <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-on-surface-variant-cafe/70">
                <span className="font-sans text-xs font-bold uppercase tracking-wider">Barista Tip Box</span>
                <Award className="w-4 h-4 text-yellow-600" />
              </div>
              <p className="font-display text-2xl md:text-3xl font-black text-primary-cafe">{formatter.format(totalTips)}</p>
              <p className="font-sans text-[10px] text-secondary-cafe font-semibold">
                100% directly shared with crew
              </p>
            </div>

            <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-on-surface-variant-cafe/70">
                <span className="font-sans text-xs font-bold uppercase tracking-wider">Active Bookings</span>
                <Calendar className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="font-display text-2xl md:text-3xl font-black text-primary-cafe">{totalActiveReservations}</p>
              <p className="font-sans text-[10px] text-on-surface-variant-cafe/60">
                Confirmed courtyard seats
              </p>
            </div>

            <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-center text-on-surface-variant-cafe/70">
                <span className="font-sans text-xs font-bold uppercase tracking-wider">Kitchen Queue</span>
                <Clock className="w-4 h-4 text-orange-500" />
              </div>
              <p className="font-display text-2xl md:text-3xl font-black text-primary-cafe">{activeOrdersCount}</p>
              <p className="font-sans text-[10px] text-orange-600 font-semibold animate-pulse">
                Orders preparing / ready
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-outline-cafe/15 flex flex-wrap gap-2 md:gap-4">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 px-2 font-sans font-extrabold text-xs tracking-wider uppercase transition-all relative ${
                activeTab === 'analytics' ? 'text-secondary-cafe' : 'text-on-surface-variant-cafe/70 hover:text-primary-cafe'
              }`}
            >
              📊 Reporting Desk
              {activeTab === 'analytics' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-cafe" />}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 px-2 font-sans font-extrabold text-xs tracking-wider uppercase transition-all relative flex items-center gap-1.5 ${
                activeTab === 'orders' ? 'text-secondary-cafe' : 'text-on-surface-variant-cafe/70 hover:text-primary-cafe'
              }`}
            >
              ☕ Orders Monitor
              {activeOrdersCount > 0 && (
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
              )}
              {activeTab === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-cafe" />}
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`pb-3 px-2 font-sans font-extrabold text-xs tracking-wider uppercase transition-all relative ${
                activeTab === 'reservations' ? 'text-secondary-cafe' : 'text-on-surface-variant-cafe/70 hover:text-primary-cafe'
              }`}
            >
              📅 Seats &amp; Courtyard
              {activeTab === 'reservations' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-cafe" />}
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`pb-3 px-2 font-sans font-extrabold text-xs tracking-wider uppercase transition-all relative ${
                activeTab === 'menu' ? 'text-secondary-cafe' : 'text-on-surface-variant-cafe/70 hover:text-primary-cafe'
              }`}
            >
              🍳 Menu Modifier
              {activeTab === 'menu' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-cafe" />}
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`pb-3 px-2 font-sans font-extrabold text-xs tracking-wider uppercase transition-all relative ${
                activeTab === 'events' ? 'text-secondary-cafe' : 'text-on-surface-variant-cafe/70 hover:text-primary-cafe'
              }`}
            >
              🎨 Gatherings Publisher
              {activeTab === 'events' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-cafe" />}
            </button>
            <button
              onClick={() => setActiveTab('crm')}
              className={`pb-3 px-2 font-sans font-extrabold text-xs tracking-wider uppercase transition-all relative ${
                activeTab === 'crm' ? 'text-secondary-cafe' : 'text-on-surface-variant-cafe/70 hover:text-primary-cafe'
              }`}
            >
              👤 CRM Directory
              {activeTab === 'crm' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-cafe" />}
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`pb-3 px-2 font-sans font-extrabold text-xs tracking-wider uppercase transition-all relative ${
                activeTab === 'credentials' ? 'text-secondary-cafe' : 'text-on-surface-variant-cafe/70 hover:text-primary-cafe'
              }`}
            >
              🔑 Credentials &amp; Access
              {activeTab === 'credentials' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-cafe" />}
            </button>
            <button
              onClick={() => setActiveTab('staff-view')}
              className={`pb-3 px-2 font-sans font-extrabold text-xs tracking-wider uppercase transition-all relative ${
                activeTab === 'staff-view' ? 'text-secondary-cafe' : 'text-on-surface-variant-cafe/70 hover:text-primary-cafe'
              }`}
            >
              🚪 Staff Lounge View
              {activeTab === 'staff-view' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary-cafe" />}
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div className="space-y-8">
            
            {/* 1. REPORTING & ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* SVG Live Graphic Chart */}
                <div className="lg:col-span-8 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-display text-lg font-bold text-primary-cafe flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-secondary-cafe" /> Weekly Performance Tally
                      </h3>
                      <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-0.5">Interactive metric analysis. Click parameters to change graphics.</p>
                    </div>

                    <div className="flex border border-outline-cafe/20 rounded-xl overflow-hidden bg-surface-cafe">
                      {(['revenue', 'orders', 'tips'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setChartMetric(type)}
                          className={`px-3 py-2 font-sans font-bold text-[10px] uppercase tracking-wider transition-colors border-r last:border-r-0 border-outline-cafe/20 ${
                            chartMetric === type 
                              ? 'bg-primary-cafe text-on-primary' 
                              : 'text-on-surface-variant-cafe hover:bg-surface-container-low-cafe'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fully Bespoke High-Craft SVG Chart */}
                  <div className="relative w-full h-[260px] border border-outline-cafe/10 rounded-2xl bg-surface-cafe/40 p-4 pt-10 flex flex-col justify-between">
                    <div className="absolute top-3 left-4 text-[10px] font-mono text-outline-cafe/80 uppercase font-bold tracking-widest">
                      Metric: {chartMetric.toUpperCase()}
                    </div>

                    <svg className="w-full h-[180px]" viewBox="0 0 700 180" preserveAspectRatio="none">
                      {/* Grid lines */}
                      <line x1="0" y1="30" x2="700" y2="30" stroke="#E2E2D5" strokeDasharray="4 4" strokeWidth="0.5" />
                      <line x1="0" y1="90" x2="700" y2="90" stroke="#E2E2D5" strokeDasharray="4 4" strokeWidth="0.5" />
                      <line x1="0" y1="150" x2="700" y2="150" stroke="#E2E2D5" strokeDasharray="4 4" strokeWidth="0.5" />

                      {/* Bar charts or Area line chart mapping */}
                      {reportDays.map((d, index) => {
                        const val = getMetricValue(d);
                        const max = getMetricMax();
                        const percent = val / max;
                        const barHeight = Math.max(10, percent * 140);
                        const x = 50 + index * 90;
                        const y = 160 - barHeight;

                        return (
                          <g key={d.day}>
                            {/* Hoverable background trigger column */}
                            <rect
                              x={x - 25}
                              y="0"
                              width="50"
                              height="170"
                              fill="transparent"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredBar(index)}
                              onMouseLeave={() => setHoveredBar(null)}
                            />

                            {/* Main Colored Rounded Bar */}
                            <rect
                              x={x - 12}
                              y={y}
                              width="24"
                              height={barHeight}
                              rx="6"
                              className={`transition-all duration-300 ${
                                hoveredBar === index 
                                  ? 'fill-secondary-cafe filter drop-shadow-sm' 
                                  : chartMetric === 'revenue' 
                                    ? 'fill-primary-cafe' 
                                    : chartMetric === 'orders' 
                                      ? 'fill-indigo-700' 
                                      : 'fill-yellow-600'
                              }`}
                            />

                            {/* Label underneath */}
                            <text
                              x={x}
                              y="174"
                              textAnchor="middle"
                              className="font-mono text-[10px] font-bold fill-on-surface-variant-cafe/80 uppercase"
                            >
                              {d.day}
                            </text>

                            {/* Dynamic tooltip popup above bar */}
                            {hoveredBar === index && (
                              <g>
                                <rect
                                  x={x - 45}
                                  y={y - 32}
                                  width="90"
                                  height="24"
                                  rx="4"
                                  fill="#26422F"
                                />
                                <text
                                  x={x}
                                  y={y - 16}
                                  textAnchor="middle"
                                  fill="#FFFFFF"
                                  className="font-mono text-[9px] font-bold"
                                >
                                  {chartMetric === 'revenue' || chartMetric === 'tips' ? formatter.format(val) : `${val} orders`}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </svg>

                    <div className="flex justify-between border-t border-outline-cafe/15 pt-2 font-mono text-[9px] text-on-surface-variant-cafe/70 uppercase">
                      <span>Mon &bull; Jul 13</span>
                      <span>Avg Core: {chartMetric === 'revenue' ? '184k NGN' : chartMetric === 'orders' ? '21 items' : '26k tips'}</span>
                      <span>Sun &bull; Jul 19</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-cafe/30 border border-outline-cafe/10 p-4 rounded-xl gap-4">
                    <div className="text-left">
                      <p className="font-sans text-xs font-bold text-primary-cafe uppercase tracking-wider">Simulated CSV Exporter</p>
                      <p className="font-sans text-[11px] text-on-surface-variant-cafe/80">Compile total order revenues, tips box, and reservations data into clean spreadsheets.</p>
                    </div>
                    <button
                      onClick={handleExportReports}
                      className="bg-primary-cafe text-on-primary font-sans font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border-0 shadow-sm whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Spreadsheet (CSV)
                    </button>
                  </div>
                </div>

                {/* Popularity Metrics Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Popular items distribution */}
                  <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-6 shadow-sm space-y-4">
                    <h4 className="font-display text-sm font-bold text-primary-cafe uppercase tracking-wider flex items-center gap-1.5">
                      <Coffee className="w-4 h-4 text-secondary-cafe" /> Popular Orders Tally
                    </h4>
                    
                    <div className="space-y-4 pt-2">
                      {getPopularItems().slice(0, 4).map((item, i) => (
                        <div key={item.name} className="space-y-1">
                          <div className="flex justify-between font-sans text-xs font-bold text-primary-cafe">
                            <span className="truncate pr-2">{item.name}</span>
                            <span className="text-secondary-cafe">{item.count} items</span>
                          </div>
                          <div className="w-full bg-surface-cafe h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary-cafe h-full rounded-full transition-all duration-500" 
                              style={{ width: `${Math.min(100, (item.count / 40) * 100)}%` }}
                            />
                          </div>
                          <p className="font-sans text-[10px] text-on-surface-variant-cafe/60 text-right font-medium">Revenue: {formatter.format(item.rev)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Administration Console */}
                  <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-6 shadow-sm space-y-4">
                    <h4 className="font-display text-sm font-bold text-primary-cafe uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-secondary-cafe" /> Courtyard Console
                    </h4>
                    
                    <div className="space-y-3 pt-1 text-xs font-sans">
                      <div className="p-3 bg-surface-cafe/50 border border-outline-cafe/10 rounded-xl space-y-1">
                        <span className="font-bold uppercase tracking-wider text-primary-cafe text-[10px]">Courtyard Status</span>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-green-700 font-semibold flex items-center gap-1">🌿 Sunlit &amp; Open</span>
                          <span className="text-[10px] text-on-surface-variant-cafe font-bold uppercase">Toggle Status</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-surface-cafe/50 border border-outline-cafe/10 rounded-xl space-y-1">
                        <span className="font-bold uppercase tracking-wider text-primary-cafe text-[10px]">Reservations Cap</span>
                        <div className="flex justify-between items-center pt-1">
                          <span className="font-semibold text-primary-cafe">6 tables per slot (Max)</span>
                          <span className="text-[10px] text-secondary-cafe font-bold uppercase cursor-pointer hover:underline">Adjust</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. ORDERS MONITOR TAB */}
            {activeTab === 'orders' && (
              <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-6 shadow-sm space-y-6">
                
                {/* Orders table filters */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-cafe/10 pb-4 gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-primary-cafe">Active Patron Orders</h3>
                    <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-0.5">Control prep cycles. Trigger free client notification web links.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 bg-surface-cafe p-1 border border-outline-cafe/15 rounded-xl">
                    {(['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setOrderFilter(f)}
                        className={`px-3 py-1.5 rounded-lg font-sans font-bold text-[10px] uppercase tracking-wider transition-colors ${
                          orderFilter === f 
                            ? 'bg-primary-cafe text-on-primary shadow-sm' 
                            : 'text-on-surface-variant-cafe hover:text-primary-cafe'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders Content Table */}
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <Coffee className="w-10 h-10 text-outline-cafe/40 mx-auto mb-2" />
                    <p className="font-sans text-sm text-on-surface-variant-cafe">No orders collected in storage yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-sm">
                      <thead>
                        <tr className="border-b border-outline-cafe/15 font-sans text-[11px] uppercase tracking-wider text-on-surface-variant-cafe/70 font-bold">
                          <th className="py-3 px-2">Code</th>
                          <th className="py-3 px-2">Customer</th>
                          <th className="py-3 px-2">Items Ordered</th>
                          <th className="py-3 px-2">Total Amount</th>
                          <th className="py-3 px-2">Dining Type</th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders
                          .filter(ord => orderFilter === 'all' || ord.status === orderFilter)
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map(ord => (
                            <tr key={ord.id} className="border-b border-outline-cafe/10 hover:bg-surface-cafe/20 transition-colors">
                              <td className="py-4 px-2 font-mono font-black text-secondary-cafe text-xs uppercase tracking-widest">{ord.code}</td>
                              <td className="py-4 px-2">
                                <div className="font-semibold text-primary-cafe">{ord.name}</div>
                                <div className="text-[11px] text-on-surface-variant-cafe/70 mt-0.5">{ord.phone}</div>
                              </td>
                              <td className="py-4 px-2 max-w-[200px]">
                                <div className="text-xs text-primary-cafe font-medium space-y-0.5">
                                  {ord.items.map((item, i) => (
                                    <div key={i} className="truncate">
                                      {item.name} <span className="font-bold">x{item.quantity}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="py-4 px-2 font-bold text-primary-cafe">{formatter.format(ord.total)}</td>
                              <td className="py-4 px-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  ord.diningType === 'dinein' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {ord.diningType === 'dinein' ? 'Table' : 'Pickup'}
                                </span>
                              </td>
                              <td className="py-4 px-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                                  ord.status === 'completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : ord.status === 'ready' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : ord.status === 'preparing' 
                                        ? 'bg-orange-100 text-orange-800' 
                                        : ord.status === 'cancelled' 
                                          ? 'bg-red-100 text-red-800' 
                                          : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-right">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  {/* Quick Prep Status Changers */}
                                  {ord.status === 'pending' && (
                                    <button
                                      onClick={() => updateOrderStatus(ord.id, 'preparing')}
                                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-1 rounded transition-colors"
                                    >
                                      Prep
                                    </button>
                                  )}
                                  {ord.status === 'preparing' && (
                                    <button
                                      onClick={() => updateOrderStatus(ord.id, 'ready')}
                                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-1 rounded transition-colors"
                                    >
                                      Ready
                                    </button>
                                  )}
                                  {ord.status === 'ready' && (
                                    <button
                                      onClick={() => updateOrderStatus(ord.id, 'completed')}
                                      className="bg-green-600 hover:bg-green-700 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-1 rounded transition-colors"
                                    >
                                      Complete
                                    </button>
                                  )}

                                  {/* Free notification desk trigger */}
                                  <button
                                    onClick={() => {
                                      const itemsText = ord.items.map(it => `${it.name} x${it.quantity}`).join(', ');
                                      handleOpenNotifier(
                                        'order', 
                                        ord.code, 
                                        ord.name, 
                                        ord.phone, 
                                        ord.status, 
                                        itemsText
                                      );
                                    }}
                                    className="border border-secondary-cafe/40 text-secondary-cafe hover:bg-secondary-cafe/10 font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1 transition-all"
                                  >
                                    <MessageSquare className="w-2.5 h-2.5" /> Notify (Free)
                                  </button>
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

            {/* 3. RESERVATIONS & CAPACITY TAB */}
            {activeTab === 'reservations' && (
              <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-6 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-cafe/10 pb-4 gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-primary-cafe">Courtyard Seatings Log</h3>
                    <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-0.5">Control courtyard capacity and reservations. Ping guests directly for free.</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 bg-surface-cafe p-1 border border-outline-cafe/15 rounded-xl">
                    {(['all', 'pending', 'confirmed', 'seated', 'cancelled'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setResFilter(f)}
                        className={`px-3 py-1.5 rounded-lg font-sans font-bold text-[10px] uppercase tracking-wider transition-colors ${
                          resFilter === f 
                            ? 'bg-primary-cafe text-on-primary shadow-sm' 
                            : 'text-on-surface-variant-cafe hover:text-primary-cafe'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {reservations.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar className="w-10 h-10 text-outline-cafe/40 mx-auto mb-2" />
                    <p className="font-sans text-sm text-on-surface-variant-cafe">No reservations recorded.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans text-sm">
                      <thead>
                        <tr className="border-b border-outline-cafe/15 font-sans text-[11px] uppercase tracking-wider text-on-surface-variant-cafe/70 font-bold">
                          <th className="py-3 px-2">Guest Details</th>
                          <th className="py-3 px-2">Reservation Date / Time</th>
                          <th className="py-3 px-2">Covers (Guests)</th>
                          <th className="py-3 px-2">Special Requests</th>
                          <th className="py-3 px-2">Reference</th>
                          <th className="py-3 px-2">Status</th>
                          <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations
                          .filter(res => resFilter === 'all' || res.status === resFilter)
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map(res => (
                            <tr key={res.id} className="border-b border-outline-cafe/10 hover:bg-surface-cafe/20 transition-colors">
                              <td className="py-4 px-2">
                                <div className="font-semibold text-primary-cafe">{res.guestName}</div>
                                <div className="text-[11px] text-on-surface-variant-cafe/70 mt-0.5">{res.guestEmail}</div>
                                <div className="text-[11px] text-secondary-cafe/80 font-medium">{res.guestPhone || 'No Phone Entered'}</div>
                              </td>
                              <td className="py-4 px-2">
                                <div className="font-semibold text-primary-cafe">{res.monthStr} {res.date.split('-')[2] || res.date}, {res.year}</div>
                                <div className="text-xs text-on-surface-variant-cafe/80 flex items-center gap-1 mt-0.5">
                                  <Clock className="w-3.5 h-3.5" /> {res.time}
                                </div>
                              </td>
                              <td className="py-4 px-2 font-bold text-primary-cafe">{res.guests} Covers</td>
                              <td className="py-4 px-2 text-xs italic text-on-surface-variant-cafe/90 max-w-[150px] truncate" title={res.specialRequests}>
                                {res.specialRequests || 'None'}
                              </td>
                              <td className="py-4 px-2 font-mono font-bold text-xs uppercase text-on-surface-variant-cafe/80">{res.reference}</td>
                              <td className="py-4 px-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                                  res.status === 'seated' 
                                    ? 'bg-green-100 text-green-800' 
                                    : res.status === 'confirmed' 
                                      ? 'bg-blue-100 text-blue-800' 
                                      : res.status === 'cancelled' 
                                        ? 'bg-red-100 text-red-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {res.status}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-right">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  {res.status === 'pending' && (
                                    <button
                                      onClick={() => updateReservationStatus(res.id, 'confirmed')}
                                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-1 rounded transition-colors"
                                    >
                                      Confirm
                                    </button>
                                  )}
                                  {res.status === 'confirmed' && (
                                    <button
                                      onClick={() => updateReservationStatus(res.id, 'seated')}
                                      className="bg-green-600 hover:bg-green-700 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-1 rounded transition-colors"
                                    >
                                      Seat
                                    </button>
                                  )}

                                  {/* Free notification desk trigger */}
                                  <button
                                    onClick={() => {
                                      handleOpenNotifier(
                                        'reservation', 
                                        res.reference, 
                                        res.guestName, 
                                        res.guestPhone || 'No Phone', 
                                        res.status, 
                                        `${res.guests} covers, Oct ${res.date.split('-')[2] || res.date} at ${res.time}`
                                      );
                                    }}
                                    className="border border-secondary-cafe/40 text-secondary-cafe hover:bg-secondary-cafe/10 font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1 transition-all"
                                  >
                                    <MessageSquare className="w-2.5 h-2.5" /> Notify (Free)
                                  </button>
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

            {/* 4. MENU MODIFIER TAB */}
            {activeTab === 'menu' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Create Menu Item Form */}
                <div className="lg:col-span-4 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display text-base font-bold text-primary-cafe uppercase tracking-wider">Publish Menu Item</h3>
                    <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-0.5">Publish a specialty brunch waffle, platter, or brew option instantly.</p>
                  </div>

                  <form onSubmit={handleCreateMenuItem} className="space-y-4 text-xs font-sans">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Item Name</label>
                      <input
                        type="text"
                        required
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="e.g. Saffron Pistachio Waffle"
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Price (NGN)</label>
                      <input
                        type="number"
                        required
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        placeholder="e.g. 8500"
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Category</label>
                      <select
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value as MenuCategory)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                      >
                        <option value="burgers">🍔 Gourmet Burgers</option>
                        <option value="pizza">🍕 Supreme Pizza</option>
                        <option value="corndogs">🌭 Hand-Pulled Corndogs</option>
                        <option value="fries_wings">🍟 Fries &amp; Wings</option>
                        <option value="boba_drinks">🧋 Boba Tea &amp; Drinks</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Description</label>
                      <textarea
                        value={newItemDesc}
                        onChange={(e) => setNewItemDesc(e.target.value)}
                        placeholder="e.g. Warm organic house sourdough topped with spiced honey butter..."
                        rows={3}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl p-3 text-primary-cafe font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Image URL (Optional)</label>
                      <input
                        type="text"
                        value={newItemImage}
                        onChange={(e) => setNewItemImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary-cafe hover:bg-primary-container-cafe text-on-primary font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer shadow-sm border-0 mt-2"
                    >
                      Publish to Menu Grid
                    </button>
                  </form>
                </div>

                {/* Live Menu Availability Grid */}
                <div className="lg:col-span-8 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-primary-cafe uppercase tracking-wider">Active Board Menu</h3>
                    <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-0.5">Toggle availability to take down or launch menu cards instantly from the escape page.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuItems.map(item => (
                      <div key={item.id} className="border border-outline-cafe/15 bg-surface-cafe/25 rounded-2xl p-4 flex gap-3 justify-between items-start">
                        <div className="flex gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-outline-cafe/10"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left font-sans">
                            <h4 className="font-bold text-xs text-primary-cafe line-clamp-1">{item.name}</h4>
                            <p className="text-[10px] text-secondary-cafe font-semibold capitalize">{item.category}</p>
                            <p className="font-bold text-xs text-primary-cafe mt-1">{formatter.format(item.price)}</p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <button
                            onClick={() => toggleItemAvailability(item.id)}
                            className="text-on-surface-variant-cafe hover:text-primary-cafe transition-colors flex items-center cursor-pointer"
                          >
                            {item.isAvailable !== false ? (
                              <span className="flex items-center text-[10px] text-green-700 font-extrabold gap-0.5 uppercase tracking-wider">
                                Active <ToggleRight className="w-6 h-6 text-green-700 shrink-0" />
                              </span>
                            ) : (
                              <span className="flex items-center text-[10px] text-outline-cafe/70 font-bold gap-0.5 uppercase tracking-wider">
                                Hushed <ToggleLeft className="w-6 h-6 text-outline-cafe/50 shrink-0" />
                              </span>
                            )}
                          </button>

                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 5. GATHERINGS / EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Publish Event Form */}
                <div className="lg:col-span-4 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display text-base font-bold text-primary-cafe uppercase tracking-wider">Publish New Gathering</h3>
                    <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-0.5">Post an intimate Art &amp; Wine workshop or live acoustic evening to our Abuja courtyard feed.</p>
                  </div>

                  <form onSubmit={handleCreateEvent} className="space-y-4 text-xs font-sans">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Event Title</label>
                      <input
                        type="text"
                        required
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        placeholder="e.g. Clay &amp; Cabernet Courtyard Workshop"
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold uppercase text-on-surface-variant-cafe">Month</label>
                        <input
                          type="text"
                          required
                          value={newEventMonth}
                          onChange={(e) => setNewEventMonth(e.target.value)}
                          placeholder="Oct"
                          className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-2 py-2.5 text-primary-cafe text-center font-sans"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold uppercase text-on-surface-variant-cafe">Date</label>
                        <input
                          type="text"
                          required
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          placeholder="24"
                          className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-2 py-2.5 text-primary-cafe text-center font-sans"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold uppercase text-on-surface-variant-cafe">Weekday</label>
                        <input
                          type="text"
                          required
                          value={newEventDay}
                          onChange={(e) => setNewEventDay(e.target.value)}
                          placeholder="Saturday"
                          className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-2 py-2.5 text-primary-cafe text-center font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold uppercase text-on-surface-variant-cafe">Category</label>
                        <select
                          value={newEventCategory}
                          onChange={(e) => setNewEventCategory(e.target.value as any)}
                          className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                        >
                          <option value="Art & Wine">🍷 Art &amp; Wine</option>
                          <option value="Community">🌿 Community</option>
                          <option value="Music">🎶 Music</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold uppercase text-on-surface-variant-cafe">Price (Free or NGN)</label>
                        <input
                          type="text"
                          required
                          value={newEventPrice}
                          onChange={(e) => setNewEventPrice(e.target.value)}
                          placeholder="Free or 15000"
                          className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Hour / Time</label>
                      <input
                        type="text"
                        required
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        placeholder="e.g. 5:30 PM - 8:30 PM"
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Description</label>
                      <textarea
                        value={newEventDesc}
                        onChange={(e) => setNewEventDesc(e.target.value)}
                        placeholder="e.g. Gather under the fairy lights in our quiet CBD courtyard for clay handbuilding..."
                        rows={3}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl p-3 text-primary-cafe font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Image URL</label>
                      <input
                        type="text"
                        value={newEventImage}
                        onChange={(e) => setNewEventImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary-cafe hover:bg-primary-container-cafe text-on-primary font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer shadow-sm border-0 mt-2"
                    >
                      Publish Gathering Ticket
                    </button>
                  </form>
                </div>

                {/* Published Events List */}
                <div className="lg:col-span-8 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-primary-cafe uppercase tracking-wider">Courtyard Calendar</h3>
                    <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-0.5">Delete or monitor published ticket capacities for upcoming gatherings.</p>
                  </div>

                  <div className="space-y-4">
                    {events.map(ev => (
                      <div key={ev.id} className="border border-outline-cafe/15 bg-surface-cafe/25 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex gap-4 items-center text-left">
                          <div className="bg-primary-container-cafe text-on-primary-container-cafe w-12 h-14 rounded-xl flex flex-col justify-center items-center font-sans border border-outline-cafe/15 shrink-0">
                            <span className="text-[9px] uppercase font-bold tracking-wider">{ev.month}</span>
                            <span className="text-lg font-extrabold">{ev.date}</span>
                          </div>
                          <div>
                            <span className="text-[9px] bg-secondary-cafe/10 text-secondary-cafe border border-secondary-cafe/15 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                              {ev.category}
                            </span>
                            <h4 className="font-display text-sm font-bold text-primary-cafe mt-1">{ev.title}</h4>
                            <p className="font-sans text-[11px] text-on-surface-variant-cafe/80">{ev.day} &bull; {ev.time} &bull; {ev.price === 'Free' ? 'Free Admission' : formatter.format(ev.price as number)}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteEvent(ev.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer self-end sm:self-center"
                          title="Delete Event Card"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 6. GUEST CRM DIRECTORY TAB */}
            {activeTab === 'crm' && (
              <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-6 shadow-sm space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-cafe/10 pb-4 gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-primary-cafe">Loyal Escape Guest CRM</h3>
                    <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-0.5">Maintain contact directories for newsletter campaigns. Ping clients instantly for free.</p>
                  </div>
                  
                  <div className="w-full sm:w-72 bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-outline-cafe shrink-0" />
                    <input
                      type="text"
                      value={crmSearch}
                      onChange={(e) => setCrmSearch(e.target.value)}
                      placeholder="Search guests by name/phone..."
                      className="w-full bg-transparent border-0 text-xs text-primary-cafe focus:ring-0 focus:outline-none placeholder-outline-cafe/50"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-sm">
                    <thead>
                      <tr className="border-b border-outline-cafe/15 font-sans text-[11px] uppercase tracking-wider text-on-surface-variant-cafe/70 font-bold">
                        <th className="py-3 px-2">Guest Profile</th>
                        <th className="py-3 px-2">Contact Channels</th>
                        <th className="py-3 px-2">Total Visits / Orders</th>
                        <th className="py-3 px-2">Accumulated Spend</th>
                        <th className="py-3 px-2 text-right">Instant CRM Channel (Free)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCustomerCRM().map((client, index) => (
                        <tr key={index} className="border-b border-outline-cafe/10 hover:bg-surface-cafe/20 transition-colors">
                          <td className="py-4 px-2">
                            <div className="font-semibold text-primary-cafe flex items-center gap-1.5">
                              {client.name}
                              {client.orderCount >= 3 && (
                                <span className="bg-yellow-100 text-yellow-800 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  ★ VIP VIP
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-2">
                            <div className="text-xs text-primary-cafe font-medium">{client.email}</div>
                            <div className="text-[11px] text-secondary-cafe/90 mt-0.5 font-bold">{client.phone}</div>
                          </td>
                          <td className="py-4 px-2 font-bold text-primary-cafe">{client.orderCount} visits</td>
                          <td className="py-4 px-2 font-bold text-secondary-cafe">{formatter.format(client.spend)}</td>
                          <td className="py-4 px-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  const greetingText = `Hi ${client.name}! ☕ This is Lola from Lola's Cafe Abuja CBD. We have exciting new waffles and coffee brews ready in our courtyard. Hope to see you soon! 🌿`;
                                  executeFreeNotification(client.phone, greetingText, 'whatsapp');
                                }}
                                className="bg-green-700 hover:bg-green-800 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer border-0 shadow-sm"
                              >
                                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Guest
                              </button>
                              <button
                                onClick={() => {
                                  const greetingText = `Hi ${client.name}! This is Lola from Lola's Cafe Abuja. We have exciting new courtyard gatherings scheduled this month. Reply to book!`;
                                  executeFreeNotification(client.phone, greetingText, 'sms');
                                }}
                                className="border border-outline-cafe/35 text-primary-cafe hover:bg-surface-container-low-cafe font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Smartphone className="w-3.5 h-3.5" /> Text Guest (SMS)
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* 7. CREDENTIALS & ACCESS CONTROLS TAB */}
            {activeTab === 'credentials' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Owner Credentials Card */}
                <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display text-base font-bold text-primary-cafe uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-5 h-5 text-secondary-cafe" /> Update Owner Credentials
                    </h3>
                    <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-0.5">
                      Change the master username, passcode/password, and contact email for Lola's private boardroom.
                    </p>
                  </div>

                  <form onSubmit={handleUpdateCredentials} className="space-y-4 text-xs font-sans">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Owner Username</label>
                      <input
                        type="text"
                        required
                        value={newOwnerUsername}
                        onChange={(e) => setNewOwnerUsername(e.target.value)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Owner Email (For Bypass Recovery)</label>
                      <input
                        type="email"
                        required
                        value={newOwnerEmail}
                        onChange={(e) => setNewOwnerEmail(e.target.value)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Owner Password / Passcode</label>
                      <input
                        type="password"
                        required
                        value={newOwnerPassword}
                        onChange={(e) => setNewOwnerPassword(e.target.value)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary-cafe hover:bg-primary-container-cafe text-on-primary font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer shadow-sm border-0"
                    >
                      Save Owner Changes
                    </button>
                  </form>
                </div>

                {/* Staff Credentials Card */}
                <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display text-base font-bold text-primary-cafe uppercase tracking-wider flex items-center gap-1.5">
                      <Sliders className="w-5 h-5 text-secondary-cafe" /> Update Staff Credentials
                    </h3>
                    <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-0.5">
                      Define the username and password details for the unlisted staff dashboard lounge.
                    </p>
                  </div>

                  <form onSubmit={handleUpdateCredentials} className="space-y-4 text-xs font-sans">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Staff Username</label>
                      <input
                        type="text"
                        required
                        value={newStaffUsername}
                        onChange={(e) => setNewStaffUsername(e.target.value)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold uppercase text-on-surface-variant-cafe">Staff Password</label>
                      <input
                        type="password"
                        required
                        value={newStaffPassword}
                        onChange={(e) => setNewStaffPassword(e.target.value)}
                        className="w-full bg-surface-cafe border border-outline-cafe/15 rounded-xl px-3 py-2.5 text-primary-cafe font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary-cafe hover:bg-primary-container-cafe text-on-primary font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer shadow-sm border-0"
                    >
                      Save Staff Changes
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* 8. STAFF VIEW (OWNER EYEPORT VIEW) TAB */}
            {activeTab === 'staff-view' && (
              <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-3xl p-4 md:p-6 shadow-sm space-y-4">
                <div className="border-b border-outline-cafe/10 pb-4">
                  <h3 className="font-display text-base font-bold text-primary-cafe uppercase tracking-wider">Owner Eyeport: Staff Workspace view</h3>
                  <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-0.5">
                    This lets you view and edit exactly what is on the staff lounge. Any modifications you make here reflect instantly.
                  </p>
                </div>
                {/* Render PortalView as the staff dashboard */}
                <PortalView triggerToast={triggerToast} />
              </div>
            )}

          </div>

        </div>
      )}

      {/* FREE GUEST COMMUNICATION DESK MODAL TRIGGER */}
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
                  <h3 className="font-display text-lg font-bold text-primary-cafe">Free Guest Notification Desk</h3>
                  <p className="font-sans text-xs text-on-surface-variant-cafe/70 mt-0.5">Configure and review customer dispatch details</p>
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
                    <p className="font-bold text-[9px] uppercase tracking-wider text-outline-cafe">Guest Name</p>
                    <p className="font-semibold text-primary-cafe text-sm mt-0.5">{notificationModal.name}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[9px] uppercase tracking-wider text-outline-cafe">Guest Phone Number</p>
                    <p className="font-semibold text-primary-cafe text-sm mt-0.5">{notificationModal.phone}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-[10px] uppercase tracking-wider text-primary-cafe">WhatsApp Dispatch Preview (100% Free)</p>
                  <div className="bg-green-50 border border-green-200 text-green-900 rounded-xl p-4 font-mono whitespace-pre-wrap text-[11px] leading-relaxed shadow-inner">
                    {`☕ *LOLA'S CAFE ABUJA* ☕\n\nHi *${notificationModal.name}*!\nYour order (*${notificationModal.code}*) status is now: *${notificationModal.status.toUpperCase()}* 🌿\n\n📋 Details: ${notificationModal.details}\n\nSee you in our courtyard soon!`}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-[10px] uppercase tracking-wider text-primary-cafe">SMS Text Dispatch Preview (100% Free)</p>
                  <div className="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-4 font-mono whitespace-pre-wrap text-[11px] leading-relaxed shadow-inner">
                    {`LOLA'S CAFE ABUJA\n\nHi ${notificationModal.name}!\nYour order (${notificationModal.code}) status is now: ${notificationModal.status.toUpperCase()}.\nDetails: ${notificationModal.details}.\nSee you in our courtyard soon!`}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-outline-cafe/15 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const textPayload = `☕ *LOLA'S CAFE ABUJA* ☕\n\nHi *${notificationModal.name}*!\nYour order (*${notificationModal.code}*) status is now: *${notificationModal.status.toUpperCase()}* 🌿\n\n📋 Details: ${notificationModal.details}\n\nSee you in our courtyard soon!`;
                    executeFreeNotification(notificationModal.phone, textPayload, 'whatsapp');
                  }}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-sans font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 border-0 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" /> Dispatch on WhatsApp
                </button>
                <button
                  onClick={() => {
                    const textPayload = `LOLA'S CAFE ABUJA\n\nHi ${notificationModal.name}!\nYour order (${notificationModal.code}) status is now: ${notificationModal.status.toUpperCase()}.\nDetails: ${notificationModal.details}.\nSee you in our courtyard soon!`;
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
