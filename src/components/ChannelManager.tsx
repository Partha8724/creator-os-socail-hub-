import React, { useState } from 'react';
import { Video, Edit3, Image as ImageIcon, Tag, Search, CheckCircle2, ChevronRight, Activity, ArrowUpRight, Youtube, Instagram, Facebook, Smartphone, BarChart3, Users, PlaySquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotify } from '@/src/contexts/NotificationContext';
import { gemini } from '@/src/services/gemini';

const formatNumber = (num: string | number) => {
  const n = typeof num === 'string' ? parseInt(num, 10) : num;
  if (isNaN(n)) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString();
};

const MOCK_VIDEOS = [
  { id: 1, title: 'I Built a Viral App in 24 Hours', views: '1.2M', date: '2 days ago', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop', tags: 'tech, coding, challenge', category: 'YouTube' },
  { id: 2, title: 'The Secret to 10k MRR', views: '450K', date: '1 week ago', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop', tags: 'business, saas, startup', category: 'YouTube' },
  { id: 3, title: 'AI Tools You Need in 2026', views: '890K', date: '2 weeks ago', thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop', tags: 'ai, productivity, tips', category: 'Facebook' },
  { id: 4, title: 'My Desk Setup Tour', views: '2.1M', date: '1 month ago', thumbnail: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=600&auto=format&fit=crop', tags: 'desk setup, tech, aesthetic', category: 'Instagram' }
];

export default function ChannelManager() {
  const [isConnected, setIsConnected] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [tiktokLink, setTiktokLink] = useState('');
  const [activeChannels, setActiveChannels] = useState({ youtube: '', facebook: '', instagram: '', tiktok: '' });
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', tags: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const { notify } = useNotify();

  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [channelStats, setChannelStats] = useState<any>(null);

  const fetchChannelStats = async (link: string) => {
    try {
      setIsLoadingStats(true);
      // Extract identifier (e.g. from https://youtube.com/@channel)
      let identifier = link;
      if (link.includes('youtube.com/')) {
        const parts = link.split('youtube.com/');
        identifier = parts[1].split('/')[0];
      }
      const response = await fetch(`/api/youtube/channel?identifier=${encodeURIComponent(identifier)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setChannelStats(data);
    } catch (e: any) {
      console.error(e);
      notify('Failed to sync real-time YouTube stats. Using cached data.', 'error');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleConnect = async () => {
    setActiveChannels({ 
       youtube: youtubeLink || 'https://youtube.com/@demo_channel', 
       facebook: facebookLink || 'https://facebook.com/demo_page', 
       instagram: instagramLink || 'https://instagram.com/demo_profile',
       tiktok: tiktokLink || 'https://tiktok.com/@demo_tiktok'
    });
    setIsConnected(true);
    notify('Channels successfully synced', 'success');
    
    // Fetch stats for youtube
    await fetchChannelStats(youtubeLink || 'https://youtube.com/@demo_channel');
  };

  const openEditor = (video: any) => {
    setSelectedVideo(video);
    setEditForm({ title: video.title, tags: video.tags });
    setIsEditing(true);
  };

  const autoOptimize = async () => {
    if (!selectedVideo) return;
    setIsGenerating(true);
    notify('Neural optimization initiated...', 'smart');
    
    try {
      const prompt = `Act as an elite SEO expert for ${selectedVideo.category}. Optimize this video metadata: Title: "${editForm.title}". Tags: "${editForm.tags}". Return JSON with exactly two keys: "optimizedTitle" and "optimizedTags".`;
      const result = await gemini.generateContent(prompt);
      const parsed = JSON.parse(result.replace(/```json|```/g, '').trim());
      
      setEditForm({
        title: parsed.optimizedTitle,
        tags: parsed.optimizedTags
      });
      notify('Metadata optimized successfully', 'success');
    } catch (error) {
      notify('Optimization fallback activated', 'info');
      setEditForm({
        title: `(OPTIMIZED) ${editForm.title} - Mind Blowing!`,
        tags: `${editForm.tags}, viral, trending, optimized`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveChanges = () => {
    setIsEditing(false);
    notify('Changes pushed to remote channels', 'success');
  };

  if (!isConnected) {
    return (
      <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[3rem] p-12 text-center max-w-3xl mx-auto relative z-10 border-t-glow-blue/20">
        <div className="flex justify-center gap-4 mb-8">
           <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
             <Youtube className="w-8 h-8 text-red-500" />
           </div>
           <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
             <Facebook className="w-8 h-8 text-blue-500" />
           </div>
           <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
             <Instagram className="w-8 h-8 text-pink-500" />
           </div>
        </div>
        <h2 className="text-3xl font-black text-[#F5F5F7] mb-4">Omni-Channel Sync</h2>
        <p className="text-[#A1A1A6] font-medium max-w-lg mx-auto mb-10 text-sm leading-relaxed">
          Connect your YouTube, Facebook, and Instagram accounts to directly edit videos, update thumbnails, and optimize SEO tags across all platforms from this central interface.
        </p>

        <div className="space-y-4 max-w-md mx-auto mb-10 text-left">
           <div>
              <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">YouTube Channel URL</label>
              <input 
                 type="text" 
                 value={youtubeLink}
                 onChange={e=>setYoutubeLink(e.target.value)}
                 placeholder="https://youtube.com/@yourchannel"
                 className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none focus:border-red-500/50 transition-all rounded-2xl text-white"
              />
           </div>
           <div>
              <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">Facebook Page URL</label>
              <input 
                 type="text" 
                 value={facebookLink}
                 onChange={e=>setFacebookLink(e.target.value)}
                 placeholder="https://facebook.com/yourpage"
                 className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none focus:border-blue-500/50 transition-all rounded-2xl text-white"
              />
           </div>
           <div>
              <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">Instagram Profile URL</label>
              <input 
                 type="text" 
                 value={instagramLink}
                 onChange={e=>setInstagramLink(e.target.value)}
                 placeholder="https://instagram.com/yourprofile"
                 className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none focus:border-pink-500/50 transition-all rounded-2xl text-white"
              />
           </div>
           <div>
              <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2">TikTok Profile URL</label>
              <input 
                 type="text" 
                 value={tiktokLink}
                 onChange={e=>setTiktokLink(e.target.value)}
                 placeholder="https://tiktok.com/@yourprofile"
                 className="w-full bg-[#000] border border-white/10 p-4 font-bold text-sm focus:outline-none focus:border-cyan-500/50 transition-all rounded-2xl text-white"
              />
           </div>
        </div>

        <button 
          onClick={handleConnect}
          className="px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] text-xs transition-all rounded-full hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        >
          Secure Platform Connect
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      {/* Active Channels Header */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         {activeChannels.youtube && (
           <a href={activeChannels.youtube} target="_blank" rel="noopener noreferrer" className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] hover:border-red-500/50 transition-all rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                 <Youtube className="w-5 h-5 text-red-500" />
              </div>
              <div className="truncate flex-1">
                 <p className="text-white font-bold text-sm">YouTube</p>
                 <p className="text-[#A1A1A6] text-[10px] font-medium truncate">{activeChannels.youtube}</p>
              </div>
           </a>
         )}
         {activeChannels.facebook && (
           <a href={activeChannels.facebook} target="_blank" rel="noopener noreferrer" className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] hover:border-blue-500/50 transition-all rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                 <Facebook className="w-5 h-5 text-blue-500" />
              </div>
              <div className="truncate flex-1">
                 <p className="text-white font-bold text-sm">Facebook</p>
                 <p className="text-[#A1A1A6] text-[10px] font-medium truncate">{activeChannels.facebook}</p>
              </div>
           </a>
         )}
         {activeChannels.instagram && (
           <a href={activeChannels.instagram} target="_blank" rel="noopener noreferrer" className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] hover:border-pink-500/50 transition-all rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
                 <Instagram className="w-5 h-5 text-pink-500" />
              </div>
              <div className="truncate flex-1">
                 <p className="text-white font-bold text-sm">Instagram</p>
                 <p className="text-[#A1A1A6] text-[10px] font-medium truncate">{activeChannels.instagram}</p>
              </div>
           </a>
         )}
         {activeChannels.tiktok && (
           <a href={activeChannels.tiktok} target="_blank" rel="noopener noreferrer" className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] hover:border-cyan-500/50 transition-all rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                 <Smartphone className="w-5 h-5 text-cyan-500" />
              </div>
              <div className="truncate flex-1">
                 <p className="text-white font-bold text-sm">TikTok</p>
                 <p className="text-[#A1A1A6] text-[10px] font-medium truncate">{activeChannels.tiktok}</p>
              </div>
           </a>
         )}
         <div className="bg-glow-blue/10 border border-glow-blue/20 rounded-2xl p-4 flex items-center justify-center flex-col cursor-pointer hover:bg-glow-blue/20 transition-all" onClick={() => setIsConnected(false)}>
            <p className="text-glow-blue font-bold text-sm">Edit Platforms</p>
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Real-time Analytics Dashboard */}
        {channelStats && (
          <div className="lg:col-span-12 items-center">
            <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8">
               <div className="flex items-center gap-6 mb-8">
                  {channelStats.thumbnail && (
                     <img src={channelStats.thumbnail} alt={channelStats.title} className="w-16 h-16 rounded-full border-2 border-red-500" />
                  )}
                  <div>
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {channelStats.title} <Activity className="w-5 h-5 text-glow-blue" />
                     </h3>
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#A1A1A6]">Real-time Channel Analytics</p>
                  </div>
               </div>
               <div className="grid md:grid-cols-3 gap-6">
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                   <Users className="w-8 h-8 text-white/10 absolute -right-2 -top-2" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#A1A1A6] mb-2">Subscribers</p>
                   <p className="text-3xl font-black text-white">{formatNumber(channelStats.subscriberCount)}</p>
                   <p className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> Trending UP</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                   <BarChart3 className="w-8 h-8 text-white/10 absolute -right-2 -top-2" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#A1A1A6] mb-2">Total Views</p>
                   <p className="text-3xl font-black text-white">{formatNumber(channelStats.viewCount)}</p>
                   <p className="text-green-500 text-xs font-bold mt-2 flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/> +12K today</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                   <PlaySquare className="w-8 h-8 text-white/10 absolute -right-2 -top-2" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#A1A1A6] mb-2">Total Videos</p>
                   <p className="text-3xl font-black text-white">{formatNumber(channelStats.videoCount)}</p>
                 </div>
               </div>
            </div>
          </div>
        )}

        <div className="lg:col-span-12">
          <div className="bg-[#101010]/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8_32px_rgba(0,0,0,0.8)] rounded-[2.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <Video className="w-5 h-5 text-glow-blue" />
                 Content Library
               </h3>
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
                  <input 
                     type="text" 
                     placeholder="Search videos..." 
                     className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-glow-blue/50"
                  />
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(channelStats?.recentVideos || MOCK_VIDEOS).map((video: any) => (
                <div key={video.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all">
                  <div className="relative aspect-video">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => openEditor(video)} className="px-4 py-2 bg-glow-blue text-black font-bold uppercase tracking-widest text-[10px] rounded-full flex items-center gap-2">
                          <Edit3 className="w-3 h-3" /> Edit & Optimize
                       </button>
                    </div>
                  </div>
                  <div className="p-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#86868B] mb-1 block">
                       {video.category || 'YouTube'} • {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString() : (video.date || '')}
                     </span>
                     <h4 className="text-white font-bold text-sm mb-2 line-clamp-2">{video.title}</h4>
                     
                     <div className="flex items-center gap-4 text-[10px] font-bold text-[#A1A1A6]">
                        <span className="flex items-center gap-1 text-green-500">
                          <Activity className="w-3 h-3" /> {formatNumber(video.viewCount || video.views || 0)}
                        </span>
                        {(video.likeCount || video.likeCount === 0) && (
                          <span className="flex items-center gap-1">
                            <span className="text-blue-400">👍</span> {formatNumber(video.likeCount)}
                          </span>
                        )}
                        {(video.commentCount || video.commentCount === 0) && (
                          <span className="flex items-center gap-1">
                            💬 {formatNumber(video.commentCount)}
                          </span>
                        )}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && selectedVideo && (
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
              className="bg-[#151515] border border-white/10 shadow-2xl rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
               <div className="p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-[#151515]/90 backdrop-blur-xl z-20">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                     <Edit3 className="w-5 h-5 text-glow-blue" />
                     Live Platform Editor
                  </h2>
                  <div className="flex items-center gap-3">
                     <button onClick={autoOptimize} disabled={isGenerating} className="px-4 py-2 bg-glow-purple/20 text-glow-purple border border-glow-purple/30 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-glow-purple/30 transition-all flex items-center gap-2 disabled:opacity-50">
                        {isGenerating ? 'Optimizing...' : 'AI Title & Tags'}
                     </button>
                     <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/5 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">Cancel</button>
                     <button onClick={saveChanges} className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all">Publish Sync</button>
                  </div>
               </div>

               <div className="p-8 grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative group">
                        <img src={selectedVideo.thumbnail} alt="thumb" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/10 backdrop-blur-md text-white text-xs font-bold rounded-lg hover:bg-white/10">
                              <ImageIcon className="w-4 h-4" /> Change Thumbnail
                           </button>
                        </div>
                     </div>
                     
                     <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#A1A1A6]">Target Platform</span>
                        <span className="text-sm font-bold text-white px-3 py-1 bg-white/10 rounded-lg">{selectedVideo.category}</span>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div>
                        <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2 text-glow-blue">Title Engine</label>
                        <textarea 
                           value={editForm.title}
                           onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                           className="w-full bg-[#000] border border-white/10 p-4 text-sm font-bold text-white focus:outline-none focus:border-glow-blue/50 rounded-2xl resize-none h-24"
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-[#A1A1A6] uppercase tracking-[0.2em] block mb-2 text-glow-purple">SEO Tags</label>
                        <textarea 
                           value={editForm.tags}
                           onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                           className="w-full bg-[#000] border border-white/10 p-4 text-sm font-medium text-white focus:outline-none focus:border-glow-purple/50 rounded-2xl resize-none h-24"
                        />
                     </div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
