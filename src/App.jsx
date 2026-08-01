import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import StatsCards from './components/StatsCards.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import SecurityDesk from './components/SecurityDesk.jsx';
import ItemHistoryArchive from './components/ItemHistoryArchive.jsx';
import OfficeWorkerDesk from './components/OfficeWorkerDesk.jsx';
import ClientView from './components/ClientView.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('security');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('sentinel_dark_mode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return false;
  });
  const [stats, setStats] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [clientLogs, setClientLogs] = useState([]);
  const [itemHistory, setItemHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sentinel_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const fetchAllData = useCallback(async () => {
    try {
      const [statsRes, workersRes, clientsRes, historyRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/admin/workers'),
        fetch('/api/security/clients'),
        fetch('/api/history/items')
      ]);

      if (!statsRes.ok || !workersRes.ok || !clientsRes.ok || !historyRes.ok) {
        throw new Error('Failed to load data from security server.');
      }

      const statsData = await statsRes.json();
      const workersData = await workersRes.json();
      const clientsData = await clientsRes.json();
      const historyData = await historyRes.json();

      setStats(statsData);
      setWorkers(workersData);
      setClientLogs(clientsData);
      setItemHistory(historyData);
      setError(null);
    } catch (err) {
      console.error('Error fetching security data:', err);
      setError(err.message || 'Server communication error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    // Poll every 10 seconds for real-time gate synchronization across tabs
    const interval = setInterval(fetchAllData, 10000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const handleAddWorker = async (workerData) => {
    const res = await fetch('/api/admin/workers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workerData)
    });
    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || 'Failed to register worker');
    }
    await fetchAllData();
  };

  const handleDeleteWorker = async (id) => {
    if (!window.confirm('Are you sure you want to remove this employee from roster?')) return;
    const res = await fetch(`/api/admin/workers/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const errJson = await res.json();
      alert(errJson.error || 'Failed to remove worker');
      return;
    }
    await fetchAllData();
  };

  const handleRegisterEntry = async (clientData) => {
    const res = await fetch('/api/security/register-entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    });
    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || 'Failed to register client entry');
    }
    await fetchAllData();
  };

  const handleCheckoutClient = async (logId) => {
    const res = await fetch(`/api/security/checkout/${logId}`, {
      method: 'PUT'
    });
    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || 'Failed to process checkout');
    }
    await fetchAllData();
  };

  const handleDeleteClientLog = async (logId) => {
    if (!window.confirm(`Are you sure you want to permanently delete visitor record ${logId}?`)) return;
    const res = await fetch(`/api/security/log/${logId}`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const errJson = await res.json();
      throw new Error(errJson.error || 'Failed to delete visitor log');
    }
    await fetchAllData();
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset database back to initial seed data?')) return;
    try {
      const res = await fetch('/api/reset-data', { method: 'POST' });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  const activeClients = clientLogs.filter((c) => c.status === 'INSIDE');

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row font-sans antialiased selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      {/* High Density Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onResetData={handleResetData}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-100 dark:bg-slate-950">
        <TopBar
          activeTab={activeTab}
          stats={stats}
          onResetData={handleResetData}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <main className="flex-1 p-3 sm:p-5 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Global High Density Stats Overview */}
          <StatsCards stats={stats} />

          {error && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded flex justify-between items-center">
              <span className="font-semibold">⚠️ {error}</span>
              <button
                onClick={fetchAllData}
                className="px-2.5 py-1 bg-rose-700 text-white font-bold rounded text-[10px] uppercase hover:bg-rose-800"
              >
                Retry Connection
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-xs font-mono">Synchronizing Security Terminal Data...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'admin' && (
                <AdminDashboard
                  workers={workers}
                  onAddWorker={handleAddWorker}
                  onDeleteWorker={handleDeleteWorker}
                  clientLogs={clientLogs}
                  onDeleteClientLog={handleDeleteClientLog}
                  stats={stats}
                />
              )}

              {activeTab === 'security' && (
                <SecurityDesk
                  workers={workers}
                  activeClients={activeClients}
                  onRegisterEntry={handleRegisterEntry}
                  onCheckoutClient={handleCheckoutClient}
                  onDeleteClientLog={handleDeleteClientLog}
                />
              )}

              {activeTab === 'archive' && (
                <ItemHistoryArchive
                  itemHistory={itemHistory}
                  onRefresh={fetchAllData}
                />
              )}

              {activeTab === 'office' && (
                <OfficeWorkerDesk
                  workers={workers}
                  allClientLogs={clientLogs}
                />
              )}

              {activeTab === 'client' && (
                <ClientView
                  allClientLogs={clientLogs}
                />
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-2.5 px-4 sm:px-6 text-[11px] font-mono text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">Sentinel Core v4.2</span>
            <span>|</span>
            <span>Security Entrance & Automated Asset Custody Log</span>
          </div>
          <div>
            <span>Gate Alpha Control Protocol</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
