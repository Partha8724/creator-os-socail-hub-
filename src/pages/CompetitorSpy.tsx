import React, { useState } from 'react';
import { Target, Search, Users, Activity, ExternalLink, RefreshCw, Layers, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CompetitorSpy() {
   const [competitorUrl, setCompetitorUrl] = useState('');
   const [isScanning, setIsScanning] = useState(false);
   const [results, setResults] = useState<any>(null);

   const handleScan = (e: React.FormEvent) => {
      e.preventDefault();
      if (!competitorUrl) return;

      setIsScanning(true);
      setResults(null);

      setTimeout(() => {
         setIsScanning(false);
         setResults({
            channel: 'Rival Creator',
            subscriberDelta: '+12.5k / mo',
            avgViews: '245k',
            viralTopics: ['Micro-SaaS', 'AI Agents', 'Cursor IDE'],
            gaps: [
               'Lacks beginner-friendly tutorials',
               'Low engagement in comment section',
               'Shorts strategy is inconsistent'
            ],
            topVideos: [
               { title: 'Why I stopped using VS Code', views: '1.2M', score: 98 },
               { title: 'The 2026 AI Stack', views: '850K', score: 85 },
            ]
         });
      }, 3000);
   };

   return (
      <div className="font-sans selection:bg-glow-purple/30 selection:text-white pb-24 relative animate-in fade-in duration-700">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
         
         <header className="mb-10 relative z-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <div>
               <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-[#F5F5F7] flex items-center gap-3">
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                  Competitor Spy
               </h1>
               <p className="text-[#A1A1A6] font-medium">Reverse-engineer rival strategies and uncover algorithmic blind spots.</p>
            </div>
         </header>

         <div className="grid lg:grid-cols-12 gap-8 relative z-10">
            <div className="lg:col-span-5 space-y-6">
               <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8">
                  <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-4">Target Identity Node (Channel URL)</label>
                  <form onSubmit={handleScan}>
                     <div className="relative mb-6">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                        <input 
                           type="text" 
                           value={competitorUrl}
                           onChange={e=>setCompetitorUrl(e.target.value)}
                           placeholder="https://youtube.com/@competitor" 
                           className="w-full bg-[#000] border border-white/10 p-5 pl-14 text-sm font-medium focus:border-red-500/50 focus:outline-none transition-all rounded-2xl text-white"
                        />
                     </div>
                     <button 
                        type="submit"
                        disabled={isScanning || !competitorUrl}
                        className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 rounded-2xl disabled:opacity-50 group hover:border-red-500/50"
                     >
                        {isScanning ? <Cpu className="w-4 h-4 animate-spin text-red-500" /> : <Target className="w-4 h-4 group-hover:text-red-500" />}
                        {isScanning ? 'Breaching Defenses...' : 'Initiate Deep Scan'}
                     </button>
                  </form>
               </div>
            </div>

            <div className="lg:col-span-7">
               <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12 min-h-[500px] flex flex-col">
                  {!results && !isScanning && (
                     <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <Activity className="w-16 h-16 text-[#333] mb-6" />
                        <h3 className="text-xl font-bold text-white mb-2">Awaiting Target Data</h3>
                        <p className="text-[#A1A1A6] text-sm max-w-sm">Input a competitor's URL to intercept their growth blueprint and uncover content gaps.</p>
                     </div>
                  )}

                  {isScanning && (
                     <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                           <div className="absolute inset-0 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin duration-[3000ms]" />
                           <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F5F5F7] animate-pulse">Decrypting Rival Matrix...</p>
                     </div>
                  )}

                  {results && !isScanning && (
                     <AnimatePresence>
                        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="space-y-8">
                           <div className="flex justify-between items-end border-b border-white/5 pb-6">
                              <div>
                                 <h2 className="text-3xl font-black text-white">{results.channel}</h2>
                                 <p className="text-sm text-[#A1A1A6] mt-2 flex items-center gap-2"><Users className="w-4 h-4" /> Avg Views: <span className="text-glow-blue font-bold">{results.avgViews}</span></p>
                              </div>
                              <div className="text-right">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B] block mb-1">Subscriber Velocity</span>
                                 <span className="text-xl font-black text-green-500">{results.subscriberDelta}</span>
                              </div>
                           </div>

                           <div>
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-glow-blue mb-4">Content Gaps Discovered</h3>
                              <div className="space-y-3">
                                 {results.gaps.map((gap: string, i: number) => (
                                    <div key={i} className="flex gap-4 items-center bg-white/5 p-4 border border-white/10 rounded-2xl">
                                       <span className="text-glow-purple font-bold">0{i+1}</span>
                                       <p className="text-sm font-medium text-white">{gap}</p>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className="grid md:grid-cols-2 gap-6">
                              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                 <h3 className="text-[10px] font-black uppercase tracking-widest text-[#86868B] mb-4">Top Converting Pillars</h3>
                                 <div className="flex flex-wrap gap-2">
                                    {results.viralTopics.map((t: string) => (
                                       <span key={t} className="px-3 py-1 bg-[#000] rounded-xl text-xs font-bold text-white border border-white/10">{t}</span>
                                    ))}
                                 </div>
                              </div>
                              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                 <h3 className="text-[10px] font-black uppercase tracking-widest text-[#86868B] mb-4">Highest Viral Scores</h3>
                                 <div className="space-y-4">
                                    {results.topVideos.map((v: any, i: number) => (
                                       <div key={i} className="flex justify-between items-center group">
                                          <div>
                                             <p className="text-xs font-bold text-white mb-1 group-hover:text-glow-blue transition-colors line-clamp-1">{v.title}</p>
                                             <p className="text-[10px] text-[#A1A1A6] font-medium">{v.views} views</p>
                                          </div>
                                          <div className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center text-[10px] text-green-500 font-bold shrink-0">{v.score}</div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>

                        </motion.div>
                     </AnimatePresence>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
