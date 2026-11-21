# Deployment Guide

This document describes how to deploy the portfolio monorepo to production without hardcoding secrets or credentials.

## Current deployment status

The portfolio is deployed with a Vercel frontend, Render API, and Supabase Postgres. The API supports database-backed portfolio content and admin-managed uploads. Email delivery is not implemented.

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

### Optional environment variables
```env
VITE_API_URL=https://your-backend-url.example.com/api/v1
```

The deployed Vercel app uses same-origin `/api/v1` rewrites; do not set `VITE_API_URL` unless intentionally pointing the client at another API.

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
DATABASE_URL=<set as a private Render environment variable>
COOKIE_SECURE=true
TRUSTED_ORIGINS=https://your-frontend-url.example.com,https://www.your-frontend-url.example.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<set as a private Render environment variable>
SUPABASE_STORAGE_BUCKET=portfolio-assets
```

`npm ci --include=dev` ensures the TypeScript compiler and type packages are installed during Render builds, even when `NODE_ENV=production`. Render supplies `PORT` automatically. `CLIENT_URL` and `DATABASE_URL` are required for production startup. Session cookies are HTTP-only and use `SameSite=None; Secure` in production. Mutating requests that include a browser `Origin` must match `TRUSTED_ORIGINS`.

The Supabase URL and service-role key are required for uploads. Keep the service-role key only in Render's private environment variables; never place it in a `VITE_*` variable or commit it. Create a public Storage bucket named `portfolio-assets` (or configure a different bucket name above). Portfolio images, uploaded media, and résumé PDFs are intentionally public after upload.

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

## Seed the media gallery

The original flyers are deployed as static files in `client/public/creative-media`. After setting `DATABASE_URL` to the production Supabase URI, register them in the database with:

```bash
npm run seed:media --prefix server
```

This repeatable command adds only artworks whose image paths are not already present; it does not overwrite existing gallery entries. Keep the Supabase URI private and clear any temporary environment variable after the command completes.

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

1. Provision the database and create the public Storage bucket.
2. Set backend environment variables.
3. Push to GitHub.
4. Trigger deployment on the provider.
5. Run `npx prisma migrate deploy` from `server` to apply any pending CMS and public-copy migrations.
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

The deployment owner must configure private database and Supabase Storage credentials in the hosting provider. Never share those values in chat or commit them to the repository.
