import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  Shield, 
  Cpu, 
  Globe, 
  Sparkles,
  ChevronRight,
  UserPlus,
  LogIn,
  Check,
  Smartphone,
  Video,
  BarChart
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useUser } from '@/src/contexts/UserContext';

export default function Landing() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const gridRotateX = useTransform(scrollYProgress, [0, 1], [60, 45]);
  const gridZ = useTransform(scrollYProgress, [0, 1], [0, -100]);

  React.useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: Cpu,
      title: "Smart Synergy",
      description: "Proprietary AI nodes that adapt to your brand's unique platform signature for flawless generation."
    },
    {
      icon: Shield,
      title: "Encrypted Growth",
      description: "Secure data routing through orbital proxies to protect your growth strategies from platform detection."
    },
    {
      icon: Globe,
      title: "Global Platform",
      description: "Simultaneously deploy content across every major social node with sub-millisecond synchronization."
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-dark-bg text-[#F5F5F7] selection:bg-glow-blue/10 selection:text-[#F5F5F7] perspective-1000">
      {/* 3D Moving Grid Background & Glass Effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          style={{ 
            rotateX: gridRotateX,
            z: gridZ,
            translateY: '-20%'
          }}
          className="absolute inset-0 origin-center"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,242,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] h-[200%] w-full animate-grid-flow" />
        </motion.div>
        
        {/* Ambient background blur (Glass Effect on Background Only) */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-glow-blue/40 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-3/4 right-1/4 w-[500px] h-[500px] bg-glow-purple/40 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[#000000]/40 backdrop-blur-[80px] pointer-events-none" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#1C1C1E] border border-apple-glass-border ">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 border-2 border-glow-blue/30 flex items-center justify-center text-glow-blue font-black italic">N</div>
             <span className="text-sm font-black tracking-normal  italic">Smart Hub</span>
          </div>
          
          <div className="flex items-center gap-8">
            {user ? (
              <Link to="/dashboard" className="text-xs font-medium text-glow-blue  tracking-wide hover:text-[#A1A1A6] transition-colors">
                Enter Dashboard
              </Link>
            ) : (
              <>
                <Link to="/auth?mode=login" className="text-xs font-medium text-[#A1A1A6]  tracking-wide hover:text-[#A1A1A6] transition-colors flex items-center gap-2">
                  <LogIn className="w-3 h-3" /> Login
                </Link>
                <Link to="/auth?mode=signup" className="px-6 py-2 bg-[#1C1C1E] border border-apple-glass-border text-xs font-black  tracking-wide hover:bg-glow-blue/10 transition-all flex items-center gap-2">
                  <UserPlus className="w-3 h-3" /> Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden min-h-screen flex flex-col items-center justify-center">
        <div className="hub-scanlines" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-glow-blue/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-glow-blue/30 bg-glow-blue/10 rounded-none mb-8"
          >
            <Sparkles className="w-3 h-3 text-glow-blue" />
            <span className="text-xs font-medium text-glow-blue  tracking-normal">Next-Gen Intelligence Engine</span>
          </motion.div>

          <div className="space-y-4 mb-12">
            <motion.h1
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-6xl md:text-[9rem] font-black leading-none tracking-tight premium-glow-text"
            >
              YOUR CONTENT.
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-6xl md:text-[9rem] font-black leading-none tracking-tight premium-glow-accent hero-text-glow"
            >
              AUTOMATED.
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, scale: 1.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="text-6xl md:text-[9rem] font-black leading-none tracking-tight premium-glow-text"
            >
              ELEVATED.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-[#A1A1A6] font-medium text-sm  tracking-normal max-w-2xl mx-auto mb-16 leading-loose"
          >
            The world's first smart distribution network for the creator economy. 
            Synthesize, optimize, and deploy with surgical precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link 
              to="/hub-upgrade" 
              className="px-12 py-6 bg-glow-blue text-[#101010] font-black tracking-widest text-xs uppercase hover:bg-glow-blue/90 border border-glow-blue transition-all transform hover:scale-105 shadow-[0_0_50px_rgba(0,242,255,0.4)] flex items-center gap-4 group"
            >
              Get Premium Advantage
              <Zap className="w-4 h-4 group-hover:animate-bounce" />
            </Link>
            <Link 
              to="/auth?mode=signup" 
              className="text-xs font-bold text-[#A1A1A6] uppercase tracking-widest hover:text-white transition-colors"
            >
              Start Free Trial
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating 3D-like Elements */}
        <div className="absolute inset-x-0 h-full pointer-events-none">
           <motion.div 
             animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-1/4 left-10 md:left-40 w-24 h-24 border border-white/10 bg-[#151515] border border-apple-glass-border  rotate-12 flex items-center justify-center opacity-40 md:opacity-100"
           >
              <Smartphone className="w-8 h-8 text-glow-blue" />
           </motion.div>
           <motion.div 
             animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-1/4 right-10 md:right-40 w-32 h-32 border border-white/10 bg-[#151515] border border-apple-glass-border  -rotate-12 flex items-center justify-center opacity-40 md:opacity-100"
           >
              <Video className="w-10 h-10 text-glow-purple" />
           </motion.div>
           <motion.div 
             animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="absolute top-1/3 right-1/4 w-64 h-64 bg-glow-blue/10 blur-[100px] rounded-full"
           />
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-20"
        >
          <span className="text-xs font-medium  tracking-normal">Scroll to Scan Platform</span>
          <div className="w-px h-12 bg-[#1C1C1E] border border-apple-glass-border" />
        </motion.div>
      </section>

      {/* Start Free Section */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-3 px-4 py-1 border border-white/10 bg-[#151515] border border-apple-glass-border">
                  <Zap className="w-4 h-4 text-glow-blue" />
                  <span className="text-xs font-medium  tracking-normal">Public Beta Access</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-none">
                  Begin your <br />
                  <span className="text-glow-blue border-b-4 border-glow-blue inline-block mt-2 pb-2">Free Generation.</span>
                </h2>
                <p className="text-[#A1A1A6] font-medium text-sm  tracking-wide leading-relaxed max-w-lg">
                  Access the basic smart core at zero cost. Ideal for individual creators initializing their first social nodes.
                </p>
                <div className="space-y-4">
                  {[
                    "3 Smart Content Forge Credit / Day",
                    "Public Node Distribution (YT, IG)",
                    "Basic Reach Analytics",
                    "Smart Link Connection",
                    "Community Platform Access"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-5 h-5 rounded-full border border-glow-blue/30 flex items-center justify-center group-hover:bg-glow-blue/10 group-hover:border-glow-blue/30 transition-all">
                        <Check className="w-3 h-3 text-glow-blue group-hover:text-[#F5F5F7] transition-colors" />
                      </div>
                      <span className="text-xs font-medium uppercase tracking-widest text-[#A1A1A6]">{item}</span>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/auth?mode=signup" 
                  className="inline-flex px-12 py-6 bg-[#1C1C1E] border border-apple-glass-border font-black tracking-widest uppercase text-xs hover:bg-glow-blue/10 hover:text-white transition-all transform hover:scale-105"
                >
                  Create Identity Node
                </Link>
              </motion.div>
            </div>
            
            <div className="flex-1 w-full max-w-xl">
               <motion.div
                 initial={{ opacity: 0, rotateY: 45, scale: 0.9 }}
                 whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1 }}
                 className="p-12 bg-gradient-to-b from-[#101010] to-[#151515] border border-glow-blue/20 rounded-[2.5rem] relative overflow-hidden group shadow-[0_0_50px_rgba(0,242,255,0.1)]"
               >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-glow-blue/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
                 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-glow-blue to-transparent" />
                 
                 <div className="flex justify-between items-start mb-12 relative z-10">
                   <div>
                      <div className="flex items-center gap-2 mb-2">
                         <Sparkles className="w-4 h-4 text-glow-blue" />
                         <h4 className="text-xs font-black text-glow-blue tracking-widest uppercase">Premium Capability</h4>
                      </div>
                      <span className="text-5xl font-black tracking-tighter text-white">Full Unlock</span>
                   </div>
                   <div className="w-16 h-16 rounded-full bg-glow-blue/10 border border-glow-blue/30 flex items-center justify-center animate-pulse">
                      <Zap className="w-8 h-8 text-glow-blue" />
                   </div>
                 </div>
                 
                 <div className="space-y-6 relative z-10">
                    <p className="text-sm text-[#A1A1A6] leading-relaxed">Active premium nodes receive real-time, zero-latency access to the intelligence stream, generating deep cross-platform blueprints instantly.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                       <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                          <p className="text-xs text-[#A1A1A6] mb-1 uppercase font-bold tracking-widest">Speed</p>
                          <p className="text-xl font-black text-glow-blue">10x Faster</p>
                       </div>
                       <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                          <p className="text-xs text-[#A1A1A6] mb-1 uppercase font-bold tracking-widest">Limits</p>
                          <p className="text-xl font-black text-white">Unlimited</p>
                       </div>
                    </div>
                    
                    <Link 
                      to="/hub-upgrade"
                      className="block w-full py-4 text-center bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white/90 active:scale-95 transition-all mt-8"
                    >
                      Compare Tiers & Upgrade
                    </Link>
                 </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 border-t border-white/10 relative bg-[#151515] border border-apple-glass-border">
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="smart-card p-10 group hover:border-glow-blue/30 transition-all"
                >
                   <div className="w-16 h-16 bg-[#151515] border border-apple-glass-border flex items-center justify-center mb-8 border border-white/10 group-hover:bg-glow-blue/10 group-hover:border-glow-blue/30 transition-all">
                      <feature.icon className="w-8 h-8 text-glow-blue" />
                   </div>
                   <h3 className="text-xl font-black  italic mb-4 tracking-tight">{feature.title}</h3>
                   <p className="text-xs font-medium text-[#A1A1A6]  tracking-wide leading-relaxed">
                     {feature.description}
                   </p>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Trust Tokens */}
      <section className="py-20 px-6 border-y border-white/10 bg-[#1C1C1E] border border-apple-glass-border">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-12 opacity-20 grayscale">
           {['META MATRIX', 'BYTEDANCE NODES', 'GOOGLE INFRA', 'ORBITAL SYNC', 'NEURAL CORE'].map((token, i) => (
             <span key={i} className="text-xs font-medium font-black  tracking-normal">{token}</span>
           ))}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-40 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-glow-purple/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
           <Zap className="w-12 h-12 text-glow-blue mx-auto mb-8 animate-pulse" />
           <h2 className="text-4xl md:text-7xl font-black  italic mb-8 tracking-tight">
             Ready to synchronize <br /> with the <span className="text-glow-purple">future?</span>
           </h2>
           <Link 
              to="/auth?mode=signup" 
              className="inline-flex px-16 py-8 bg-[#1C1C1E] border border-apple-glass-border font-black  tracking-normal text-sm hover:bg-glow-blue/10 transition-all transform hover:scale-105"
           >
              Initialize Node
           </Link>
        </div>
        
        <div className="mt-40 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
           <span className="text-xs font-medium  tracking-wide">© 2026 Smart Hub Intelligence Systems</span>
           <div className="flex gap-8 text-xs font-medium  tracking-wide">
              <a href="#" className="hover:text-[#A1A1A6]">Privacy Node</a>
              <a href="#" className="hover:text-[#A1A1A6]">Security Platform</a>
              <a href="#" className="hover:text-[#A1A1A6]">Terminal Docs</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
