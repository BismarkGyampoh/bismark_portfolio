# Database Design (PostgreSQL + Prisma)

## 1. Goals
Normalized, maintainable schema supporting public portfolio content and admin-managed CRUD. Uses primary/foreign keys, unique constraints, indexes, and timestamps. Avoids unnecessary duplication.

## 2. Entities & Relationships
| Entity | Purpose | Key Relationships |
|---|---|---|
| `AdminUser` | Admin account(s) | standalone |
| `Profile` | Owner bio/hero/contact summary/CV link | singleton-ish (one active row) |
| `Project` | Portfolio projects | belongs to `ProjectCategory` (optional); many-to-many `Technology`; has images/links |
| `ProjectCategory` | Project grouping | has many `Project` |
| `Technology` | Tech/tool tag | many-to-many `Project` (join table) |
| `SkillCategory` | Skill grouping | has many `Skill` |
| `Skill` | Skill entry + level/order | belongs to `SkillCategory` |
| `Education` | Education records | standalone (ordered) |
| `Experience` | Work/leadership/volunteer | standalone (ordered) |
| `BlogCategory` | Blog grouping | has many `BlogPost` |
| `BlogPost` | Articles | belongs to `BlogCategory` (optional); slug unique; published flag/date |
| `ContactMessage` | Contact form submissions | standalone; read/archived status |
| `SocialLink` | Profile/social URLs | standalone (ordered) |
| `SiteSetting` | Key/value or structured settings | unique `key` |

## 3. Proposed Prisma Models (conceptual)
> Final field types/nullability refined at implementation. All models include `id` (cuid/uuid), `createdAt`, `updatedAt` unless noted.

- **AdminUser**: `email` (unique), `passwordHash`, `name?`, `lastLoginAt?`.
- **Profile**: `fullName`, `headline`, `bioShort?`, `bioLong?`, `location?`, `emailPublic?`, `phonePublic?`, `avatarUrl?`, `cvUrl?`, `cvFilename?`, `heroTitle?`, `heroSubtitle?`.
- **ProjectCategory**: `name` (unique), `slug` (unique), `order`.
- **Technology**: `name` (unique), `slug` (unique), `iconKey?`.
- **Project**: `title`, `slug` (unique), `summary`, `problem?`, `objectives?`, `contribution?`, `process?`, `results?`, `imageUrl?`, `repoUrl?`, `liveUrl?`, `featured` (bool), `published` (bool), `order`, `categoryId?` FK. Join: `ProjectTechnology(projectId, technologyId)`.
- **SkillCategory**: `name` (unique), `slug` (unique), `order`.
- **Skill**: `name`, `level?` (int 0–100 or enum), `order`, `categoryId` FK, `visible` (bool).
- **Education**: `institution`, `programme`, `location?`, `startDate?`, `endDate?`, `current` (bool), `description?`, `achievements?`, `order`.
- **Experience**: `role`, `organization`, `location?`, `type?` (internship/work/volunteer/leadership), `startDate?`, `endDate?`, `current` (bool), `description?`, `responsibilities?`, `order`.
- **BlogCategory**: `name` (unique), `slug` (unique).
- **BlogPost**: `title`, `slug` (unique), `excerpt?`, `content` (Markdown/text), `coverImageUrl?`, `published` (bool), `publishedAt?`, `categoryId?` FK, `seoTitle?`, `seoDescription?`.
- **ContactMessage**: `name`, `email`, `subject?`, `message`, `status` (new/read/archived), `ipHash?` (optional, privacy-aware).
- **SocialLink**: `platform`, `label`, `url`, `iconKey?`, `order`, `visible` (bool).
- **SiteSetting**: `key` (unique), `value` (text/json), `description?`.

## 4. Indexes (initial)
- Unique: emails, slugs, setting keys, category/technology names as appropriate.
- Query indexes: `Project(published, featured, order)`, `Project(slug)`, `BlogPost(published, publishedAt)`, `BlogPost(slug)`, `ContactMessage(status, createdAt)`, ordered lists by `order`.

## 5. Integrity & Constraints
- FKs with appropriate `onDelete` (`Restrict`/`SetNull` for categories; cascade only for explicit join rows).
- Required fields enforced by Prisma + Zod.
- No fabricated seed content; seed script (later, if added) uses placeholders only.

## 6. Migrations & Safety
- Prisma Migrate for schema changes; no destructive operations without approval.
- `DATABASE_URL` via env; credentials never hardcoded.
- Connection not assumed/tested in Phase 2 unless credentials provided and explicitly run.

## 7. Open Points
- `Skill.level` representation (percentage vs. label) — confirm at UI phase.
- Whether `Profile` enforces single row via app logic or DB constraint — recommend app-level upsert.
- Soft-delete vs. hard-delete for admin entities — recommend hard-delete with confirmation initially; revisit if needed.
