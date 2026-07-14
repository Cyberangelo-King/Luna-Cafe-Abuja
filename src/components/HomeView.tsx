import { ArrowRight, Calendar, Coffee, Sparkles, Utensils } from 'lucide-react';
import { motion } from 'motion/react';
import { GALLERY_MOMENTS } from '../data';

interface HomeViewProps {
  setView: (view: 'home' | 'menu' | 'reservations' | 'events') => void;
}

export default function HomeView({ setView }: HomeViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full animate-fadeIn"
    >
      {/* Hero Section */}
      <section className="w-full px-4 md:px-16 py-12 md:py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 flex flex-col gap-6 z-10 text-left">
          <span className="font-sans text-xs font-bold tracking-widest uppercase text-secondary-cafe flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Welcome to the Sanctuary
          </span>
          <h1 className="font-display text-4xl md:text-6xl text-primary-cafe leading-tight font-bold">
            Eat. Sing. Read. Paint. Repeat.
          </h1>
          <p className="font-sans text-base md:text-lg text-on-surface-variant-cafe max-w-lg leading-relaxed">
            Join our curated community gatherings. Step out of the digital noise into a space designed for connection, creativity, and culinary delight.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <button
              onClick={() => setView('events')}
              className="inline-flex items-center justify-center font-sans font-semibold tracking-wider uppercase text-xs bg-primary-cafe text-on-primary rounded px-6 py-4 shadow-lg hover:bg-primary-container-cafe hover:-translate-y-0.5 transition-all cursor-pointer"
              style={{ boxShadow: '0 8px 24px rgba(38,66,47,0.2)' }}
            >
              Explore Events <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={() => setView('reservations')}
              className="inline-flex items-center justify-center font-sans font-semibold tracking-wider uppercase text-xs border border-secondary-cafe text-secondary-cafe rounded px-6 py-4 hover:bg-secondary-cafe/5 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Book a Table
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="w-[90%] md:w-full ml-auto rounded-2xl overflow-hidden aspect-[4/5] relative border border-outline-cafe/15 shadow-md">
            <img
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              alt="A serene, sun-drenched courtyard of a modern organic cafe in Abuja. Styled with warm cream walls, lush potted plants, and wooden furniture."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP-rQrAKqgQT7X3m-B1EdXvls9ddEYDnWVaV6y2yk_ciyMUQmml7LDF9XUaDv750qJHU3p7qLbl8ZBEiSJMzunHJsRzEpxTZlSSyTHX37eVUDzdNCjRwj5g14QoDiqgmio6Ww2xBaPwkQCnMWH9h6SuPxK7yJarl1OTGiTs1yh0b7B0XhSKpH3-iU_vlPJjA2NwA9NS5Ir82xDHjPVREcqQmxT1m6vsjOqFnjq_EyhIDGXZOtRj1ocHg"
            />
            {/* Decorative overlay shape */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-container-cafe rounded-full mix-blend-multiply opacity-40 blur-2xl pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* The "Vibe" Divider */}
      <div className="w-full flex items-center justify-center py-8 opacity-60">
        <div className="h-px w-24 bg-tertiary-cafe/20"></div>
        <span className="font-display italic text-secondary-cafe mx-4 text-xs tracking-widest flex items-center gap-1.5 uppercase font-medium">
          ☕ Sanctuary 🌿
        </span>
        <div className="h-px w-24 bg-tertiary-cafe/20"></div>
      </div>

      {/* Feature Cards / Direct Quick Links */}
      <section className="max-w-7xl mx-auto px-4 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <button
            onClick={() => setView('menu')}
            className="group relative flex flex-col items-center text-center p-8 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-xl hover:border-primary-cafe/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-14 h-14 rounded-full bg-surface-container-low-cafe flex items-center justify-center mb-6 group-hover:bg-primary-container-cafe/20 transition-colors">
              <Utensils className="w-6 h-6 text-primary-cafe" />
            </div>
            <h3 className="font-display text-lg text-primary-cafe font-bold mb-2">The Menu</h3>
            <p className="font-sans text-sm text-on-surface-variant-cafe mb-6 flex-grow leading-relaxed">
              Curated plates blending local ingredients with contemporary techniques. From Classic Belgian waffles to signature platters.
            </p>
            <span className="font-sans font-semibold tracking-wider text-xs uppercase text-secondary-cafe group-hover:text-tertiary-cafe transition-colors flex items-center gap-1">
              Explore Menu <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Card 2 */}
          <button
            onClick={() => setView('reservations')}
            className="group relative flex flex-col items-center text-center p-8 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-xl hover:border-primary-cafe/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-14 h-14 rounded-full bg-surface-container-low-cafe flex items-center justify-center mb-6 group-hover:bg-primary-container-cafe/20 transition-colors">
              <Coffee className="w-6 h-6 text-primary-cafe" />
            </div>
            <h3 className="font-display text-lg text-primary-cafe font-bold mb-2">Sunday Brunch</h3>
            <p className="font-sans text-sm text-on-surface-variant-cafe mb-6 flex-grow leading-relaxed">
              A slow, intentional morning ritual in our sunlit garden. Book your table for a cozy escape in Abuja CBD.
            </p>
            <span className="font-sans font-semibold tracking-wider text-xs uppercase text-secondary-cafe group-hover:text-tertiary-cafe transition-colors flex items-center gap-1">
              Reserve Table <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Card 3 */}
          <button
            onClick={() => setView('events')}
            className="group relative flex flex-col items-center text-center p-8 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-xl hover:border-primary-cafe/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-14 h-14 rounded-full bg-surface-container-low-cafe flex items-center justify-center mb-6 group-hover:bg-primary-container-cafe/20 transition-colors">
              <Calendar className="w-6 h-6 text-primary-cafe" />
            </div>
            <h3 className="font-display text-lg text-primary-cafe font-bold mb-2">Upcoming Events</h3>
            <p className="font-sans text-sm text-on-surface-variant-cafe mb-6 flex-grow leading-relaxed">
              Discover sunset terracotta paint nights, live acoustic sets, and community book club gatherings.
            </p>
            <span className="font-sans font-semibold tracking-wider text-xs uppercase text-secondary-cafe group-hover:text-tertiary-cafe transition-colors flex items-center gap-1">
              View Gatherings <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>

      {/* Moments at Luna (Social Media Gallery) */}
      <section className="max-w-7xl mx-auto px-4 md:px-16 py-12 md:py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-lg text-left">
            <h2 className="font-display text-2xl md:text-3xl text-primary-cafe font-bold mb-3">Moments at Luna</h2>
            <p className="font-sans text-sm md:text-base text-on-surface-variant-cafe leading-relaxed">
              Glimpses of our sunlit spaces, artisanal creations, and the beautiful community that fills our Abuja CBD courtyard.
            </p>
          </div>
          <button
            onClick={() => alert("Follow @LunaCafeAbuja on Instagram & TikTok to see daily moments, menu previews, and live event updates!")}
            className="font-sans text-xs font-bold tracking-widest uppercase text-secondary-cafe hover:text-tertiary-cafe transition-colors border-b border-secondary-cafe/30 pb-1 cursor-pointer"
          >
            Follow @LunaCafeAbuja
          </button>
        </div>

        {/* Bento Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {GALLERY_MOMENTS.map((item) => (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-xl border border-outline-cafe/10 shadow-sm aspect-[4/3] bg-surface-container-low-cafe"
            >
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={item.imageUrl}
                alt={item.alt}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <span className="text-white font-sans text-xs tracking-wider uppercase font-medium">
                  {item.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
