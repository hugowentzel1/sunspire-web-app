'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
      animate={prefersReduced ? {} : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({ children }: { children: ReactNode }) {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ duration: 0.18 }}>
      {children}
    </motion.div>
  );
}
