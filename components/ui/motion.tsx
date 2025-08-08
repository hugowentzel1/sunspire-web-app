import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 0.6, className }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Rise({ children, delay = 0, duration = 0.8, className }: MotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function HoverLift({ children, className }: MotionProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
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
