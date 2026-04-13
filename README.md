# RoomFinder MVP

A full-stack rental listing platform built with Express + React.

## Quick start

### 1. Server
```bash
cd server
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev
```

### 2. Seed the database
```bash
node seeds/listings.js
# Landlord: alex@roomfinder.com / password123
# Tenant:   jamie@roomfinder.com / password123
```

### 3. Client
```bash
cd client
npm install
npm run dev            # proxies /api → localhost:5000
```

Open http://localhost:5173

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | Bearer | Current user |
| GET | /api/listings | — | List with filters |
| GET | /api/listings/mine | Landlord | My listings |
| POST | /api/listings | Landlord | Create listing |
| GET | /api/listings/:id | — | Get one |
| DELETE | /api/listings/:id | Landlord | Delete own |
| POST | /api/messages | Bearer | Send inquiry |
| GET | /api/messages/inbox | Bearer | Inbox |
| GET | /api/messages/sent | Bearer | Sent |
| GET | /api/messages/unread-count | Bearer | Badge count |
| PATCH | /api/messages/:id/read | Bearer | Mark read |
