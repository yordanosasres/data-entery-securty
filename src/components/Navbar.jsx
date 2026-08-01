import React from 'react';
import { ShieldCheck, UserCog, ShieldAlert, Archive, Briefcase, UserCheck, RefreshCw } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, stats, onResetData }) {
  const navItems = [
    { id: 'admin', label: 'Admin Dashboard', icon: UserCog, badge: `${stats?.totalWorkers || 0} Staff` },
    { id: 'security', label: 'Security Desk', icon: ShieldAlert, badge: `${stats?.headcountInside || 0} Inside` },
    { id: 'archive', label: 'Item History Archive', icon: Archive, badge: `${stats?.returnedItemsArchived || 0} Logs` },
    { id: 'office', label: 'Office Worker Desk', icon: Briefcase, badge: `${stats?.officeWorkersCount || 0} Hosts` },
    { id: 'client', label: 'Client View', icon: UserCheck, badge: 'Lookup' },
  ];

  return (
    <header id="main-header" className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg flex items-center justify-center text-white shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                SentinelTrack
                <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-sm bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Enterprise
                </span>
              </h1>
              <p className="text-xs text-slate-400">Security Entrance & Asset Tracking System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-slate-800/90 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Facility Gate Active</span>
              <span className="text-slate-500">|</span>
              <span className="font-mono text-emerald-300 font-medium">{stats?.headcountInside || 0} Clients On-Site</span>
            </div>

            <button
              id="reset-demo-data-btn"
              onClick={onResetData}
              title="Reset Demo Data"
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Seed Data</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <nav id="navigation-tabs" className="flex overflow-x-auto no-scrollbar gap-1 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
