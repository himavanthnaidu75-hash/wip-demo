'use client';

import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

export default function InstagramBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1.5 }}
      className="fixed bottom-6 right-6 z-[60]"
    >
      <a
        href="https://instagram.com/work_1n_prgr3ss"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:border-rose/30 hover:bg-rose/10 transition-all shadow-lg shadow-black/20"
        data-cursor="pointer"
      >
        <Instagram className="w-4 h-4 text-white/60 group-hover:text-rose transition-colors" />
        <span className="text-xs font-medium text-white/50 group-hover:text-rose/80 transition-colors">
          @work_1n_prgr3ss
        </span>
      </a>
    </motion.div>
  );
}
