# Upload server (local)

This is a minimal Express server to accept media uploads from the SPA and store them under `server/uploads`.

Install dependencies and start:

```bash
cd server
npm install
npm start
```

Endpoints:
- `POST /api/upload` - accepts `multipart/form-data` with field `media`; returns JSON `{ id, url, originalName, mimeType }`.
- `GET /uploads/<filename>` - serves uploaded file.

Notes:
- This server is intentionally minimal for a home-hosted environment. For production consider adding authentication, file size limits, virus scanning and HTTPS.
