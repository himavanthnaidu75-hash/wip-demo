'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Palette, TrendingUp } from 'lucide-react';
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

const services = [
  {
    number: '01',
    title: 'Strategy & Planning',
    description:
      'We map out a clear roadmap aligned with your business goals, audience, and market position to maximize impact from day one.',
    icon: Rocket,
  },
  {
    number: '02',
    title: 'Design & Development',
    description:
      'Pixel-perfect interfaces crafted with cutting-edge technology, delivering experiences that feel effortless and look stunning.',
    icon: Palette,
  },
  {
    number: '03',
    title: 'Launch & Growth',
    description:
      'From deployment to ongoing optimization, we ensure your product scales beautifully and keeps growing with your audience.',
    icon: TrendingUp,
  },
];

const stats = [
  { value: '150+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '12+', label: 'Years Experience' },
  { value: '24/7', label: 'Support Available' },
];

export default function GenericDemo() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative z-10 min-h-screen"
    >
      {/* ─── Hero Section ─── */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block px-4 py-1.5 text-xs tracking-[0.3em] uppercase text-purple-400/80 border border-purple-400/20 rounded-full bg-purple-400/5 mb-8"
          >
            Your Brand Here
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] max-w-4xl"
          >
            <span className="text-white/90">Custom </span>
            <span className="text-purple-400">Template</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-base md:text-lg text-white/40 max-w-2xl leading-relaxed"
          >
            A versatile starting point for any business. Replace this content with
            your own branding, images, and copy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <button
              data-cursor="pointer"
              className="group inline-flex items-center justify-center gap-2 bg-purple-400 text-[#0a0a0a] font-medium text-sm px-7 py-3 rounded-lg transition-all duration-300 hover:bg-purple-300 hover:shadow-lg hover:shadow-purple-400/20"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
            <button
              data-cursor="pointer"
              className="inline-flex items-center justify-center gap-2 border border-white/10 text-white/70 font-medium text-sm px-7 py-3 rounded-lg transition-all duration-300 hover:border-purple-400/30 hover:text-white"
            >
              Learn More
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-16 animate-bounce"
          >
            <div className="w-px h-12 bg-gradient-to-b from-purple-400/40 to-transparent mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* ─── Services Section ─── */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-14">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
              <h2 className="text-xs tracking-[0.3em] uppercase text-white/30 whitespace-nowrap">
                What We Offer
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <ScrollReveal key={service.number} delay={i * 0.12}>
                  <TiltCard intensity={6}>
                    <div className="group relative h-full rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm p-8 transition-all duration-500 hover:border-purple-400/15 hover:bg-white/[0.04]">
                      {/* Gradient accent on hover */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <div className="relative z-10">
                        {/* Number */}
                        <span className="block text-5xl font-extralight tracking-tight text-white/[0.07] group-hover:text-purple-400/15 transition-colors duration-500">
                          {service.number}
                        </span>

                        {/* Icon */}
                        <div className="mt-5 w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:border-purple-400/20 transition-colors duration-500">
                          <Icon className="w-4 h-4 text-white/30 group-hover:text-purple-400 transition-colors duration-500" />
                        </div>

                        {/* Title */}
                        <h3 className="mt-5 text-lg font-medium tracking-tight text-white/85 group-hover:text-white transition-colors duration-500">
                          {service.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-3 text-sm text-white/30 leading-relaxed group-hover:text-white/40 transition-colors duration-500">
                          {service.description}
                        </p>

                        {/* Decorative line */}
                        <div className="mt-6 h-px w-12 bg-gradient-to-r from-purple-400/30 to-transparent opacity-0 group-hover:w-16 group-hover:opacity-100 transition-all duration-700" />
                      </div>
                    </div>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Stats Section ─── */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                {stats.map((stat, i) => (
                  <ScrollReveal key={stat.label} delay={i * 0.1}>
                    <div className="text-center md:text-left">
                      <span className="block text-3xl md:text-4xl font-light tracking-tight text-white/90">
                        {stat.value}
                      </span>
                      <span className="block mt-2 text-xs tracking-[0.12em] uppercase text-white/25">
                        {stat.label}
                      </span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="relative rounded-2xl border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm px-8 py-14 md:py-20 text-center overflow-hidden">
              {/* Subtle radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.04)_0%,transparent_70%)] pointer-events-none" />

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-white/90 max-w-2xl mx-auto">
                  Ready to start your project?
                </h2>
                <p className="mt-4 text-base text-white/35 max-w-lg mx-auto leading-relaxed">
                  Let&apos;s build something extraordinary together.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full sm:flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder:text-white/20 focus:border-purple-400/30 focus:outline-none transition-colors duration-300 text-sm"
                  />
                  <button
                    data-cursor="pointer"
                    className="w-full sm:w-auto bg-purple-400 text-[#0a0a0a] font-medium px-6 py-3 rounded-lg text-sm transition-all duration-300 hover:bg-purple-300 hover:shadow-lg hover:shadow-purple-400/20 whitespace-nowrap"
                  >
                     Get in Touch
                   </button>
                 </div>
                 <p className="mt-4 text-xs text-white/20">
                   Or DM me on{' '}
                   <a
                     href="https://instagram.com/work_1n_prgr3ss"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-purple-400/60 hover:text-purple-400 transition-colors"
                   >
                     Instagram @work_1n_prgr3ss
                   </a>
                 </p>
               </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </motion.div>
  );
}