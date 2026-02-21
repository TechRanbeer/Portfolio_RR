import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const sequence = [
    "Initializing Engineering System...",
    "Loading Modules...",
    "Mechanical ✓",
    "Robotics ✓",
    "ML Systems ✓",
    "Finalizing Interface..."
  ];

  useEffect(() => {
    if (step < sequence.length) {
      const timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete, sequence.length]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center font-mono text-sm tracking-widest">
      <div className="w-full max-w-md px-8">
        <div className="space-y-2">
          {sequence.slice(0, step + 1).map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex items-center gap-3",
                i === sequence.length - 1 ? "text-blue-400" : "text-white/60"
              )}
            >
              <span className="text-[10px] opacity-30">[{String(i).padStart(2, '0')}]</span>
              <span>{text}</span>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 h-[1px] w-full bg-white/10 relative overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: `${(step / sequence.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};
