import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Youtube, 
  Instagram, 
  Facebook, 
  Smartphone,
  Cpu,
  Layers,
  Zap,
  Target,
  FileText,
  Tag,
  Crown
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { gemini } from '@/src/services/gemini';
import { useUser } from '@/src/contexts/UserContext';
import { Link } from 'react-router-dom';

import { useNotify } from '@/src/contexts/NotificationContext';

export default function ContentForge() {
  const { profile } = useUser();
  const { notify } = useNotify();
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [isGenerating, setIsGenerating] = useState(false);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [topicError, setTopicError] = useState('');

  const handleTopicChange = (val: string) => {
    setTopic(val);
    if (!val.trim()) setTopicError('Base Topic Node is required');
    else setTopicError('');
  };

  const isFree = profile?.tier === 'free';

  const handleGenerate = async () => {
    if (!topic) {
      notify("Topic node is empty. Generation requires a conceptual base.", "error", "Input Error");
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await gemini.generateGrowthBlueprint(topic, platform);
      setBlueprint(result);
      notify("Content platform synthesized successfully.", "success", "Forge Complete");
    } catch (error: any) {
      console.error(error);
      const errorMsg = error?.message || "Quantum drift detected in smart core.";
      notify(errorMsg, "error", "Generation Failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      notify(`${field} copied to smart buffer.`, "success");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      notify("Smart buffer write failed.", "error");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10 mb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 premium-glow-text">Gen AI Studio</h1>
          <div className="flex items-center gap-4">
            <p className="text-[#A1A1A6] font-medium text-xs md:text-sm tracking-normal">Generate Viral Keywords, Tags & Descriptions</p>
            <div className="h-[1px] w-24 bg-apple-glass-border hidden md:block" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse shadow-[0_0_10px_#34C759]" />
              <span className="text-xs font-medium text-[#34C759]">Engine Online</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        {/* Left: Input Forge */}
        <div className="xl:col-span-5 space-y-6">
          <div className="smart-card p-8 space-y-8 border-glow-blue/30">
            <div className="space-y-4">
              <label className="block text-xs font-medium  text-[#A1A1A6] tracking-normal font-bold">Base Topic Node</label>
              <div className="relative group space-y-1">
                <div className="relative group">
                  <div className="absolute inset-0 bg-glow-blue/10 blur-xl group-focus-within:bg-glow-blue/10 transition-all pointer-events-none" />
                  <textarea
                    value={topic}
                    onChange={(e) => handleTopicChange(e.target.value)}
                    placeholder="e.g. The impact of smart interfaces on social media algorithms..."
                    className={cn(
                      "w-full bg-[#151515] border p-6 text-sm font-medium text-[#A1A1A6] placeholder:text-[#A1A1A6] focus:outline-none transition-all min-h-[120px] relative z-10",
                      topicError ? "border-red-500/50 focus:border-red-500" : "border-apple-glass-border focus:border-glow-blue/30"
                    )}
                  />
                </div>
                {topicError && <p className="text-xs text-red-500">{topicError}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-medium  text-[#A1A1A6] tracking-normal font-bold">Target Platform Hub</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'YouTube', icon: Youtube, color: 'text-red-500' },
                  { id: 'Instagram', icon: Instagram, color: 'text-pink-500' },
                  { id: 'Facebook', icon: Facebook, color: 'text-blue-500' },
                  { id: 'TikTok', icon: Smartphone, color: 'text-cyan-500' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-3 p-4 border transition-all duration-300 group",
                      platform === p.id 
                        ? "bg-[#151515] border border-apple-glass-border shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                        : "bg-[#151515] border border-apple-glass-border hover:border-white/10"
                    )}
                  >
                    <p.icon className={cn(
                      "w-5 h-5 transition-transform duration-500 group-hover:scale-110",
                      platform === p.id ? p.color : "text-[#A1A1A6]"
                    )} />
                    <span className={cn(
                      "text-xs font-medium  tracking-wide",
                      platform === p.id ? "text-[#A1A1A6]" : "text-[#A1A1A6]"
                    )}>{p.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic}
              className={cn(
                "w-full py-5 flex items-center justify-center gap-3 bg-[#1C1C1E] border border-apple-glass-border font-black  tracking-normal text-xs transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden relative",
                isGenerating && "animate-pulse"
              )}
            >
              <div className="absolute inset-x-0 h-full w-0 bg-glow-blue/10 group-hover:w-full transition-all duration-700 pointer-events-none opacity-20" />
              {isGenerating ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Initialize Generation
                </>
              )}
            </button>
          </div>

          <div className="smart-card p-6 border-white/10">
             <div className="flex items-center gap-3 mb-4">
                <Layers className="w-4 h-4 text-[#A1A1A6]" />
                <h4 className="text-xs font-medium  tracking-wide text-[#A1A1A6] italic">Generation Guidelines</h4>
             </div>
             <ul className="space-y-3 font-medium text-xs text-[#A1A1A6] lowercase">
                <li>• smart engines prioritize high-energy hooks</li>
                <li>• hub-optimized descriptions increase sync rate</li>
                <li>• platform-specific tagging architecture</li>
             </ul>
          </div>
        </div>

        {/* Right: Output Array */}
        <div className="xl:col-span-7">
          <AnimatePresence mode="wait">
            {!blueprint ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[500px] smart-card p-8 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-[#151515] border border-apple-glass-border rounded-full flex items-center justify-center animate-smart-pulse">
                  <Sparkles className="w-8 h-8 text-[#A1A1A6]" />
                </div>
                <div className="max-w-xs">
                  <p className="text-xs font-medium  tracking-normal text-[#A1A1A6]">Awaiting Smart Input</p>
                  <p className="text-[12px] font-medium text-[#A1A1A6] mt-4 italic">Configure the forge parameters to begin the creative generation process.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Result Cards */}
                <div className="smart-card p-8 space-y-8">
                  {/* Title Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-glow-blue" />
                        <span className="text-xs font-medium  tracking-normal text-[#A1A1A6]">Optimized Headline Node</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(blueprint.optimizedTitle, 'title')}
                        className="text-[#A1A1A6] hover:text-[#A1A1A6] transition-colors"
                      >
                        {copiedField === 'title' ? <Check className="w-4 h-4 text-glow-blue" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="bg-[#151515] border border-apple-glass-border p-6 ">
                      <h2 className="text-xl md:text-2xl font-black  tracking-tight text-glow-blue/90 leading-tight">
                        {blueprint.optimizedTitle}
                      </h2>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-glow-purple" />
                        <span className="text-xs font-medium  tracking-normal text-[#A1A1A6]">Hub-Sync Description</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(blueprint.highEnergyDescription, 'desc')}
                        className="text-[#A1A1A6] hover:text-[#A1A1A6] transition-colors"
                      >
                        {copiedField === 'desc' ? <Check className="w-4 h-4 text-glow-blue" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="bg-[#151515] border border-apple-glass-border p-6 font-medium text-sm leading-relaxed text-[#A1A1A6] min-h-[150px] max-h-[300px] overflow-y-auto scrollbar-style-thin">
                      {blueprint.highEnergyDescription}
                    </div>
                  </div>

                  {/* Tags Section */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#A1A1A6]" />
                        <span className="text-xs font-medium  tracking-normal text-[#A1A1A6]">Algorithmic Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-2 relative">
                        {(blueprint["nicheTags"] || blueprint["15NicheTags"])?.slice(0, isFree ? 5 : 15).map((tag: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-[#151515] border border-apple-glass-border text-xs font-medium text-[#A1A1A6] hover:text-glow-blue hover:border-glow-blue/30 transition-all cursor-default">
                            {tag.startsWith('#') ? tag : `#${tag}`}
                          </span>
                        ))}
                        {isFree && (
                          <div className="flex items-center gap-2 ml-2">
                            <span className="text-xs font-medium text-[#A1A1A6]  tracking-wide">+ 10 More Nodes Locked</span>
                            <Link to="/hub-upgrade" className="text-xs font-medium text-glow-blue  hover:underline">Upgrade</Link>
                          </div>
                        )}
                      </div>
                  </div>
                </div>

                {/* Growth Instructions */}
                <div className="smart-card p-8 bg-glow-blue/10 border-glow-blue/30 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-glow-blue/10 flex items-center justify-center">
                      <Send className="w-5 h-5 text-glow-blue" />
                    </div>
                    <h3 className="font-bold  tracking-normal text-xs">Deployment Instructions</h3>
                  </div>
                  
                  <div className={cn("space-y-4 transition-all duration-500", isFree && "blur-sm select-none opacity-40 pointer-events-none")}>
                    {(Array.isArray(blueprint.structuralGrowthInstructions) 
                      ? blueprint.structuralGrowthInstructions 
                      : (blueprint.structuralGrowthInstructions?.split('\n') || [])
                    ).filter((l: any) => typeof l === 'string' && l.trim()).map((step: string, i: number) => (
                      <div key={i} className="flex gap-4 items-start group">
                        <span className="text-xs font-medium text-glow-blue/40 mt-1">{String(i + 1).padStart(2, '0')}</span>
                        <p className="text-sm font-medium text-[#A1A1A6] leading-loose group-hover:text-[#A1A1A6] transition-colors">
                          {step.replace(/^\d+\.\s*/, '')}
                        </p>
                      </div>
                    ))}
                  </div>

                  {isFree && (
                    <div className="absolute inset-x-0 bottom-0 top-[80px] bg-gradient-to-t from-deep-black/80 via-transparent to-transparent flex flex-col items-center justify-center p-8 z-20">
                      <div className="smart-card p-6 bg-[#1C1C1E] border border-apple-glass-border border-white/10 flex flex-col items-center text-center space-y-4 max-w-xs shadow-2xl">
                        <Crown className="w-8 h-8 text-glow-blue shadow-[0_0_15px_#00f2ff]" />
                        <div>
                          <p className="text-xs font-medium  tracking-normal mb-2 font-bold">Node Access Restricted</p>
                          <p className="text-xs font-medium text-[#A1A1A6] leading-relaxed italic">
                            Full Deployment Instructions are exclusive to Premium Node subscribers.
                          </p>
                        </div>
                        <Link 
                          to="/hub-upgrade" 
                          className="w-full py-3 bg-glow-blue/10 text-[#F5F5F7] text-xs font-bold  tracking-wide hover:bg-[#1C1C1E] border border-apple-glass-border transition-colors text-center"
                        >
                          Synchronize Now
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
