import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface AnimatedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  isLoading?: boolean;
  children: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ isLoading, children, className, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={clsx(
        "relative w-full h-[56px] rounded-[24px] overflow-hidden shadow-lg shadow-brand-green/30 bg-gradient-to-r from-brand-green to-emerald-600 text-white font-bold text-[16px] tracking-widest uppercase flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
      disabled={isLoading || props.disabled}
      {...(props as any)}
    >
      {/* Ripple/Glow background effect */}
      <div className="absolute inset-0 bg-white/20 hover:bg-white/30 transition-colors pointer-events-none" />
      
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
        />
      ) : (
        children
      )}
    </motion.button>
  );
};

export default AnimatedButton;
