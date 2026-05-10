import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  Youtube, 
  Instagram, 
  Smartphone, 
  Zap, 
  Check,
  Plus,
  RefreshCw,
  MoreVertical,
  X,
  Send,
  Trash2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNotify } from '@/src/contexts/NotificationContext';
import { auth, db } from '@/src/services/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

const platformIcons: Record<string, any> = {
  YouTube: Youtube,
  Facebook: Smartphone,
  Instagram: Instagram
};

export default function SmartScheduler() {
  const [filter, setFilter] = useState('All');
  const [queue, setQueue] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPlatform, setNewPlatform] = useState('YouTube');
  const { notify } = useNotify();

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'queue'), where('userId', '==', auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
      });
      // sort by expected time descending
      items.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setQueue(items);
    }, (error) => {
      console.error("Queue Sync Error:", error);
    });

    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!newTitle) return notify("Post title is required.", "error");
    if (!auth.currentUser) return notify("Please sign in first.", "error");
    
    notify(`Initializing cross-platform broadcast sequence for ${newPlatform}...`, 'smart');
    
    // Simulate real dispatch if tokens exist
    const ytToken = localStorage.getItem('youtube_access_token');
    const fbToken = localStorage.getItem('facebook_access_token');
    
    if (newPlatform === 'YouTube' && !ytToken) {
       notify("YouTube access token missing. Please connect node in Connect Accounts.", "error");
       return;
    }
    if ((newPlatform === 'Facebook' || newPlatform === 'Instagram') && !fbToken) {
       notify(`${newPlatform} access token missing. Please connect node in Connect Accounts.`, "error");
       return;
    }

    try {
      // Mock API call simulation to network
      await new Promise(res => setTimeout(res, 1500));
      
      const docRef = collection(db, 'queue');
      await addDoc(docRef, {
        userId: auth.currentUser.uid,
        platform: newPlatform,
        title: newTitle,
        content: newContent,
        status: 'Node Synced',
        timeStr: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ' Today',
        createdAt: serverTimestamp()
      });
      
      notify('Broadcast successful. Node fully synchronized.', 'success');
      setShowModal(false);
      setNewTitle('');
      setNewContent('');
    } catch (error: any) {
      notify(`Broadcast failed: ${error.message}`, 'error');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
     e.stopPropagation();
     try {
       await deleteDoc(doc(db, 'queue', id));
       notify("Node purged from queue.", "info");
     } catch (err: any) {
       notify("Failed to purge node.", "error");
     }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 relative font-sans selection:bg-glow-blue/30 selection:text-white pb-24">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-glow-blue/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-glow-purple/10 blur-[150px] rounded-full pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay z-0" />

      <header className="flex justify-between items-end relative z-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Smart Scheduler</h1>
          <p className="text-[#A1A1A6] font-medium text-sm tracking-wide italic">Cross-Platform Node Queue</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#101010]/80 backdrop-blur-xl px-8 py-4 flex items-center gap-3 border border-white/[0.08] hover:bg-white hover:text-black transition-all duration-300 font-black text-xs tracking-widest uppercase shadow-[0_8_32px_rgba(0,0,0,0.5)] active:scale-[0.98] rounded-[2rem]"
        >
          <Plus className="w-4 h-4" /> New Sync Node
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        <div className="md:col-span-8 flex flex-col gap-6">
           <div className="flex gap-4 border-b border-white/[0.08] pb-4">
              {['All', 'YouTube', 'Facebook', 'Instagram'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest transition-colors",
                    filter === f ? "text-glow-blue" : "text-[#A1A1A6] hover:text-[#F5F5F7]"
                  )}
                >
                  {f}
                </button>
              ))}
           </div>

           <div className="space-y-3">
              {queue.length === 0 && (
                 <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[3rem] p-12 text-center text-[#86868B] font-medium text-sm">
                    No active transmissions. Queue is empty.
                 </div>
              )}
              {queue.filter(item => filter === 'All' || item.platform === filter).map((item, i) => {
                const Icon = platformIcons[item.platform] || platformIcons['YouTube'];
                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.5)] p-6 rounded-[2rem] group flex items-center gap-6 hover:border-glow-blue/30 transition-all duration-300 cursor-pointer relative overflow-hidden mb-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-glow-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-14 h-14 flex items-center justify-center bg-black/40 border border-white/[0.08] rounded-2xl relative z-10 shrink-0">
                       <Icon className={cn(
                         "w-5 h-5",
                         item.platform === 'YouTube' ? "text-red-500" :
                         item.platform === 'Instagram' ? "text-glow-purple" : "text-blue-500"
                       )} />
                    </div>
                    
                    <div className="flex-1 min-w-0 relative z-10">
                       <h4 className="font-bold tracking-tight truncate text-sm mb-1">{item.title}</h4>
                       <div className="flex items-center gap-4 text-xs font-medium tracking-wide text-[#A1A1A6]">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-glow-blue" /> {item.timeStr || 'Recent'}</span>
                          <span className="flex items-center gap-1 uppercase tracking-widest text-[10px]"><Zap className="w-3 h-3 text-glow-purple" /> {item.platform}</span>
                       </div>
                    </div>

                    <div className="flex items-center gap-6 pr-2 relative z-10">
                       <div className="hidden lg:flex items-center gap-2">
                          <div className={cn(
                             "w-1.5 h-1.5 rounded-full",
                             item.status === 'Node Synced' ? "bg-glow-blue shadow-[0_0_10px_#00f2ff]" : "bg-[#151515] border border-apple-glass-border"
                          )} />
                          <span className={cn(
                            "text-xs font-bold uppercase tracking-wider",
                            item.status === 'Node Synced' ? "text-glow-blue" : "text-[#A1A1A6]"
                          )}>{item.status}</span>
                       </div>
                       <button onClick={(e) => handleDelete(item.id, e)} className="text-[#A1A1A6] hover:text-red-500 transition-colors p-2">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </motion.div>
                );
              })}
           </div>
        </div>

        <div className="md:col-span-4 space-y-6">
           <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[3rem] p-10 flex flex-col items-center text-center">
              <Calendar className="w-12 h-12 text-white mb-6" />
              <h3 className="font-black tracking-tight mb-3 text-2xl text-white">Smart Pulse Ready</h3>
              <p className="text-sm text-[#86868B] leading-relaxed mb-8 font-medium px-4 italic">"The algorithms predict maximum engagement loops within the next 4 orbital cycles."</p>
              <div className="w-full bg-[#101010]/60 backdrop-blur-md p-6 border border-white/[0.08] rounded-2xl flex justify-between items-center mb-8">
                 <span className="text-xs font-bold text-[#86868B] uppercase tracking-widest">Active Slots</span>
                 <span className="text-lg font-black text-white">{queue.length} / ∞</span>
              </div>
              <button className="w-full py-5 border border-white/[0.08] bg-[#101010] hover:bg-white hover:text-black transition-all duration-300 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 rounded-[2rem] shadow-[0_8_32px_rgba(0,0,0,0.5)] active:scale-[0.98] group">
                 <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-700" /> Optimize Sync Times
              </button>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg bg-[#101010]/95 backdrop-blur-3xl p-10 border border-white/[0.08] rounded-[3rem] shadow-[0_16_64px_rgba(0,0,0,0.8)]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                  <Zap className="w-6 h-6 text-glow-blue" />
                  Compose Node
                </h2>
                <button onClick={() => setShowModal(false)} className="text-[#A1A1A6] hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-[#A1A1A6] uppercase tracking-widest mb-2">Target Platform</label>
                  <div className="flex gap-2">
                    {['YouTube', 'Facebook', 'Instagram'].map(p => (
                      <button
                        key={p}
                        onClick={() => setNewPlatform(p)}
                        className={cn(
                          "flex-1 py-4 text-xs font-bold uppercase tracking-wider border rounded-2xl transition-all duration-300",
                          newPlatform === p 
                            ? "bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                            : "bg-[#101010] border-white/[0.05] text-[#86868B] hover:border-white/20 hover:text-white"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A1A1A6] uppercase tracking-widest mb-2">Node Title / Subject</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#101010]/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 text-sm font-bold text-white focus:border-glow-blue/50 focus:bg-[#101010]/80 focus:outline-none transition-all duration-300 shadow-inner"
                    placeholder="Enter broadcast title..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A1A1A6] uppercase tracking-widest mb-2">Data Payload (Description)</label>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={4}
                    className="w-full bg-[#101010]/50 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 text-sm font-bold text-white focus:border-glow-blue/50 focus:bg-[#101010]/80 focus:outline-none transition-all duration-300 shadow-inner resize-none"
                    placeholder="Enter message or video description..."
                  />
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-5 border border-white/[0.08] rounded-[2rem] hover:bg-white/5 font-black text-xs uppercase tracking-widest transition-colors duration-300 active:scale-[0.98]"
                  >
                    Abort
                  </button>
                  <button 
                    onClick={handlePost}
                    className="flex-[2] py-5 bg-[#101010]/80 backdrop-blur-xl border border-white/[0.08] text-white hover:bg-white hover:text-black font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_8_32px_rgba(0,0,0,0.5)] flex items-center justify-center gap-3 rounded-[2rem] active:scale-[0.98]"
                  >
                    <Send className="w-4 h-4" /> Initialize Publish
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
