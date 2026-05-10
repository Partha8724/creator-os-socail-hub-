import React, { useState } from 'react';
import { Youtube, Facebook, Instagram, CheckCircle2, ChevronRight, Share2, Activity, Globe, Smartphone, Twitter, Linkedin } from 'lucide-react';
import { useNotify } from '@/src/contexts/NotificationContext';
import { firebaseService, auth } from '@/src/services/firebase';
import { GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth';

const platforms = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: Youtube,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    description: 'Sync channels, track analytics, and optimize growth.',
    buttonText: 'Connect Channel'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    description: 'Manage pages, track reach, and sync meta data.',
    buttonText: 'Connect Pages'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    description: 'Track reels performance and optimize engagement.',
    buttonText: 'Connect Profile'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: Smartphone,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    description: 'Track viral trends, sounds, and video analytics.',
    buttonText: 'Connect TikTok'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: Twitter,
    color: 'text-[#E7E9EA]',
    bgColor: 'bg-[#E7E9EA]/10',
    borderColor: 'border-[#E7E9EA]/30',
    description: 'Manage threads, schedule posts, and track engagement.',
    buttonText: 'Connect X'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30',
    description: 'Manage professional presence and B2B reach.',
    buttonText: 'Connect Profile'
  }
];

export default function ConnectAccounts() {
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [connecting, setConnecting] = useState<Record<string, boolean>>({});
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const { notify } = useNotify();

  const handleConnect = async (id: string, name: string) => {
    if (connecting[id]) return;
    setConnecting(prev => ({ ...prev, [id]: true }));
    notify(`Initializing secure link to ${name}...`, 'smart');
    
    try {
      if (id === 'youtube') {
        const result = await firebaseService.signInWithGoogle();
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          localStorage.setItem('youtube_access_token', credential.accessToken);
        }
      } else if (id === 'facebook' || id === 'instagram') {
        const result = await firebaseService.signInWithFacebook();
        const credential = FacebookAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          localStorage.setItem(`${id}_access_token`, credential.accessToken);
        }
      } else {
        // Mock connection for TikTok, Twitter, LinkedIn
        await new Promise(resolve => setTimeout(resolve, 1500));
        localStorage.setItem(`${id}_access_token`, 'mock_token');
      }
      
      setConnected(prev => ({ ...prev, [id]: true }));
      notify(`${name} node synchronized successfully.`, 'success');
    } catch (error: any) {
      console.error(`${name} Auth Error:`, error);
      let errorMsg = error.message;
      let notificationType: "error" | "success" | "info" | "smart" = "error";
      if (error.code === 'auth/operation-not-allowed') {
        errorMsg = `${name} Auth provider is not enabled in Firebase Console.`;
      } else if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        errorMsg = 'OAuth window was closed.';
        notificationType = "info";
      }
      notify(errorMsg, notificationType, "Sync Interrupted");
    } finally {
      setConnecting(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDisconnect = (id: string, name: string) => {
    setConnected(prev => ({ ...prev, [id]: false }));
    localStorage.removeItem(`${id}_access_token`);
    setActivePlatform(null);
    notify(`${name} connection severed.`, 'info');
  };

  const handleRefresh = (id: string, name: string) => {
    notify(`Refreshing ${name} sync tokens...`, 'info');
    setActivePlatform(null);
    handleConnect(id, name);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700 font-sans selection:bg-glow-blue/30 selection:text-white">
      {activePlatform && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="bg-[#101010]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_16_64px_rgba(0,0,0,0.9)] p-8 rounded-[32px] w-full max-w-sm">
            <h2 className="text-xl font-bold text-[#F5F5F7] mb-6">Manage {platforms.find(p => p.id === activePlatform)?.name}</h2>
            <div className="space-y-4">
              <button 
                onClick={() => handleRefresh(activePlatform, platforms.find(p => p.id === activePlatform)?.name || '')}
                className="w-full py-4 bg-[#151515] border border-white/10 rounded-2xl text-[#F5F5F7] font-bold text-sm hover:border-glow-blue/50 transition-all"
              >
                Refresh Sync
              </button>
              <button 
                onClick={() => handleDisconnect(activePlatform, platforms.find(p => p.id === activePlatform)?.name || '')}
                className="w-full py-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-bold text-sm hover:border-red-500/50 transition-all"
              >
                Disconnect
              </button>
              <button 
                onClick={() => setActivePlatform(null)}
                className="w-full py-2 text-[#86868B] font-medium text-xs hover:text-[#F5F5F7] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-[#F5F5F7]">Platform Sync</h1>
        <p className="text-[#A1A1A6] font-medium mb-6">Connect your social nodes. Our system will funnel real-time data directly into your growth dashboard.</p>
        
        <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-[2rem] max-w-3xl flex gap-4 items-start shadow-inner">
          <Globe className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F5F5F7]">Google Verification Notice</h4>
            <p className="text-[11px] text-[#A1A1A6] font-medium leading-relaxed">
              Because this app requires advanced YouTube scopes to manage posts, you may see a 
              <strong> "Google hasn’t verified this app" </strong> warning during login. 
              To bypass this during development: click <strong>"Advanced"</strong>, then <strong>"Go to App (unsafe)"</strong>. 
            </p>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        {platforms.map(platform => {
          const Icon = platform.icon;
          const isConnected = connected[platform.id];
          const isConnecting = connecting[platform.id];

          return (
            <div key={platform.id} className="relative group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={`p-8 rounded-[2.5rem] bg-[#101010]/80 backdrop-blur-2xl border transition-all duration-500 overflow-hidden relative shadow-[0_8_32px_rgba(0,0,0,0.8)] ${isConnected ? 'border-glow-blue/30 shadow-[0_0_40px_rgba(0,242,255,0.15)]' : 'border-white/[0.08] hover:border-white/20'}`}>
                
                {isConnected && (
                  <div className="absolute top-0 right-0 p-6">
                    <CheckCircle2 className="w-6 h-6 text-glow-blue drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]" />
                  </div>
                )}
                
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${platform.bgColor} ${platform.borderColor} border`}>
                  <Icon className={`w-8 h-8 ${platform.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-[#F5F5F7] mb-2">{platform.name}</h3>
                <p className="text-[#86868B] text-sm font-medium mb-8 leading-relaxed h-10">
                  {platform.description}
                </p>

                {isConnected ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-[#151515] rounded-2xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs text-[#86868B] font-medium uppercase tracking-wider">Status</span>
                        <span className="text-glow-blue font-bold text-sm">Synced & Active</span>
                      </div>
                      <Activity className="w-5 h-5 text-glow-blue animate-pulse" />
                    </div>
                    
                    <button 
                      onClick={() => setActivePlatform(platform.id)}
                      className="w-full py-4 text-[#86868B] font-bold tracking-wide text-xs hover:bg-[#151515] border border-transparent hover:border-white/10 transition-all rounded-2xl"
                    >
                      Manage
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleConnect(platform.id, platform.name)}
                    disabled={isConnecting}
                    className="w-full py-4 bg-[#151515] hover:bg-white/5 border border-white/10 text-[#F5F5F7] font-bold tracking-wide text-xs transition-all transform active:scale-95 flex items-center justify-center gap-2 rounded-2xl disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <span className="animate-pulse">Authorizing...</span>
                    ) : (
                      <>
                        {platform.buttonText}
                        <ChevronRight className="w-4 h-4 text-[#86868B] group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-12 p-8 md:p-12 bg-[#101010]/80 backdrop-blur-2xl rounded-[3rem] border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-glow-purple/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
            <Share2 className="w-8 h-8 text-glow-purple" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#F5F5F7] mb-2">Omnichannel Flow</h3>
            <p className="text-[#A1A1A6] font-medium leading-relaxed max-w-2xl">
              Once connected, the system automatically pulls data across all platforms, cross-references algorithmic trends, and synthesizes publishing schedules for maximum reach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
