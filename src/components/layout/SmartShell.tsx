import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Youtube, 
  Smartphone, 
  Zap, 
  Eye, 
  Clock, 
  CreditCard,
  ZapIcon,
  Circle,
  LogOut,
  Link,
  Layers,
  Activity,
  Radio,
  Menu,
  Share2,
  BarChart2,
  ShieldCheck,
  BrainCircuit,
  TrendingUp,
  DollarSign,
  Settings
} from 'lucide-react';
import { cn, NAV_ITEMS } from '@/src/lib/utils';
import { firebaseService } from '@/src/services/firebase';
import { useUser } from '@/src/contexts/UserContext';

import ErrorBoundary from '../ErrorBoundary';
import AICoach from './AICoach';

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Youtube,
  Smartphone,
  Zap,
  Eye,
  Clock,
  Link,
  Layers,
  Activity,
  Radio,
  Share2,
  BarChart2,
  CreditCard,
  BrainCircuit,
  TrendingUp,
  DollarSign
};

export default function SmartShell() {
  const { user, profile, loading } = useUser();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && !window.location.pathname.includes('/auth')) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [window.location.pathname]);

  const handleLogout = async () => {
    await firebaseService.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="h-screen bg-dark-bg flex items-center justify-center text-[#86868B] animate-pulse">
        Initializing Workspace...
      </div>
    );
  }

  const mobileNavItems = NAV_ITEMS.slice(0, 3); // Just show first 3 for quick access

  return (
    <div className="flex h-screen bg-dark-bg font-sans selection:bg-glow-blue text-[#A1A1A6] overflow-x-hidden flex-col md:flex-row relative">
      {/* Ambient background blur (Glass Effect on Background Only) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0A84FF]/10 blur-[150px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#BF5AF2]/10 blur-[150px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl md:hidden overflow-y-auto pt-20 pb-10 px-6"
          >
            <div className="grid grid-cols-2 gap-4">
              {NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon];
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => cn(
                      "flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all duration-300",
                      isActive 
                        ? "bg-white/10 border-white/20 text-[#F5F5F7] shadow-lg" 
                        : "bg-white/5 border-white/5 text-[#86868B]"
                    )}
                  >
                    <Icon className={cn("w-6 h-6", item.path === window.location.pathname ? "text-glow-blue" : "")} />
                    <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                  </NavLink>
                );
              })}
              
              <NavLink 
                to="/hub-upgrade"
                onClick={() => setIsMobileMenuOpen(false)}
                className="col-span-2 flex items-center justify-center gap-3 p-6 rounded-3xl bg-gradient-to-r from-glow-blue/20 to-glow-purple/20 border border-white/10 text-white"
              >
                <Zap className="w-5 h-5 text-glow-blue" />
                <span className="text-sm font-bold uppercase tracking-[0.2em]">Upgrade Intelligence</span>
              </NavLink>

              <button 
                onClick={handleLogout}
                className="col-span-2 flex items-center justify-center gap-3 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-[0.2em]">Deauthorize Link</span>
              </button>
            </div>
            
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-10 w-full py-4 rounded-full bg-white/5 text-[#86868B] font-bold text-xs uppercase tracking-widest border border-white/5"
            >
              Close Navigation
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Header (Shown only on small screens) */}
      <header className="md:hidden h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#151515]/80 backdrop-blur-3xl z-50 overflow-x-hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-b from-[#2C2C2E] to-[#1C1C1E] border border-white/10 shadow-sm">
             <Layers className="text-[#F5F5F7] w-4 h-4" />
          </div>
          <span className="font-semibold tracking-tight text-sm text-[#F5F5F7]">Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-white/5 rounded-lg border border-white/10"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          {user?.photoURL ? (
            <img src={user.photoURL} alt="N" className="w-8 h-8 rounded-full border border-white/10" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10" />
          )}
        </div>
      </header>


      {/* Sidebar (Tablet & Desktop) */}
      <aside className="hidden md:flex w-20 lg:w-64 border-r border-white/5 flex-col bg-[#151515]/50 backdrop-blur-3xl z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-b from-[#2C2C2E] to-[#1C1C1E] border border-white/10 shadow-sm">
            <Layers className="text-[#F5F5F7] w-4 h-4" />
          </div>
          <span className="hidden lg:block font-semibold text-lg tracking-tight text-[#F5F5F7]">Hub<span className="text-[#86868B] ml-0.5">IRL</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative truncate",
                  isActive ? "bg-white/10 text-[#F5F5F7] shadow-sm font-medium" : "text-[#86868B] hover:bg-white/5 hover:text-[#F5F5F7]"
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-glow-blue" : "text-[#86868B] group-hover:text-[#F5F5F7]")} />
                    <span className="hidden lg:block text-sm">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          {user?.email === 'hotelcrowncastle992@gmail.com' && (
            <NavLink to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-yellow-500 hover:bg-yellow-500/10 transition-colors group mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden lg:block text-sm font-medium">Admin Dashboard</span>
            </NavLink>
          )}

          <NavLink to="/hub-upgrade" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#86868B] hover:bg-white/5 hover:text-glow-purple transition-colors group">
            <CreditCard className="w-4 h-4 transition-colors group-hover:text-glow-purple" />
            <span className="hidden lg:block text-sm font-medium">Billing & Plan</span>
          </NavLink>
          
          {profile?.tier === 'free' && (
            <NavLink to="/hub-upgrade" className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-gradient-to-r from-glow-blue/20 to-glow-purple/20 border border-glow-blue/30 text-white hover:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all group mb-4 mt-2">
              <Zap className="w-4 h-4 text-glow-blue animate-pulse" />
              <span className="hidden lg:block text-xs font-bold uppercase tracking-widest text-glow-blue">Get Premium</span>
            </NavLink>
          )}

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#86868B] hover:bg-white/5 hover:text-red-500 transition-colors group"
          >
            <LogOut className="w-4 h-4 transition-colors group-hover:text-red-500" />
            <span className="hidden lg:block text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Main */}
      <main className="flex-1 relative overflow-hidden flex flex-col pb-20 md:pb-0 overflow-x-hidden">
        {/* Top Header (Desktop only) */}
        <header className="hidden md:flex h-16 border-b border-white/5 items-center justify-between px-8 bg-[#151515]/30 backdrop-blur-xl z-40 overflow-x-hidden">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Circle className="w-2.5 h-2.5 fill-green-500 text-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span className="text-xs font-semibold text-[#86868B]">System Operational</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end text-right">
              <div className="flex items-center gap-2">
                {profile?.tier && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium ",
                    profile.tier === 'pro' ? "bg-glow-purple/10 text-indigo-700 border border-glow-purple/30" :
                    profile.tier === 'premium' ? "bg-glow-blue/10 text-blue-700 border border-glow-blue/30" :
                    "bg-white/10 text-[#A1A1A6] border border-white/10"
                  )}>
                    {profile.tier} Plan
                  </span>
                )}
                <span className="text-sm font-semibold text-white">{user?.displayName || 'User Workspace'}</span>
              </div>
            </div>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="User" className="w-9 h-9 rounded-full border border-white/10 " referrerPolicy="no-referrer" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/10  flex items-center justify-center">
                <span className="text-xs font-medium text-[#86868B]">{user?.displayName?.charAt(0) || 'U'}</span>
              </div>
            )}
          </div>
        </header>

        {/* Viewport */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 relative scrollbar-hide overflow-x-hidden">
          <div className="max-w-6xl mx-auto h-full relative z-10 overflow-x-hidden">
             <ErrorBoundary>
               <Outlet />
             </ErrorBoundary>
          </div>
        </section>

        <AICoach />

        {/* Mobile Bottom Navigation - Simplified */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-[#151515]/80 backdrop-blur-3xl border-t border-white/5 flex justify-around items-center px-4 z-50">
          {mobileNavItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex flex-col items-center gap-1 transition-all px-4 py-2 rounded-xl",
                  isActive ? "text-glow-blue bg-white/5" : "text-[#86868B]"
                )}
              >
                <Icon className={cn("w-5 h-5")} />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label.split(' ')[0]}</span>
              </NavLink>
            );
          })}
          
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 text-[#86868B] px-4 py-2 rounded-xl"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Menu</span>
          </button>
        </nav>
      </main>
    </div>
  );
}
