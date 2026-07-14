/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu, ShoppingBag, X, ShieldCheck, Compass, Calendar, Coffee, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentView: 'home' | 'menu' | 'reservations' | 'events' | 'portal';
  setView: (view: 'home' | 'menu' | 'reservations' | 'events' | 'portal') => void;
  cartCount: number;
  openCart: () => void;
  selectedLocation?: 'abraka' | 'lagos' | null;
  onResetLocation?: () => void;
}

export default function Header({ 
  currentView, 
  setView, 
  cartCount, 
  openCart,
  selectedLocation,
  onResetLocation
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'menu' | 'reservations' | 'events' | 'portal') => {
    setView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-cafe/95 backdrop-blur-md border-b border-outline-cafe/15 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-4 md:px-16 py-4 max-w-7xl mx-auto">
        
        {/* Brand Logo and Location Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group text-left focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-full bg-primary-cafe flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 shadow-md border border-outline-cafe/15" style={{ boxShadow: '0 4px 12px rgba(38,66,47,0.2)' }}>
              {/* Elegant Crescent Moon design overlay */}
              <div className="absolute w-7 h-7 rounded-full border-r-2 border-b-2 border-secondary-container-cafe -rotate-45" />
              <div className="absolute top-2 right-2 w-1 h-1 bg-secondary-container-cafe rounded-full animate-pulse" />
              <div className="relative z-10 flex flex-col items-center">
                <span className="font-display text-sm font-extrabold text-on-primary">L</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl md:text-2xl font-black tracking-widest text-primary-cafe leading-none uppercase">
                Lola
              </span>
              <span className="font-sans text-[8px] uppercase tracking-[0.25em] font-extrabold text-secondary-cafe mt-1.5 leading-none">
                Café &bull; Nigeria
              </span>
            </div>
          </button>

          {/* Dynamic Location Badge */}
          {selectedLocation && (
            <button
              onClick={onResetLocation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-cafe/10 hover:bg-secondary-cafe/20 border border-secondary-cafe/15 text-secondary-cafe font-sans text-[9px] uppercase font-bold tracking-wider transition-all duration-200 cursor-pointer shadow-sm ml-2 group"
              title="Click to switch your location hub"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-cafe shrink-0 animate-pulse" />
              <span>📍 {selectedLocation === 'abraka' ? 'Abraka Hub' : 'Lagos Delivery'}</span>
              <span className="text-[8px] text-on-surface-variant-cafe/50 font-normal lowercase tracking-normal bg-surface-cafe/80 px-1 py-0.5 rounded-md border border-outline-cafe/10 group-hover:text-secondary-cafe group-hover:bg-white transition-all ml-1">&bull; switch</span>
            </button>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick('menu')}
            className={`font-sans font-bold text-xs tracking-widest uppercase cursor-pointer transition-colors ${
              currentView === 'menu'
                ? 'text-secondary-cafe border-b-2 border-secondary-cafe pb-1'
                : 'text-on-surface-variant-cafe hover:text-secondary-cafe'
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => handleNavClick('reservations')}
            className={`font-sans font-bold text-xs tracking-widest uppercase cursor-pointer transition-colors ${
              currentView === 'reservations'
                ? 'text-secondary-cafe border-b-2 border-secondary-cafe pb-1'
                : 'text-on-surface-variant-cafe hover:text-secondary-cafe'
            }`}
          >
            Reservations
          </button>
          <button
            onClick={() => handleNavClick('events')}
            className={`font-sans font-bold text-xs tracking-widest uppercase cursor-pointer transition-colors ${
              currentView === 'events'
                ? 'text-secondary-cafe border-b-2 border-secondary-cafe pb-1'
                : 'text-on-surface-variant-cafe hover:text-secondary-cafe'
            }`}
          >
            Events
          </button>
          {currentView === 'portal' && (
            <button
              onClick={() => handleNavClick('portal')}
              className="font-sans font-bold text-xs tracking-widest uppercase text-secondary-cafe border-b-2 border-secondary-cafe pb-1 flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Owner Lounge
            </button>
          )}
        </nav>

        {/* Actions (Desktop) with perfect high-contrast colors */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => openCart()}
            className="relative p-2.5 rounded-full bg-surface-container-low-cafe text-primary-cafe hover:bg-surface-container-cafe transition-all cursor-pointer border border-outline-cafe/15"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5 text-primary-cafe" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-cafe text-on-secondary text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface-cafe animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => handleNavClick('menu')}
            className="font-sans text-[10px] tracking-widest uppercase text-secondary-cafe border-2 border-secondary-cafe rounded-lg px-4 py-2 hover:bg-secondary-cafe/5 transition-all cursor-pointer font-black"
          >
            Order Now
          </button>
          <button
            onClick={() => handleNavClick('reservations')}
            className="font-sans text-[10px] tracking-widest uppercase bg-primary-cafe text-on-primary rounded-lg px-5 py-2.5 font-black shadow-md hover:bg-primary-container-cafe transition-all cursor-pointer border-0"
            style={{ boxShadow: '0 4px 20px rgba(38,66,47,0.15)' }}
          >
            Book a Table
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => openCart()}
            className="relative p-2 rounded-full bg-surface-container-low-cafe text-primary-cafe hover:bg-surface-container-cafe transition-colors cursor-pointer border border-outline-cafe/15"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-5 h-5 text-primary-cafe" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-cafe text-on-secondary text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface-cafe">
                {cartCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-primary-cafe hover:text-secondary-cafe transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-[280px] bg-surface-container-lowest-cafe shadow-2xl p-6 flex flex-col gap-6 animate-slideUp">
            <div className="flex justify-between items-center pb-4 border-b border-outline-cafe/15">
              <span className="font-display text-lg text-primary-cafe font-bold flex items-center gap-2">
                <Compass className="w-5 h-5 text-secondary-cafe" /> Escape Menu
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full text-on-surface-variant-cafe hover:bg-surface-container-low-cafe transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-3 text-left">
              <button
                onClick={() => handleNavClick('home')}
                className={`py-3 px-4 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all ${
                  currentView === 'home'
                    ? 'bg-primary-cafe text-on-primary font-black'
                    : 'text-on-surface-variant-cafe hover:bg-surface-container-low-cafe'
                }`}
              >
                Home Escape
              </button>
              <button
                onClick={() => handleNavClick('menu')}
                className={`py-3 px-4 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all ${
                  currentView === 'menu'
                    ? 'bg-primary-cafe text-on-primary font-black'
                    : 'text-on-surface-variant-cafe hover:bg-surface-container-low-cafe'
                }`}
              >
                Coffee &amp; Brunch Menu
              </button>
              <button
                onClick={() => handleNavClick('reservations')}
                className={`py-3 px-4 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all ${
                  currentView === 'reservations'
                    ? 'bg-primary-cafe text-on-primary font-black'
                    : 'text-on-surface-variant-cafe hover:bg-surface-container-low-cafe'
                }`}
              >
                Book a Courtyard Table
              </button>
              <button
                onClick={() => handleNavClick('events')}
                className={`py-3 px-4 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all ${
                  currentView === 'events'
                    ? 'bg-primary-cafe text-on-primary font-black'
                    : 'text-on-surface-variant-cafe hover:bg-surface-container-low-cafe'
                }`}
              >
                Community Events
              </button>
              <button
                onClick={() => handleNavClick('portal')}
                className={`py-3 px-4 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  currentView === 'portal'
                    ? 'bg-primary-cafe text-on-primary font-black'
                    : 'text-on-surface-variant-cafe hover:bg-surface-container-low-cafe'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-secondary-cafe" />
                Staff Dashboard
              </button>
            </nav>

            <div className="mt-auto pt-6 border-t border-outline-cafe/15 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('menu')}
                className="w-full text-center bg-transparent border-2 border-secondary-cafe text-secondary-cafe rounded-xl py-3.5 font-bold text-xs tracking-wider uppercase transition-all"
              >
                Order Online
              </button>
              <button
                onClick={() => handleNavClick('reservations')}
                className="w-full text-center bg-primary-cafe text-on-primary rounded-xl py-3.5 font-bold text-xs tracking-wider uppercase transition-all border-0"
                style={{ boxShadow: '0 4px 14px rgba(38,66,47,0.15)' }}
              >
                Reservations
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
