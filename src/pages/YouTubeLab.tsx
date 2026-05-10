import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Youtube, 
  Layers,
  Sparkles,
  Target,
  RefreshCw,
  Library,
  Zap,
  Info,
  ChevronDown,
  Layout,
  Globe,
  Eye,
  ArrowUpRight,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { gemini } from '@/src/services/gemini';
import { firebaseService } from '@/src/services/firebase';
import { cn } from '@/src/lib/utils';
import { useUser } from '@/src/contexts/UserContext';
import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';

import { useNotify } from '@/src/contexts/NotificationContext';

export default function YouTubeLab() {
  const { profile } = useUser();
  const { notify } = useNotify();
  const isFree = profile?.tier === 'free';
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [isSyncing, setIsSyncing] = useState(false);
  const [mode, setMode] = useState<'audit' | 'blueprint' | 'search'>('audit');
  const [result, setResult] = useState<any>(null);
  const [titleError, setTitleError] = useState('');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!val.trim()) setTitleError('Title strategy is required');
    else setTitleError('');
  };

  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const performAction = async () => {
    if (!title) {
      notify("Base topic node required for analysis.", "error", "Input Error");
      return;
    }
    
    setIsSyncing(true);
    notify(`Initializing AI Algorithm Alignment for ${mode === 'audit' ? 'SEO Audit' : mode === 'blueprint' ? 'Viral Blueprint' : 'Live Data Search'}...`, 'smart', 'Smart Core Active');
    setResult(null);
    
    try {
      if (mode === 'audit') {
        const audit = platform === 'YouTube Shorts' 
          ? await gemini.analyzeYouTubeShortsSEO(title, desc)
          : await gemini.analyzeYouTubeSEO(title, desc);
        setResult(audit);
        await firebaseService.saveAnalysis('audit', title, audit);
        notify("SEO convergence platform calculated.", "success", "Audit Complete");
      } else if (mode === 'blueprint') {
        const blueprint = platform === 'YouTube Shorts'
          ? await gemini.generateShortsBlueprint(title, platform)
          : await gemini.generateGrowthBlueprint(title, platform);
        setResult(blueprint);
        await firebaseService.saveAnalysis('blueprint', title, blueprint);
        notify("Viral growth trajectory projected successfully.", "success", "Blueprint Synthesized");
      } else if (mode === 'search') {
        const videoId = extractVideoId(title);
        let endpoint = '';
        
        if (videoId) {
          endpoint = `/api/youtube/stats?videoId=${videoId}`;
        } else {
          endpoint = `/api/youtube/search?q=${encodeURIComponent(title)}`;
        }

        const response = await fetch(endpoint);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Analysis failed');
        }

        let fetchedData = data;
        if (!videoId && Array.isArray(data) && data.length > 0) {
          const firstVideoId = data[0].videoId;
          const statsResponse = await fetch(`/api/youtube/stats?videoId=${firstVideoId}`);
          fetchedData = await statsResponse.json();
        }

        const tagsResponse = await fetch(`/api/youtube/tags?q=${encodeURIComponent(videoId ? (fetchedData?.title || title) : title)}`);
        const tagsData = await tagsResponse.json();
        
        setResult({
          type: 'search',
          ...fetchedData,
          suggestedTags: tagsData
        });
        notify("Live YouTube data synchronized.", "success", "Data Fetched");
      }
    } catch (error: any) {
      console.error("Smart Execution Error:", error);
      const errorMsg = error?.message || "Algorithm alignment failure: Quantum noise detected.";
      notify(errorMsg, "error", "Execution Failed");
      if (errorMsg.includes('API Key is missing')) {
        setTimeout(() => {
          setResult({
             type: 'search',
             title: title,
             description: 'Simulated data due to missing API key.',
             viewCount: '120400',
             likeCount: '12000',
             commentCount: '1200',
             tags: ['simulated', 'data', 'api key missing'],
             suggestedTags: ['setup', 'api', 'keys', 'in', 'env']
          });
          notify('Using simulated data (API Key not yet synced)', 'info', 'Simulation Active');
        }, 1000);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight  mb-2">Growth Lab</h1>
          <p className="text-[#A1A1A6] font-medium text-xs md:text-sm  tracking-wide italic leading-relaxed">Cross-Platform Algorithm Alignment</p>
        </div>
        
        <div className="flex bg-[#151515] border border-apple-glass-border p-1 rounded-none shrink-0 overflow-x-auto hide-scrollbar">
          {(['audit', 'blueprint', 'search'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setResult(null); }}
              className={cn(
                "px-4 md:px-6 py-2 text-xs font-medium tracking-wide transition-all whitespace-nowrap",
                mode === m ? "bg-[#1C1C1E] border border-apple-glass-border font-bold text-[#F5F5F7]" : "text-[#A1A1A6] hover:text-[#F5F5F7]"
              )}
            >
              {m === 'audit' ? 'SEO Audit' : m === 'blueprint' ? 'Viral Blueprint' : 'Live Data / Search'}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Interface */}
        <div className="smart-card p-6 md:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-[#A1A1A6] tracking-normal">Metadata Strategy Node</label>
              {mode !== 'search' && (
                <div className="flex gap-4">
                  {['YouTube', 'YouTube Shorts', 'Instagram', 'FB'].map(p => (
                    <button 
                      key={p}
                      onClick={() => setPlatform(p)}
                      className={cn(
                        "text-xs font-medium tracking-tight transition-colors",
                        platform === p ? "text-glow-blue underline underline-offset-4" : "text-[#A1A1A6] hover:text-glow-blue/50"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative space-y-1">
               <div className="relative">
                 <input 
                    type="text"
                    placeholder={mode === 'audit' ? "Internal Title Strategy..." : mode === 'blueprint' ? "Target Topic/Hook Theme..." : "Paste YouTube Video URL or Search Keyword..."}
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className={cn(
                      "w-full bg-[#151515] border p-3 md:p-4 font-sans text-xs md:text-sm focus:outline-none transition-colors text-[#F5F5F7]",
                      titleError ? "border-red-500/50 focus:border-red-500" : "border-apple-glass-border focus:border-glow-blue/30"
                    )}
                 />
                 <Sparkles className="absolute right-4 top-3 md:top-4 w-4 h-4 text-glow-blue opacity-40" />
               </div>
               {titleError && <p className="text-xs text-red-500">{titleError}</p>}
            </div>
            
            {mode === 'audit' && (
              <textarea 
                placeholder="Description Architecture..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full h-32 md:h-40 bg-[#151515] border border-apple-glass-border p-3 md:p-4 font-sans text-xs md:text-sm focus:outline-none focus:border-glow-blue/30 transition-colors resize-none text-[#F5F5F7]"
              />
            )}
          </div>

          <button 
            onClick={performAction}
            disabled={isSyncing || !title}
            className="w-full py-5 bg-glow-blue/10 text-[#F5F5F7] font-black tracking-normal text-xs md:text-xs hover:bg-[#1C1C1E] border border-glow-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-glow-blue" />
                Synchronizing Nodes...
              </>
            ) : mode === 'audit' ? "Initialize SEO Audit" : mode === 'blueprint' ? "Synthesize Viral Blueprint" : "Initialize Live Data Search"}
          </button>
        </div>

        {/* Results Interface */}
        <div className="smart-card p-6 md:p-8 relative flex flex-col min-h-[500px]">
          {!result && !isSyncing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              {mode === 'audit' ? <Youtube className="w-12 h-12 text-[#A1A1A6]" /> : <Zap className="w-12 h-12 text-[#A1A1A6]" />}
              <p className="text-xs font-medium  text-[#A1A1A6] tracking-wide leading-relaxed px-12">
                "Smart hub awaiting instruction. Define topic or metadata for algorithm alignment."
              </p>
            </div>
          )}

          {isSyncing && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
               <div className="w-24 h-1 bg-[#151515] border border-apple-glass-border relative overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                    className="absolute inset-0 bg-glow-blue/10 shadow-[0_0_20px_rgba(0,242,255,1)]"
                  />
               </div>
               <p className="text-xs font-medium  text-glow-blue animate-pulse tracking-normal">Decrypting Algorithm Patterns...</p>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {mode === 'audit' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    <div className={cn("p-4 bg-[#151515] border border-apple-glass-border flex flex-col items-center justify-center min-h-[160px] transition-all", isFree && "blur-sm opacity-40 select-none")}>
                      <p className="text-xs font-medium text-[#A1A1A6] mb-4 tracking-tight self-start flex items-center gap-2">
                        <PieChartIcon className="w-3 h-3" /> Viral Probability Index
                      </p>
                      <div className="h-24 w-24 relative min-w-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Viral', value: (result.viralProbability || 0) * 100 },
                                { name: 'Remaining', value: (1 - (result.viralProbability || 0)) * 100 }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={25}
                              outerRadius={40}
                              paddingAngle={5}
                              dataKey="value"
                              startAngle={90}
                              endAngle={450}
                            >
                              <Cell fill="#00f2ff" />
                              <Cell fill="#ffffff05" />
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-xl font-bold text-glow-blue mt-2">{((result.viralProbability || 0) * 100).toFixed(1)}%</p>
                    </div>
                    <div className={cn("p-4 bg-[#151515] border border-apple-glass-border min-h-[160px] transition-all", isFree && "blur-sm opacity-40 select-none")}>
                      <p className="text-xs font-medium text-[#A1A1A6] mb-4 tracking-tight flex items-center gap-2">
                        <BarChartIcon className="w-3 h-3" /> Heatmap Intensity
                      </p>
                      <div className="h-24 w-full relative min-w-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                          <BarChart data={(result.heatMapKeywords || []).slice(0, 5).map((kw: string, i: number) => ({
                            name: kw,
                            intensity: 100 - (i * 15)
                          }))}>
                            <XAxis dataKey="name" hide />
                            <Tooltip 
                              cursor={{ fill: 'transparent' }}
                              contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff10', fontSize: '8px', fontFamily: 'JetBrains Mono' }}
                            />
                            <Bar dataKey="intensity" fill="#bc13fe" radius={[2, 2, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-xs font-medium text-center text-[#A1A1A6] mt-2">Keyword Convergence Platform</p>
                    </div>

                    {isFree && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                        <div className="smart-card p-4 bg-[#1C1C1E] border border-apple-glass-border flex flex-col items-center text-center space-y-3 max-w-[200px]">
                           <Crown className="w-6 h-6 text-glow-blue" />
                           <p className="text-xs font-medium tracking-wide leading-relaxed text-[#F5F5F7]">Probability Analytics Locked</p>
                           <Link to="/hub-upgrade" className="text-xs font-medium text-glow-blue hover:underline">Upgrade to Pro</Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-medium text-[#A1A1A6] tracking-wide flex items-center gap-2">
                      <Target className="w-3 h-3 text-glow-blue" /> Optimized Master Title
                    </h4>
                    <div className="p-4 bg-[#151515] border border-glow-blue/30 font-medium text-sm text-glow-blue rounded-xl">
                      {result.optimizedTitle}
                    </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-xs font-medium text-[#A1A1A6] tracking-wide flex items-center gap-2">
                      <Layers className="w-3 h-3 text-glow-blue" /> Viral Heatmap Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.heatMapKeywords?.map((kw: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-glow-blue/10 border border-glow-blue/30 text-glow-blue text-xs font-medium rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : mode === 'blueprint' ? (
                <div className="space-y-6">
                   <div className="p-4 bg-glow-blue/10 border-l-2 border-glow-blue/30 rounded-r-xl">
                      <p className="text-xs font-medium text-glow-blue mb-1">Master Title Strategy</p>
                      <p className="text-sm font-bold tracking-tight text-[#F5F5F7]">{result.optimizedTitle}</p>
                   </div>

                   <div className="space-y-3 relative overflow-hidden">
                      <p className="text-xs font-medium text-[#A1A1A6] tracking-wide">Growth Instructions</p>
                      <div className={cn("text-xs text-[#A1A1A6] font-medium leading-relaxed space-y-4", isFree && "blur-md opacity-30 select-none")}>
                        {(Array.isArray(result.structuralGrowthInstructions) 
                          ? result.structuralGrowthInstructions 
                          : (result.structuralGrowthInstructions?.split('\n') || [])
                        ).filter((l: any) => typeof l === 'string' && l.trim()).map((line: string, i: number) => (
                          <div key={i} className="flex gap-3">
                            <span className="text-glow-blue shrink-0">[{i+1}]</span>
                            <p>{line.replace(/^\d+\.\s*/, '')}</p>
                          </div>
                        ))}
                      </div>
                      {isFree && (
                        <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/40">
                           <div className="smart-card p-6 bg-[#1C1C1E] border border-apple-glass-border flex flex-col items-center gap-4 text-center">
                              <Sparkles className="w-8 h-8 text-glow-blue shadow-[0_0_10px_#00f2ff]" />
                              <p className="text-xs font-medium tracking-normal font-bold text-[#F5F5F7]">Node Access Restricted</p>
                              <Link to="/hub-upgrade" className="w-full py-3 bg-glow-blue/10 text-[#F5F5F7] text-xs font-black tracking-normal rounded-xl hover:bg-glow-blue/20 transition-all">Upgrade to Premium</Link>
                           </div>
                        </div>
                      )}
                   </div>

                   <div className="space-y-3">
                      <p className="text-xs font-medium text-[#A1A1A6] tracking-wide">Smart Niche Tags</p>
                      <div className={cn("flex flex-wrap gap-2 transition-all", isFree && "opacity-50")}>
                        {(result.nicheTags || result["15NicheTags"])?.slice(0, isFree ? 5 : 20).map((tag: string, i: number) => (
                          <span key={i} className="px-2 py-1 border border-white/10 text-xs font-medium text-[#A1A1A6] hover:border-white/20 transition-colors rounded-full">
                            #{tag.replace(/\s+/g, '')}
                          </span>
                        ))}
                        {isFree && (
                          <span className="text-xs font-medium text-[#A1A1A6] tracking-wide py-1">+ 15 Nodes Locked</span>
                        )}
                      </div>
                   </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {result?.title && (
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-[#151515] p-6 rounded-2xl border border-white/5">
                      {result.thumbnail && (
                        <img src={result.thumbnail} alt="Thumbnail" className="w-full md:w-48 aspect-video object-cover rounded-xl border border-white/10 shadow-lg" />
                      )}
                      <div className="flex-1 space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-bold text-[#F5F5F7] leading-tight">{result.title}</h3>
                        <p className="text-xs text-[#A1A1A6] line-clamp-3 leading-relaxed italic">"{result.description}"</p>
                        <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                          <span className="text-xs font-black text-glow-blue tracking-wider uppercase">{result.channelTitle || 'Live Source'}</span>
                          <span className="text-xs text-[#86868B] font-medium">{result.publishedAt ? new Date(result.publishedAt).toLocaleDateString() : 'Active Node'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#1C1C1E] border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                      <Eye className="w-5 h-5 text-glow-blue mb-2" />
                      <span className="text-xl font-black text-[#F5F5F7]">{parseInt(result?.viewCount || '0').toLocaleString()}</span>
                      <span className="text-[10px] text-[#A1A1A6] uppercase tracking-wider font-bold mt-1">Total Views</span>
                    </div>
                    <div className="bg-[#1C1C1E] border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                      <Zap className="w-5 h-5 text-glow-purple mb-2" />
                      <span className="text-xl font-black text-[#F5F5F7]">{parseInt(result?.likeCount || '0').toLocaleString()}</span>
                      <span className="text-[10px] text-[#A1A1A6] uppercase tracking-wider font-bold mt-1">Total Likes</span>
                    </div>
                    <div className="bg-[#1C1C1E] border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center md:col-span-2 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-r from-glow-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-[10px] text-glow-blue uppercase tracking-wider font-bold mb-1">Algorithmic Base Score</span>
                      <div className="flex items-end gap-2">
                         <span className="text-3xl font-black text-[#F5F5F7]">
                           {Math.min(Math.floor(((parseInt(result?.viewCount as string) || 0) / 10000) + ((result?.tags?.length || 0) * 2) + 60), 100) || 0}
                         </span>
                         <span className="text-[#86868B] text-sm font-medium mb-1">/ 100</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-medium text-[#A1A1A6] tracking-wide flex items-center gap-2">
                       <Activity className="w-4 h-4 text-glow-blue" /> Dominant Tag Vectors
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(result?.suggestedTags?.length > 0 ? result.suggestedTags : result?.tags || []).slice(0, 15).map((tag: string, i: number) => (
                        <div key={i} className="flex items-center px-3 py-1.5 bg-[#151515] border border-white/10 rounded-full group">
                          <span className="text-[9px] font-black text-[#86868B] mr-2">#{i + 1}</span>
                          <span className="text-xs font-medium text-[#F5F5F7] group-hover:text-glow-blue transition-colors">
                            {tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
      {/* Insight Footer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="smart-card p-6 flex items-center gap-6 group"
        >
          <div className="w-12 h-12 bg-glow-blue/10 flex items-center justify-center shrink-0 border border-glow-blue/30">
             <Eye className="w-6 h-6 text-glow-blue" />
          </div>
          <div>
            <p className="text-xs font-bold  tracking-wide mb-1 italic">Oracle Prediction Access</p>
            <p className="text-xs font-medium text-[#A1A1A6] leading-relaxed ">"Visual saturation nodes reaching zenith. Recommend high-contrast glitch aesthetics for 24h cycle."</p>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="smart-card p-6 flex items-center gap-6 group border-glow-purple/30"
        >
          <div className="w-12 h-12 bg-glow-purple/10 flex items-center justify-center shrink-0 border border-glow-purple/30">
             <ArrowUpRight className="w-6 h-6 text-glow-purple" />
          </div>
          <div>
            <p className="text-xs font-bold  tracking-wide mb-1 italic">Growth Optimization Protocol</p>
            <p className="text-xs font-medium text-[#A1A1A6] leading-relaxed ">"Account synchronization complete. Cross-referencing Meta-TikTok algorithms for peak alignment."</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
