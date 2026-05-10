import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Zap, Flame, ArrowUpRight, Search, Globe, Filter, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const mockTrends = [
   { id: 1, topic: 'AI Video Generation', volume: 1.2, growth: '+450%', type: 'Tech', platform: 'YouTube', sentiment: 92, timeframe: 'Last 24h' },
   { id: 2, topic: 'Shorts Hook Templates', volume: 850, growth: '+210%', type: 'Creator', platform: 'TikTok, YT Shorts', sentiment: 88, timeframe: 'Last 3 Days' },
   { id: 3, topic: 'Micro-SaaS 2026', volume: 420, growth: '+120%', type: 'Business', platform: 'X, LinkedIn', sentiment: 75, timeframe: 'Last Week' },
   { id: 4, topic: 'Aesthetic Desk Setups', volume: 2.5, growth: '+85%', type: 'Lifestyle', platform: 'Instagram', sentiment: 95, timeframe: 'Last Month' },
   { id: 5, topic: 'Cursor IDE Tips', volume: 680, growth: '+620%', type: 'Coding', platform: 'YouTube', sentiment: 98, timeframe: 'Last 24h' },
];

export default function TrendEngine() {
   const [search, setSearch] = useState('');
   const [activeFilter, setActiveFilter] = useState('All');
   const [trends, setTrends] = useState(mockTrends);

   useEffect(() => {
      setTrends(mockTrends.filter(t => 
         (activeFilter === 'All' || t.platform.includes(activeFilter) || t.type.includes(activeFilter)) &&
         (t.topic.toLowerCase().includes(search.toLowerCase()))
      ));
   }, [search, activeFilter]);

   return (
      <div className="animate-in fade-in duration-700 font-sans selection:bg-glow-blue/30 selection:text-white pb-24 relative">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-glow-blue/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0" />
         
         <header className="mb-12 relative z-10">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-[#F5F5F7] flex items-center gap-3">
               <Flame className="w-8 h-8 text-red-500" />
               Live Trend Engine
            </h1>
            <p className="text-[#A1A1A6] font-medium">Real-time intelligence on viral topics and breakout niches across the web.</p>
         </header>

         <div className="grid lg:grid-cols-12 gap-8 relative z-10">
            <div className="lg:col-span-8 space-y-6">
               <div className="flex gap-4">
                  <div className="flex-1 relative">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                     <input 
                        type="text" 
                        value={search}
                        onChange={e=>setSearch(e.target.value)}
                        placeholder="Search for niches, topics, or keywords..." 
                        className="w-full bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.5)] rounded-[2rem] py-5 pl-14 pr-6 text-[#F5F5F7] placeholder-[#86868B] font-bold outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all"
                     />
                  </div>
                  <button className="px-8 bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] text-white font-black tracking-widest text-sm rounded-[2rem] hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 shadow-[0_8_32px_rgba(0,0,0,0.5)] uppercase">
                     <Filter className="w-4 h-4" /> Filters
                  </button>
               </div>

               <div className="flex gap-2 bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] p-2 rounded-2xl w-fit shadow-[0_4_24px_rgba(0,0,0,0.5)] overflow-x-auto hide-scrollbar">
                  {['All', 'YouTube', 'TikTok', 'Instagram', 'Tech', 'Creator'].map(filter => (
                     <button 
                        key={filter}
                        onClick={() => setActiveFilter(filter)} 
                        className={`px-5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeFilter === filter ? 'bg-white/10 text-white' : 'text-[#86868B] hover:text-white'}`}
                     >
                        {filter}
                     </button>
                  ))}
               </div>

               <div className="space-y-4">
                  <AnimatePresence>
                     {trends.map((trend, i) => (
                        <motion.div 
                           key={trend.id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           transition={{ delay: i * 0.05 }}
                           className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.5)] rounded-[2rem] p-6 hover:border-red-500/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                        >
                           <div className="flex-1 flex items-center gap-6">
                              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl text-[#A1A1A6] group-hover:text-red-500 group-hover:bg-red-500/10 transition-colors">
                                 #{i+1}
                              </div>
                              <div>
                                 <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">{trend.topic}</h3>
                                 <div className="flex gap-4 mt-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868B]">{trend.platform}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#86868B]">{trend.type}</span>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-8 md:gap-12 shrink-0">
                              <div className="text-right">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868B] mb-1">Search Vol</p>
                                 <p className="text-lg font-black text-white">{typeof trend.volume === 'number' && trend.volume > 10 ? `${trend.volume}K` : `${trend.volume}M`}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-[#86868B] mb-1">Velocity</p>
                                 <p className="text-lg font-black text-green-500 flex items-center gap-1"><ArrowUpRight className="w-4 h-4" /> {trend.growth}</p>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
               <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6 flex items-center gap-2">
                     <Globe className="w-4 h-4 text-glow-blue" />
                     Global Context
                  </h3>
                  <div className="space-y-6">
                     <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <span className="text-4xl font-black text-white block mb-1">94%</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Video Content Dominance</span>
                        <p className="text-xs text-[#A1A1A6] font-medium mt-3 leading-relaxed">Short-form video continues to eat human attention. Average watch time per user is up 12% MoM globally.</p>
                     </div>
                     <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <span className="text-4xl font-black text-white block mb-1">AI</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-glow-purple">Fastest Growing Niche</span>
                        <p className="text-xs text-[#A1A1A6] font-medium mt-3 leading-relaxed">Topics related to AI tool pipelines and automated workflows are seeing 6x higher CTR than standard tech videos.</p>
                     </div>
                  </div>
               </div>
               
               <button className="w-full py-5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 font-black uppercase tracking-[0.2em] text-[11px] transition-all rounded-[2rem] flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                  <Zap className="w-4 h-4" /> Generate Ideas from Trends
               </button>
            </div>
         </div>
      </div>
   );
}
