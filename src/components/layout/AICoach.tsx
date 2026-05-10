import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Sparkles, Brain, Zap, ChevronRight, MessageCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function AICoach() {
  const [isOpen, setIsOpen] = useState(false);
  const [advice, setAdvice] = useState<string>("Analyzing your current workspace...");
  const [isThinking, setIsThinking] = useState(false);

  const getPageContextAdvice = () => {
    const path = window.location.pathname;
    if (path.includes('retention')) return "Your hook length is currently at 4.2s. Try to reduce it to 2.8s for higher initial retention.";
    if (path.includes('thumbnails')) return "The color contrast on your last asset is below the viral threshold (60%). Increase saturation on the focal point.";
    if (path.includes('architect')) return "Based on current trends, your 'How-To' structure is 15% less effective than 'The Story of' structure this week.";
    if (path.includes('studio')) return "Viral content in your niche is currently favoring 9:16 aspect ratios with centered text nodes.";
    return "Optimize your Smart Hub nodes. Recent data suggests a shift in viewer behavior towards 'Authentic Raw' style editing.";
  };

  useEffect(() => {
    if (isOpen) {
      setIsThinking(true);
      setTimeout(() => {
        setAdvice(getPageContextAdvice());
        setIsThinking(false);
      }, 1500);
    }
  }, [isOpen, window.location.pathname]);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 bg-[#151515] border border-white/10 rounded-[2rem] shadow-2xl p-6 pointer-events-auto backdrop-blur-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 bg-glow-blue/10 border border-glow-blue/30 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-glow-blue" />
               </div>
               <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white italic">Neural Coach</h4>
                  <p className="text-[8px] font-black text-[#86868B] uppercase tracking-tighter">Real-Time Insight Engine</p>
               </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 mb-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-20 h-20 bg-glow-blue/5 blur-2xl rounded-full" />
               {isThinking ? (
                 <div className="flex gap-2 p-2">
                    <div className="w-1 h-1 bg-glow-blue rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-glow-blue rounded-full animate-bounce delay-75" />
                    <div className="w-1 h-1 bg-glow-blue rounded-full animate-bounce delay-150" />
                 </div>
               ) : (
                 <p className="text-sm font-bold text-[#F5F5F7] leading-relaxed italic animate-in fade-in slide-in-from-left-2 duration-500">
                    "{advice}"
                 </p>
               )}
            </div>

            <div className="space-y-2">
               <button className="w-full py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#86868B] hover:text-white hover:bg-white/10 transition-all flex items-center justify-between px-4 group">
                  Actionable Next Step <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
               </button>
               <button className="w-full py-3 bg-glow-blue/10 border border-glow-blue/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-glow-blue hover:shadow-[0_0_15px_rgba(0,242,255,0.2)] transition-all flex items-center justify-between px-4 group">
                  Apply Intelligence <Zap className="w-3 h-3" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-2xl transition-all duration-500 transform active:scale-90 pointer-events-auto group relative",
          isOpen 
            ? "bg-white border-white rotate-90" 
            : "bg-[#101010] border-white/10 hover:border-glow-blue/50 hover:shadow-[0_0_30px_rgba(0,242,255,0.3)]"
        )}
      >
        {isOpen ? (
           <ZapIcon className="w-6 h-6 text-black" />
        ) : (
           <>
              <Sparkles className="w-6 h-6 text-glow-blue group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-glow-purple rounded-full border-2 border-[#101010] animate-pulse" />
           </>
        )}
      </button>
    </div>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
