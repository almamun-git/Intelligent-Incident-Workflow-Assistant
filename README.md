# 🚀 Ops-Assist AI – Intelligent Incident Response Platform

AI-powered platform for real-time incident detection, classification, and analytics.

---

## 🧠 Overview

Ops-Assist AI helps engineering and DevOps teams detect and triage production issues faster by:

- Streaming and storing application events/logs
- Automatically grouping spikes of errors into incidents
- Using AI to classify category and severity and suggest actions
- Providing a modern dashboard to monitor status and trends

Under the hood, it’s a full-stack app built with FastAPI, PostgreSQL, and a Next.js dashboard. If an OpenAI API key isn’t configured, the AI layer gracefully falls back to a deterministic mock for local testing.

---

## ✨ Core Features

- Real-time event ingestion and querying
- Automatic incident detection (threshold + time window)
- AI-powered classification (category, severity, summary, actions)
- Incident lifecycle management: open → investigating → resolved → closed
- Modern dashboard with incidents list and details
- Ready for cloud deployment (Railway + Vercel + Supabase)

---

## 🧱 Monorepo Structure

```
ops-assist-ai
├── apps
│   ├── backend          # FastAPI backend (API + DB + AI service)
│   └── frontend         # Next.js dashboard (React + TypeScript)
├── packages
│   └── shared           # Shared types
├── RUNNING.md           # Detailed local run guide
├── DEPLOYMENT.md        # Cloud deployment guide
└── README.md            # You are here
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | Next.js 14 • React 18 • TypeScript • TailwindCSS |
| Backend | FastAPI • SQLAlchemy • Uvicorn |
| Database | PostgreSQL (local) • Supabase (hosted) |
| AI | OpenAI API (with mock fallback) |
| DevOps | Railway (backend) • Vercel (frontend) |

---

## 🧩 Architecture

```
[ Services emit events/logs ]
        │
        ▼
┌──────────────────────────────┐
│ FastAPI Backend (Uvicorn)   │
│  • /api/v1/events           │
│  • /api/v1/incidents        │
│  • AI classification        │
│  • SQLAlchemy ORM           │
└─────────────┬────────────────┘
              │
              ▼
        [ PostgreSQL ]
              │
              ▼
┌──────────────────────────────┐
│ Next.js Frontend             │
│  • Dashboard & Incidents     │
│  • Filters & Status Updates  │
└──────────────────────────────┘
```

---

## ⚙️ Quick Start

See RUNNING.md for the complete guide. Below are the essentials for macOS/Linux shells.

1) Clone
```bash
git clone https://github.com/almamun-git/Ops-Assist-AI.git
cd Ops-Assist-AI
```

2) Backend (FastAPI)
```bash
cd apps/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env (values shown are examples)
cat > .env << 'EOF'
DATABASE_URL=postgresql://apu@localhost:5432/ops_assist_ai
OPENAI_API_KEY=your-openai-api-key-or-empty
INCIDENT_THRESHOLD=5
INCIDENT_TIME_WINDOW=300
EOF

uvicorn src.main:app --reload --port 8000
```

3) Frontend (Next.js)
```bash
cd ../frontend
npm install
npm run dev
```

- Backend: http://localhost:8000 (Docs at /docs)
- Frontend: http://localhost:3000

---

## 🔗 API Reference (selected)

Base URL: http://localhost:8000

- Health
  - GET `/health` → `{ "status": "healthy", "environment": "development" }`

- Events
  - POST `/api/v1/events`
    - Body: `{ "service": "payment-service", "level": "ERROR", "message": "Database connection timeout" }`
  - GET `/api/v1/events?service=auth-api&level=ERROR&limit=50`

- Incidents
  - GET `/api/v1/incidents?status_filter=open&limit=20`
  - GET `/api/v1/incidents/{id}`
  - PATCH `/api/v1/incidents/{id}/status` with `{ "status": "investigating" }`
  - POST `/api/v1/incidents/{id}/analyze` (re-run AI analysis)

Incident detection defaults: 5 ERROR events within 5 minutes for the same service will open a new incident (configurable via INCIDENT_THRESHOLD and INCIDENT_TIME_WINDOW).

---

## 💥 Example Scenarios (inspired by real ops)

- E‑commerce
  - payment-gateway • timeout_error • P1 → "Payment provider API timeout during checkout"
  - inventory-service • data_sync • P2 → "Stock quantity not updating across warehouses"

- Cloud/Infra
  - k8s-controller • deployment_failure • P1 → "Pod CrashLoopBackOff for analytics-service"
  - storage-service • disk_full • P1 → "Disk usage exceeded 95% on persistent volume"

---

## 📚 Docs

- Local run: see `RUNNING.md`
- Deployment guides (Railway, Vercel, Supabase): see `DEPLOYMENT.md`

---

## 🧪 Quick Test Snippets

With the backend running:

```bash
# Health
curl http://localhost:8000/health

# Create an ERROR event
curl -X POST http://localhost:8000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{"service":"payment-service","level":"ERROR","message":"Database connection timeout"}'

# List incidents
curl http://localhost:8000/api/v1/incidents
```

---

## 👨‍💻 Author

Abdullah Al Mamun Apu  
Portfolio: https://mamunapu.tech • GitHub: https://github.com/almamun-git • LinkedIn: https://linkedin.com/in/almamun-in

---

## 📄 License

MIT — see LICENSE.

---

"Built with ❤️ to make DevOps smarter."
