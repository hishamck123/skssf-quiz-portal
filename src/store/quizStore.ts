import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Question } from '../utils/questions';

export interface StudentDetails {
  name: string;
  fatherName: string;
  place: string;
  phone: string;
  email: string;
}

export type QuizStatus = 'not_started' | 'in_progress' | 'submitted';

interface QuizState {
  studentDetails: StudentDetails | null;
  activeQuestions: Question[];
  answers: Record<string, string>;
  status: QuizStatus;
  timeRemaining: number;
  currentQuestionIndex: number;
  referenceNumber: string | null;
  initializeQuiz: (bank: Question[], count: number) => void;
  setStudentDetails: (details: StudentDetails) => void;
  setAnswer: (questionId: string, answer: string) => void;
  setStatus: (status: QuizStatus) => void;
  decrementTime: () => void;
  setCurrentQuestionIndex: (index: number) => void;
  submitQuiz: () => Promise<boolean>;
  resetQuiz: () => void;
}

const INITIAL_TIME = 15 * 60; // 15 minutes in seconds

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      studentDetails: null,
      activeQuestions: [],
      answers: {},
      status: 'not_started',
      timeRemaining: INITIAL_TIME,
      currentQuestionIndex: 0,
      referenceNumber: null,

      initializeQuiz: (bank, count) => {
        // Shuffle the bank array and pick the first `count` elements
        const shuffled = [...bank].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);
        set({ activeQuestions: selected });
      },

      setStudentDetails: (details) => set({ studentDetails: details }),
      
      setAnswer: (questionId, answer) => 
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: answer
          }
        })),

      setStatus: (status) => set({ status }),

      decrementTime: () => 
        set((state) => {
          if (state.timeRemaining <= 1) {
            // Auto submit happens externally to handle async, but we cap it at 0 here
            return { timeRemaining: 0 };
          }
          return { timeRemaining: state.timeRemaining - 1 };
        }),

      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),

      submitQuiz: async () => {
        const state = get();
        if (state.status === 'submitted') return true;
        
        // Generate a 5-digit reference number
        const refNumber = Math.floor(10000 + Math.random() * 90000).toString();
        
        try {
          // Prepare payload for Google Apps Script
          const payload = {
            referenceNumber: refNumber,
            name: state.studentDetails?.name || 'Unknown',
            fatherName: state.studentDetails?.fatherName || 'Unknown',
            place: state.studentDetails?.place || 'Unknown',
            phone: state.studentDetails?.phone || '',
            email: state.studentDetails?.email || '',
            answers: state.answers,
            submittedAt: new Date().toISOString()
          };

          console.log("Submitting payload:", payload);
          // In a real app, you would fetch to the GAS Web App URL here.
          // For now, we simulate a network delay.
          
          const WEB_APP_URL = import.meta.env.VITE_GAS_URL;
          
          if (WEB_APP_URL) {
            await fetch(WEB_APP_URL, {
              method: 'POST',
              mode: 'no-cors', // Google Apps Script requires no-cors from frontend if not returning complex headers, though it makes reading response tricky
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload)
            });
            // no-cors mode doesn't allow reading the response, so we just assume success if it didn't throw an error.
          } else {
             // Simulate network request for testing
            await new Promise(resolve => setTimeout(resolve, 1500));
          }

          set({ status: 'submitted', referenceNumber: refNumber });
          return true;
        } catch (error) {
          console.error("Submission failed", error);
          return false; // Submission failed
        }
      },

      resetQuiz: () => set({
        studentDetails: null,
        activeQuestions: [],
        answers: {},
        status: 'not_started',
        timeRemaining: INITIAL_TIME,
        currentQuestionIndex: 0,
        referenceNumber: null
      })
    }),
    {
      name: 'skssf-quiz-storage',
      partialize: (state) => ({ 
        studentDetails: state.studentDetails, 
        activeQuestions: state.activeQuestions,
        answers: state.answers, 
        status: state.status,
        timeRemaining: state.timeRemaining,
        currentQuestionIndex: state.currentQuestionIndex,
        referenceNumber: state.referenceNumber
      }),
    }
  )
);
