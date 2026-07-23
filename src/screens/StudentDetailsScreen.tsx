import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore, type StudentDetails } from '../store/quizStore';
import { quizQuestions } from '../utils/questions';
import { User, Hash, Phone, Mail } from 'lucide-react';

const StudentDetailsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setStudentDetails, studentDetails, initializeQuiz } = useQuizStore();

  const [formData, setFormData] = useState<StudentDetails>({
    name: studentDetails?.name || '',
    registerNumber: studentDetails?.registerNumber || '',
    phone: studentDetails?.phone || '',
    email: studentDetails?.email || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StudentDetails, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof StudentDetails, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.registerNumber.trim()) newErrors.registerNumber = 'Register Number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStudentDetails(formData);
      // Initialize quiz with 30 randomized questions from the bank
      initializeQuiz(quizQuestions, 30);
      navigate('/quiz');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8 relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg glass-card p-6 sm:p-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800 font-poppins">Student Details</h2>
          <p className="text-slate-500 mt-2">Please fill in your details to start the quiz.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`input-field pl-10 ${errors.name ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <p className="text-danger text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Register Number <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={formData.registerNumber}
                onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                className={`input-field pl-10 ${errors.registerNumber ? 'border-danger focus:border-danger focus:ring-danger/20' : ''}`}
                placeholder="Enter your register number"
              />
            </div>
            {errors.registerNumber && <p className="text-danger text-sm mt-1">{errors.registerNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number <span className="text-slate-400 text-xs font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field pl-10"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address <span className="text-slate-400 text-xs font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field pl-10"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full btn-primary text-lg"
            >
              Start Quiz
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default StudentDetailsScreen;
