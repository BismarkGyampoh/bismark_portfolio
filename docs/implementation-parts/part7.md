# PART 7: AUTHENTICATION AND AUTHORIZATION IMPLEMENTATION

Act as a senior full-stack security engineer.

You are continuing development of my existing personal portfolio website.

Your responsibility is to implement a complete, secure authentication and authorization system for the portfolio administration dashboard.

My preference is maximum automation with minimum manual intervention.

## PHASE 1: PROJECT INSPECTION

Before modifying anything:

1. Inspect the entire project.
2. Review Parts 1–6.
3. Verify the existing frontend architecture.
4. Verify the Express backend.
5. Verify PostgreSQL connectivity.
6. Verify Prisma configuration and migrations.
7. Inspect the existing User model.
8. Identify any existing authentication implementation.
9. Check dependencies and configuration.

Do not assume previous stages were completed successfully.

If Part 6 is incomplete, resolve the required database prerequisites before implementing authentication.

Do not recreate working components or overwrite existing functionality.

## PHASE 2: AUTHENTICATION ARCHITECTURE

Implement secure administrator authentication.

Use:

- Node.js.
- Express.js.
- TypeScript.
- PostgreSQL.
- Prisma ORM.
- Argon2id for password hashing.
- Secure HTTP-only cookies.
- Database-backed sessions.
- Zod validation.

Follow established security practices.

## PHASE 3: USER MANAGEMENT

Implement the administrator User model.

Ensure it supports:

- Unique email addresses.
- Secure password hashes.
- User roles.
- Account activation status.
- Created and updated timestamps.

Support the following roles where appropriate:

- ADMIN
- EDITOR

Do not store plain-text passwords.

## PHASE 4: SECURE SESSION MANAGEMENT

Implement database-backed authentication sessions.

Requirements:

- Generate cryptographically secure random session tokens.
- Store only hashed session tokens in the database.
- Use HTTP-only cookies.
- Set Secure cookies in production.
- Configure appropriate SameSite protection.
- Implement session expiration.
- Implement session revocation.
- Invalidate sessions on logout.
- Support session verification.
- Avoid exposing session tokens in API responses.

Add an appropriate Prisma Session model and migration if necessary.

## PHASE 5: AUTHENTICATION ENDPOINTS

Implement the following endpoints:

POST /api/v1/auth/login

POST /api/v1/auth/logout

GET /api/v1/auth/me

POST /api/v1/auth/refresh

Protect sensitive endpoints appropriately.

Implement request validation and consistent JSON responses.

Do not expose password hashes or authentication secrets.

## PHASE 6: ADMINISTRATOR INITIALIZATION

Implement a secure administrator initialization process.

Requirements:

- No public administrator registration.
- Create the initial administrator using a secure CLI script.
- Read credentials through environment variables or a secure interactive local process.
- Hash the password using Argon2id.
- Prevent accidental creation of duplicate administrator accounts.
- Never include default production credentials.
- Do not print passwords or secrets in logs.

Document the administrator setup command.

## PHASE 7: AUTHORIZATION

Implement reusable authentication and authorization middleware.

Ensure:

- Unauthenticated users cannot access protected routes.
- ADMIN users can access administrative functions.
- EDITOR users receive only the permissions assigned to them.
- Public visitors cannot modify portfolio content.
- Role checks are enforced on the backend, not just hidden in the frontend.

Protect all existing administrative API routes.

## PHASE 8: SECURITY

Implement:

- Login rate limiting.
- Input validation.
- Secure cookie configuration.
- CSRF protection appropriate for cookie-based authentication.
- Origin validation.
- Safe error handling.
- Session expiration.
- Secure password comparison.
- Protection against brute-force login attempts.

Configure CORS correctly for the existing frontend.

Do not expose credentials, password hashes or sensitive server details.

Do not weaken security to make development easier.

## PHASE 9: FRONTEND INTEGRATION

Inspect the existing frontend before implementing changes.

Create or integrate:

- Administrator login page.
- Login form validation.
- Authentication state management.
- Protected admin routes.
- Logout functionality.
- Session verification.
- Loading states.
- Authentication error messages.
- Unauthorized access handling.

Maintain the established editorial, modern, light-first design direction.

Do not redesign the entire website.

The login interface should look professional and consistent with the existing visual system.

Do not store authentication tokens in localStorage or sessionStorage.

## PHASE 10: TESTING

Test:

1. Successful administrator login.
2. Incorrect password rejection.
3. Invalid email rejection.
4. Unauthenticated access rejection.
5. Successful logout.
6. Session expiration.
7. Session revocation.
8. Role-based access.
9. Login rate limiting.
10. CSRF protection.
11. Frontend authentication state.
12. Existing public portfolio functionality.

Run TypeScript checks and relevant tests.

Fix errors introduced during implementation.

Do not claim a test passed unless it was actually executed.

## PHASE 11: DOCUMENTATION

Document:

- Authentication architecture.
- Administrator initialization.
- Environment variables.
- Login and logout endpoints.
- Session management.
- Authorization rules.
- Security configuration.
- Development instructions.

## PHASE 12: COMPLETION REPORT

Provide:

1. Authentication architecture.
2. Database changes.
3. Files created.
4. Files modified.
5. Dependencies installed.
6. API endpoints implemented.
7. Security measures implemented.
8. Tests performed and results.
9. How to create the first administrator.
10. Any remaining manual configuration.
11. Outstanding issues.

IMPORTANT:

Do not proceed to Part 8.

Do not invent successful tests or database migrations.

Ask for my permission when a privileged system operation or sensitive configuration requires it.

Automate all safe and authorized implementation tasks.

Wait for my approval before continuing to Part 8.