'use client';

import { motion } from 'framer-motion';
import ScrollReveal from '@/components/effects/ScrollReveal';
import TiltCard from '@/components/effects/TiltCard';

/* ────────────────────────── Animation Variants ────────────────────────── */

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const menuCardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.15 * i,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const galleryItemVariants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.1 * i,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

/* ────────────────────────── Data ────────────────────────── */

const MENU_ITEMS = [
  {
    name: 'Truffle Risotto',
    description: 'Arborio rice, black truffle shavings, aged parmesan, finished with truffle oil.',
    price: '$38',
  },
  {
    name: 'Wagyu Tartare',
    description: 'Hand-cut A5 wagyu, quail egg, capers, cornichons, brioche croûtons.',
    price: '$45',
  },
  {
    name: 'Lobster Thermidor',
    description: 'Whole Maine lobster, cognac cream, gruyère gratin, roasted fingerling potatoes.',
    price: '$58',
  },
  {
    name: 'Duck Confit',
    description: 'Slow-cooked Moulard duck leg, cherry gastrique, wilted greens, duck fat potatoes.',
    price: '$42',
  },
  {
    name: 'Seared Scallops',
    description: 'Diver scallops, cauliflower purée, brown butter, toasted hazelnuts, micro herbs.',
    price: '$52',
  },
  {
    name: 'Chocolate Soufflé',
    description: 'Valrhona dark chocolate, crème anglaise, cocoa dust, seasonal berry compote.',
    price: '$18',
  },
];

const GALLERY_GRADIENTS = [
  'from-rose/10 via-stone-900/40 to-stone-950/80',
  'from-amber-900/20 via-stone-900/50 to-rose/5',
  'from-stone-800/30 via-rose/8 to-stone-950/70',
  'from-rose/15 via-stone-900/30 to-stone-950/90',
  'from-stone-800/20 via-amber-900/10 to-rose/10',
  'from-rose/5 via-stone-900/60 to-stone-950/80',
];

/* ────────────────────────── Component ────────────────────────── */

export default function RestaurantDemo() {
  const scrollToMenu = () => {
    document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen flex flex-col"
    >
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Cinematic gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0808] to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,194,209,0.06)_0%,transparent_70%)]" />

        <div className="relative z-10 flex flex-col items-center max-w-4xl">
          {/* Label */}
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block px-5 py-2 text-[11px] tracking-[0.35em] uppercase text-rose/70 border border-rose/20 rounded-full bg-rose/5 mb-8"
          >
            Fine Dining Experience
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.05]"
          >
            <span className="block text-white/90">La Maison</span>
            <span className="block text-rose mt-1">Dorée</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-base md:text-lg text-white/40 max-w-2xl leading-relaxed"
          >
            A celebration of culinary excellence where timeless French technique
            meets bold modern artistry — every plate, a masterpiece.
          </motion.p>

          {/* Scroll indicator */}
          <motion.button
            onClick={scrollToMenu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 flex flex-col items-center gap-3 group cursor-pointer"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/20 group-hover:text-rose/50 transition-colors duration-500">
              View Menu
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-px h-12 bg-gradient-to-b from-rose/40 to-transparent"
            />
          </motion.button>
        </div>

        {/* Decorative side lines */}
        <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent hidden md:block" />
        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 w-px h-32 bg-gradient-to-b from-transparent via-white/[0.06] to-transparent hidden md:block" />
      </section>

      {/* ═══════════════════ OUR STORY ═══════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left — Text */}
          <ScrollReveal direction="left">
            <div>
              <span className="block text-[120px] md:text-[140px] font-extralight leading-none text-rose/20 select-none -mb-6">
                01
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white/90">
                Our Story
              </h2>
              <div className="w-12 h-px bg-rose/30 mt-6 mb-6" />
              <p className="text-sm md:text-base text-white/40 leading-relaxed max-w-md">
                Nestled in the heart of the city for over three decades, La Maison
                Dorée has been a sanctuary for those who seek the extraordinary.
                Our philosophy is rooted in heritage French cuisine — reimagined
                through seasonal, locally-sourced ingredients and the relentless
                pursuit of perfection. Every detail, from the hand-selected
                tableware to the curated wine cellar, reflects an unwavering
                commitment to the art of dining.
              </p>
              <p className="text-sm text-white/25 leading-relaxed max-w-md mt-4">
                Chef Laurent Moreau brings twenty years of Michelin-starred
                experience to every dish, crafting menus that honour tradition
                while embracing innovation.
              </p>
            </div>
          </ScrollReveal>

          {/* Right — Image placeholder */}
          <ScrollReveal direction="right" delay={0.15}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-800/40 via-stone-900/60 to-[#0a0a0a]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(251,194,209,0.08)_0%,transparent_60%)]" />
              {/* Decorative inner border */}
              <div className="absolute inset-3 border border-white/[0.04] rounded-xl" />
              {/* Center icon placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full border border-rose/15 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-rose/30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-white/15">
                    Est. 1987
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════ SIGNATURE DISHES ═══════════════════ */}
      <section id="menu-section" className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Section heading */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="block text-[10px] tracking-[0.35em] uppercase text-rose/50 mb-4">
                Curated Selection
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white/90">
                Signature Dishes
              </h2>
              <div className="w-8 h-px bg-rose/30 mx-auto mt-6" />
            </div>
          </ScrollReveal>

          {/* Menu grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MENU_ITEMS.map((item, i) => (
              <motion.div
                key={item.name}
                custom={i}
                variants={menuCardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
              >
                <TiltCard intensity={5}>
                  <div className="relative group rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 md:p-7 transition-colors duration-500 hover:border-rose/20 hover:bg-white/[0.04] h-full flex flex-col">
                    {/* Subtle top accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-rose/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-lg font-medium tracking-tight text-white/90 group-hover:text-white transition-colors duration-300">
                        {item.name}
                      </h3>
                      <span className="text-lg font-light text-rose/70 whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>

                    <p className="text-sm text-white/30 leading-relaxed flex-1">
                      {item.description}
                    </p>

                    <div className="mt-5 pt-4 border-t border-white/[0.04] group-hover:border-rose/10 transition-colors duration-500">
                      <span className="text-[10px] tracking-[0.25em] uppercase text-white/15 group-hover:text-rose/40 transition-colors duration-500">
                        Tasting Menu Available
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ RESERVATION ═══════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="block text-[10px] tracking-[0.35em] uppercase text-rose/50 mb-4">
                  Join Us
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white/90">
                  Reserve a Table
                </h2>
                <p className="mt-4 text-sm text-white/30 leading-relaxed max-w-md mx-auto">
                  We recommend booking at least 48 hours in advance. For
                  parties of 8 or more, please contact us directly.
                </p>
                <div className="w-8 h-px bg-rose/30 mx-auto mt-6" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="space-y-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-6 md:p-8"
              >
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-rose/30 focus:outline-none transition-colors w-full"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-rose/30 focus:outline-none transition-colors w-full"
                  />
                </div>

                {/* Phone & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-rose/30 focus:outline-none transition-colors w-full"
                  />
                  <input
                    type="date"
                    className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white/50 focus:border-rose/30 focus:outline-none transition-colors w-full [color-scheme:dark]"
                  />
                </div>

                {/* Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white/50 focus:border-rose/30 focus:outline-none transition-colors w-full appearance-none"
                  >
                    <option value="" disabled selected>
                      Number of Guests
                    </option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n} className="bg-[#111]">
                        {n} {n === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                    <option value="9+" className="bg-[#111]">
                      9+ (Contact us)
                    </option>
                  </select>

                  <select
                    className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white/50 focus:border-rose/30 focus:outline-none transition-colors w-full appearance-none"
                  >
                    <option value="" disabled selected>
                      Preferred Time
                    </option>
                    {[
                      '6:00 PM',
                      '6:30 PM',
                      '7:00 PM',
                      '7:30 PM',
                      '8:00 PM',
                      '8:30 PM',
                      '9:00 PM',
                      '9:30 PM',
                    ].map((time) => (
                      <option key={time} value={time} className="bg-[#111]">
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Special Requests */}
                <textarea
                  placeholder="Special Requests"
                  rows={3}
                  className="bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-rose/30 focus:outline-none transition-colors w-full resize-none"
                />

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-rose text-[#0a0a0a] font-medium px-8 py-3 rounded-lg hover:bg-rose/90 transition-colors cursor-pointer"
                  >
                    Reserve Table
                  </button>
                </div>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════ GALLERY ═══════════════════ */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="block text-[10px] tracking-[0.35em] uppercase text-rose/50 mb-4">
                Visual Journey
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white/90">
                Moments
              </h2>
              <div className="w-8 h-px bg-rose/30 mx-auto mt-6" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {GALLERY_GRADIENTS.map((gradient, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={galleryItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                whileHover={{ scale: 1.03, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                className={`relative aspect-[4/5] md:aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden cursor-pointer ${
                  i === 1 ? 'md:row-span-2 md:aspect-auto' : ''
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
                />
                <div className="absolute inset-0 border border-white/[0.04] rounded-xl md:rounded-2xl" />

                {/* Inner glow on hover */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,194,209,0.04)_0%,transparent_70%)] opacity-0 hover:opacity-100 transition-opacity duration-500" />

                {/* Subtle number watermark */}
                <span className="absolute bottom-3 right-4 text-[10px] tracking-[0.2em] text-white/[0.08] font-mono">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="mt-auto py-12 px-6 md:px-12 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-white/90 font-light tracking-wide">
              La Maison Dorée
            </p>
            <p className="text-xs text-white/20 mt-1">
              42 Rue de la Gastronomie, Paris
            </p>
          </div>

          <div className="flex items-center gap-8">
            {['Reservations', 'Menu', 'Cellar', 'Events'].map((link) => (
              <button
                key={link}
                className="text-[11px] tracking-[0.2em] uppercase text-white/25 hover:text-rose/60 transition-colors duration-300 cursor-pointer"
              >
                {link}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-white/15 tracking-wider">
            © 2025 La Maison Dorée. All rights reserved.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}