import { useState, FormEvent } from 'react';
import { ArrowLeft, CreditCard, ShoppingBag, ShieldCheck, CheckCircle, ArrowRight, TableProperties, Clock, MessageSquare, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';
import { CartItem, Order } from '../types';
import { getStoredOrders, saveStoredOrders } from '../services/cafeDataService';

interface CheckoutViewProps {
  cart: CartItem[];
  onBackToMenu: () => void;
  onOrderSuccess: () => void;
  clearCart: () => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function CheckoutView({
  cart,
  onBackToMenu,
  onOrderSuccess,
  clearCart,
  triggerToast
}: CheckoutViewProps) {
  // Input form state
  const [diningType, setDiningType] = useState<'pickup' | 'dinein'>('dinein');
  const [tableNumber, setTableNumber] = useState('');
  const [pickupTime, setPickupTime] = useState('12:00 PM');
  
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [isCompleted, setIsCompleted] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  const [tipType, setTipType] = useState<'10%' | '15%' | '20%' | 'custom' | 'none'>('15%');
  const [customTipAmount, setCustomTipAmount] = useState<string>('');

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const taxesAndFees = cart.length > 0 ? 1500 : 0;
  
  const getTipAmount = () => {
    if (tipType === '10%') return Math.round(cartSubtotal * 0.1);
    if (tipType === '15%') return Math.round(cartSubtotal * 0.15);
    if (tipType === '20%') return Math.round(cartSubtotal * 0.2);
    if (tipType === 'custom') {
      const val = parseFloat(customTipAmount);
      return isNaN(val) || val < 0 ? 0 : val;
    }
    return 0;
  };
  
  const tipAmount = getTipAmount();
  const cartTotal = cartSubtotal + taxesAndFees + tipAmount;

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !cardName || !cardNumber) {
      if (triggerToast) {
        triggerToast("Please fill out all contact and payment details to proceed.", "error");
      }
      return;
    }
    
    // Generate order reference
    const randomCode = `LUNA-${Math.floor(100 + Math.random() * 900)}`;
    
    // Construct Order object
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      code: randomCode,
      items: cart,
      subtotal: cartSubtotal,
      tip: tipAmount,
      total: cartTotal,
      diningType: diningType,
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save to centralized local storage
    const currentOrders = getStoredOrders();
    saveStoredOrders([...currentOrders, newOrder]);

    setOrderCode(randomCode);
    setIsCompleted(true);
    clearCart();

    if (triggerToast) {
      triggerToast(`Order Code ${randomCode} submitted successfully! Our Abuja CBD barista crew has received it.`, 'success');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full animate-fadeIn max-w-5xl mx-auto px-4 md:px-16 pt-12 pb-24 text-left"
    >
      
      {!isCompleted ? (
        <div className="space-y-10">
          
          {/* Header row */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToMenu}
              className="text-on-surface-variant-cafe hover:text-primary-cafe p-2 -ml-2 rounded-full hover:bg-surface-variant-cafe/50 transition-colors flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-1" /> Back to Menu
            </button>
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-primary-cafe font-bold">Secure Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Form Inputs (Left) */}
            <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
              
              {/* Contact Info */}
              <div className="bg-surface-container-lowest-cafe p-6 md:p-8 rounded-2xl border border-outline-cafe/15 shadow-sm space-y-6">
                <h3 className="font-display text-lg text-primary-cafe font-bold border-b border-outline-cafe/10 pb-3">Contact Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Fatima Ali"
                      className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Email Address</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="fatima@example.com"
                      className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 08031234567"
                      className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery / Dining Preference */}
              <div className="bg-surface-container-lowest-cafe p-6 md:p-8 rounded-2xl border border-outline-cafe/15 shadow-sm space-y-6">
                <h3 className="font-display text-lg text-primary-cafe font-bold border-b border-outline-cafe/10 pb-3">Dining Option</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <label className={`p-4 rounded-xl border flex flex-col justify-between h-24 cursor-pointer transition-all ${
                    diningType === 'dinein'
                      ? 'bg-primary-container-cafe text-on-primary-container-cafe border-transparent ring-2 ring-primary-cafe'
                      : 'bg-surface-cafe border-outline-cafe/15 text-primary-cafe hover:bg-surface-container-low-cafe'
                  }`}>
                    <input
                      type="radio"
                      name="diningType"
                      checked={diningType === 'dinein'}
                      onChange={() => setDiningType('dinein')}
                      className="sr-only"
                    />
                    <TableProperties className="w-5 h-5 shrink-0" />
                    <span className="font-sans text-sm font-bold">Dine-In Table</span>
                  </label>

                  <label className={`p-4 rounded-xl border flex flex-col justify-between h-24 cursor-pointer transition-all ${
                    diningType === 'pickup'
                      ? 'bg-primary-container-cafe text-on-primary-container-cafe border-transparent ring-2 ring-primary-cafe'
                      : 'bg-surface-cafe border-outline-cafe/15 text-primary-cafe hover:bg-surface-container-low-cafe'
                  }`}>
                    <input
                      type="radio"
                      name="diningType"
                      checked={diningType === 'pickup'}
                      onChange={() => setDiningType('pickup')}
                      className="sr-only"
                    />
                    <Clock className="w-5 h-5 shrink-0" />
                    <span className="font-sans text-sm font-bold">Store Pickup</span>
                  </label>
                </div>

                {diningType === 'dinein' ? (
                  <div className="flex flex-col gap-2 pt-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Table Number (If already seated)</label>
                    <input
                      type="text"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="e.g. Table 4"
                      className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Estimated Pickup Time</label>
                    <input
                      type="text"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      placeholder="e.g. 1:15 PM"
                      className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <div className="bg-surface-container-lowest-cafe p-6 md:p-8 rounded-2xl border border-outline-cafe/15 shadow-sm space-y-6">
                <div className="flex justify-between items-baseline border-b border-outline-cafe/10 pb-3">
                  <h3 className="font-display text-lg text-primary-cafe font-bold">Payment details</h3>
                  <span className="text-[10px] bg-secondary-container-cafe/20 text-secondary-cafe px-2 py-0.5 rounded font-sans uppercase font-bold tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secured
                  </span>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Name on Card</label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Fatima Ali"
                    className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="•••• •••• •••• ••••"
                      maxLength={19}
                      className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 pl-8 pr-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors"
                    />
                    <CreditCard className="w-4 h-4 text-outline-cafe/50 absolute left-0 top-3.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Expiry Date</label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">CVV Code</label>
                    <input
                      type="password"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={3}
                      className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors"
                    />
                  </div>
                </div>
              </div>

            </form>

            {/* Order Review panel (Right) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl p-6 shadow-sm space-y-6">
                <h3 className="font-display text-lg text-primary-cafe font-bold border-b border-outline-cafe/10 pb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-secondary-cafe" /> Review Order
                </h3>
                
                <div className="max-h-[220px] overflow-y-auto space-y-4 no-scrollbar pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div className="pr-4 text-left">
                        <span className="font-sans font-bold text-primary-cafe">{item.name}</span>
                        <span className="font-sans text-xs text-on-surface-variant-cafe ml-1">x{item.quantity}</span>
                        {item.modifiers.length > 0 && (
                          <span className="block text-[11px] text-on-surface-variant-cafe/70 italic leading-tight mt-0.5">
                            + {item.modifiers.map(m => m.name).join(', ')}
                          </span>
                        )}
                      </div>
                      <span className="font-sans font-bold text-secondary-cafe whitespace-nowrap">{formatter.format(item.total)}</span>
                    </div>
                  ))}
                </div>

                {/* Crew Appreciation Tipping Options */}
                <div className="border-t border-outline-cafe/10 pt-4 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-display text-sm font-bold text-primary-cafe">Crew Appreciation</span>
                    <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-secondary-cafe bg-secondary-cafe/10 px-2 py-0.5 rounded">
                      100% to Chefs &amp; Baristas
                    </span>
                  </div>
                  <p className="font-sans text-xs text-on-surface-variant-cafe/80 leading-snug">
                    Our baristas and chefs put a lot of love into each plate. Thank them with a tip!
                  </p>
                  
                  <div className="grid grid-cols-5 gap-1 pt-1">
                    {(['none', '10%', '15%', '20%', 'custom'] as const).map((type) => {
                      const isSelected = tipType === type;
                      let label = '';
                      if (type === 'none') label = 'No Tip';
                      else if (type === 'custom') label = 'Custom';
                      else label = type;

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setTipType(type)}
                          className={`py-2 px-1 rounded-lg border text-center font-sans font-bold text-[10px] transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary-cafe text-on-primary border-transparent shadow-sm'
                              : 'bg-surface-cafe border-outline-cafe/15 text-primary-cafe hover:bg-surface-container-low-cafe'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {tipType === 'custom' && (
                    <div className="flex items-center gap-2 pt-1.5 animate-fadeIn">
                      <span className="font-sans font-bold text-xs text-on-surface-variant-cafe">NGN</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Enter custom amount"
                        value={customTipAmount}
                        onChange={(e) => setCustomTipAmount(e.target.value)}
                        className="flex-grow bg-surface-cafe border border-outline-cafe/20 rounded-lg px-3 py-1.5 font-sans text-xs text-primary-cafe focus:outline-none focus:border-secondary-cafe focus:ring-1 focus:ring-secondary-cafe"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t border-outline-cafe/10 pt-4 font-sans text-sm">
                  <div className="flex justify-between text-on-surface-variant-cafe">
                    <span>Subtotal</span>
                    <span>{formatter.format(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant-cafe">
                    <span>Eco Taxes &amp; Fees</span>
                    <span>{formatter.format(taxesAndFees)}</span>
                  </div>
                  {tipAmount > 0 && (
                    <div className="flex justify-between text-on-surface-variant-cafe">
                      <span>Crew Appreciation Tip</span>
                      <span>{formatter.format(tipAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-primary-cafe pt-3 border-t border-outline-cafe/10">
                    <span>Total Amount</span>
                    <span className="text-secondary-cafe font-extrabold">{formatter.format(cartTotal)}</span>
                  </div>
                </div>

              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-primary-cafe text-on-primary rounded-xl py-4 shadow-lg hover:bg-primary-container-cafe transition-all flex justify-center items-center gap-2 font-sans font-semibold tracking-wider uppercase text-xs cursor-pointer"
                style={{ boxShadow: '0 8px 24px rgba(38,66,47,0.15)' }}
              >
                Place Order <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* CONFIRMED SCREEN */
        <div className="max-w-xl mx-auto text-center py-12 md:py-20 space-y-10 animate-fadeIn">
          
          <div className="w-20 h-20 rounded-full bg-primary-container-cafe text-on-primary flex items-center justify-center shadow-lg shadow-primary-container-cafe/20 mx-auto">
            <CheckCircle className="w-11 h-11 text-white stroke-[2.5px]" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-4xl md:text-5xl text-primary-cafe font-bold leading-tight">
              Thank You for Your Order!
            </h1>
            <p className="font-sans text-sm text-on-surface-variant-cafe">
              Order Reference:{' '}
              <span className="font-sans text-sm font-bold text-secondary-cafe tracking-widest uppercase">
                {orderCode}
              </span>
            </p>
          </div>

          <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-xl p-8 space-y-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="flex flex-col">
                <span className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant-cafe font-bold mb-1">Method</span>
                <span className="font-sans text-sm font-semibold text-primary-cafe capitalize">
                  {diningType === 'dinein' ? 'Table Service' : 'Store Pickup'}
                </span>
                {diningType === 'dinein' && tableNumber && (
                  <span className="font-sans text-xs text-secondary-cafe font-bold mt-0.5">{tableNumber}</span>
                )}
                {diningType === 'pickup' && pickupTime && (
                  <span className="font-sans text-xs text-secondary-cafe font-bold mt-0.5">At {pickupTime}</span>
                )}
              </div>
              <div className="flex flex-col border-l border-outline-cafe/15">
                <span className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant-cafe font-bold mb-1">Preparation</span>
                <span className="font-sans text-sm font-semibold text-primary-cafe">Ready in 15-20 mins</span>
              </div>
            </div>

            <div className="border-t border-outline-cafe/10 pt-4 flex justify-between items-center text-sm font-sans text-on-surface-variant-cafe">
              <span>Total Paid (Eco Fees Included)</span>
              <span className="font-bold text-secondary-cafe">{formatter.format(cartTotal)}</span>
            </div>
          </div>

          {/* FREE SMS / WHATSAPP RECEIPT DESK */}
          <div className="bg-surface-container-low-cafe border border-outline-cafe/20 rounded-2xl p-6 text-left space-y-4">
            <div>
              <h3 className="font-display text-base font-bold text-primary-cafe flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-cafe animate-pulse" />
                Secure Your Digital Receipt &bull; 100% Free
              </h3>
              <p className="font-sans text-xs text-on-surface-variant-cafe/80 mt-1 leading-relaxed">
                Receive your order receipt instantly. This compiles your full order breakdown and opens it pre-filled inside your device's native WhatsApp or SMS application, avoiding any expensive gateway service fees.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => {
                  const phone = customerPhone.replace(/\D/g, '');
                  let cleanNum = phone;
                  if (phone.startsWith('0') && phone.length === 11) {
                    cleanNum = '234' + phone.slice(1);
                  } else if (phone.length === 10 && !phone.startsWith('234')) {
                    cleanNum = '234' + phone;
                  }
                  
                  const itemsText = cart.map(item => `• ${item.name} x${item.quantity}`).join('\n');
                  const border = '---------------------------';
                  const msg = `☕ *LUNA CAFE ABUJA* ☕\n*Order Receipt:* ${orderCode}\n${border}\n👤 *Guest:* ${customerName}\n📱 *Phone:* ${customerPhone}\n📍 *Dining:* ${diningType === 'dinein' ? `Dine-In (${tableNumber || 'Table'})` : `Pickup (${pickupTime || 'Now'})`}\n${border}\n${itemsText}\n${border}\n💵 *Total Paid:* ${formatter.format(cartTotal)}\n🕒 *Ready In:* 15-20 mins\n\nSee you in our hushed CBD courtyard soon! 🌿`;
                  
                  const url = cleanNum 
                    ? `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}` 
                    : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
                  window.open(url, '_blank');
                  if (triggerToast) triggerToast("WhatsApp receipt opened!", "success");
                }}
                className="bg-green-700 hover:bg-green-800 text-white rounded-xl py-3 px-4 font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm border-0"
              >
                <MessageSquare className="w-4 h-4" /> Send to WhatsApp
              </button>

              <button
                onClick={() => {
                  const phone = customerPhone.replace(/\D/g, '');
                  let cleanNum = phone;
                  if (phone.startsWith('0') && phone.length === 11) {
                    cleanNum = '234' + phone.slice(1);
                  } else if (phone.length === 10 && !phone.startsWith('234')) {
                    cleanNum = '234' + phone;
                  }
                  
                  const itemsText = cart.map(item => `• ${item.name} x${item.quantity}`).join('\n');
                  const border = '---------------------------';
                  const msg = `LUNA CAFE ABUJA\nOrder Receipt: ${orderCode}\n${border}\n👤 Guest: ${customerName}\n📱 Phone: ${customerPhone}\n📍 Dining: ${diningType === 'dinein' ? `Dine-In (${tableNumber || 'Table'})` : `Pickup (${pickupTime || 'Now'})`}\n${border}\n${itemsText}\n${border}\n💵 Total Paid: ${formatter.format(cartTotal)}\n🕒 Ready In: 15-20 mins\n\nSee you in our hushed CBD courtyard soon!`;
                  
                  const url = `sms:${cleanNum || ''}?body=${encodeURIComponent(msg)}`;
                  window.open(url, '_blank');
                  if (triggerToast) triggerToast("Native text messenger triggered!", "success");
                }}
                className="bg-primary-cafe hover:bg-primary-container-cafe text-on-primary rounded-xl py-3 px-4 font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm border-0"
              >
                <Smartphone className="w-4 h-4" /> Send via Text (SMS)
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onOrderSuccess}
              className="bg-primary-cafe text-on-primary rounded-lg font-sans font-semibold tracking-wider uppercase text-xs px-6 py-4 flex items-center justify-center gap-2 hover:bg-primary-container-cafe transition-all cursor-pointer shadow-md"
            >
              Order Something Else
            </button>
            <button
              onClick={onBackToMenu}
              className="border border-outline-cafe/30 text-primary-cafe rounded-lg font-sans font-semibold tracking-wider uppercase text-xs px-6 py-4 flex items-center justify-center gap-2 hover:bg-surface-container-low-cafe transition-all cursor-pointer"
            >
              Back to Escape Page
            </button>
          </div>

        </div>
      )}

    </motion.div>
  );
}
