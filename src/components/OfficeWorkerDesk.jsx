import React, { useState } from 'react';
import { Briefcase, Users, PackageCheck, UserCheck, Clock, LogOut } from 'lucide-react';

export default function OfficeWorkerDesk({ workers, allClientLogs }) {
  const officeWorkers = workers.filter((w) => w.role === 'Office Worker' || w.role === 'Admin Office');
  const [selectedWorkerName, setSelectedWorkerName] = useState(
    officeWorkers.length > 0 ? officeWorkers[0].name : ''
  );

  const currentWorker = workers.find((w) => w.name === selectedWorkerName);

  // Filter client logs where host_worker matches selected office worker
  const hostLogs = allClientLogs.filter(
    (log) => log.host_worker && log.host_worker.toLowerCase() === selectedWorkerName.toLowerCase()
  );

  const activeVisitors = hostLogs.filter((log) => log.status === 'INSIDE');
  const pastVisitors = hostLogs.filter((log) => log.status === 'CHECKED_OUT');

  // Total active custody items for this worker
  const activeItemsCount = activeVisitors.reduce((acc, log) => acc + (log.items ? log.items.length : 0), 0);

  return (
    <div id="office-worker-desk-view" className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 dark:bg-slate-800 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Host Desk View
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Employee Visitor Terminal</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 uppercase tracking-wide">Office Host Station & Guest Monitoring</h2>
        </div>

        {/* Worker Selector */}
        <div className="w-full sm:w-64">
          <label htmlFor="worker-profile-select" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Active Office Worker Profile
          </label>
          <select
            id="worker-profile-select"
            value={selectedWorkerName}
            onChange={(e) => setSelectedWorkerName(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white font-bold text-slate-900"
          >
            {officeWorkers.length === 0 ? (
              <option value="">No Office Workers Registered</option>
            ) : (
              officeWorkers.map((w) => (
                <option key={w.id} value={w.name}>
                  {w.name} ({w.department})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {currentWorker && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Guests On-Site</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100">{activeVisitors.length}</span>
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded uppercase">
                  Inside
                </span>
              </div>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gate Custody Items</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100">{activeItemsCount}</span>
                <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-1.5 py-0.2 rounded uppercase">
                  Held
                </span>
              </div>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between transition-colors">
            <div>
              <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Past Visits</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-slate-100">{pastVisitors.length}</span>
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.2 rounded uppercase">
                  Departed
                </span>
              </div>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Active Visitors for Host */}
      <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col transition-colors">
        <div className="bg-[#FAFBFD] dark:bg-slate-800/80 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <span>Guests Currently Visiting {selectedWorkerName || 'Host'}</span>
          </span>
          <span className="font-mono text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800 font-bold">
            {activeVisitors.length} INSIDE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFD] dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-2">Log ID</th>
                <th className="px-3 py-2">Visitor Name</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Purpose of Visit</th>
                <th className="px-3 py-2">Items in Custody</th>
                <th className="px-3 py-2">Arrival Time</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Gate Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
              {activeVisitors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-3 py-8 text-center text-slate-400 dark:text-slate-500 italic">
                    No active clients currently checked in to visit {selectedWorkerName || 'this worker'}.
                  </td>
                </tr>
              ) : (
                activeVisitors.map((visit) => (
                  <tr key={visit.log_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-3 py-2 font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px] whitespace-nowrap">{visit.log_id}</td>
                    <td className="px-3 py-2 font-bold text-slate-900 dark:text-slate-100">{visit.client_name}</td>
                    <td className="px-3 py-2 font-mono text-slate-500 dark:text-slate-400 text-[11px]">{visit.contact}</td>
                    <td className="px-3 py-2">{visit.purpose}</td>
                    <td className="px-3 py-2">
                      {visit.items && visit.items.length > 0 ? (
                        <div className="space-y-0.5">
                          {visit.items.map((item, idx) => (
                            <span key={idx} className="block font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">None</span>
                      )}
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">{visit.check_in_time}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="bg-[#DCFCE7] dark:bg-emerald-950/80 text-[#166534] dark:text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded uppercase border border-emerald-200 dark:border-emerald-800">
                        Inside
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                        Security Check-Out
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Past Visitors History for Host */}
      <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="bg-[#FAFBFD] dark:bg-slate-800/80 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Past Departed Visits History — {selectedWorkerName}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFD] dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-2">Log ID</th>
                <th className="px-3 py-2">Visitor Name</th>
                <th className="px-3 py-2">Purpose</th>
                <th className="px-3 py-2">Check-In</th>
                <th className="px-3 py-2">Check-Out</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
              {pastVisitors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-3 py-6 text-center text-slate-400 dark:text-slate-500 italic">
                    No past departed visits logged for this host yet.
                  </td>
                </tr>
              ) : (
                pastVisitors.map((visit) => (
                  <tr key={visit.log_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-3 py-2 font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px]">{visit.log_id}</td>
                    <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">{visit.client_name}</td>
                    <td className="px-3 py-2">{visit.purpose}</td>
                    <td className="px-3 py-2 font-mono text-slate-500 dark:text-slate-400 text-[11px]">{visit.check_in_time}</td>
                    <td className="px-3 py-2 font-mono text-slate-500 dark:text-slate-400 text-[11px]">{visit.check_out_time}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="bg-[#F1F5F9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 font-bold text-[10px] px-2 py-0.5 rounded uppercase border border-slate-200 dark:border-slate-700">
                        Checked Out
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
