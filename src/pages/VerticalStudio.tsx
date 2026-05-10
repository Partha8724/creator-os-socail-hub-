import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { 
  Smartphone, 
  Film, 
  Scissors, 
  Type, 
  Sparkles,
  Upload,
  RefreshCw,
  Eye,
  Zap,
  Target,
  Instagram,
  Facebook,
  Youtube,
  Image as ImageIcon,
  PlayCircle,
  X
} from 'lucide-react';
import { gemini } from '@/src/services/gemini';
import { cn } from '@/src/lib/utils';

export default function VerticalStudio() {
  const [script, setScript] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [storyboard, setStoryboard] = useState<any[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeFrameIndex, setActiveFrameIndex] = useState<number | null>(null);
  
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 3000);
  };

  const generateStoryboard = async () => {
    setIsGenerating(true);
    // Simulation of frame-by-frame scriptwriting/generation with platform awareness
    setTimeout(() => {
      setStoryboard([
        { frame: 1, hook: "Hook: The Smart Reveal", visual: "Macro shot of neon circuits lighting up.", audio: "Digital shimmer effect", tip: "Retention hack: Rapid zoom on first frame." },
        { frame: 2, hook: "Context: The Growth Problem", visual: "Fast cuts of analytics dropping.", audio: "Low industrial thud", tip: "Algorithm sync: Cut every 1.5 seconds." },
        { frame: 3, hook: "Resolution: The Hub Solve", visual: "Holographic dashboard overlay on screen.", audio: "Cybernetic pulse", tip: "Conversion factor: Add bright text overlay here." }
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  const triggerFrameUpload = (index: number) => {
    setActiveFrameIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeFrameIndex !== null && storyboard) {
      const assetUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      const newStoryboard = [...storyboard];
      newStoryboard[activeFrameIndex] = { 
        ...newStoryboard[activeFrameIndex], 
        assetUrl, 
        isVideo 
      };
      setStoryboard(newStoryboard);
      setActiveFrameIndex(null);
      // Reset input
      e.target.value = '';
    }
  };

  const removeAsset = (index: number) => {
    if (!storyboard) return;
    const newStoryboard = [...storyboard];
    if (newStoryboard[index].assetUrl) {
      URL.revokeObjectURL(newStoryboard[index].assetUrl);
    }
    delete newStoryboard[index].assetUrl;
    delete newStoryboard[index].isVideo;
    setStoryboard(newStoryboard);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative pb-20">
      <motion.div style={{ y }} className="absolute -top-40 -left-40 w-96 h-96 bg-glow-blue/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*,video/*"
      />

      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 relative z-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 uppercase">Vertical Studio</h1>
          <p className="text-[#86868B] font-medium text-xs md:text-sm tracking-widest uppercase italic">Neural Storyboard Architect</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          <div className="flex bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] p-1.5 rounded-2xl shadow-xl">
            {['TikTok', 'Instagram', 'Shorts'].map((p) => (
              <button 
                key={p}
                onClick={() => setPlatform(p)}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  platform === p ? "bg-white/10 text-white shadow-lg" : "text-[#86868B] hover:text-white"
                )}
              >
                {p}
              </button>
            ))}
          </div>
          <button 
            onClick={simulateUpload}
            className={cn(
              "px-8 py-3 flex items-center justify-center gap-3 transition-all duration-300 bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl hover:bg-white hover:text-black group min-w-[200px] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-[0.98]",
              isUploading && "border-glow-blue/30 shadow-[0_0_20px_rgba(0,242,255,0.2)]"
            )}
          >
            <Upload className={cn("w-4 h-4", isUploading ? "animate-bounce text-glow-blue" : "text-white group-hover:text-black")} />
            <span>
              {isUploading ? "Syncing Logic..." : "Bulk Asset Node"}
            </span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
        <div className="xl:col-span-4 bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-6 md:p-8 flex flex-col">
           <div className="mb-6 flex-1">
              <h3 className="font-black uppercase tracking-widest flex items-center gap-2 mb-8 text-[10px] text-[#86868B]">
                <Film className="w-4 h-4 text-glow-blue" />
                Script Generation Node
              </h3>
              <textarea 
                placeholder="Initialize Script Architecture..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full h-48 md:h-[500px] bg-black/40 border border-white/10 rounded-2xl p-6 font-bold text-sm focus:outline-none focus:border-glow-blue/50 focus:bg-black/60 transition-all resize-none leading-relaxed placeholder:text-[#333] shadow-inner"
              />
           </div>
           <button 
              onClick={generateStoryboard}
              disabled={isGenerating || !script}
              className="w-full py-5 bg-[#101010] border border-white/[0.08] rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed transform active:scale-[0.98] shadow-xl text-white"
           >
             {isGenerating ? "Synthesizing Pulse..." : "Generate Smart Storyboard"}
           </button>
        </div>

        <div className="xl:col-span-8 flex flex-col min-h-[500px]">
          {!storyboard && !isGenerating ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 md:p-12 border border-white/[0.08] bg-[#101010]/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_8_32px_rgba(0,0,0,0.8)]">
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8 rotate-3">
                <Smartphone className="w-10 h-10 text-[#86868B]" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#86868B]">Awaiting Generation Map</p>
            </div>
          ) : isGenerating ? (
            <div className="flex-1 flex items-center justify-center bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[3rem] shadow-[0_8_32px_rgba(0,0,0,0.8)]">
              <div className="relative">
                <div className="w-72 h-72 border-t-2 border-glow-blue/30 rounded-full animate-spin duration-[2000ms]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                  <div className="w-16 h-16 bg-glow-blue/10 animate-pulse rounded-full blur-2xl opacity-20" />
                  <Sparkles className="w-8 h-8 text-glow-blue animate-bounce" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-glow-blue animate-pulse">Mapping Frame Vectors</p>
                </div>
              </div>
            </div>
          ) : (
             <div className="space-y-6 overflow-y-auto max-h-[900px] pr-4 scrollbar-hide pb-10">
                {storyboard?.map((frame, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.6)] rounded-[2.5rem] p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 group hover:border-glow-blue/30 transition-all duration-500"
                  >
                    <div className="md:col-span-4 aspect-[9/16] bg-black/60 border border-white/[0.08] rounded-3xl flex flex-col items-center justify-center relative overflow-hidden shrink-0 group-hover:border-glow-blue/20 shadow-inner group">
                       <div className="absolute top-4 left-4 px-3 py-1 bg-[#101010]/90 backdrop-blur-md rounded-full font-black text-[10px] text-glow-blue z-20 border border-glow-blue/30 uppercase tracking-widest shadow-lg">Frame 0{frame.frame}</div>
                       
                       {frame.assetUrl ? (
                         <>
                           {frame.isVideo ? (
                             <video src={frame.assetUrl} className="absolute inset-0 w-full h-full object-cover" controls />
                           ) : (
                             <img src={frame.assetUrl} alt="Asset" className="absolute inset-0 w-full h-full object-cover" />
                           )}
                           <button 
                             onClick={() => removeAsset(i)}
                             className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-red-500 transition-colors z-20"
                           >
                             <X size={16} />
                           </button>
                         </>
                       ) : (
                         <div className="flex flex-col items-center justify-center gap-4 group/upload">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl group-hover/upload:bg-glow-blue/10 group-hover/upload:border-glow-blue/30 transition-all">
                              <ImageIcon className="w-8 h-8 text-[#A1A1A6] blur-[1px] group-hover/upload:blur-0 transition-all" />
                            </div>
                            <button 
                              onClick={() => triggerFrameUpload(i)}
                              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#86868B] hover:text-white hover:bg-white/10 transition-all"
                            >
                              Sync Asset
                            </button>
                         </div>
                       )}
                       
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 pointer-events-none" />
                    </div>
                    
                    <div className="md:col-span-8 space-y-6">
                       <div className="flex justify-between items-center bg-black/40 backdrop-blur-md border border-white/[0.05] shadow-inner px-6 py-4 rounded-2xl border-l-4 border-glow-blue">
                          <span className="text-xs font-black text-white uppercase tracking-widest">{frame.hook}</span>
                          <Zap className="w-4 h-4 text-glow-blue" />
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                             <p className="text-[10px] font-black uppercase tracking-widest text-[#86868B] flex items-center gap-2">
                               <RefreshCw className="w-3 h-3" /> Visual Direction
                             </p>
                             <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                               <p className="text-sm text-[#F5F5F7] leading-relaxed font-bold italic">"{frame.visual}"</p>
                             </div>
                          </div>
                          <div className="space-y-3">
                             <p className="text-[10px] font-black uppercase tracking-widest text-[#86868B] flex items-center gap-2">
                               <Sparkles className="w-3 h-3 text-glow-purple" /> Growth Factor
                             </p>
                             <div className="p-5 bg-glow-purple/10 border border-glow-purple/20 rounded-2xl text-[11px] text-glow-purple italic font-bold leading-relaxed">
                               "{frame.tip}"
                             </div>
                          </div>
                       </div>
 
                       <div className="flex flex-wrap gap-4 pt-4">
                          <span className="flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#86868B]"><Scissors className="w-3.5 h-3.5" /> Fast Cut Path</span>
                          <span className="flex items-center gap-2.5 px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#86868B]"><Type className="w-3.5 h-3.5" /> Neural Overlay</span>
                          <button 
                            onClick={() => triggerFrameUpload(i)}
                            className="flex items-center gap-2.5 px-4 py-2 bg-glow-blue/10 border border-glow-blue/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-glow-blue hover:bg-glow-blue opacity-0 group-hover:opacity-100 transition-all hover:text-black"
                          >
                            <Upload className="w-3.5 h-3.5" /> Swap Node
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
