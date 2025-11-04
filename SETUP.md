# Zoho + Fishbowl Demo — Setup & Run

This demo has:
- **Frontend (Next.js)** on **Vercel** at `https://beboldapp.me`
- **Backend (Express/Node)** on **Render** at `https://api.beboldapp.me`
- **Zoho Books/Inventory/Developers** for OAuth + Items + Invoices
- **Fishbowl** currently **mocked** in production; can switch to **real** via env when the REST URL is ready

---

## Prereqs (already done)
- Domain DNS → Vercel (`A @` + `CNAME www`)
- CNAME `api.beboldapp.me` → `<your-service>.onrender.com`
- Vercel project connected to the frontend repo
- Render Web Service connected to the API repo

---

## Environment Variables

### Backend (Render → Settings → Environment)
| Key | Value |
|---|---|
| `SESSION_SECRET` | any random string |
| `FRONTEND_ORIGIN` | `https://beboldapp.me` |
| `ZOHO_REGION` | `au` |
| `ZOHO_CLIENT_ID` | from Zoho API Console (Server-based App) |
| `ZOHO_CLIENT_SECRET` | from Zoho API Console |
| `ZOHO_REDIRECT_URI` | `https://api.beboldapp.me/oauth/zoho/callback` |
| `ZOHO_BOOKS_ORG_ID` | (optional: set if you know it; otherwise fetched later) |
| `USE_FISHBOWL` | `mock` (default) or `real` |
| `FISHBOWL_BASE_URL` | only if `USE_FISHBOWL=real` → e.g. `https://<ngrok>.ngrok-free.dev/api` |
| `FISHBOWL_USERNAME` | only if `USE_FISHBOWL=real` |
| `FISHBOWL_PASSWORD` | only if `USE_FISHBOWL=real` |

> Do **not** set `PORT` on Render; Render injects it automatically.

### Frontend (Vercel → Project → Settings → Environment Variables)
| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.beboldapp.me` |

---

## Install & Run (local)

### Backend
```bash
# In zoho-fishbowl-demo-api
npm i
cp .env.example .env
# edit .env for local dev (keep USE_FISHBOWL=mock for now)
npm run dev
# http://localhost:8080/health → should return JSON
