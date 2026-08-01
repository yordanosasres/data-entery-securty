import React from 'react';
import { Users, PackageCheck, LogOut, Archive } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  return (
    <div id="stats-overview-grid" className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div id="stat-card-inside" className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-3 shadow-2xs flex items-center justify-between transition-colors">
        <div>
          <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Headcount</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100">{stats.headcountInside || 0}</span>
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded uppercase">
              Inside
            </span>
          </div>
        </div>
        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded">
          <Users className="w-5 h-5" />
        </div>
      </div>

      <div id="stat-card-items" className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-3 shadow-2xs flex items-center justify-between transition-colors">
        <div>
          <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Custody Items</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100">{stats.activeItemsInCustody || 0}</span>
            <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-1.5 py-0.2 rounded uppercase">
              Tracked
            </span>
          </div>
        </div>
        <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded">
          <PackageCheck className="w-5 h-5" />
        </div>
      </div>

      <div id="stat-card-checkedout" className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-3 shadow-2xs flex items-center justify-between transition-colors">
        <div>
          <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Departed</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100">{stats.totalCheckedOut || 0}</span>
            <span className="text-[10px] font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 px-1.5 py-0.2 rounded uppercase">
              Departed
            </span>
          </div>
        </div>
        <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded">
          <LogOut className="w-5 h-5" />
        </div>
      </div>

      <div id="stat-card-archive" className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-3 shadow-2xs flex items-center justify-between transition-colors">
        <div>
          <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Archived Items</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100">{stats.returnedItemsArchived || 0}</span>
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.2 rounded uppercase">
              Returned
            </span>
          </div>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
          <Archive className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
