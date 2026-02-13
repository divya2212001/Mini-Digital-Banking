# Mini Digital Banking Backend
## Project Overview

Mini Digital Banking Backend is a full-stack banking system that simulates core digital banking operations including account management, money transfers, transaction tracking, fixed deposits, and fraud detection.

The primary focus of this system is on backend architecture, applying OOP principles, clean code structure, and appropriate design patterns.

---


### Customer Features
- User Registration & Login (JWT Authentication)
- Create Savings Account
- View Account Balance
- Deposit Money
- Withdraw Money
- Transfer Money to another account
- View Transaction History

### Admin Features
- View all users
- Freeze or Activate accounts


## Backend Architecture

Follows layered architecture:

- Controllers → Handle HTTP requests
- Services → Business logic
- Repositories → Database operations
- Models → Entities
- Middleware → Authentication & Authorization

---

## OOP Principles Used

- Encapsulation → Private account balance, controlled updates
- Abstraction → Service interfaces
- Inheritance → Account → SavingsAccount / CurrentAccount
- Polymorphism → Interest calculation varies by account type

---

## Design Patterns Used

- Factory Pattern → Account creation
- Repository Pattern → Database abstraction
- Service Layer Pattern → Business logic separation

---

## Tech Stack

Frontend:
- React
- TailwindCSS

Backend:
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Mongoose

---

## Key Engineering Concepts

- ACID-compliant transactions
- Double-entry bookkeeping model
- Secure authentication
- Transaction atomicity
- Audit logging
- Concurrency handling
