'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

export function FadeIn({ children, delay = 0, duration = 0.6 }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}

export function Rise({ children, delay = 0, duration = 0.6 }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({ children }: { children: ReactNode }) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      style={{
        boxShadow: "0 4px 20px rgba(15,23,42,0.08)"
      }}
      whileHover={{
        boxShadow: "0 8px 30px rgba(15,23,42,0.12)"
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, delay = 0, duration = 0.6, className }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ children, delay = 0, duration = 0.6, className }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
