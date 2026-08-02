import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-white via-green-50 to-amber-50">
      
      {/* Soft Gradient Glows */}
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-emerald-100/40 blur-3xl"
      />
      
      <motion.div 
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-[20%] -left-[10%] w-[80vw] h-[80vw] rounded-full bg-brand-gold/10 blur-3xl"
      />

      {/* Islamic Geometric Patterns - Extremely Subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02] mix-blend-overlay">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`pattern-${i}`}
            className="absolute text-brand-green"
            initial={{ 
              x: `${Math.random() * 100}vw`, 
              y: `${Math.random() * 100}vh`,
              rotate: 0 
            }}
            animate={{
              y: [`${Math.random() * 100}vh`, `${Math.random() * 100 - 20}vh`],
              rotate: [0, 90, 180, 360],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: Math.random() * 20 + 40,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ width: `${Math.random() * 150 + 100}px`, height: `${Math.random() * 150 + 100}px` }}
          >
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0 L65 35 L100 50 L65 65 L50 100 L35 65 L0 50 L35 35 Z" />
              <path d="M50 15 L60 40 L85 50 L60 60 L50 85 L40 60 L15 50 L40 40 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Subtle Light Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-brand-gold/30 rounded-full blur-[1px]"
          initial={{ 
            x: `${Math.random() * 100}vw`, 
            y: `${Math.random() * 100}vh`,
          }}
          animate={{
            y: [`${Math.random() * 100}vh`, `${Math.random() * 100 - 15}vh`],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
