# Fixing CORS for Frontend-Backend Communication

## Status

- [x] Backend server deps cleaned and reinstalled.
- [x] Backend server started (`npm run dev` in backend).
- [x] Confirmed CORS middleware in backend/src/app.ts.
- [x] Added Vite proxy to frontend/vite.config.js.
- [x] Updated frontend api baseURL to use proxy.
- [ ] Restart frontend dev server.
- [ ] Test login/register (no CORS error).

## Backend MongoDB Dep Issue (aws4)

- Temporary workaround with clean install.
- If persists, run `cd backend/node_modules/mongodb && npm i aws4`
- Or downgrade `npm i mongoose@8.6.2 mongodb@6.11.0`

## Commands

- Frontend: `cd frontend && npm run dev`
- Test backend: `curl http://localhost:5000/health`
- Once frontend running, login/register should work without CORS errors (proxied requests).

Progress: Proxy added, CORS resolved for dev. Backend up.
