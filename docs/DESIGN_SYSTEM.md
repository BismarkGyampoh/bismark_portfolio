# Design System — Modern Editorial (Light-First)

This document defines the visual direction for the public portfolio. **Visual design system** — follows existing architecture; no unnecessary rebuild.

## 1. Design Direction
- **Modern Editorial**: carefully designed professional portfolio (not a generic template)
- **Light-first**: white/off-white backgrounds dominate; dark mode optional (default light)
- Strong, sophisticated typography; large distinctive headings
- Generous whitespace; carefully structured content layouts
- Subtle blue accents; refined borders and shadows
- Sophisticated project presentation; smooth but restrained animations
- Consistent spacing/alignment; excellent desktop and mobile experiences

**Avoid:** excessive gradients, unnecessary glassmorphism, excessive rounded cards, oversized decorative icons, too many animations, dark backgrounds dominating, generic dashboard layouts on public pages.

## 2. Color Tokens
| Token | Light (default) | Dark (optional) | Usage |
|---|---|---|---|
| `--bg-primary` | `#FFFFFF` | `#0F1026` | Page background |
| `--bg-secondary` | `#F8FAFC` | `#15182C` | Secondary surfaces |
| `--bg-section` | `#F1F5F9` | `#1C2038` | Section/callout surfaces |
| `--text-primary` | `#172033` | `#E5E7EB` | Primary text/headings |
| `--text-secondary` | `#64748B` | `#9CA3AF` | Secondary text/meta |
| `--accent-primary` | `#2563EB` | `#3B82F6` | Primary actions/links |
| `--accent-soft` | `#DBEAFE` | `#1E3A8A` | Soft accent backgrounds |
| `--border-color` | `#E2E8F0` | `#2A2F4A` | Borders/dividers |
| `--shadow-subtle` | `0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.02)` | `0 1px 2px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.25)` | Cards |
| `--shadow-elevated` | `0 10px 30px -10px rgba(37,99,235,0.12), 0 2px 10px rgba(15,23,42,0.04)` | `0 10px 40px -10px rgba(59,130,246,0.25), 0 4px 20px rgba(0,0,0,0.4)` | Elevated surfaces |

## 3. Typography
- System stack for performance; maintain strong editorial hierarchy (display H1, H2–H4, body, small/meta).
- Generous line height; clear contrast (WCAG-aware). Large headings as visual anchors.

## 4. Spacing & Layout
- 4px-based scale; generous vertical rhythm and whitespace.
- Max-width content containers; responsive grids that adapt composition (not just shrink).
- Consistent section padding and alignment.

## 5. Components (public)
Navigation (desktop + mobile), footer, theme toggle, buttons, section headings, project/skill/blog cards, timelines, contact form, image placeholders/gallery, loading/empty states, page transitions (restrained). All use tokens and semantic HTML.

## 6. Implementation
- CSS variables on `:root` (light) and `[data-theme="dark"]`; `localStorage` key `theme`; default `light`.
- Centralized mock data in `client/src/data/` (clearly labeled sample/placeholder content; no fabricated personal achievements).
- React Router routes for all public pages; dynamic routes for `/projects/:slug` and `/blog/:slug`.
- Accessibility: labels, focus states, keyboard navigation, semantic landmarks.

## 7. Part 4 Scope
Public frontend only. No backend build, no DB/auth/admin, no real message storage, no deployment. Contact form prepared for Part 5 API integration (no false delivery claims).
