import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layers,
  Search,
  Filter,
  Youtube,
  Instagram,
  Facebook,
  Smartphone,
  Eye,
  MessageSquare,
  Share2,
  Edit3,
  MoreVertical,
  Plus,
  Zap,
  TrendingUp,
  FileText,
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { gemini } from '@/src/services/gemini';

interface ContentNode {
  id: string;
  title: string;
  platform: 'YouTube' | 'Instagram' | 'Facebook' | 'TikTok';
  status: 'Published' | 'Scheduled' | 'Draft';
  date: string;
  views: string;
  engagement: string;
  thumbnail: string;
}

export default function ContentNodes() {
  const [nodes, setNodes] = useState<ContentNode[]>([
    { id: '1', title: 'The Future of Smart Programming', platform: 'YouTube', status: 'Published', date: '2024-03-15', views: '24.5K', engagement: '1.2K', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80' },
    { id: '2', title: 'Why 2024 belongs to AI', platform: 'Instagram', status: 'Published', date: '2024-03-14', views: '45.1K', engagement: '4.5K', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80' },
    { id: '3', title: 'Mastering the Hub Workflow', platform: 'TikTok', status: 'Scheduled', date: '2024-03-18', views: '0', engagement: '0', thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4628c6827?w=400&q=80' },
  ]);

  const [selectedNode, setSelectedNode] = useState<ContentNode | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);

  const analyzeContent = async (node: ContentNode) => {
    setSelectedNode(node);
    setIsAnalyzing(true);
    try {
      const result = await gemini.analyzeYouTubeSEO(node.title, "AI content optimization for creators.");
      setSuggestion(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight  mb-2">Omni-Nodes</h1>
          <p className="text-[#A1A1A6] font-medium text-xs md:text-sm  tracking-wide italic">Multi-Platform Content Management Grid</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
          <div className="relative group flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1A6] group-focus-within:text-glow-blue transition-colors" />
             <input 
               type="text" 
               placeholder="Search nodes..." 
               className="w-full bg-[#151515] border border-apple-glass-border pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-glow-blue/30"
             />
          </div>
          <button className="smart-card px-6 py-2.5 flex items-center justify-center gap-2 hover:bg-[#1C1C1E] border border-apple-glass-border hover:text-[#1C1C1E] transition-all">
            <Plus className="w-4 h-4" />
            <span className="text-xs font-bold  tracking-wide">Deploy New Node</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 flex flex-col space-y-6">
          <div className="flex items-center gap-4 bg-[#151515] border border-apple-glass-border p-2 border border-white/10">
            {['All Nodes', 'YouTube', 'Socials', 'Drafts'].map((f) => (
              <button key={f} className={cn(
                "px-4 py-2 text-xs font-medium  tracking-normal transition-all",
                f === 'All Nodes' ? "text-glow-blue border-b border-glow-blue/30" : "text-[#A1A1A6] hover:text-[#A1A1A6]"
              )}>{f}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nodes.map((node, i) => (
              <motion.div 
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "smart-card overflow-hidden group border-white/10 hover:border-glow-blue/50 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,242,255,0.15)] hover:z-10 relative transition-all duration-300 cursor-pointer",
                  selectedNode?.id === node.id && "border-glow-blue/50 shadow-[0_0_20px_rgba(0,242,255,0.15)] ring-1 ring-glow-blue/50 scale-[1.02] z-10"
                )}
                onClick={() => setSelectedNode(node)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img src={node.thumbnail} alt={node.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/20 to-transparent opacity-80" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60  rounded-none border border-white/10">
                    <span className="text-xs font-medium text-[#A1A1A6]  tracking-normal">{node.platform} Node</span>
                  </div>
                  {node.status === 'Scheduled' && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-glow-purple/10 ">
                      <span className="text-xs font-black text-[#A1A1A6]  italic tracking-tight">Waitlisted</span>
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-sm line-clamp-2 leading-tight tracking-normal  group-hover:text-glow-blue transition-colors">{node.title}</h4>
                    <button className="text-[#A1A1A6] hover:text-[#A1A1A6] transition-colors"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 group/stat">
                        <Eye className="w-4 h-4 text-[#A1A1A6] group-hover/stat:text-glow-blue transition-colors" />
                        <span className="text-xs font-medium text-[#A1A1A6]">{node.views}</span>
                      </div>
                      <div className="flex items-center gap-2 group/stat">
                        <Share2 className="w-4 h-4 text-[#A1A1A6] group-hover/stat:text-glow-blue transition-colors" />
                        <span className="text-xs font-medium text-[#A1A1A6]">{node.engagement}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); analyzeContent(node); }}
                      className="px-4 py-2 text-xs font-medium  tracking-normal text-[#A1A1A6] border border-white/10 hover:border-glow-blue/30 hover:text-glow-blue bg-[#151515] border border-apple-glass-border transition-all transform active:scale-95"
                    >
                      Audit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="sticky top-8 space-y-6">
            {!selectedNode ? (
              <div className="smart-card p-8 h-[500px] flex flex-col items-center justify-center text-center border-dashed border-white/10 opacity-40">
                <Layers className="w-12 h-12 text-[#A1A1A6] mb-6" />
                <p className="text-xs font-medium  tracking-wide">Select a Content Node<br/>for Deep Analysis</p>
              </div>
            ) : (
              <motion.div 
                layoutId="nodeDetail"
                className="smart-card p-6 md:p-8 space-y-8 bg-[#1C1C1E] border border-apple-glass-border "
              >
                <header className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-glow-blue  tracking-normal font-bold">{selectedNode.platform} Analysis</p>
                    <h3 className="font-bold text-lg leading-tight  max-w-[200px]">{selectedNode.title}</h3>
                  </div>
                  <div className={cn(
                    "p-2 rounded-sm",
                    selectedNode.platform === 'YouTube' ? "bg-red-500/10 text-red-500" : "bg-pink-500/10 text-pink-500"
                  )}>
                    {selectedNode.platform === 'YouTube' ? <Youtube className="w-5 h-5" /> : <Instagram className="w-5 h-5" />}
                  </div>
                </header>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#151515] border border-apple-glass-border space-y-2">
                    <p className="text-xs font-medium text-[#A1A1A6] ">Optimization</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold tracking-tight">84</span>
                      <span className="text-xs font-medium text-glow-blue">/100</span>
                    </div>
                  </div>
                  <div className="p-4 bg-[#151515] border border-apple-glass-border space-y-2">
                    <p className="text-xs font-medium text-[#A1A1A6] ">Algorithm Potential</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold tracking-tight text-glow-purple">High</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                   <h5 className="text-xs font-medium  tracking-wide text-[#A1A1A6] flex items-center gap-2">
                     <Zap className="w-3 h-3 text-glow-blue" />
                     Smart Suggestions
                   </h5>
                   
                   {isAnalyzing ? (
                     <div className="flex flex-col gap-4 py-8 animate-pulse">
                        <div className="h-4 bg-[#151515] border border-apple-glass-border w-full" />
                        <div className="h-4 bg-[#151515] border border-apple-glass-border w-3/4" />
                        <div className="h-4 bg-[#151515] border border-apple-glass-border w-1/2" />
                     </div>
                   ) : suggestion ? (
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <p className="text-xs font-medium  text-[#A1A1A6]">Optimized Title Node</p>
                           <p className="text-xs text-glow-blue/80 italic font-medium leading-relaxed">"{suggestion.optimizedTitle}"</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-xs font-medium  text-[#A1A1A6]">Heat Map Tags</p>
                           <div className="flex flex-wrap gap-2">
                              {suggestion.heatMapKeywords?.slice(0, 5).map((tag: string) => (
                                <span key={tag} className="px-2 py-1 bg-[#151515] border border-apple-glass-border text-xs font-medium text-[#A1A1A6]">#{tag}</span>
                              ))}
                           </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#1C1C1E] border border-apple-glass-border font-black  tracking-wide text-xs hover:bg-glow-blue/10 transition-all">
                           <Edit3 className="w-3 h-3" />
                           Commit to Node
                        </button>
                     </div>
                   ) : (
                     <p className="text-xs text-[#A1A1A6] italic">Click "AI Optimization" on a node to begin generation.</p>
                   )}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4">
                  <button className="flex flex-col items-center gap-2 p-3 bg-[#151515] border border-apple-glass-border hover:bg-[#151515] border border-apple-glass-border transition-colors group">
                    <FileText className="w-4 h-4 text-[#A1A1A6] group-hover:text-glow-blue" />
                    <span className="text-[7px] font-medium  text-[#A1A1A6]">Desc</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-3 bg-[#151515] border border-apple-glass-border hover:bg-[#151515] border border-apple-glass-border transition-colors group">
                    <ImageIcon className="w-4 h-4 text-[#A1A1A6] group-hover:text-glow-blue" />
                    <span className="text-[7px] font-medium  text-[#A1A1A6]">Thumb</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-3 bg-[#151515] border border-apple-glass-border hover:bg-[#151515] border border-apple-glass-border transition-colors group">
                    <Tag className="w-4 h-4 text-[#A1A1A6] group-hover:text-glow-blue" />
                    <span className="text-[7px] font-medium  text-[#A1A1A6]">Tags</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
