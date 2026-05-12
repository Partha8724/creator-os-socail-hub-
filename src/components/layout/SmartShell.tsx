import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Youtube,
  Smartphone,
  Zap,
  LogOut,
  Menu,
  Layers
} from 'lucide-react';

export default function SmartShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      path: '/youtube',
      label: 'YouTube',
      icon: Youtube
    },
    {
      path: '/vertical',
      label: 'Vertical',
      icon: Smartphone
    },
    {
      path: '/hub-upgrade',
      label: 'Upgrade',
      icon: Zap
    }
  ];

  return (
    <div className="flex h-screen bg-black text-white">
      
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#111] border-r border-white/10 flex-col">
        
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <Layers className="w-6 h-6 text-cyan-400" />
          <span className="font-bold text-xl">Smart Hub</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-gray-400 hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile Header */}
        <header className="md:hidden h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#111]">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span className="font-bold">Smart Hub</span>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#111] border-b border-white/10 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}

        {/* Page Content */}
        <section className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </section>

      </main>
    </div>
  );
}
