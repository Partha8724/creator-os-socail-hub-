import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Info, X, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export type NotificationType = 'success' | 'error' | 'info' | 'smart';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  title?: string;
}

interface NotificationContextType {
  notify: (message: string, type?: NotificationType, title?: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: NotificationType = 'info', title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notify, removeNotification }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none w-full max-w-sm">
        <AnimatePresence mode="popLayout">
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={cn(
                "pointer-events-auto relative overflow-hidden smart-card p-4 flex gap-4 border-l-2",
                n.type === 'success' && "border-l-primary-blue bg-glow-blue/10",
                n.type === 'error' && "border-l-red-500 bg-red-500/5",
                n.type === 'smart' && "border-l-primary-indigo bg-glow-purple/10",
                n.type === 'info' && "border-l-slate-200 bg-[#151515] border border-apple-glass-border"
              )}
            >
              <div className="shrink-0 pt-0.5">
                {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-glow-blue" />}
                {n.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                {n.type === 'smart' && <Zap className="w-5 h-5 text-glow-purple" />}
                {n.type === 'info' && <Info className="w-5 h-5 text-[#A1A1A6]" />}
              </div>
              
              <div className="flex-1 min-w-0">
                {n.title && (
                  <h4 className="text-xs font-black  tracking-wide text-[#A1A1A6] mb-1">
                    {n.title}
                  </h4>
                )}
                <p className="text-sm font-medium lowercase text-[#A1A1A6] leading-relaxed italic">
                  "{n.message}"
                </p>
              </div>

              <button 
                onClick={() => removeNotification(n.id)}
                className="shrink-0 text-[#A1A1A6] hover:text-[#A1A1A6] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Progress bar effect */}
              <motion.div 
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 5, ease: "linear" }}
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-[1px] origin-left",
                  n.type === 'success' && "bg-glow-blue/10",
                  n.type === 'error' && "bg-red-500",
                  n.type === 'smart' && "bg-glow-purple/10",
                  n.type === 'info' && "bg-[#151515] border border-apple-glass-border"
                )}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotify must be used within NotificationProvider');
  return context;
}
