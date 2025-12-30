# Deployment Guide — BW Nexus AI

This document describes how to deploy the full-stack BW Nexus AI application (frontend + backend) to Render using the CI workflow included in `.github/workflows/deploy-render.yml`. It also includes local Docker test steps.

## Overview
- Frontend: Vite-built static site (output `dist`).
- Backend: Express server (source in `server/`) bundled with esbuild to `dist-server`.
- Docker: multi-stage `Dockerfile` builds both artifacts and runs the compiled server.
- CI: GitHub Actions workflows included to build, publish a Docker image to GHCR, and trigger a Render deploy.

## Required GitHub repository secrets
Add these in GitHub → Settings → Secrets & variables → Actions.
- `GHCR_PAT` — Personal access token with `write:packages` (if using GHCR). Optional if you use another registry.
- `RENDER_API_KEY` — Render API key for your account (service deploy trigger).
- `RENDER_SERVICE_ID` — Render service id (numeric id for your service).
- `GEMINI_API_KEY` — Server-side Google/GenAI API key.
- `VITE_GEMINI_API_KEY` — (Optional) client-exposed key — avoid if possible.
- `FRONTEND_URL` — production URL (e.g., https://app.example.com).

## Render setup (recommended)
1. Create a new Web Service on Render (Docker or connect to repo). Note the service id.
2. In Render service settings, add env vars: `NODE_ENV=production`, `FRONTEND_URL`, `GEMINI_API_KEY` (server), and any DB or API keys you need.
3. If using the GitHub Actions workflow, add `RENDER_API_KEY` and `RENDER_SERVICE_ID` as repo secrets.
4. Push to `main`/`master` to start CI -> build -> push image -> trigger Render deploy.

## Netlify alternative (frontend-only)
- Use `netlify.toml` (already present). Deploy `dist` to Netlify; host API separately on Render or another host.

## Local Docker test (quick)
1. Build locally:
```bash
npm ci
npm run build
npm run build:server
```
2. Build Docker image (from repo root):
```bash
docker build -t bw-nexus-ai:local .
```
3. Run container (expose port 3000):
```bash
docker run -d --name bw-test -p 3000:3000 bw-nexus-ai:local
```
4. Check health endpoint:
```bash
curl http://localhost:3000/api/health
```
5. Stop & remove container:
```bash
docker rm -f bw-test
```

Notes:
- If your server needs `GEMINI_API_KEY`, pass it with `-e GEMINI_API_KEY="your_key"` to `docker run` or set it in Render.
- The server will serve static files from `dist` when `NODE_ENV=production`.

## Post-deploy validation
- Visit `https://<your-host>/` and validate UI loads.
- Accept Terms and click "Define Your First Mandate" — ensure navigation to the report-generator and that server API calls succeed.
- Check server logs on Render for any runtime errors (missing env vars, auth errors).

## Security & production hardening checklist
- Do not expose sensitive keys in the client. Prefer server-side proxy for AI APIs.
- Add monitoring (Sentry/Datadog) and log retention.
- Configure TLS & custom domain via Render or Cloud DNS.
- Add rate-limiting, request size limits, and IP protections for API routes.

If you want, I can:
- Trigger a local Docker build & run and report the health result, or
- Create a step-by-step Render setup doc with screenshots.
