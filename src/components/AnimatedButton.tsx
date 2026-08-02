import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ isLoading, children, className, ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        relative w-full h-[56px] rounded-[24px] overflow-hidden shadow-lg shadow-brand-green/30
        bg-gradient-to-r from-brand-green to-emerald-600
        text-white font-bold text-[16px] tracking-widest uppercase
        flex items-center justify-center gap-2
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className || ''}
      `}
      disabled={isLoading || props.disabled}
      {...props}
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
