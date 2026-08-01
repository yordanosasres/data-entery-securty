import React from 'react';
import { ShieldCheck, UserCog, ShieldAlert, Archive, Briefcase, UserCheck, RefreshCw, Cpu, Activity, Sun, Moon } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, stats, onResetData, darkMode, toggleDarkMode }) {
  const navItems = [
    { id: 'admin', label: 'Admin Dashboard', icon: UserCog, badge: `${stats?.totalWorkers || 0}` },
    { id: 'security', label: 'Security Desk', icon: ShieldAlert, badge: `${stats?.headcountInside || 0}` },
    { id: 'archive', label: 'Item History Archive', icon: Archive, badge: `${stats?.returnedItemsArchived || 0}` },
    { id: 'office', label: 'Office Worker Desk', icon: Briefcase, badge: `${stats?.officeWorkersCount || 0}` },
    { id: 'client', label: 'Client Access View', icon: UserCheck, badge: 'Live' },
  ];

  return (
    <aside id="sidebar-navigation" className="w-full md:w-60 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800 font-sans">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-xs tracking-wider uppercase text-emerald-400 font-mono">
              Sentinel Core v4.2
            </div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">
              Entrance & Asset Mgmt
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav id="sidebar-nav-items" className="flex-1 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs font-medium transition-all border-l-3 ${
                isActive
                  ? 'bg-slate-800/80 border-emerald-500 text-white font-semibold shadow-2xs'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Telemetry */}
      <div className="p-4 border-t border-slate-800/90 bg-slate-950/40 space-y-2 text-[11px] font-mono">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Telemetry</span>
          </div>
          {toggleDarkMode && (
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-indigo-400" />}
              <span>{darkMode ? 'Dark' : 'Light'}</span>
            </button>
          )}
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Active Visitors</span>
          <span className="font-bold text-emerald-400">{stats?.headcountInside || 0}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">Items Custody</span>
          <span className="font-bold text-indigo-300">{stats?.activeItemsInCustody || 0}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="text-slate-400">System Uptime</span>
          <span className="font-bold text-slate-300">99.9%</span>
        </div>
      </div>
    </aside>
  );
}
