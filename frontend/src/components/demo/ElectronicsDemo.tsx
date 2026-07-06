'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Camera, Battery, Wifi, Headphones } from 'lucide-react';
import ScrollReveal from '@/components/effects/ScrollReveal';
import TiltCard from '@/components/effects/TiltCard';

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

const features = [
  {
    icon: Zap,
    title: 'A17 Pro Chip',
    description:
      'Built on a breakthrough 3-nanometer process, the A17 Pro chip delivers console-level gaming and unprecedented efficiency.',
  },
  {
    icon: Shield,
    title: 'Titanium Design',
    description:
      'Aerospace-grade titanium provides exceptional strength while being remarkably lightweight at just 187 grams.',
  },
  {
    icon: Camera,
    title: 'Pro Camera System',
    description:
      '48MP main sensor with quad-pixel technology captures stunning detail in any lighting condition.',
  },
  {
    icon: Battery,
    title: 'All-Day Battery',
    description:
      'Up to 29 hours of video playback. Power through your entire day without reaching for a charger.',
  },
  {
    icon: Wifi,
    title: '5G Ultra',
    description:
      'Blazing-fast 5G connectivity with sub-6GHz and mmWave support for seamless streaming and downloads.',
  },
  {
    icon: Headphones,
    title: 'Spatial Audio',
    description:
      'Immersive, studio-quality sound with personalized spatial audio that adapts to your unique ear shape.',
  },
];

const specs = [
  { label: 'Display', value: '6.7" Super Retina XDR' },
  { label: 'Processor', value: 'A17 Pro (3nm)' },
  { label: 'RAM', value: '8GB' },
  { label: 'Storage', value: '256GB / 512GB / 1TB' },
  {
    label: 'Camera',
    value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
  },
  { label: 'Battery', value: 'Up to 29 hours video playback' },
];

const colorOptions = [
  { name: 'Titanium Black', color: '#2a2a2e' },
  { name: 'Titanium White', color: '#e8e4df' },
  { name: 'Titanium Blue', color: '#3a4a6b' },
] as const;

const storageOptions = ['256GB', '512GB', '1TB'] as const;

export default function ElectronicsDemo() {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState(1);

  return (
    <motion.div
      className="z-10 relative"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* ── Hero Section ── */}
      <section className="relative py-28 md:py-40 px-6 md:px-12 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#050a14]/90 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/[0.07] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-cyan-400/[0.04] rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto text-center">
          <ScrollReveal delay={0.1}>
            <span className="inline-block text-[11px] md:text-xs font-medium tracking-[0.25em] uppercase text-cyan-400/90 mb-6 px-4 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] backdrop-blur-sm">
              Next-Gen Technology
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95]">
              Nexus <span className="text-cyan-400">Pro</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.35}>
            <p className="mt-6 md:mt-8 text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              Pushing the boundaries of what a smartphone can be. Crafted with
              titanium, powered by intelligence, designed for the future.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.5}>
            <motion.button
              className="mt-10 inline-flex items-center gap-2 bg-cyan-400 text-[#0a0a0a] font-medium px-8 py-3 rounded-lg text-sm transition-colors hover:bg-cyan-300"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore Features
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="mt-0.5"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14 md:mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Why Nexus Pro
              </h2>
              <p className="mt-4 text-white/40 text-sm md:text-base max-w-lg mx-auto">
                Every detail has been meticulously engineered to deliver an
                experience that feels like magic.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <ScrollReveal key={feature.title} delay={i * 0.08}>
                  <TiltCard intensity={6}>
                    <motion.div
                      className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-6 h-full cursor-default"
                      whileHover={{
                        scale: 1.02,
                        borderColor: 'rgba(34, 211, 238, 0.2)',
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-cyan-400/10 flex items-center justify-center mb-5">
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <h3 className="text-white font-semibold text-base mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/40 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Specs Section ── */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight text-center mb-14 md:mb-20">
              Technical Specifications
            </h2>
          </ScrollReveal>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 md:p-8">
            {specs.map((spec, i) => (
              <ScrollReveal key={spec.label} delay={i * 0.06}>
                <div className="flex justify-between items-baseline gap-4">
                  <span className="text-white/40 text-sm font-medium shrink-0">
                    {spec.label}
                  </span>
                  <span className="text-white/80 text-sm md:text-base text-right">
                    {spec.value}
                  </span>
                </div>
                {i < specs.length - 1 && (
                  <div className="border-t border-white/[0.06] my-4 md:my-5" />
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Showcase ── */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-10">
              {/* Product image placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0d1525] to-[#080c16]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

              {/* Subtle cyan glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] bg-cyan-400/[0.08] rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[30%] bg-cyan-500/[0.06] rounded-full blur-[60px]" />

              {/* Product silhouette hint */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 md:w-40 h-60 md:h-72 rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent shadow-[0_0_80px_rgba(34,211,238,0.08)] flex items-center justify-center">
                  <div className="w-16 h-1 rounded-full bg-white/[0.06]" />
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-8 h-[1px] bg-gradient-to-r from-cyan-400/40 to-transparent" />
              <div className="absolute top-4 left-4 w-[1px] h-8 bg-gradient-to-b from-cyan-400/40 to-transparent" />
              <div className="absolute bottom-4 right-4 w-8 h-[1px] bg-gradient-to-l from-cyan-400/40 to-transparent" />
              <div className="absolute bottom-4 right-4 w-[1px] h-8 bg-gradient-to-t from-cyan-400/40 to-transparent" />
            </div>
          </ScrollReveal>

          {/* Pricing Tiers */}
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                { name: 'Starter', storage: '256GB', price: '$299', desc: 'Essential performance' },
                { name: 'Growth', storage: '512GB', price: '$499', desc: 'Pro-grade power' },
                { name: 'Premium', storage: '1TB', price: '$999', desc: 'Unlimited everything' },
              ].map((tier) => (
                <motion.div
                  key={tier.name}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`relative p-6 rounded-2xl border cursor-pointer transition-all ${
                    selectedStorage === tier.storage
                      ? 'border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedStorage(tier.storage)}
                >
                  <p className="text-xs uppercase tracking-widest text-amber-400/80 mb-1 font-medium">{tier.name}</p>
                  <p className="text-3xl md:text-4xl font-bold text-white">{tier.price}</p>
                  <p className="text-white/40 text-sm mt-1">{tier.storage} · {tier.desc}</p>
                  {selectedStorage === tier.storage && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Color Options */}
          <ScrollReveal delay={0.15}>
            <div className="flex flex-col items-center gap-4 mb-8">
              <span className="text-white/40 text-xs font-medium tracking-wider uppercase">
                Color — {colorOptions[selectedColor].name}
              </span>
              <div className="flex gap-3">
                {colorOptions.map((option, i) => (
                  <motion.button
                    key={option.name}
                    className={`relative w-8 h-8 rounded-full transition-all ${
                      i === selectedColor ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0a0a0a]' : ''
                    }`}
                    style={{ backgroundColor: option.color }}
                    onClick={() => setSelectedColor(i)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={option.name}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Storage Options */}
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col items-center gap-4 mb-12">
              <span className="text-white/40 text-xs font-medium tracking-wider uppercase">
                Storage
              </span>
              <div className="flex gap-3">
                {storageOptions.map((size) => (
                  <motion.button
                    key={size}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                      storageOptions[selectedStorage] === size
                        ? 'bg-cyan-400 text-[#0a0a0a]'
                        : 'bg-white/[0.04] text-white/50 border border-white/[0.08] hover:border-white/20 hover:text-white/70'
                    }`}
                    onClick={() =>
                      setSelectedStorage(storageOptions.indexOf(size))
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal delay={0.25}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                className="w-full sm:w-auto bg-cyan-400 text-[#0a0a0a] font-medium px-8 py-3 rounded-lg text-sm transition-colors hover:bg-cyan-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Add to Cart
              </motion.button>
              <motion.button
                className="w-full sm:w-auto border border-cyan-400/30 text-cyan-400 px-8 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-cyan-400/[0.08]"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Buy Now
              </motion.button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </motion.div>
  );
}