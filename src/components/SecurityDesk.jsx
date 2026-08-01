import React, { useState } from 'react';
import { UserCheck, LogOut, Search, Plus, AlertCircle, CheckCircle2, Shield, Trash2 } from 'lucide-react';

export default function SecurityDesk({ workers, activeClients, onRegisterEntry, onCheckoutClient, onDeleteClientLog }) {
  // Form State
  const [clientName, setClientName] = useState('');
  const [contact, setContact] = useState('');
  const [hostWorker, setHostWorker] = useState('');
  const [purpose, setPurpose] = useState('');
  const [itemInput, setItemInput] = useState('');
  const [itemsList, setItemsList] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Filter strictly for Office Worker and Admin Office roles (exclude Security)
  const hostWorkers = workers.filter((w) => w.role === 'Office Worker' || w.role === 'Admin Office');
  const [customHost, setCustomHost] = useState(false);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemInput.trim()) return;
    setItemsList([...itemsList, itemInput.trim()]);
    setItemInput('');
  };

  const handleRemoveItem = (index) => {
    setItemsList(itemsList.filter((_, i) => i !== index));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !hostWorker) {
      setFeedback({ type: 'error', text: 'Client Name and Visiting Host are required.' });
      return;
    }

    setLoading(true);
    try {
      let finalItems = [...itemsList];
      if (itemInput.trim()) {
        finalItems.push(itemInput.trim());
      }

      await onRegisterEntry({
        client_name: clientName.trim(),
        contact: contact.trim() || '+1 555-0100',
        host_worker: hostWorker,
        purpose: purpose.trim() || 'Official Meeting',
        items: finalItems
      });

      setFeedback({
        type: 'success',
        text: `Client ${clientName} registered. ${finalItems.length} custody item(s) logged.`
      });

      // Clear Form
      setClientName('');
      setContact('');
      setHostWorker('');
      setPurpose('');
      setItemInput('');
      setItemsList([]);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to check in client' });
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const [confirmModal, setConfirmModal] = useState(null);

  const handleCheckoutClick = (logId, clientName, count) => {
    setConfirmModal({ logId, clientName, count });
  };

  const handleConfirmCheckout = async () => {
    if (!confirmModal) return;
    const { logId, clientName, count } = confirmModal;
    setConfirmModal(null);

    try {
      await onCheckoutClient(logId);
      setFeedback({
        type: 'success',
        text: `Client ${clientName} checked out successfully. ${count} item(s) transferred to archive as RETURNED.`
      });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Failed to checkout client' });
    } finally {
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filteredClients = activeClients.filter((c) =>
    c.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.host_worker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.log_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.items && c.items.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div id="security-desk-view" className="space-y-4">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-slate-900 dark:bg-slate-800 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Security Terminal
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Terminal ID: GATE-ALPHA-01</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 uppercase tracking-wide">Client Entry & Asset Custody Desk</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded text-right">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block tracking-wider">On-Site Headcount</span>
            <span className="text-sm font-extrabold font-mono text-emerald-900 dark:text-emerald-200">{activeClients.length} Inside</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div
          id="security-feedback-banner"
          className={`p-3 rounded border text-xs flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="font-semibold">{feedback.text}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Client Entry Registration Card */}
        <div id="register-client-card" className="lg:col-span-5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xs h-fit overflow-hidden transition-colors">
          <div className="bg-[#FAFBFD] dark:bg-slate-800/80 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>Client Registration</span>
            </span>
            <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-800">
              LOG-NEW
            </span>
          </div>

          <form onSubmit={handleRegisterSubmit} className="p-3.5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label htmlFor="client-name-input" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Visitor Full Name *
                </label>
                <input
                  id="client-name-input"
                  type="text"
                  placeholder="e.g. Robert Fox"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label htmlFor="client-contact-input" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Contact Number
                </label>
                <input
                  id="client-contact-input"
                  type="text"
                  placeholder="+1 555-0199"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="host-select" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Visiting Host (Office Worker / Admin Office) *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCustomHost(!customHost);
                    setHostWorker('');
                  }}
                  className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  {customHost ? '← Select from list' : '+ Type name directly'}
                </button>
              </div>

              {!customHost ? (
                <select
                  id="host-select"
                  value={hostWorker}
                  onChange={(e) => setHostWorker(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium"
                >
                  <option value="">-- Select Visiting Host (Office Worker / Admin Office) --</option>
                  {hostWorkers.map((w) => (
                    <option key={w.id} value={w.name}>
                      {w.name} ({w.role} - {w.department})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Enter Office Worker or Admin Office host name..."
                  value={hostWorker}
                  onChange={(e) => setHostWorker(e.target.value)}
                  required
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded focus:ring-1 focus:ring-blue-500 outline-none font-medium bg-white dark:bg-slate-800"
                />
              )}
            </div>

            <div>
              <label htmlFor="purpose-input" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Purpose of Visit
              </label>
              <input
                id="purpose-input"
                type="text"
                placeholder="Maintenance / Delivery / Interview"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Tracked Personal Items */}
            <div className="p-2.5 bg-[#FAFBFD] dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700">
              <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Tracked Personal Items</span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">No company info</span>
              </label>

              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  placeholder="Dell XPS Laptop (SN-9821)"
                  value={itemInput}
                  onChange={(e) => setItemInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddItem(e);
                    }
                  }}
                  className="flex-1 px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded outline-none bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded flex items-center gap-1 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>

              {itemsList.length > 0 ? (
                <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-200 dark:border-slate-700">
                  {itemsList.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 text-[11px] bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded font-mono font-bold"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-blue-400 dark:text-blue-300 hover:text-rose-600 dark:hover:text-rose-400 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 italic block">No items attached yet.</span>
              )}
            </div>

            <button
              id="submit-register-client-btn"
              type="submit"
              disabled={loading || !clientName.trim() || !hostWorker}
              className="w-full py-2 px-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded uppercase tracking-wider transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span>{loading ? 'Processing...' : 'Authorize Entry & Register Items'}</span>
            </button>
          </form>
        </div>

        {/* Active Visitor Manifest (Inside Facility) Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col overflow-hidden transition-colors">
          <div className="bg-[#FAFBFD] dark:bg-slate-800/80 px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>Active Visitor Manifest (Inside)</span>
              <span className="font-mono text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                {activeClients.length} ACTIVE
              </span>
            </span>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search active manifest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded outline-none w-full sm:w-48 bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table id="active-visitors-table" className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAFBFD] dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Client Name</th>
                  <th className="px-3 py-2">Visiting Host</th>
                  <th className="px-3 py-2">Tracked Items</th>
                  <th className="px-3 py-2">Check-In</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs text-slate-800 dark:text-slate-200">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-3 py-8 text-center text-slate-400 dark:text-slate-500 italic">
                      No visitors currently inside matching manifest search.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.log_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-3 py-2 font-mono font-bold text-blue-600 dark:text-blue-400 text-[11px] whitespace-nowrap">
                        {client.log_id}
                      </td>

                      <td className="px-3 py-2">
                        <strong className="text-slate-900 dark:text-slate-100 block">{client.client_name}</strong>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 block">{client.contact}</span>
                      </td>

                      <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-300">
                        {client.host_worker}
                      </td>

                      <td className="px-3 py-2">
                        {client.items && client.items.length > 0 ? (
                          <div className="space-y-0.5">
                            {client.items.map((item, idx) => (
                              <span
                                key={idx}
                                className="block font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">None</span>
                        )}
                      </td>

                      <td className="px-3 py-2 font-mono text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {client.check_in_time}
                      </td>

                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="bg-[#DCFCE7] dark:bg-emerald-950/80 text-[#166534] dark:text-emerald-300 font-bold text-[10px] px-2 py-0.5 rounded uppercase border border-emerald-200 dark:border-emerald-800">
                          Inside
                        </span>
                      </td>

                      <td className="px-3 py-2 text-right whitespace-nowrap space-x-1.5">
                        <button
                          id={`checkout-btn-${client.log_id}`}
                          onClick={() => handleCheckoutClick(client.log_id, client.client_name, client.items?.length || 0)}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] uppercase rounded transition inline-flex items-center gap-1 shadow-2xs"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Check-Out</span>
                        </button>

                        {onDeleteClientLog && (
                          <button
                            id={`delete-btn-${client.log_id}`}
                            onClick={() => onDeleteClientLog(client.log_id)}
                            title="Delete log entry"
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition inline-flex items-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-full">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Confirm Client Departure
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Log ID: {confirmModal.logId}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Are you sure you want to process check-out for <strong className="text-slate-900 dark:text-slate-100">{confirmModal.clientName}</strong>?
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold block mb-1 uppercase text-[10px] text-slate-500 dark:text-slate-400">
                Custody Item Transfer:
              </span>
              <span>
                {confirmModal.count > 0
                  ? `${confirmModal.count} item(s) will be returned to client and moved to Permanent History Archive.`
                  : 'No custody items registered for this visit.'}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmCheckout}
                className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded transition uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Confirm Check-Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
