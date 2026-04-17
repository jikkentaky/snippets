# Snippet Vault

A lightweight service for storing useful snippets (links, notes, commands) with tags and search.

**Stack:** Next.js (App Router) · NestJS · MongoDB (Mongoose) · TypeScript · Tailwind CSS

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
- MongoDB running locally (or an Atlas connection string)

### 1. Backend

```bash
cd backend
cp .env.example .env      # fill in the variables
npm install
npm run start:dev
```

API available at `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local   # fill in the variables
npm install
npm run dev
```

App available at `http://localhost:3000`

---

## Environment Variables

### backend/.env.example

| Variable       | Description                  | Example                                      |
|----------------|------------------------------|----------------------------------------------|
| `PORT`         | NestJS server port           | `3001`                                       |
| `MONGODB_URI`  | MongoDB connection URI       | `mongodb://localhost:27017/snippet_vault`     |

### frontend/.env.example

| Variable                | Description          | Example                      |
|-------------------------|----------------------|------------------------------|
| `NEXT_PUBLIC_API_URL`   | Backend API base URL | `http://localhost:3001`      |

---

## API Endpoints

| Method | URL                | Description                                         |
|--------|--------------------|-----------------------------------------------------|
| GET    | `/snippets`        | List snippets (supports `page`, `limit`, `q`, `tag`)|
| GET    | `/snippets/:id`    | Get snippet details                                 |
| POST   | `/snippets`        | Create a snippet                                    |
| PATCH  | `/snippets/:id`    | Update a snippet                                    |
| DELETE | `/snippets/:id`    | Delete a snippet                                    |

### Request Examples

```bash
# List with search and tag filter
GET /snippets?page=1&limit=10&q=docker&tag=devops

# Create a snippet
POST /snippets
Content-Type: application/json
{
  "title": "Docker run",
  "content": "docker run -it --rm ubuntu bash",
  "tags": ["docker", "devops"],
  "type": "command"
}

# Update
PATCH /snippets/<id>
Content-Type: application/json
{ "title": "Updated title" }

# Delete
DELETE /snippets/<id>
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

## Deployment

- **Frontend:** [Vercel](https://vercel.com) — run `vercel --prod` inside the `frontend/` folder
- **Backend:** [Railway](https://railway.app) or [Render](https://render.com) — set root directory to `backend/`
