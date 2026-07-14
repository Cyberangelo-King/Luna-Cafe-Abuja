import { motion } from 'motion/react';
import { MapPin, Store, Truck, ArrowRight, Sparkles, PhoneCall, Clock } from 'lucide-react';

interface LocationModalProps {
  onSelect: (location: 'abraka' | 'lagos') => void;
}

export default function LocationModal({ onSelect }: LocationModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl bg-surface-container-lowest-cafe border border-outline-cafe/25 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-8"
        style={{ boxShadow: '0 25px 50px -12px rgba(38,66,47,0.5)' }}
      >
        {/* Top Branding Header */}
        <div className="p-8 md:p-10 text-center border-b border-outline-cafe/10 bg-surface-cafe">
          <div className="relative w-12 h-12 rounded-full bg-primary-cafe flex items-center justify-center overflow-hidden mx-auto mb-4 shadow-md border border-outline-cafe/15">
            <div className="absolute w-8 h-8 rounded-full border-r-2 border-b-2 border-secondary-container-cafe -rotate-45" />
            <span className="font-display text-lg font-extrabold text-on-primary relative z-10">L</span>
          </div>
          
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase font-black text-secondary-cafe block mb-2">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 animate-pulse" /> PREMIUM LIFESTYLE FOOD BRAND &bull; NIGERIA
          </span>
          <h2 className="font-display text-3xl md:text-4xl text-primary-cafe font-black tracking-tight">
            Welcome to Lola's Cafe
          </h2>
          <p className="font-sans text-sm text-on-surface-variant-cafe/90 max-w-2xl mx-auto mt-3 leading-relaxed">
            To prevent wrong-state order errors and experience our kitchen's hyper-local freshness, please select your regional service hub below:
          </p>
        </div>

        {/* Split Screen Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-outline-cafe/15 flex-grow">
          
          {/* OPTION 1: ABRAKA */}
          <div className="p-8 md:p-12 flex flex-col justify-between hover:bg-surface-container-low-cafe/50 transition-colors duration-300 text-left group">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-cafe/10 flex items-center justify-center border border-primary-cafe/20 text-primary-cafe group-hover:scale-110 transition-transform">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-wider font-extrabold text-secondary-cafe px-2.5 py-1 rounded-full bg-secondary-cafe/10 border border-secondary-cafe/15">
                    Walk-In & Delivery
                  </span>
                  <h3 className="font-display text-2xl font-bold text-primary-cafe mt-1.5">
                    Abraka, Delta State
                  </h3>
                </div>
              </div>

              <p className="font-sans text-sm text-on-surface-variant-cafe leading-relaxed">
                Visit our physical, yellow-lit lifestyle sanctuary or order delivery right to your door. Indulge in hot corndogs, fresh boba, and flame-grilled burgers in our gorgeous garden courtyard.
              </p>

              {/* Specific Regional Details */}
              <div className="space-y-3 pt-2 text-xs font-sans text-on-surface-variant-cafe/85">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-secondary-cafe shrink-0" />
                  <span>Ekrejeta Road, Abraka, Delta State</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-secondary-cafe shrink-0" />
                  <span>Open Daily: 9:00 AM – 8:00 PM (Walk-In & Delivery)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-secondary-cafe shrink-0" />
                  <span>Support Lines: 09162509367 or 09015704346</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-auto">
              <button
                onClick={() => onSelect('abraka')}
                className="w-full inline-flex items-center justify-center font-sans font-bold tracking-wider uppercase text-xs bg-primary-cafe text-on-primary py-4 px-6 rounded-xl transition-all duration-300 group-hover:bg-primary-container-cafe group-hover:translate-y-[-2px] cursor-pointer shadow-md"
              >
                Enter Abraka Digital Hub <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* OPTION 2: LAGOS */}
          <div className="p-8 md:p-12 flex flex-col justify-between hover:bg-surface-container-low-cafe/50 transition-colors duration-300 text-left group">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-cafe/10 flex items-center justify-center border border-secondary-cafe/20 text-secondary-cafe group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-wider font-extrabold text-amber-700 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                    Delivery Only
                  </span>
                  <h3 className="font-display text-2xl font-bold text-primary-cafe mt-1.5">
                    Lagos State Delivery
                  </h3>
                </div>
              </div>

              <p className="font-sans text-sm text-on-surface-variant-cafe leading-relaxed">
                Our active culinary fulfillment network delivers premium burgers, pizzas, and wings directly to your doorstep across Lagos (Mainland & Island hubs). Ordering is direct, fast, and secure.
              </p>

              {/* Specific Regional Details */}
              <div className="space-y-3 pt-2 text-xs font-sans text-on-surface-variant-cafe/85">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-secondary-cafe shrink-0" />
                  <span>Lagos Fulfillment Hubs (Mainland & Island Delivery Network)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-secondary-cafe shrink-0" />
                  <span>Fulfillment Hours: Fast Home Delivery Only</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-4 h-4 text-secondary-cafe shrink-0" />
                  <span>Support Line: 09035504344</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-auto">
              <button
                onClick={() => onSelect('lagos')}
                className="w-full inline-flex items-center justify-center font-sans font-bold tracking-wider uppercase text-xs border-2 border-secondary-cafe text-secondary-cafe py-3.5 px-6 rounded-xl transition-all duration-300 hover:bg-secondary-cafe/5 group-hover:bg-secondary-cafe group-hover:text-white group-hover:translate-y-[-2px] cursor-pointer shadow-sm"
              >
                Enter Lagos Delivery Hub <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
