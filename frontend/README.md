FRONTEND
# EarnIt Frontend (React + Vite)

## Overview

EarnIt frontend is a React application providing UI for:

- User authentication
- Task management (CRUD)
- Wallet system
- Dashboard visualization
- Currency conversion

---

## Tech Stack

- React
- Vite
- Axios
- TailwindCSS
- Chart.js (data visualization)
- JWT Authentication

---

## Features

### Full CRUD UI

Users (Parent) can:

- Create child account **(Parents must remember and store the child_id generated when creating child account. Otherwise, parent won't be able to create tasks)**
- Create tasks
- View tasks
- Update tasks
- Delete tasks

---

### Dashboard Visualization

Displays:

- Total tasks
- Pending tasks
- Approved tasks
- Wallet balance
- Credit vs Debit charts

Dashboard automatically updates based on backend data.

---

### Third-party API Integration

Wallet page shows currency conversion using external API via backend.

---

## Local Setup

Install dependencies:

npm install
Run development server:

npm run dev

---


## Build Production

npm run build

---

## Deployment

Frontend deployed using:
- Vercel
  
---

## How to Test

### Authentication Flow

1. Register new user
2. Login
3. Access dashboard

---

### CRUD Flow
1. Create child account
2. Top up wallet
3. Create new task 
4. Edit task
5. Child login with email and password
6. Child complete task
7. Parent login
8. Parent approve task
9. Delete task

---

### Dashboard

Navigate to:
/dashboard

Displays live visualization charts.

---

### Third-party API

Wallet page → view currency conversion.


