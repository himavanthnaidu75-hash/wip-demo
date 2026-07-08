'use client';

import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 px-6 md:px-12 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white/30 text-sm">
          <span className="text-rose/60 font-medium">W.I.P Studio</span>
          <span>·</span>
          <span>Cinematic Demo Studio</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-white/20">
          <a
            href="https://instagram.com/work_1n_progr3ss"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/20 hover:text-rose transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            @work_1n_progr3ss
          </a>
          <span className="text-rose/30">✦</span>
          <span>Built with Next.js, Three.js & Framer Motion</span>
          <span className="text-rose/30">✦</span>
          <span>© 2025</span>
        </div>
      </div>
    </footer>
  );
}
