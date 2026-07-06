'use client';

import { useEffect, useRef } from 'react';

interface CharRevealProps {
  text: string;
  className?: string;
  baseDelay?: number;
  stagger?: number;
}

export default function CharReveal({
  text,
  className = '',
  baseDelay = 0,
  stagger = 0.03,
}: CharRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || !containerRef.current) return;
    hasAnimated.current = true;
    const chars = containerRef.current.querySelectorAll('.char-animate');
    chars.forEach((char, i) => {
      (char as HTMLElement).style.animationDelay = `${baseDelay + i * stagger}s`;
    });
  }, [baseDelay, stagger]);

  return (
    <span ref={containerRef} className={className}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="char-animate"
          style={{ animationDelay: `${baseDelay + i * stagger}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}