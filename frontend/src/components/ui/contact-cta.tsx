'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Send, CheckCircle, Loader2 } from 'lucide-react';
import ScrollReveal from '@/components/effects/ScrollReveal';

export default function ContactCTA() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <ScrollReveal>
      <section className="relative py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-block text-xs tracking-[0.3em] uppercase text-rose/60">
              Get in Touch
            </span>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Interested in a site like this?
            </h2>

            <p className="text-white/40 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              DM me on Instagram or leave your email below and I&apos;ll reach out.
            </p>

            <a
              href="https://instagram.com/work_1n_progr3ss"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-rose/30 text-white/80 hover:text-rose transition-all group"
              data-cursor="pointer"
            >
              <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">@work_1n_progr3ss</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-xs tracking-[0.2em] uppercase text-white/20">or</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-3 py-6"
              >
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-green-400/80 text-sm">
                  Thanks! I&apos;ll get back to you soon.
                </span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 placeholder:text-white/20 text-sm outline-none focus:border-rose/40 focus:bg-white/[0.07] transition-all"
                />
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 placeholder:text-white/20 text-sm outline-none focus:border-rose/40 focus:bg-white/[0.07] transition-all"
                />
                <textarea
                  placeholder="Tell me about your project..."
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 placeholder:text-white/20 text-sm outline-none focus:border-rose/40 focus:bg-white/[0.07] transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-rose/80 hover:bg-rose text-white text-sm font-medium transition-all disabled:opacity-50"
                  data-cursor="pointer"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send Message
                </button>
                {status === 'error' && (
                  <p className="text-red-400/70 text-xs text-center">
                    Something went wrong. Try again or DM me on Instagram.
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </ScrollReveal>
  );
}
