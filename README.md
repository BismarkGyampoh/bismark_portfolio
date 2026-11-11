# Professional Portfolio Monorepo

This portfolio project is structured as a Vite React frontend and an Express + TypeScript backend, with Prisma prepared for PostgreSQL and a secured admin workflow.

## Current status

Local verification currently confirms:
- Frontend production build and backend TypeScript build pass.
- The local PostgreSQL connection is available and the initial Prisma migration is up to date.
- The health endpoint responds; unauthenticated admin endpoints reject requests.
- Public project/blog reads exclude drafts, and invalid contact submissions are rejected.

Administrator login, authenticated CRUD flows, uploads, email delivery, and production hosting have not been end-to-end verified. Portfolio content is still placeholder data.

This project is not yet deployed to a public host because no hosting credentials or approved production domain were provided. The repository is prepared for deployment, but services must be provisioned explicitly and securely by the project owner.

## Stack
- Frontend: React + Vite
- Backend: Express + TypeScript
- Database: PostgreSQL + Prisma
- Auth: secure cookie-based admin sessions with server-side authorization
- Hosting recommendation: Vercel (frontend), Render or Railway (backend), Neon/Supabase Postgres (database), Cloudinary or Supabase Storage (media)

## Repository layout

```text
client/                    React/Vite application and public assets
server/                    Express API, Prisma schema, migrations, and scripts
assets/source/             Original profile and creative-media source files
docs/                      Project, API, database, deployment, and design docs
docs/implementation-parts/ Phased implementation instructions
docs/reference/            Source profile and database notes
.github/                   CI workflows
.kilo/                     Repository agent customizations
```

The files under `assets/source/` are originals/reference copies. Publicly served images and the résumé live in `client/public/`.

Key references:
- [Deployment guide](./docs/DEPLOYMENT.md)
- [API documentation](./docs/API_DOCUMENTATION.md)
- [Development roadmap](./docs/DEVELOPMENT_ROADMAP.md)

## Local setup

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Then copy example env files:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Frontend example values:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Backend example values:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/portfolio_db?schema=public"
COOKIE_SECURE=false
TRUSTED_ORIGINS=http://localhost:5173
```

For production, set `NODE_ENV=production`, `CLIENT_URL` to the frontend origin, `DATABASE_URL` to the managed PostgreSQL URL, `COOKIE_SECURE=true`, and `TRUSTED_ORIGINS` to the exact allowed browser origins. The API requires `CLIENT_URL` and `DATABASE_URL` in production.

The session token is cryptographically random and only its Argon2id hash is stored; no signing secret is required.

## Local development

```bash
npm run dev
```

Useful commands:

```bash
npm run dev:server
npm run dev:client
npm run build --prefix server
npm run build --prefix client
```

Health check:

```bash
curl http://localhost:5000/api/v1/health
```

## Production deployment recommendation

Recommended architecture for this project:
- Frontend: Vercel (best fit for a Vite React app with easy SSL and preview deployments)
- Backend: Render or Railway (strong support for Node/Express + SSL and env management)
- Database: Neon or Supabase Postgres (managed PostgreSQL with reliable migration workflows)
- Media storage: Cloudinary or Supabase Storage
- Git hosting: GitHub

This recommendation balances reliability, cost, developer ergonomics, and maintainability. It avoids overcommitting to the cheapest free tier and instead prefers stable managed services with clear production support.

## Production requirements

Before launch, supply production environment values for:
- `DATABASE_URL`
- `CLIENT_URL`
- `COOKIE_SECURE=true`
- `TRUSTED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com`
- production `VITE_API_URL`

Do not commit `.env` files or production secrets to GitHub.

## Deployment automation included

The repository now includes:
- `render.yaml` for a Render deployment blueprint
- `.github/workflows/ci.yml` for automated build verification
- `client/vercel.json` for SPA routing fallback on static hosting
- `docs/DEPLOYMENT.md` as the operational deployment guide

These files prepare the project for CI/CD and production deployment automation without requiring paid services or secrets to be hardcoded into source control.

## Deployment guide

See the project deployment guide in [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

## Known limitation

No actual public deployment was performed in this environment because that requires provider credentials, account setup, and explicit approval to provision paid or external resources.

Real portfolio content, a CV, external media storage, email delivery, a GitHub remote, and production hosting credentials still need to be supplied or authorized. Automated test scripts are not yet present. The client lint command currently cannot load Oxlint's Windows native binding.
