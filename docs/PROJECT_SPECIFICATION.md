# Project Specification — Professional Portfolio Website

## 1. Project Overview
A production-ready, full-stack personal portfolio website for an Information Systems and Technology professional. It presents professional identity, background, education, skills, projects, experience, blog content, and contact information. A secure admin dashboard enables content management without source-code edits.

**Status:** Planning (Phase 1). No application code implemented.

## 2. Goals
- Communicate professionalism, technical competence, credibility, and attention to detail.
- Provide a responsive, accessible, SEO-friendly public site.
- Provide a protected admin interface for CRUD/content management.
- Use a maintainable monorepo with clear frontend/backend separation.
- Follow security best practices and avoid fabricated personal data.

## 3. In-Scope (Public Site)
| Area | Requirements |
|---|---|
| Pages/sections | Home, About, Projects list, Project details, Skills, Experience, Education, Blog list, Blog article, Contact, 404 |
| Features | Responsive nav + mobile menu, dark/light theme, restrained animations, loading/error states, SEO titles/metadata, accessible forms/navigation, downloadable CV |
| Data source | All dynamic content served via backend REST API |

## 4. In-Scope (Admin Dashboard)
Protected interface for: login/logout, dashboard stats, projects (CRUD, featured, categories, technologies, images), skills/skill categories, education, experience, blog posts/categories (draft/publish), contact messages, CV upload/replace, profile info, social links, selected site settings. Admin endpoints require server-side authentication/authorization.

## 5. Technology Stack (Approved)
| Layer | Technology |
|---|---|
| Frontend | React.js, Vite, JavaScript (ES6+), Tailwind CSS, React Router, Lucide React |
| Backend | Node.js, Express.js, REST API (`/api/v1`) |
| Database | PostgreSQL, Prisma ORM |
| Validation/Auth | Zod, password hashing, HTTP-only cookies (session/JWT approach defined in architecture) |
| Tooling/Services | Git/GitHub, Postman, image storage (Cloudinary or equivalent) |

No additional frameworks/libraries without documented justification.

## 6. Non-Functional Requirements
- **Security:** hashed passwords, protected admin routes (server-side), input validation/sanitization, rate limiting (auth/contact), secure cookies, CORS, safe file uploads, no hardcoded secrets, safe error responses.
- **Maintainability:** consistent naming, reusable components/modules, centralized API/config, environment variables.
- **Performance:** optimized images, reasonable bundle, loading states, indexed DB queries where appropriate.
- **Accessibility:** semantic HTML, labels, keyboard/focus support, contrast-aware theming.
- **Responsiveness:** desktop/tablet/mobile parity.

## 7. Content Rules
Do **not** invent personal data (education, experience, certifications, achievements, projects, testimonials, employment). Use clearly identified placeholders (e.g., `[Your Name]`, `[UMaT — Programme]`, `[Project Title Placeholder]`) and make content editable via admin/API/seed data later.

## 8. Assumptions
- Single administrator account initially (extensible later).
- PostgreSQL instance and credentials will be provided by the project owner before DB migration/testing.
- Image/CV storage provider credentials provided later; local/dev fallback documented if needed.
- Deployment target not specified (Vercel/Netlify frontend, hosted Node/Postgres backend are viable); deployment is out of scope for Phase 2.

## 9. Constraints
- Work in defined phases; do not implement full app in one operation.
- Do not claim features work unless implemented and tested.
- No destructive DB operations without explicit approval.

## 10. Phase 1 Deliverables (this phase)
- `PROJECT_SPECIFICATION.md` (this document)
- `SYSTEM_ARCHITECTURE.md`
- `DATABASE_DESIGN.md`
- `API_DOCUMENTATION.md`
- `DEVELOPMENT_ROADMAP.md`

## 11. Unresolved Decisions Requiring Approval
1. **Admin auth mechanism:** HTTP-only cookie with signed JWT vs. server-side session store. *Recommendation:* signed JWT in HTTP-only cookie + CSRF mitigation for state-changing requests (simple, stateless; acceptable for single-admin). Approve or prefer sessions.
2. **Image/CV storage:** Cloudinary (managed) vs. local uploads in dev + S3-compatible later. *Recommendation:* Cloudinary for production; abstract upload service so provider can change.
3. **Blog rendering format:** Markdown stored in DB vs. rich text/HTML. *Recommendation:* Markdown (safer, portable) rendered on frontend with sanitization.
4. **Monorepo tooling:** plain npm workspaces vs. add `concurrently` only at root. *Recommendation:* root scripts + `concurrently` (minimal; no extra monorepo framework).
5. **Personal positioning/content seed:** broad IS&T vs. IT Manager/BA/BI focus; owner’s real name/bio/links/CV to replace placeholders. *Requires owner input before public launch.*
