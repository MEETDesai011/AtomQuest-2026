# AtomQuest 2026 — Enterprise Goal Management Portal

<div align="center">

**A full-stack SaaS platform for organizational goal-setting, performance tracking, and AI-powered analytics. Built solo for the AtomQuest 2026 Hackathon.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-atom--quest--2026.vercel.app-blue?logo=vercel)](https://atom-quest-2026.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018-61dafb?logo=react)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Express.js-000000?logo=express)](https://expressjs.com)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://prisma.io)
[![Real-time](https://img.shields.io/badge/Realtime-Socket.IO-010101?logo=socket.io)](https://socket.io)
[![Deployed on](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)

---

## 🔗 Live Site

👉 **[https://atom-quest-2026.vercel.app](https://atom-quest-2026.vercel.app)**

---

## 🧠 What I Built

AtomQuest 2026 is an enterprise-grade goal management portal designed for organizations to set, track, and review performance goals across teams and departments.

I built the entire project solo — from system design and backend architecture to UI, DevOps, and deployment. Key things I implemented:

- **Multi-role RBAC system** — Employee, Manager, and Admin roles with route-level access control
- **Goal lifecycle engine** — Draft → Submit → Approve/Rework → Lock, with a full audit trail showing before/after diffs
- **Cycle management** — Goal Setting cycle + Q1–Q4 performance review cycles
- **AI-powered insights** — Anomaly detection, risk prediction, and performance recommendations via AI Copilot (natural language assistant for goal drafting and analytics)
- **Real-time notifications** — Socket.IO events for approvals, comments, and escalations
- **Escalation engine** — Automated daily cron with 3 configurable escalation rules
- **Export suite** — XLSX, CSV, PDF exports with streaming for large datasets
- **Goal Dependency Graph** — SVG-based DAG visualization for cross-team cascading goals
- **Observability stack** — Winston logging + Prometheus metrics + synthetic monitoring
- **Full DevOps setup** — Docker multi-stage builds, Terraform IaC, GitHub Actions CI/CD, blue-green deployment scripts
- **Dark mode** — System-aware with manual toggle

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone & Install

```bash
git clone https://github.com/MEETDesai011/AtomQuest-2026.git
cd AtomQuest-2026

# Backend
cd backend
cp .env.example .env
npm install
npx prisma db push
node prisma/seed.js

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Run

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

### 3. Demo Accounts

| Role     | Email                          | Password    |
|----------|-------------------------------|-------------|
| Employee | john.doe@atomquest.com        | password123 |
| Manager  | sarah.manager@atomquest.com   | password123 |
| Admin    | admin@atomquest.com           | password123 |

> 💡 Use the **Demo Mode** switcher (bottom-right corner) to instantly switch between roles without logging out.

---

## 🏗️ Architecture

```
AtomQuest-2026/
├── backend/                 # Express.js API Server
│   ├── prisma/              # Schema + Migrations + Seed
│   └── src/
│       ├── controllers/     # Route handlers
│       ├── services/        # Business logic
│       ├── middleware/      # Auth, RBAC, Rate Limiting, Error Handler
│       ├── cron/            # Escalation Engine + Synthetic Monitor
│       ├── routes/          # API route definitions
│       ├── events/          # CQRS Event Store
│       └── utils/           # Logger, Mailer, Redis, Response helpers
├── frontend/                # React 18 + Vite SPA
│   └── src/
│       ├── components/      # Shared UI components
│       ├── pages/           # Role-based page views
│       ├── context/         # Auth, Theme, Socket providers
│       ├── hooks/           # useApi, custom hooks
│       └── api/             # Axios instance + interceptors
├── scripts/                 # DevOps & deployment scripts
├── terraform/               # Infrastructure-as-Code templates
├── docker-compose.yml       # Full-stack orchestration
├── prometheus.yml           # Metrics config
└── Project_Overview_IEEE.md # IEEE-format project documentation
```

---

## 📊 API Overview

Swagger UI: `http://localhost:5000/api-docs`

| Method | Endpoint                     | Description                    |
|--------|------------------------------|--------------------------------|
| POST   | /api/v1/auth/login           | JWT authentication             |
| GET    | /api/v1/goals/mine           | Employee goals by cycle        |
| POST   | /api/v1/manager/approve/:id  | Manager approval flow          |
| GET    | /api/v1/admin/audit          | Full audit trail               |
| GET    | /api/v1/analytics/qoq        | Quarter-over-quarter analytics |
| GET    | /api/v1/health               | System health check            |
| GET    | /metrics                     | Prometheus metrics             |

---

## 🛡️ Security

- JWT authentication with expiry handling
- Role-based access control at route + middleware level
- Helmet.js security headers
- Rate limiting (100 req / 15 min on auth endpoints)
- Input validation via Zod
- CORS origin whitelisting
- Tenant-scoped Prisma queries

---

## 📦 Tech Stack

| Layer      | Technology                                              |
|------------|--------------------------------------------------------|
| Frontend   | React 18, Vite, TanStack Query, Recharts, Lucide Icons |
| Backend    | Express.js, Prisma ORM, Socket.IO, Winston, node-cron  |
| Database   | SQLite (dev) / PostgreSQL (prod)                       |
| Auth       | JWT (jsonwebtoken) + bcryptjs                          |
| DevOps     | Docker, Terraform, GitHub Actions                      |
| Monitoring | Prometheus, Winston, Synthetic Monitor                 |
| Deployment | Vercel (frontend)                                      |

---

## 👤 Author

**Meet Desai**
- GitHub: [@MEETDesai011](https://github.com/MEETDesai011)
- Built solo for AtomQuest Hackathon 2026

---

## 📄 License

MIT