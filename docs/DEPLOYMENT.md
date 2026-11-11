# Deployment Guide

This document describes how to deploy the portfolio monorepo to production without hardcoding secrets or credentials.

## Current deployment status

No hosting provider or production database has been provisioned and no public deployment has been tested. The workspace has no Git remote and the source files are untracked. Production launch also requires real portfolio content and owner authorization for the selected hosting, database, and storage accounts. File uploads, cloud storage, and email delivery are not implemented.

## Recommended architecture

- Frontend: Vercel
- Backend: Render or Railway
- Database: Neon or Supabase Postgres
- Media storage: Cloudinary or Supabase Storage
- Git hosting: GitHub

This architecture matches the project structure and keeps deployment simple to maintain.

## Production checklist

1. Create a GitHub repository and push the code.
2. Provision a PostgreSQL instance on the selected provider.
3. Configure a secure admin password and initial admin account.
4. Set environment variables on the selected hosting services.
5. Deploy the backend first and confirm the health endpoint.
6. Deploy the frontend and set the production API URL.
7. Validate admin login, CRUD operations, and public page loads.
8. Add a custom domain and HTTPS.

## Frontend hosting (Vercel)

### Recommended config
- Framework: Vite
- Build command: `npm install --prefix client && npm run build --prefix client`
- Output directory: `client/dist`
- Root directory: `.` if deploying monorepo root, or `client` if configured as a separate project

### Required environment variables
```env
VITE_API_URL=https://your-backend-url.example.com/api/v1
```

### SPA routing
Use the following rewrite rule if needed:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Backend hosting (Render)

### Recommended config
- Runtime: Node
- Root directory: `server`
- Build command:
```bash
npm ci --include=dev && npx prisma generate && npm run build
```
- Start command:
```bash
npm run start
```

### Required environment variables
```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.example.com
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/portfolio_db?schema=public"
COOKIE_SECURE=true
TRUSTED_ORIGINS=https://your-frontend-url.example.com,https://www.your-frontend-url.example.com
```

`npm ci --include=dev` ensures the TypeScript compiler and type packages are installed during Render builds, even when `NODE_ENV=production`. Render supplies `PORT` automatically. `CLIENT_URL` and `DATABASE_URL` are required for production startup. Session cookies are HTTP-only and use `SameSite=None; Secure` in production. Mutating requests that include a browser `Origin` must match `TRUSTED_ORIGINS`.

## Database setup

Create Postgres on the provider, then run:

```bash
cd server
npx prisma generate
npx prisma migrate deploy
```

Do not run destructive commands against an existing production database. Only apply migrations to approved environments.

## Initial admin account

Create the first administrator using the one-time local bootstrap script. Supply `ADMIN_EMAIL` and `ADMIN_PASSWORD` through a secure local environment or an untracked `server/.env` file and run:

```bash
npm run setup:admin --prefix server
```

Important:
- Never commit a default public password.
- Never log a password in a terminal or CI log.
- Use a unique password generated outside the repository.
- The script refuses to create a duplicate account for the same email.

## Health checks

The backend should expose:

```text
GET /api/v1/health
```

This should return a JSON success payload with a healthy application status.

## Security notes

- Use HTTPS on both frontend and backend.
- Use `httpOnly`, `secure` cookies in production.
- Restrict `TRUSTED_ORIGINS` to the actual frontend domains.
- Keep database credentials in managed environment variables only.
- Prevent public exposure of admin routes.
- Keep rate limiting enabled for login endpoints.

## Deployment sequence

1. Provision database and storage.
2. Set backend environment variables.
3. Push to GitHub.
4. Trigger deployment on the provider.
5. Run Prisma migrations.
6. Verify health endpoint and admin login.
7. Deploy frontend with production `VITE_API_URL`.
8. Run smoke tests for public pages and admin dashboard.

## Rollback

Rollback is best handled by redeploying the previous working Git commit or the last known-good deployment from the hosting dashboard.

## Maintenance

- Apply dependency updates and security patches regularly.
- Keep automated backups enabled on the managed database provider.
- Monitor logs and uptime checks after launch.

## Final note

This project is prepared for deployment but the actual live deployment still requires explicit provider credentials, domain approval, and security-sensitive setup from the project owner.
