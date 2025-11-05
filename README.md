# 💰 Financial Ledger API (Node.js + NestJS + TypeORM + PostgreSQL)

This project is a **financial transaction management API** built with **NestJS**, **TypeORM**, and **PostgreSQL**, designed to maintain financial integrity through a **double-entry ledger system**.  
It ensures every transaction is balanced and auditable through corresponding debit and credit entries.

---

## 🚀 Quick Start

Run the application using **Docker Compose**:

```bash
docker-compose up
```
Once started, the API will be available at:
👉 http://localhost:8080

## 🧩 Project Structure

The codebase follows a modular and layered architecture, organized into the following main directories:
```bash
src/
├── core/            # Core domain logic and reusable entities (e.g., Users, Accounts)
├── modules/         # Business modules (e.g., Transactions, Ledger Entries)
├── shared/          # Shared utilities, services, guards, and base classes
```
## 🧱 Entity Overview
User
- Represents a system user.
- Each user can have multiple accounts and transactions.

Account
- Represents a currency-specific account owned by a user.
- Each account maintains a current balance.
- Linked to multiple ledger entries for audit purposes.

Transaction
- Represents a high-level operation (either transfer or exchange).
- Each transaction generates corresponding ledger entries to ensure double-entry integrity.

LedgerEntry
- Core part of the double-entry bookkeeping system.
- Records the individual debit and credit sides of transactions.
- Each entry is associated with both an account and a transaction.

## 🛠️ Tech Stack

- Backend Framework: NestJS
- Database ORM: TypeORM
- Database: PostgreSQL
- Containerization: Docker
- Package Manager: pnpm