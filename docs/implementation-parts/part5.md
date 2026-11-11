# PART 5: BACKEND DEVELOPMENT — PROFESSIONAL PORTFOLIO WEBSITE

You are continuing development of my existing full-stack personal portfolio website.

## 1. IMPORTANT PROJECT INSTRUCTIONS

Before writing any code:

- Inspect the entire existing project structure.
- Review the existing frontend and configuration files.
- Understand the architecture established in Parts 1–4.
- Identify the technologies already installed.
- Do not recreate the project from scratch.
- Do not overwrite working frontend code.
- Do not introduce unnecessary dependencies.
- Preserve the existing editorial, light-first visual direction.
- Maintain consistency with the existing folder structure.

This is Part 5 of a larger development process. Your responsibility is to implement the backend foundation without prematurely implementing features assigned to later parts.

## 2. TECHNOLOGY STACK

Use:

- Node.js
- Express.js
- TypeScript
- PostgreSQL (database integration will be completed in a later phase)
- Prisma ORM (prepare for integration)
- Zod for validation
- dotenv for environment variables
- Helmet for security headers
- CORS for cross-origin configuration
- Morgan for HTTP request logging

Use appropriate production-ready packages where necessary.

## 3. BACKEND ARCHITECTURE

Create a clean, modular and maintainable backend architecture.

Organize the server directory using a structure similar to:

server/
  src/
    config/
    controllers/
    middleware/
    routes/
    services/
    validators/
    utils/
    types/
    app.ts
    server.ts

  prisma/
  .env.example
  package.json
  tsconfig.json

Adjust this structure where necessary to maintain compatibility with the existing project.

## 4. EXPRESS SERVER CONFIGURATION

Implement:

- Express application initialization.
- JSON request parsing.
- URL-encoded request parsing.
- CORS configuration.
- Helmet security middleware.
- Request logging.
- Environment variable configuration.
- Centralized error handling.
- 404 route handling.

Separate the Express application configuration from the server startup file.

The server must use environment variables for its port and other configuration.

## 5. API STRUCTURE

Use a versioned API structure:

/api/v1

Prepare the following route groups:

- /api/v1/health
- /api/v1/projects
- /api/v1/skills
- /api/v1/experience
- /api/v1/education
- /api/v1/profile
- /api/v1/contact
- /api/v1/blog

At this stage, implement the health endpoint properly and establish the routing architecture for the other endpoints.

Do not invent database records or hardcode fake portfolio content.

## 6. HEALTH CHECK ENDPOINT

Implement:

GET /api/v1/health

It should return a structured JSON response containing:

- Success status.
- API name.
- API status.
- Current server timestamp.

Use an appropriate HTTP status code.

## 7. VALIDATION

Configure Zod for request validation.

Create reusable validation middleware.

Ensure that invalid requests return meaningful validation errors rather than crashing the server.

Prepare the validation architecture for future contact forms, authentication and content management.

## 8. ERROR HANDLING

Implement centralized error handling.

Handle:

- Validation errors.
- Invalid routes.
- Internal server errors.
- Unexpected application errors.

Use consistent JSON error responses.

Never expose stack traces, secrets or sensitive server information in production responses.

## 9. SECURITY

Implement appropriate backend security foundations.

Include:

- Helmet.
- Restricted CORS origins using environment variables.
- Environment variable validation.
- Safe error responses.
- Proper HTTP status codes.
- Request validation.

Do not hardcode credentials, API keys or database passwords.

Prepare the architecture for future authentication using secure HTTP-only cookies.

Do not implement the complete authentication system yet.

## 10. ENVIRONMENT CONFIGURATION

Create a `.env.example` file containing the required configuration variables.

Include appropriate variables such as:

PORT
NODE_ENV
CLIENT_URL
DATABASE_URL

Do not create real credentials.

Ensure `.env` is excluded from Git.

## 11. DATABASE PREPARATION

Prepare the backend for future PostgreSQL and Prisma integration.

Do not implement the complete database schema or database-dependent CRUD operations in this phase.

Those will be handled in subsequent development stages.

Ensure the architecture can accommodate Prisma without requiring major restructuring.

## 12. CODE QUALITY

Requirements:

- Use TypeScript throughout the backend.
- Avoid unnecessary use of `any`.
- Use clear naming conventions.
- Write reusable functions.
- Separate business logic from route definitions.
- Maintain consistent error handling.
- Avoid duplicated code.
- Add useful comments where necessary.
- Keep the implementation maintainable and scalable.

## 13. TESTING AND VERIFICATION

After implementation:

1. Install any necessary dependencies.
2. Verify TypeScript configuration.
3. Run the backend development server.
4. Test the health endpoint.
5. Test an invalid route.
6. Test error handling.
7. Verify that the frontend still runs.
8. Fix any errors introduced during implementation.

Provide the exact commands required to run the backend.

## 14. COMPLETION REPORT

When finished, provide:

1. Summary of what was implemented.
2. New files created.
3. Existing files modified.
4. Dependencies installed.
5. API endpoints established.
6. Commands to start the backend.
7. Testing results.
8. Any outstanding issues.
9. What is intentionally deferred to Part 6.

IMPORTANT:

Do not move to Part 6 automatically.

Complete Part 5, verify the implementation and wait for my approval before proceeding.

Do not simply generate code without checking whether it works with the existing project.