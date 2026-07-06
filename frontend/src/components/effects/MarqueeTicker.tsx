'use client';

const SERVICES = [
  'Web Design',
  'Development',
  'Branding',
  'UI/UX',
  'SEO',
  '3D Experiences',
  'Motion Graphics',
  'Consulting',
];

export default function MarqueeTicker() {
  const doubled = [...SERVICES, ...SERVICES];

  return (
    <div className="relative overflow-hidden py-6 border-t border-b border-white/5">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-8 text-sm tracking-[0.3em] uppercase text-white/30 font-light"
          >
            {item}
            <span className="ml-8 text-rose/40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}