import React, { useState } from 'react';
import { Search, User, ShieldCheck, Phone, Package, CheckCircle2, XCircle, ArrowRight, LogOut } from 'lucide-react';

export default function ClientView({ allClientLogs = [], onCheckoutClient }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [checkingOutId, setCheckingOutId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleSelfCheckout = async (logId, clientName) => {
    if (!onCheckoutClient) return;
    setCheckingOutId(logId);
    try {
      await onCheckoutClient(logId);
      setFeedback({ type: 'success', text: `Pass ${logId} for ${clientName} checked out successfully!` });
      // Update local view
      if (searchResult) {
        setSearchResult(
          searchResult.map((v) =>
            v.log_id === logId
              ? { ...v, status: 'CHECKED_OUT', check_out_time: new Date().toLocaleTimeString() }
              : v
          )
        );
      }
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to check out' });
    } finally {
      setCheckingOutId(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filterLogsLocally = (logs, queryStr) => {
    const q = queryStr.toLowerCase().trim();
    if (!q) return [];
    const cleanQ = q.replace(/[^a-z0-9]/g, '');

    return (logs || []).filter((log) => {
      if (!log) return false;
      const name = String(log.client_name || '').toLowerCase();
      const contact = String(log.contact || '').toLowerCase();
      const logId = String(log.log_id || '').toLowerCase();
      const host = String(log.host_worker || '').toLowerCase();
      const purpose = String(log.purpose || '').toLowerCase();
      const items = Array.isArray(log.items)
        ? log.items.map((i) => String(i)).join(' ').toLowerCase()
        : String(log.items || '').toLowerCase();

      const cleanContact = contact.replace(/[^a-z0-9]/g, '');
      const cleanLogId = logId.replace(/[^a-z0-9]/g, '');

      return (
        name.includes(q) ||
        contact.includes(q) ||
        logId.includes(q) ||
        host.includes(q) ||
        purpose.includes(q) ||
        items.includes(q) ||
        (cleanQ.length > 0 && (cleanContact.includes(cleanQ) || cleanLogId.includes(cleanQ)))
      );
    });
  };

  const handleSearch = async (e, customQuery) => {
    if (e) e.preventDefault();
    const q = (customQuery !== undefined ? customQuery : searchQuery).trim();
    if (!q) {
      setSearched(false);
      setSearchResult(null);
      return;
    }

    setSearching(true);
    let matches = filterLogsLocally(allClientLogs, q);

    // If no local matches, fallback to live server query
    if (matches.length === 0) {
      try {
        const res = await fetch(`/api/security/clients?query=${encodeURIComponent(q)}`);
        if (res.ok) {
          const apiMatches = await res.json();
          if (Array.isArray(apiMatches)) {
            matches = apiMatches;
          }
        }
      } catch (err) {
        console.error('Error querying backend for pass lookup:', err);
      }
    }

    setSearchResult(matches);
    setSearched(true);
    setSearching(false);
  };

  return (
    <div id="client-view-portal" className="max-w-4xl mx-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-800 shadow-2xs text-center space-y-2 transition-colors">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-900 dark:bg-slate-800 text-emerald-400 rounded font-mono text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Visitor Self-Service Verification Portal</span>
        </div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">Check-In Status & Custody Items Verification</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Arriving or departing guests can lookup their active entry pass and verify personal equipment/items registered in gate custody.
        </p>

        {feedback && (
          <div
            className={`p-2.5 rounded border text-xs flex items-center justify-center max-w-lg mx-auto ${
              feedback.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          </div>
        )}

        {/* Search Form */}
        <form onSubmit={handleSearch} className="pt-2 max-w-lg mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="client-search-input"
              type="text"
              placeholder="Enter Full Name, Phone Number, or Log ID (e.g. Robert Fox)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            id="client-search-btn"
            type="submit"
            disabled={searching}
            className="px-4 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <span>{searching ? 'Verifying...' : 'Verify Pass'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </form>
      </div>

      {/* Quick Select Active Visitor Passes */}
      {!searched && (() => {
        const activeVisitors = (allClientLogs || []).filter((c) => c && c.status === 'INSIDE');
        return (
          <div className="bg-[#FAFBFD] dark:bg-slate-900/80 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 text-center space-y-2 transition-colors max-w-xl mx-auto">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider block">
              Click an active visitor pass below to verify:
            </span>
            {activeVisitors.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-1.5">
                {activeVisitors.slice(0, 8).map((client) => (
                  <button
                    key={client.log_id}
                    onClick={() => {
                      setSearchQuery(client.client_name);
                      handleSearch(null, client.client_name);
                    }}
                    className="text-xs bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-md border border-emerald-200 dark:border-slate-700 transition shadow-2xs flex items-center gap-1.5 font-medium group"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold">{client.client_name}</span>
                    <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded font-semibold uppercase">
                      INSIDE
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                No active visitors currently checked in inside the facility.
              </p>
            )}
          </div>
        );
      })()}



      {/* Results Display */}
      {searched && (
        <div id="client-search-results" className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Lookup Records ({searchResult?.length || 0} Found)
            </span>
            <button
              onClick={() => {
                setSearched(false);
                setSearchQuery('');
                setSearchResult(null);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold"
            >
              Clear Filter
            </button>
          </div>

          {!searchResult || searchResult.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-6 rounded border border-slate-200 dark:border-slate-800 text-center space-y-2 transition-colors">
              <XCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">No Visitor Record Found</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                No active or historical visitor pass found matching "{searchQuery}". Please check in at Gate Alpha Security Station.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResult.map((visitor) => (
                <div
                  key={visitor.log_id}
                  className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 transition-colors"
                >
                  {/* Pass Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                        {visitor.log_id}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Gate Pass</span>
                    </div>

                    {visitor.status === 'INSIDE' ? (
                      <span className="bg-[#DCFCE7] dark:bg-emerald-950/80 text-[#166534] dark:text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded uppercase border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Inside Facility
                      </span>
                    ) : (
                      <span className="bg-[#F1F5F9] dark:bg-slate-800 text-[#475569] dark:text-slate-300 font-bold text-[10px] px-2 py-0.5 rounded uppercase border border-slate-200 dark:border-slate-700">
                        Checked Out
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Visitor Name</span>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">{visitor.client_name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {visitor.contact}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Visiting Host</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{visitor.host_worker}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Purpose</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{visitor.purpose}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Check-In Time</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">{visitor.check_in_time}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Check-Out Time</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">{visitor.check_out_time || 'Pending Exit'}</span>
                      </div>
                    </div>

                    {/* Items Custody */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 bg-[#FAFBFD] dark:bg-slate-800/50 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                          <span>Custody Items Log</span>
                        </span>
                        <span className="font-mono text-slate-500 dark:text-slate-400">
                          {visitor.items ? visitor.items.length : 0} Item(s)
                        </span>
                      </span>

                      {visitor.items && visitor.items.length > 0 ? (
                        <div className="space-y-1">
                          {visitor.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs font-mono bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                            >
                              <span>{item}</span>
                              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-1 py-0.2 rounded uppercase">
                                {visitor.status === 'INSIDE' ? 'Held' : 'Returned'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 italic block">No registered personal items.</span>
                      )}
                    </div>

                    {/* Check-Out Notice */}
                    {visitor.status === 'INSIDE' && (
                      <div className="pt-2 text-center">
                        <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[11px] py-1.5 px-3 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>Check-Out handled exclusively at Security Desk</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
