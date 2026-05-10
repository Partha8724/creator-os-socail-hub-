import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  TrendingUp, 
  MessageSquare, 
  Video, 
  Image as ImageIcon,
  Activity,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Info,
  Download,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNotify } from '@/src/contexts/NotificationContext';

type ArchitectTask = 'PREDICTIVE_TREND_ANALYSIS' | 'AGENTIC_ENGAGEMENT' | 'CONTENT_REPURPOSING' | 'THUMBNAIL_VISION';

interface ArchitectResponse {
  feature_type: string;
  prediction_score: number;
  actionable_steps: string[];
  ai_draft: string;
  reasoning: string;
}

export default function GrowthArchitect() {
  const { notify } = useNotify();
  const [activeTask, setActiveTask] = useState<ArchitectTask>('PREDICTIVE_TREND_ANALYSIS');
  const [inputData, setInputData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ArchitectResponse | null>(null);

  const tasks = [
    {
      id: 'PREDICTIVE_TREND_ANALYSIS',
      title: 'Predictive Trend Analysis',
      icon: TrendingUp,
      desc: 'Predict Viral Gaps before they peak on YouTube.',
      placeholder: 'Enter search keywords, TikTok trends, or X topics to analyze...',
      color: 'text-glow-blue',
      bgHover: 'hover:bg-glow-blue/10',
      activeBorder: 'border-glow-blue'
    },
    {
      id: 'AGENTIC_ENGAGEMENT',
      title: 'Agentic Engagement',
      icon: MessageSquare,
      desc: 'Categorize comments & draft creator-voice replies.',
      placeholder: 'Paste recent YouTube comments here...',
      color: 'text-glow-purple',
      bgHover: 'hover:bg-glow-purple/10',
      activeBorder: 'border-glow-purple'
    },
    {
      id: 'CONTENT_REPURPOSING',
      title: 'Content Repurposing',
      icon: Video,
      desc: 'Extract Hooks & Value Bombs for vertical Shorts.',
      placeholder: 'Paste the transcript of your long-form video...',
      color: 'text-emerald-400',
      bgHover: 'hover:bg-emerald-400/10',
      activeBorder: 'border-emerald-400'
    },
    {
      id: 'THUMBNAIL_VISION',
      title: 'Thumbnail Vision',
      icon: ImageIcon,
      desc: 'Evaluate visual CTR & get specific changes.',
      placeholder: 'Describe your thumbnail concept or provide image metadata...',
      color: 'text-amber-400',
      bgHover: 'hover:bg-amber-400/10',
      activeBorder: 'border-amber-400'
    }
  ];

  const handleAnalyze = async () => {
    if (!inputData.trim()) {
      notify("Please provide context data for the Architect to analyze.", "error");
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const response = await fetch('/api/growth/architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: activeTask, context_data: inputData })
      });

      if (!response.ok) {
        throw new Error('Neural network error or rate limit hit.');
      }

      const data = await response.json();
      setResult(data);
      notify("Architect analysis complete.", "success");
    } catch (err: any) {
      console.error(err);
      notify("Failed to generate insights: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const activeTaskData = tasks.find(t => t.id === activeTask)!;
  const ActiveIcon = activeTaskData.icon;

  const handleDownloadReport = () => {
    if (!result) return;
    
    const reportData = {
      module: activeTaskData.title,
      timestamp: new Date().toLocaleString(),
      input_context: inputData,
      analysis_results: result
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `ImpactIRL_Report_${activeTaskData.title.replace(/\s+/g, '_')}_${Date.now()}.json`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    notify("Digital report exported to device.", "success");
  };

  return (
    <div className="flex flex-col h-full bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] animate-in fade-in duration-1000 p-6 md:p-10 overflow-y-auto rounded-[3rem] font-sans selection:bg-glow-purple/30 selection:text-white m-4 relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-glow-purple/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-glow-blue/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      
      <header className="mb-10 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 flex items-center gap-4">
           Growth Architect <BrainCircuit className="w-8 h-8 text-glow-purple" />
        </h1>
        <p className="text-[#A1A1A6] font-medium text-sm tracking-wide max-w-3xl leading-relaxed">
          The backend brain for your creator growth. Utilize raw social data to build strategies that outperform traditional tools. Select a neural module below.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Sidebar Tasks */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Architect Modules</h3>
          {tasks.map((task) => (
             <button
               key={task.id}
               onClick={() => { setActiveTask(task.id as ArchitectTask); setResult(null); setInputData(''); }}
               className={cn(
                 "w-full text-left p-5 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group shadow-lg",
                 activeTask === task.id ? `bg-[#101010]/90 backdrop-blur-xl ${task.activeBorder} shadow-[0_8_32px_rgba(0,0,0,0.5)]` : "bg-black/40 backdrop-blur-md border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]"
               )}
             >
                {activeTask === task.id && (
                  <div className={cn("absolute inset-0 opacity-10 mix-blend-screen", task.color.replace('text-', 'bg-'))} />
                )}
                <div className="flex items-center gap-4 relative z-10">
                   <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border",
                      activeTask === task.id ? `border-${task.color.split('-')[1]}/30 bg-${task.color.split('-')[1]}/10` : "bg-white/5 border-white/10 group-hover:bg-white/10"
                   )}>
                      <task.icon className={cn("w-5 h-5", activeTask === task.id ? task.color : "text-[#A1A1A6]")} />
                   </div>
                   <div>
                     <h4 className={cn("font-bold text-sm mb-1", activeTask === task.id ? "text-white" : "text-[#A1A1A6]")}>{task.title}</h4>
                     <p className="text-[10px] text-[#86868B] leading-tight pr-4">{task.desc}</p>
                   </div>
                </div>
             </button>
          ))}
        </div>

        {/* Main Work Area */}
        <div className="lg:col-span-8 relative z-10">
           <div className="bg-[#101010]/90 backdrop-blur-2xl border border-white/[0.08] rounded-[3rem] p-8 md:p-12 shadow-[0_16_64px_rgba(0,0,0,0.6)] relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <ActiveIcon className={cn("w-6 h-6", activeTaskData.color)} />
                    <h2 className="text-xl font-bold text-white tracking-wide">{activeTaskData.title}</h2>
                 </div>
                 {isProcessing && <RefreshCw className="w-5 h-5 text-[#A1A1A6] animate-spin" />}
              </div>

              <div className="flex-1 flex flex-col gap-6">
                 <div className="relative flex-1 min-h-[200px]">
                    <textarea 
                       value={inputData}
                       onChange={(e) => setInputData(e.target.value)}
                       placeholder={activeTaskData.placeholder}
                       className="w-full h-full min-h-[250px] bg-black/60 backdrop-blur-md border border-white/[0.08] rounded-[2rem] p-8 text-sm text-[#F5F5F7] placeholder:text-[#86868B] focus:outline-none focus:border-glow-purple/50 focus:bg-black/80 transition-all resize-none shadow-inner leading-relaxed"
                    />
                    <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                       <Sparkles className="w-4 h-4 text-glow-purple animate-pulse" />
                       <span className="text-xs font-bold text-glow-purple uppercase tracking-widest">AI Assisted</span>
                    </div>
                 </div>

                 <button
                    onClick={handleAnalyze}
                    disabled={isProcessing || !inputData.trim()}
                    className={cn(
                       "w-full py-5 rounded-[2rem] font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3",
                       isProcessing 
                         ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                         : "bg-[#101010] backdrop-blur-xl border border-white/[0.08] text-white hover:bg-white hover:text-black active:scale-[0.98] shadow-[0_8_32px_rgba(0,0,0,0.5)]"
                    )}
                 >
                    {isProcessing ? "Analyzing Neural Data..." : "Run Architect Evaluation"}
                    {!isProcessing && <ChevronRight className="w-5 h-5" />}
                 </button>

                 <AnimatePresence>
                    {result && (
                       <motion.div 
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] p-8 md:p-10 mt-6 overflow-hidden relative shadow-[0_16_64px_rgba(0,0,0,0.6)]"
                       >
                          {/* JSON Response Representation */}
                          <div className="flex items-center justify-between gap-3 mb-6 pb-6 border-b border-white/10">
                             <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-400" />
                                <h3 className="text-lg font-bold text-white">Architect Output Generated</h3>
                             </div>
                             <button
                                onClick={handleDownloadReport}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all group"
                             >
                                <Download className="w-4 h-4 text-glow-purple group-hover:scale-110 transition-transform" />
                                Download Report
                             </button>
                          </div>

                          <div className="space-y-6">
                             {/* Prediction Score */}
                             <div className="flex items-center justify-between bg-black/30 p-4 rounded-xl border border-white/5">
                                <span className="text-xs font-bold text-[#A1A1A6] uppercase tracking-widest">Confidence / Prediction Score</span>
                                <div className="flex items-baseline gap-1">
                                   <span className={cn(
                                      "text-2xl font-black",
                                      result.prediction_score > 80 ? "text-green-400" : (result.prediction_score > 50 ? "text-amber-400" : "text-red-400")
                                   )}>
                                      {result.prediction_score}
                                   </span>
                                   <span className="text-xs text-[#86868B]">/100</span>
                                </div>
                             </div>

                             {/* Actionable Steps */}
                             <div>
                                <h4 className="text-xs font-bold text-[#A1A1A6] uppercase tracking-widest mb-3">Actionable Steps</h4>
                                <ul className="space-y-3">
                                   {result.actionable_steps.map((step, idx) => (
                                      <li key={idx} className="flex gap-4 items-start bg-black/20 p-4 rounded-xl border border-white/5">
                                         <span className="w-6 h-6 bg-white/10 rounded flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</span>
                                         <p className="text-sm text-white/90 leading-relaxed font-medium">{step}</p>
                                      </li>
                                   ))}
                                </ul>
                             </div>

                             {/* AI Draft */}
                             {result.ai_draft && (
                                <div>
                                   <h4 className="text-xs font-bold text-[#A1A1A6] uppercase tracking-widest mb-3">AI Draft / Outcome</h4>
                                   <div className="bg-glow-blue/5 border border-glow-blue/20 p-5 rounded-xl">
                                      <p className="text-sm text-white leading-relaxed font-mono whitespace-pre-wrap">{result.ai_draft}</p>
                                   </div>
                                </div>
                             )}

                             {/* Reasoning */}
                             <div>
                                <h4 className="text-xs font-bold text-[#A1A1A6] uppercase tracking-widest mb-3 flex items-center gap-2">
                                   <Info className="w-4 h-4" /> Reasoning
                                </h4>
                                <p className="text-sm text-[#A1A1A6] leading-relaxed italic border-l-2 border-white/20 pl-4">{result.reasoning}</p>
                             </div>

                             <div className="mt-8 pt-4 border-t border-white/10">
                                <details className="text-xs text-[#86868B]">
                                   <summary className="cursor-pointer hover:text-white transition-colors">View Raw JSON Payload</summary>
                                   <pre className="mt-4 p-4 bg-black rounded-lg overflow-x-auto border border-white/5 text-[10px] text-emerald-400 font-mono">
                                      {JSON.stringify(result, null, 2)}
                                   </pre>
                                </details>
                             </div>
                          </div>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
