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

Users can:

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

## Environment Variables

Create `.env` file:
VITE_API_BASE_URL=https://YOUR_BACKEND_URL

Example:
VITE_API_BASE_URL=https://promises-tires-periodically-wisdom.trycloudflare.com

---

## Local Setup

Install dependencies:

npm install
Run development server:

npm run dev

---

## Build Production


---

## Build Production

npm run build

---

## Deployment

Frontend deployed using:

- Vercel

Live URL:
https://ewallet-rust.vercel.app/login


---

## How to Test

### Authentication Flow

1. Register new user
2. Login
3. Access dashboard

---

### CRUD Flow

1. Create new task
2. Edit task
3. Complete task
4. Approve task
5. Delete task

---

### Dashboard

Navigate to:
/dashboard

Displays live visualization charts.

---

### Third-party API

Wallet page → view currency conversion.

---

## Notes

- API URL configured via environment variable.
- Requires backend to be running.


