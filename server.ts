import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Database file path
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'creando_db.json');

import { INITIAL_PRODUCTS, INITIAL_CLIENTS, INITIAL_DOCUMENTS } from './src/data/initialData.ts';

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial data helper
function getDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (e) {
      console.error('Error reading DB file:', e);
    }
  }

  // Seed default data
  const initialPayload = {
    products: INITIAL_PRODUCTS,
    clients: INITIAL_CLIENTS,
    documents: INITIAL_DOCUMENTS,
    password: 'Ceo2026',
    updatedAt: Date.now()
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialPayload, null, 2), 'utf-8');
  return initialPayload;
}

function saveDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// API Routes for Real-time Multi-Device Sync
app.get('/api/sync', (req, res) => {
  const db = getDb();
  if (db) {
    res.json({ 
      success: true, 
      data: db, 
      updatedAt: db.updatedAt || Date.now(),
      serverTime: Date.now()
    });
  } else {
    res.json({ success: false, data: null });
  }
});

app.post('/api/sync', (req, res) => {
  const incoming = req.body;
  if (!incoming || typeof incoming !== 'object') {
    return res.status(400).json({ success: false, error: 'Invalid payload' });
  }
  const payload = {
    ...incoming,
    updatedAt: Date.now()
  };
  saveDb(payload);
  console.log(`[SYNC] Datos actualizados en tiempo real: ${payload.products?.length || 0} prods, ${payload.documents?.length || 0} docs`);
  res.json({ success: true, updatedAt: payload.updatedAt });
});

// Endpoint de descarga directa para respaldo de Google Drive
app.get('/api/backup/download', (req, res) => {
  const db = getDb();
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `CREANDO_Respaldo_Drive_${dateStr}.json`;
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    sistema: 'CREANDO - Sistema Administrativo',
    version: '2.6',
    fechaRespaldo: new Date().toISOString(),
    datos: db
  }, null, 2));
});

// Vite middleware in dev or static in prod
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CREANDO Server running on port ${PORT}`);
});
