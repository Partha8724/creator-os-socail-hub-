import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Link as LinkIcon, 
  Youtube, 
  Instagram, 
  Facebook, 
  Globe,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNotify } from '@/src/contexts/NotificationContext';

interface SocialAccount {
  id: string;
  platform: 'YouTube' | 'Instagram' | 'Facebook' | 'TikTok';
  name: string;
  handle: string;
  status: 'connected' | 'pending' | 'error';
  followers: string;
  health: number;
}

export default function SmartLink() {
  const { notify } = useNotify();
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { id: '1', platform: 'YouTube', name: 'Hub Tech Lab', handle: '@hubtech', status: 'connected', followers: '124K', health: 98 },
    { id: '2', platform: 'Instagram', name: 'Hub Vision', handle: '@hub.vision', status: 'connected', followers: '45K', health: 85 },
    { id: '3', platform: 'TikTok', name: 'Hub Shorts', handle: '@hub_shorts', status: 'pending', followers: '0', health: 0 },
  ]);

  const [isLinking, setIsLinking] = useState(false);

  const startLinking = (platform: string) => {
    setIsLinking(true);
    notify(`Initializing secure handshake with ${platform} API...`, 'smart', 'Smart Handshake');
    
    setTimeout(() => {
      setIsLinking(false);
      // Simulating a random failure for demonstration if a platform is TikTok
      if (platform === 'TikTok') {
        notify("Handshake timeout: TikTok nodes reported metadata distortion.", "error", "Handshake Failed");
      } else {
        notify(`${platform} node successfully mapped to Hub Core.`, "success", "Link Established");
      }
    }, 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight  mb-2">Meta-Sync</h1>
          <p className="text-[#A1A1A6] font-medium text-xs md:text-sm  tracking-wide italic">Omni-Channel Account Smart Mapping</p>
        </div>
        <div className="flex bg-[#151515] border border-apple-glass-border p-1 border border-white/10">
          <button className="px-4 py-2 text-xs font-medium  tracking-wide bg-[#1C1C1E] border border-apple-glass-border font-bold">Active Nodes</button>
          <button className="px-4 py-2 text-xs font-medium  tracking-wide text-[#A1A1A6] hover:text-[#A1A1A6]">Security Logs</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="smart-card p-6 bg-glow-blue/10 border-glow-blue/30">
          <ShieldCheck className="w-8 h-8 text-glow-blue mb-4" />
          <h3 className="text-sm font-bold  tracking-wide mb-1">Smart Security</h3>
          <p className="text-xs text-[#A1A1A6] font-medium">End-to-end encrypted node connection active.</p>
        </div>
        <div className="smart-card p-6">
          <RefreshCw className="w-8 h-8 text-glow-purple mb-4" />
          <h3 className="text-sm font-bold  tracking-wide mb-1">Auto-Sync</h3>
          <p className="text-xs text-[#A1A1A6] font-medium">Last full network sweep: 12m ago.</p>
        </div>
        <div className="smart-card p-6">
          <Globe className="w-8 h-8 text-[#A1A1A6] mb-4" />
          <h3 className="text-sm font-bold  tracking-wide mb-1">Global Reach</h3>
          <p className="text-xs text-[#A1A1A6] font-medium">Currently mapping 3/4 major hub points.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { id: 'YouTube', icon: Youtube, color: 'text-[#FF0000]', glowingLine: 'bg-[#FF0000]', title: 'Connect YouTube' },
              { id: 'Facebook', icon: Facebook, color: 'text-[#1877F2]', glowingLine: 'bg-[#1877F2]', title: 'Connect Facebook' },
              { id: 'Instagram', icon: Instagram, color: 'text-[#E4405F]', glowingLine: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040]', title: 'Connect Instagram' },
            ].map(p => (
              <button 
                key={p.id}
                onClick={() => startLinking(p.id)}
                disabled={isLinking}
                className="smart-card p-6 flex flex-col items-center justify-center text-center gap-4 group hover:border-white/20 transition-all relative overflow-hidden"
              >
                <div className={`absolute top-0 inset-x-0 h-1 px-8 opacity-0 group-hover:opacity-100 transition-opacity blur-[2px] ${p.glowingLine}`} />
                <div className={`absolute top-0 inset-x-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity ${p.glowingLine}`} />
                
                <div className={`w-14 h-14 bg-[#151515] border border-apple-glass-border flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                  <p.icon className={`w-7 h-7 ${p.color}`} />
                </div>
                <span className="text-sm font-bold tracking-tight text-[#F5F5F7] group-hover:text-white transition-colors">{p.title}</span>
              </button>
            ))}
          </div>

          <h2 className="text-xs font-medium tracking-normal text-[#A1A1A6] mb-6">Connected Nodes</h2>
          {accounts.map((account, i) => (
            <motion.div 
              key={account.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="smart-card p-6 flex items-center justify-between group hover:bg-[#151515] border border-apple-glass-border transition-all"
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-12 h-12 flex items-center justify-center rounded-sm",
                  account.platform === 'YouTube' && "bg-red-500/10 text-red-500",
                  account.platform === 'Instagram' && "bg-pink-500/10 text-pink-500",
                  account.platform === 'TikTok' && "bg-cyan-500/10 text-cyan-500",
                  account.platform === 'Facebook' && "bg-blue-500/10 text-blue-500",
                )}>
                  {account.platform === 'YouTube' && <Youtube className="w-6 h-6" />}
                  {account.platform === 'Instagram' && <Instagram className="w-6 h-6" />}
                  {account.platform === 'TikTok' && <Smartphone className="w-6 h-6" />}
                  {account.platform === 'Facebook' && <Facebook className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold  tracking-tight">{account.name}</h4>
                    {account.status === 'connected' ? (
                      <CheckCircle2 className="w-3 h-3 text-glow-blue" />
                    ) : (
                      <AlertCircle className="w-3 h-3 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-[#A1A1A6]">{account.handle}</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-12">
                <div className="text-right">
                  <p className="text-xs font-medium text-[#A1A1A6]  tracking-wide">Growth</p>
                  <p className="font-bold text-sm tracking-tight">{account.followers}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#A1A1A6]  tracking-wide">Node Health</p>
                  <p className={cn(
                    "font-bold text-sm tracking-tight",
                    account.health > 90 ? "text-glow-blue" : "text-yellow-500"
                  )}>{account.health}%</p>
                </div>
                <button className="smart-card px-4 py-2 text-xs font-medium  tracking-wide hover:bg-[#1C1C1E] border border-apple-glass-border hover:text-[#1C1C1E] transition-all">Manage</button>
              </div>
            </motion.div>
          ))}

          <button 
            onClick={() => {}}
            className="w-full py-8 border-2 border-dashed border-white/10 rounded-none hover:border-glow-blue/30 hover:bg-blue-50/[0.02] transition-all group flex flex-col items-center justify-center gap-3"
          >
            <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover:border-glow-blue/30">
              <Plus className="w-4 h-4 text-[#A1A1A6] group-hover:text-glow-blue" />
            </div>
            <span className="text-xs font-medium  tracking-normal text-[#A1A1A6] group-hover:text-[#A1A1A6]">Add Experimental Node</span>
          </button>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="smart-card p-8 bg-glow-purple/10 border-glow-purple/30">
            <h3 className="font-bold  tracking-normal mb-6 flex items-center gap-2 text-xs">
              <LinkIcon className="text-glow-purple w-4 h-4" />
              Link Architecture
            </h3>
            <div className="space-y-4">
              {[
                { label: 'YouTube Content API', status: 'Online' },
                { label: 'Meta Graph API', status: 'Online' },
                { label: 'TikTok Creator API', status: 'Limited' },
                { label: 'Twitch Webhook', status: 'Offline' },
              ].map((api) => (
                <div key={api.label} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                  <span className="text-xs font-medium text-[#A1A1A6]">{api.label}</span>
                  <span className={cn(
                    "text-xs font-medium  tracking-wide px-2 py-0.5",
                    api.status === 'Online' ? "text-glow-blue border border-glow-blue/30" : 
                    api.status === 'Limited' ? "text-yellow-500 border border-yellow-500/20" : 
                    "text-red-500 border border-red-500/20"
                  )}>{api.status}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-[#1C1C1E] border border-apple-glass-border font-black  tracking-normal text-xs hover:bg-glow-blue/10 transition-all">
              Initialize Full Proxy
            </button>
          </div>

          <div className="smart-card p-8">
            <h3 className="font-bold  tracking-normal mb-4 text-xs">Platform Sync Instructions</h3>
            <div className="space-y-4 text-xs leading-loose text-[#A1A1A6] font-medium">
              <p>1. Ensure 2FA is active on all node accounts.</p>
              <p>2. Grant 'Content Analysis' permissions only.</p>
              <p>3. Set refresh interval to 15min for real-time tracking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
