import React, { useState } from 'react';
import { UserPlus, Shield, Briefcase, Trash2, Users, Search, Building2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminDashboard({ workers, onAddWorker, onDeleteWorker, clientLogs, onDeleteClientLog, stats }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Office Worker');
  const [department, setDepartment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onAddWorker({
        name: name.trim(),
        role,
        department: department.trim() || (role === 'Security' ? 'Security Gate' : 'General Office')
      });
      setMessage({ type: 'success', text: `Successfully registered ${name} as ${role}.` });
      setName('');
      setDepartment('');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to add worker' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const filteredWorkers = workers.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="admin-dashboard-view" className="space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 dark:bg-slate-800 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Admin Console
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Access Level: Full Admin</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 uppercase tracking-wide">Personnel Roster & Access Rights Management</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded text-right">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block tracking-wider">Staff Count</span>
            <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-slate-100">{workers.length} Registered</span>
          </div>
        </div>
      </div>

      {message && (
        <div
          id="admin-alert-banner"
          className={`p-3 rounded border text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Register Employee Form */}
        <div id="register-worker-card" className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xs h-fit overflow-hidden transition-colors">
          <div className="bg-[#FAFBFD] dark:bg-slate-800/80 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>Register Employee</span>
            </span>
            <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800">
              ROLE-ASSIGN
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-3.5 space-y-3">
            <div>
              <label htmlFor="worker-name-input" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                id="worker-name-input"
                type="text"
                placeholder="e.g. Jane Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label htmlFor="worker-role-select" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Assigned Role *
              </label>
              <select
                id="worker-role-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
              >
                <option value="Office Worker">Office Worker (Host Visitor)</option>
                <option value="Admin Office">Admin Office (Host Visitor)</option>
                <option value="Security">Security Guard (Gate Control)</option>
              </select>
            </div>

            <div>
              <label htmlFor="worker-dept-input" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Department / Station
              </label>
              <input
                id="worker-dept-input"
                type="text"
                placeholder={role === 'Security' ? 'Gate 1 / Desk Alpha' : 'Software Engineering'}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              id="submit-register-worker-btn"
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-2 px-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded uppercase tracking-wider transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span>{loading ? 'Adding...' : 'Save Employee Profile'}</span>
            </button>
          </form>
        </div>

        {/* Staff Roster Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col transition-colors">
          <div className="bg-[#FAFBFD] dark:bg-slate-800/80 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>Active Employee Roster</span>
              <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                {workers.length} TOTAL
              </span>
            </span>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search roster..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded outline-none w-full sm:w-48 bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table id="workers-roster-table" className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBFD] dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Full Name</th>
                  <th className="px-3 py-2">System Role</th>
                  <th className="px-3 py-2">Department / Station</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
                {filteredWorkers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-3 py-8 text-center text-slate-400 dark:text-slate-500 italic">
                      No personnel matching query.
                    </td>
                  </tr>
                ) : (
                  filteredWorkers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-3 py-2 font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px] whitespace-nowrap">
                        {worker.id}
                      </td>

                      <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">
                        {worker.name}
                      </td>

                      <td className="px-3 py-2 whitespace-nowrap">
                        {worker.role === 'Security' ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.2 rounded uppercase">
                            <Shield className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            Security
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.2 rounded uppercase">
                            <Briefcase className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            Office Worker
                          </span>
                        )}
                      </td>

                      <td className="px-3 py-2 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{worker.department}</span>
                      </td>

                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        <button
                          onClick={() => onDeleteWorker(worker.id)}
                          title="Remove employee profile"
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Master Security Audit Log */}
      <div id="admin-master-security-logs" className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden transition-colors">
        <div className="bg-[#FAFBFD] dark:bg-slate-800/80 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Master Security & Gate Activity Trail
          </span>
          <span className="font-mono text-[10px] bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800 font-bold">
            {clientLogs.length} LOG RECORDS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFBFD] dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="px-3 py-2">Log ID</th>
                <th className="px-3 py-2">Visitor</th>
                <th className="px-3 py-2">Visiting Host</th>
                <th className="px-3 py-2">Purpose</th>
                <th className="px-3 py-2">Items Tracked</th>
                <th className="px-3 py-2">Check-In</th>
                <th className="px-3 py-2">Gate Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
              {clientLogs.slice(0, 12).map((log) => (
                <tr key={log.log_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-3 py-2 font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px] whitespace-nowrap">
                    {log.log_id}
                  </td>
                  <td className="px-3 py-2">
                    <strong className="text-slate-900 dark:text-slate-100 block">{log.client_name}</strong>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">{log.contact}</span>
                  </td>
                  <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-300">{log.host_worker}</td>
                  <td className="px-3 py-2">{log.purpose}</td>
                  <td className="px-3 py-2">
                    {log.items && log.items.length > 0 ? (
                      <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                        {log.items.length} item(s)
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">None</span>
                    )}
                  </td>
                  <td className="px-3 py-2 font-mono text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">{log.check_in_time}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {log.status === 'INSIDE' ? (
                      <span className="bg-[#DCFCE7] dark:bg-emerald-950/80 text-[#166534] dark:text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded uppercase border border-emerald-200 dark:border-emerald-800">
                        Inside
                      </span>
                    ) : (
                      <span className="bg-[#F1F5F9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 font-bold text-[10px] px-2 py-0.5 rounded uppercase border border-slate-200 dark:border-slate-700">
                        Checked Out
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {onDeleteClientLog && (
                      <button
                        onClick={() => onDeleteClientLog(log.log_id)}
                        title="Delete log record"
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
