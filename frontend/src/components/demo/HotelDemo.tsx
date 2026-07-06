'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Waves,
  UtensilsCrossed,
  Briefcase,
  Palmtree,
  Sparkles,
  Wine,
  Dumbbell,
  Wifi,
  Bed,
  Bath,
  Tv,
  Coffee,
  MountainSnow,
  GlassWater,
  ChefHat,
  Utensils,

  MonitorSmartphone,
  Users,
  Presentation,
  Globe,
  TreePine,
  Sailboat,
  Trophy,
  Palette,
  Star,
  CalendarDays,
  UserRound,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import ScrollReveal from '@/components/effects/ScrollReveal';

/* ------------------------------------------------------------------ */
/*  Page transition variants                                           */
/* ------------------------------------------------------------------ */
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ------------------------------------------------------------------ */
/*  Room data                                                          */
/* ------------------------------------------------------------------ */
const rooms = [
  {
    name: 'Deluxe Room',
    price: '$299',
    period: '/night',
    description: 'Elegant comfort with panoramic city views and refined furnishings.',
    gradient: 'from-amber-900/40 via-stone-900/60 to-neutral-900/80',
    accentGradient: 'from-amber-500/20 to-orange-600/10',
    amenities: [
      { icon: Bed, label: 'King-Size Bed' },
      { icon: Bath, label: 'Marble Bathroom' },
      { icon: Tv, label: '55" Smart TV' },
      { icon: Coffee, label: 'Nespresso Machine' },
      { icon: Wifi, label: 'High-Speed WiFi' },
      { icon: Clock, label: '24/7 Room Service' },
    ],
  },
  {
    name: 'Executive Suite',
    price: '$599',
    period: '/night',
    description: 'Spacious living area with dedicated workspace and lounge access.',
    gradient: 'from-amber-800/40 via-yellow-900/50 to-stone-900/70',
    accentGradient: 'from-amber-400/20 to-yellow-500/10',
    amenities: [
      { icon: Bed, label: 'King-Size Bed' },
      { icon: Bath, label: 'Jacuzzi Tub' },
      { icon: Tv, label: '65" Smart TV' },
      { icon: Coffee, label: 'Premium Coffee Bar' },
      { icon: Wifi, label: 'High-Speed WiFi' },
      { icon: MonitorSmartphone, label: 'Smart Room Control' },
      { icon: GlassWater, label: 'Minibar Included' },
      { icon: Users, label: 'Lounge Access' },
    ],
  },
  {
    name: 'Presidential Suite',
    price: '$1,299',
    period: '/night',
    description: 'The pinnacle of luxury — private terrace, butler service, and curated art.',
    gradient: 'from-amber-700/30 via-amber-900/40 to-stone-900/60',
    accentGradient: 'from-amber-300/20 to-amber-500/10',
    amenities: [
      { icon: Bed, label: 'California King Bed' },
      { icon: Bath, label: 'Spa Bathroom' },
      { icon: Tv, label: '75" OLED TV' },
      { icon: Coffee, label: 'Private Barista' },
      { icon: Wifi, label: 'Dedicated WiFi' },
      { icon: MonitorSmartphone, label: 'Full Home Automation' },
      { icon: ShieldCheck, label: 'Private Butler' },
      { icon: Palette, label: 'Curated Art Collection' },
      { icon: MountainSnow, label: 'Private Terrace' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Amenity tabs data                                                  */
/* ------------------------------------------------------------------ */
type AmenityTab = 'wellness' | 'dining' | 'business' | 'leisure';

const amenityTabs: { key: AmenityTab; label: string; icon: React.ElementType }[] = [
  { key: 'wellness', label: 'Wellness', icon: Waves },
  { key: 'dining', label: 'Dining', icon: UtensilsCrossed },
  { key: 'business', label: 'Business', icon: Briefcase },
  { key: 'leisure', label: 'Leisure', icon: Palmtree },
];

const amenityData: Record<AmenityTab, { name: string; icon: React.ElementType; description: string }[]> = {
  wellness: [
    { name: 'Aurelian Spa', icon: Sparkles, description: 'Full-service spa with signature treatments and relaxation rituals.' },
    { name: 'Infinity Pool', icon: Waves, description: 'Rooftop heated pool with panoramic skyline views.' },
    { name: 'Yoga Studio', icon: Dumbbell, description: 'Daily sunrise and sunset yoga sessions with expert instructors.' },
    { name: 'Steam Room', icon: Coffee, description: 'Eucalyptus-infused steam room for ultimate rejuvenation.' },
  ],
  dining: [
    { name: 'Three Restaurants', icon: Utensils, description: 'Michelin-starred cuisine, Asian fusion, and Mediterranean grill.' },
    { name: 'Rooftop Bar', icon: Wine, description: 'Craft cocktails and tapas under the stars with DJ sets.' },
    { name: 'In-Room Dining', icon: ChefHat, description: 'Gourmet meals delivered to your door, any hour of the night.' },
    { name: 'Wine Cellar', icon: Wine, description: 'Curated collection of 2,000+ bottles with sommelier-guided tastings.' },
  ],
  business: [
    { name: 'Meeting Rooms', icon: Users, description: 'Nine flexible rooms equipped with state-of-the-art AV technology.' },
    { name: 'Business Center', icon: Briefcase, description: 'Dedicated co-working space with printing, scanning, and admin support.' },
    { name: 'Event Space', icon: Presentation, description: 'Grand ballroom for up to 500 guests with custom event planning.' },
    { name: 'High-Speed WiFi', icon: Wifi, description: 'Dedicated fiber network with guaranteed 1 Gbps throughout the property.' },
  ],
  leisure: [
    { name: 'Golf Course', icon: Trophy, description: '18-hole championship course designed by a legendary architect.' },
    { name: 'Private Beach', icon: Sailboat, description: 'Exclusive beachfront with cabanas, water sports, and sunset cruises.' },
    { name: 'Tennis Court', icon: Dumbbell, description: 'Two professional-grade courts with available coaching sessions.' },
    { name: 'Art Gallery', icon: Palette, description: 'Rotating exhibitions featuring contemporary and classical works.' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Room Card (flip)                                                   */
/* ------------------------------------------------------------------ */
function RoomCard({ room, index }: { room: (typeof rooms)[0]; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        delay: 0.15 + index * 0.12,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="perspective-1000 group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      data-cursor="pointer"
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full h-[420px] sm:h-[460px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl border border-white/[0.06] overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Image placeholder gradient */}
          <div className={`h-56 bg-gradient-to-br ${room.gradient} relative overflow-hidden`}>
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }} />
            {/* Decorative glow */}
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br ${room.accentGradient} rounded-full blur-3xl`} />
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/[0.08] text-xs text-amber-400/90 font-medium">
              <Star className="w-3 h-3 inline mr-1 -mt-0.5" />
              Featured
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-medium text-white/90 tracking-tight">{room.name}</h3>
            <p className="text-sm text-white/30 mt-2 leading-relaxed">{room.description}</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-2xl font-light text-amber-400">{room.price}</span>
              <span className="text-xs text-white/25">{room.period}</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/20 group-hover:text-amber-400/60 transition-colors duration-500">
              <span>View amenities</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-500" />
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border border-amber-400/10 overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="h-full bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white/90 tracking-tight">{room.name}</h3>
              <span className="text-xs text-amber-400/70 tracking-wider uppercase">Amenities</span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3 content-start">
              {room.amenities.map((amenity) => {
                const Icon = amenity.icon;
                return (
                  <div
                    key={amenity.label}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:border-amber-400/10 transition-colors duration-300"
                  >
                    <Icon className="w-4 h-4 text-amber-400/60 mt-0.5 shrink-0" />
                    <span className="text-sm text-white/60 leading-snug">{amenity.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function HotelDemo() {
  const [activeTab, setActiveTab] = useState<AmenityTab>('wellness');

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen"
    >
      {/* ============================================================ */}
      {/*  HERO                                                        */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden py-32 md:py-44 px-6 md:px-12">
        {/* Background atmospheric layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-400/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

        <div className="max-w-7xl mx-auto relative text-center">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 text-[11px] tracking-[0.35em] uppercase text-amber-400/80 border border-amber-400/15 rounded-full bg-amber-400/[0.04]">
              <Sparkles className="w-3.5 h-3.5" />
              Luxury Redefined
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight leading-[1.05]"
          >
            <span className="text-white/90">The Grand</span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Aurelian
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-base md:text-lg text-white/30 max-w-xl mx-auto leading-relaxed"
          >
            Where timeless elegance meets modern luxury. Experience unparalleled
            hospitality in the heart of the city.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12"
          >
            <button
              data-cursor="pointer"
              onClick={() => document.getElementById('rooms-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative inline-flex items-center gap-3 bg-amber-400 text-[#0a0a0a] font-medium px-8 py-3.5 rounded-lg text-sm hover:bg-amber-300 transition-all duration-300 shadow-lg shadow-amber-400/10"
            >
              Discover Rooms
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-20 flex items-center justify-center gap-4"
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/10" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/10" />
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  ROOMS & SUITES                                               */}
      {/* ============================================================ */}
      <section id="rooms-section" className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] tracking-[0.35em] uppercase text-amber-400/50 mb-4">
                Accommodations
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white/90 tracking-tight">
                Our Rooms & Suites
              </h2>
              <p className="mt-4 text-sm text-white/25 max-w-lg mx-auto">
                Each room is a sanctuary of design and comfort. Hover to explore the amenities.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.map((room, i) => (
              <RoomCard key={room.name} room={room} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  AMENITIES                                                   */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] tracking-[0.35em] uppercase text-amber-400/50 mb-4">
                Experience
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white/90 tracking-tight">
                World-Class Amenities
              </h2>
              <p className="mt-4 text-sm text-white/25 max-w-lg mx-auto">
                From rejuvenation to recreation, every moment at The Grand Aurelian is crafted to perfection.
              </p>
            </div>
          </ScrollReveal>

          {/* Custom Tabs */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {amenityTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    data-cursor="pointer"
                    className={`
                      relative flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium
                      transition-all duration-300 border
                      ${
                        isActive
                          ? 'text-amber-400 border-amber-400/20 bg-amber-400/[0.06] shadow-sm shadow-amber-400/5'
                          : 'text-white/40 border-white/[0.06] bg-white/[0.02] hover:text-white/60 hover:border-white/[0.1] hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="amenity-tab-indicator"
                        className="absolute inset-0 rounded-full border border-amber-400/20 pointer-events-none"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {amenityData[activeTab].map((amenity, i) => {
                const Icon = amenity.icon;
                return (
                  <motion.div
                    key={amenity.name}
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.05 + i * 0.08,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="group p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:border-amber-400/15 hover:bg-white/[0.04] transition-all duration-500"
                  >
                    <div className="w-11 h-11 rounded-xl bg-amber-400/[0.06] border border-amber-400/10 flex items-center justify-center mb-4 group-hover:bg-amber-400/10 transition-colors duration-500">
                      <Icon className="w-5 h-5 text-amber-400/60 group-hover:text-amber-400 transition-colors duration-500" />
                    </div>
                    <h4 className="text-base font-medium text-white/80 tracking-tight">
                      {amenity.name}
                    </h4>
                    <p className="text-sm text-white/25 mt-2 leading-relaxed">
                      {amenity.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  BOOKING                                                     */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm overflow-hidden">
              {/* Decorative top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-amber-400/[0.04] rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

              <div className="relative p-8 md:p-12 lg:p-16">
                <div className="text-center mb-12">
                  <span className="inline-block text-[11px] tracking-[0.35em] uppercase text-amber-400/50 mb-4">
                    Reservations
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white/90 tracking-tight">
                    Begin Your Stay
                  </h2>
                  <p className="mt-4 text-sm text-white/25 max-w-md mx-auto">
                    Select your dates and preferences to check availability.
                  </p>
                </div>

                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="max-w-4xl mx-auto"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Check-in */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/30 tracking-wider uppercase flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-amber-400/50" />
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white focus:border-amber-400/30 focus:outline-none transition-colors text-sm [color-scheme:dark]"
                      />
                    </div>

                    {/* Check-out */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/30 tracking-wider uppercase flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-amber-400/50" />
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white focus:border-amber-400/30 focus:outline-none transition-colors text-sm [color-scheme:dark]"
                      />
                    </div>

                    {/* Guests */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/30 tracking-wider uppercase flex items-center gap-2">
                        <UserRound className="w-3.5 h-3.5 text-amber-400/50" />
                        Guests
                      </label>
                      <div className="relative">
                        <select
                          defaultValue="2"
                          className="w-full appearance-none bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white focus:border-amber-400/30 focus:outline-none transition-colors text-sm pr-10 [color-scheme:dark]"
                        >
                          {Array.from({ length: 10 }, (_, i) => (
                            <option key={i + 1} value={i + 1} className="bg-neutral-900 text-white">
                              {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                      </div>
                    </div>

                    {/* Room Type */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-white/30 tracking-wider uppercase flex items-center gap-2">
                        <Bed className="w-3.5 h-3.5 text-amber-400/50" />
                        Room Type
                      </label>
                      <div className="relative">
                        <select
                          defaultValue="deluxe"
                          className="w-full appearance-none bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white focus:border-amber-400/30 focus:outline-none transition-colors text-sm pr-10 [color-scheme:dark]"
                        >
                          <option value="deluxe" className="bg-neutral-900 text-white">Deluxe Room</option>
                          <option value="executive" className="bg-neutral-900 text-white">Executive Suite</option>
                          <option value="presidential" className="bg-neutral-900 text-white">Presidential Suite</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="mt-8 text-center">
                    <button
                      type="submit"
                      data-cursor="pointer"
                      className="group inline-flex items-center gap-3 bg-amber-400 text-[#0a0a0a] font-medium px-8 py-3 rounded-lg text-sm hover:bg-amber-300 transition-all duration-300 shadow-lg shadow-amber-400/10 hover:shadow-amber-400/20"
                    >
                      Check Availability
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bottom decorative line */}
      <div className="flex items-center justify-center gap-4 pb-12">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/10" />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400/30" />
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/10" />
      </div>
    </motion.div>
  );
}