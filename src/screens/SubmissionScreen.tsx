import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useQuizStore } from '../store/quizStore';
import { useNavigate } from 'react-router-dom';

const SubmissionScreen: React.FC = () => {
  const { status, referenceNumber, resetQuiz } = useQuizStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (status !== 'submitted') {
      navigate('/');
      return;
    }

    // Trigger beautiful confetti animation
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0F766E', '#14B8A6', '#22C55E']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0F766E', '#14B8A6', '#22C55E']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

  }, [status, navigate]);

  if (status !== 'submitted') return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        className="glass-card p-10 flex flex-col items-center max-w-md w-full text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
          className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mb-6"
        >
          <motion.svg 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-12 h-12 text-accent" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        </motion.div>

        <h2 className="text-3xl font-bold text-slate-800 mb-2 font-poppins">Successfully Submitted!</h2>
        <p className="text-slate-600 mb-6 font-inter">
          Thank you for participating in the SKSSF Muttipadi Online Quiz. Your responses have been recorded.
        </p>

        {referenceNumber && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full mb-8">
            <p className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-wider">Reference Number</p>
            <p className="text-xl font-bold text-primary font-mono tracking-widest">{referenceNumber}</p>
            <p className="text-xs text-slate-400 mt-2">Please save this number for future reference.</p>
          </div>
        )}

        <button 
          onClick={() => {
            resetQuiz();
            navigate('/');
          }}
          className="btn-secondary w-full"
        >
          Return to Home
        </button>
      </motion.div>
    </div>
  );
};

export default SubmissionScreen;
