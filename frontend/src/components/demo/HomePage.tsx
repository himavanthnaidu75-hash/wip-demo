'use client';

import { motion } from 'framer-motion';
import { UtensilsCrossed, Cpu, Building2, LayoutTemplate, ArrowRight } from 'lucide-react';
import { useAppStore, DEMO_CATEGORIES, type DemoSlug } from '@/store/useStore';
import CharReveal from '@/components/effects/CharReveal';
import ScrollReveal from '@/components/effects/ScrollReveal';
import TiltCard from '@/components/effects/TiltCard';
import MarqueeTicker from '@/components/effects/MarqueeTicker';
import ContactCTA from '@/components/ui/contact-cta';

const ICON_MAP: Record<string, React.ElementType> = {
  UtensilsCrossed,
  Cpu,
  Building2,
  LayoutTemplate,
};

const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.95 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function HomePage() {
  const navigateTo = useAppStore((s) => s.navigateTo);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen flex flex-col"
    >
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 text-xs tracking-[0.3em] uppercase text-rose/80 border border-rose/20 rounded-full bg-rose/5">
            Cinematic Demo Studio
          </span>
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] max-w-5xl">
          <CharReveal
            text="Your vision,"
            className="block text-white/90"
            baseDelay={0.2}
            stagger={0.03}
          />
          <CharReveal
            text="our craft."
            className="block text-rose mt-1"
            baseDelay={0.6}
            stagger={0.03}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-base md:text-lg text-white/40 max-w-2xl leading-relaxed"
        >
          Explore our high-end interactive demos across multiple industries.
          Click any category to experience a cinematic, fully-designed showcase.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-12 animate-bounce"
        >
          <div className="w-px h-12 bg-gradient-to-b from-rose/40 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* Category Grid */}
      <section className="px-6 md:px-12 pb-16 max-w-7xl mx-auto w-full">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-10">
            <div className="glow-line flex-1" />
            <h2 className="text-xs tracking-[0.3em] uppercase text-white/30 whitespace-nowrap">
              Choose Your Experience
            </h2>
            <div className="glow-line flex-1" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {DEMO_CATEGORIES.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon];
            return (
              <motion.div
                key={cat.slug}
                custom={i}
                variants={cardVariants}
                initial="initial"
                animate="animate"
              >
                <TiltCard intensity={8}>
                  <button
                    onClick={() => navigateTo(cat.slug as DemoSlug)}
                    data-cursor="pointer"
                    className="group relative w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 text-left transition-all duration-500 hover:border-rose/20 hover:bg-white/[0.04]"
                  >
                    {/* Gradient bg */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-5 group-hover:border-rose/20 transition-colors duration-500">
                        {Icon && <Icon className="w-5 h-5 text-white/50 group-hover:text-rose transition-colors duration-500" />}
                      </div>

                      <h3 className="text-xl font-medium tracking-tight text-white/90 group-hover:text-white transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs tracking-[0.15em] uppercase text-rose/60 mt-1">
                        {cat.subtitle}
                      </p>
                      <p className="text-sm text-white/30 mt-3 leading-relaxed">
                        {cat.description}
                      </p>

                      <div className="mt-5 flex items-center gap-2 text-xs text-white/20 group-hover:text-rose/70 transition-colors duration-500">
                        <span>Explore demo</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-500" />
                      </div>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-rose/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </button>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <ContactCTA />

      {/* Marquee */}
      <div className="mt-auto">
        <MarqueeTicker />
      </div>
    </motion.div>
  );
}