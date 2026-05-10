import React, { useState } from 'react';
import { Layers, Layout, Image as ImageIcon, Zap, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
import { useNotify } from '@/src/contexts/NotificationContext';
import { gemini } from '@/src/services/gemini';
import { motion, AnimatePresence } from 'motion/react';

export default function MetaSuite() {
   const [mode, setMode] = useState<'reels' | 'carousel' | 'ad'>('carousel');
   const [topic, setTopic] = useState('');
   const [isGenerating, setIsGenerating] = useState(false);
   const [result, setResult] = useState<any>(null);
   const { notify } = useNotify();
   const [copied, setCopied] = useState(false);

   const handleGenerate = async () => {
      if (!topic) {
         notify('Please provide a context or topic.', 'error');
         return;
      }

      setIsGenerating(true);
      setResult(null);

      let prompt = '';
      if (mode === 'carousel') {
         prompt = `Act as an expert Instagram creator. Generate a 5-6 slide Carousel structure for the topic: "${topic}". Return a valid JSON array of objects, where each object has "slide_number", "visual_concept", and "text_copy".`;
      } else if (mode === 'reels') {
         prompt = `Act as a viral Reels strategist. Generate a structured script for the topic: "${topic}". Return JSON with keys "hook" (first 3s), "body" (the core value), "call_to_action", and "recommended_audio" (vibe description).`;
      } else {
         prompt = `Act as an elite media buyer. Generate high-converting Facebook Ad copy for "${topic}". Return JSON with keys "primary_text", "headline", "description", and "creative_concept".`;
      }

      try {
         const resp = await gemini.generateContent(prompt);
         const parsed = JSON.parse(resp.replace(/```json|```/g, '').trim());
         setResult(parsed);
         notify('Meta assets successfully generated.', 'success');
      } catch (err: any) {
         notify('Failed to generate. ' + err.message, 'error');
         setResult(`Error: Could not parse. Simulated result fallback...`);
      } finally {
         setIsGenerating(false);
      }
   };

   const copyText = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(()=>setCopied(false), 2000);
      notify('Copied to clipboard', 'success');
   };

   return (
      <div className="font-sans selection:bg-glow-purple/30 selection:text-white pb-24 relative animate-in fade-in duration-700">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
         
         <header className="mb-10 relative z-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div>
               <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-[#F5F5F7] flex items-center gap-3">
                  <Layers className="w-8 h-8 text-pink-500" />
                  Meta Suite
               </h1>
               <p className="text-[#A1A1A6] font-medium">Instagram Carousel Generator, Reels Optimizer, & FB Ad Forge.</p>
            </div>
            
            <div className="flex bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] p-1.5 rounded-2xl w-fit shadow-[0_4_24px_rgba(0,0,0,0.5)]">
               <button onClick={()=>setMode('carousel')} className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${mode === 'carousel' ? 'bg-white/10 text-white' : 'text-[#86868B] hover:text-white'}`}>Carousels</button>
               <button onClick={()=>setMode('reels')} className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${mode === 'reels' ? 'bg-white/10 text-pink-500' : 'text-[#86868B] hover:text-pink-500'}`}>Reels AI</button>
               <button onClick={()=>setMode('ad')} className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${mode === 'ad' ? 'bg-white/10 text-blue-500' : 'text-[#86868B] hover:text-blue-500'}`}>FB Ads</button>
            </div>
         </header>

         <div className="grid lg:grid-cols-12 gap-8 relative z-10">
            <div className="lg:col-span-4 space-y-6">
               <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8">
                  <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-4">Topic or Value Proposition</label>
                  <textarea 
                     value={topic}
                     onChange={(e)=>setTopic(e.target.value)}
                     placeholder="What should the content focus on?" 
                     className="w-full bg-[#000] border border-white/10 p-5 text-sm font-medium focus:border-pink-500/50 focus:outline-none transition-all min-h-[150px] resize-none rounded-2xl text-white mb-6"
                  />
                  <button 
                     onClick={handleGenerate}
                     disabled={isGenerating || !topic}
                     className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 rounded-2xl disabled:opacity-50"
                  >
                     {isGenerating ? <Zap className="w-4 h-4 animate-bounce text-pink-500" /> : <Sparkles className="w-4 h-4" />}
                     {isGenerating ? 'Synthesizing...' : 'Generate Assets'}
                  </button>
               </div>
            </div>

            <div className="lg:col-span-8">
               <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12 min-h-[500px] flex flex-col">
                  {!result && !isGenerating && (
                     <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <ImageIcon className="w-16 h-16 text-[#333] mb-6" />
                        <h3 className="text-xl font-bold text-white mb-2">Awaiting Context</h3>
                        <p className="text-[#A1A1A6] text-sm">Enter your topic and let the AI generate platform-ready assets.</p>
                     </div>
                  )}

                  {isGenerating && (
                     <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-32 h-1 bg-[#151515] overflow-hidden rounded-full mb-8">
                           <motion.div initial={{x:'-100%'}} animate={{x:'100%'}} transition={{duration:1, repeat:Infinity, ease:'linear'}} className="h-full w-1/2 bg-gradient-to-r from-pink-500 to-blue-500" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F5F5F7] animate-pulse">Designing specific formats...</p>
                     </div>
                  )}

                  {result && !isGenerating && (
                     <AnimatePresence>
                        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="space-y-6">
                           {typeof result === 'string' ? (
                              <p className="text-red-500">{result}</p>
                           ) : Array.isArray(result) ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 {result.map((slide, i) => (
                                    <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
                                       <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B] mb-4">Slide {slide.slide_number || i+1}</span>
                                       <button onClick={() => copyText(slide.text_copy)} className="mb-4">
                                          <p className="text-sm text-white font-medium hover:text-pink-400 transition-colors text-left">{slide.text_copy}</p>
                                       </button>
                                       <div className="mt-auto pt-4 border-t border-white/5">
                                          <p className="text-[10px] text-[#A1A1A6] uppercase tracking-widest">Visual: {slide.visual_concept}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           ) : (
                              <div className="space-y-6">
                                 {Object.entries(result).map(([k, v]) => (
                                    <div key={k} className="p-6 bg-white/5 border border-white/10 rounded-2xl group cursor-pointer hover:border-white/20 transition-all" onClick={() => copyText(v as string)}>
                                       <div className="flex justify-between items-center mb-2">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">{k.replace(/_/g, ' ')}</span>
                                          <Copy className="w-3 h-3 text-[#555] group-hover:text-white transition-colors" />
                                       </div>
                                       <p className="text-sm font-medium text-white whitespace-pre-wrap">{v as string}</p>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </motion.div>
                     </AnimatePresence>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
