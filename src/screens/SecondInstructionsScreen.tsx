import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const SecondInstructionsScreen: React.FC = () => {
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
          <h2 className="text-xl sm:text-2xl font-semibold text-primary text-center mt-1 font-poppins">
            Additional Instructions
          </h2>
        </div>

        <div className="bg-white/60 rounded-xl p-6 mb-8 border border-white/50">
          <div className="mb-6">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              More Details
            </h3>
          </div>
          
          <ul className="space-y-5">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-1" />
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium">Scoring: For every right answer, 2 marks will be given, and for a wrong answer, 1 mark will be deducted.</span>
                <span className="text-slate-500 text-sm mt-0.5 font-malayalam">മാർക്കിംഗ്: ഓരോ ശരിയായ ഉത്തരത്തിനും 2 മാർക്ക് ലഭിക്കുന്നതാണ്, തെറ്റായ ഓരോ ഉത്തരത്തിനും 1 മാർക്ക് കുറയ്ക്കുന്നതാണ്.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-1" />
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium">Queries: For any additional checking after the examination, you must provide the reference number.</span>
                <span className="text-slate-500 text-sm mt-0.5 font-malayalam">അന്വേഷണങ്ങൾ: പരീക്ഷയ്ക്ക് ശേഷമുള്ള എന്തെങ്കിലും പരിശോധനകൾക്കോ അന്വേഷണങ്ങൾക്കോ റഫറൻസ് നമ്പർ നിർബന്ധമായും നൽകേണ്ടതാണ്.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-1" />
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium">Tie Breaker: If there are multiple winners, the final winner will be selected by a draw.</span>
                <span className="text-slate-500 text-sm mt-0.5 font-malayalam">വിജയികൾ: ഒന്നിൽ കൂടുതൽ പേർക്ക് ഒരേ മാർക്ക് ലഭിക്കുകയാണെങ്കിൽ നറുക്കെടുപ്പിലൂടെയായിരിക്കും വിജയികളെ പ്രഖ്യാപിക്കുക.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-1" />
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium">Question Variability: Questions will be shuffled and may vary for each participant.</span>
                <span className="text-slate-500 text-sm mt-0.5 font-malayalam">ചോദ്യങ്ങൾ: എല്ലാവർക്കുമുള്ള ചോദ്യങ്ങൾ ഒരേപോലെയായിരിക്കില്ല, ചോദ്യങ്ങൾ വ്യത്യസ്തവും ഷഫിൾ ചെയ്തും നൽകുന്നതാണ്.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-1" />
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium">Family Winners: If there are multiple winners from the same family, the winner will be selected by a draw.</span>
                <span className="text-slate-500 text-sm mt-0.5 font-malayalam">കുടുംബം: ഒരു കുടുംബത്തിൽ നിന്ന് ഒന്നിൽ കൂടുതൽ പേർ വിജയികളായാൽ നറുക്കെടുപ്പിലൂടെ വിജയികളെ തീരുമാനിക്കും.</span>
              </div>
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
          <div className="flex flex-col mt-0.5">
            <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
              I have read and understood the instructions.
            </span>
            <span className="text-slate-500 text-sm font-malayalam mt-0.5">
              ഞാൻ നിർദ്ദേശങ്ങൾ വായിച്ചു മനസ്സിലാക്കി.
            </span>
          </div>
        </label>

        <motion.button
          whileHover={{ scale: agreed ? 1.02 : 1 }}
          whileTap={{ scale: agreed ? 0.98 : 1 }}
          onClick={() => agreed && navigate('/details')}
          disabled={!agreed}
          className="w-full btn-primary text-lg flex items-center justify-center gap-2"
        >
          Proceed
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SecondInstructionsScreen;
