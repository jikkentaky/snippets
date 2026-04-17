# Snippet Vault

A lightweight service for storing useful snippets (links, notes, commands) with tags, full-text search, and pagination.

**Stack:** Next.js 16 (App Router) · NestJS 11 · MongoDB (Mongoose) · TypeScript · Tailwind CSS 4

---

## Repository Structure

```
snippet_vault/
├── backend/    # NestJS API (port 3001)
└── frontend/   # Next.js App (port 3000)
```

---

## Running Locally

### Prerequisites

- Node.js >= 18
- MongoDB running locally **or** a MongoDB Atlas connection string

### 1. Backend

```bash
cd backend
cp .env.example .env      # fill in MONGODB_URI and PORT
npm install
npm run start:dev
```

API available at `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL
npm install
npm run dev
```

App available at `http://localhost:3000`

---

## Environment Variables

### `backend/.env.example`

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/snippet_vault
```

### `frontend/.env.example`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## API Endpoints

| Method | URL             | Description                                          |
|--------|-----------------|------------------------------------------------------|
| GET    | `/snippets`     | List snippets (`page`, `limit`, `q`, `tag` params)  |
| GET    | `/snippets/:id` | Get snippet by id                                    |
| POST   | `/snippets`     | Create a snippet                                     |
| PATCH  | `/snippets/:id` | Update a snippet (partial)                           |
| DELETE | `/snippets/:id` | Delete a snippet → 204 No Content                   |

### Query params for `GET /snippets`

| Param   | Type   | Description                        |
|---------|--------|------------------------------------|
| `page`  | number | Page number (default: 1)           |
| `limit` | number | Items per page (default: 10)       |
| `q`     | string | Full-text search on title/content  |
| `tag`   | string | Filter by exact tag                |

### Request examples

```bash
# Create
curl -X POST http://localhost:3001/snippets \
  -H "Content-Type: application/json" \
  -d '{"title":"Docker run","content":"docker run -it --rm ubuntu bash","tags":["docker"],"type":"command"}'

# List with search + filter
curl "http://localhost:3001/snippets?q=docker&tag=devops&page=1&limit=10"

# Update
curl -X PATCH http://localhost:3001/snippets/<id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title"}'

# Delete
curl -X DELETE http://localhost:3001/snippets/<id>
```

---

## Production Build

### Backend

```bash
cd backend
npm run build
node dist/main.js
```

### Frontend

```bash
cd frontend
npm run build
npm run start
```

---

## Live Demo

**Frontend:** [https://snippets-grza-1ic89p3e5-antonliadas-projects.vercel.app](https://snippets-grza-1ic89p3e5-antonliadas-projects.vercel.app)

---

## Deployment

Both services are deployed on **Vercel** as separate projects:

| Service | Role | Root directory |
|---------|------|----------------|
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Database (free M0 tier) | — |
| Vercel project #1 | NestJS backend (serverless) | `backend` |
| Vercel project #2 | Next.js frontend | `frontend` |

**Backend Vercel project:**
- Root directory: `backend`
- Build Command: *(disabled)*
- Install Command: `npm install`
- Env: `MONGODB_URI=mongodb+srv://...`

**Frontend Vercel project:**
- Root directory: `frontend`
- Env: `NEXT_PUBLIC_API_URL=https://<your-backend>.vercel.app`
