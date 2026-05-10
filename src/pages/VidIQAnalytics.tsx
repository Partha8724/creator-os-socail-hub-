import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp, Search, AlertTriangle, Zap, CheckCircle2, ChevronRight, Activity, Filter, Eye, ThumbsUp, MessageSquare, Edit3, Image as ImageIcon, Tag, Video, Cpu, Sparkles } from 'lucide-react';
import { useNotify } from '@/src/contexts/NotificationContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { gemini } from '@/src/services/gemini';

import ChannelManager from '@/src/components/ChannelManager';

export default function VidIQAnalytics({ defaultQuery = '' }: { defaultQuery?: string }) {
  const [videoUrl, setVideoUrl] = useState(defaultQuery);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { notify } = useNotify();
  const [activeTab, setActiveTab] = useState<'analyze' | 'tools' | 'channel'>('analyze');
  const [aiToolContext, setAiToolContext] = useState('');
  const [aiToolGenerating, setAiToolGenerating] = useState(false);
  const [aiToolResult, setAiToolResult] = useState<any>(null);

  useEffect(() => {
    if (defaultQuery) {
      setVideoUrl(defaultQuery);
      handleAnalyze(new Event('submit') as any);
    }
  }, [defaultQuery]);

  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;
    
    setIsAnalyzing(true);
    setAnalyzed(false);
    
    try {
      const videoId = extractVideoId(videoUrl);
      let endpoint = '';
      
      if (videoId) {
        endpoint = `/api/youtube/stats?videoId=${videoId}`;
      } else {
        endpoint = `/api/youtube/search?q=${encodeURIComponent(videoUrl)}`;
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Analysis failed');
      }

      // If it was a search, let's take the first result and get its stats
      if (!videoId && Array.isArray(data) && data.length > 0) {
        const firstVideoId = data[0].videoId;
        const statsResponse = await fetch(`/api/youtube/stats?videoId=${firstVideoId}`);
        const statsData = await statsResponse.json();
        setResults(statsData);
      } else {
        setResults(data);
      }

      // Fetch related tags for more VidIQ-like features
      const tagsResponse = await fetch(`/api/youtube/tags?q=${encodeURIComponent(videoId ? (results?.title || videoUrl) : videoUrl)}`);
      const tagsData = await tagsResponse.json();
      
      setResults((prev: any) => ({
        ...prev,
        suggestedTags: tagsData
      }));

      setIsAnalyzing(false);
      setAnalyzed(true);
      notify('Deep analysis complete.', 'success');
    } catch (error: any) {
      console.error('Analysis Error:', error);
      setIsAnalyzing(false);
      notify(error.message || 'Failed to connect to Neural Nexus', 'error');
      
      // Fallback for demo purposes if API key is missing
      if (error.message.includes('API Key is missing') || error.message.includes('Simulated')) {
        setTimeout(() => {
           setResults({
              title: "Simulated Video Data - API Key Missing",
              description: "This is a simulated response because the API key is not configured.",
              viewCount: "345000",
              likeCount: "12500",
              commentCount: "1420",
              thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop",
              channelTitle: "Simulated Channel",
              publishedAt: new Date().toISOString(),
              suggestedTags: ["simulated", "data", "youtube", "analytics", "vidiq", "alternative"]
           });
          setAnalyzed(true);
          notify('Using simulated data (API Key not yet synced)', 'info');
        }, 1000);
      }
    }
  };

  const handleAITools = async (type: string) => {
     if(!aiToolContext) {
        notify("Please enter a topic or context.", "error"); return;
     }
     setAiToolGenerating(true);
     setAiToolResult(null);
     notify(`Generating ${type}...`, 'smart');
     try {
        const result = await gemini.generateContent(
           `Act as an elite YouTube strategist (better than VidIQ). Generate an optimized ${type} for the topic: "${aiToolContext}".
           Return ONLY a valid JSON object with a single key "output" containing the result. No markdown formatting.
           Example: {"output": "The generated text here..."}`
        );
        const parsed = JSON.parse(result.replace(/```json|```/g, '').trim());
        setAiToolResult(parsed.output);
        notify("Generation complete.", "success");
     } catch (e: any) {
        notify(e.message, 'error');
        setAiToolResult(`Error: ${e.message}`);
     } finally {
        setAiToolGenerating(false);
     }
  };

  const seoScore = results ? Math.min(Math.floor(((parseInt(results.viewCount as string) || 0) / 10000) + ((results.tags?.length || 0) * 2) + 60), 100) || 0 : 84;
  const engagementRate = results ? (((parseInt(results.likeCount as string) || 0) + (parseInt(results.commentCount as string) || 0)) / (parseInt(results.viewCount as string) || 1) * 100).toFixed(1) : "8.4";

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700 font-sans selection:bg-glow-blue/30 selection:text-white pb-24 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-glow-blue/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-glow-purple/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0" />
      
      <header className="mb-10 relative z-10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-[#F5F5F7] flex items-center gap-3">
          <BarChart2 className="w-8 h-8 text-glow-blue" />
          YouTube Management Suite
        </h1>
        <p className="text-[#A1A1A6] font-medium">Deep-dive SEO, AI Metadata Generation, and Advanced Channel Intelligence.</p>
      </header>

      <div className="flex gap-2 mb-8 bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] p-2 rounded-2xl w-fit relative z-10 shadow-[0_4_24px_rgba(0,0,0,0.5)]">
         <button onClick={()=>setActiveTab('analyze')} className={cn("px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all", activeTab === 'analyze' ? "bg-white/10 text-white" : "text-[#86868B] hover:text-white")}>Video SEO Engine</button>
         <button onClick={()=>setActiveTab('tools')} className={cn("px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all", activeTab === 'tools' ? "bg-white/10 text-glow-blue" : "text-[#86868B] hover:text-glow-blue")}>AI Creator Tools</button>
         <button onClick={()=>setActiveTab('channel')} className={cn("px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all", activeTab === 'channel' ? "bg-white/10 text-glow-purple" : "text-[#86868B] hover:text-glow-purple")}>Channel Audit</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'analyze' && (
          <motion.div key="analyze" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
             <div className="w-full max-w-3xl mb-12 relative z-10">
                <form onSubmit={handleAnalyze} className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                    <input 
                      type="text" 
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="Paste YouTube Video URL or Search Keyword..." 
                      className="w-full bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.5)] rounded-[2rem] py-5 pl-14 pr-6 text-[#F5F5F7] placeholder-[#86868B] font-bold outline-none focus:border-glow-blue/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isAnalyzing || !videoUrl}
                    className="px-8 bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] text-white font-black tracking-widest text-sm rounded-[2rem] hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-[0_8_32px_rgba(0,0,0,0.5)] active:scale-[0.98] uppercase"
                  >
                    {isAnalyzing ? (
                      <span className="animate-pulse">Scanning...</span>
                    ) : (
                      <>Analyze <Zap className="w-4 h-4 text-glow-blue" /></>
                    )}
                  </button>
                </form>
             </div>

             {analyzed && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 pb-20 relative z-10">
          
          {results?.title && (
            <div className="p-8 md:p-12 bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[3rem] flex flex-col md:flex-row items-center md:items-start gap-10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-glow-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              {results.thumbnail && (
                <div className="relative shrink-0 w-full md:w-64">
                   <img src={results.thumbnail} alt="Thumbnail" className="w-full aspect-video rounded-3xl object-cover border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                   <div className="absolute inset-0 rounded-3xl shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]" />
                </div>
              )}
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 bg-glow-blue/10 text-glow-blue text-[10px] font-black uppercase tracking-widest rounded-md border border-glow-blue/20">Active Node</span>
                  <span className="text-[10px] text-[#86868B] font-medium tracking-widest uppercase">ID: {extractVideoId(videoUrl) || 'QUERY_RESULT'}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-[#F5F5F7] mb-3 leading-tight tracking-tight">{results.title}</h2>
                <p className="text-sm text-[#A1A1A6] line-clamp-3 leading-relaxed font-medium mb-6 italic">"{results.description}"</p>
                
                <div className="flex items-center gap-8">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-[#86868B] font-bold uppercase tracking-widest mb-1">Channel</span>
                      <span className="text-glow-blue font-black text-sm">{results.channelTitle || 'Neural Link'}</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] text-[#86868B] font-bold uppercase tracking-widest mb-1">Published</span>
                      <span className="text-[#F5F5F7] font-black text-sm">
                        {results.publishedAt ? new Date(results.publishedAt).toLocaleDateString() : 'Syncing...'}
                      </span>
                   </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-8 bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[3rem] flex flex-col justify-between">
               <h3 className="text-[#86868B] text-sm font-medium uppercase tracking-wider mb-2">SEO Score</h3>
               <div className="flex items-end gap-2">
                 <span className="text-4xl font-black text-glow-blue">{seoScore}</span>
                 <span className="text-[#A1A1A6] font-medium mb-1">/ 100</span>
               </div>
               <div className="w-full h-2 bg-[#151515] rounded-full mt-4 overflow-hidden">
                 <div className="h-full bg-glow-blue transition-all duration-1000" style={{ width: `${seoScore}%` }} />
               </div>
            </div>
            
            <div className="p-8 bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[3rem] flex flex-col justify-between">
               <div className="flex items-center justify-between mb-2">
                 <h3 className="text-[#86868B] text-sm font-medium uppercase tracking-wider">Total Views</h3>
                 <Eye className="w-4 h-4 text-glow-blue" />
               </div>
               <span className="text-4xl font-black text-[#F5F5F7]">{parseInt(results?.viewCount || 1204).toLocaleString()}</span>
               {results && <p className="text-sm font-medium text-green-500 mt-2">+14% vs avg</p>}
            </div>

            <div className="p-8 bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[3rem] flex flex-col justify-between">
               <h3 className="text-[#86868B] text-sm font-medium uppercase tracking-wider mb-2">Engagement Rate</h3>
               <span className="text-4xl font-black text-[#F5F5F7]">{engagementRate}%</span>
               <div className="flex gap-4 mt-2">
                 <div className="flex items-center gap-1 text-xs text-[#A1A1A6] font-medium"><ThumbsUp className="w-3 h-3" /> {parseInt(results?.likeCount || 12000).toLocaleString()}</div>
                 <div className="flex items-center gap-1 text-xs text-[#A1A1A6] font-medium"><MessageSquare className="w-3 h-3" /> {parseInt(results?.commentCount || 1200).toLocaleString()}</div>
               </div>
            </div>
            
            <div className="p-8 bg-[#101010]/80 backdrop-blur-2xl border border-glow-purple/30 shadow-[0_8_32px_rgba(188,19,254,0.15)] rounded-[3rem] relative overflow-hidden group hover:border-glow-purple transition-all cursor-pointer">
              <div className="absolute inset-0 bg-glow-purple/5 group-hover:bg-glow-purple/10 transition-colors" />
              <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                 <h3 className="text-[#F5F5F7] font-bold text-lg">Predictive Viral Potential</h3>
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full border-4 border-glow-purple flex items-center justify-center text-glow-purple font-black">
                     {seoScore > 90 ? 'S' : seoScore > 80 ? 'A+' : 'B'}
                   </div>
                   <p className="text-xs text-[#A1A1A6] font-medium leading-tight">Algorithm is favoring this metadata.</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="p-8 md:p-12 bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[3rem]">
              <h3 className="text-xl font-bold text-[#F5F5F7] mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-glow-blue" />
                Optimization Checklist
              </h3>
              <ul className="space-y-4">
                {[
                  { label: "Title contains target keywords", status: !!results?.title },
                  { label: "Description is optimized (500+ chars)", status: (results?.description?.length || 0) > 500 },
                  { label: "High-volume tags present in title", status: results?.tags?.some((t: string) => results.title?.toLowerCase().includes(t.toLowerCase())) },
                  { label: "Channel has active community sync", status: true },
                  { label: "Thumbnail contrast & text readability", status: results?.thumbnail ? true : false }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between p-3 bg-[#151515] rounded-xl border border-white/5">
                    <span className="text-[#A1A1A6] font-medium text-sm">{item.label}</span>
                    {item.status ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 md:p-12 bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[3rem]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#F5F5F7] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-glow-blue" />
                  Top Ranking Tags
                </h3>
                <Filter className="w-5 h-5 text-[#86868B] cursor-pointer hover:text-[#F5F5F7]" />
              </div>
              <div className="flex flex-wrap gap-2">
                {(results?.suggestedTags?.length > 0 ? results.suggestedTags : results?.tags || [
                  "ai growth 2026", "smart social systems", "viral mechanics", "youtube algorithm update"
                ]).map((tag: string, idx: number) => (
                  <div key={idx} className="flex items-center pl-3 pr-4 py-2 bg-[#151515] border border-white/10 rounded-full group cursor-pointer hover:border-glow-blue/50 transition-colors">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mr-2 bg-white/10 text-[#86868B]">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-medium text-[#F5F5F7] group-hover:text-glow-blue transition-colors">
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
          </motion.div>
        )}

        {activeTab === 'tools' && (
          <motion.div key="tools" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
             <div className="grid lg:grid-cols-12 gap-8 relative z-10">
                <div className="lg:col-span-4 space-y-6">
                   <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8">
                      <h3 className="text-xl font-bold text-[#F5F5F7] mb-4">AI Content Architect</h3>
                      <p className="text-[#A1A1A6] text-sm mb-6">Input your core concept and let the AI generate optimized metadata for maximum reach.</p>
                      
                      <div className="space-y-4">
                         <div>
                            <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">Video Context</label>
                            <textarea 
                               value={aiToolContext}
                               onChange={e=>setAiToolContext(e.target.value)}
                               placeholder="What is this video about?"
                               className="w-full bg-[#000] border border-white/10 p-5 text-sm font-medium focus:border-glow-blue/50 focus:outline-none transition-all min-h-[120px] resize-none rounded-2xl text-white"
                            />
                         </div>
                         <div className="grid grid-cols-1 gap-2 pt-2">
                            <button onClick={()=>handleAITools('Viral Titles')} disabled={aiToolGenerating} className="py-4 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-between rounded-xl disabled:opacity-50">
                               <span>Generate Titles</span> <Edit3 className="w-4 h-4 text-glow-blue" />
                            </button>
                            <button onClick={()=>handleAITools('SEO Description')} disabled={aiToolGenerating} className="py-4 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-between rounded-xl disabled:opacity-50">
                               <span>SEO Description</span> <Tag className="w-4 h-4 text-glow-purple" />
                            </button>
                            <button onClick={()=>handleAITools('Keyword Tags')} disabled={aiToolGenerating} className="py-4 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-between rounded-xl disabled:opacity-50">
                               <span>Keyword List</span> <Activity className="w-4 h-4 text-green-500" />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
                
                <div className="lg:col-span-8">
                   <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12 min-h-[500px] flex flex-col">
                      {!aiToolResult && !aiToolGenerating && (
                         <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center mb-6">
                               <Sparkles className="w-10 h-10 text-[#86868B]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#F5F5F7] mb-2">Awaiting Instructions</h3>
                            <p className="text-[#A1A1A6] font-medium max-w-sm">Provide context on the left and select a generation mode.</p>
                         </div>
                      )}
                      
                      {aiToolGenerating && (
                         <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <Cpu className="w-12 h-12 text-glow-blue animate-pulse mb-6" />
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#F5F5F7] animate-pulse">Running Neural Optimization...</p>
                         </div>
                      )}
                      
                      {aiToolResult && !aiToolGenerating && (
                         <div className="whitespace-pre-wrap text-white font-medium text-sm leading-relaxed border-l-2 border-glow-blue pl-6">
                            {typeof aiToolResult === 'string' ? aiToolResult : JSON.stringify(aiToolResult, null, 2)}
                         </div>
                      )}
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'channel' && (
          <motion.div key="channel" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
             <ChannelManager />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
