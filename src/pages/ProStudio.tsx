import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  PenTool, 
  Image as ImageIcon, 
  Lightbulb, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  ChevronRight,
  TrendingUp,
  Target,
  Layout,
  Cpu,
  Type
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNotify } from '@/src/contexts/NotificationContext';
import { useUser } from '@/src/contexts/UserContext';

import { gemini } from '@/src/services/gemini';

type StudioMode = 'script' | 'thumbnail' | 'ideas';

export default function ProStudio() {
  const { profile } = useUser();
  const { notify } = useNotify();
  const [mode, setMode] = useState<StudioMode>('script');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isFree = profile?.tier === 'free';

  const handleGenerate = async () => {
    if (isFree) {
      notify("Upgrade to Smart Premium or Pro to access the Neural Studio.", "error", "Access Denied");
      return;
    }
    
    if (!topic.trim()) {
      notify("Topic node is required for creative synthesis.", "error", "Input Error");
      return;
    }
    
    setIsGenerating(true);
    setResult(null);
    notify(`Synthesizing intelligence for ${mode.toUpperCase()}...`, 'smart', 'Core Active');
    
    try {
      let prompt = "";
      if (mode === 'ideas') {
        prompt = `Act as an elite viral content strategist for ${platform}.
I want to create content about: "${topic}".
Generate 5 viral content ideas.
Return ONLY valid JSON in this exact structure:
{
  "ideas": [
    { "title": "Catchy viral title", "angle": "Unique angle / why it works", "difficulty": "Easy" }
  ]
}
Note: difficulty must be "Easy", "Med", or "Hard".`;
      } else if (mode === 'script') {
        prompt = `Act as an elite retention-focused video scriptwriter for ${platform}.
Topic: "${topic}".
Return ONLY valid JSON in this exact structure:
{
  "hook": "Strong 3-second hook script",
  "intro": "Short intro explaining the value",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "outro": "Strong call to action",
  "estimatedDuration": "3 mins"
}`;
      } else if (mode === 'thumbnail') {
        prompt = `Act as a click-through rate optimization expert for ${platform}.
Topic: "${topic}".
Return ONLY valid JSON in this exact structure:
{
  "concepts": [
    { "text": "Short text on thumbnail", "visual": "Description of the visual elements", "psychology": "Why this makes people click" }
  ]
}`;
      }

      const response = await gemini.generateContent(prompt);
      const parsed = JSON.parse(response.replace(/```json|```/g, '').trim());
      
      setResult(parsed);
      notify("Creative matrix aligned. Deployment ready.", "success", "Process Complete");
    } catch (error: any) {
      notify("Synthesis error. Using fallback matrix.", "error", "Link Broken");
      // Fallback for demo purposes if JSON parsing fails or API errors
      if (mode === 'ideas') {
        setResult({
          ideas: [
            { title: `${topic} Secrets Revealed`, angle: "Curiosity gap", difficulty: "Easy" },
            { title: `I tried ${topic} for 30 days`, angle: "Challenge format", difficulty: "Med" },
            { title: `${topic} vs Competitor`, angle: "Comparison", difficulty: "Hard" },
            { title: `The Truth About ${topic}`, angle: "Myth busting", difficulty: "Easy" },
            { title: `Is ${topic} worth it in 2026?`, angle: "Timely review", difficulty: "Med" }
          ]
        });
      } else if (mode === 'script') {
        setResult({
          hook: "Stop scrolling, because this changes everything.",
          intro: "Today we are diving into " + topic,
          keyPoints: ["Secret 1", "Secret 2", "Secret 3"],
          outro: "Hit subscribe for more algorithm hacks.",
          estimatedDuration: "2 mins"
        });
      } else {
        setResult({
          concepts: [
            { text: "WTF", visual: "Wide eyes looking left", psychology: "Extreme shock" },
            { text: "DO NOT DO THIS", visual: "Red X over a phone", psychology: "Fear of missing out" }
          ]
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    notify(`${field} saved to neural buffer.`, "success");
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 relative font-sans selection:bg-glow-purple/30 selection:text-white pb-24">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-glow-blue/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-glow-purple/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0" />
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 uppercase premium-glow-text">Creator Studio</h1>
          <p className="text-[#A1A1A6] font-medium text-xs md:text-sm tracking-widest uppercase italic">Neural Creative Command Center</p>
        </div>
        
        <div className="flex bg-[#101010]/80 backdrop-blur-xl p-1.5 border border-white/[0.08] rounded-2xl shadow-[0_4_24px_rgba(0,0,0,0.5)]">
           {(['script', 'thumbnail', 'ideas'] as const).map(m => (
             <button
               key={m}
               onClick={() => { setMode(m); setResult(null); }}
               className={cn(
                 "px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl",
                 mode === m ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "text-[#86868B] hover:text-white"
               )}
             >
               {m === 'script' ? 'Neural Script' : m === 'thumbnail' ? 'Thumb Lab' : 'Viral Ideas'}
             </button>
           ))}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        {/* Control Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-10 space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               {mode === 'script' ? <PenTool size={100} /> : mode === 'thumbnail' ? <ImageIcon size={100} /> : <Lightbulb size={100} />}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block">Base Topic / Concept</label>
              <textarea 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isFree}
                placeholder={mode === 'script' ? "What is the core message of your video?" : "What is the thumbnail about?"}
                className={cn(
                  "w-full bg-[#000] border border-white/10 p-5 text-sm font-medium focus:border-glow-blue/50 focus:outline-none transition-all min-h-[120px] resize-none",
                  isFree && "opacity-50 cursor-not-allowed"
                )}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block">Target Platform</label>
              <div className="grid grid-cols-3 gap-2">
                {['YouTube', 'Shorts', 'Instagram'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={cn(
                      "py-3 text-[10px] font-bold uppercase tracking-widest border transition-all",
                      platform === p ? "bg-white/5 border-white/20 text-white" : "border-white/5 text-[#A1A1A6] hover:border-white/10"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
               onClick={handleGenerate}
               disabled={isGenerating || !topic.trim()}
               className="w-full py-5 bg-glow-blue/10 hover:bg-glow-blue/20 border border-glow-blue/30 text-glow-blue font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 relative overflow-hidden"
            >
               {isGenerating ? (
                 <>
                   <Cpu className="w-4 h-4 animate-spin" />
                   Aligning Matrix...
                 </>
               ) : (
                 <>
                   <Sparkles className="w-4 h-4" />
                   Generate Intelligence
                 </>
               )}
            </button>
          </div>

          <div className="bg-[#101010]/50 backdrop-blur-xl border border-glow-purple/20 shadow-[0_4_24px_rgba(188,19,254,0.1)] rounded-[2rem] p-8">
            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#F5F5F7] mb-4">
               <TrendingUp className="w-4 h-4 text-glow-purple" /> Creator Insights
            </h4>
            <p className="text-[11px] text-[#86868B] leading-relaxed italic border-l-2 border-glow-purple/30 pl-4 font-medium">
               "High-retention content starts with a pattern interrupt within the first 3 seconds. Use the Neural Script Hook to lock in viewers."
            </p>
          </div>
        </div>

        {/* Output Display */}
        <div className="xl:col-span-8">
           <AnimatePresence mode="wait">
              {!result && !isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[3rem] h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8 rotate-3">
                     <Layout className="w-8 h-8 text-[#A1A1A6]" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-[#F5F5F7] mb-3">Awaiting Creative Node</h3>
                  <p className="text-sm font-medium text-[#A1A1A6] max-w-sm lowercase">"Your next viral masterpiece begins with a single data point. Input your topic to synthesize its structure."</p>
                </motion.div>
              )}

              {isGenerating && (
                <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[3rem] h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12"
                >
                   <div className="w-32 h-1 bg-[#151515] overflow-hidden rounded-full mb-8">
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-full w-1/2 bg-glow-blue shadow-[0_0_15px_#00f2ff]"
                      />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F5F5F7] animate-pulse">Processing Advanced Heuristics...</p>
                </motion.div>
              )}

              {result && mode === 'script' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-[#101010]/80 backdrop-blur-xl border border-glow-blue/30 shadow-[0_8_32px_rgba(0,242,255,0.1)] rounded-[2rem] p-8">
                        <div className="flex justify-between items-center mb-6">
                           <span className="text-[10px] font-black uppercase tracking-widest text-glow-blue">Retention Hook</span>
                           <button onClick={() => copyToClipboard(result.hook, 'hook')} className="text-[#86868B] hover:text-white transition-colors p-2 bg-white/5 rounded-xl"><Copy size={16} /></button>
                        </div>
                        <p className="text-xl font-black text-white italic leading-relaxed">"{result.hook}"</p>
                     </div>
                     <div className="bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-8 shadow-[0_8_32px_rgba(0,0,0,0.5)]">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B] block mb-4">Architectural Intro</span>
                        <p className="text-sm text-[#F5F5F7] font-medium leading-relaxed">{result.intro}</p>
                     </div>
                  </div>

                  <div className="bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-8 shadow-[0_8_32px_rgba(0,0,0,0.5)] mt-6">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                           <Type className="w-4 h-4 text-glow-purple" />
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-[#F5F5F7]">Visual Beat Points</h4>
                        </div>
                        <span className="text-[10px] font-bold text-glow-purple bg-glow-purple/10 px-2 py-0.5 border border-glow-purple/30">Target: {result.estimatedDuration}</span>
                     </div>
                     <div className="space-y-4">
                        {result.keyPoints.map((point: string, i: number) => (
                           <div key={i} className="flex gap-4 group">
                              <span className="text-[10px] font-black text-glow-blue/40 pt-1">[{String(i+1).padStart(2, '0')}]</span>
                              <p className="text-sm font-medium text-[#A1A1A6] group-hover:text-white transition-colors">{point}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-[#101010]/50 backdrop-blur-md border border-emerald-500/30 rounded-[2rem] p-8 shadow-[0_4_24px_rgba(16,185,129,0.1)] mt-6">
                     <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 block mb-2">Conversion Outro</span>
                     <p className="text-sm text-emerald-500/80 font-bold italic">"{result.outro}"</p>
                  </div>
                </motion.div>
              )}

              {result && mode === 'thumbnail' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 gap-6"
                >
                  {result.concepts.map((concept: any, i: number) => (
                    <div key={i} className="bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] shadow-[0_8_32px_rgba(0,0,0,0.5)] p-0 overflow-hidden flex flex-col md:flex-row hover:border-glow-blue/30 transition-all duration-300 group">
                       <div className="w-full md:w-64 aspect-video bg-[#000] border-r border-white/10 flex items-center justify-center p-8 text-center relative overflow-hidden shrink-0">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                          <p className="text-lg font-black text-white leading-tight uppercase group-hover:scale-110 transition-transform">"{concept.text}"</p>
                       </div>
                       <div className="p-8 flex flex-col justify-center gap-4">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-glow-blue block mb-1">Visual Architecture</span>
                            <p className="text-sm font-medium text-[#F5F5F7]">{concept.visual}</p>
                          </div>
                          <div className="pt-4 border-t border-white/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-glow-purple block mb-1">Psychological Trigger</span>
                            <p className="text-xs text-[#A1A1A6] italic">"{concept.psychology}"</p>
                          </div>
                       </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {result && mode === 'ideas' && (
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="space-y-4"
                >
                   {result.ideas.map((idea: any, i: number) => (
                     <div key={i} className="bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] shadow-[0_8_32px_rgba(0,0,0,0.5)] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-white/[0.02] hover:border-glow-blue/30 transition-all duration-300">
                        <div className="flex-1 space-y-2">
                           <h4 className="text-lg font-black text-white group-hover:text-glow-blue transition-colors leading-tight">{idea.title}</h4>
                           <p className="text-xs font-medium text-[#A1A1A6] italic leading-relaxed">{idea.angle}</p>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                           <div className={cn(
                             "px-3 py-1 text-[9px] font-black uppercase tracking-widest border",
                             idea.difficulty === 'Easy' ? "text-emerald-500 border-emerald-500/30 bg-emerald-500/5" :
                             idea.difficulty === 'Med' ? "text-amber-500 border-amber-500/30 bg-amber-500/5" :
                             "text-red-500 border-red-500/30 bg-red-500/5"
                           )}>
                             {idea.difficulty} Execution
                           </div>
                           <button className="p-3 bg-white/5 hover:bg-glow-blue/20 text-[#A1A1A6] hover:text-white transition-all rounded-xl border border-white/10 hover:border-glow-blue/50">
                              <ChevronRight size={18} />
                           </button>
                        </div>
                     </div>
                   ))}
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
