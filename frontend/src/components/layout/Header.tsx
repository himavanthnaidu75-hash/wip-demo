'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store/useStore';

export default function Header() {
  const currentView = useAppStore((s) => s.currentView);
  const goHome = useAppStore((s) => s.goHome);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5 flex items-center justify-between"
    >
      <button
        onClick={goHome}
        className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        data-cursor="pointer"
      >
        {currentView !== 'home' && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </motion.div>
        )}
        <span className="text-lg tracking-tight font-medium">
          <span className="text-rose">W.I.P</span> Studio
        </span>
      </button>

      <div className="flex items-center gap-6">
        <span className="hidden md:block text-xs tracking-[0.2em] uppercase text-white/30">
          Interactive Demo Studio
        </span>
        <div className="w-2 h-2 rounded-full bg-rose/60 animate-pulse" />
      </div>
    </motion.header>
  );
}