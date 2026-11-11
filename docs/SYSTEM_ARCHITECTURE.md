# System Architecture

## 1. Architecture Style
**Monorepo** with two applications:
- `client/` — React SPA (Vite), served as static assets in production.
- `server/` — Express REST API, stateless app layer, PostgreSQL via Prisma.

Communication: browser → client (static) → `fetch`/HTTP → server `/api/v1/*` → Prisma → PostgreSQL. File uploads go client → server → upload service (Cloudinary/abstracted) → stored URL persisted in DB.

## 2. High-Level Diagram (logical)
```
[Browser]
   |  HTTPS (static + API)
   v
[React SPA (Vite build)] --HTTP/JSON--> [Express API /api/v1]
                                            |           \
                                            |            -> [Upload Provider]
                                            v
                                      [Prisma Client]
                                            v
                                      [PostgreSQL]
```

## 3. Frontend Architecture (`client/src`)
| Area | Responsibility |
|---|---|
| `components/` | Reusable UI (buttons, cards, forms, nav, theme toggle, loaders, empty/error states) |
| `pages/` | Route-level views (Home, About, Projects, ProjectDetail, Skills, Experience, Education, Blog, BlogPost, Contact, Admin/*, NotFound) |
| `layouts/` | `PublicLayout`, `AdminLayout` (nav/footer/sidebar shells) |
| `hooks/` | Data fetching, theme, form helpers, auth state |
| `services/` | Centralized API client (`api.js`), endpoint modules; reads `VITE_API_URL` |
| `context/` | Theme/auth providers (minimal; avoid overuse) |
| `utils/` | Formatting, constants, guards |
| `assets/` | Static images/icons as needed |

Routing: React Router. Public routes + `/admin/*` routes; admin UI guarded client-side for UX, **authorization enforced server-side**.

## 4. Backend Architecture (`server/src`)
| Area | Responsibility |
|---|---|
| `config/` | Env loading, CORS, cookie, Prisma, upload config |
| `routes/` | Route definitions, versioning (`/api/v1`) |
| `controllers/` | HTTP handling, status codes, response shaping |
| `services/` | Business logic, Prisma access orchestration |
| `middleware/` | Auth, error handler, validation, rate limit, upload parsing |
| `validators/` | Zod schemas per endpoint |
| `utils/` | Helpers (slug, pagination, response format) |
| `prisma/` | `schema.prisma`, migrations |

Pattern: Route → validation middleware → auth/authorization middleware (admin) → controller → service → Prisma.

## 5. Authentication & Authorization
- **Admin login:** `POST /api/v1/auth/login` validates credentials (Zod), verifies password hash (bcrypt/argon2 — *recommend bcrypt for simplicity; final choice at implementation*), issues auth token in **HTTP-only, Secure (prod), SameSite** cookie.
- **Session check:** `GET /api/v1/auth/me`; `POST /api/v1/auth/logout` clears cookie.
- **Protection:** `requireAuth` + `requireAdmin` middleware on `/api/v1/admin/*` (or protected mutations). Frontend hiding is not security.
- **CSRF:** for cookie-based auth, use SameSite + origin checks; add explicit CSRF token if cross-site needs arise (documented decision).
- **Public endpoints:** read-only content, contact submission (rate-limited, validated).

## 6. Data Flow
1. Admin edits content in dashboard → validated request → API → Prisma → PostgreSQL.
2. Public page loads → API fetch (or loader) → renders content; loading/error/empty states handled.
3. Images/CV: admin uploads file → server validates type/size → upload service stores file → URL saved in DB → public site uses URL.

## 7. Configuration & Environments
- Env vars: `server/.env` (`PORT`, `NODE_ENV`, `DATABASE_URL`, `CLIENT_URL`, `AUTH_SECRET`, upload keys); `client/.env` (`VITE_API_URL` only; no secrets).
- `.env.example` committed; real `.env` gitignored.

## 8. Error Handling & Observability (baseline)
- Centralized Express error middleware: known/validation errors → 4xx; unexpected → 500 with safe message (no stack/secret leakage in production).
- Consistent API response shape (e.g., `{ success, data, error }`).
- Basic request logging in development.

## 9. Key Technical Decisions
| Decision | Rationale |
|---|---|
| REST + `/api/v1` | Simple, explicit, matches stack |
| Prisma ORM | Type-safe queries/migrations, maintainable schema |
| Zod at boundary | Consistent validation/sanitization |
| HTTP-only cookie auth | Reduces XSS token exposure vs localStorage |
| Centralized API client | Avoids duplicated URLs/error handling |
| Abstract upload service | Allows Cloudinary now, other provider later |

## 10. Significant Deviations from Part 2 Suggestion
- Part 2 suggests `client/src/context/` and `services/`; kept. Added `validators/` consideration on client only if needed (prefer server-side Zod as source of truth).
- Exact folder names may be refined during initialization; deviations will be explained in the Phase 2 report.
