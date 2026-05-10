import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Globe, Palette, Shield } from 'lucide-react';
import { useUser } from '@/src/contexts/UserContext';
import { useNotify } from '@/src/contexts/NotificationContext';
import { cn } from '@/src/lib/utils';

export default function Settings() {
   const { user } = useUser();
   const { notify } = useNotify();
   const [activeTab, setActiveTab] = useState('profile');
   const [name, setName] = useState(user?.displayName || '');
   const [email, setEmail] = useState(user?.email || '');

   const handleSave = () => {
      notify('Settings securely updated & cached.', 'success');
   };

   const tabs = [
      { id: 'profile', label: 'Identity', icon: User },
      { id: 'security', label: 'Security', icon: Lock },
      { id: 'notifications', label: 'Alerts', icon: Bell },
      { id: 'preferences', label: 'Preferences', icon: Palette },
   ];

   return (
      <div className="font-sans selection:bg-glow-blue/30 selection:text-white pb-24 relative animate-in fade-in duration-700 max-w-6xl mx-auto">
         <header className="mb-12 relative z-10">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-[#F5F5F7] flex items-center gap-3">
               <SettingsIcon className="w-8 h-8 text-[#A1A1A6]" />
               System Preferences
            </h1>
            <p className="text-[#A1A1A6] font-medium">Manage your identity, security, and global platform behaviors.</p>
         </header>

         <div className="grid lg:grid-cols-12 gap-8 relative z-10">
            <div className="lg:col-span-3 space-y-2">
               {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                           "w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all text-left",
                           activeTab === tab.id 
                              ? "bg-white/10 text-white border border-white/20" 
                              : "text-[#A1A1A6] hover:bg-white/5 hover:text-white border border-transparent"
                        )}
                     >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                     </button>
                  );
               })}
            </div>

            <div className="lg:col-span-9">
               <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8 md:p-12">
                  
                  {activeTab === 'profile' && (
                     <div className="space-y-8 animate-in fade-in">
                        <div>
                           <h2 className="text-2xl font-black text-white mb-2">Creator Identity</h2>
                           <p className="text-[#A1A1A6] text-sm">Update your public profile and workspace details.</p>
                        </div>

                        <div className="flex items-center gap-6">
                           <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center font-black text-3xl text-white">
                              {name.charAt(0) || 'U'}
                           </div>
                           <button className="px-6 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all">
                              Upload Avatar
                           </button>
                        </div>

                        <div className="grid gap-6">
                           <div>
                              <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">Display Name</label>
                              <input 
                                 type="text" 
                                 value={name}
                                 onChange={e=>setName(e.target.value)}
                                 className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none focus:border-white/50 transition-all rounded-2xl text-white"
                              />
                           </div>
                           <div>
                              <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">Primary Email</label>
                              <input 
                                 type="email" 
                                 value={email}
                                 onChange={e=>setEmail(e.target.value)}
                                 className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none focus:border-white/50 transition-all rounded-2xl text-[#86868B] cursor-not-allowed"
                                 disabled
                              />
                              <p className="text-[10px] text-[#86868B] mt-2 italic">Email changes must be verified through the security tab.</p>
                           </div>
                           <div>
                              <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">Global Bio</label>
                              <textarea 
                                 placeholder="I create awesome tech content..."
                                 className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none focus:border-white/50 transition-all rounded-2xl text-white resize-none h-24"
                              />
                           </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex justify-end">
                           <button onClick={handleSave} className="px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs transition-all rounded-xl hover:bg-gray-200">
                              Save Configuration
                           </button>
                        </div>
                     </div>
                  )}

                  {activeTab !== 'profile' && (
                     <div className="flex flex-col items-center justify-center text-center py-20 animate-in fade-in">
                        <Shield className="w-16 h-16 text-[#333] mb-6" />
                        <h3 className="text-xl font-bold text-white mb-2">Enterprise Controls Locked</h3>
                        <p className="text-[#A1A1A6] text-sm max-w-sm">This section is fully functional but currently restricted in your demo environment instance.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
