# Shade Tree DIY

Personal vehicle maintenance tracker built with Vue 3, Pinia, Cloudflare Workers, and D1.

## Local Development

### Frontend
```bash
npm install
npm run dev
```

### Worker (API)
```bash
npm install -g wrangler
wrangler login
wrangler dev
```

## First-Time Cloudflare Setup

```bash
# Create D1 database
wrangler d1 create shade-tree-diy
# Paste the returned database_id into wrangler.toml

# Run schema
wrangler d1 execute shade-tree-diy --file=schema.sql

# Set JWT secret
wrangler secret put JWT_SECRET
```

## Deploy

```bash
# Deploy Worker
wrangler deploy

# Deploy Frontend
# Push to GitHub → Cloudflare Pages → Connect repo
# Build command:   npm run build
# Output dir:      dist
# Env var:         VITE_API_URL = https://shade-tree-diy-api.YOUR_SUBDOMAIN.workers.dev
```
