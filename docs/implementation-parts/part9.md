# PART 9: CONTACT SYSTEM, PUBLIC BLOG AND FILE UPLOADS

Act as a senior full-stack developer and software architect.

You are continuing development of my existing full-stack personal portfolio website.

Your responsibility is to implement the complete contact system, public blog experience and secure file upload functionality.

My preference is maximum automation with minimum manual intervention.

## PHASE 1: INSPECT THE EXISTING PROJECT

Before implementing anything:

1. Inspect the entire project.
2. Review Parts 1–8.
3. Verify the existing frontend.
4. Verify the Express backend.
5. Verify PostgreSQL and Prisma.
6. Verify authentication and authorization.
7. Review the admin dashboard.
8. Review existing ContactMessage and BlogPost models.
9. Review existing API endpoints.
10. Identify existing upload functionality.

Do not assume previous stages were completed successfully.

Do not recreate working features or overwrite existing implementations.

If dependencies or previous functionality are incomplete, resolve the necessary issues first.

## PHASE 2: CONTACT FORM

Implement a complete public-facing contact form.

Required fields:

- Full name.
- Email address.
- Subject.
- Message.

Requirements:

- Form validation using Zod.
- Required-field validation.
- Email validation.
- Appropriate character limits.
- Clear validation messages.
- Loading states.
- Successful submission feedback.
- Error handling.
- Responsive design.
- Spam protection.
- Rate limiting.
- Server-side validation.

Store valid submissions in the existing PostgreSQL ContactMessage model.

Do not expose administrative message-management endpoints publicly.

Prevent duplicate or automated spam submissions where reasonably possible.

## PHASE 3: CONTACT EMAIL NOTIFICATIONS

Prepare an email notification system.

When a visitor submits a message:

- Save the message in PostgreSQL.
- Optionally notify my administrator email.
- Avoid losing a saved message if email delivery fails.
- Keep email credentials in environment variables.
- Do not hardcode SMTP credentials.

If an email provider requires external credentials, configure the integration and tell me exactly what authorization is needed.

Do not invent email addresses.

## PHASE 4: PUBLIC BLOG SYSTEM

Implement the public-facing blog.

Create:

- Blog listing page.
- Individual article page.
- Blog article cards.
- Featured article section where appropriate.
- Publication dates.
- Article excerpts.
- Cover images.
- Category or tag support if appropriate.
- Related articles.
- Reading-friendly typography.
- Responsive layouts.

Only published articles should be publicly accessible.

Draft articles must remain private.

## PHASE 5: BLOG FUNCTIONALITY

Implement:

- Retrieve published articles.
- Retrieve an individual article using its slug.
- Search articles.
- Pagination.
- Related article retrieval.
- Appropriate empty states.
- Loading states.
- Error handling.
- SEO-friendly URLs.

Ensure the blog uses real PostgreSQL data through Prisma.

Do not display fabricated articles or hardcoded demonstration content.

If categories or tags require additional database models, design them appropriately.

## PHASE 6: BLOG SEO

Implement:

- Dynamic page titles.
- Meta descriptions.
- Canonical URLs.
- Open Graph metadata.
- Social sharing metadata.
- Article structured data where appropriate.
- Sitemap integration.
- Appropriate robots directives.

Ensure unpublished articles are excluded from public SEO indexing.

## PHASE 7: FILE UPLOAD SYSTEM

Implement a secure file upload architecture.

Support:

1. Project images.
2. Blog cover images.
3. Profile pictures.
4. Résumé/CV documents.

Requirements:

- Validate file extensions.
- Validate actual file types, not just extensions.
- Enforce file size limits.
- Generate safe unique filenames.
- Prevent path traversal.
- Restrict upload permissions.
- Handle failed uploads.
- Support image optimization where appropriate.
- Avoid exposing private files.

Use Supabase Storage or Cloudinary where appropriate.

Inspect the existing project and select the most suitable option.

Do not create unnecessary external dependencies.

If external credentials are needed, configure the integration and identify the exact information I must provide.

Never invent credentials or expose secrets.

## PHASE 8: ADMIN DASHBOARD INTEGRATION

Connect the new functionality to the existing dashboard.

Ensure:

- Contact submissions appear in the inbox.
- Administrators can read and manage messages.
- Blog drafts can be published.
- Blog edits appear on the public website.
- Uploaded images can be selected and managed.
- Profile images update correctly.
- CV uploads update the public download link.
- Project images appear in their respective portfolio projects.

Do not create duplicate dashboard pages where existing functionality already exists.

## PHASE 9: CV AND DOCUMENT MANAGEMENT

Implement résumé/CV management.

Allow the administrator to:

- Upload a new CV.
- Replace an existing CV.
- Preview the document where supported.
- Download the CV.
- Update the public CV download link.

Ensure that the public download link points to the latest published document.

Do not create a fake CV.

## PHASE 10: FRONTEND DESIGN

Maintain my established editorial visual direction.

Design requirements:

- Light-first appearance.
- Professional typography.
- Generous whitespace.
- Clear content hierarchy.
- Minimalist layouts.
- Consistent spacing.
- Responsive design.
- Accessible forms.
- Professional article-reading experience.

Avoid generic templates and unnecessary visual effects.

Maintain consistency with the existing portfolio website.

## PHASE 11: SECURITY

Implement:

- Server-side validation.
- Rate limiting.
- Secure upload handling.
- Authentication for administrative operations.
- Authorization checks.
- Safe file access.
- Appropriate CORS configuration.
- Protection against malicious uploads.
- Safe error responses.

Never trust frontend validation alone.

## PHASE 12: TESTING

Test:

1. Contact form submission.
2. Invalid contact form submissions.
3. Database persistence.
4. Email notification handling, if configured.
5. Public blog listing.
6. Individual blog articles.
7. Draft article privacy.
8. Blog search.
9. Blog pagination.
10. File upload validation.
11. Image uploads.
12. CV upload and download.
13. Admin dashboard integration.
14. Mobile responsiveness.
15. Existing portfolio functionality.

Run TypeScript checks and fix errors.

Do not claim tests passed unless they were actually executed.

## PHASE 13: DOCUMENTATION

Update project documentation with:

- Contact form configuration.
- Email notification configuration.
- Blog architecture.
- File storage configuration.
- Upload limits.
- Required environment variables.
- API endpoints.
- Development commands.

## PHASE 14: COMPLETION REPORT

Provide:

1. Features implemented.
2. Backend endpoints created or modified.
3. Database changes.
4. Files created and modified.
5. Dependencies installed.
6. External services configured.
7. Tests performed and results.
8. Outstanding issues.
9. Remaining manual configuration.
10. Confirmation that existing features still work.

IMPORTANT:

Do not proceed to Part 10.

Do not invent successful tests or external service configurations.

Automate all safe and authorized tasks.

Request my approval for external account connections, credentials and destructive operations.

Wait for my approval before proceeding to Part 10.