import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const initialDatabase = {
  workers: [
    { id: "EMP-101", name: "Office Worker", role: "Office Worker", department: "General Office" },
    { id: "EMP-102", name: "Admin", role: "Admin Office", department: "Administration" },
    { id: "EMP-104", name: "Alex Rivera", role: "Security", department: "Main Gate Alpha" },
    { id: "EMP-105", name: "Officer James Vance", role: "Security", department: "Visitor Desk" }
  ],
  client_logs: [
    {
      log_id: "LOG-5001",
      client_name: "Robert Fox",
      contact: "+1 555-0199",
      host_worker: "Office Worker",
      purpose: "Maintenance & Server Audit",
      items: ["Dell XPS Laptop (SN-9821)", "Diagnostic Toolbox"],
      check_in_time: "09:15 AM",
      check_out_time: null,
      status: "INSIDE"
    },
    {
      log_id: "LOG-5002",
      client_name: "Elena Rostova",
      contact: "+1 555-0244",
      host_worker: "Admin",
      purpose: "Vendor Meeting - Q3 Campaign",
      items: ["MacBook Pro 16\" (SN-A8820)", "Prototype Presentation Case"],
      check_in_time: "10:30 AM",
      check_out_time: null,
      status: "INSIDE"
    },
    {
      log_id: "LOG-5003",
      client_name: "Marcus Brody",
      contact: "+1 555-0311",
      host_worker: "Office Worker",
      purpose: "Legal Review & Contract Signing",
      items: ["Leather Document Portfolio"],
      check_in_time: "11:00 AM",
      check_out_time: null,
      status: "INSIDE"
    }
  ],
  item_history_logs: [
    {
      history_id: "HIST-9001",
      item_name: "Lenovo ThinkPad X1 (SN-7731)",
      client_name: "David Kim",
      host_worker: "Office Worker",
      check_in_time: "08:00 AM",
      check_out_time: "10:15 AM",
      status: "RETURNED"
    },
    {
      history_id: "HIST-9002",
      item_name: "DSLR Camera & Lens Kit",
      client_name: "Sophia Martinez",
      host_worker: "Admin",
      check_in_time: "08:30 AM",
      check_out_time: "10:45 AM",
      status: "RETURNED"
    }
  ]
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDatabase, null, 2));
      return JSON.parse(JSON.stringify(initialDatabase));
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, resetting to initial:", err);
    return JSON.parse(JSON.stringify(initialDatabase));
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

function formatCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // GET Stats
  app.get('/api/stats', (req, res) => {
    const db = readDb();
    const activeClients = db.client_logs.filter(c => c.status === 'INSIDE');
    const checkedOutClients = db.client_logs.filter(c => c.status === 'CHECKED_OUT');
    
    // Count active items in custody
    const activeItemsCount = activeClients.reduce((acc, client) => acc + (client.items ? client.items.length : 0), 0);
    const officeWorkersCount = db.workers.filter(w => w.role === 'Office Worker').length;
    const securityCount = db.workers.filter(w => w.role === 'Security').length;

    res.json({
      headcountInside: activeClients.length,
      activeItemsInCustody: activeItemsCount,
      totalCheckedOut: checkedOutClients.length,
      returnedItemsArchived: db.item_history_logs.length,
      officeWorkersCount,
      securityCount,
      totalWorkers: db.workers.length
    });
  });

  // 1. ADMIN: GET /api/admin/workers
  app.get('/api/admin/workers', (req, res) => {
    const db = readDb();
    res.json(db.workers);
  });

  // 1. ADMIN: POST /api/admin/workers
  app.post('/api/admin/workers', (req, res) => {
    const { name, role, department } = req.body;
    if (!name || !role) {
      return res.status(400).json({ error: 'Name and Role are required' });
    }

    const db = readDb();
    const newId = `EMP-${Math.floor(100 + Math.random() * 900)}`;
    const newWorker = {
      id: newId,
      name: name.trim(),
      role: role === 'Security' ? 'Security' : 'Office Worker',
      department: department ? department.trim() : (role === 'Security' ? 'Security Desk' : 'General Office')
    };

    db.workers.push(newWorker);
    writeDb(db);

    res.status(201).json(newWorker);
  });

  // ADMIN: DELETE /api/admin/workers/:id
  app.delete('/api/admin/workers/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    const index = db.workers.findIndex(w => w.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Worker not found' });
    }
    const removed = db.workers.splice(index, 1);
    writeDb(db);
    res.json({ message: 'Worker removed', worker: removed[0] });
  });

  // 2. SECURITY DESK: GET /api/security/clients
  app.get('/api/security/clients', (req, res) => {
    const db = readDb();
    const { status, host, query } = req.query;
    let results = db.client_logs;

    if (status) {
      results = results.filter(c => c.status === status);
    }

    if (host) {
      results = results.filter(c => c.host_worker && c.host_worker.toLowerCase().includes(host.toLowerCase()));
    }

    if (query) {
      const q = query.toLowerCase();
      results = results.filter(c => 
        c.client_name.toLowerCase().includes(q) ||
        c.contact.toLowerCase().includes(q) ||
        c.log_id.toLowerCase().includes(q) ||
        (c.items && c.items.some(i => i.toLowerCase().includes(q)))
      );
    }

    res.json(results);
  });

  // 2. SECURITY DESK: POST /api/security/register-entry
  app.post('/api/security/register-entry', (req, res) => {
    const { client_name, contact, host_worker, purpose, items } = req.body;

    if (!client_name || !host_worker) {
      return res.status(400).json({ error: 'Client Name and Visiting Host are required' });
    }

    const db = readDb();
    const log_id = `LOG-${Math.floor(5000 + Math.random() * 4900)}`;
    
    // Items processing
    let itemsArray = [];
    if (Array.isArray(items)) {
      itemsArray = items.map(i => String(i).trim()).filter(Boolean);
    } else if (typeof items === 'string' && items.trim().length > 0) {
      itemsArray = items.split(',').map(i => i.trim()).filter(Boolean);
    }

    const newLog = {
      log_id,
      client_name: client_name.trim(),
      contact: contact ? contact.trim() : 'N/A',
      host_worker: host_worker.trim(),
      purpose: purpose ? purpose.trim() : 'General Visit',
      items: itemsArray,
      check_in_time: formatCurrentTime(),
      check_out_time: null,
      status: 'INSIDE'
    };

    db.client_logs.unshift(newLog);
    writeDb(db);

    res.status(201).json(newLog);
  });

  // 2. SECURITY DESK: PUT/POST /api/security/checkout/:logId
  const handleCheckoutRequest = (req, res) => {
    const { logId } = req.params;
    const db = readDb();

    const normalizedId = String(logId || '').trim().toLowerCase();
    const clientIndex = db.client_logs.findIndex(c => String(c.log_id || '').trim().toLowerCase() === normalizedId);
    if (clientIndex === -1) {
      return res.status(404).json({ error: `Client log ${logId} not found` });
    }

    const client = db.client_logs[clientIndex];
    if (client.status === 'CHECKED_OUT') {
      return res.status(400).json({ error: 'Client has already checked out' });
    }

    const checkOutTime = formatCurrentTime();
    client.status = 'CHECKED_OUT';
    client.check_out_time = checkOutTime;

    // Transfer all registered items to Item History Archive
    const archivedEntries = [];
    if (client.items && client.items.length > 0) {
      client.items.forEach(item => {
        const historyEntry = {
          history_id: `HIST-${Math.floor(9000 + Math.random() * 999)}`,
          item_name: item,
          client_name: client.client_name,
          host_worker: client.host_worker,
          check_in_time: client.check_in_time,
          check_out_time: checkOutTime,
          status: 'RETURNED'
        };
        db.item_history_logs.unshift(historyEntry);
        archivedEntries.push(historyEntry);
      });
    }

    writeDb(db);

    res.json({
      message: 'Client checked out successfully and items transferred to archive.',
      client,
      archivedEntries
    });
  };

  app.put('/api/security/checkout/:logId', handleCheckoutRequest);
  app.post('/api/security/checkout/:logId', handleCheckoutRequest);

  // DELETE /api/security/log/:logId - Delete visitor log entry
  app.delete('/api/security/log/:logId', (req, res) => {
    const { logId } = req.params;
    const db = readDb();
    const normalizedId = String(logId || '').trim().toLowerCase();
    const index = db.client_logs.findIndex(c => String(c.log_id || '').trim().toLowerCase() === normalizedId);
    if (index === -1) {
      return res.status(404).json({ error: `Log entry ${logId} not found` });
    }
    const removed = db.client_logs.splice(index, 1)[0];
    writeDb(db);
    res.json({ message: 'Visitor log deleted successfully', removed });
  });

  // 3. ITEM HISTORY ARCHIVE: GET /api/history/items
  app.get('/api/history/items', (req, res) => {
    const db = readDb();
    const { search } = req.query;

    let results = db.item_history_logs;
    if (search) {
      const q = search.toLowerCase().trim();
      results = results.filter(item => 
        item.item_name.toLowerCase().includes(q) ||
        item.client_name.toLowerCase().includes(q) ||
        item.host_worker.toLowerCase().includes(q) ||
        item.history_id.toLowerCase().includes(q)
      );
    }

    res.json(results);
  });

  // POST /api/reset-data - Reset data to initial state
  app.post('/api/reset-data', (req, res) => {
    const freshDb = JSON.parse(JSON.stringify(initialDatabase));
    writeDb(freshDb);
    res.json({ message: 'Database reset to default seed state', data: freshDb });
  });


  // --- VITE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Security Entrance System backend active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
