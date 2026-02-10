# OpenClaw Intelligence

Angular frontend + Node.js/Express + MongoDB backend for www.openclawintelligence.com.

## Structure
- `openclaw-intelligence-frontend/` — Angular app
- `backend/` — Express API (`/api/contact`)

## Local dev

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend
```bash
cd openclaw-intelligence-frontend
npm install
npm start
```

## Build
```bash
cd openclaw-intelligence-frontend
npm run build
```

## Deploy
- Serve `openclaw-intelligence-frontend/dist/openclaw-intelligence-frontend`
- Run backend on port 4010
- Proxy `/api` to backend
