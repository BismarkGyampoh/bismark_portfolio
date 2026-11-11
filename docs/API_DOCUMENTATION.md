# API Documentation

Base URL: `/api/v1` (configurable). JSON request/response. Protected admin endpoints require server-side auth (HTTP-only cookie). Validation uses Zod.

This document includes both implemented routes and planned architecture. The implemented subset and known gaps are identified below; planned routes must not be assumed available.

## 1. Response/Error Shape (planned)
```json
{ "success": true, "data": { } }
{ "success": false, "error": { "message": "...", "code": "..." , "details": [] } }
```

## 2. Health (Phase 2)
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | no | Backend status check |

## 3. Auth
| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/auth/login` | no | Admin login, sets auth cookie |
| POST | `/auth/logout` | admin | Clear auth cookie |
| GET | `/auth/me` | admin | Current admin/profile session |
| PUT | `/auth/password` | admin | Change password after verifying the current password; revokes active sessions |
| POST | `/auth/refresh` | admin cookie | Rotate session cookie; token is not returned in JSON |

## 4. Public Content (read)
| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/profile` | no | Public profile/hero/about data |
| PUT | `/profile` | admin | Update public profile content |
| GET | `/projects` | no | Published projects |
| GET | `/projects/admin` | admin | All projects, including drafts |
| GET | `/projects/categories` | no | Project categories |
| GET | `/projects/featured` | no | Featured projects |
| GET | `/projects/category/:slug` | no | Published projects by category |
| POST | `/projects/categories` | admin | Create project category |
| POST | `/projects` | admin | Create project |
| PUT | `/projects/:slug` | admin | Update project |
| DELETE | `/projects/:slug` | admin | Delete project |
| GET | `/projects/:slug` | no | Published project details |
| GET | `/media` | no | Published portfolio artwork |
| GET | `/media/admin` | admin | All artwork, including unpublished items |
| POST | `/media` | admin | Create artwork as multipart form data; accepts `title`, `altText`, optional `imageUrl`, optional `file`, `displayOrder`, and `published` |
| PUT | `/media/:id` | admin | Update artwork; accepts the same multipart fields, with an optional replacement `file` |
| DELETE | `/media/:id` | admin | Delete artwork from the gallery |
| GET | `/uploads/media/:filename` | no | Serve uploaded artwork image |
| GET | `/skills` | no | Skills |
| GET | `/skills/categories` | no | Skill categories |
| POST | `/skills/categories` | admin | Create skill category |
| POST | `/skills` | admin | Create skill |
| PUT | `/skills/:id` | admin | Update skill |
| DELETE | `/skills/:id` | admin | Delete skill |
| GET | `/education` | no | Education records |
| POST | `/education` | admin | Create education record |
| PUT | `/education/:id` | admin | Update education record |
| DELETE | `/education/:id` | admin | Delete education record |
| GET | `/experience` | no | Experience records |
| POST | `/experience` | admin | Create experience record |
| PUT | `/experience/:id` | admin | Update experience record |
| DELETE | `/experience/:id` | admin | Delete experience record |
| GET | `/blog/categories` | no | Blog categories |
| POST | `/blog/categories` | admin | Create blog category |
| GET | `/blog` | no | Published posts |
| GET | `/blog/admin` | admin | All posts, including drafts |
| GET | `/blog/published` | no | Published posts with publication dates |
| GET | `/blog/category/:slug` | no | Published posts by category |
| POST | `/blog` | admin | Create blog post |
| PUT | `/blog/:slug` | admin | Update blog post |
| DELETE | `/blog/:slug` | admin | Delete blog post |
| GET | `/blog/:slug` | no | Published post |

## 5. Contact
| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/contact/message` | no (5 per 15 minutes) | Submit a Zod-validated contact message |

## 6. Admin — Dashboard/Content
Admin content endpoints use their resource paths (for example, `PUT /profile` and `POST /projects`) and require authentication and the `ADMIN` role. Artwork image URLs may be site-relative paths or HTTP(S) URLs; artwork file uploads accept JPG, PNG, or WebP images up to 10 MB.
| Method | Path | Purpose |
|---|---|---|
| GET | `/admin/stats` | Counts/summaries |
| GET/PATCH/DELETE | `/admin/contact-messages` | Manage messages |
| CRUD | `/admin/settings` | Site settings |

## 7. Uploads (admin)
| Method | Path | Purpose |
|---|---|---|
| POST | `/media` (multipart) | Create artwork with an optional uploaded image; returns artwork including its image URL |
| PUT | `/media/:id` (multipart) | Update artwork and optionally replace its uploaded image |

Validation: uploads are limited to JPG, PNG, or WebP, capped at 10 MB, and checked against file signatures. Generated filenames are used and uploaded artwork is served from `/uploads/media/`.

## 8. Security Controls
- Server-side auth/authorization on all `/admin/*` and protected mutations.
- Zod validation/sanitization; reject unknown/invalid input.
- Rate limiting on `/auth/login` and `/contact`.
- CORS and mutating-request Origin checks restricted to `TRUSTED_ORIGINS` (default: `CLIENT_URL`).
- Secure cookies (`HttpOnly`, `SameSite`, `Secure` in production).
- No secrets/credentials in responses or frontend.

## 9. Pagination/Filtering (planned)
List endpoints support `page`, `limit` (bounded), and relevant filters; admin lists may include unpublished/drafts.

## 10. Implementation Notes
- Implemented now: health, auth login/logout/me/refresh/password change, profile read/update, project/media/skill/experience/education/blog CRUD, dashboard statistics, contact submission, and admin message read/list routes.
- Not implemented: project/blog/profile file uploads, email notifications, blog search/pagination, and admin contact-message update/delete routes.
- Local smoke tests are documented in the task report; a Postman collection and automated API test suite are not present.
