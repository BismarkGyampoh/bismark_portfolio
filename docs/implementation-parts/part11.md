# PART 11: COMPLETE DEPLOYMENT, PRODUCTION CONFIGURATION AND WEBSITE LAUNCH

You are continuing development of my personal portfolio website.

This is Part 11, the final stage of the development roadmap.

Your responsibility is to prepare, configure, deploy and launch my portfolio website so that it is publicly accessible on the internet.

I want you to automate as much of this process as technically possible.

Do not simply give me instructions when you can perform the task yourself. Inspect the project, execute the necessary commands, configure the required files and services, and verify the results.

However, never perform paid actions, purchase services, purchase domains or make irreversible changes without my explicit approval.

# PHASE 1: COMPLETE PROJECT AND DEPLOYMENT READINESS AUDIT

Before deploying anything, inspect the entire repository.

Review:

1. Frontend architecture.
2. Backend architecture.
3. PostgreSQL configuration.
4. Prisma configuration and migrations.
5. Authentication and authorization.
6. Admin dashboard.
7. Contact form.
8. Blog functionality.
9. File upload system.
10. Environment variables.
11. Build configuration.
12. Testing and documentation.
13. Git and GitHub configuration.

Check whether Part 10 was completed successfully.

Run the available:
- TypeScript checks.
- Linting.
- Automated tests.
- Production builds.
- Database checks.

Identify any remaining deployment blockers.

If critical security vulnerabilities, broken features, failed builds or unsafe database migrations exist, resolve them before deployment where possible.

If a problem cannot safely be resolved, stop the affected deployment step and explain why.

Do not pretend that Part 10 was completed if there is no evidence.

# PHASE 2: SELECT THE DEPLOYMENT ARCHITECTURE

Evaluate suitable hosting providers for the actual project.

Consider:

- Frontend hosting.
- Backend hosting.
- PostgreSQL hosting.
- File storage.
- Domain configuration.
- SSL certificates.
- Deployment automation.
- Security.
- Performance.
- Pricing and free-tier limitations.
- Ease of future maintenance.

Evaluate suitable services, including:

Frontend:
- Vercel.
- Netlify.
- Other compatible alternatives.

Backend:
- Render.
- Railway.
- Fly.io.
- Other compatible alternatives.

Database:
- Neon.
- Supabase.
- Other managed PostgreSQL providers.

File storage:
- Cloudinary.
- Supabase Storage.
- Other suitable object storage services.

Git hosting:
- GitHub.

Recommend the best architecture based on compatibility, reliability, maintainability and reasonable cost.

Do not choose a service merely because it offers a free tier.

Before creating accounts or provisioning paid resources, provide a short deployment recommendation and identify any costs or billing requirements.

Do not purchase anything without my approval.

# PHASE 3: PREPARE THE PROJECT FOR PRODUCTION

Configure the application for production.

Frontend:
- Set the correct production API URL.
- Configure production environment variables.
- Verify frontend routing.
- Configure asset paths.
- Configure metadata and SEO.
- Remove development-only settings.
- Ensure the production build works.

Backend:
- Configure production environment variables.
- Configure the production port.
- Configure trusted origins.
- Configure CORS correctly.
- Configure secure cookies.
- Configure production logging.
- Configure error handling.
- Configure health-check endpoints.
- Disable development debugging and verbose error responses.

Database:
- Configure the production PostgreSQL connection.
- Configure Prisma for production.
- Prepare safe migration commands.
- Verify database connectivity.
- Ensure database credentials are protected.

Never hardcode production credentials.

Never commit .env files or secrets to GitHub.

# PHASE 4: PRODUCTION DATABASE SETUP

Set up the production PostgreSQL database using the selected provider.

Requirements:

1. Create the production database if authorized.
2. Configure the database connection securely.
3. Configure Prisma.
4. Apply the required migrations safely.
5. Verify database connectivity.
6. Confirm that all required models exist.
7. Verify important relationships and constraints.
8. Confirm that database access is restricted appropriately.

Do not reset the database.

Do not run destructive migration commands against an existing production database.

Do not copy development or test records into production unless explicitly approved.

Provide a secure procedure for creating the initial administrator account.

Never create a publicly known default administrator password.

# PHASE 5: FILE STORAGE CONFIGURATION

Inspect the current file upload implementation.

If the application relies on local file storage, determine whether that storage is persistent on the selected hosting platform.

If local storage is unsuitable for production, migrate uploads to a suitable cloud storage provider.

Configure storage for:
- Project images.
- Blog cover images.
- Profile photographs.
- CV documents.

Verify:
- File upload.
- File replacement.
- File retrieval.
- File deletion.
- File type validation.
- File size restrictions.
- Access permissions.

Ensure that uploaded files remain available after application restarts and redeployments.

Do not expose private files or storage credentials.

# PHASE 6: AUTHENTICATION AND PRODUCTION SECURITY

Verify production security settings.

Check:

- HTTPS.
- Secure authentication cookies.
- HttpOnly cookies.
- Appropriate SameSite settings.
- CSRF protection where required.
- CORS restrictions.
- Rate limiting.
- Password hashing.
- Session expiration.
- Session invalidation.
- Role-based authorization.
- Secure file uploads.
- Environment variable protection.
- Database access restrictions.

Pay particular attention to cross-origin authentication if the frontend and backend are hosted on different domains.

Do not disable security protections just to resolve deployment errors.

# PHASE 7: AUTOMATED DEPLOYMENT

Connect the repository to the selected hosting services.

Where supported, configure automatic deployment from GitHub.

Set up:

- Production build commands.
- Backend start commands.
- Frontend build configuration.
- Environment variables.
- Database migration workflow.
- Deployment branch.
- Health checks.
- Deployment logs.

Use a safe deployment workflow.

Do not automatically deploy unreviewed experimental branches.

Ensure that future approved changes can be deployed without manually repeating the entire configuration process.

If GitHub Actions or another CI/CD solution is appropriate, configure it.

Do not expose deployment tokens in source code or logs.

# PHASE 8: DOMAIN AND HTTPS CONFIGURATION

Prepare the website for a custom domain.

If I already own a domain, help configure it.

If I do not own one, explain suitable domain options and ask for approval before purchasing anything.

Configure, where supported:

- Custom domain.
- DNS records.
- Frontend domain.
- Backend API subdomain.
- HTTPS.
- SSL certificates.
- HTTP-to-HTTPS redirection.
- Canonical website URL.

Do not modify existing DNS records without explaining the changes and receiving approval.

Do not invent a domain name or claim that a domain is registered when it is not.

If manual DNS configuration is required, give me the exact records to add.

# PHASE 9: PRODUCTION ADMINISTRATOR SETUP

Ensure that I can securely access my portfolio's administrative dashboard.

Verify:

- Administrator account creation.
- Administrator login.
- Session persistence.
- Logout.
- Protected dashboard routes.
- Backend authorization.
- Password change functionality.
- Unauthorized access handling.

Never place administrator credentials in frontend source code.

Do not expose passwords in terminal output or deployment logs.

If account creation requires my email address or a password, ask me to complete the necessary secure step.

# PHASE 10: LIVE WEBSITE TESTING

After deployment, test the actual production website.

Verify:

Public website:
- Homepage loads.
- Navigation works.
- About section displays correctly.
- Projects load.
- Skills load.
- Experience and education display.
- Blog listing works.
- Individual blog posts open.
- Contact form submits successfully.
- CV download works.
- Images load.
- Mobile navigation works.

Admin dashboard:
- Administrator can log in.
- Unauthorized users cannot access protected pages.
- Projects can be created, edited and deleted.
- Skills can be managed.
- Experience and education can be managed.
- Blog posts can be created and published.
- Contact messages can be viewed.
- Profile information can be updated.
- File uploads work.

Backend:
- API health check succeeds.
- Database connection works.
- Authentication works.
- Authorization works.
- File storage works.
- Error handling works.

Test using real production URLs.

Do not use fake success responses.

Do not submit unnecessary test messages or publish test content on the live website without approval.

# PHASE 11: BACKUPS, MONITORING AND MAINTENANCE

Configure or document:

- Database backups.
- Database restoration procedures.
- Application logs.
- Error monitoring.
- Uptime monitoring.
- Deployment rollback.
- Dependency maintenance.
- Security updates.

Clearly distinguish between services actually configured and services that still require manual setup.

Do not claim automated backups are active without verifying them.

# PHASE 12: FINAL DOCUMENTATION

Update the README and create a deployment guide.

Document:

1. Hosting providers selected.
2. Frontend production URL.
3. Backend production URL.
4. Database provider.
5. File storage provider.
6. Environment variables required.
7. Deployment commands.
8. Database migration procedure.
9. Administrator setup.
10. Domain configuration.
11. Backup procedures.
12. Maintenance instructions.
13. Known limitations.

Never write actual passwords, API keys or secrets into the documentation.

# PHASE 13: FINAL PRODUCTION REPORT

Provide a detailed report containing:

1. Hosting architecture selected.
2. Reasons for selecting each provider.
3. Services successfully configured.
4. Services that require manual approval.
5. Database deployment status.
6. File storage deployment status.
7. Authentication and security status.
8. Frontend deployment status.
9. Backend deployment status.
10. Custom domain status.
11. HTTPS status.
12. Live website URL.
13. Admin dashboard URL.
14. Production tests performed.
15. Tests passed and failed.
16. Remaining problems.
17. Estimated recurring costs and any relevant free-tier limitations.

Use actual results.

Do not invent URLs, deployment statuses or successful tests.

# IMPORTANT EXECUTION RULES

- Automate as much as possible.
- Do not stop at merely writing deployment instructions.
- Do not purchase services without my approval.
- Do not expose credentials.
- Do not delete existing project data.
- Do not deploy an application with unresolved critical vulnerabilities.
- Do not make unapproved DNS changes.
- Do not claim a deployment is successful until the live application has been tested.
- If a provider requires account authorization, let me complete that step securely.
- If you encounter a blocker, explain it and continue with independent tasks where safe.

Your ultimate objective is to deliver a working, secure, publicly accessible portfolio website.

Begin by auditing the repository and preparing the deployment recommendation. Proceed with the implementation wherever authorization and prerequisites permit.

Do not fabricate results.