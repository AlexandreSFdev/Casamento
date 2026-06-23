const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '_' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage });

// Serve uploaded files
app.use('/uploads', express.static(UPLOAD_DIR));

// Simple health
app.get('/health', (req, res) => res.json({ ok: true }));

// Upload endpoint
app.post('/api/upload', upload.single('media'), (req, res) => {
  // Optional token authentication
  const serverToken = process.env.UPLOAD_TOKEN || null;
  if (serverToken) {
    const auth = req.headers['authorization'] || req.headers['x-api-token'];
    let token = null;
    if (auth) {
      if (String(auth).startsWith('Bearer ')) token = String(auth).slice(7);
      else token = auth;
    }
    if (!token || token !== serverToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ id: req.file.filename, url, originalName: req.file.originalname, mimeType: req.file.mimetype });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Upload server running on http://localhost:${PORT}`));
