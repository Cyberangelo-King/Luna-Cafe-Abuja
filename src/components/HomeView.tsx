import { ArrowRight, Calendar, Coffee, Sparkles, Utensils, Heart, MessageCircle, Instagram, Video } from 'lucide-react';
import { motion } from 'motion/react';
import { GALLERY_MOMENTS } from '../data';

interface HomeViewProps {
  setView: (view: 'home' | 'menu' | 'reservations' | 'events') => void;
}

export default function HomeView({ setView }: HomeViewProps) {
  const handleFollowClick = () => {
    window.open("https://instagram.com/lolascafe.ng", "_blank");
  };

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
            <Sparkles className="w-4 h-4 text-secondary-cafe animate-pulse" /> Welcome to Lola's Sanctuary
          </span>
          <h1 className="font-display text-4xl md:text-6xl text-primary-cafe leading-tight font-black tracking-tight">
            Eat. Sing. Read. Paint. Repeat.
          </h1>
          <p className="font-sans text-base md:text-lg text-on-surface-variant-cafe max-w-lg leading-relaxed">
            Lola's Cafe is a premium lifestyle food brand in Nigeria. Join our curated community gatherings or indulge in our hyper-fresh deliveries in Lagos & Delta State. Step out of the digital noise.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <button
              onClick={() => setView('menu')}
              className="inline-flex items-center justify-center font-sans font-bold tracking-wider uppercase text-xs bg-primary-cafe text-on-primary rounded-xl px-7 py-4 shadow-lg hover:bg-primary-container-cafe hover:-translate-y-0.5 transition-all cursor-pointer"
              style={{ boxShadow: '0 8px 24px rgba(38,66,47,0.2)' }}
            >
              Order Digital Menu <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={() => setView('reservations')}
              className="inline-flex items-center justify-center font-sans font-bold tracking-wider uppercase text-xs border-2 border-secondary-cafe text-secondary-cafe rounded-xl px-7 py-4 hover:bg-secondary-cafe/5 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Book a Courtyard Table
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="w-[90%] md:w-full ml-auto rounded-3xl overflow-hidden aspect-[4/5] relative border border-outline-cafe/25 shadow-xl">
            <img
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-750"
              alt="A serene, sun-drenched courtyard garden sanctuary of Lola's Cafe in Abraka, Delta State. Styled with warm, golden lit amber fixtures, potted palms, and wooden bistro seating."
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
            />
            {/* Ambient Yellow Glow */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary-cafe rounded-full mix-blend-multiply opacity-30 blur-3xl pointer-events-none animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* The "Vibe" Divider */}
      <div className="w-full flex items-center justify-center py-8 opacity-60">
        <div className="h-px w-24 bg-tertiary-cafe/20"></div>
        <span className="font-display italic text-secondary-cafe mx-4 text-xs tracking-widest flex items-center gap-1.5 uppercase font-black">
          ☕ Lola's Sanctuary 🌿
        </span>
        <div className="h-px w-24 bg-tertiary-cafe/20"></div>
      </div>

      {/* Feature Cards / Direct Quick Links */}
      <section className="max-w-7xl mx-auto px-4 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <button
            onClick={() => setView('menu')}
            className="group relative flex flex-col items-center text-center p-8 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl hover:border-primary-cafe/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-14 h-14 rounded-full bg-surface-container-low-cafe flex items-center justify-center mb-6 group-hover:bg-primary-container-cafe/20 transition-colors">
              <Utensils className="w-6 h-6 text-primary-cafe" />
            </div>
            <h3 className="font-display text-lg text-primary-cafe font-bold mb-2">The Menu</h3>
            <p className="font-sans text-sm text-on-surface-variant-cafe mb-6 flex-grow leading-relaxed">
              Premium burgers, supreme pizza, hand-pulled stretchy corndogs, sticky hot wings, and authentic layered boba bubble teas. Hand-crafted with absolute love.
            </p>
            <span className="font-sans font-bold tracking-wider text-xs uppercase text-secondary-cafe group-hover:text-tertiary-cafe transition-colors flex items-center gap-1">
              Explore Menu <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Card 2 */}
          <button
            onClick={() => setView('reservations')}
            className="group relative flex flex-col items-center text-center p-8 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl hover:border-primary-cafe/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-14 h-14 rounded-full bg-surface-container-low-cafe flex items-center justify-center mb-6 group-hover:bg-primary-container-cafe/20 transition-colors">
              <Coffee className="w-6 h-6 text-primary-cafe" />
            </div>
            <h3 className="font-display text-lg text-primary-cafe font-bold mb-2">Dine-In Courtyard</h3>
            <p className="font-sans text-sm text-on-surface-variant-cafe mb-6 flex-grow leading-relaxed">
              A slow, intentional morning ritual in our sunlit Abraka courtyard garden. Reserve your table ahead to escape the digital noise.
            </p>
            <span className="font-sans font-bold tracking-wider text-xs uppercase text-secondary-cafe group-hover:text-tertiary-cafe transition-colors flex items-center gap-1">
              Reserve Table <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>

          {/* Card 3 */}
          <button
            onClick={() => setView('events')}
            className="group relative flex flex-col items-center text-center p-8 bg-surface-container-lowest-cafe border border-outline-cafe/15 rounded-2xl hover:border-primary-cafe/30 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
          >
            <div className="w-14 h-14 rounded-full bg-surface-container-low-cafe flex items-center justify-center mb-6 group-hover:bg-primary-container-cafe/20 transition-colors">
              <Calendar className="w-6 h-6 text-primary-cafe" />
            </div>
            <h3 className="font-display text-lg text-primary-cafe font-bold mb-2">Upcoming Events</h3>
            <p className="font-sans text-sm text-on-surface-variant-cafe mb-6 flex-grow leading-relaxed">
              Discover terracotta garden paint and sip nights, live courtyard acoustic jams, boba karaoke, and book club community gathers.
            </p>
            <span className="font-sans font-bold tracking-wider text-xs uppercase text-secondary-cafe group-hover:text-tertiary-cafe transition-colors flex items-center gap-1">
              View Gatherings <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>

      {/* Lola's Community (Social Media Feed Media Wall) */}
      <section className="max-w-7xl mx-auto px-4 md:px-16 py-12 md:py-24 border-t border-outline-cafe/10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-lg text-left">
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-extrabold text-secondary-cafe block mb-2">
              📸 LIVE FEED WALL
            </span>
            <h2 className="font-display text-3xl md:text-4xl text-primary-cafe font-black tracking-tight">
              Lola's Community
            </h2>
            <p className="font-sans text-sm md:text-base text-on-surface-variant-cafe mt-2 leading-relaxed">
              Glimpses of our golden-lit spaces, artisanal burger pulls, stretchy corndog chews, and the beautiful creative tribe that fills our sanctuary.
            </p>
          </div>
          <button
            onClick={handleFollowClick}
            className="inline-flex items-center gap-2 font-sans text-xs font-black tracking-widest uppercase text-secondary-cafe hover:text-tertiary-cafe transition-all border-b-2 border-secondary-cafe/30 pb-1 cursor-pointer"
          >
            <Instagram className="w-4 h-4" /> Follow @lolascafe.ng
          </button>
        </div>

        {/* Masonry Bento Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_MOMENTS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative group overflow-hidden rounded-2xl border border-outline-cafe/15 shadow-sm bg-surface-container-low-cafe cursor-pointer"
              style={{
                // Simulate a gorgeous organic masonry aspect ratio stagger
                aspectRatio: index % 3 === 0 ? '1/1' : index % 3 === 1 ? '4/5' : '16/11'
              }}
            >
              {/* Image */}
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={item.imageUrl}
                alt={item.alt}
              />
              
              {/* Platform Badge Overlay */}
              <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:bg-primary-cafe/90 transition-all">
                {item.platform === 'instagram' ? (
                  <Instagram className="w-4 h-4" />
                ) : (
                  <Video className="w-4 h-4" />
                )}
              </div>

              {/* Hover Stats overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                <span className="text-secondary-container-cafe font-sans text-[10px] uppercase font-bold tracking-widest block mb-2">
                  @{item.platform === 'instagram' ? 'lolascafe.ng' : 'lolascafe.ng on tiktok'}
                </span>
                
                <h4 className="text-white font-sans text-sm font-semibold leading-snug mb-4">
                  {item.alt}
                </h4>

                <div className="flex items-center gap-4 text-white/90 border-t border-white/10 pt-3 text-xs font-sans">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500 shrink-0" />
                    <span className="font-bold">{item.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 text-secondary-container-cafe shrink-0" />
                    <span className="font-bold">{item.comments}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
