# Mini Digital Banking System

## Project Overview

Mini Digital Banking System is a full-stack banking application that simulates core digital banking operations. The system provides a complete digital banking experience with account management, money transfers, transaction tracking, fixed deposits, and administrative controls.

The primary focus of this project is on backend architecture, applying Object-Oriented Programming (OOP) principles, clean code structure, and appropriate design patterns to create a robust and scalable banking system.

---

## Features

### Customer Features

- **User Registration & Login** - Secure authentication using JWT tokens
- **Create Savings Account** - Open new savings accounts with initial deposits
- **View Account Balance** - Check current balance for all accounts
- **Deposit Money** - Add funds to any account
- **Withdraw Money** - Remove funds from accounts (with validation)
- **Transfer Money** - Send money to other accounts securely
- **View Transaction History** - Access complete transaction records

### Admin Features

- **View All Users** - Browse and search all registered users
- **Freeze Account** - Suspend account activities for security
- **Activate Account** - Restore account access after review
- **Monitor Transactions** - Track all system transactions

---

## Tech Stack

### Frontend

| Technology  | Purpose      |
| ----------- | ------------ |
| React       | UI Framework |
| TailwindCSS | Styling      |
| Vite        | Build Tool   |

### Backend

| Technology | Purpose             |
| ---------- | ------------------- |
| Node.js    | Runtime Environment |
| Express.js | Web Framework       |
| MongoDB    | Database            |
| Mongoose   | ODM                 |
| JWT        | Authentication      |
| bcrypt     | Password Hashing    |

---

## Installation

### Prerequisites

- Node.js (v20 or higher recommended)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
npm init -y
```

2. Install dependencies:

```bash
nvm install 20
nvm use 20
npm install express mongoose cors dotenv jsonwebtoken bcrypt
npm install -D typescript ts-node-dev @types/node @types/express @types/jsonwebtoken @types/bcrypt
npx tsc --init
npm install cors
npm install -D @types/cors
npx tsc --init
```

3. Configure environment variables (create .env file in backend directory):

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mini-banking
JWT_SECRET=your-secret-key
```

4. Start the backend development server:

```bash
npm run dev
```

The backend will run on http://localhost:3001

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
npm create vite@latest frontend
```

2. Install dependencies:

```bash
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend will typically run on http://localhost:5173/

### Building for Production

**Backend:**

```bash
cd backend
npm run build
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
```

---

## Implementation Details

### Architecture

The project follows a **Layered Architecture** pattern with clear separation of concerns:

```
Client Request → Controller → Service → Repository → Database
                     ↓
               Middleware (Auth)
```

### Backend Implementation

**Controllers** - Handle incoming HTTP requests and return responses

- AuthController - User registration and login
- AccountController - Account operations
- TransactionController - Money transfers, deposits, withdrawals
- AdminController - Administrative functions

**Services** - Contain business logic

- AuthService - JWT token generation, password hashing
- AccountService - Account creation, balance management
- TransactionService - Transfer logic, transaction validation
- AdminService - User management, account control

**Repositories** - Handle database operations

- UserRepository - User CRUD operations
- AccountRepository - Account data management
- TransactionRepository - Transaction persistence
- AuditLogRepository - Audit trail management

**Middleware** - Request preprocessing

- AuthMiddleware - JWT token verification
- ValidationMiddleware - Input validation

### OOP Principles Applied

1. **Encapsulation** - Private account balance with controlled deposit/withdraw methods
2. **Abstraction** - Service interfaces hide implementation details
3. **Inheritance** - Customer and Admin extend User; SavingsAccount extends Account
4. **Polymorphism** - Interest calculation varies by account type

### Design Patterns Used

1. **Factory Pattern** - AccountFactory creates different account types
2. **Repository Pattern** - Abstracts database operations from business logic
3. **Service Layer Pattern** - Separates business logic from controllers

### Database Schema

**Entities:**

- **User** - Base user information (name, email, password)
- **Account** - Banking accounts with balance and status
- **Transaction** - All money movements (deposits, withdrawals, transfers)
- **AuditLog** - System activity tracking
- **FixedDeposit** - Fixed deposit investments

**Relationships:**

- User (1) → Account (M) - One user can have multiple accounts
- Account (1) → Transaction (M) - Each account has transaction history
- Account (1) → FixedDeposit (M) - Accounts can have multiple FD investments
- Admin (1) → AuditLog (M) - All admin actions are logged

### Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Account freeze/activate functionality
- Transaction validation
- Audit logging for all operations

---

## Project Structure

```
Mini-Digital-Banking/
|
├── backend/                      # Backend API Server
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   ├── controllers/        # HTTP request handlers
│   │   │   ├── authController.ts
│   │   │   ├── accountController.ts
│   │   │   ├── transactionController.ts
│   │   │   └── adminController.ts
│   │   ├── factories/           # Factory pattern implementations
│   │   ├── interfaces/         # TypeScript interfaces
│   │   ├── middleware/         # Express middleware
│   │   │   └── authMiddleware.ts
│   │   ├── models/             # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── Account.ts
│   │   │   ├── Transaction.ts
│   │   │   └── AuditLog.ts
│   │   ├── repositories/       # Data access layer
│   │   │   ├── userRepository.ts
│   │   │   ├── accountRepository.ts
│   │   │   └── transactionRepository.ts
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Business logic layer
│   │   │   ├── authService.ts
│   │   │   ├── accountService.ts
│   │   │   └── transactionService.ts
│   │   ├── utils/              # Utility functions
│   │   ├── app.ts              # Express app configuration
│   │   └── server.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
|
├── frontend/                     # React Frontend Application
│   ├── src/
│   │   ├── assets/             # Static assets
│   │   ├── App.css             # Main app styles
│   │   ├── App.jsx             # Main app component
│   │   ├── index.css           # Global styles
│   │   └── main.jsx            # React entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
|
├── Readme.md                    # This file
├── classDiagram.md              # UML class diagram
├── ErDiagram.md                # Entity relationship diagram
├── sequenceDiagram.md          # Sequence diagram for transfers
├── useCaseDiagram.md           # Use case diagram
└── idea.md                     # Project idea and specifications
```

---

## API Endpoints

### Authentication

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | /api/auth/register | Register new user |
| POST   | /api/auth/login    | Login user        |

### Accounts

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| POST   | /api/accounts             | Create new account  |
| GET    | /api/accounts/:id         | Get account details |
| GET    | /api/accounts/:id/balance | Get account balance |

### Transactions

| Method | Endpoint                             | Description             |
| ------ | ------------------------------------ | ----------------------- |
| POST   | /api/transactions/deposit            | Deposit money           |
| POST   | /api/transactions/withdraw           | Withdraw money          |
| POST   | /api/transactions/transfer           | Transfer money          |
| GET    | /api/transactions/history/:accountId | Get transaction history |

### Admin

| Method | Endpoint                         | Description      |
| ------ | -------------------------------- | ---------------- |
| GET    | /api/admin/users                 | View all users   |
| PUT    | /api/admin/accounts/:id/freeze   | Freeze account   |
| PUT    | /api/admin/accounts/:id/activate | Activate account |

---

## Key Engineering Concepts

- **ACID-Compliant Transactions** - Ensures reliable database operations
- **Double-Entry Bookkeeping** - Every transaction has debit and credit entries
- **JWT Authentication** - Stateless secure authentication
- **Transaction Atomicity** - Operations complete fully or not at all
- **Audit Logging** - Complete trail of all system activities
- **Concurrency Handling** - Manages simultaneous transactions

---
