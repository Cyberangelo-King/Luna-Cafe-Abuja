/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  setView?: (view: 'home' | 'menu' | 'reservations' | 'events' | 'portal' | 'owner') => void;
  triggerToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export default function Footer({ setView, triggerToast }: FooterProps) {
  const handleLogoClick = () => {
    if (setView) {
      setView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLinkClick = (text: string) => {
    if (triggerToast) {
      triggerToast(text, 'info');
    }
  };

  return (
    <footer className="w-full bg-surface-container-lowest-cafe border-t border-outline-cafe/15 transition-colors duration-300 relative z-10 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 md:px-16 max-w-7xl mx-auto gap-8">
        
        {/* Brand */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <button
            onClick={handleLogoClick}
            className="font-display text-xl text-primary-cafe font-extrabold tracking-tight hover:opacity-85 transition-opacity cursor-pointer block"
          >
            Luna Cafe &bull; Abuja
          </button>
          <span className="font-sans text-xs text-on-surface-variant-cafe/80 mt-1 block">
            Your cozy organic escape in the heart of CBD.
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
          <button
            onClick={() => handleLinkClick("About Us: Founded in Abuja CBD, we serve artisanal single-origin coffees and organic brunch.")}
            className="font-sans text-xs font-bold tracking-wider uppercase text-on-surface-variant-cafe hover:text-secondary-cafe transition-colors cursor-pointer"
          >
            About Us
          </button>
          <button
            onClick={() => handleLinkClick("Sustainability: Our cafe utilizes 100% biodegradable cups and directly sources from local Nigerian micro-farmers.")}
            className="font-sans text-xs font-bold tracking-wider uppercase text-on-surface-variant-cafe hover:text-secondary-cafe transition-colors cursor-pointer"
          >
            Sustainability
          </button>
          <button
            onClick={() => handleLinkClick("Careers: Send your portfolio or resume to careers@lunacafeabuja.com. We are hiring bakers & baristas!")}
            className="font-sans text-xs font-bold tracking-wider uppercase text-on-surface-variant-cafe hover:text-secondary-cafe transition-colors cursor-pointer"
          >
            Careers
          </button>
          <button
            onClick={() => handleLinkClick("Contact: Plot 1042 CBD, Abuja. Phone: +234 809 LUNA CAFE. Hours: Mon-Sat 8am-10pm, Sun Brunch 10am-4pm.")}
            className="font-sans text-xs font-bold tracking-wider uppercase text-on-surface-variant-cafe hover:text-secondary-cafe transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Rightmost column: Role-Based Portals & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-3.5">
          {setView && (
            <div className="flex flex-row flex-wrap justify-center md:justify-end gap-2">
              <button
                onClick={() => {
                  setView('portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-secondary-cafe bg-secondary-cafe/10 px-3 py-1.5 rounded-lg hover:bg-secondary-cafe/20 transition-all cursor-pointer border border-secondary-cafe/25"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Staff Portal
              </button>
              
              <button
                onClick={() => {
                  setView('owner');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-wider text-primary-cafe bg-primary-cafe/10 px-3 py-1.5 rounded-lg hover:bg-primary-cafe/20 transition-all cursor-pointer border border-primary-cafe/25"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Owner Boardroom
              </button>
            </div>
          )}
          <div className="font-sans text-[11px] text-on-surface-variant-cafe/60 text-center md:text-right">
            &copy; 2026 Luna Cafe Abuja. Peak hospitality, sustainably engineered.
          </div>
        </div>

      </div>
    </footer>
  );
}
