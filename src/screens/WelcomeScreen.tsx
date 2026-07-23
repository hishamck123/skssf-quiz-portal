import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, AlertCircle, ShieldAlert } from 'lucide-react';
import { useQuizStore } from '../store/quizStore';

const WelcomeScreen: React.FC = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  // Reset any previous quiz attempts when landing on the welcome screen
  useEffect(() => {
    resetQuiz();
  }, [resetQuiz]);

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
          <div className="mb-6">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Instructions
            </h3>
            <div className="mt-1 flex flex-col pl-7">
              <p className="text-sm sm:text-base text-danger font-bold tracking-wide">Read carefully and understand before proceeding!</p>
              <p className="text-xs sm:text-sm text-danger/90 font-bold font-malayalam mt-0.5">തുടരുന്നതിന് മുൻപ് താഴെ പറയുന്നവ ശ്രദ്ധാപൂർവ്വം വായിച്ചു മനസ്സിലാക്കുക.</p>
            </div>
          </div>
          
          <ul className="space-y-5">
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-secondary shrink-0 mt-1" />
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium">Duration: 15 Minutes. The timer will start automatically.</span>
                <span className="text-slate-500 text-sm mt-0.5 font-malayalam">സമയം: 15 മിനിറ്റ്. ടൈമർ യാന്ത്രികമായി ആരംഭിക്കുന്നതാണ്.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-secondary shrink-0 mt-1" />
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium">Format: Multiple Choice Questions.</span>
                <span className="text-slate-500 text-sm mt-0.5 font-malayalam">ഫോർമാറ്റ്: മൾട്ടിപ്പിൾ ചോയ്‌സ് ചോദ്യങ്ങൾ.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-secondary shrink-0 mt-1" />
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium">One Attempt Only: Do not refresh or close the tab during the quiz.</span>
                <span className="text-slate-500 text-sm mt-0.5 font-malayalam">ഒറ്റത്തവണ മാത്രം: ക്വിസ് നടക്കുന്നതിനിടയിൽ പേജ് റിഫ്രഷ് ചെയ്യുകയോ ക്ലോസ് ചെയ്യുകയോ ചെയ്യരുത്.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center shrink-0 mt-1">
                <div className="w-2.5 h-2.5 bg-secondary rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium">Unique Mobile Number: A mobile number can only be used by one student.</span>
                <span className="text-slate-500 text-sm mt-0.5 font-malayalam">ഒരു നമ്പറിൽ ഒരാൾക്ക് മാത്രം: ഒരു മൊബൈൽ നമ്പർ ഉപയോഗിച്ച് ഒരാൾക്ക് മാത്രമേ രജിസ്റ്റർ ചെയ്യാൻ സാധിക്കുകയുള്ളൂ.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center shrink-0 mt-1">
                <div className="w-2.5 h-2.5 bg-secondary rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium">Internet Required: Ensure you have a stable connection.</span>
                <span className="text-slate-500 text-sm mt-0.5 font-malayalam">ഇന്റർനെറ്റ്: നല്ല ഇന്റർനെറ്റ് കണക്ഷൻ ഉണ്ടെന്ന് ഉറപ്പുവരുത്തുക.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-warning flex items-center justify-center shrink-0 mt-1">
                <div className="w-2.5 h-2.5 bg-warning rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium">Auto Submit: The quiz will automatically submit when the time ends.</span>
                <span className="text-slate-500 text-sm mt-0.5 font-malayalam">ഓട്ടോ സബ്മിറ്റ്: സമയം അവസാനിക്കുമ്പോൾ ക്വിസ് യാന്ത്രികമായി സബ്മിറ്റ് ആകുന്നതാണ്.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-1" />
              <div className="flex flex-col">
                <span className="text-slate-700 font-medium">Save Reference Number: Please take a screenshot of the reference number shown at the end.</span>
                <span className="text-slate-500 text-sm mt-0.5 font-malayalam">റഫറൻസ് നമ്പർ: ക്വിസ് അവസാനിക്കുമ്പോൾ ലഭിക്കുന്ന റഫറൻസ് നമ്പറിന്റെ സ്ക്രീൻഷോട്ട് എടുത്തു സൂക്ഷിക്കേണ്ടതാണ്.</span>
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
          className="w-full btn-primary text-lg"
        >
          Proceed
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
