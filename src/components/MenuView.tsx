/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PlusCircle, ShoppingBag, X, Minus, Plus, ShoppingBasket, ArrowRight, Ban } from 'lucide-react';
import { motion } from 'motion/react';
import { MenuItem, CartItem, MenuCategory } from '../types';
import { MODIFIER_DATA } from '../data';
import { getStoredMenuItems } from '../services/cafeDataService';
import { MenuItemSkeleton } from './SkeletonLoader';

interface MenuViewProps {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  openCart: () => void;
  closeCart: () => void;
  cartSidebarOpen: boolean;
  onCheckout: () => void;
}

export default function MenuView({
  cart,
  addToCart,
  removeFromCart,
  openCart,
  closeCart,
  cartSidebarOpen,
  onCheckout
}: MenuViewProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('waffles');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<Array<{ name: string; price: number }>>([]);

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  });

  const categories: { id: MenuCategory; label: string }[] = [
    { id: 'waffles', label: 'Waffles' },
    { id: 'platters', label: 'Platters' },
    { id: 'coffee', label: 'Artisan Coffee' }
  ];

  // Refresh menu from database
  const refreshMenu = () => {
    setMenuItems(getStoredMenuItems());
  };

  useEffect(() => {
    refreshMenu();
    
    // Listen to updates from Staff command center
    window.addEventListener('luna_menu_updated', refreshMenu);
    
    // Skeleton loading simulation to enhance luxury feel
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => {
      window.removeEventListener('luna_menu_updated', refreshMenu);
      clearTimeout(timer);
    };
  }, []);

  const filteredItems = menuItems.filter(item => item.category === activeCategory);

  const handleOpenModal = (item: MenuItem) => {
    if (item.isAvailable === false) return; // Block opening modal for Sold Out items
    setSelectedItem(item);
    setModalQuantity(1);
    setSelectedModifiers([]);
  };

  const handleModifierChange = (
    name: string,
    price: number,
    isChecked: boolean,
    type: 'checkbox' | 'radio',
    group?: string
  ) => {
    if (type === 'radio') {
      // Remove other modifiers in the same group, if group is supplied
      setSelectedModifiers(prev => {
        // filter out other items belonging to the same group or starting with milk
        const filtered = prev.filter(mod => {
          if (group === 'milk') {
            return mod.name !== 'Oat Milk Alternative' && mod.name !== 'Almond Milk Alternative';
          }
          return true;
        });
        if (isChecked) {
          return [...filtered, { name, price }];
        }
        return filtered;
      });
    } else {
      if (isChecked) {
        setSelectedModifiers(prev => [...prev, { name, price }]);
      } else {
        setSelectedModifiers(prev => prev.filter(mod => mod.name !== name));
      }
    }
  };

  const calculateModalItemTotal = () => {
    if (!selectedItem) return 0;
    const modifiersCost = selectedModifiers.reduce((sum, mod) => sum + mod.price, 0);
    return (selectedItem.price + modifiersCost) * modalQuantity;
  };

  const handleAddToCartFromModal = () => {
    if (!selectedItem) return;

    const modifiersCost = selectedModifiers.reduce((sum, m) => sum + m.price, 0);
    const unitTotal = selectedItem.price + modifiersCost;

    const cartItem: CartItem = {
      id: `${selectedItem.id}-${Date.now()}`,
      name: selectedItem.name,
      basePrice: selectedItem.price,
      quantity: modalQuantity,
      modifiers: selectedModifiers,
      unitTotal: unitTotal,
      total: unitTotal * modalQuantity
    };

    addToCart(cartItem);
    setSelectedItem(null);
    openCart();
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full animate-fadeIn max-w-7xl mx-auto px-4 md:px-16 pt-12 pb-24 relative"
    >
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-outline-cafe/10 pb-6 gap-6">
        <div className="text-left">
          <h1 className="font-display text-4xl md:text-5xl text-primary-cafe mb-3 font-bold">Our Menu</h1>
          <p className="font-sans text-base text-on-surface-variant-cafe max-w-2xl leading-relaxed">
            Crafted with local ingredients and Abuja specialty care. Experience modern culinary arts combined with serene courtyard escapism.
          </p>
        </div>
        
        {/* Floating Cart Button for quick viewing */}
        <button
          onClick={openCart}
          className="relative bg-surface-container-low-cafe text-primary-cafe p-3.5 rounded-full hover:bg-surface-variant-cafe transition-colors border border-outline-cafe/15 flex items-center justify-center cursor-pointer shadow-sm"
          id="cartToggle"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-secondary-cafe text-on-primary font-sans text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-surface-cafe font-bold shadow-sm" id="cartCountBadge">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex overflow-x-auto space-x-4 mb-12 no-scrollbar pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-6 py-2.5 rounded-full border border-outline-cafe/15 font-sans text-xs tracking-wider uppercase font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-primary-cafe text-on-primary border-primary-cafe shadow-md'
                : 'bg-surface-cafe text-on-surface-variant-cafe hover:bg-surface-container-low-cafe'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Menu Items Container */}
        <div className={`col-span-1 transition-all duration-500 ease-in-out ${cartSidebarOpen ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {loading ? (
            // Skeleton states
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <MenuItemSkeleton key={i} />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-lowest-cafe border border-outline-cafe/10 rounded-2xl">
              <Ban className="w-12 h-12 text-outline-cafe/30 mx-auto mb-3" />
              <p className="font-sans text-sm text-on-surface-variant-cafe font-semibold">No active recipes in this segment.</p>
              <p className="font-sans text-xs text-on-surface-variant-cafe/60 mt-1">Check back later or access the owner command center to publish.</p>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredItems.map(item => {
                const isAvailable = item.isAvailable !== false;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleOpenModal(item)}
                    className={`group flex flex-col md:flex-row gap-6 p-4 rounded-2xl border border-outline-cafe/15 bg-surface-container-lowest-cafe hover:bg-surface-container-low-cafe transition-colors duration-300 shadow-sm hover:shadow-md relative overflow-hidden ${
                      isAvailable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60 bg-surface-variant-cafe/20'
                    }`}
                  >
                    <div className="w-full md:w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-surface-container-high-cafe border border-outline-cafe/10 relative">
                      <img
                        className={`w-full h-full object-cover transition-transform duration-500 ${isAvailable ? 'group-hover:scale-105' : 'grayscale'}`}
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                      />
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="font-sans text-[10px] font-black uppercase tracking-widest text-white border border-white/40 bg-white/10 px-2.5 py-1 rounded">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center flex-grow text-left">
                      <div className="flex items-baseline justify-between mb-2">
                        <h3 className={`font-display text-lg text-primary-cafe font-bold ${!isAvailable ? 'line-through text-on-surface-variant-cafe/55' : ''}`}>{item.name}</h3>
                        <div className="menu-leader hidden md:block"></div>
                        <span className={`font-sans text-base font-bold ${isAvailable ? 'text-secondary-cafe' : 'text-on-surface-variant-cafe/50'}`}>{formatter.format(item.price)}</span>
                      </div>
                      <p className="font-sans text-sm text-on-surface-variant-cafe mb-4 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      {isAvailable ? (
                        <button className="self-start text-primary-cafe font-sans font-semibold text-xs tracking-wider uppercase flex items-center gap-1 hover:text-secondary-cafe transition-colors cursor-pointer">
                          <PlusCircle className="w-4 h-4" /> Add to Order
                        </button>
                      ) : (
                        <span className="self-start text-on-surface-variant-cafe/60 font-sans font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                          Temporarily Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </div>

        {/* Integrated Side Cart Panel */}
        {cartSidebarOpen && (
          <div className="col-span-1 lg:col-span-4 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl p-6 shadow-xl flex flex-col h-[500px] lg:sticky lg:top-28 animate-slideUp">
            <div className="pb-4 border-b border-outline-cafe/10 flex justify-between items-center">
              <h2 className="font-display text-lg text-primary-cafe font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-secondary-cafe" /> Your Order
              </h2>
              <button
                onClick={closeCart}
                className="text-on-surface-variant-cafe hover:text-primary-cafe rounded-full p-1.5 hover:bg-surface-container-low-cafe transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto py-4 space-y-4 no-scrollbar">
              {cart.length === 0 ? (
                <div className="text-center text-on-surface-variant-cafe py-16 flex flex-col items-center justify-center">
                  <ShoppingBasket className="w-12 h-12 text-outline-cafe/30 mb-3" />
                  <p className="font-sans text-sm">Your order card is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start pb-4 border-b border-outline-cafe/10 last:border-0 text-left">
                    <div className="flex-grow pr-4">
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-sans font-bold text-sm text-primary-cafe">{item.name}</h4>
                        <span className="font-sans text-sm font-semibold text-secondary-cafe">{formatter.format(item.total)}</span>
                      </div>
                      
                      {item.modifiers.length > 0 && (
                        <div className="text-[11px] text-on-surface-variant-cafe/80 mt-1 italic leading-tight">
                          + {item.modifiers.map(m => m.name).join(', ')}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-sans text-[11px] text-on-surface-variant-cafe">Qty: {item.quantity}</span>
                        <span className="text-on-surface-variant-cafe/45">&bull;</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="font-sans text-[11px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Subtotal and checkout trigger */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-outline-cafe/10 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe">Subtotal</span>
                  <span className="font-sans text-lg font-bold text-primary-cafe">{formatter.format(cartSubtotal)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full bg-primary-cafe text-on-primary rounded-xl py-3.5 font-sans font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-primary-container-cafe transition-all cursor-pointer shadow-md"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modern Customization Modal with premium dark-contrast style */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
          
          <div className="relative w-full max-w-lg bg-surface-cafe rounded-2xl overflow-hidden border border-outline-cafe/20 shadow-2xl animate-scaleIn flex flex-col max-h-[90vh]">
            {/* Header image and exit */}
            <div className="relative h-48 md:h-56 shrink-0">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors cursor-pointer border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 text-left">
                <span className="font-sans text-[9px] uppercase font-bold tracking-widest text-secondary-container-cafe bg-secondary-cafe px-2 py-0.5 rounded-full">
                  {selectedItem.category}
                </span>
                <h2 className="font-display text-2xl font-bold text-white mt-1.5">{selectedItem.name}</h2>
              </div>
            </div>

            {/* Description & Modifier Groups */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 text-left no-scrollbar">
              <div>
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe mb-2">Chef's Description</h3>
                <p className="font-sans text-sm text-on-surface-variant-cafe leading-relaxed">{selectedItem.description}</p>
              </div>

              {/* Modifiers selector */}
              <div>
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface-variant-cafe mb-3">Customise Your Order</h3>
                {MODIFIER_DATA[selectedItem.modifierCategory] ? (
                  <div className="space-y-3">
                    {MODIFIER_DATA[selectedItem.modifierCategory].map((mod) => {
                      const isSelected = selectedModifiers.some(m => m.name === mod.name);
                      return (
                        <label
                          key={mod.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-outline-cafe/10 hover:bg-surface-container-low-cafe cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type={mod.type}
                              name={mod.group || mod.id}
                              checked={isSelected}
                              onChange={(e) =>
                                handleModifierChange(mod.name, mod.price, e.target.checked, mod.type, mod.group)
                              }
                              className="w-4 h-4 text-primary-cafe focus:ring-primary-cafe border-outline-cafe/30 rounded-md"
                            />
                            <span className="font-sans text-sm font-medium text-primary-cafe">{mod.name}</span>
                          </div>
                          <span className="font-sans text-xs font-bold text-secondary-cafe">+{formatter.format(mod.price)}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-on-surface-variant-cafe text-xs italic">No customizations available for this item.</p>
                )}
              </div>
            </div>

            {/* Total and Actions */}
            <div className="p-6 border-t border-outline-cafe/10 bg-surface-bright-cafe shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center border border-outline-cafe/30 rounded-lg overflow-hidden h-10 bg-surface-container-lowest-cafe">
                  <button
                    onClick={() => setModalQuantity(q => Math.max(1, q - 1))}
                    className="px-3 bg-surface-container-low-cafe hover:bg-surface-container-cafe text-primary-cafe transition-colors h-full flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-sans font-bold text-sm w-12 text-center flex items-center justify-center h-full">
                    {modalQuantity}
                  </span>
                  <button
                    onClick={() => setModalQuantity(q => q + 1)}
                    className="px-3 bg-surface-container-low-cafe hover:bg-surface-container-cafe text-primary-cafe transition-colors h-full flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-right">
                  <span className="text-[11px] text-on-surface-variant-cafe block leading-none mb-1">Total Price</span>
                  <span className="font-sans text-lg font-bold text-secondary-cafe leading-none block">
                    {formatter.format(calculateModalItemTotal())}
                  </span>
                </div>
              </div>

              <button
                onClick={handleAddToCartFromModal}
                className="w-full bg-primary-cafe text-on-primary rounded-lg font-sans font-semibold tracking-wider uppercase text-xs py-3.5 hover:bg-primary-container-cafe transition-all cursor-pointer shadow-md"
              >
                Add to Cart
              </button>
            </div>

          </div>
        </div>
      )}
    </motion.div>
  );
}
