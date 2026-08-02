import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { Bookmark, ChevronLeft, ChevronRight, Grid, Check, WifiOff, Wifi, AlertTriangle } from 'lucide-react';
import BottomSheet from '../components/BottomSheet';

const CircularTimer = ({ progress, timeRemaining, isDanger }: { progress: number, timeRemaining: number, isDanger: boolean }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m}:${secs.toString().padStart(2, '0')}`;
  };

  // Heartbeat animation when under 60 seconds
  const heartbeatAnimation = isDanger && timeRemaining <= 60 ? { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] } : {};
  const pulseTransition = isDanger && timeRemaining <= 60 ? { repeat: Infinity, duration: 1 } : {};

  return (
    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" className="stroke-slate-200" strokeWidth="4" fill="none" />
        <motion.circle
          cx="20" cy="20" r="16"
          className={
            timeRemaining <= 60 ? "stroke-red-500" :
            timeRemaining <= 300 ? "stroke-orange-400" :
            timeRemaining <= 600 ? "stroke-yellow-400" :
            "stroke-brand-green"
          }
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "linear" }}
        />
      </svg>
      <motion.div 
        animate={heartbeatAnimation} 
        transition={pulseTransition}
        className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${
          timeRemaining <= 60 ? 'text-red-500' : 'text-slate-700'
        }`}
      >
        {formatTime(timeRemaining)}
      </motion.div>
    </div>
  );
};

const QuizScreen: React.FC = () => {
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();
  
  const { 
    timeRemaining, decrementTime, answers, setAnswer, 
    currentQuestionIndex, setCurrentQuestionIndex, submitQuiz, status, studentDetails, 
    activeQuestions, markVisited, visitedQuestions, markedForReview, toggleMarkForReview
  } = useQuizStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'answered' | 'unanswered' | 'marked'>('all');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'offline'>('saved');

  useEffect(() => {
    if (!studentDetails || status === 'submitted') {
      navigate('/', { replace: true });
    }
  }, [studentDetails, status, navigate]);

  useEffect(() => {
    if (status !== 'in_progress') return;
    const timer = setInterval(() => {
      decrementTime();
      if (timeRemaining <= 60 && timeRemaining % 10 === 0 && navigator.vibrate) {
        navigator.vibrate(50); // Soft vibration every 10 seconds in final minute
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [status, decrementTime, timeRemaining]);

  useEffect(() => {
    if (timeRemaining <= 0 && status === 'in_progress' && !isSubmitting) {
      handleFinalSubmit();
    }
  }, [timeRemaining, status, isSubmitting]);

  // Mark current question as visited
  useEffect(() => {
    if (activeQuestions.length > 0) {
      markVisited(activeQuestions[currentQuestionIndex].id);
    }
  }, [currentQuestionIndex, activeQuestions, markVisited]);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await submitQuiz();
    navigate('/submission', { replace: true });
  };

  const handleOptionSelect = (option: string) => {
    setSaveStatus('saving');
    if (navigator.vibrate) navigator.vibrate(20); // Touch feedback
    setAnswer(activeQuestions[currentQuestionIndex].id, option);
    
    // Simulate network save delay
    setTimeout(() => {
      setSaveStatus(isOnline ? 'saved' : 'offline');
    }, 500);
    // DO NOT automatically advance as per requirements
  };

  if (!activeQuestions.length) return null;

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id] || '';
  const isMarked = markedForReview[currentQuestion.id];
  const timeProgress = timeRemaining / (15 * 60);

  // Statistics
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const visitedCount = Object.values(visitedQuestions).filter(Boolean).length;
  const unvisitedCount = activeQuestions.length - visitedCount;
  const unansweredCount = activeQuestions.length - answeredCount;

  // Filter logic for navigator
  const filteredQuestions = useMemo(() => {
    return activeQuestions.map((q, i) => ({ q, i })).filter(({ q }) => {
      if (filter === 'all') return true;
      if (filter === 'answered') return !!answers[q.id];
      if (filter === 'unanswered') return !answers[q.id];
      if (filter === 'marked') return !!markedForReview[q.id];
      return true;
    });
  }, [activeQuestions, answers, markedForReview, filter]);

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col relative overflow-hidden">
      
      {/* Network Status Notification */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-50 bg-red-500 text-white text-xs font-bold text-center py-1 flex items-center justify-center gap-2"
          >
            <WifiOff size={14} /> Offline - Saving Locally
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Top Header */}
      <header className={`w-full flex justify-center bg-white border-b border-slate-100 shadow-sm z-40 ${!isOnline ? 'mt-6' : ''}`}>
        <div className="w-full max-w-3xl px-4 py-3 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKSSF Quiz</span>
            <span className="text-sm font-bold text-brand-dark">Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
            <div className="flex items-center gap-1 mt-0.5">
               {saveStatus === 'saving' ? (
                  <span className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin" /> Saving...
                  </span>
               ) : saveStatus === 'offline' || !isOnline ? (
                  <span className="text-[9px] font-medium text-amber-500 flex items-center gap-1">
                    <AlertTriangle size={10} /> Saved Offline
                  </span>
               ) : (
                  <span className="text-[9px] font-medium text-brand-green flex items-center gap-1">
                    <Check size={10} /> All Answers Saved
                  </span>
               )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {timeRemaining <= 60 && (
              <motion.span 
                animate={{ opacity: [1, 0.5, 1] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-[10px] font-bold text-red-500 uppercase"
              >
                Ending Soon
              </motion.span>
            )}
            <CircularTimer progress={timeProgress} timeRemaining={timeRemaining} isDanger={timeRemaining <= 60} />
          </div>
        </div>
      </header>

      {/* Question Area */}
      <main className="flex-1 overflow-y-auto w-full flex flex-col items-center bg-slate-50">
        <div className="w-full max-w-3xl px-5 pt-6 pb-[100px] flex flex-col flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex justify-between items-start gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 leading-relaxed font-poppins">
                  {currentQuestion.text}
                </h2>
                <button 
                  onClick={() => toggleMarkForReview(currentQuestion.id)}
                  className={`p-3 rounded-full shrink-0 transition-colors ${isMarked ? 'bg-purple-100 text-purple-600' : 'bg-white text-slate-400 shadow-sm'}`}
                >
                  <Bookmark size={24} fill={isMarked ? 'currentColor' : 'none'} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-auto mb-2">
                {currentQuestion.options?.map((option, index) => {
                  const isSelected = currentAnswer === option;
                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      className={`
                        relative w-full min-h-[56px] p-4 rounded-2xl border-2 text-left font-medium text-[15px] sm:text-[16px] transition-all flex items-center
                        ${isSelected 
                          ? 'border-brand-green bg-brand-green/5 text-brand-green shadow-sm' 
                          : 'border-white bg-white text-slate-700 shadow-sm hover:border-slate-200'}
                      `}
                    >
                      <span className="flex-1 pr-8">{option}</span>
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="absolute right-4 w-6 h-6 bg-brand-green rounded-full flex items-center justify-center text-white"
                        >
                          <Check size={14} strokeWidth={3} />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Persistent Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-white border-t border-slate-200 flex justify-center z-40 pb-safe">
        <div className="w-full max-w-3xl px-4 flex items-center justify-between h-full">
          {/* Previous Button */}
          <button 
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="w-14 h-14 rounded-full flex items-center justify-center text-slate-600 disabled:opacity-30 disabled:bg-transparent bg-slate-100"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Navigator Toggle */}
          <button 
            onClick={() => setShowNavigator(true)}
            className="flex-1 max-w-[140px] h-12 rounded-full bg-slate-100 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 mx-2 hover:bg-slate-200 transition-colors"
          >
            <Grid size={18} /> Navigator
          </button>

          {/* Next / Submit Button */}
          {currentQuestionIndex === activeQuestions.length - 1 ? (
            <button 
              onClick={() => setShowSubmitConfirm(true)}
              className="h-14 px-6 rounded-full bg-brand-green text-white font-bold tracking-widest uppercase flex items-center justify-center shadow-lg shadow-brand-green/30 hover:scale-105 transition-transform"
            >
              Submit
            </button>
          ) : (
            <button 
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              className="w-14 h-14 rounded-full flex items-center justify-center text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      </div>

      {/* Question Navigator Bottom Sheet */}
      <BottomSheet isOpen={showNavigator} onClose={() => setShowNavigator(false)} title="Question Navigator">
        
        {/* Statistics Panel */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase">Completion</span>
            <span className="text-sm font-bold text-brand-green">{Math.round((answeredCount / activeQuestions.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-brand-green rounded-full" style={{ width: `${(answeredCount / activeQuestions.length) * 100}%` }} />
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col"><span className="text-lg font-black text-brand-green">{answeredCount}</span><span className="text-[9px] font-bold text-slate-400 uppercase">Answered</span></div>
            <div className="flex flex-col"><span className="text-lg font-black text-slate-600">{unansweredCount}</span><span className="text-[9px] font-bold text-slate-400 uppercase">Unanswered</span></div>
            <div className="flex flex-col"><span className="text-lg font-black text-slate-400">{unvisitedCount}</span><span className="text-[9px] font-bold text-slate-400 uppercase">Unvisited</span></div>
            <div className="flex flex-col"><span className="text-lg font-black text-purple-500">{markedCount}</span><span className="text-[9px] font-bold text-slate-400 uppercase">Marked</span></div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-brand-green"></div><span className="text-[10px] font-medium text-slate-600">Answered</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-yellow-400"></div><span className="text-[10px] font-medium text-slate-600">Visited</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-white border border-slate-300"></div><span className="text-[10px] font-medium text-slate-600">Unvisited</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-purple-500"></div><span className="text-[10px] font-medium text-slate-600">Review</span></div>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-4 pb-2">
          {['all', 'answered', 'unanswered', 'marked'].map(f => (
            <button 
              key={f} onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 pb-8">
          {filteredQuestions.map(({ q, i }) => {
            const isAnswered = !!answers[q.id];
            const isVisited = !!visitedQuestions[q.id];
            const isReview = !!markedForReview[q.id];
            const isCurrent = i === currentQuestionIndex;

            let bgColor = 'bg-white border-slate-200 text-slate-600';
            if (isReview) bgColor = 'bg-purple-500 border-purple-500 text-white';
            else if (isAnswered) bgColor = 'bg-brand-green border-brand-green text-white';
            else if (isVisited) bgColor = 'bg-yellow-400 border-yellow-400 text-yellow-900';

            if (isCurrent) bgColor = 'bg-blue-500 border-blue-500 text-white ring-4 ring-blue-200';

            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentQuestionIndex(i);
                  setShowNavigator(false);
                }}
                className={`h-12 w-full rounded-xl border flex items-center justify-center font-bold text-sm shadow-sm transition-transform active:scale-95 ${bgColor}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      {/* Submit Confirmation Sheet */}
      <BottomSheet isOpen={showSubmitConfirm} onClose={() => setShowSubmitConfirm(false)} title="Submit Examination">
        <div className="text-center mb-6">
          <p className="text-slate-600 text-sm">Are you sure you want to submit your exam? You cannot change your answers after submission.</p>
        </div>
        
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 space-y-3">
           <div className="flex justify-between items-center"><span className="text-slate-500 text-sm font-medium">Answered Questions</span><span className="font-bold text-brand-green">{answeredCount} / {activeQuestions.length}</span></div>
           <div className="flex justify-between items-center"><span className="text-slate-500 text-sm font-medium">Unanswered</span><span className="font-bold text-red-500">{unansweredCount}</span></div>
           <div className="flex justify-between items-center"><span className="text-slate-500 text-sm font-medium">Marked for Review</span><span className="font-bold text-purple-500">{markedCount}</span></div>
           <div className="flex justify-between items-center"><span className="text-slate-500 text-sm font-medium">Time Remaining</span><span className="font-bold text-slate-800">{Math.floor(timeRemaining/60)}m {timeRemaining%60}s</span></div>
        </div>

        <div className="space-y-3 pb-6">
          {unansweredCount > 0 && (
            <button onClick={() => {
              setFilter('unanswered');
              setShowSubmitConfirm(false);
              setShowNavigator(true);
            }} className="w-full h-14 rounded-2xl border-2 border-brand-green text-brand-green font-bold tracking-widest uppercase">
              Review Unanswered
            </button>
          )}
          <button 
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl bg-brand-green text-white font-bold tracking-widest uppercase shadow-lg shadow-brand-green/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
          </button>
        </div>
      </BottomSheet>

    </div>
  );
};

export default QuizScreen;
