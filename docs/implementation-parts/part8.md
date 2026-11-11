# PART 8: COMPLETE ADMIN DASHBOARD DEVELOPMENT

Act as a senior full-stack developer, UI/UX designer and software architect.

You are continuing development of my existing full-stack personal portfolio website.

Your responsibility is to design and implement a complete, professional, functional administrative dashboard.

My objective is to manage the entire portfolio website without manually editing source code.

I want maximum automation and minimum manual intervention.

# PHASE 1: INSPECT THE EXISTING PROJECT

Before implementing anything:

1. Inspect the entire project structure.
2. Review the frontend architecture.
3. Review the Express backend.
4. Verify PostgreSQL and Prisma integration.
5. Verify authentication and authorization from Part 7.
6. Review existing API endpoints.
7. Identify existing reusable components.
8. Review the existing design system.
9. Identify incomplete features and errors.

IMPORTANT:

Do not assume Parts 5, 6 and 7 were successfully completed.

Verify their implementations.

If authentication, database connectivity or required backend functionality is incomplete, report the problem and resolve the necessary prerequisites before proceeding.

Do not recreate the project from scratch.

Do not overwrite working functionality.

# PHASE 2: DASHBOARD DESIGN

Create a modern, professional administrative dashboard.

DESIGN DIRECTION:

- Editorial visual direction.
- Light-first interface.
- Minimalist aesthetic.
- Professional typography.
- Generous whitespace.
- Clean layouts.
- Subtle borders.
- Refined shadows.
- Consistent spacing.
- Responsive design.

Avoid:
- Generic dark dashboard templates.
- Excessive gradients.
- Unnecessary animations.
- Overcrowded layouts.
- Excessive rounded cards.
- Inconsistent typography.

The dashboard must look like a professionally designed content management system.

# PHASE 3: DASHBOARD LAYOUT

Implement:

1. Responsive sidebar navigation.
2. Dashboard header.
3. Breadcrumb navigation.
4. Main content area.
5. User profile menu.
6. Notification area where useful.
7. Responsive mobile navigation.
8. Logout functionality.

Sidebar navigation:

- Overview
- Projects
- Skills
- Experience
- Education
- Blog
- Messages
- Profile
- Settings

Use appropriate icons and clear navigation labels.

Highlight the currently active section.

# PHASE 4: DASHBOARD OVERVIEW

Create a functional overview page.

Display:

- Total projects.
- Published projects.
- Draft projects.
- Total blog posts.
- Published blog posts.
- Unread contact messages.
- Recent administrative activity.

Use real database information.

Do not display fabricated statistics.

Where analytics data is unavailable, clearly indicate that it is not yet configured.

Include appropriate charts only where actual data supports them.

# PHASE 5: PROJECT MANAGEMENT

Implement complete project management functionality.

Features:

- View all projects.
- Create new projects.
- Edit existing projects.
- Delete projects with confirmation.
- Publish and unpublish projects.
- Save projects as drafts.
- Mark featured projects.
- Set display order.
- Upload project images.
- Add project descriptions.
- Add technologies.
- Add GitHub repository links.
- Add live project links.
- Search and filter projects.

Connect every operation to the existing backend and PostgreSQL database.

Implement appropriate form validation.

# PHASE 6: SKILLS MANAGEMENT

Implement:

- Add skills.
- Edit skills.
- Delete skills.
- Organize skills by category.
- Set proficiency levels.
- Set display order.
- Add appropriate skill icons where supported.

Ensure changes are reflected on the public portfolio.

# PHASE 7: EXPERIENCE MANAGEMENT

Implement:

- Add professional experience.
- Edit experience.
- Delete experience.
- Add company names.
- Add job titles.
- Add employment types.
- Add locations.
- Add descriptions.
- Set start and end dates.
- Indicate current employment.

Support proper date validation.

# PHASE 8: EDUCATION MANAGEMENT

Implement:

- Add educational records.
- Edit records.
- Delete records.
- Add institutions.
- Add qualifications.
- Add fields of study.
- Add descriptions.
- Set start and end dates.
- Indicate current education.

# PHASE 9: BLOG MANAGEMENT

Create a professional blog management interface.

Features:

- Create blog posts.
- Edit blog posts.
- Delete blog posts.
- Save drafts.
- Publish posts.
- Unpublish posts.
- Add titles.
- Generate or edit slugs.
- Add excerpts.
- Write article content.
- Upload cover images.
- Set publication dates.
- Preview articles before publishing.
- Search and filter articles.

Use a suitable rich-text editor if compatible with the existing project.

Ensure unpublished posts are not accessible through public APIs.

# PHASE 10: CONTACT MESSAGE MANAGEMENT

Create an inbox for website visitors' messages.

Features:

- View received messages.
- Read individual messages.
- Mark messages as read.
- Delete messages.
- Search messages.
- Filter unread and read messages.
- Display sender name, email, subject and date.

Use actual ContactMessage database records.

# PHASE 11: PROFILE MANAGEMENT

Create an interface to manage my public portfolio profile.

Allow editing of:

- Full name.
- Professional title.
- Biography.
- Profile image.
- Email address.
- Location.
- Phone number, if provided.
- LinkedIn URL.
- GitHub URL.
- Other social links.
- Résumé/CV.

Do not invent personal information.

Ensure profile changes can be reflected on the public website.

If the existing database does not support profile information, implement an appropriate model and migration.

# PHASE 12: SETTINGS

Implement suitable dashboard settings.

Include:

- Account information.
- Password change interface.
- Session management where supported.
- Basic website configuration.
- Dashboard preferences.

Never expose password hashes or authentication tokens.

Do not weaken the existing authentication system.

# PHASE 13: API AND DATABASE INTEGRATION

All management features must be functional.

Requirements:

- Use the existing Express API.
- Use Prisma for database operations.
- Implement missing API endpoints where necessary.
- Validate incoming requests with Zod.
- Enforce authentication and authorization.
- Restrict administrative operations to authorized users.
- Handle database errors.
- Use proper loading and error states.
- Avoid hardcoded demonstration records.

Do not implement frontend-only buttons that pretend to perform database operations.

Every functional control must perform its advertised action.

# PHASE 14: FILE UPLOADS

Implement a suitable file upload architecture for:

- Project images.
- Blog cover images.
- Profile pictures.
- Résumé/CV documents.

Validate file types and sizes.

Use secure storage practices.

If cloud storage is required, prepare the integration and explain any credentials or external account setup that I must authorize.

Do not store sensitive uploaded files in publicly accessible locations.

# PHASE 15: SECURITY

Ensure:

- Protected dashboard routes.
- Backend authorization checks.
- Secure session handling.
- CSRF protection where applicable.
- Input validation.
- Safe file uploads.
- Proper error handling.
- No exposed credentials.
- No public access to administrative endpoints.

Do not rely on frontend route protection alone.

# PHASE 16: RESPONSIVENESS

Test the dashboard on:

- Desktop.
- Tablet.
- Mobile.

Ensure the sidebar, tables, forms, charts and navigation adapt appropriately.

# PHASE 17: TESTING

Test all implemented functionality.

Verify:

1. Administrator login.
2. Dashboard access restrictions.
3. Dashboard statistics.
4. Project CRUD.
5. Skills CRUD.
6. Experience CRUD.
7. Education CRUD.
8. Blog CRUD.
9. Message management.
10. Profile updates.
11. Settings.
12. File upload validation.
13. Logout.
14. Database persistence.
15. Public portfolio compatibility.

Run TypeScript checks and fix errors.

Do not claim tests passed unless they were actually executed.

# PHASE 18: COMPLETION REPORT

When implementation is complete, provide:

1. Dashboard features implemented.
2. Design and layout summary.
3. Backend endpoints created or modified.
4. Database changes.
5. Files created and modified.
6. Dependencies installed.
7. Tests performed and results.
8. Outstanding issues.
9. Remaining manual configuration.
10. Confirmation that the public website still works.

IMPORTANT:

Do not proceed to Part 9.

Do not invent successful implementations or test results.

Use maximum automation, but request approval for privileged actions, destructive changes and external service credentials.

Wait for my approval before proceeding to Part 9.