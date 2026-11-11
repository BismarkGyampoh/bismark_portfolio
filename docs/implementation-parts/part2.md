# PART 2: PROJECT INITIALIZATION AND DEVELOPMENT ENVIRONMENT SETUP

Act as a senior full-stack developer and software architect.

We are now proceeding to Phase 2 of the personal portfolio website development project.

You have already completed the planning phase and produced the following documents:

- PROJECT_SPECIFICATION.md
- SYSTEM_ARCHITECTURE.md
- DATABASE_DESIGN.md
- API_DOCUMENTATION.md
- DEVELOPMENT_ROADMAP.md

Your responsibility is to initialize the actual project environment based on the approved documentation.

IMPORTANT: Before making changes, inspect the existing workspace and read the five planning documents. Follow their approved architecture. Do not disregard or unnecessarily redesign the existing specifications.

## 1. PROJECT INITIALIZATION

Create the main project directory structure.

Use a monorepo architecture with two separate applications:

- client: React frontend.
- server: Express backend.

The root directory should contain the shared project configuration and documentation.

Use a clean and maintainable structure.

A suggested structure is:

portfolio/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   └── utils/
│   ├── prisma/
│   └── package.json
│
├── docs/
├── .gitignore
├── package.json
└── README.md

You may adjust this structure where necessary, but explain any significant differences.

## 2. FRONTEND INITIALIZATION

Inside the client directory:

1. Initialize React using Vite.
2. Use JavaScript rather than TypeScript unless the approved specification explicitly requires otherwise.
3. Install and configure Tailwind CSS using its current official Vite integration.
4. Install React Router.
5. Install Lucide React for icons.
6. Configure a clean application entry point.
7. Configure the frontend to communicate with the backend through a centralized API configuration.
8. Create a basic application shell.

Do not create the actual portfolio pages yet.

Create only a simple temporary frontend test page showing:

- Application name.
- Frontend status.
- Backend connection status.
- A clear development environment indicator.

The design can be basic at this stage.

## 3. BACKEND INITIALIZATION

Inside the server directory:

1. Initialize Node.js.
2. Configure Express.js.
3. Set up the server entry point.
4. Configure environment variable loading.
5. Configure JSON request parsing.
6. Configure appropriate CORS settings.
7. Configure centralized error handling.
8. Create a health-check endpoint.
9. Create an API versioning structure.

Use a structure that supports future expansion.

Create the endpoint:

GET /api/v1/health

It should return a JSON response indicating that the backend is running.

Do not create all the business endpoints yet.

## 4. FRONTEND-BACKEND COMMUNICATION

Configure the React frontend to communicate with the Express backend.

Create a centralized API service.

Implement a basic connection test using the backend health-check endpoint.

The temporary frontend test page should display:

- Frontend: Running.
- Backend: Connected or Disconnected.

Handle connection errors gracefully.

Do not hardcode API URLs in multiple components.

Use environment variables for configurable endpoints.

## 5. DATABASE PREPARATION

Prepare the project for PostgreSQL integration.

1. Install Prisma.
2. Initialize Prisma using the current recommended setup.
3. Configure the PostgreSQL provider.
4. Create the initial Prisma schema file.
5. Prepare the database connection configuration.
6. Use environment variables for database credentials.

Do not invent database credentials.

Do not assume that a PostgreSQL database already exists.

If a database connection is required but credentials are unavailable, clearly explain what I need to configure.

Do not pretend that database connectivity has been tested if it has not.

Do not run destructive database operations.

## 6. ROOT PROJECT CONFIGURATION

Configure the root package.json to support convenient development commands.

Where appropriate, provide scripts such as:

- npm run dev
- npm run dev:client
- npm run dev:server
- npm run build
- npm run lint

The root development command should start both frontend and backend concurrently.

Use an appropriate development dependency for running both processes.

Ensure that the commands work from the root directory.

## 7. ENVIRONMENT VARIABLES

Create:

- client/.env.example
- server/.env.example

Document the required variables.

Examples may include:

Frontend:
VITE_API_URL

Backend:
PORT
NODE_ENV
DATABASE_URL
CLIENT_URL

Add all environment files containing real credentials to .gitignore.

Never expose private backend environment variables to the frontend.

## 8. GIT CONFIGURATION

Initialize Git if it has not already been initialized.

Create an appropriate .gitignore.

Exclude:

- node_modules
- dist
- build
- .env files
- temporary files
- unnecessary generated files
- local logs

Preserve all important project documentation.

Do not overwrite an existing Git repository or destroy existing commits.

## 9. README DOCUMENTATION

Create a comprehensive README.md explaining:

- Project overview.
- Technology stack.
- Project structure.
- Prerequisites.
- Installation instructions.
- Environment configuration.
- Development commands.
- Frontend startup.
- Backend startup.
- Database setup requirements.
- Troubleshooting common setup errors.

Make the instructions understandable to someone learning full-stack development.

## 10. TESTING AND VERIFICATION

After implementation:

1. Verify that frontend dependencies install correctly.
2. Verify that backend dependencies install correctly.
3. Start the frontend.
4. Start the backend.
5. Test the health-check endpoint.
6. Test frontend-to-backend communication.
7. Verify that the root development command works.
8. Run available linting checks.
9. Run the frontend production build.

Do not claim successful verification for anything you have not actually tested.

If an operation fails, investigate and fix the underlying issue before declaring the phase complete.

## 11. IMPORTANT DEVELOPMENT RULES

- Follow the approved project specification.
- Avoid unnecessary dependencies.
- Do not create placeholder implementations that falsely appear functional.
- Do not generate the full website at this stage.
- Do not start building the admin dashboard.
- Do not implement authentication yet.
- Do not create all database models yet.
- Keep the code clean and maintainable.
- Explain important configuration decisions.
- Do not silently ignore installation or configuration errors.

## 12. COMPLETION REPORT

When finished, provide a report containing:

1. What you initialized.
2. Technologies and dependencies installed.
3. Final project folder structure.
4. Files created or modified.
5. Commands for running the project.
6. Tests performed and their actual results.
7. Any configuration I still need to complete.
8. Any unresolved problems.

STOP after completing this phase.

Do not proceed to the UI/UX design system or actual portfolio development until I review and approve the initialization phase.