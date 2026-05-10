import React from 'react';
import { CreditCard, CheckCircle2, Zap, Star, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useNotify } from '@/src/contexts/NotificationContext';

export default function Billing() {
   const { notify } = useNotify();

   const handleUpgrade = (plan: string) => {
      notify(`Initiating checkout process for ${plan} plan...`, 'info');
      // In a real app, this redirects to Stripe Checkout
      setTimeout(() => {
         notify('This is a simulated SaaS build. Stripe integration would happen here.', 'smart');
      }, 2000);
   };

   return (
      <div className="font-sans selection:bg-glow-blue/30 selection:text-white pb-24 relative animate-in fade-in duration-700 max-w-6xl mx-auto">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-glow-blue/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
         
         <header className="mb-12 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#F5F5F7] flex items-center justify-center gap-4">
               <CreditCard className="w-10 h-10 text-glow-blue" />
               Billing & Subscriptions
            </h1>
            <p className="text-[#A1A1A6] font-medium text-sm md:text-base max-w-2xl mx-auto">
               Manage your subscription, view invoices, and upgrade your plan to unlock enterprise-grade creator intelligence.
            </p>
         </header>

         {/* Current Plan Overview */}
         <div className="bg-[#101010]/80 backdrop-blur-2xl border border-glow-blue/30 shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12 mb-12 relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-glow-blue/20 text-glow-blue text-[10px] font-black uppercase tracking-widest rounded-full border border-glow-blue/30">Active Plan</span>
               </div>
               <h2 className="text-3xl font-black text-white mb-2">Creator Pro</h2>
               <p className="text-[#A1A1A6] text-sm font-medium">Billed $29/mo. Next billing date: Jun 14, 2026.</p>
            </div>
            
            <div className="flex gap-4">
               <button className="px-6 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold uppercase tracking-widest text-xs transition-all rounded-xl">
                  View Invoices
               </button>
               <button className="px-6 py-3 bg-white text-black font-black uppercase tracking-[0.2em] text-xs transition-all rounded-xl hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  Manage Plan
               </button>
            </div>
         </div>

         {/* Usage Stats */}
         <div className="grid md:grid-cols-3 gap-6 mb-16 relative z-10">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-[#A1A1A6] mb-4">Neural Analysis Tokens</h3>
               <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-black text-white">4,250</span>
                  <span className="text-sm text-[#86868B]">/ 5,000</span>
               </div>
               <div className="w-full h-1.5 bg-[#000] rounded-full overflow-hidden">
                  <div className="h-full bg-glow-blue w-[85%]" />
               </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-[#A1A1A6] mb-4">Connected Accounts</h3>
               <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-black text-white">3</span>
                  <span className="text-sm text-[#86868B]">/ 5</span>
               </div>
               <div className="w-full h-1.5 bg-[#000] rounded-full overflow-hidden">
                  <div className="h-full bg-glow-purple w-[60%]" />
               </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-[#A1A1A6] mb-4">A/B Title Battles</h3>
               <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-black text-white">12</span>
                  <span className="text-sm text-[#86868B]">/ Unlimited</span>
               </div>
               <div className="w-full h-1.5 bg-[#000] rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[100%]" />
               </div>
            </div>
         </div>

         {/* Setup Plans for Upgrade */}
         <h3 className="text-2xl font-black text-white text-center mb-8 relative z-10">Upgrade to Enterprise Intelligence</h3>
         
         <div className="grid md:grid-cols-2 gap-8 relative z-10 max-w-4xl mx-auto">
            <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/10 shadow-[0_8_32px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 hover:border-white/30 transition-all flex flex-col">
               <h3 className="text-xl font-bold text-white mb-2">Scale</h3>
               <p className="text-[#A1A1A6] text-sm mb-6 font-medium">For growing creators managing multiple platforms.</p>
               <div className="mb-8">
                  <span className="text-5xl font-black text-white">$49</span>
                  <span className="text-[#A1A1A6] font-bold">/mo</span>
               </div>
               
               <ul className="space-y-4 mb-8 flex-1">
                  {['10 Connected Social Accounts', '25,000 Neural Tokens/mo', 'Deep Competitor Analysis', 'Unlimited Content Scheduling', 'Trend Intelligence Access'].map((feature, i) => (
                     <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#F5F5F7]">
                        <CheckCircle2 className="w-5 h-5 text-glow-blue shrink-0" />
                        {feature}
                     </li>
                  ))}
               </ul>
               
               <button onClick={() => handleUpgrade('Scale')} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all rounded-2xl flex items-center justify-center gap-2">
                  Upgrade to Scale <ArrowRight className="w-4 h-4" />
               </button>
            </div>

            <div className="bg-[#101010]/80 backdrop-blur-2xl border border-glow-purple/50 shadow-[0_0_50px_rgba(188,19,254,0.15)] rounded-[2.5rem] p-8 relative flex flex-col">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-glow-purple text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(188,19,254,0.5)]">
                  Maximum Power
               </div>
               
               <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Star className="w-5 h-5 text-glow-purple fill-glow-purple" /> Elite</h3>
               <p className="text-[#A1A1A6] text-sm mb-6 font-medium">For agencies and elite creators commanding the algorithm.</p>
               <div className="mb-8">
                  <span className="text-5xl font-black text-white">$199</span>
                  <span className="text-[#A1A1A6] font-bold">/mo</span>
               </div>
               
               <ul className="space-y-4 mb-8 flex-1">
                  {['Unlimited Social Accounts', 'Unlimited Neural Tokens', 'White-labeled Reports', 'Dedicated Account Manager', 'Custom AI Training Models'].map((feature, i) => (
                     <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#F5F5F7]">
                        <Shield className="w-5 h-5 text-glow-purple shrink-0" />
                        {feature}
                     </li>
                  ))}
               </ul>
               
               <button onClick={() => handleUpgrade('Elite')} className="w-full py-4 bg-glow-purple hover:bg-glow-purple/90 text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(188,19,254,0.3)]">
                  Upgrade to Elite <Zap className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
   );
}
