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
            Lola's Cafe
          </button>
          <span className="font-sans text-xs text-on-surface-variant-cafe/80 mt-1 block">
            Premium lifestyle food brand & delivery network in Nigeria.
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8">
          <button
            onClick={() => handleLinkClick("About Us: We craft premium burgers, supreme pizza, corndogs, fries, wings, and boba milk tea. Sourcing fresh local ingredients to serve Delta and Lagos.")}
            className="font-sans text-xs font-bold tracking-wider uppercase text-on-surface-variant-cafe hover:text-secondary-cafe transition-colors cursor-pointer"
          >
            About Us
          </button>
          <button
            onClick={() => handleLinkClick("Sustainability: We are committed to eco-friendly packaging, reducing single-use plastics in our boba tea lines, and supporting local poultry & farm suppliers.")}
            className="font-sans text-xs font-bold tracking-wider uppercase text-on-surface-variant-cafe hover:text-secondary-cafe transition-colors cursor-pointer"
          >
            Sustainability
          </button>
          <button
            onClick={() => handleLinkClick("Careers: We are always looking for stellar kitchen and delivery superstars! Contact us at careers@lolascafe.ng.")}
            className="font-sans text-xs font-bold tracking-wider uppercase text-on-surface-variant-cafe hover:text-secondary-cafe transition-colors cursor-pointer"
          >
            Careers
          </button>
          <button
            onClick={() => handleLinkClick("Contact Hubs: [Abraka Court] Ekrejeta Road, Abraka (09015704346, 9am-8pm daily) &bull; [Lagos Hub] Delivery network (09035504344).")}
            className="font-sans text-xs font-bold tracking-wider uppercase text-on-surface-variant-cafe hover:text-secondary-cafe transition-colors cursor-pointer"
          >
            Contact
          </button>
        </nav>

        {/* Rightmost column: Copyright */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="font-sans text-[11px] text-on-surface-variant-cafe/60 text-center md:text-right">
            &copy; 2026 Lola's Cafe. Peak hospitality, sustainably engineered.
          </div>
        </div>

      </div>
    </footer>
  );
}
