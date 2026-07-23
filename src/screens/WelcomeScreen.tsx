import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, AlertCircle, ShieldAlert } from 'lucide-react';

const WelcomeScreen: React.FC = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob animation-delay-2000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl glass-card p-6 sm:p-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 mb-4 flex items-center justify-center">
            <img src="/flag.jpg" alt="SKSSF Flag" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center font-poppins">
            Welcome to
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-primary text-center mt-1 font-poppins">
            SKSSF Muttipadi Online Quiz
          </h2>
        </div>

        <div className="bg-white/60 rounded-xl p-6 mb-8 border border-white/50">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Instructions
          </h3>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <span className="text-slate-700"><strong>Duration:</strong> 15 Minutes. The timer will start automatically.</span>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <span className="text-slate-700"><strong>Format:</strong> Multiple Choice Questions.</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <span className="text-slate-700"><strong>One Attempt Only:</strong> Do not refresh or close the tab during the quiz.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2.5 h-2.5 bg-secondary rounded-full"></div>
              </div>
              <span className="text-slate-700"><strong>Internet Required:</strong> Ensure you have a stable connection.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-warning flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2.5 h-2.5 bg-warning rounded-full"></div>
              </div>
              <span className="text-slate-700"><strong>Auto Submit:</strong> The quiz will automatically submit when the time ends.</span>
            </li>
          </ul>
        </div>

        <label className="flex items-start gap-3 cursor-pointer mb-8 group">
          <div className="relative flex items-center justify-center mt-1 shrink-0">
            <input 
              type="checkbox" 
              className="peer sr-only"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <div className="w-6 h-6 border-2 border-slate-300 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 flex items-center justify-center">
              <motion.svg 
                initial={{ scale: 0 }}
                animate={{ scale: agreed ? 1 : 0 }}
                className="w-4 h-4 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="3"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </motion.svg>
            </div>
          </div>
          <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
            I have read and understood the instructions.
          </span>
        </label>

        <motion.button
          whileHover={{ scale: agreed ? 1.02 : 1 }}
          whileTap={{ scale: agreed ? 0.98 : 1 }}
          onClick={() => agreed && navigate('/details')}
          disabled={!agreed}
          className="w-full btn-primary text-lg"
        >
          Proceed
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
