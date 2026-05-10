import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { io, Socket } from 'socket.io-client';
import { 
  Zap, 
  Activity, 
  BarChart3, 
  Share2, 
  ArrowUpRight,
  RefreshCw,
  Circle,
  Eye,
  Target,
  Sparkles,
  ChevronRight,
  Youtube,
  Instagram,
  Facebook,
  Smartphone,
  X
} from 'lucide-react';
import { gemini } from '@/src/services/gemini';
import { cn } from '@/src/lib/utils';
import { useUser } from '@/src/contexts/UserContext';
import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';
import VidIQAnalytics from './VidIQAnalytics';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Brush
} from 'recharts';

const INITIAL_DATA = [
  { name: 'Jan', reach: 4000, viral: 2400 },
  { name: 'Feb', reach: 3000, viral: 1398 },
  { name: 'Mar', reach: 2000, viral: 9800 },
  { name: 'Apr', reach: 2780, viral: 3908 },
  { name: 'May', reach: 1890, viral: 4800 },
  { name: 'Jun', reach: 2390, viral: 3800 },
  { name: 'Jul', reach: 3490, viral: 4300 },
];

const PLATFORM_DATA = [
  { name: 'YouTube', engagement: 6500, retention: 85 },
  { name: 'Instagram', engagement: 8200, retention: 60 },
  { name: 'Facebook', engagement: 4300, retention: 45 },
  { name: 'TikTok', engagement: 9100, retention: 55 },
];

const AUDIENCE_DATA = [
  { name: '18-24', value: 400 },
  { name: '25-34', value: 300 },
  { name: '35-44', value: 150 },
  { name: '45+', value: 50 },
];

const COLORS = ['#00f2ff', '#bc13fe', '#3b82f6', '#10b981'];

export default function Dashboard() {
  const { profile } = useUser();
  const isFree = profile?.tier === 'free';
  const [isSyncing, setIsSyncing] = useState(false);
  const [trends, setTrends] = useState<any[]>([]);
  const [chartData, setChartData] = useState(INITIAL_DATA);
  const [selectedAnalyticsNode, setSelectedAnalyticsNode] = useState<string | null>(null);
  const [realTimeLogs, setRealTimeLogs] = useState<any[]>([
    { time: '12:04:21', msg: 'Smart Sync success on YouTube node', status: 'OK' },
    { time: '12:02:10', msg: 'Algorithm shift detected in Meta platform', status: 'WARN' },
    { time: '11:58:34', msg: 'Growth strategy synthesized for @handle', status: 'SYNC' },
    { time: '11:55:01', msg: 'Orbital proxy rotation complete', status: 'OK' },
  ]);
  const { scrollY } = useScroll();

  useEffect(() => {
    const socket: Socket = io(window.location.origin, { transports: ['websocket', 'polling'], autoConnect: true });
    
    socket.on('intelligence_update', (node: any) => {
      setRealTimeLogs(prev => {
        const newLog = {
          time: node.timestamp,
          msg: node.message,
          status: node.type === 'ALGORITHM_SHIFT' ? 'WARN' : node.type === 'SYNC_SUCCESS' ? 'OK' : 'SYNC'
        };
        return [newLog, ...prev].slice(0, 4);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  const y1 = useTransform(scrollY, [0, 500], [0, -50]);
  const y2 = useTransform(scrollY, [0, 500], [0, 50]);
  const bgY = useTransform(scrollY, [0, 1000], ['0%', '30%']);

  useEffect(() => {
    fetchTrends();
  }, []);

  useEffect(() => {
    if (isFree) return;
    let tick = 0;
    const interval = setInterval(() => {
      setChartData(current => {
        const newData = [...current.slice(1)];
        const lastNode = current[current.length - 1];
        tick++;
        newData.push({
          name: `T${tick}`,
          reach: Math.max(1000, lastNode.reach + (Math.random() - 0.5) * 2000),
          viral: Math.max(500, lastNode.viral + (Math.random() - 0.5) * 3000),
        });
        return newData;
      });
    }, 2000); // holographic pulse every 2 seconds
    return () => clearInterval(interval);
  }, [isFree]);

  const fetchTrends = async () => {
    setIsSyncing(true);
    try {
      const data = await gemini.getDailyTrends();
      setTrends(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-12 pb-24 relative overflow-x-hidden font-sans selection:bg-glow-blue/30 selection:text-white">
      {/* Parallax Decorative Elements */}
      <motion.div 
        style={{ y: bgY }} 
        className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-0 left-0 right-0 h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-glow-blue/20 via-[#101010]/0 to-transparent blur-[100px]" />
      </motion.div>
      <motion.div style={{ y: y1 }} className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-glow-blue/15 blur-[150px] rounded-full pointer-events-none z-0" />
      <motion.div style={{ y: y2 }} className="absolute top-1/2 -left-48 w-[500px] h-[500px] bg-glow-purple/15 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

      {/* Header with Linked Accounts HUD */}
      <header className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-8 relative z-10">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-2">Smart Hub</h1>
          <div className="flex items-center gap-4">
            <p className="text-[#A1A1A6] font-medium text-xs md:text-sm">Intelligence Stream Overview</p>
            <div className="h-[1px] w-24 bg-white/10 hidden md:block" />
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
              <span className="text-xs font-medium text-green-500">Nodes Active</span>
            </div>
          </div>
        </motion.div>
        
        <div className="flex flex-wrap gap-4">
          <div className="bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_4_24px_rgba(0,0,0,0.5)] rounded-2xl py-2 px-1 flex divide-x divide-white/[0.08]">
            {[
              { icon: Youtube, color: 'text-red-500', count: '124K', name: 'YouTube' },
              { icon: Instagram, color: 'text-pink-500', count: '45K', name: 'Instagram' },
              { icon: Smartphone, color: 'text-cyan-500', count: '89K', name: 'TikTok' },
              { icon: X, color: 'text-[#E7E9EA]', count: '32K', name: 'X (Twitter)' },
              { icon: Facebook, color: 'text-blue-500', count: '210K', name: 'Facebook' }
            ].map((node, i) => (
              <div 
                key={i} 
                className="px-4 flex items-center gap-3 group cursor-pointer hover:bg-white/5 transition-all duration-300 rounded-xl"
                onClick={() => setSelectedAnalyticsNode(node.name)}
              >
                <node.icon className={cn("w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300", node.color)} />
                <span className="text-xs font-semibold tracking-tight text-white group-hover:text-glow-blue transition-colors">{node.count}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={fetchTrends}
            className={cn(
              "px-6 py-3 flex items-center justify-center gap-3 group transition-all active:scale-[0.98] bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl hover:bg-white/10 hover:border-white/20 shadow-[0_4_24px_rgba(0,0,0,0.5)]",
              isSyncing && "animate-pulse"
            )}
          >
            <RefreshCw className={cn("w-4 h-4 text-glow-blue", isSyncing && "animate-spin")} />
            <span className="text-xs font-semibold tracking-wide">Global Sync</span>
          </button>
        </div>
      </header>

      {/* Neural Growth Diagnosis Array */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
        {[ 
          { label: 'Retention Health', value: '82%', trend: '+4%', icon: Activity, color: 'text-glow-blue', diagnosis: 'Intro retention stable. Mid-roll drop slightly elevated.' },
          { label: 'Viral Probability', value: 'High', trend: '94%', icon: Zap, color: 'text-glow-purple', diagnosis: 'Current trend matching detected in niche clusters.' },
          { label: 'Growth Catalyst', value: 'x2.4', trend: '+14%', icon: Sparkles, color: 'text-amber-500', diagnosis: 'Subscriber conversion per view is above baseline.' },
          { label: 'Market Velocity', value: 'Agile', trend: 'Top 5%', icon: Target, color: 'text-glow-blue', diagnosis: 'Your upload frequency matches current market demand.' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ delay: i * 0.1 }}
            className="smart-card p-6 flex flex-col justify-between group overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/[0.08] transition-all duration-300 shadow-inner group-hover:scale-110">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className="text-right">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-glow-blue border border-glow-blue/20 bg-glow-blue/5 rounded-full px-3 py-1 backdrop-blur-md shadow-[0_0_15px_rgba(0,242,255,0.1)]">{stat.trend}</span>
                 <p className="text-[9px] text-[#333] font-bold mt-1 uppercase tracking-tighter">Status: Active</p>
              </div>
            </div>
            <div>
               <p className="text-4xl font-black tracking-tighter mb-1 text-white italic">{stat.value}</p>
               <p className="text-[10px] font-black uppercase text-[#86868B] tracking-widest mb-4">{stat.label}</p>
               <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] font-bold text-[#333] leading-tight italic group-hover:text-[#86868B] transition-colors line-clamp-2">
                     "{stat.diagnosis}"
                  </p>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Column: Analytics */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="font-semibold tracking-tight flex items-center gap-2 text-lg text-white">
                  <Activity className="w-5 h-5 text-glow-blue" />
                  Smart Impact Platform
                </h3>
                <p className="text-sm font-medium text-[#86868B] tracking-wide mt-1">Global Generation Performance Mapping</p>
              </div>
              <div className="flex gap-4 text-xs font-medium  text-[#A1A1A6]">
                <span className="flex items-center gap-1"><Circle className="w-2 h-2 fill-primary-blue text-glow-blue" /> Reach</span>
                <span className="flex items-center gap-1"><Circle className="w-2 h-2 fill-primary-indigo text-glow-purple" /> Impact</span>
              </div>
            </div>
            <div className="h-[350px] w-full relative min-h-[350px]">
              <div className={cn("h-full w-full relative transition-all duration-700 min-w-0 min-h-0", isFree && "blur-xl grayscale opacity-20 select-none pointer-events-none")}>
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#151515', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Inter', fontSize: '12px', color: '#F5F5F7' }}
                      itemStyle={{ textTransform: 'capitalize' }}
                    />
                    <XAxis dataKey="name" stroke="#A1A1A6" fontSize={10} tickLine={false} axisLine={false} fontFamily="Inter" />
                    <Area 
                      type="monotone" 
                      dataKey="reach" 
                      stroke="#00f2ff" 
                      fillOpacity={1} 
                      fill="url(#colorReach)" 
                      strokeWidth={2} 
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="viral" 
                      stroke="#bc13fe" 
                      fillOpacity={1} 
                      fill="url(#colorImpact)" 
                      strokeWidth={2} 
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    />
                    <Brush 
                      dataKey="name" 
                      height={30} 
                      stroke="#A1A1A6" 
                      fill="rgba(255,255,255,0.05)"
                      tickFormatter={() => ''}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {isFree && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-[#A1A1A6]">
                  <Crown className="w-10 h-10 text-glow-blue mb-4 animate-smart-pulse" />
                  <h4 className="text-sm font-black  tracking-normal mb-2 font-medium">Smart Insights Locked</h4>
                  <p className="text-xs font-medium text-[#A1A1A6]  tracking-wide max-w-xs mb-6">
                    Connect to a Master Node to unlock real-time platform performance mapping and predictive analytics.
                  </p>
                  <Link 
                    to="/hub-upgrade" 
                    className="px-8 py-3 bg-[#1C1C1E] border border-apple-glass-border text-xs font-black  tracking-normal hover:bg-glow-blue/10 transition-all"
                  >
                    Upgrade Now
                  </Link>
                </div>
              )}
            </div>
            
            {/* Retention Psychology & Competitor Pulse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-white/5">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#F5F5F7] mb-1">Retention Psychology</h4>
                    <p className="text-[10px] uppercase font-bold text-[#A1A1A6] tracking-widest italic">Emotional Pulse Mapping</p>
                  </div>
                  <Sparkles className="w-4 h-4 text-glow-blue animate-pulse" />
                </div>
                <div className="h-[200px] w-full relative min-h-[200px]">
                  <div className={cn("h-full w-full relative transition-all duration-700 min-w-0 min-h-0", isFree && "blur-md grayscale opacity-40 select-none pointer-events-none")}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                      <AreaChart data={[
                        { name: 'Hook', val: 95 }, { name: 'Context', val: 72 }, { name: 'Story', val: 88 }, { name: 'Climax', val: 92 }, { name: 'CTA', val: 65 }
                      ]}>
                        <defs>
                          <linearGradient id="colorLab" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="val" stroke="#bc13fe" fill="url(#colorLab)" strokeWidth={3} />
                        <XAxis dataKey="name" stroke="#333" fontSize={10} tickLine={false} axisLine={false} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#101010', border: '1px solid #333' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="p-4 bg-glow-purple/5 border border-glow-purple/20 rounded-2xl">
                   <p className="text-[9px] font-black text-glow-purple uppercase italic">Strategy Patch:</p>
                   <p className="text-[11px] font-bold text-[#86868B] mt-1 leading-relaxed">
                     "Emotional syncing starts high but drops during context build. Inject curiosity gap at 0:24."
                   </p>
                </div>
              </div>
              
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[#F5F5F7] mb-1">Competitor Velocity</h4>
                    <p className="text-[10px] uppercase font-bold text-[#A1A1A6] tracking-widest italic">Target Niche Performance</p>
                  </div>
                  <Target className="w-4 h-4 text-red-500" />
                </div>
                <div className="space-y-4">
                   {[
                     { name: 'Rival A', reach: '+14%', color: 'bg-green-500' },
                     { name: 'Rival B', reach: '-2%', color: 'bg-red-500' },
                     { name: 'Rival C', reach: '+45%', color: 'bg-glow-blue' }
                   ].map((r, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group/r">
                        <span className="text-xs font-bold text-white uppercase italic">{r.name}</span>
                        <div className="flex items-center gap-3">
                           <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className={cn("h-full", r.color)} style={{ width: r.reach.includes('-') ? '20%' : '80%' }} />
                           </div>
                           <span className={cn("text-[10px] font-black italic", r.color.replace('bg-', 'text-'))}>{r.reach}</span>
                        </div>
                     </div>
                   ))}
                </div>
                <button className="w-full py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                  Deep Divergent Analysis
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
             <div className="relative z-10">
                <h3 className="text-xl font-semibold tracking-tight mb-2 text-white">Smart Node v4.1 Integration Pending</h3>
                <p className="text-[#A1A1A6] font-medium text-sm leading-relaxed max-w-md">
                   Update your platform connection to enable deep-core processing and unlimited generation cycles.
                </p>
             </div>
             <button className="relative z-10 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all active:scale-95 shadow-sm">
                Initialize Upgrade
             </button>
             <div className="absolute top-0 right-0 w-64 h-64 bg-glow-blue/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/studio" className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2rem] p-8 group flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div>
                <h4 className="text-lg font-semibold tracking-tight text-white mb-1">Creator Studio</h4>
                <p className="text-xs text-[#A1A1A6] font-medium">Generate scripts & thumbnails</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-white group-hover:scale-105 transition-all shadow-sm">
                <Zap size={20} className="group-hover:text-glow-blue transition-colors" />
              </div>
            </Link>
            <Link to="/keywords" className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2rem] p-8 group flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div>
                <h4 className="text-lg font-semibold tracking-tight text-white mb-1">SEO Intel</h4>
                <p className="text-xs text-[#A1A1A6] font-medium">Viral trend mapping</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-white group-hover:scale-105 transition-all shadow-sm">
                <Activity size={20} className="group-hover:text-glow-purple transition-colors" />
              </div>
            </Link>
          </div>

            {/* Setup / Onboarding Checklist */}
            <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 mt-8">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-6 font-sans">Recent Content Performance</h3>
              <div className="space-y-4">
                {[
                  { title: "I built a viral app in 24 hours", views: "1.2M", ctr: "8.4%", platform: "YouTube", growth: "+12%" },
                  { title: "The secret to 10k MRR", views: "450K", ctr: "6.2%", platform: "Facebook", growth: "+5%" },
                  { title: "AI tools you need in 2026", views: "890K", ctr: "12.1%", platform: "TikTok", growth: "+24%" }
                ].map((post, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all gap-4">
                     <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-1">{post.title}</h4>
                        <span className="text-[10px] font-bold tracking-widest text-[#A1A1A6] uppercase">{post.platform}</span>
                     </div>
                     <div className="flex items-center gap-6 shrink-0">
                        <div className="text-right">
                           <p className="text-xs font-medium text-[#A1A1A6]">Views</p>
                           <p className="text-sm font-bold text-white">{post.views}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-medium text-[#A1A1A6]">CTR</p>
                           <p className="text-sm font-bold text-white">{post.ctr}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-medium text-[#A1A1A6]">Growth</p>
                           <p className="text-sm font-bold text-green-500">{post.growth}</p>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
               <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8">
                 <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-6 font-sans">Revenue Estimation</h3>
                 <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-black text-white italic">$12,450</span>
                    <span className="text-sm font-bold text-[#A1A1A6] mb-1">/ mo</span>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs font-medium border-b border-white/5 pb-2">
                       <span className="text-[#A1A1A6]">YouTube AdSense</span>
                       <span className="text-white">$4,200</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium border-b border-white/5 pb-2">
                       <span className="text-[#A1A1A6]">Sponsorships</span>
                       <span className="text-white">$6,000</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium border-b border-white/5 pb-2">
                       <span className="text-[#A1A1A6]">Affiliate Links</span>
                       <span className="text-white">$2,250</span>
                    </div>
                 </div>
               </div>
               
               <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-6 font-sans">Audience Activity</h3>
                  <div className="h-[150px] w-full bg-[linear-gradient(180deg,rgba(0,242,255,0.1)_0%,transparent_100%)] rounded-2xl border border-glow-blue/20 relative overflow-hidden flex items-end justify-between px-4 pb-4">
                     {[30, 45, 20, 60, 80, 100, 70, 50, 40, 60, 90, 85].map((h, i) => (
                        <motion.div 
                           key={i}
                           initial={{ height: 0 }}
                           animate={{ height: `${h}%` }}
                           transition={{ delay: i * 0.05 }}
                           className="w-2 md:w-4 bg-glow-blue/80 rounded-t-sm"
                        />
                     ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                     <span className="text-[10px] font-bold tracking-widest text-glow-blue uppercase">Peak Time: 8PM - 10PM</span>
                     <span className="text-xs font-medium text-[#A1A1A6]">Mon - Fri</span>
                  </div>
               </div>
            </div>
          </div>

        {/* Right Column: Feed & Trends */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-xl border border-white/5 shadow-sm">
                <Zap className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <h3 className="font-semibold text-white tracking-tight text-sm">Growth Oracle</h3>
                <p className="text-xs font-medium text-[#A1A1A6]">Actionable Generation</p>
              </div>
            </div>
            
            <div className="space-y-4 flex-1">
              {trends.length > 0 ? (
                trends.slice(0, isFree ? 3 : undefined).map((trend, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 w-1 h-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-white/60">{trend.platformStrategy}</span>
                      <span className="text-xs font-semibold text-white">{trend.viralPotential}</span>
                    </div>
                    <p className="text-sm font-semibold tracking-tight mb-3 text-white line-clamp-1 group-hover:text-glow-blue transition-colors">{trend.topicName}</p>
                    <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full bg-glow-blue" style={{ width: trend.viralPotential }} />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-48 opacity-20 text-center border border-dashed border-white/10">
                   <Sparkles className="w-8 h-8 mb-4 animate-pulse text-glow-blue" />
                   <p className="text-xs font-medium  tracking-normal">Awaiting Generation</p>
                </div>
              )}
              {isFree && (
                <div className="p-4 border border-white/10 bg-[#151515] border border-apple-glass-border text-center">
                  <p className="text-xs font-medium text-[#A1A1A6]  tracking-normal mb-2">+ 20 More Platform Nodes Hidden</p>
                  <Link to="/hub-upgrade" className="text-xs font-medium text-glow-blue  hover:underline tracking-wide font-bold">Upgrade to View All</Link>
                </div>
              )}
            </div>

            <button className="w-full mt-8 py-3 bg-white/5 rounded-xl border border-white/5 font-semibold text-sm text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 active:scale-95">
              Sync All Nodes
              <RefreshCw className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-6">
            <h4 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#A1A1A6]" /> Live Platform Feed
            </h4>
            <div className="space-y-4">
               <AnimatePresence mode="popLayout">
                 {realTimeLogs.map((log, i) => (
                   <motion.div 
                     key={`${log.time}-${i}`} 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="flex gap-4 font-medium text-xs border-l border-white/10 pl-4 py-1 group"
                   >
                     <span className="text-[#A1A1A6] whitespace-nowrap group-hover:text-glow-blue transition-colors">{log.time}</span>
                     <span className="text-[#A1A1A6] lowercase line-clamp-1">{log.msg}</span>
                     <span className={cn(
                       "ml-auto font-black italic",
                       log.status === 'OK' ? 'text-glow-blue/40' : log.status === 'WARN' ? 'text-yellow-500/40' : 'text-glow-purple/40'
                     )}>{log.status}</span>
                   </motion.div>
                 ))}
               </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {/* Growth Oracle Insight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pb-24 relative z-10">
        {[
          { platform: 'YouTube', icon: Youtube, color: 'text-red-500', advice: 'Long-form retention up 12% for tech niches if hook is < 5s. Focus on macro-detail transitions.' },
          { platform: 'Instagram', icon: Instagram, color: 'text-pink-500', advice: 'Reel transitions via macro-zoom correlating with 3x reach. Audio synchronization at 128bpm optimal.' },
          { platform: 'Facebook', icon: Facebook, color: 'text-blue-500', advice: 'Community engagement nodes spiking for long-form video shares. Focus on controversy-based hooks.' }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 + 0.6 }}
            className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 hover:bg-white/[0.02] transition-colors group overflow-hidden relative"
          >
            <div className={cn("transition-all duration-700", isFree && "blur-md select-none pointer-events-none opacity-30")}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-12 -translate-y-12 transition-all opacity-0 group-hover:opacity-100" />
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 bg-white/5 border border-white/5 flex items-center justify-center rounded-xl shadow-sm transition-colors group-hover:bg-white/10">
                  <item.icon className={cn("w-6 h-6", item.color)} />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">{item.platform} Strategist</span>
                  <p className="text-xs font-medium text-[#A1A1A6]">Active growth mapping</p>
                </div>
              </div>
              <p className="text-sm text-[#A1A1A6] leading-relaxed relative z-10">"{item.advice}"</p>
            </div>
            
            {isFree && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                 <div className="bg-[#101010] border border-white/10 rounded-2xl p-4 shadow-xl space-y-2">
                    <p className="text-xs font-medium  tracking-normal text-[#A1A1A6]">Strategist Offline</p>
                    <Link to="/hub-upgrade" className="block text-xs font-medium text-glow-blue  hover:underline">Connect Node</Link>
                 </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Analytics Modal */}
      <AnimatePresence>
        {selectedAnalyticsNode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-xl"
            onClick={() => setSelectedAnalyticsNode(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#151515] border border-white/10 rounded-[32px] w-full max-w-6xl max-h-[90vh] overflow-y-auto relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedAnalyticsNode(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="p-4 sm:p-8 md:p-12">
                <VidIQAnalytics defaultQuery={`${selectedAnalyticsNode} trends`} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
