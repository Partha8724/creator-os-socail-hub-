import React, { useState } from 'react';
import { DollarSign, Briefcase, TrendingUp, Calculator, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useNotify } from '@/src/contexts/NotificationContext';

export default function SponsorshipEngine() {
  const [views, setViews] = useState('');
  const [niche, setNiche] = useState('Tech');
  const [platform, setPlatform] = useState('YouTube');
  const [result, setResult] = useState<any>(null);
  const { notify } = useNotify();

  const calculateSponsorship = () => {
    const numViews = parseInt(views) || 0;
    if (numViews === 0) {
       notify('Please enter average views', 'error'); return;
    }
    
    // Simple CPV logic based on niche
    let cpm = 15; // default
    if (niche === 'Tech') cpm = 25;
    if (niche === 'Finance') cpm = 45;
    if (niche === 'Gaming') cpm = 10;
    if (niche === 'Lifestyle') cpm = 18;

    if (platform === 'TikTok' || platform === 'Shorts') cpm = cpm / 4; // short form is cheaper

    const basePrice = (numViews / 1000) * cpm;
    
    setResult({
      suggestedPrice: `$${Math.round(basePrice).toLocaleString()}`,
      cpm: `$${cpm}`,
      nicheMultiplier: cpm > 20 ? 'High (Premium Audience)' : 'Standard',
      platformMultiplier: platform === 'YouTube' ? '1x (Long Form)' : '0.25x (Short Form)',
      packages: [
         { name: 'Dedicated Integration (60s)', price: `$${Math.round(basePrice * 1.5).toLocaleString()}` },
         { name: 'Standard Mention (30s)', price: `$${Math.round(basePrice).toLocaleString()}` },
         { name: 'Short Shoutout (15s)', price: `$${Math.round(basePrice * 0.7).toLocaleString()}` }
      ]
    });

    notify('Calculation complete', 'success');
  };

  return (
    <div className="font-sans selection:bg-green-500/30 selection:text-white pb-24 relative animate-in fade-in duration-700">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
      
      <header className="mb-10 relative z-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-[#F5F5F7] flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-500" />
            Sponsorship & Pricing Matrix
          </h1>
          <p className="text-[#A1A1A6] font-medium">Algorithmic pricing calculator based on live CPV rates and niche authority.</p>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8">
              <h3 className="text-xl font-bold text-[#F5F5F7] mb-6 flex items-center gap-2">
                 <Calculator className="w-5 h-5 text-green-500" />
                 Rates Setup
              </h3>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">Avg Views (Last 10 Videos)</label>
                    <input 
                       type="number" 
                       value={views}
                       onChange={e=>setViews(e.target.value)}
                       placeholder="e.g. 50000"
                       className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none focus:border-green-500/50 transition-all rounded-2xl text-white"
                    />
                 </div>
                 
                 <div>
                    <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">Primary Niche</label>
                    <select 
                       value={niche}
                       onChange={e=>setNiche(e.target.value)}
                       className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none focus:border-green-500/50 transition-all rounded-2xl text-white appearance-none cursor-pointer"
                    >
                       <option>Tech</option>
                       <option>Finance</option>
                       <option>Gaming</option>
                       <option>Lifestyle</option>
                    </select>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">Platform</label>
                    <select 
                       value={platform}
                       onChange={e=>setPlatform(e.target.value)}
                       className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none focus:border-green-500/50 transition-all rounded-2xl text-white appearance-none cursor-pointer"
                    >
                       <option>YouTube</option>
                       <option>TikTok</option>
                       <option>Instagram</option>
                       <option>Shorts</option>
                    </select>
                 </div>

                 <button 
                    onClick={calculateSponsorship}
                    className="w-full py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center justify-center gap-3 rounded-2xl group hover:border-green-500/50"
                 >
                    <TrendingUp className="w-4 h-4 group-hover:text-green-500 transition-colors" />
                    Calculate Pricing
                 </button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8">
           <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12 min-h-[500px] flex flex-col border-green-500/10">
              {!result && (
                 <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <Briefcase className="w-16 h-16 text-[#333] mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">Awaiting Parameters</h3>
                    <p className="text-[#A1A1A6] text-sm">Input your average views to generate algorithm-backed pricing packages.</p>
                 </div>
              )}

              {result && (
                 <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="space-y-10">
                    <div className="text-center">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500 mb-2 block">Fair Market Value</span>
                       <h2 className="text-6xl font-black text-white italic">{result.suggestedPrice}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B] mb-2">Estimated CPM</span>
                          <span className="text-2xl font-bold text-white">{result.cpm}</span>
                       </div>
                       <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B] mb-2">Niche Leverage</span>
                          <span className="text-sm font-bold text-green-500 pt-2">{result.nicheMultiplier}</span>
                       </div>
                       <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B] mb-2">Platform Scale</span>
                          <span className="text-sm font-bold text-white pt-2">{result.platformMultiplier}</span>
                       </div>
                    </div>

                    <div>
                       <h3 className="text-[10px] font-black uppercase tracking-widest text-[#86868B] mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Suggested Packages</h3>
                       <div className="space-y-4">
                          {result.packages.map((pkg: any, i: number) => (
                             <div key={i} className="flex justify-between items-center bg-[#151515] p-5 rounded-2xl border border-white/5 hover:border-green-500/20 transition-all cursor-pointer">
                                <span className="text-sm font-bold text-[#F5F5F7]">{pkg.name}</span>
                                <span className="text-lg font-black text-green-500">{pkg.price}</span>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                       <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white border border-white/10 text-white hover:text-black font-bold text-xs uppercase tracking-widest rounded-xl transition-all w-full justify-center">
                          <Mail className="w-4 h-4" /> Export Media Kit Data
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
