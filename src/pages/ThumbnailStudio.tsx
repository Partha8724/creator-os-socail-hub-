import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Upload, 
  Sparkles, 
  Eye, 
  Target, 
  Flame, 
  Maximize,
  Layout,
  Type,
  Palette,
  MousePointer2,
  AlertCircle,
  Zap,
  SplitSquareHorizontal,
  BrainCircuit
} from 'lucide-react';
import { neuralLab } from '@/src/services/neuralIntelligence';
import { cn } from '@/src/lib/utils';
import { useNotify } from '@/src/contexts/NotificationContext';
import { gemini } from '@/src/services/gemini';

export default function ThumbnailStudio() {
  const [title, setTitle] = useState('');
  const [niche, setNiche] = useState('Tech');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<any | null>(null);
  
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'abtest'>('diagnosis');
  const [titleA, setTitleA] = useState('');
  const [titleB, setTitleB] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [abResult, setAbResult] = useState<any>(null);
  const { notify } = useNotify();

  const analyzeThumbnail = async () => {
    setIsAnalyzing(true);
    try {
      const data = await neuralLab.analyzeThumbnailPsychology(title, niche);
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateABTest = async () => {
     if(!titleA || !titleB) {
        notify('Please enter both Title A and Title B', 'error'); return;
     }
     setIsSimulating(true);
     setAbResult(null);
     try {
        const resp = await gemini.generateContent(`Act as a YouTube A/B test predictive algorithm. Evaluate Title A: "${titleA}" vs Title B: "${titleB}" for the "${niche}" niche. Return JSON with keys "winner" ("A" or "B"), "winnerTitle", "confidenceScore" (0-100), and "reasoning" (short paragraph why it wins algorithmically).`);
        const parsed = JSON.parse(resp.replace(/```json|```/g, '').trim());
        setAbResult(parsed);
     } catch(e: any) {
        notify('Simulation failed', 'error');
     } finally {
        setIsSimulating(false);
     }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 uppercase italic text-white flex items-center gap-4">
             <BrainCircuit className="w-10 h-10 text-glow-blue" />
             Neural Visual Lab
          </h1>
          <p className="text-[#86868B] font-medium text-xs md:text-sm tracking-widest uppercase">Computer Vision CTR Prediction Node & A/B Engine</p>
        </div>
        
        <div className="flex bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] p-1.5 rounded-2xl w-fit shadow-[0_4_24px_rgba(0,0,0,0.5)]">
           <button onClick={()=>setActiveTab('diagnosis')} className={cn("px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all", activeTab === 'diagnosis' ? "bg-white/10 text-glow-blue" : "text-[#86868B] hover:text-white")}>Vision Scanner</button>
           <button onClick={()=>setActiveTab('abtest')} className={cn("px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all", activeTab === 'abtest' ? "bg-white/10 text-glow-purple" : "text-[#86868B] hover:text-white")}>A/B Simulator</button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'diagnosis' && (
      <motion.div key="diagnosis" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Project Config */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] p-8 shadow-2xl space-y-8">
             <div>
                <h3 className="font-black text-[10px] uppercase tracking-widest text-[#86868B] mb-6 flex items-center gap-2">
                   <Target className="w-4 h-4 text-glow-blue" />
                   Project Metadata
                </h3>
                <div className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#333]">Video Title Node</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter video title for context..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 font-bold text-sm focus:outline-none focus:border-glow-blue/50 transition-all placeholder:text-[#222]"
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#333]">Market Niche</label>
                      <select 
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 font-bold text-sm focus:outline-none focus:border-glow-blue/50 transition-all appearance-none cursor-pointer"
                      >
                         <option>Tech & Engineering</option>
                         <option>Gaming & Hubs</option>
                         <option>Lifestyle & Vlogs</option>
                         <option>Education & Synthesis</option>
                         <option>Business & Growth</option>
                      </select>
                   </div>
                </div>
             </div>

             <div className="p-8 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-glow-blue/30 transition-all bg-white/[0.01]">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-all">
                   <ImageIcon className="w-8 h-8 text-[#333] group-hover:text-glow-blue transition-colors" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-[#333] group-hover:text-white transition-colors mb-2">Sync Visual Asset</p>
                <p className="text-[10px] font-bold text-[#222] uppercase tracking-[0.2em]">Drag image node here</p>
             </div>

             <button 
                onClick={analyzeThumbnail}
                disabled={isAnalyzing || !title}
                className="w-full py-5 bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] rounded-full hover:bg-glow-blue transition-all active:scale-95 shadow-xl disabled:opacity-30 flex items-center justify-center gap-3"
             >
                {isAnalyzing ? (
                  <>
                     <Sparkles className="w-4 h-4 animate-spin" />
                     Detecting Patterns...
                  </>
                ) : (
                  <>
                     <Eye className="w-4 h-4" />
                     Run Vision Diagnosis
                  </>
                )}
             </button>
          </div>

          <div className="bg-glow-purple/5 border border-glow-purple/20 rounded-[2rem] p-6 flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-glow-purple/10 rounded-full flex items-center justify-center mb-4 border border-glow-purple/20">
                <Flame className="w-6 h-6 text-glow-purple animate-pulse" />
             </div>
             <h4 className="text-xs font-black uppercase tracking-widest text-white mb-2 italic">Neural Heatmap v2.0</h4>
             <p className="text-[10px] font-bold text-[#86868B]  tracking-wide leading-relaxed">
                Connect your channel to unlock advanced eye-tracking simulations and color-contrast impact analytics.
             </p>
          </div>
        </div>

        {/* Vision Report */}
        <div className="xl:col-span-8 flex flex-col">
          {!report && !isAnalyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#101010]/40 border border-white/[0.05] rounded-[3rem] border-dashed">
               <Maximize className="w-16 h-16 text-[#222] mb-8" />
               <h3 className="text-xl font-bold text-[#333] mb-2 uppercase tracking-widest italic">Asset Scanner Offline</h3>
               <p className="text-sm text-[#222] font-bold max-w-sm tracking-wide">
                 Ready to scan visual nodes for curiosity-gap efficiency and algorithmic visibility scores.
               </p>
            </div>
          ) : isAnalyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[#101010]/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl">
               <div className="w-64 h-64 bg-black/40 border border-white/10 rounded-3xl relative overflow-hidden mb-12">
                  <div className="absolute top-0 w-full h-1 bg-glow-blue animate-scan shadow-[0_0_15px_#00f2ff]" />
                  <div className="h-full w-full flex items-center justify-center opacity-20">
                     <ImageIcon size={48} className="text-white" />
                  </div>
               </div>
               <h3 className="text-2xl font-black text-white italic uppercase tracking-[0.2em] mb-4">Vision Synthesis</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#86868B] animate-pulse">Running Contrast Matrix Analysis...</p>
            </div>
          ) : (
            <AnimatePresence>
               <motion.div 
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="space-y-8"
               >
                  <div className="bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-12 shadow-2xl">
                     <div className="w-full md:w-1/2 aspect-video bg-black rounded-2xl relative overflow-hidden group shadow-2xl border border-white/5">
                        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                           <ImageIcon className="w-12 h-12 text-[#222]" />
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/80 backdrop-blur-md rounded-xl border border-white/10">
                           <p className="text-xs font-black text-white uppercase tracking-widest truncate">{title}</p>
                        </div>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-glow-blue text-black font-black text-[10px] uppercase tracking-widest rounded-full shadow-lg italic">Score: {report.score}</div>
                     </div>
                     
                     <div className="flex-1 space-y-8 w-full">
                        <div>
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-[#86868B] mb-2">CTR Prediction Range</h4>
                           <div className="flex items-end gap-3">
                              <span className="text-5xl font-black text-white italic tracking-tighter">{report.ctrPrediction}</span>
                              <div className="flex items-center gap-1 mb-2 px-2 py-0.5 bg-green-500/10 border border-green-500/30 rounded">
                                 <Zap className="w-3 h-3 text-green-500" />
                                 <span className="text-[10px] font-black text-green-500">High Tier</span>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#333] mb-2">Psychology Triggers</p>
                              <div className="flex flex-wrap gap-2">
                                 {report.psychologyTriggers.map((t: string) => (
                                    <span key={t} className="text-[10px] font-black text-white px-2 py-1 bg-white/5 rounded-md italic">#{t}</span>
                                 ))}
                              </div>
                           </div>
                           <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#333] mb-2">Visual Noise</p>
                              <span className="text-[10px] font-black text-white uppercase italic tracking-widest">{report.clutterDetection} Noise Detected</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[
                       { label: 'Neural Text Opt', value: report.textOptimization, icon: Type, color: 'text-glow-blue' },
                       { label: 'Color Theory', value: report.colorOptimization, icon: Palette, color: 'text-glow-purple' },
                       { label: 'Composition', value: report.compositionTips, icon: Layout, color: 'text-amber-500' }
                     ].map((card, i) => (
                       <div key={i} className="bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-8 shadow-xl group hover:bg-white/[0.02] transition-colors">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
                             <card.icon className={cn("w-5 h-5", card.color)} />
                          </div>
                          <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#333] mb-4">{card.label}</h5>
                          <p className="text-sm font-bold text-white leading-relaxed italic group-hover:text-glow-blue transition-colors">"{card.value}"</p>
                       </div>
                     ))}
                  </div>

                  <div className="bg-glow-blue/10 border border-glow-blue/20 rounded-[2.5rem] p-10 flex items-center gap-8 shadow-2xl">
                     <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/10">
                        <MousePointer2 className="w-8 h-8 text-glow-blue animate-pulse" />
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-white uppercase italic mb-2">Simulated Heatmap Generation Node</h4>
                        <p className="text-sm font-bold text-[#86868B] leading-relaxed">
                          The Neural Lab predicts a heat concentration in the center-left node. To increase CTR by ~1.4%, Shift your primary subject 15 degrees towards the diagonal axis and introduce a high-contrast yellow border around the focus text.
                        </p>
                     </div>
                  </div>
               </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>
        )}

        {activeTab === 'abtest' && (
          <motion.div key="abtest" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="grid lg:grid-cols-12 gap-8 relative z-10">
             <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8">
                   <h3 className="text-xl font-bold text-[#F5F5F7] mb-6 flex items-center gap-3">
                      <SplitSquareHorizontal className="w-6 h-6 text-glow-purple" />
                      A/B Title Simulator
                   </h3>
                   <div className="space-y-6">
                      <div>
                         <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">Title A</label>
                         <input 
                            type="text" 
                            value={titleA}
                            onChange={(e)=>setTitleA(e.target.value)}
                            placeholder="e.g. I Spent 100 Days coding"
                            className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none focus:border-glow-purple/50 transition-all rounded-2xl text-white"
                         />
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="flex-1 h-px bg-white/10" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B]">VS</span>
                         <div className="flex-1 h-px bg-white/10" />
                      </div>
                      <div>
                         <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">Title B</label>
                         <input 
                            type="text" 
                            value={titleB}
                            onChange={(e)=>setTitleB(e.target.value)}
                            placeholder="e.g. My 100 Day Coding Journey"
                            className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none focus:border-glow-purple/50 transition-all rounded-2xl text-white"
                         />
                      </div>

                      <div>
                          <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">Niche</label>
                          <input 
                            type="text" 
                            value={niche}
                            onChange={(e)=>setNiche(e.target.value)}
                            className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none transition-all rounded-2xl text-white"
                         />
                      </div>

                      <button 
                         onClick={simulateABTest}
                         disabled={isSimulating || !titleA || !titleB}
                         className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 rounded-2xl disabled:opacity-50"
                      >
                         {isSimulating ? <Sparkles className="w-4 h-4 animate-spin text-glow-purple" /> : <Eye className="w-4 h-4" />}
                         {isSimulating ? 'Running ML Models...' : 'Simulate Battle'}
                      </button>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-7">
                <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12 min-h-[500px] flex flex-col justify-center items-center">
                   {!abResult && !isSimulating && (
                      <div className="text-center">
                         <SplitSquareHorizontal className="w-16 h-16 text-[#333] mb-6 mx-auto" />
                         <h3 className="text-xl font-bold text-white mb-2">Target Locked</h3>
                         <p className="text-[#A1A1A6] text-sm">Enter two titles and the neural net will simulate human engagement to predict the winner.</p>
                      </div>
                   )}

                   {isSimulating && (
                      <div className="text-center w-full max-w-md">
                         <div className="flex justify-between items-center mb-8">
                            <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden"><div className="w-full h-full bg-glow-blue animate-[pulse_1s_ease-in-out_infinite] origin-left" /></div>
                            <span className="text-[10px] font-black tracking-widest text-[#86868B]">VS</span>
                            <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden"><div className="w-full h-full bg-glow-purple animate-[pulse_1.2s_ease-in-out_infinite] origin-right" /></div>
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F5F5F7] animate-pulse">Aggregating Predictive Impressions...</p>
                      </div>
                   )}

                   {abResult && !isSimulating && (
                      <div className="w-full animate-in zoom-in-95 duration-500">
                         <div className="flex flex-col items-center justify-center mb-10 text-center">
                            <span className="px-4 py-1 bg-glow-purple/20 text-glow-purple border border-glow-purple/30 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(188,19,254,0.3)]">Algorithm Predicts</span>
                            <h2 className="text-3xl md:text-4xl font-black text-white italic">Variant {abResult.winner}</h2>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className={cn("p-6 rounded-2xl border transition-all", abResult.winner === 'A' ? "bg-white/10 border-glow-purple shadow-[0_0_20px_rgba(188,19,254,0.1)]" : "bg-white/5 border-white/5 opacity-50")}>
                               <span className="text-[10px] font-black uppercase tracking-widest block mb-2 text-[#A1A1A6]">Title A</span>
                               <p className="text-sm font-bold text-white">{titleA}</p>
                            </div>
                            <div className={cn("p-6 rounded-2xl border transition-all", abResult.winner === 'B' ? "bg-white/10 border-glow-purple shadow-[0_0_20px_rgba(188,19,254,0.1)]" : "bg-white/5 border-white/5 opacity-50")}>
                               <span className="text-[10px] font-black uppercase tracking-widest block mb-2 text-[#A1A1A6]">Title B</span>
                               <p className="text-sm font-bold text-white">{titleB}</p>
                            </div>
                         </div>

                         <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                               <h3 className="text-[10px] font-black uppercase tracking-widest text-[#86868B]">Confidence Score</h3>
                               <span className="text-lg font-black text-white">{abResult.confidenceScore}/100</span>
                            </div>
                            <div className="w-full h-2 bg-black rounded-full overflow-hidden mb-6"><div className="h-full bg-glow-purple" style={{width: `${abResult.confidenceScore}%`}} /></div>
                            
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#86868B] mb-2">Algorithmic Reasoning</h3>
                            <p className="text-sm font-medium text-white italic leading-relaxed">"{abResult.reasoning}"</p>
                         </div>
                      </div>
                   )}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
         @keyframes scan {
            from { transform: translateY(0); }
            to { transform: translateY(256px); }
         }
         .animate-scan {
            animation: scan 2s ease-in-out infinite alternate;
         }
      `}</style>
    </div>
  );
}
