import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Search, 
  Target, 
  TrendingUp,
  BarChart,
  Youtube,
  Instagram,
  Smartphone,
  Hash,
  AlignLeft,
  Activity,
  AlertTriangle,
  Check
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNotify } from '@/src/contexts/NotificationContext';
import { auth } from '@/src/services/firebase';

interface SEOData {
  title: string;
  viralChance: number;
  description: string;
  tags: string[];
  trends: string[];
  strategy: string;
  lowCompetitionNiches: string[];
  lowCompetitionKeywords: string[];
  viralKeywords: string[];
  viralTitles: string[];
  viralVideoNiches: string[];
}

export default function KeywordIntelligence() {
  const { notify } = useNotify();
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<'YouTube' | 'Facebook' | 'Instagram'>('YouTube');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [seoResult, setSeoResult] = useState<SEOData | null>(null);

  const synthesizeMap = async () => {
    if (!query) {
      notify("Input core topic to generate SEO node.", "error", "Input Error");
      return;
    }
    
    setIsSynthesizing(true);
    setSeoResult(null);
    notify(`Initializing AI intelligence for ${platform}...`, "smart", "Hub Analysis");
    
    try {
      const res = await fetch('/api/seo/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ platform, query })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate SEO intelligence.');
      }

      const data = await res.json();
      setSeoResult(data);
      notify("Algorithm sync complete. SEO Matrix generated.", "success", "Intelligence Acquired");
    } catch (err: any) {
      console.error(err);
      notify(err.message, 'error', "Sync Failed");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 relative z-10 font-sans selection:bg-glow-blue/30 selection:text-white pb-24">
      <header>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 uppercase">SEO Intelligence</h1>
        <p className="text-[#A1A1A6] font-medium text-xs md:text-sm tracking-wide italic leading-relaxed">Centralized Metadata & Viral Growth Node</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 space-y-6">
            <div>
              <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-widest mb-3 block">Target Network</label>
              <div className="flex gap-2">
                {[
                  { name: 'YouTube', icon: Youtube },
                  { name: 'Facebook', icon: Smartphone },
                  { name: 'Instagram', icon: Instagram }
                ].map(p => (
                  <button
                    key={p.name}
                    onClick={() => setPlatform(p.name as any)}
                    className={cn(
                      "flex-1 py-4 flex flex-col items-center gap-2 rounded-2xl border transition-all duration-300 relative overflow-hidden",
                      platform === p.name 
                        ? "bg-glow-blue/10 border-glow-blue/30 text-glow-blue shadow-[0_0_20px_rgba(0,242,255,0.1)]" 
                        : "bg-[#101010] border-white/[0.05] text-[#86868B] hover:border-white/20 hover:text-white"
                    )}
                  >
                    {platform === p.name && (
                      <div className="absolute inset-0 bg-glow-blue/10 animate-pulse pointer-events-none" />
                    )}
                    <p.icon className="w-5 h-5 z-10" />
                    <span className="text-[10px] font-bold uppercase tracking-wider z-10">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-widest block">Root Concept</label>
              <div className="relative">
                 <input 
                   type="text"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder="E.g. AI Coding Agents..."
                   className="w-full bg-[#101010]/50 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-4 font-bold text-sm focus:border-glow-blue/50 focus:bg-[#101010]/80 focus:outline-none transition-colors placeholder:text-white/20"
                 />
                 <Search className="absolute right-4 top-4 w-4 h-4 text-[#A1A1A6]" />
              </div>
            </div>

            <button 
              onClick={synthesizeMap}
              disabled={!query || isSynthesizing}
              className="w-full py-5 bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] hover:border-glow-blue hover:bg-white hover:text-black text-white font-black tracking-widest uppercase text-xs transition-all duration-300 flex items-center justify-center gap-2 rounded-[2rem] shadow-[0_8_32px_rgba(0,0,0,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSynthesizing ? (
                <>
                  <Zap className="w-4 h-4 animate-pulse text-glow-blue" />
                  Processing Matrix...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  Analyze Trends
                </>
              )}
            </button>
          </div>

          <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.5)] rounded-[2rem] p-6">
             <div className="flex gap-3 mb-4">
               <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
               <h4 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F7]">Algorithm Warning</h4>
             </div>
             <p className="text-[11px] text-[#A1A1A6] leading-relaxed font-medium">
               The algorithms favor consistency and high retention. While tags and optimized titles increase surface area, average view duration (AVD) remains the primary trigger for the viral feedback loop.
             </p>
          </div>
        </div>

        <div className="xl:col-span-8">
          <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[3rem] h-full min-h-[500px] p-6 lg:p-10 relative overflow-hidden flex flex-col">
            
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
               <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.1)_0,transparent_70%)]" />
               <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(188,19,254,0.05)_0,transparent_70%)]" />
            </div>

            <AnimatePresence mode="wait">
              {!seoResult && !isSynthesizing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center flex-1 z-10"
                >
                  <Target className="w-16 h-16 text-white/5 mb-6" />
                  <h3 className="text-xl font-black uppercase tracking-tight text-[#F5F5F7] mb-2">Awaiting Parameters</h3>
                  <p className="text-sm font-medium text-[#A1A1A6] max-w-sm">Enter a topic on the left panel to generate algorithm-ready titles, descriptions, and tags.</p>
                </motion.div>
              )}

              {isSynthesizing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center flex-1 z-10"
                >
                  <div className="w-24 h-24 relative flex items-center justify-center mb-8">
                    <div className="absolute inset-0 border-t-2 border-glow-blue rounded-full animate-spin" />
                    <div className="absolute inset-2 border-r-2 border-glow-purple rounded-full animate-spin direction-reverse" />
                    <Zap className="w-6 h-6 text-glow-blue animate-pulse" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#F5F5F7] mb-2">Scraping Neural Nodes...</p>
                  <p className="text-[10px] font-bold text-glow-blue animate-pulse">Running advanced heuristics...</p>
                </motion.div>
              )}

              {seoResult && !isSynthesizing && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col gap-8 z-10"
                >
                  {/* Top Stats */}
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-[2] bg-[#151515] border border-white/10 p-5 shrink-0 relative overflow-hidden group">
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-glow-blue to-glow-purple" />
                      <h4 className="text-[10px] uppercase font-bold text-[#A1A1A6] tracking-widest mb-1">Optimized Title</h4>
                      <p className="text-lg font-black text-white leading-tight">{seoResult.title}</p>
                    </div>

                    <div className="flex-1 bg-[#151515] border border-white/10 p-5 shrink-0 flex items-center justify-between">
                      <div>
                        <h4 className="text-[10px] uppercase font-bold text-[#A1A1A6] tracking-widest mb-1">Viral Chance</h4>
                        <div className="flex items-end gap-1">
                          <p className="text-3xl font-black text-glow-blue leading-none">{seoResult.viralChance}</p>
                          <span className="text-sm font-bold text-glow-blue pb-0.5">%</span>
                        </div>
                      </div>
                      <BarChart className="w-8 h-8 text-glow-purple opacity-50" />
                    </div>
                  </div>

                  {/* Body Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="space-y-6">
                      {/* Description */}
                      <div className="bg-[#151515] border border-white/10 p-5 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                          <AlignLeft className="w-4 h-4 text-glow-blue" />
                          <h4 className="text-[10px] uppercase font-bold text-[#F5F5F7] tracking-widest">Description Snippet</h4>
                        </div>
                        <p className="text-xs text-[#A1A1A6] font-medium leading-relaxed whitespace-pre-wrap">{seoResult.description}</p>
                      </div>

                      <div className="bg-[#151515] border border-white/10 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Target className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-[10px] uppercase font-bold text-[#F5F5F7] tracking-widest">Low Competition Niches</h4>
                        </div>
                        <div className="space-y-2">
                          {seoResult.lowCompetitionNiches?.map((niche, i) => (
                            <div key={i} className="flex justify-between items-center bg-white/5 p-2 px-3 border border-white/5">
                              <span className="text-xs text-[#A1A1A6] font-medium">{niche}</span>
                              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5">High Conv.</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#151515] border border-white/10 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Search className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-[10px] uppercase font-bold text-[#F5F5F7] tracking-widest">Low Competition Keywords</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {seoResult.lowCompetitionKeywords?.map((kw, i) => (
                            <span key={i} className="px-2 py-1 bg-emerald-500/5 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 flex flex-col h-full">
                      {/* Tags */}
                      <div className="bg-[#151515] border border-white/10 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Hash className="w-4 h-4 text-glow-purple" />
                          <h4 className="text-[10px] uppercase font-bold text-[#F5F5F7] tracking-widest">Top Overall Tags</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {seoResult.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 text-[10px] font-bold text-[#A1A1A6]">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#151515] border border-white/10 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Activity className="w-4 h-4 text-glow-blue" />
                          <h4 className="text-[10px] uppercase font-bold text-[#F5F5F7] tracking-widest">Viral Keywords & Niche</h4>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] text-[#A1A1A6] mb-2 uppercase font-bold">Viral Keywords</p>
                            <div className="flex flex-wrap gap-2">
                              {seoResult.viralKeywords?.map((kw, i) => (
                                <span key={i} className="px-2 py-1 bg-glow-blue/10 border border-glow-blue/30 text-[10px] font-bold text-glow-blue">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] text-[#A1A1A6] mb-2 uppercase font-bold">Viral Niche Targets</p>
                            <div className="flex flex-wrap gap-2">
                              {seoResult.viralVideoNiches?.map((niche, i) => (
                                <span key={i} className="px-2 py-1 bg-glow-purple/10 border border-glow-purple/30 text-[10px] font-bold text-glow-purple">
                                  {niche}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-[#151515] border border-white/10 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <Zap className="w-4 h-4 text-[#F5F5F7]" />
                          <h4 className="text-[10px] uppercase font-bold text-[#F5F5F7] tracking-widest">Viral Title Ideas</h4>
                        </div>
                        <div className="space-y-2">
                          {seoResult.viralTitles?.map((title, i) => (
                            <div key={i} className="text-xs text-[#A1A1A6] font-medium border-b border-white/5 pb-2 last:border-0 last:pb-0">
                              {title}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Strategy */}
                      <div className="bg-[#151515] border border-white/10 p-5 flex-1">
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <h4 className="text-[10px] uppercase font-bold text-[#F5F5F7] tracking-widest">Growth Vector</h4>
                        </div>
                        <p className="text-xs font-bold text-emerald-400/90 leading-relaxed italic border-l-2 border-emerald-500/50 pl-3">
                          "{seoResult.strategy}"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Viral Checklist Section */}
                  <div className="mt-8 bg-[#101010]/50 backdrop-blur-md rounded-[2rem] p-8 border border-white/[0.08] shadow-[0_4_24px_rgba(0,0,0,0.4)]">
                    <h4 className="text-[10px] uppercase font-bold text-[#F5F5F7] tracking-widest mb-6 flex items-center gap-2">
                       <Zap className="w-4 h-4 text-emerald-500" /> Viral Pre-Flight Checklist
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { label: "Pattern Interrupt Hook", desc: "First 3 seconds must break viewer momentum." },
                        { label: "Thumbnail Emotional Sync", desc: "Title and thumbnail must form a curiosity loop." },
                        { label: "Keyword-Dense Intro", desc: "Mention core topic within first 15 seconds." },
                        { label: "Micro-Transition Flow", desc: "Visual change or cut every 5-7 seconds." },
                        { label: "Strong CTA Node", desc: "Specific, high-friction request at peak engagement." },
                        { label: "Community Engagement", desc: "Reply to first 10 comments within 60 minutes." }
                      ].map((item, index) => (
                        <div key={index} className="flex gap-3 items-start">
                           <div className="w-4 h-4 rounded border border-white/20 mt-0.5 shrink-0 flex items-center justify-center">
                              <Check className="w-2 h-2 text-emerald-500 opacity-50" />
                           </div>
                           <div>
                              <p className="text-[11px] font-bold text-[#F5F5F7] leading-none mb-1">{item.label}</p>
                              <p className="text-[10px] text-[#A1A1A6] font-medium leading-tight">{item.desc}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}

