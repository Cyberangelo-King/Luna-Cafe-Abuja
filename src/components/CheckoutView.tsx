import { useState, FormEvent } from 'react';
import { ArrowLeft, ShoppingBag, CheckCircle, ArrowRight, TableProperties, Clock, MessageSquare, MapPin, Sparkles, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { CartItem, Order } from '../types';
import { getStoredOrders, saveStoredOrders } from '../services/cafeDataService';

interface CheckoutViewProps {
  cart: CartItem[];
  onBackToMenu: () => void;
  onOrderSuccess: () => void;
  clearCart: () => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
  selectedLocation: 'abraka' | 'lagos';
}

export default function CheckoutView({
  cart,
  onBackToMenu,
  onOrderSuccess,
  clearCart,
  triggerToast,
  selectedLocation
}: CheckoutViewProps) {
  // Input form state
  const [diningType, setDiningType] = useState<'pickup' | 'dinein' | 'delivery'>(
    selectedLocation === 'lagos' ? 'delivery' : 'dinein'
  );
  const [tableNumber, setTableNumber] = useState('');
  const [pickupTime, setPickupTime] = useState('12:00 PM');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryRegion, setDeliveryRegion] = useState(
    selectedLocation === 'lagos' ? 'Lekki Phase 1' : 'Abraka Town'
  );
  
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
  
  // Delivery/Eco fees: Lagos gets 2500 delivery fee, Abraka gets 1000 for delivery, 0 for dine-in/pickup
  const getFulfillmentFees = () => {
    if (diningType !== 'delivery') return 500; // Small Eco fee
    return selectedLocation === 'lagos' ? 2500 : 1000;
  };
  
  const taxesAndFees = getFulfillmentFees();
  
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

  // Compile and dispatch WhatsApp API Order
  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      if (triggerToast) {
        triggerToast("Please enter your full name and WhatsApp phone number to proceed.", "error");
      }
      return;
    }

    if (diningType === 'dinein' && !tableNumber) {
      if (triggerToast) {
        triggerToast("Please enter your Table Number so our baristas can find you.", "error");
      }
      return;
    }

    if (diningType === 'delivery' && !deliveryAddress) {
      if (triggerToast) {
        triggerToast("Please enter your Delivery Address.", "error");
      }
      return;
    }
    
    // Generate order reference
    const randomCode = `LOLA-${Math.floor(100 + Math.random() * 900)}`;
    
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
      email: customerEmail || 'guest@lolascafe.ng',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save to centralized local storage (syncs with owner dashboard)
    const currentOrders = getStoredOrders();
    saveStoredOrders([...currentOrders, newOrder]);

    // Build the beautiful WhatsApp message payload
    const locationName = selectedLocation === 'abraka' ? "Delta State (Abraka Hub)" : "Lagos State Hub";
    const contactLine = selectedLocation === 'abraka' ? "2349015704346" : "2349035504344";

    const itemsText = cart.map(item => {
      const modText = item.modifiers.length > 0 
        ? `\n   └ _Modifiers: ${item.modifiers.map(m => m.name).join(', ')}_` 
        : '';
      return `• *${item.name}* x${item.quantity} (${formatter.format(item.total)})${modText}`;
    }).join('\n');

    let fulfillmentDetails = '';
    if (diningType === 'dinein') {
      fulfillmentDetails = `📍 *Dining Option:* Dine-In (Table Service)\n🪑 *Table Number:* ${tableNumber}`;
    } else if (diningType === 'pickup') {
      fulfillmentDetails = `📍 *Dining Option:* Store Pickup\n🕒 *Estimated Pickup Time:* ${pickupTime}`;
    } else {
      fulfillmentDetails = `📍 *Dining Option:* Home Delivery\n🏠 *Address:* ${deliveryAddress}\n🗺️ *Region:* ${deliveryRegion}`;
    }

    const divider = '=========================';
    const whatsappText = 
`🟢 *LOLA'S CAFE - ORDER DISPATCH* 🟢
*Order Reference:* ${randomCode}
*Service Hub:* ${locationName}
${divider}

👤 *Guest Name:* ${customerName}
📱 *Phone:* ${customerPhone}
${customerEmail ? `✉️ *Email:* ${customerEmail}\n` : ''}${fulfillmentDetails}

${divider}
🛒 *ORDER ITEMS:*
${itemsText}

${divider}
💵 *FINANCIAL BREAKDOWN:*
• Subtotal: ${formatter.format(cartSubtotal)}
• ${diningType === 'delivery' ? 'Delivery Fee' : 'Eco/Barista Fee'}: ${formatter.format(taxesAndFees)}
• Crew Appreciation Tip: ${formatter.format(tipAmount)}
• *Grand Total:* *${formatter.format(cartTotal)}*

Please confirm and prepare my order! 🌿`;

    // Open WhatsApp directly
    const whatsappUrl = `https://wa.me/${contactLine}?text=${encodeURIComponent(whatsappText)}`;
    window.open(whatsappUrl, '_blank');

    setOrderCode(randomCode);
    setIsCompleted(true);
    clearCart();

    if (triggerToast) {
      triggerToast(`Order Code ${randomCode} dispatched to WhatsApp!`, 'success');
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
              className="text-on-surface-variant-cafe hover:text-primary-cafe p-2 -ml-2 rounded-full hover:bg-surface-variant-cafe/50 transition-colors flex items-center justify-center cursor-pointer font-bold text-xs uppercase tracking-wider"
            >
              <ArrowLeft className="w-5 h-5 mr-1" /> Back to Menu
            </button>
          </div>

          <div className="space-y-1.5">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-extrabold text-secondary-cafe flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary-cafe animate-pulse" /> 
              Instant WhatsApp Routing Enabled ({selectedLocation === 'abraka' ? 'Abraka Hub' : 'Lagos Hub'})
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-primary-cafe font-black tracking-tight">
              Lola's Direct Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Form Inputs (Left) */}
            <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
              
              {/* Contact Info */}
              <div className="bg-surface-container-lowest-cafe p-6 md:p-8 rounded-2xl border border-outline-cafe/15 shadow-sm space-y-6">
                <h3 className="font-display text-lg text-primary-cafe font-bold border-b border-outline-cafe/10 pb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-cafe" /> Contact Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Your Full Name</label>
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
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">WhatsApp Phone Number</label>
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

                <div className="flex flex-col gap-2">
                  <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="fatima@example.com"
                    className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery / Dining Preference */}
              <div className="bg-surface-container-lowest-cafe p-6 md:p-8 rounded-2xl border border-outline-cafe/15 shadow-sm space-y-6">
                <h3 className="font-display text-lg text-primary-cafe font-bold border-b border-outline-cafe/10 pb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-cafe" /> Fulfillment Option
                </h3>
                
                {/* Dynamically filter dining options. Lagos gets Delivery only, Abraka gets all 3 */}
                {selectedLocation === 'lagos' ? (
                  <div className="p-4 rounded-xl border border-secondary-cafe/20 bg-secondary-cafe/5 flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-secondary-cafe shrink-0" />
                    <div>
                      <p className="font-sans text-sm font-bold text-primary-cafe">Lagos Doorstep Delivery Hub</p>
                      <p className="font-sans text-xs text-on-surface-variant-cafe/90">Lagos State is delivery-only. Fresh dishes dispatched straight from our local cloud kitchens.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
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
                      <span className="font-sans text-xs font-bold leading-tight">Courtyard Dine-In</span>
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
                      <span className="font-sans text-xs font-bold leading-tight">Store Pickup</span>
                    </label>

                    <label className={`p-4 rounded-xl border flex flex-col justify-between h-24 cursor-pointer transition-all ${
                      diningType === 'delivery'
                        ? 'bg-primary-container-cafe text-on-primary-container-cafe border-transparent ring-2 ring-primary-cafe'
                        : 'bg-surface-cafe border-outline-cafe/15 text-primary-cafe hover:bg-surface-container-low-cafe'
                    }`}>
                      <input
                        type="radio"
                        name="diningType"
                        checked={diningType === 'delivery'}
                        onChange={() => setDiningType('delivery')}
                        className="sr-only"
                      />
                      <MapPin className="w-5 h-5 shrink-0" />
                      <span className="font-sans text-xs font-bold leading-tight">Home Delivery</span>
                    </label>
                  </div>
                )}

                {/* Conditional Inputs based on dining selection */}
                {diningType === 'dinein' && (
                  <div className="flex flex-col gap-2 pt-2 animate-fadeIn">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Table Number (If already seated)</label>
                    <input
                      type="text"
                      required
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="e.g. Table 4"
                      className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors focus:outline-none"
                    />
                  </div>
                )}

                {diningType === 'pickup' && (
                  <div className="flex flex-col gap-2 pt-2 animate-fadeIn">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Estimated Pickup Time</label>
                    <input
                      type="text"
                      required
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      placeholder="e.g. 1:15 PM"
                      className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors focus:outline-none"
                    />
                  </div>
                )}

                {diningType === 'delivery' && (
                  <div className="space-y-4 pt-2 animate-fadeIn">
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Street Address</label>
                      <input
                        type="text"
                        required
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="e.g. Block 12, Admiralty Way / Ekrejeta St."
                        className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe placeholder-outline-cafe/30 transition-colors focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Area / Neighborhood</label>
                      {selectedLocation === 'lagos' ? (
                        <select
                          value={deliveryRegion}
                          onChange={(e) => setDeliveryRegion(e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe focus:outline-none"
                        >
                          <option value="Lekki Phase 1" className="bg-surface-cafe">Lekki Phase 1</option>
                          <option value="Ikoyi" className="bg-surface-cafe">Ikoyi</option>
                          <option value="Victoria Island" className="bg-surface-cafe">Victoria Island</option>
                          <option value="Ikeja GRA" className="bg-surface-cafe">Ikeja GRA</option>
                          <option value="Surulere" className="bg-surface-cafe">Surulere</option>
                          <option value="Yaba" className="bg-surface-cafe">Yaba</option>
                        </select>
                      ) : (
                        <select
                          value={deliveryRegion}
                          onChange={(e) => setDeliveryRegion(e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-outline-cafe/30 focus:border-secondary-cafe focus:ring-0 px-0 py-2.5 font-sans text-sm text-primary-cafe focus:outline-none"
                        >
                          <option value="Abraka Town" className="bg-surface-cafe">Abraka Town</option>
                          <option value="Ekrejeta" className="bg-surface-cafe">Ekrejeta Area</option>
                          <option value="Site I Campus" className="bg-surface-cafe">Site I Campus</option>
                          <option value="Site II Campus" className="bg-surface-cafe">Site II Campus</option>
                          <option value="Site III Campus" className="bg-surface-cafe">Site III Campus</option>
                          <option value="Police Station Area" className="bg-surface-cafe">Police Station Area</option>
                        </select>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* No credit cards block! Clear and beautiful instruction. */}
              <div className="p-6 rounded-2xl border border-green-600/20 bg-green-950/10 text-left space-y-3">
                <h4 className="font-display text-sm font-bold text-green-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-700" /> Direct WhatsApp Checkout
                </h4>
                <p className="font-sans text-xs text-on-surface-variant-cafe/90 leading-relaxed">
                  Lola's Cafe skips complex merchant gateway fees and credit card storage risks. Clicking the button below compiles your order and instantly launches WhatsApp to send details directly to our closest kitchen station. You can coordinate cash on delivery, bank transfers, or walk-in payment options!
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-green-700 text-white rounded-xl py-4 shadow-lg hover:bg-green-800 transition-all flex justify-center items-center gap-2 font-sans font-bold tracking-widest uppercase text-xs cursor-pointer"
                style={{ boxShadow: '0 8px 24px rgba(38,124,47,0.15)' }}
              >
                <MessageSquare className="w-4 h-4" /> Place Order via WhatsApp &bull; {formatter.format(cartTotal)}
              </button>
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
                    <span>Fulfillment Fee</span>
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

            </div>

          </div>

        </div>
      ) : (
        /* CONFIRMED SCREEN */
        <div className="max-w-xl mx-auto text-center py-12 md:py-20 space-y-10 animate-fadeIn">
          
          <div className="w-20 h-20 rounded-full bg-green-700 text-white flex items-center justify-center shadow-lg shadow-green-700/20 mx-auto">
            <CheckCircle className="w-11 h-11 text-white stroke-[2.5px]" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-4xl md:text-5xl text-primary-cafe font-bold leading-tight">
              Order Sent to WhatsApp!
            </h1>
            <p className="font-sans text-sm text-on-surface-variant-cafe">
              Your temporary checkout reference:{' '}
              <span className="font-sans text-sm font-bold text-secondary-cafe tracking-widest uppercase">
                {orderCode}
              </span>
            </p>
          </div>

          <div className="bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-xl p-8 space-y-6 shadow-sm text-left">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="flex flex-col">
                <span className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant-cafe font-bold mb-1">Fulfillment</span>
                <span className="font-sans text-sm font-semibold text-primary-cafe capitalize">
                  {diningType === 'dinein' ? 'Courtyard Service' : diningType === 'pickup' ? 'Store Pickup' : 'Home Delivery'}
                </span>
                {diningType === 'dinein' && tableNumber && (
                  <span className="font-sans text-xs text-secondary-cafe font-bold mt-0.5">{tableNumber}</span>
                )}
                {diningType === 'pickup' && pickupTime && (
                  <span className="font-sans text-xs text-secondary-cafe font-bold mt-0.5">At {pickupTime}</span>
                )}
                {diningType === 'delivery' && deliveryAddress && (
                  <span className="font-sans text-xs text-secondary-cafe font-bold mt-0.5 truncate max-w-full" title={deliveryAddress}>{deliveryRegion}</span>
                )}
              </div>
              <div className="flex flex-col border-l border-outline-cafe/15">
                <span className="font-sans text-[10px] uppercase tracking-wider text-on-surface-variant-cafe font-bold mb-1">Lola's Hub Support</span>
                <span className="font-sans text-sm font-semibold text-primary-cafe">
                  {selectedLocation === 'abraka' ? '09015704346' : '09035504344'}
                </span>
              </div>
            </div>

            <p className="font-sans text-xs text-on-surface-variant-cafe/90 text-center border-t border-outline-cafe/10 pt-4 leading-relaxed">
              We opened a secure window with your compiled message. If WhatsApp did not open automatically, check your popup settings or use Lola's direct support line to finalize your cash or transfer options!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onOrderSuccess}
              className="bg-primary-cafe text-on-primary rounded-xl font-sans font-semibold tracking-wider uppercase text-xs px-6 py-4 flex items-center justify-center gap-2 hover:bg-primary-container-cafe transition-all cursor-pointer shadow-md border-0"
            >
              Order Something Else
            </button>
            <button
              onClick={onBackToMenu}
              className="border border-outline-cafe/30 text-primary-cafe rounded-xl font-sans font-semibold tracking-wider uppercase text-xs px-6 py-4 flex items-center justify-center gap-2 hover:bg-surface-container-low-cafe transition-all cursor-pointer"
            >
              Back to Escape Page
            </button>
          </div>

        </div>
      )}

    </motion.div>
  );
}
