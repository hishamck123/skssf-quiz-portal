import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label: string;
  error?: string;
  delay?: number;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ icon, label, error, delay = 0, className, value, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    // Check if there is a value to keep label floating
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    const isFloating = isFocused || hasValue;

    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4, type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full relative pb-5"
      >
        <motion.div 
          className="relative"
          animate={error ? { x: [-3, 3, -3, 3, 0] } : { x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Leading Icon */}
          {icon && (
            <div className={`absolute top-1/2 -translate-y-1/2 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 z-10 ${isFocused ? 'text-brand-green' : error ? 'text-red-500' : 'text-slate-400'}`}>
              {icon}
            </div>
          )}

          {/* Floating Label */}
          <label 
            className={`absolute left-0 transition-all duration-200 pointer-events-none z-10 
              ${icon ? 'pl-[3.25rem]' : 'pl-4'}
              ${isFloating 
                ? '-top-2.5 text-xs font-semibold px-1 ml-3 bg-white text-brand-green' 
                : 'top-4 text-base font-normal text-slate-500'
              }
              ${error && isFloating ? 'text-red-500' : ''}
            `}
          >
            {label}
          </label>

          {/* Input Field */}
          <input
            ref={ref}
            value={value}
            onChange={onChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full bg-white/70 backdrop-blur-md rounded-2xl pt-4 pb-3.5 px-4
              transition-all duration-300 outline-none shadow-sm
              ${icon ? 'pl-[3.25rem]' : ''}
              ${error 
                ? 'border-2 border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
                : 'border-2 border-slate-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green/20'
              }
              hover:bg-white/90
              ${className || ''}
            `}
            {...props}
          />

          {/* Validation Checkmark */}
          {hasValue && !error && !isFocused && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-1/2 -translate-y-1/2 right-0 pr-4 flex items-center pointer-events-none text-brand-green"
            >
              <svg className="w-5 h-5 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </motion.div>
        
        {/* Error Message */}
        <div className="absolute bottom-0 left-4">
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-[11px] font-bold tracking-wide uppercase"
            >
              {error}
            </motion.p>
          )}
        </div>
      </motion.div>
    );
  }
);

AnimatedInput.displayName = 'AnimatedInput';
export default AnimatedInput;
