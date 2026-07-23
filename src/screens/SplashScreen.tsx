import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-warning rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Geometric Islamic Pattern Hint */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center"
      >
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-48 mb-6 flex items-center justify-center bg-white p-4 rounded-xl shadow-glass"
        >
          <img src="/logo.jpg" alt="SKSSF Logo Text" className="w-full h-auto object-contain" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-white text-3xl md:text-4xl font-bold font-poppins text-center px-4 tracking-wide"
        >
          Muttipadi Online Quiz
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-white/80 mt-2 text-lg font-inter font-medium tracking-widest uppercase"
        >
          Online Quiz
        </motion.p>
      </motion.div>
      
      {/* Loading indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-12 flex space-x-2"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-3 h-3 bg-white rounded-full"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default SplashScreen;
