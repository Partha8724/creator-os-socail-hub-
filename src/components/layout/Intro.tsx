import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroProps {
  onComplete: () => void;
}

const TypewriterLine = ({ text, delay, onLineComplete, className }: { text: string, delay: number, onLineComplete?: () => void, className?: string }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const startTimeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          if (onLineComplete) onLineComplete();
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(startTimeout);
  }, [text, delay, onLineComplete]);

  return (
    <h1 className={className}>
      {displayText}
      {displayText.length < text.length && (
        <motion.span 
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.2, repeat: Infinity }}
          className="inline-block w-[0.5em] h-[1em] bg-glow-blue/10 ml-1 align-baseline"
        />
      )}
    </h1>
  );
};

export default function Intro({ onComplete }: IntroProps) {
  const [phase, setPhase] = useState<'typing' | 'shimmer' | 'exit'>('typing');
  
  useEffect(() => {
    const shimmerTimer = setTimeout(() => setPhase('shimmer'), 3500);
    const endTimer = setTimeout(onComplete, 5500);
    return () => {
      clearTimeout(shimmerTimer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#1C1C1E] border border-apple-glass-border flex flex-col items-center justify-center p-6 overflow-hidden perspective-1000">
      <div className="hub-scanlines" />
      <div className="hub-starfield opacity-20" />
      
      <AnimatePresence>
        {phase !== 'exit' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 45, y: 100 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotateX: 0, 
              y: 0,
              rotateY: phase === 'shimmer' ? [0, 5, -5, 0] : 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.2, 
              filter: 'blur(30px)',
              rotateX: -20,
              y: -50
            }}
            transition={{ 
              duration: 1.5, 
              ease: [0.22, 1, 0.36, 1],
              rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative z-10 w-full max-w-4xl"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-4 py-1.5 border border-glow-blue/30 bg-glow-blue/10 mb-4"
              >
                <div className="w-2 h-2 rounded-full bg-glow-blue/10 animate-pulse" />
                <span className="text-xs font-medium text-glow-blue  tracking-normal">Smart Link Established</span>
              </motion.div>

              <div className="flex flex-col gap-2">
                <TypewriterLine 
                  text="YOUR CONTENT." 
                  delay={500} 
                  className="text-5xl md:text-8xl font-black tracking-tight  leading-none text-[#A1A1A6]"
                />
                <TypewriterLine 
                  text="AUTOMATED." 
                  delay={1500} 
                  className="text-5xl md:text-8xl font-black tracking-tight  leading-none text-glow-blue "
                />
                <TypewriterLine 
                  text="ELEVATED." 
                  delay={2500} 
                  className="text-5xl md:text-8xl font-black tracking-tight  leading-none text-[#A1A1A6]"
                />
              </div>

              <motion.div 
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 3.5, duration: 1 }}
                className="w-64 h-1 bg-gradient-to-r from-transparent via-primary-blue to-transparent mt-12 "
              />
            </div>

            {/* 3D Decorative Orbs */}
            {phase === 'shimmer' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                className="absolute -inset-20 z-[-1]"
              >
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-glow-blue/10 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-glow-purple/10 blur-[100px] rounded-full animate-pulse" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 font-medium text-xs text-[#A1A1A6]  tracking-normal"
      >
        Initializing Global Platform
      </motion.div>
    </div>
  );
}
