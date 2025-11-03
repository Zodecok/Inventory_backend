# Zoho + Fishbowl Demo API

## Local

```bash
npm i
cp .env.example .env
npm run dev
```

## Render

Create a Web Service from this repo.

Set env vars from .env.example.

Add custom domain api.beboldapp.me in Render, then create a CNAME in your DNS.

Hitting GET /health should return { ok: true }.

## OAuth

Zoho redirect: https://api.beboldapp.me/oauth/zoho/callback

Visit GET /oauth/zoho/login to connect the org during the demo.

## Deploy steps (quick)

1. **Render** → New **Web Service** → pick the repo → **Free** plan
   - Build: `npm ci && npm run build`
   - Start: `npm run start`
2. **Env vars** in Render: set everything from `.env.example` (leave Fishbowl blanks to use mock).
3. **Custom domain** in Render: add `api.beboldapp.me` → create the `CNAME` at your registrar.
4. When live, open: `https://api.beboldapp.me/health` → should show `{ ok: true, ... }`.

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /oauth/zoho/login` - Initiates Zoho OAuth flow
- `GET /oauth/zoho/callback` - Zoho OAuth callback
- `POST /webhooks/zoho/crm` - Zoho CRM webhook receiver
- `GET /products` - Get products (Fishbowl mock + Zoho merge)
- `POST /order` - Create order (Zoho invoice + Fishbowl SO later)

## Project Structure

```
zoho-fishbowl-demo-api/
├─ src/
│  ├─ index.ts                # server bootstrap
│  ├─ routes/
│  │  ├─ health.ts            # GET /health
│  │  ├─ zoho-oauth.ts        # GET /oauth/zoho/login, GET /oauth/zoho/callback
│  │  ├─ zoho-webhooks.ts     # POST /webhooks/zoho/crm
│  │  ├─ products.ts          # GET /products  (Fishbowl + Zoho merge; mock first)
│  │  └─ orders.ts            # POST /order    (creates Zoho invoice; Fishbowl SO later)
│  ├─ lib/
│  │  ├─ zoho.ts              # Zoho OAuth helpers (token exchange/refresh), Books/Inventory calls
│  │  ├─ fishbowl-mock.ts     # mock adapter for Fishbowl endpoints
│  │  └─ fishbowl.ts          # real Fishbowl REST client (optional for demo day)
│  └─ types.ts
├─ .env.example
├─ .gitignore
├─ package.json
├─ tsconfig.json
├─ README.md
└─ render.yaml                # Render config-as-code
```
