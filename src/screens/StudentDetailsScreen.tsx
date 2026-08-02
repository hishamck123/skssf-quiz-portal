import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore, type StudentDetails } from '../store/quizStore';
import { quizQuestions } from '../utils/questions';
import { User, Phone, Mail, Home, Calendar, Clock, FileText } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import AnimatedInput from '../components/AnimatedInput';
import AnimatedButton from '../components/AnimatedButton';

const QuickInfoRow = ({ icon, label, value, delay }: { icon: any, label: string, value: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
  >
    <div className="flex items-center gap-2 text-slate-500">
      <div className="text-brand-green">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </div>
    <span className="text-sm font-bold text-slate-800">{value}</span>
  </motion.div>
);

const StudentDetailsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setStudentDetails, studentDetails, initializeQuiz } = useQuizStore();
  
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showExitTransition, setShowExitTransition] = useState(false);

  const [formData, setFormData] = useState<StudentDetails>({
    name: studentDetails?.name || '',
    fatherName: studentDetails?.fatherName || '',
    familyName: studentDetails?.familyName || '',
    phone: studentDetails?.phone || '',
    email: studentDetails?.email || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StudentDetails, string>>>({});

  const validate = () => {
    const newErrors: Partial<Record<keyof StudentDetails, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.fatherName.trim()) newErrors.fatherName = 'Required';
    if (!formData.familyName.trim()) newErrors.familyName = 'Required';

    if (!formData.phone.trim()) {
      newErrors.phone = 'Required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Must be 10 digits';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const triggerSuccess = () => {
    setIsSuccess(true);
    
    // Shared element transition duration (400ms)
    setTimeout(() => {
      setShowExitTransition(true);
    }, 400);

    setTimeout(() => {
      initializeQuiz(quizQuestions, 30);
      navigate('/quiz');
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsCheckingPhone(true);
      const WEB_APP_URL = import.meta.env.VITE_GAS_URL;

      try {
        if (WEB_APP_URL) {
          const response = await fetch(`${WEB_APP_URL}?action=checkPhone&phone=${formData.phone}`);
          const text = await response.text();

          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            alert("Backend Error: Please ensure you deployed the Google Apps Script as a 'New version'.");
            setIsCheckingPhone(false);
            return;
          }

          if (data.exists) {
            setErrors(prev => ({ ...prev, phone: 'Already tried on this number' }));
            if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
            setIsCheckingPhone(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error checking phone number:", error);
        // We bypass block if network fails, just proceed.
      }

      setIsCheckingPhone(false);
      setStudentDetails(formData);
      triggerSuccess();
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative bg-brand-light">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-[420px] h-full min-h-[100dvh] flex flex-col items-center justify-center p-4 pt-12 pb-10">
        
        {/* Animated Form Container */}
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.98 }}
          animate={{ 
            y: showExitTransition ? -50 : 0, 
            opacity: showExitTransition ? 0 : 1,
            scale: isSuccess ? 0.95 : 1,
            filter: isSuccess ? 'blur(2px)' : 'blur(0px)'
          }}
          transition={{ 
            type: 'spring', damping: 20, stiffness: 100,
            opacity: { duration: 0.4 }
          }}
          className="w-full glass-card bg-white/80 backdrop-blur-xl border border-white/60 rounded-[24px] shadow-2xl p-6 sm:p-8"
        >
          {/* Header section fades upward */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center mb-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 bg-white rounded-full p-2 shadow-sm border border-slate-100 mb-3 relative"
            >
              <div className="absolute inset-0 bg-brand-green/20 blur-md rounded-full -z-10" />
              <img src="/flag.jpg" alt="Logo" className="w-full h-full object-contain drop-shadow-sm" />
            </motion.div>
            
            <h1 className="text-lg font-bold font-poppins text-slate-800 tracking-widest text-center uppercase">
              SKSSF MUTTIPADI UNIT
            </h1>
            
            <h2 className="text-xl font-bold text-brand-green font-poppins mt-2">Welcome Back</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Please sign in to continue.</p>
          </motion.div>

          {/* Form with Staggered Inputs */}
          <form onSubmit={handleSubmit} className="space-y-1">
            <AnimatedInput
              label="Full Name"
              icon={<User size={20} />}
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Mohammed Ali"
              error={errors.name}
              delay={0.2}
            />

            <AnimatedInput
              label="Father's Name"
              icon={<User size={20} />}
              type="text"
              value={formData.fatherName}
              onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
              placeholder="e.g. Abdul Rahman"
              error={errors.fatherName}
              delay={0.32}
            />

            <AnimatedInput
              label="Family / House Name"
              icon={<Home size={20} />}
              type="text"
              value={formData.familyName}
              onChange={(e) => setFormData(prev => ({ ...prev, familyName: e.target.value }))}
              placeholder="e.g. Pookkottur"
              error={errors.familyName}
              delay={0.44}
            />

            <AnimatedInput
              label="Mobile Number"
              icon={<Phone size={20} />}
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
              placeholder="e.g. 9876543210"
              error={errors.phone}
              delay={0.56}
            />

            <AnimatedInput
              label="Email (Optional)"
              icon={<Mail size={20} />}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="e.g. example@email.com"
              error={errors.email}
              delay={0.68}
            />

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="pt-2"
            >
              <AnimatedButton type="submit" isLoading={isCheckingPhone || isSuccess}>
                {isSuccess ? 'AUTHENTICATING' : 'PROCEED'}
              </AnimatedButton>
            </motion.div>
          </form>

          {/* Quick Info Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.9, duration: 0.4 }}
            className="mt-6 bg-slate-50/80 border border-slate-100 rounded-2xl p-4 shadow-sm"
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Exam Details</p>
            <QuickInfoRow icon={<Calendar size={16} />} label="Date" value="Today" delay={1.0} />
            <QuickInfoRow icon={<Clock size={16} />} label="Duration" value="15 Mins" delay={1.1} />
            <QuickInfoRow icon={<FileText size={16} />} label="Total Questions" value="30" delay={1.2} />
          </motion.div>

        </motion.div>
        
        {/* Footer outside the card */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: showExitTransition ? 0 : 1 }} 
          transition={{ delay: 1.3, duration: 0.5 }}
          className="mt-6 flex flex-col items-center justify-center text-[10px] font-medium text-slate-400 gap-1 text-center"
        >
          <p>Powered by SKSSF MUTTIPADI UNIT • v2.0</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="hover:text-brand-green cursor-pointer transition-colors">Privacy Policy</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="hover:text-brand-green cursor-pointer transition-colors">Support</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default StudentDetailsScreen;
