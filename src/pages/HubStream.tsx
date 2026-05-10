import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { io, Socket } from 'socket.io-client';
import { 
  Radio, 
  Activity, 
  Zap, 
  Shield, 
  Cpu, 
  Network, 
  Terminal,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useUser } from '@/src/contexts/UserContext';
import { Link } from 'react-router-dom';

interface IntelligenceEvent {
  id: string;
  type: string;
  message: string;
  intensity: number;
  timestamp: string;
}

export default function HubStream() {
  const { profile } = useUser();
  const isFree = profile?.tier === 'free';
  const [logs, setLogs] = useState<IntelligenceEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket: Socket = io(window.location.origin, { transports: ['websocket', 'polling'], autoConnect: true });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('intelligence_burst', (data) => {
      setLogs(data.logs.map((l: any, i: number) => ({ ...l, id: `burst-${i}`, timestamp: new Date().toLocaleTimeString() })));
    });

    socket.on('intelligence_update', (node: IntelligenceEvent) => {
      setLogs(prev => [node, ...prev].slice(0, 50));
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'ALGORITHM_SHIFT': return <Network className="w-4 h-4 text-glow-purple" />;
      case 'VIRAL_SURGE': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'SYNC_SUCCESS': return <Activity className="w-4 h-4 text-glow-blue" />;
      case 'ORACLE_INSIGHT': return <Shield className="w-4 h-4 text-[#A1A1A6]" />;
      default: return <Cpu className="w-4 h-4 text-[#A1A1A6]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E] border border-apple-glass-border text-[#A1A1A6] p-4 md:p-8 pt-24 font-sans selection:bg-glow-blue/10 selection:text-[#F5F5F7] overflow-hidden flex flex-col">
      {/* Background Platform Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,242,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
        <div>
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-3 mb-2"
           >
             <div className={cn(
               "w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_currentColor]",
               isConnected ? "text-glow-blue bg-glow-blue/10" : "text-red-500 bg-red-500"
             )} />
             <span className="text-xs font-medium  tracking-normal text-[#A1A1A6]">
               {isConnected ? 'Hub Link Established' : 'Smart Link Distorted'}
             </span>
           </motion.div>
           <h1 className="text-4xl md:text-6xl font-black  italic tracking-tight mb-4">
             Intelligence Stream <span className="text-glow-blue">v4.0</span>
           </h1>
           <p className="text-[#A1A1A6] font-medium text-xs  tracking-wide max-w-xl leading-relaxed">
             Real-time platform performance mapping and algorithmic drift detection. All synchronization events filtered through Hub Smart Core.
           </p>
        </div>

        <div className="flex gap-4">
           <div className="smart-card px-6 py-4 bg-[#151515] border border-apple-glass-border flex flex-col items-end">
              <span className="text-xs font-medium text-[#A1A1A6]  tracking-wide">Active nodes</span>
              <span className="text-xl font-black text-glow-blue">4,291</span>
           </div>
           <div className="smart-card px-6 py-4 bg-[#151515] border border-apple-glass-border flex flex-col items-end">
              <span className="text-xs font-medium text-[#A1A1A6]  tracking-wide">Latency</span>
              <span className="text-xl font-black text-glow-purple">12ms</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 flex-1">
        {/* Main Stream */}
        <div className="lg:col-span-8 flex flex-col h-[calc(100vh-350px)] min-h-[400px]">
          <div className="smart-card flex-1 bg-[#151515] border border-apple-glass-border overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 bg-[#151515] border border-apple-glass-border flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3 text-glow-blue" />
                <span className="text-xs font-medium  tracking-normal font-bold">Smart Log Output</span>
              </div>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                <div className="w-2 h-2 rounded-full bg-glow-blue/10" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 font-medium text-xs space-y-4 custom-scrollbar" ref={scrollRef}>
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={cn(
                      "p-4 border-l-2 bg-[#151515] border border-apple-glass-border flex gap-6 items-center group transition-colors",
                      log.type === 'ALGORITHM_SHIFT' ? 'border-glow-purple/30' :
                      log.type === 'VIRAL_SURGE' ? 'border-yellow-400' :
                      log.type === 'SYNC_SUCCESS' ? 'border-glow-blue/30' : 'border-white/10',
                      isFree && i > 5 ? "blur-[2px] opacity-20 pointer-events-none" : "hover:bg-[#151515] border border-apple-glass-border"
                    )}
                  >
                    <span className="text-[#A1A1A6] whitespace-nowrap min-w-[70px]">{log.timestamp}</span>
                    <div className="w-8 h-8 bg-[#151515] border border-apple-glass-border flex items-center justify-center shrink-0">
                      {getIcon(log.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="font-bold text-[#A1A1A6] tracking-wider">[{log.type}]</span>
                         <span className="text-[#A1A1A6]">::</span>
                         <span className="text-glow-blue/60">node_402_sync</span>
                      </div>
                      <p className="text-[#A1A1A6] lowercase italic">"{log.message}"</p>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-xs text-[#A1A1A6]  tracking-wide mb-1">Intensity</span>
                       <div className="w-24 h-1 bg-[#151515] border border-apple-glass-border overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${log.intensity * 100}%` }}
                            className={cn(
                              "h-full",
                              log.intensity > 0.8 ? "bg-red-500" : log.intensity > 0.6 ? "bg-glow-blue/10" : "bg-glow-purple/10"
                            )} 
                          />
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isFree && (
                <div className="p-8 flex flex-col items-center text-center space-y-4">
                   <AlertTriangle className="w-8 h-8 text-yellow-500 animate-smart-pulse" />
                   <div>
                      <p className="text-sm font-black  italic">Platform Connection Limited</p>
                      <p className="text-xs text-[#A1A1A6]  tracking-normal mt-2">
                        Free tier users are restricted to 10% of the Intelligence Stream.
                      </p>
                   </div>
                   <Link to="/hub-upgrade" className="px-6 py-2 bg-glow-blue/10 text-[#F5F5F7] text-xs font-black  tracking-wide hover:bg-[#1C1C1E] border border-apple-glass-border transition-all">
                      Unlock Full Stream
                   </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="smart-card p-6 bg-glow-purple/10 border-glow-purple/30">
              <h3 className="text-xs font-black  tracking-normal mb-6 flex items-center gap-2">
                <Activity className="w-4 h-4 text-glow-purple" />
                Active Hypotheses
              </h3>
              <div className="space-y-4">
                 {[
                   { t: 'Viral Convergence', d: 'High probability of tech-trend intersection in 48h', p: 82 },
                   { t: 'Niche Saturation', d: 'Minimal impact projected for generic "AI tools" keywords', p: 14 },
                   { t: 'Engagement Peak', d: 'Optimal deployment window: 14:00 - 16:00 UTC', p: 94 },
                 ].map((h, i) => (
                   <div key={i} className="p-3 border border-white/10 bg-[#151515] border border-apple-glass-border rounded-none">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold ">{h.t}</span>
                        <span className="text-xs font-medium text-glow-blue">{h.p}%</span>
                      </div>
                      <p className="text-xs text-[#A1A1A6] leading-relaxed font-medium mb-3">{h.d}</p>
                      <div className="w-full h-[1px] bg-[#151515] border border-apple-glass-border">
                        <div className="h-full bg-glow-purple/10" style={{ width: `${h.p}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="smart-card p-6 bg-glow-blue/10">
              <h3 className="text-xs font-black  tracking-normal mb-6 flex items-center gap-2">
                <Radio className="w-4 h-4 text-glow-blue" />
                Signal Strength
              </h3>
              <div className="flex items-center gap-4 mb-4">
                 <div className="flex-1 space-y-1">
                   <div className="flex justify-between text-xs font-medium  text-[#A1A1A6]">
                      <span>YouTube</span>
                      <span>Strong</span>
                   </div>
                   <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => <div key={i} className={cn("flex-1 h-3", i < 5 ? "bg-glow-blue/10" : "bg-[#151515] border border-apple-glass-border")} />)}
                   </div>
                 </div>
                 <div className="flex-1 space-y-1">
                   <div className="flex justify-between text-xs font-medium  text-[#A1A1A6]">
                      <span>Instagram</span>
                      <span>Volatile</span>
                   </div>
                   <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => <div key={i} className={cn("flex-1 h-3", i < 3 ? "bg-glow-blue/10" : "bg-[#151515] border border-apple-glass-border")} />)}
                   </div>
                 </div>
              </div>
              <p className="text-xs font-medium text-[#A1A1A6]  tracking-wide text-center mt-6">
                Orbital satellite sync: ACTIVE
              </p>
           </div>

           <Link to="/hub-upgrade" className="block smart-card p-8 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-white/10 hover:border-white/10 transition-all group">
              <h4 className="text-lg font-black  italic mb-2 flex items-center justify-between">
                Join the Pro Platform
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs font-medium text-[#A1A1A6]  tracking-wide leading-relaxed">
                Connect your interface to the Master Node for unlimited intelligence generation and dark-mode analytics.
              </p>
           </Link>
        </div>
      </div>
    </div>
  );
}
