import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) return;
    const timer = setTimeout(() => {
      navigate('/instructions-1');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, skipped]);

  const handleSkip = () => {
    setSkipped(true);
    navigate('/details');
  };

  return (
    <div 
      onClick={handleSkip}
      className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-brand-light to-emerald-50 cursor-pointer"
    >
      {/* Soft Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-brand-gold/30 rounded-full blur-[1px]"
            initial={{ 
              x: `${Math.random() * 100}vw`, 
              y: `${Math.random() * 100}vh`,
            }}
            animate={{
              y: [`${Math.random() * 100}vh`, `${Math.random() * 100 - 30}vh`],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="z-10 flex flex-col items-center"
      >
        {/* Animated Logo with Glow */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative w-32 h-32 sm:w-40 sm:h-40 mb-8 flex items-center justify-center"
        >
          {/* Outer Glow */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-brand-green/30 rounded-full blur-2xl"
          />
          {/* Actual Flag Icon */}
          <div className="relative z-10 w-full h-full bg-white rounded-3xl shadow-2xl shadow-brand-green/20 p-4 border border-emerald-100 flex items-center justify-center overflow-hidden">
            <img src="/flag.jpg" alt="SKSSF Logo" className="w-full h-full object-contain drop-shadow-md" />
          </div>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-brand-dark text-2xl sm:text-3xl font-bold font-poppins text-center px-6 tracking-tight leading-tight"
        >
          SKSSF MUTTIPADI
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-brand-green mt-2 text-sm sm:text-base font-semibold tracking-[0.2em] uppercase"
        >
          Online Quiz 2026
        </motion.p>
      </motion.div>
      
      {/* Modern Shimmer Loading Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-16 flex flex-col items-center"
      >
        <div className="w-32 h-1 bg-emerald-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-green rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
