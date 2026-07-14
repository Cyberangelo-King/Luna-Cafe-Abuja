/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import MenuView from './components/MenuView';
import ReservationsView from './components/ReservationsView';
import EventsView from './components/EventsView';
import CheckoutView from './components/CheckoutView';
import PortalView from './components/PortalView';
import OwnerDashboardView from './components/OwnerDashboardView';
import LocationModal from './components/LocationModal';
import { CartItem } from './types';
import { initializeStorage } from './services/cafeDataService';

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<'abraka' | 'lagos' | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lolas_cafe_location') as 'abraka' | 'lagos' | null;
    }
    return null;
  });
  const [currentView, setView] = useState<'home' | 'menu' | 'reservations' | 'events' | 'checkout' | 'portal' | 'owner'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  
  // Custom non-intrusive Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error'; id: number } | null>(null);

  // Initial seeding on app mount and handle unlisted routes
  useEffect(() => {
    initializeStorage();

    const handleUrlRouting = () => {
      const hash = window.location.hash.toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      const pageParam = searchParams.get('page')?.toLowerCase();

      if (hash === '#/staff' || hash === '#/portal' || pageParam === 'staff') {
        setView('portal');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#/admin' || hash === '#/boss' || pageParam === 'admin' || pageParam === 'boss') {
        setView('owner');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#/home' || hash === '#/' || pageParam === 'home') {
        setView('home');
      }
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    return () => window.removeEventListener('hashchange', handleUrlRouting);
  }, []);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now();
    setToast({ message, type, id });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleAddToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      // Find if we already have the exact same item with exact same modifiers
      const existingIdx = prevCart.findIndex(
        (item) =>
          item.name === newItem.name &&
          JSON.stringify(item.modifiers) === JSON.stringify(newItem.modifiers)
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        const prevItem = updated[existingIdx];
        const newQty = prevItem.quantity + newItem.quantity;
        updated[existingIdx] = {
          ...prevItem,
          quantity: newQty,
          total: prevItem.unitTotal * newQty,
        };
        return updated;
      }

      return [...prevCart, newItem];
    });
    triggerToast(`Added ${newItem.quantity}x ${newItem.name} to your order!`, 'success');
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const removedItem = prevCart.find((item) => item.id === itemId);
      if (removedItem) {
        triggerToast(`Removed ${removedItem.name} from your order.`, 'info');
      }
      return prevCart.filter((item) => item.id !== itemId);
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSelectLocation = (loc: 'abraka' | 'lagos') => {
    setSelectedLocation(loc);
    localStorage.setItem('lolas_cafe_location', loc);
    triggerToast(`Welcome to Lola's Cafe - ${loc === 'abraka' ? 'Abraka Hub' : 'Lagos Delivery Hub'}!`, 'success');
    setView('menu');
  };

  const handleViewChange = (view: 'home' | 'menu' | 'reservations' | 'events' | 'checkout' | 'portal' | 'owner') => {
    setView(view);
    setCartSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-cafe text-primary-cafe font-sans selection:bg-secondary-cafe/20 selection:text-secondary-cafe">
      
      {/* Geolocation forced selection */}
      {selectedLocation === null && (
        <LocationModal onSelect={handleSelectLocation} />
      )}

      {/* Universal Sticky Header Navigation */}
      <Header
        currentView={currentView === 'checkout' ? 'menu' : currentView}
        setView={(v) => handleViewChange(v)}
        cartCount={cartCount}
        openCart={() => setCartSidebarOpen(true)}
        selectedLocation={selectedLocation}
        onResetLocation={() => setSelectedLocation(null)}
      />

      {/* Main Container */}
      <main className="flex-grow w-full">
        {currentView === 'home' && (
          <HomeView setView={(v) => handleViewChange(v)} />
        )}
        
        {currentView === 'menu' && (
          <MenuView
            cart={cart}
            addToCart={handleAddToCart}
            removeFromCart={handleRemoveFromCart}
            openCart={() => setCartSidebarOpen(true)}
            closeCart={() => setCartSidebarOpen(false)}
            cartSidebarOpen={cartSidebarOpen}
            onCheckout={() => handleViewChange('checkout')}
          />
        )}

        {currentView === 'reservations' && (
          <ReservationsView
            onBackToHome={() => handleViewChange('home')}
            onViewMenu={() => handleViewChange('menu')}
          />
        )}

        {currentView === 'events' && (
          <EventsView
            onBackToHome={() => handleViewChange('home')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            cart={cart}
            onBackToMenu={() => handleViewChange('menu')}
            onOrderSuccess={() => handleViewChange('menu')}
            clearCart={handleClearCart}
            triggerToast={triggerToast}
            selectedLocation={selectedLocation || 'abraka'}
          />
        )}

        {currentView === 'portal' && (
          <PortalView triggerToast={triggerToast} />
        )}

        {currentView === 'owner' && (
          <OwnerDashboardView triggerToast={triggerToast} onBackToHome={() => handleViewChange('home')} />
        )}
      </main>

      {/* Universal Footer */}
      <Footer setView={(v) => handleViewChange(v)} triggerToast={triggerToast} />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-[100] max-w-sm bg-primary-cafe text-on-primary rounded-xl p-4 shadow-xl border border-primary-container-cafe flex items-start gap-3 animate-fadeIn"
            style={{ boxShadow: '0 10px 30px rgba(38,66,47,0.3)' }}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-secondary-container-cafe shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-on-primary-container-cafe shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            
            <div className="flex-grow text-left">
              <p className="font-sans text-xs font-bold uppercase tracking-wider text-secondary-container-cafe">
                {toast.type === 'success' ? 'Success' : toast.type === 'info' ? 'Notification' : 'Notice'}
              </p>
              <p className="font-sans text-sm text-on-primary mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => setToast(null)}
              className="p-1 rounded-full text-on-primary/60 hover:text-on-primary hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
