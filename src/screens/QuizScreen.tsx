import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { Clock, LayoutGrid, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const QuizScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    timeRemaining, 
    decrementTime, 
    answers, 
    setAnswer, 
    currentQuestionIndex, 
    setCurrentQuestionIndex,
    submitQuiz,
    status,
    studentDetails,
    setStatus,
    activeQuestions
  } = useQuizStore();

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  // Artificial loading state for questions
  useEffect(() => {
    setIsLoadingQuestion(true);
    const timer = setTimeout(() => {
      setIsLoadingQuestion(false);
    }, 600); // 600ms loading skeleton for premium feel
    return () => clearTimeout(timer);
  }, [currentQuestionIndex]);

  // Security and routing protection
  useEffect(() => {
    if (!studentDetails || status === 'submitted') {
      navigate('/', { replace: true });
    }
    if (status === 'not_started') {
      setStatus('in_progress');
    }
  }, [studentDetails, status, navigate, setStatus]);

  // Timer logic
  useEffect(() => {
    if (status !== 'in_progress') return;

    const timer = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [status, decrementTime]);

  // Auto-submit when time is up
  useEffect(() => {
    if (timeRemaining <= 0 && status === 'in_progress' && !isSubmitting) {
      handleFinalSubmit();
    }
  }, [timeRemaining, status, isSubmitting]);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await submitQuiz();
    navigate('/submission', { replace: true });
  };

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.id] || '';

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarningTime = timeRemaining <= 300 && timeRemaining > 60; // 5 minutes
  const isDangerTime = timeRemaining <= 60; // 1 minute

  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Top App Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src="/flag.jpg" alt="SKSSF Flag" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-bold text-slate-800 hidden sm:block font-poppins">SKSSF Online Quiz</h1>
        </div>
        
        <motion.div 
          animate={isDangerTime ? { scale: [1, 1.05, 1] } : {}}
          transition={isDangerTime ? { repeat: Infinity, duration: 1 } : {}}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold ${
            isDangerTime ? 'bg-danger/10 text-danger' : 
            isWarningTime ? 'bg-warning/10 text-warning' : 
            'bg-primary/10 text-primary'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-lg tabular-nums tracking-widest">{formatTime(timeRemaining)}</span>
        </motion.div>

        <button 
          onClick={() => setIsPaletteOpen(!isPaletteOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors sm:hidden"
        >
          <LayoutGrid className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center pb-24">
          <div className="w-full max-w-3xl">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                <span>Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
                <span>{Math.round((Object.keys(answers).length / activeQuestions.length) * 100)}% Completed</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((Object.keys(answers).length) / activeQuestions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              {isLoadingQuestion ? (
                <motion.div
                  key={`skeleton-${currentQuestionIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="glass-card p-6 sm:p-10"
                >
                  <div className="w-14 h-14 bg-slate-200 rounded-2xl animate-pulse mb-6"></div>
                  <div className="h-6 bg-slate-200 rounded animate-pulse w-3/4 mb-3"></div>
                  <div className="h-6 bg-slate-200 rounded animate-pulse w-1/2 mb-8"></div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-16 border-2 border-slate-100 bg-slate-50/50 rounded-xl animate-pulse"></div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-6 sm:p-10 relative overflow-hidden group"
                >
                  {/* Decorative side accent */}
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-accent opacity-70"></div>
                  
                  <div className="flex items-start gap-4 mb-8">
                    <div className="shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary font-bold text-2xl font-poppins shadow-sm border border-primary/20">
                      Q{currentQuestionIndex + 1}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 leading-relaxed pt-2">
                      {currentQuestion.text}
                    </h2>
                  </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQuestion.options?.map((option, index) => {
                    const isSelected = currentAnswer === option;
                    return (
                      <button
                        key={index}
                        onClick={() => setAnswer(currentQuestion.id, option)}
                        className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSelected 
                            ? 'border-primary bg-primary/5 shadow-md text-primary font-medium' 
                            : 'border-slate-200 bg-white/50 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? 'border-primary' : 'border-slate-300'
                          }`}>
                            {isSelected && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                          </div>
                          <span className="text-lg">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Question Palette (Desktop side, Mobile drawer) */}
        <div className={`
          fixed inset-y-0 right-0 z-20 w-72 bg-white border-l border-slate-200 transform transition-transform duration-300 ease-in-out pt-20
          sm:relative sm:translate-x-0 sm:pt-0 sm:border-l sm:bg-transparent
          ${isPaletteOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="h-full overflow-y-auto p-6 flex flex-col">
            <h3 className="font-semibold text-slate-800 mb-4 font-poppins">Question Palette</h3>
            
            <div className="grid grid-cols-4 gap-3">
              {activeQuestions.map((q, idx) => {
                const isAnswered = !!answers[q.id]?.trim();
                const isCurrent = idx === currentQuestionIndex;
                
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setIsPaletteOpen(false);
                    }}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-200
                      ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}
                      ${isAnswered ? 'bg-primary text-white shadow-soft' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-4 h-4 rounded-full bg-primary"></div> Answered
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200"></div> Unanswered
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-4 h-4 rounded-full ring-2 ring-primary ring-offset-1 bg-transparent"></div> Current
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 sm:right-72 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 z-10 flex justify-between items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="btn-secondary flex items-center gap-2 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {currentQuestionIndex === activeQuestions.length - 1 ? (
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="btn-primary flex items-center gap-2 bg-accent hover:bg-accent/90"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <Check className="w-5 h-5" />
            )}
            <span>Submit Quiz</span>
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-primary flex items-center gap-2"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mobile Overlay */}
      {isPaletteOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-10 sm:hidden"
          onClick={() => setIsPaletteOpen(false)}
        />
      )}
    </div>
  );
};

export default QuizScreen;
