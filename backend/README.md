# EarnIt Backend (FastAPI)

## Overview

EarnIt is a full-stack web application where parents assign tasks to their kid/s and pays them after they completes the tasks.

Parents can:

- Create and manage tasks
- Approve completed tasks
- Manage wallet balance 

Children can:

- View assigned tasks
- Mark tasks as completed
- Earn rewards via wallet credits

This backend provides REST APIs supporting:

- Authentication (JWT)
- Full CRUD task management
- Wallet & transactions
- Dashboard reporting
- Third-party API integration (currency conversion)

---

## Tech Stack

- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic (migrations)
- JWT Authentication
- External Currency API
- Vercel - Frontend deployment
- Render - Backend deployment

---

## Features

### Full CRUD APIs

- Create Task
- View Tasks
- Update Task
- Delete Task

### Wallet System

- Parent wallet top-up
- Transaction tracking
- Automatic transfer on task approval

### Dashboard Reporting

Provides:

- Total tasks
- Pending tasks
- Approved tasks
- Wallet balance
- Credit/Debit summaries

### Third-party API Integration

Currency conversion using external exchange rate API.

---

## Project Structure

app/
api/
models/
schemas/
services/
core/
alembic/
main.py
requirements.txt

---

## Environment Variables

Create `.env` file:
DATABASE_URL=
SECRET_KEY=
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CURRENCY_API=

---

## Local Setup

Clone repository:

git clone <repo>
cd backend

Create virtual environment:

python -m venv venv
source venv/bin/activate


Install dependencies:
pip install -r requirements.txt


Run migrations:
alembic upgrade head


Start server:
uvicorn app.main:app --reload


---

## API Documentation

Swagger UI:
http://localhost:8000/docs


---

## Deployment

Backend deployed on:

- Render
- 
---

## How to Test

### Authentication

1. Register user
2. Login
3. Use JWT token for requests
4. Register Child account

---

### CRUD Flow

1. Create task
2. Update task
3. Complete task (child)
4. Approve task (parent)
5. Delete task

---

### Dashboard

GET: 
/dashboard/summary

Returns live metrics reflecting database changes.

---

### Third-party API

GET:
/wallet/convert?currency=USD

Returns converted wallet balance.

---

## Notes

- JWT authentication required for protected routes.



