import React, { useState } from 'react';
import { Archive, Search, CheckCircle, RefreshCw, Printer } from 'lucide-react';

export default function ItemHistoryArchive({ itemHistory, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = itemHistory.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.item_name.toLowerCase().includes(q) ||
      item.client_name.toLowerCase().includes(q) ||
      item.host_worker.toLowerCase().includes(q) ||
      item.history_id.toLowerCase().includes(q)
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="item-history-archive-view" className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 dark:bg-slate-800 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Item Repository Archive
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Chain of Custody Archive</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 uppercase tracking-wide">Automated Item History & Departure Records</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="p-1.5 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded text-xs font-semibold flex items-center gap-1 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col transition-colors">
        {/* Search Header */}
        <div className="bg-[#FAFBFD] dark:bg-slate-800/80 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Archive className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span>Permanent Custody Logs Archive</span>
            <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
              {itemHistory.length} ARCHIVED
            </span>
          </span>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search history archive..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded outline-none w-full sm:w-60 bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table id="item-history-archive-table" className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFD] dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-2">History ID</th>
                <th className="px-3 py-2">Item Logged</th>
                <th className="px-3 py-2">Client Owner</th>
                <th className="px-3 py-2">Visiting Host Worker</th>
                <th className="px-3 py-2">Check-In</th>
                <th className="px-3 py-2">Check-Out</th>
                <th className="px-3 py-2 text-center">Custody Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-3 py-8 text-center text-slate-400 dark:text-slate-500 italic">
                    No item records match query in archive repository.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr key={item.history_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-3 py-2 font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px] whitespace-nowrap">
                      {item.history_id}
                    </td>

                    <td className="px-3 py-2 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {item.item_name}
                    </td>

                    <td className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-200">
                      {item.client_name}
                    </td>

                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                      {item.host_worker}
                    </td>

                    <td className="px-3 py-2 font-mono text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                      {item.check_in_time}
                    </td>

                    <td className="px-3 py-2 font-mono text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                      {item.check_out_time || 'N/A'}
                    </td>

                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      <span className="bg-[#F1F5F9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 font-bold text-[10px] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 uppercase inline-flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        {item.status || 'RETURNED'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
