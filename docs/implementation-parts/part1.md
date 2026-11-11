# TASK: PLAN AND SPECIFY A COMPLETE FULL-STACK PROFESSIONAL PORTFOLIO WEBSITE

Act as a senior full-stack software architect, UI/UX designer, database architect and technical project manager.

I want you to help me develop a complete, modern, professional, responsive and production-ready personal portfolio website.

This is a real software development project, not a basic demonstration or a simple static portfolio.

## 1. PROJECT OBJECTIVE

Develop a professional personal portfolio website that presents my:
- Professional identity.
- Personal background.
- Educational qualifications.
- Technical skills.
- Professional competencies.
- Projects and practical work.
- Experience and achievements.
- Technical articles and blog posts.
- Contact information and professional links.

The website must also include a secure administrative dashboard that allows me to manage the content without manually editing the source code.

The website should communicate professionalism, technical competence, credibility and attention to detail.

## 2. TECHNOLOGY STACK

Use the following technologies:

### Frontend
- React.js
- Vite
- JavaScript (ES6+)
- Tailwind CSS
- React Router
- Lucide React icons

### Backend
- Node.js
- Express.js
- REST API architecture

### Database
- PostgreSQL
- Prisma ORM

### Additional technologies
- Zod for input validation.
- Secure authentication using appropriate password hashing and HTTP-only cookies.
- Git and GitHub for version control.
- Postman for API testing.
- Cloudinary or a suitable image storage provider for image uploads.

Use compatible, stable versions of these technologies. Verify current setup instructions before implementation.

Do not introduce additional frameworks or libraries without explaining why they are necessary.

## 3. WEBSITE REQUIREMENTS

The public-facing website must contain:

1. Home page.
2. About page.
3. Projects page.
4. Individual project details pages.
5. Skills page or section.
6. Experience page or section.
7. Education section.
8. Blog listing page.
9. Individual blog article pages.
10. Contact page.
11. Downloadable CV functionality.

The website must also include:
- Responsive navigation.
- Mobile navigation menu.
- Dark and light themes.
- Smooth but restrained animations.
- Loading states.
- Error states.
- Custom 404 page.
- SEO-friendly page titles and metadata.
- Accessible forms and navigation.
- Consistent design throughout the application.

## 4. ADMINISTRATIVE DASHBOARD

Create a separate, protected administration interface.

The administrator should be able to:

- Log in and log out.
- View dashboard statistics.
- Create, edit and delete projects.
- Mark projects as featured.
- Manage project categories and technologies.
- Upload and replace project images.
- Add, edit and remove skills.
- Manage education records.
- Manage experience records.
- Create, edit, publish and delete blog posts.
- Manage contact messages.
- Upload and replace the CV.
- Update personal profile information.
- Manage social media links.
- Configure selected website settings.

All content managed through the dashboard must be reflected on the public website through the backend API.

Protect administrative endpoints with server-side authentication and authorization.

Do not rely on hiding frontend elements as a security mechanism.

## 5. DATABASE REQUIREMENTS

Design a normalized and maintainable PostgreSQL database.

Consider the following entities:

- AdminUser
- Profile
- Project
- ProjectCategory
- Technology
- Skill
- SkillCategory
- Education
- Experience
- BlogPost
- BlogCategory
- ContactMessage
- SocialLink
- SiteSetting

Establish appropriate:
- Primary keys.
- Foreign keys.
- Relationships.
- Unique constraints.
- Indexes.
- Created and updated timestamps.

Avoid unnecessary duplication of data.

Use Prisma to manage the schema, migrations and database queries.

## 6. DESIGN DIRECTION

The visual direction must be modern, professional and corporate.

Avoid generic portfolio templates and excessive decorative elements.

The design should feature:
- Strong visual hierarchy.
- Excellent typography.
- Consistent spacing.
- Professional color combinations.
- Clean layouts.
- Attractive project cards.
- Well-designed buttons.
- Subtle hover interactions.
- Carefully selected animations.
- Professional dashboard layouts.

The website must look polished on desktop, tablet and mobile.

Use a consistent design system rather than styling individual components randomly.

## 7. PROJECT ARCHITECTURE

Use a maintainable monorepo structure with separate client and server applications.

The frontend should have clear separation between:
- Components.
- Pages.
- Layouts.
- Hooks.
- Context or state management.
- API services.
- Utilities.
- Assets.

The backend should have clear separation between:
- Routes.
- Controllers.
- Services.
- Middleware.
- Validators.
- Configuration.
- Database access.

Use environment variables for sensitive configuration.

Create appropriate documentation for setup and development.

## 8. SECURITY REQUIREMENTS

Implement security best practices, including:

- Secure password hashing.
- Protected administrative routes.
- Server-side authorization.
- Input validation and sanitization.
- Rate limiting where appropriate.
- Secure cookie configuration.
- CORS configuration.
- Protection against common web vulnerabilities.
- Secure handling of uploaded files.
- No hardcoded secrets or credentials.
- Safe error responses.

Never expose database credentials, private keys, passwords or authentication secrets in frontend code.

## 9. IMPORTANT CONTENT RULES

Do not invent personal information.

Do not fabricate:
- Educational qualifications.
- Work experience.
- Certifications.
- Professional achievements.
- Projects.
- Client testimonials.
- Employment history.

Use clearly identified placeholders where personal information is not yet available.

Make the website easy to personalize later.

## 10. YOUR CURRENT TASK

For now, DO NOT start coding the entire application.

Your responsibility in this phase is to produce a comprehensive technical project specification.

Complete the following:

1. Analyze the requirements.
2. Identify any missing requirements or technical decisions.
3. Recommend the final application architecture.
4. Produce the complete project folder structure.
5. Design the proposed database schema and relationships.
6. Identify the necessary frontend pages and reusable components.
7. Identify the backend API modules and endpoints.
8. Define the authentication and authorization approach.
9. Explain how the frontend, backend and database will communicate.
10. Identify the necessary third-party services.
11. Establish a development and testing strategy.
12. Identify potential technical risks and how to address them.

## 11. DOCUMENTATION TO PRODUCE

Create the following planning documents in the project workspace:

- PROJECT_SPECIFICATION.md
- SYSTEM_ARCHITECTURE.md
- DATABASE_DESIGN.md
- API_DOCUMENTATION.md
- DEVELOPMENT_ROADMAP.md

Make the documentation detailed, technically accurate and practical.

## 12. WORKING RULES

Follow these instructions throughout the project:

1. Do not generate the entire application in one operation.
2. Work in clearly defined development phases.
3. Do not skip a phase.
4. Do not introduce unnecessary features.
5. Do not create duplicate components or redundant code.
6. Follow consistent naming conventions.
7. Prioritize maintainability, security and performance.
8. Explain important technical decisions.
9. Identify assumptions instead of silently treating them as facts.
10. Do not claim a feature works unless it has been implemented and tested.

When this planning phase is complete, present:
- Your proposed architecture.
- The complete folder structure.
- Database design.
- API plan.
- Development roadmap.
- Any unresolved decisions requiring my approval.

STOP after completing the planning documentation.

Do not begin frontend or backend implementation until I review and approve the specification.