import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import StudentDetailsScreen from './screens/StudentDetailsScreen';
import QuizScreen from './screens/QuizScreen';
import SecondInstructionsScreen from './screens/SecondInstructionsScreen';
import SubmissionScreen from './screens/SubmissionScreen';

// Page Transition Wrapper
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><SplashScreen /></PageWrapper>} />
        <Route path="/welcome" element={<PageWrapper><WelcomeScreen /></PageWrapper>} />
        <Route path="/instructions-2" element={<PageWrapper><SecondInstructionsScreen /></PageWrapper>} />
        <Route path="/details" element={<PageWrapper><StudentDetailsScreen /></PageWrapper>} />
        <Route path="/quiz" element={<PageWrapper><QuizScreen /></PageWrapper>} />
        <Route path="/submission" element={<PageWrapper><SubmissionScreen /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // Security Features
    
    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Disable Copy Paste
    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // 3. Warn before leaving
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only warn if they are in the quiz (we can't check zustand state easily here without subscribing, 
      // but returning a string triggers the browser default warning for any active interaction)
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <Router>
      <div className="w-full min-h-screen bg-background font-inter text-slate-800">
        <AnimatedRoutes />
      </div>
    </Router>
  );
};

export default App;
