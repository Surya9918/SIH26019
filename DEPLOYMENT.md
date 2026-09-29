# Bhu-Setu Deployment Guide

This document outlines the required steps, environment configurations, and infrastructure considerations for deploying the Bhu-Setu National Digital Platform for Land Governance.

## A. Prerequisites
- Node.js (v18+) for frontend building
- Python 3.10+ for the backend
- A deployment environment that supports **Persistent Block Storage** (for the SQLite database)
- Ability to configure environment variables

## B. Backend Environment Variables
The backend requires the following environment variables when deployed to production:
- `APP_ENV`: Must be exactly `production`
- `SECRET_KEY`: A highly secure, random 32+ character string used for JWT signing. (Required in production)
- `CORS_ORIGINS`: A comma-separated list of allowed frontend domains. (e.g., `https://bhu-setu.gov.in`)
- `DATABASE_PATH`: Absolute path to the persistent SQLite file location. (e.g., `/mnt/data/land_governance.db`)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: (Optional) JWT session expiration time in minutes. Defaults to 480.

## C. Frontend Environment Variables
The frontend requires the following variable to be injected during the **build** step:
- `VITE_API_URL`: The fully qualified base URL of the backend API. (e.g., `https://api.bhu-setu.gov.in/api`)

## D. SQLite Persistent Storage Requirement
**CRITICAL:** The backend natively utilizes SQLite (`land_governance.db`). This architecture requires persistent block storage attached to the backend server.
- This application **cannot** be deployed natively to ephemeral serverless environments (like AWS Lambda) because the disk resets on cold starts, destroying the database.
- Deploy the backend using a standard VM (EC2, DigitalOcean Droplet) or a container service with a mounted volume (Render, Railway, Docker volumes).

## E. CORS Setup
The backend FastAPI application relies on `CORS_ORIGINS` to permit frontend requests.
- Do NOT use a wildcard `*` in production.
- Ensure you set `CORS_ORIGINS` to exactly match the frontend URL including the protocol (e.g., `https://bhu-setu.gov.in`).

## F. Local Production Test
To simulate a production run locally:
1. Terminal 1 (Frontend): `npm run build && npm run preview`
2. Terminal 2 (Backend): `export APP_ENV=production && export SECRET_KEY=my_secure_test_key && python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000`

## G. Separate Frontend/Backend Deployment Flow

### Backend Deployment Steps:
1. Provision a host with persistent storage.
2. Install Python dependencies: `pip install -r requirements.txt`
3. Set the environment variables (see Section B).
4. Start the application:
   ```bash
   python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
   ```

### Frontend Deployment Steps:
1. Ensure `VITE_API_URL` is set in the build environment to point to the backend deployed in the previous step.
2. Install Node dependencies: `npm install`
3. Build the static assets:
   ```bash
   npm run build
   ```
4. Serve the generated `dist/` directory via a static host (NGINX, Vercel, Netlify, etc.).

## H. Post-Deployment Verification Checklist
- [ ] Backend is running and `/api/health` returns `HEALTHY`
- [ ] Frontend successfully loads over HTTPS
- [ ] Registration / Login successfully returns a JWT
- [ ] GIS map layers successfully load and display overlays
- [ ] Page refreshes do not log the user out unexpectedly
- [ ] Network tab shows 0 CORS errors
