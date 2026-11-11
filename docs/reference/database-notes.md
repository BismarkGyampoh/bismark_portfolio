# PART 6 — FULLY AUTOMATED DATABASE SETUP AND IMPLEMENTATION

I want you to take responsibility for implementing Part 6 of my portfolio website.

My objective is to minimize manual work. Act as my senior full-stack developer and handle the technical implementation from beginning to end.

## 1. First inspect my computer and project

Before making changes:

- Inspect my existing portfolio project.
- Review the backend implementation from Part 5.
- Check whether PostgreSQL is installed.
- Check whether PostgreSQL services are running.
- Check whether pgAdmin is installed.
- Check whether Prisma is already configured.
- Check my Node.js, npm and TypeScript versions.
- Identify any missing dependencies.

Do not assume that previous development stages were completed successfully. Verify everything.

## 2. Install PostgreSQL if necessary

If PostgreSQL is missing:

- Check whether Windows Package Manager (winget) is available.
- Find an appropriate official PostgreSQL Windows installer.
- Prefer an official PostgreSQL distribution.
- Explain what needs to be installed.
- Ask for my approval before installing software or making system-level changes.
- Automate installation and configuration wherever possible.
- If Windows requires administrator approval or a graphical installation step, guide me through only that step.

Install or verify:
- PostgreSQL Server.
- pgAdmin 4.
- PostgreSQL command-line tools.

Configure PostgreSQL to use port 5432 unless it is unavailable.

Do not invent passwords or expose database credentials.

## 3. Configure the database

Create a PostgreSQL database named:

portfolio_db

Configure the database connection securely.

Use environment variables rather than hardcoded credentials.

If you need me to enter a database password, request it through a secure local configuration process. Never ask me to paste it into this conversation.

## 4. Configure Prisma

Install and configure the appropriate Prisma dependencies.

- Initialize Prisma if necessary.
- Configure the Prisma schema.
- Configure PostgreSQL as the database provider.
- Create a reusable Prisma client.
- Generate the Prisma Client.
- Configure the migration workflow.

Respect the Prisma version and architecture already used by my project.

## 5. Create the database models

Implement these models:

- User
- Project
- Skill
- Experience
- Education
- BlogPost
- ContactMessage

Include suitable fields, relationships, constraints, timestamps, indexes and unique identifiers.

Design the schema for a professional portfolio with an administrative dashboard.

Do not create fabricated personal information.

## 6. Backend integration

Integrate Prisma with my existing Express backend.

Create reusable services and prepare database-backed operations.

Ensure:
- Public APIs expose only published content.
- Administrative operations are not publicly accessible.
- Validation is implemented with Zod.
- Database errors are handled properly.
- Sensitive information is not exposed.

Do not implement the complete authentication system yet. That belongs to Part 7.

## 7. Run everything

Take responsibility for:

- Installing dependencies.
- Generating Prisma Client.
- Validating the schema.
- Starting PostgreSQL.
- Creating the initial migration.
- Applying the migration.
- Testing database connectivity.
- Testing CRUD operations.
- Running TypeScript checks.
- Fixing implementation errors.

If a step cannot be completed because of permissions, missing credentials or unavailable software, explain the exact obstacle and handle everything else possible.

Never claim a task succeeded unless you verified it.

## 8. Documentation

Update my project documentation with the setup instructions, database configuration, migration commands and development commands.

## 9. Final report

When finished, provide:

1. What you inspected.
2. What you installed.
3. What you configured.
4. Database architecture.
5. Prisma schema.
6. Migration results.
7. Tests performed and their results.
8. Any remaining manual steps.
9. Confirmation that the existing frontend and backend still work.

Do not proceed to Part 7.

Work systematically, make sensible technical decisions, and ask me questions only when an actual decision or permission is necessary.

My preference is maximum automation with minimum manual intervention.