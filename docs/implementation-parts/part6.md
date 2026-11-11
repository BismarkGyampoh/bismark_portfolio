# PART 6: POSTGRESQL DATABASE AND PRISMA ORM INTEGRATION

You are continuing the development of my existing full-stack personal portfolio website.

Your task is to implement Part 6: complete PostgreSQL database integration using Prisma ORM.

## IMPORTANT: INSPECT BEFORE IMPLEMENTING

Before making changes:

1. Inspect the entire existing project.
2. Review the backend architecture implemented in Part 5.
3. Review the package configuration and TypeScript settings.
4. Check whether Prisma or PostgreSQL has already been configured.
5. Identify existing models, routes, services and validation schemas.
6. Preserve all working implementations.

Do not rebuild the application or overwrite existing functionality.

## 1. DATABASE TECHNOLOGY

Use:

- PostgreSQL
- Prisma ORM
- TypeScript
- Zod
- Node.js and Express

Use the Prisma version and configuration compatible with the existing project.

## 2. DATABASE CONNECTION

Configure Prisma to connect to PostgreSQL through environment variables.

Use DATABASE_URL.

Create or update the Prisma configuration appropriately.

Do not hardcode database credentials.

Provide a complete .env.example file.

Ensure actual environment files are excluded from Git.

## 3. DATABASE MODELS

Design and implement the following models.

### A. User

Fields:
- id
- name
- email
- passwordHash
- role
- createdAt
- updatedAt

This model will support future administrator authentication.

Never store plain-text passwords.

### B. Project

Fields:
- id
- title
- slug
- shortDescription
- description
- featuredImage
- liveUrl
- githubUrl
- technologies
- category
- featured
- published
- displayOrder
- createdAt
- updatedAt

Ensure slugs are unique.

### C. Skill

Fields:
- id
- name
- category
- proficiency
- icon
- displayOrder
- createdAt
- updatedAt

### D. Experience

Fields:
- id
- company
- position
- employmentType
- location
- description
- startDate
- endDate
- current
- displayOrder
- createdAt
- updatedAt

### E. Education

Fields:
- id
- institution
- qualification
- fieldOfStudy
- description
- startDate
- endDate
- current
- displayOrder
- createdAt
- updatedAt

### F. BlogPost

Fields:
- id
- title
- slug
- excerpt
- content
- coverImage
- published
- publishedAt
- createdAt
- updatedAt

Ensure slugs are unique.

### G. ContactMessage

Fields:
- id
- name
- email
- subject
- message
- read
- createdAt

Review the data types and relationships before finalizing the schema.

Use appropriate constraints, indexes, defaults and nullable fields.

## 4. DATABASE RELATIONSHIPS

Design sensible relationships.

Avoid introducing unnecessary relationships.

The database must support:
- Multiple portfolio projects.
- Multiple skills.
- Multiple experience records.
- Multiple education records.
- Multiple blog posts.
- Multiple contact messages.
- Administrator account management.

## 5. PRISMA CLIENT

Implement a reusable Prisma client.

Ensure that the application does not create unnecessary database connections during development.

Use an appropriate singleton pattern.

## 6. DATABASE SERVICES

Create reusable database services for each model.

Separate database operations from Express controllers.

Prepare the following operations:

- Create
- Read
- Read by ID
- Update
- Delete

Do not expose unrestricted administrative operations through public endpoints.

## 7. DATABASE VALIDATION

Use Zod to validate incoming data.

Validate:
- Required fields.
- Email addresses.
- URLs.
- String lengths.
- Date values.
- Numeric values.
- Slug formats.

Return clear validation errors.

## 8. DATABASE ERROR HANDLING

Handle:
- Unique constraint violations.
- Missing records.
- Invalid database operations.
- Connection errors.
- Unexpected Prisma errors.

Use consistent API error responses.

Never expose sensitive database information.

## 9. DATABASE MIGRATIONS

Prepare and execute the initial Prisma migration when a working PostgreSQL connection is available.

Use migrations rather than relying on schema push as the normal production workflow.

Document the commands for:

- Generating Prisma Client.
- Creating migrations.
- Applying migrations.
- Opening Prisma Studio.

Do not pretend migrations succeeded if no database connection is available.

## 10. SEEDING

Create a seed script where useful.

Do not insert fabricated personal information, fake work experience or imaginary portfolio projects.

Use only clearly identified development examples if test data is needed.

Do not create default administrator credentials or insecure production accounts.

## 11. API INTEGRATION

Prepare the existing API routes and services for database-backed operations.

Ensure public endpoints can eventually retrieve published portfolio content.

Keep administrative operations protected for the authentication stage in Part 7.

Do not expose unpublished content through public endpoints.

Do not implement authentication yet.

## 12. TESTING

Verify:

1. Prisma Client generation.
2. Database connection where credentials are available.
3. Schema validation.
4. Migration execution where possible.
5. Database CRUD operations.
6. Error handling.
7. Existing health endpoint.
8. Existing frontend functionality.

Run TypeScript checks and fix errors.

## 13. DOCUMENTATION

Update the project documentation with:

- PostgreSQL installation/setup requirements.
- Database configuration.
- Environment variables.
- Migration commands.
- Prisma Studio commands.
- Development startup commands.

## 14. COMPLETION REPORT

Provide:

1. Database architecture implemented.
2. Prisma schema summary.
3. Models and relationships.
4. Files created and modified.
5. Dependencies installed.
6. Migration status.
7. Database connection status.
8. Testing results.
9. Any outstanding issues.
10. What is reserved for Part 7.

IMPORTANT:

Do not proceed to Part 7.

Do not invent successful database connections or migrations.

If PostgreSQL credentials or a database server are unavailable, complete everything possible and explain exactly what I need to configure.

Wait for my approval before proceeding.