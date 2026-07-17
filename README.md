# Store Ratings Platform

This is my submission for the FullStack Intern Coding Challenge (V1.1). It's a web app where users can rate stores from 1 to 5, with three types of accounts — admin, normal user, and store owner — all sharing one login system.

Stack I went with:
- Backend: Node.js + Express, Sequelize as the ORM (works with Postgres, MySQL, or SQLite)
- Frontend: React with Vite, React Router for navigation, Axios for API calls
- Auth: JWT tokens + bcrypt for hashing passwords

## Folder structure

```
project/
├── backend/            Express API
├── frontend/            React app
└── docker-compose.yml   spins up a local Postgres if you want one
```

## Getting the backend running

```bash
cd backend
npm install
```

Then create the tables and a default admin, and start the server:

```bash
npm run seed
npm run dev
```

Server runs on port 5000. You can hit `GET /api/health` to check it's alive.

The seed script creates an admin account for you:
```
email:    admin@storeratings.com
password: Admin@1234
```
(change this before actually deploying anywhere, obviously)

## Getting the frontend running

```bash
cd frontend
npm install
npm run dev
```

Then just open `http://localhost:5173` in the browser.

## How the three roles work

**Admin** — this is the account that gets seeded first. From here you can see overall stats (total users, stores, ratings), add new users or admins, create stores, and browse/filter through everything.

**Normal user** — anyone can sign up for this themselves through the register page. Once logged in they can search stores, rate them 1-5, and change their rating later if they want.

**Store owner** — these accounts have to be created by an admin (there's a role dropdown when adding a user). After the account exists, the admin also needs to create a store and assign it to that owner. Once that's done, the owner can log in and see their store's average rating plus who rated it.

Everyone logs in from the same page, the app just shows different things depending on the role.

## API routes, roughly

```
POST   /api/auth/register        anyone can sign up (becomes a normal user)
POST   /api/auth/login
PUT    /api/auth/password        change your own password
GET    /api/auth/me

GET    /api/admin/dashboard      admin only
POST   /api/admin/users          admin only, create user/admin/owner
GET    /api/admin/users          admin only, supports filters + sorting
GET    /api/admin/users/:id      admin only
POST   /api/admin/stores         admin only, create a store (can assign an owner)
GET    /api/admin/stores         admin only, filters + sorting

GET    /api/stores               logged in users — list/search stores
POST   /api/stores/:id/ratings   submit a rating
PUT    /api/stores/:id/ratings   change your existing rating

GET    /api/owner/dashboard      owner only — their store's raters + avg rating
```

## Validation

These are enforced on the backend (not just the frontend), per the challenge doc:
- Name: 20-60 characters
- Address: up to 400 characters
- Password: 8-16 chars, needs at least one uppercase letter and one special character
- Email: has to be a valid email obviously

## A few things worth knowing

- You can click on any column header in the users/stores tables in the admin panel to sort by it.
- A user can only rate a given store once — trying to POST a second rating gives a 409, you're supposed to PUT to update it instead (frontend already handles this automatically).
- I built and tested this locally against SQLite since it's easier to spin up without installing Postgres. Switching `DB_DIALECT` to `postgres` or `mysql` in `.env` doesn't require touching any code — the docker-compose file spins up a Postgres instance if you want to test that path too.