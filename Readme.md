# NeoBank Pro (Mini Digital Banking)

A full-stack **digital banking demo** with a **TypeScript / Express** backend (clean architecture, OOP, design patterns) and a premium **React (JavaScript)** + **Tailwind CSS** frontend (glassmorphism, Recharts, Framer Motion, Lucide). It demonstrates JWT authentication, savings operations, transfers, fixed deposits, fraud flagging on transactions, PDF statements, and simulated email logging.

---

## Project overview

The backend exposes a REST API under the **`/api`** prefix with MongoDB persistence. The frontend is a Vite SPA served on port **5173** by default, talking to the API on port **5000**.

---

## Features

- Register / login (JWT)
- **Settings**: theme (dark/light), email notification toggle, change password
- Create **savings** accounts
- View profile, balances, and account list
- **Deposit**, **withdraw**, **transfer** (savings)
- Transaction history with **PDF download** (includes fraud flags when applicable)
- **Fixed deposits** (6 / 12 / 24 months)
- Dashboard with **balance summary**, **monthly spending**, and **charts**

### Cross-cutting

- Password hashing (**bcrypt**), validation (**express-validator**), global + auth **rate limiting**
- **Fraud detection**: transactions above `FRAUD_AMOUNT_THRESHOLD` are flagged (visible on statements and in transaction history)
- **Email simulation**: append-only log file under `backend/src/logs/email-sim.log`
- **Monthly spending analytics** aggregated in MongoDB

---

## Tech stack

| Layer    | Stack |
|----------|--------|
| Frontend | React 19, JavaScript, Vite, Tailwind CSS, Axios, React Router, Recharts |
| Backend  | Node.js, Express 5, TypeScript, Mongoose, JWT, bcrypt, dotenv |
| Database | MongoDB |

---

## Folder structure

### Backend (`backend/src/`)

| Path | Purpose |
|------|---------|
| `config/` | Singleton DB connection, constants |
| `controllers/` | HTTP handlers |
| `services/` | Business logic (services + fraud, PDF, email sim) |
| `repositories/` | Data access (Mongo / Mongoose) |
| `models/` | Mongoose schemas |
| `routes/` | Express routers |
| `middleware/` | Auth, RBAC (customer), validation result, errors, rate limit |
| `interfaces/` | Abstract contracts for repositories / services |
| `factories/` | Account factory (savings / FD) |
| `classes/` | **OOP** domain: `User`, `Customer`, `Account`, `SavingsAccount`, `FixedDepositAccount` |
| `utils/` | JWT helpers, errors, account number generator |
| `validators/` | express-validator chains |
| `logs/` | Runtime logs (e.g. simulated email) |

### Frontend (`frontend/src/`)

| Path | Purpose |
|------|---------|
| `components/` | `ProtectedRoute`, etc. |
| `pages/` | Public + authenticated customer screens |
| `layouts/` | Sidebar layout |
| `context/` | `AuthProvider` / JWT in `localStorage` |
| `services/` | Axios client with interceptors |

---

## OOP concepts (backend)

- **Encapsulation**: `Account` keeps a **private** balance; only `deposit()` / `withdraw()` mutate it.
- **Inheritance**: abstract `User` with concrete `Customer`.
- **Polymorphism**: `SavingsAccount` and `FixedDepositAccount` implement `calculateInterest()` differently.
- **Abstraction**: repository interfaces (`IUserRepository`, `IAccountRepository`, …) and service interfaces (`IAuthService`, `IAccountService`).

---

## Design patterns

- **Singleton**: `DatabaseConnectionManager` for a single Mongoose connection lifecycle.
- **Factory**: `AccountFactory` creates savings vs FD accounts and coordinates persistence.
- **Repository**: Mongoose queries isolated per aggregate.
- **Service layer**: controllers stay thin; rules live in services.

---

## Installation

### Prerequisites

- **Node.js** 18+
- **MongoDB** 6+ (local or Atlas)

### 1. Clone and install

```bash
cd Mini-Digital-Banking
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` with a real `MONGO_URI` and `JWT_SECRET`.

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Run MongoDB

Example (local):

```bash
mongod --dbpath /path/to/data
```

### 3. Start servers

**Terminal A — API**

```bash
cd backend
npm run dev
```

**Terminal B — SPA**

```bash
cd frontend
npm run dev
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:5000` (health: `GET /health`)

**Local dev & CORS:** With the default setup, axios uses **`/api`** as `baseURL`, and **Vite proxies** that to `http://localhost:5000`, so the browser stays on port **5173** (no cross-origin requests). Leave **`VITE_API_URL` unset** in dev. If you set `VITE_API_URL` to a full URL like `http://localhost:5000/api`, the browser calls the API directly; keep **`CLIENT_ORIGIN=http://localhost:5173`** in `backend/.env` so CORS allows your app.

---

## API endpoints

Base URL: `http://localhost:5000/api`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Register |
| POST | `/auth/login` | — | Login |
| GET | `/user/profile` | JWT | Profile |
| GET | `/user/settings` | JWT | Preferences (theme, email notifications) |
| PUT | `/user/settings` | JWT | Update preferences (`theme`, `emailNotifications`) |
| PUT | `/user/password` | JWT | Change password (`currentPassword`, `newPassword`) |
| GET | `/user/dashboard/summary` | JWT | Dashboard summary |
| GET | `/user/analytics/spending` | JWT | Monthly spending (`?year=&month=`) |
| POST | `/accounts/create` | JWT | Create savings account |
| GET | `/accounts/my` | JWT | List accounts |
| GET | `/accounts/balance/:id` | JWT | Balance |
| POST | `/transactions/deposit` | JWT | Deposit |
| POST | `/transactions/withdraw` | JWT | Withdraw |
| POST | `/transactions/transfer` | JWT | Transfer |
| GET | `/transactions/history/:id` | JWT | History |
| GET | `/transactions/history/:id/export-pdf` | JWT | PDF statement |
| POST | `/fd/create` | JWT | Create FD |
| GET | `/fd/my` | JWT | List FDs |

---


## Security notes

This demo is **not** production banking software. It is intended for **portfolio / learning** use. Harden TLS, secrets management, auditing, and regulatory controls before any real deployment.

---



