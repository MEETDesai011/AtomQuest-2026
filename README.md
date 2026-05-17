# AtomQuest — Enterprise Goal Management Portal

<div align="center">

**A production-grade SaaS platform for organizational goal-setting, performance tracking, and analytics.**

[![Built with React](https://img.shields.io/badge/Frontend-React%2018-61dafb?logo=react)](https://react.dev)
[![Built with Express](https://img.shields.io/badge/Backend-Express.js-000000?logo=express)](https://expressjs.com)
[![Database](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://prisma.io)
[![Real-time](https://img.shields.io/badge/Realtime-Socket.IO-010101?logo=socket.io)](https://socket.io)

</div>

---

## ✨ Features

### Core Platform
- **Multi-role RBAC** — Employee, Manager, Admin with route-level protection
- **Goal Lifecycle** — Draft → Submit → Approve/Rework → Lock with full audit trail
- **Cycle Management** — Goal Setting + Q1-Q4 performance cycles
- **Achievement Tracking** — Quarter-wise progress scoring with manager check-ins
- **Shared Goals** — Cross-team cascading goals with sync propagation

### Analytics & Intelligence
- **AI-Powered Insights** — Anomaly detection, risk prediction, performance recommendations
- **AI Copilot** — Natural language assistant for goal drafting and analytics queries
- **Manager Effectiveness** — Approval turnaround, rework rates, team velocity KPIs
- **Department Comparison** — Quarter-over-quarter cross-department analytics
- **Goal Dependency Graph** — SVG-based organizational goal DAG visualization

### Enterprise Features
- **Real-time Notifications** — Socket.IO with approval, comment, and escalation events
- **Escalation Engine** — Automated daily cron with 3 configurable rules
- **Audit System** — Full before/after diff tracking with replay timeline
- **Export Suite** — XLSX, CSV, PDF export with streaming for large datasets
- **Observability** — Winston logging, Prometheus metrics, synthetic monitoring
- **Dark Mode** — System-aware theme with manual toggle

### DevOps & Infrastructure
- **Docker** — Multi-stage builds for frontend and backend
- **Blue-Green / Canary** — Deployment scripts included
- **Terraform** — Infrastructure-as-Code templates
- **Load Testing** — k6 scripts for performance validation
- **CI/CD** — GitHub Actions workflow

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Clone & Install

```bash
git clone https://github.com/DEVANSHSAVLA/AtomQuest_task.git
cd AtomQuest_task

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

| Role | Email | Password |
|------|-------|----------|
| Employee | john.doe@atomquest.com | password123 |
| Manager | sarah.manager@atomquest.com | password123 |
| Admin | admin@atomquest.com | password123 |

> 💡 Use the **Demo Mode** switcher (bottom-right) to instantly switch between roles.

---

## 🏗️ Architecture

```
goal-portal/
├── backend/                 # Express.js API Server
│   ├── prisma/              # Schema + Migrations + Seed
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic layer
│   │   ├── middleware/       # Auth, RBAC, Rate Limiting, Error Handler
│   │   ├── cron/            # Escalation Engine + Synthetic Monitor
│   │   ├── routes/          # API route definitions
│   │   ├── events/          # CQRS Event Store
│   │   └── utils/           # Logger, Mailer, Redis, Response helpers
│   └── package.json
├── frontend/                # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── pages/           # Role-based page views
│   │   ├── context/         # Auth, Theme, Socket providers
│   │   ├── hooks/           # useApi, custom hooks
│   │   └── api/             # Axios instance + interceptors
│   └── package.json
├── scripts/                 # DevOps scripts
├── terraform/               # IaC templates
├── docker-compose.yml       # Full-stack orchestration
└── Project_Overview_IEEE.md # Comprehensive IEEE-format documentation
```

---

## 📊 API Documentation

Swagger UI available at: `http://localhost:5000/api-docs`

Key endpoints:
- `POST /api/v1/auth/login` — JWT authentication
- `GET /api/v1/goals/mine` — Employee goals by cycle
- `POST /api/v1/manager/approve/:id` — Manager approval flow
- `GET /api/v1/admin/audit` — Full audit trail
- `GET /api/v1/analytics/qoq` — Quarter-over-quarter analytics
- `GET /api/v1/health` — System health check
- `GET /metrics` — Prometheus metrics

---

## 🛡️ Security

- JWT authentication with expiry handling
- Role-based access control (RBAC) at route + middleware level
- Helmet.js security headers
- Rate limiting (100 req/15min on auth)
- Input validation via Zod
- CORS origin whitelisting
- Tenant-scoped Prisma queries

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TanStack Query, Recharts, Lucide Icons |
| Backend | Express.js, Prisma ORM, Socket.IO, Winston, node-cron |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| DevOps | Docker, Terraform, GitHub Actions |
| Monitoring | Prometheus, Winston, Synthetic Monitor |

---

## 📄 License

MIT

---

<div align="center">
<strong>Built for AtomQuest Hackathon 2025</strong>
</div>
