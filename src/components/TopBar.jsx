import React from 'react';
import { RefreshCw, Shield, Radio, UserCheck, Sun, Moon } from 'lucide-react';

export default function TopBar({ activeTab, stats, onResetData, darkMode, toggleDarkMode }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'admin':
        return 'System Administration / Staff Roster & Role Access';
      case 'security':
        return 'Gate Alpha Control / Active Visitor & Asset Custody';
      case 'archive':
        return 'Permanent Repository / Item History Archive Log';
      case 'office':
        return 'Host Terminal / Office Worker Visitor Desk';
      case 'client':
        return 'Public Verification / Self-Service Visitor Status';
      default:
        return 'Security Terminal / Entrance Control';
    }
  };

  return (
    <header id="top-bar" className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 font-sans z-10 transition-colors">
      <div className="flex items-center gap-3">
        <h2 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>Security Terminal</span>
          <span className="text-slate-400 dark:text-slate-600 font-normal">/</span>
          <span className="text-slate-500 dark:text-slate-400 font-mono text-xs">{getTabTitle()}</span>
        </h2>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="hidden sm:flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
          <span>Live Environment</span>
        </div>

        <button
          id="theme-toggle-btn"
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 font-medium transition cursor-pointer"
        >
          {darkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        <div className="hidden lg:block text-right border-l border-slate-200 dark:border-slate-800 pl-3">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight uppercase">SGT. M. REYES</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Head Gate Guard</div>
        </div>

        <button
          id="reset-demo-data-btn"
          onClick={onResetData}
          title="Reset Seed Data"
          className="flex items-center gap-1.5 text-xs bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-700 font-medium transition shadow-2xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Reset Seed Data</span>
        </button>
      </div>
    </header>
  );
}
