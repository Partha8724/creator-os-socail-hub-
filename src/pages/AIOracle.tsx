import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Command,
  Eye,
  Shield,
  Activity
} from 'lucide-react';
import { gemini } from '@/src/services/gemini';
import { cn } from '@/src/lib/utils';
import { useNotify } from '@/src/contexts/NotificationContext';

interface Message {
  id: string;
  role: 'oracle' | 'user';
  text: string;
  type?: 'prophecy' | 'standard';
}

export default function AIOracle() {
  const { notify } = useNotify();
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      role: 'oracle', 
      text: "Connection established. I am the AI Oracle of the Hub. What market trajectories shall I decipher for you?",
      type: 'standard'
    }
  ]);
  const [input, setInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input || isSyncing) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSyncing(true);
    notify("Transmitting smart query to Oracle platform...", "smart", "Hub Uplink");

    try {
      const prophecy = await gemini.getProphecy(input);
      const oracleMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'oracle', 
        text: prophecy || "The smart streams are clouded. Retry the sync.",
        type: 'prophecy'
      };
      setMessages(prev => [...prev, oracleMsg]);
      notify("Oracle response synthesized.", "success", "Sync Response");
    } catch (error: any) {
      console.error(error);
      const errorMsg = error?.message || "Smart signal lost. Prophecy interrupted.";
      notify(errorMsg, "error", "Link Failed");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1C1C1E] border border-apple-glass-border animate-in fade-in duration-1000">
      <header className="mb-8 shrink-0">
        <h1 className="text-4xl font-bold tracking-tight  mb-2">AI Oracle</h1>
        <p className="text-[#A1A1A6] font-medium text-sm  tracking-wide italic">Real-time Marketing Prophecies & Smart Intelligence</p>
      </header>

      {/* Chat Terminal */}
      <div className="flex-1 smart-card flex flex-col relative overflow-hidden">
        {/* Decorative Grid Overlay for Chat */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 relative z-10 scroll-smooth">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                className={cn(
                  "flex gap-6 max-w-4xl",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 shrink-0 flex items-center justify-center border",
                  msg.role === 'oracle' ? "border-glow-blue/30 bg-glow-blue/10" : "border-white/10 bg-[#151515] border border-apple-glass-border"
                )}>
                  {msg.role === 'oracle' ? <Eye className="w-5 h-5 text-glow-blue" /> : <User className="w-5 h-5 text-[#A1A1A6]" />}
                </div>
                
                <div className={cn(
                  "p-6 relative group",
                  msg.role === 'oracle' ? "smart-card bg-[#151515] border border-apple-glass-border" : "bg-[#151515] border border-apple-glass-border"
                )}>
                  {msg.type === 'prophecy' && (
                    <div className="absolute -top-3 left-6 flex items-center gap-2 bg-glow-purple/10 px-3 py-1 scale-75 lg:scale-100">
                      <Sparkles className="w-3 h-3 text-[#A1A1A6]" />
                      <span className="text-xs font-medium  tracking-normal font-bold">Smart Prophecy</span>
                    </div>
                  )}
                  <p className={cn(
                     "text-sm leading-relaxed",
                     msg.role === 'oracle' ? "text-glow-blue italic font-medium" : "text-[#A1A1A6]"
                  )}>{msg.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isSyncing && (
            <motion.div className="flex gap-6 max-w-4xl">
              <div className="w-10 h-10 flex items-center justify-center border border-glow-blue/30 bg-glow-blue/10 animate-pulse">
                <Activity className="w-5 h-5 text-glow-blue animate-spin-slow" />
              </div>
              <div className="p-6 bg-[#151515] border border-apple-glass-border w-24 flex items-center justify-center gap-1">
                 <div className="w-1 h-1 bg-glow-blue/10 animate-bounce" />
                 <div className="w-1 h-1 bg-glow-blue/10 animate-bounce delay-100" />
                 <div className="w-1 h-1 bg-glow-blue/10 animate-bounce delay-200" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Interface */}
        <div className="p-6 border-t border-white/10 bg-[#1C1C1E] border border-apple-glass-border relative z-10">
          <form onSubmit={sendMessage} className="flex gap-4">
             <div className="relative flex-1">
                <input 
                  type="text"
                  placeholder="Ask the Oracle about your viral destiny..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-[#151515] border border-apple-glass-border p-4 pl-12 font-medium text-xs focus:outline-none focus:border-glow-blue/30 transition-colors"
                />
                <Command className="absolute left-4 top-4 w-4 h-4 text-[#A1A1A6]" />
             </div>
             <button 
               type="submit"
               disabled={!input || isSyncing}
               className="px-8 bg-glow-blue/10 text-[#F5F5F7] font-bold  tracking-wide text-xs hover:bg-[#1C1C1E] border border-apple-glass-border transition-all disabled:opacity-50"
             >
               Sync Query
             </button>
          </form>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2 opacity-30">
               <Shield className="w-3 h-3" />
               <span className="text-xs font-medium  tracking-wide">End-to-End Smart Encryption Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
