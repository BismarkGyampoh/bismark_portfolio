# Development Roadmap

## Guiding Rules
Phased delivery, no skipped phases, no unnecessary features, maintainability/security/performance first, no fabricated personal data, and no claims of untested functionality.

## Phase 1 — Planning & Specification (current)
**Deliverables:** `PROJECT_SPECIFICATION.md`, `SYSTEM_ARCHITECTURE.md`, `DATABASE_DESIGN.md`, `API_DOCUMENTATION.md`, `DEVELOPMENT_ROADMAP.md`.  
**Exit:** owner reviews/approves architecture, schema, API, and unresolved decisions. **STOP before implementation.**

## Phase 2 — Project Initialization & Dev Environment
- Monorepo `client/` (React+Vite+Tailwind+Router+Lucide) and `server/` (Express, env, CORS, error handling, `/api/v1/health`).
- Frontend-backend health connection test page; centralized API config.
- Prisma initialized/configured (schema prep; DB connection only if credentials provided).
- Root scripts (`dev` runs both via concurrently), `.env.example` files, `.gitignore`, README.
- Verification: installs, dev servers, health endpoint, frontend↔backend test, root dev command, lint/build checks as available.  
**Exit:** Phase 2 report + approval before Phase 3.

## Phase 3 — UI/UX Design System & Public Shell
- Design tokens (colors/typography/spacing), dark/light theme, responsive nav/mobile menu, layouts, reusable components, 404, loading/error primitives.
- Implement public page shells/routes with placeholder content (no fake personal facts).  
**Exit:** responsive/accessible shell reviewed.

## Phase 4 — Database & Core Backend API
- Finalize Prisma schema/migrations (with approved DB credentials), seed placeholders only if useful.
- Implement public read endpoints, contact submission, validation, error handling, rate limiting.  
**Exit:** API tested (Postman) for implemented endpoints.

## Phase 5 — Frontend Data Integration
- Connect public pages to API, SEO metadata, project/blog detail pages, CV download behavior, form submission UX.  
**Exit:** public site functional with managed/placeholder data.

## Phase 6 — Authentication & Admin API
- Secure admin auth (hashing, HTTP-only cookie, server-side authorization), admin CRUD/upload endpoints, audit-safe error handling.  
**Exit:** protected endpoints verified; no client-only security.

## Phase 7 — Admin Dashboard UI
- Admin layout/login, stats, CRUD forms for all managed entities, image/CV upload flows, contact message management.  
**Exit:** admin workflows tested end-to-end against API.

## Phase 8 — Hardening, Testing & Documentation
- Accessibility/SEO/responsive pass, security review (validation, rate limits, CORS/cookies, uploads), performance basics, test coverage for critical paths, update docs/README.  
**Exit:** production-readiness checklist.

## Testing Strategy (cross-phase)
- **Manual/API:** Postman for endpoints; browser checks for responsive/accessibility basics.
- **Frontend:** lint; production build; component/page smoke checks; add automated tests if introduced later (justify dependency).
- **Backend:** endpoint verification, auth/authorization checks, validation/error cases.
- **Security:** verify protected routes reject unauthenticated requests; confirm no secrets in client bundle/responses.
- Never report unexecuted tests as passed.

## Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Missing DB/Cloudinary credentials | `.env.example`, clear setup steps, do not fake connectivity |
| Scope creep | Phase gates; require approval for new features/libs |
| Auth misconfiguration | Server-side middleware, secure cookie settings, rate limiting |
| File upload abuse | Type/size validation, safe storage, no executable serving |
| Fabricated content | Placeholder policy enforced in UI/docs/seeds |
| Inconsistent design/code | Shared components/layouts, naming conventions, review per phase |

## Dependencies / Owner Inputs Needed
- PostgreSQL `DATABASE_URL` (before migrations/connectivity tests).
- `AUTH_SECRET` and cookie/CORS domains (before auth deployment).
- Image/CV storage credentials (before upload testing in real provider).
- Real profile/CV/projects/links (before launch) — placeholders until provided.

## Next Action
After Phase 1 approval: execute **Phase 2** only, per [`part2.md`](./implementation-parts/part2.md), then stop for review.