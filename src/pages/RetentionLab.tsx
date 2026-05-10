import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Brain, 
  Zap, 
  Clock, 
  Sparkles, 
  BarChart3, 
  Search,
  MessageCircle,
  Repeat,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ChevronDown,
  Info,
  Circle
} from 'lucide-react';
import { neuralLab, DiagnosisReport } from '@/src/services/neuralIntelligence';
import { cn } from '@/src/lib/utils';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function RetentionLab() {
  const [script, setScript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<DiagnosisReport | null>(null);

  const performNeuralAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const data = await neuralLab.analyzeContentPsychology("General Content", script, "YouTube");
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-1 bg-glow-blue/10 border border-glow-blue/30 rounded text-[10px] font-bold text-glow-blue tracking-widest uppercase">Experimental</div>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Retention Lab</h1>
          </div>
          <p className="text-[#86868B] font-medium text-xs md:text-sm tracking-widest uppercase">Neural Behavior Prediction & Psychological Scoring</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Input */}
        <div className="xl:col-span-4 bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-glow-blue/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                <Brain className="w-5 h-5 text-glow-blue" />
              </div>
              <div>
                <h3 className="font-black text-[10px] uppercase tracking-widest text-[#86868B]">Input Node</h3>
                <p className="text-sm font-bold text-white">Content Architecture</p>
              </div>
            </div>

            <textarea 
              placeholder="Paste your script, hook ideas, or video outline here for second-by-second psychological mapping..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="flex-1 w-full min-h-[400px] bg-black/40 border border-white/5 rounded-2xl p-6 font-bold text-sm focus:outline-none focus:border-glow-blue/50 focus:bg-black/60 transition-all resize-none leading-relaxed placeholder:text-[#333] shadow-inner mb-8"
            />

            <button 
              onClick={performNeuralAnalysis}
              disabled={isAnalyzing || !script}
              className="w-full py-5 bg-[#101010] border border-white/[0.08] rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed transform active:scale-[0.98] shadow-xl text-white flex items-center justify-center gap-3"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-glow-blue" />
                  Synthesizing Behavior...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-glow-blue" />
                  Analyze Retention Logic
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output */}
        <div className="xl:col-span-8 space-y-8">
          {!report && !isAnalyzing ? (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-[#101010]/40 backdrop-blur-xl border border-white/[0.05] rounded-[3rem] border-dashed">
               <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 animate-bounce cursor-default">
                  <Activity className="w-10 h-10 text-[#333]" />
               </div>
               <h3 className="text-xl font-bold text-[#86868B] mb-2 uppercase tracking-widest italic">Node Inactive</h3>
               <p className="text-sm text-[#333] font-bold max-w-sm tracking-wide">
                 Awaiting high-intent content data for behavioral mapping and second-by-second impact scoring.
               </p>
            </div>
          ) : isAnalyzing ? (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-center p-12 bg-[#101010]/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-[0_32_64px_rgba(0,0,0,0.8)]">
               <div className="relative mb-12">
                  <div className="w-48 h-48 border-t-4 border-glow-blue/50 rounded-full animate-spin duration-[1500ms]" />
                  <div className="w-32 h-32 border-b-4 border-glow-purple/50 rounded-full animate-spin duration-[2000ms] absolute top-8 left-8" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="w-12 h-12 text-glow-blue animate-pulse" />
                  </div>
               </div>
               <h3 className="text-2xl font-black text-white italic uppercase tracking-[0.2em] mb-4">Neural Mapping</h3>
               <div className="space-y-2 opacity-50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#86868B] animate-pulse">Scanning Hook Vectors...</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#86868B] animate-pulse delay-75">Predicting Viewer Satisfaction...</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#86868B] animate-pulse delay-150">Analyzing Storytelling Quality...</p>
               </div>
            </div>
          ) : (
            <AnimatePresence>
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-8"
               >
                  {/* Top Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Neural Score', value: report?.overallScore, trend: 'Diagnostic', icon: Activity, color: 'text-glow-blue' },
                      { label: 'Viral Probability', value: `${(report?.viralProbability || 0 * 100).toFixed(0)}%`, trend: 'Algorithmic', icon: Zap, color: 'text-glow-purple' },
                      { label: 'Retention Peak', value: report?.retentionEstimate, trend: 'Predictive', icon: Clock, color: 'text-white' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 shadow-xl group">
                         <div className="flex justify-between items-start mb-6">
                            <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center rounded-xl group-hover:bg-white/10 transition-colors">
                               <stat.icon className={cn("w-5 h-5", stat.color)} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B]">{stat.trend}</span>
                         </div>
                         <p className="text-4xl font-black text-white tracking-tighter mb-1 italic">{stat.value}</p>
                         <p className="text-xs font-black uppercase tracking-widest text-[#86868B]">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Diagnosis Report */}
                  <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                     <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-black text-sm uppercase tracking-widest text-white italic">Neural Diagnosis</h3>
                     </div>
                     <p className="text-lg font-bold text-white leading-relaxed italic border-l-4 border-glow-blue pl-6 py-2 bg-glow-blue/5 rounded-r-2xl">
                        "{report?.diagnosis}"
                     </p>
                  </div>

                  {/* Retention Curve Map */}
                  <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] p-8 shadow-2xl">
                     <div className="flex justify-between items-center mb-10">
                        <div>
                          <h3 className="font-black text-sm uppercase tracking-widest text-white italic mb-1">Retention Impact Map</h3>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#86868B]">Predictive Second-By-Second Flow</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="flex items-center gap-2">
                             <Circle className="w-2.5 h-2.5 fill-glow-blue text-glow-blue" />
                             <span className="text-[10px] font-black uppercase text-[#86868B]">Attention</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="h-[250px] w-full relative min-w-0 min-h-0">
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                           <AreaChart data={[
                             { time: 0, val: 100 }, { time: 5, val: 85 }, { time: 15, val: 78 }, { time: 30, val: 82 }, { time: 45, val: 65 }, { time: 60, val: 75 }
                           ]}>
                              <defs>
                                <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="val" stroke="#00f2ff" fill="url(#areaColor)" strokeWidth={3} />
                              <XAxis dataKey="time" hide />
                              <RechartsTooltip contentStyle={{ backgroundColor: '#101010', border: '1px solid #333', fontSize: '10px' }} />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>

                     <div className="mt-8 space-y-4">
                        {report?.timeline.map((node, i) => (
                           <div key={i} className="flex gap-6 items-start group">
                              <div className="pt-1">
                                 <div className={cn(
                                   "w-2 h-2 rounded-full",
                                   node.impact === 'positive' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : 
                                   node.impact === 'negative' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-white/20"
                                 )} />
                              </div>
                              <div className="flex-1 pb-6 border-b border-white/5 space-y-2">
                                 <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-white tracking-widest">{node.timestamp} Node</span>
                                    <span className="text-[9px] font-bold text-[#86868B] uppercase tracking-[0.2em]">{node.impact} impact</span>
                                 </div>
                                 <p className="text-sm font-bold text-white group-hover:text-glow-blue transition-colors">"{node.insight}"</p>
                                 <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/5 rounded-xl">
                                    <Sparkles className="w-3.5 h-3.5 text-glow-purple" />
                                    <p className="text-xs font-bold text-glow-purple italic">{node.recommendation}</p>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Scoring Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {report?.scores.map((score, i) => (
                        <div key={i} className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] p-8 rounded-[2rem] shadow-xl hover:border-glow-blue/20 transition-all group">
                           <div className="flex justify-between items-center mb-6">
                              <h4 className="font-black text-xs uppercase tracking-widest text-white group-hover:text-glow-blue transition-colors">{score.category}</h4>
                              <div className="flex items-center gap-2">
                                 <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-glow-blue group-hover:shadow-[0_0_10px_#00f2ff]" style={{ width: `${score.score}%` }} />
                                 </div>
                                 <span className="text-sm font-black italic">{score.score}</span>
                              </div>
                           </div>
                           <p className="text-xs font-bold text-[#86868B] leading-relaxed mb-6 group-hover:text-white transition-colors">
                              {score.explanation}
                           </p>
                           <div className="p-4 bg-glow-blue/5 border border-glow-blue/20 rounded-2xl flex items-start gap-3">
                              <CheckCircle2 className="w-4 h-4 text-glow-blue shrink-0 mt-0.5" />
                              <p className="text-xs font-bold text-white leading-relaxed">
                                 <span className="text-glow-blue uppercase mr-2">Actionable Fix:</span>
                                 {score.fix}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
