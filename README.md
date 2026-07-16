# FullStack Intern Coding Challenge — Store Ratings Platform

A full-stack web app where users rate stores (1–5), built for the "FullStack Intern
Coding Challenge - V1.1" brief.

- **Backend**: Node.js + Express + Sequelize (PostgreSQL / MySQL / SQLite)
- **Frontend**: React (Vite) + React Router + Axios
- **Auth**: JWT, bcrypt password hashing
- **Roles**: System Administrator, Normal User, Store Owner (single login system)

## Project structure

```
project/
├── backend/          Express API
├── frontend/          React app (Vite)
└── docker-compose.yml Optional local PostgreSQL
```

## 1. Backend setup

```bash
cd backend
npm install
```
Create the database tables and the default admin account, then start the API:

```bash
npm run seed     # creates tables + a System Administrator (see .env for credentials)
npm run dev       # or: npm start
```

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

Default admin login (from `.env`, change before real use):
```
email:    admin@storeratings.com
password: Admin@1234
```

## 2. Frontend setup

```bash
cd frontend
npm install     
npm run dev
```

Open `http://localhost:5173`.

## 3. How the roles work

| Role | How the account is created | What they can do |
|---|---|---|
| **System Administrator** | Seeded by `npm run seed`, or created by another admin from **Add User** | Dashboard stats, create users/admins/store-owners, create stores, view & filter/sort users and stores |
| **Normal User** | Self-registers on `/register` | Browse/search stores, submit a rating (1–5), modify their own rating, update password |
| **Store Owner** | Created by an admin (role = "Store owner"), then a store is created and linked to them via **Add User → New store** | View their store's average rating and the list of users who rated it, update password |

Every role logs in through the same `/login` page — the UI adapts based on the
account's role.

## 4. API overview

```
POST   /api/auth/register          Public signup (role = user)
POST   /api/auth/login
PUT    /api/auth/password          Auth required
GET    /api/auth/me

GET    /api/admin/dashboard        admin only
POST   /api/admin/users            admin only — create user/admin/owner
GET    /api/admin/users            admin only — filter: name,email,address,role; sort: sortBy,order
GET    /api/admin/users/:id        admin only
POST   /api/admin/stores           admin only — create store, optional ownerId
GET    /api/admin/stores           admin only — filter/sort

GET    /api/stores                 auth required — list/search stores, includes overallRating + own rating
POST   /api/stores/:id/ratings     auth required — submit rating (1-5)
PUT    /api/stores/:id/ratings     auth required — modify own rating

GET    /api/owner/dashboard        owner only — store's raters + average rating
```

## 5. Validation rules (enforced server-side)

- **Name**: 20–60 characters
- **Address**: max 400 characters
- **Password**: 8–16 characters, at least 1 uppercase letter, 1 special character
- **Email**: standard email format

## 6. Notes

- Tables auto-sort by clicking any column header in the Users/Stores admin tables.
- A rating is unique per (user, store) — the API returns 409 if you POST twice;
  use PUT to change an existing rating (the frontend does this automatically).
- This was built and tested end-to-end against SQLite locally; switching
  `DB_DIALECT` to `postgres` or `mysql` in `.env` requires no code changes.
