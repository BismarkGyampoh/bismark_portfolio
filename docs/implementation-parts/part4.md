# PART 4: BUILD THE PUBLIC PORTFOLIO FRONTEND

You are now responsible for implementing the complete public-facing frontend of my personal portfolio website.

This is Part 4 of a larger full-stack portfolio development project. Follow the existing project architecture and do not introduce unnecessary changes to the established technology stack.

## 1. FIRST: REVIEW THE EXISTING PROJECT

Before writing code:

1. Inspect the entire existing project structure.
2. Read:
   - `PROJECT_SPECIFICATION.md`
   - `SYSTEM_ARCHITECTURE.md`
   - `DESIGN_SYSTEM.md`
   - `DEVELOPMENT_ROADMAP.md`
3. Review the existing frontend initialization and design system from Parts 2 and 3.
4. Identify reusable components, existing styles, routes, and dependencies.
5. Check whether the previous design implementation follows the approved visual direction.

Do not recreate the project or overwrite existing working configurations.

If the design system has not been finalized, identify this and resolve the inconsistency before proceeding.

## 2. APPROVED VISUAL DIRECTION

The portfolio must follow a **Modern Editorial** visual direction.

The website should look like a carefully designed professional portfolio, not a generic developer template.

Design requirements:

- Light-first interface.
- White and off-white backgrounds.
- Strong, sophisticated typography.
- Large and visually distinctive headings.
- Generous whitespace.
- Carefully structured content layouts.
- Subtle blue accents.
- Refined borders and shadows.
- Sophisticated project presentation.
- Smooth but restrained animations.
- Consistent spacing and alignment.
- Excellent desktop and mobile experiences.

Use the existing design tokens and theme system.

Dark mode must remain optional. Light mode should be the default for first-time visitors.

Avoid:
- Excessive gradients.
- Unnecessary glassmorphism.
- Excessive rounded cards.
- Oversized decorative icons.
- Too many animations.
- Dark backgrounds dominating the interface.
- Generic dashboard-style layouts on public pages.

## 3. WEBSITE STRUCTURE

Build the following public-facing pages:

1. Home
2. About
3. Projects
4. Project Details
5. Skills
6. Experience and Education
7. Blog
8. Blog Article
9. Contact

Use React Router for navigation.

Create reusable layouts, page components, and shared UI components.

## 4. HOMEPAGE

Build a visually impressive homepage containing:

### Navigation
- Professional logo or initials.
- Home.
- About.
- Projects.
- Skills.
- Experience.
- Blog.
- Contact.
- Light/dark theme toggle.
- Download CV button.

The navigation must be responsive, with a working mobile navigation menu.

### Hero Section
Include:
- A strong introductory headline.
- My name as a prominent visual element.
- Professional title.
- A concise professional introduction.
- A profile image area.
- Primary CTA: View My Work.
- Secondary CTA: Contact Me.
- Social media links.

Do not invent my name, qualifications, employment history, or achievements. Use clearly identifiable editable placeholders where information is unavailable.

### Professional Introduction
Create a short section explaining:
- Who I am.
- What I do.
- My professional interests.
- The problems I am interested in solving.

### Featured Projects
Display selected projects using visually engaging project cards.

Each card should support:
- Project title.
- Project image or screenshot.
- Short description.
- Technology tags.
- View Project link.

### Skills Preview
Display selected technical and professional skills in a structured visual layout.

### Experience and Education Preview
Show a brief overview with a link to the complete section.

### Latest Articles
Display recent blog posts if available.

### Contact CTA
Include a strong closing section encouraging visitors to contact me.

### Footer
Include:
- Logo or initials.
- Short description.
- Navigation links.
- Social media links.
- Copyright information.
- Back-to-top functionality.

## 5. ABOUT PAGE

Create a complete About page with:

- Professional introduction.
- Profile image.
- Background and interests.
- Professional goals.
- Areas of interest.
- Personal working philosophy.
- Download CV link.
- Contact CTA.

Use a thoughtful editorial layout rather than a collection of generic cards.

## 6. PROJECTS PAGE

Create a complete projects showcase.

Requirements:

- Responsive project grid.
- Project category filters.
- Project thumbnails.
- Project titles.
- Short descriptions.
- Technology tags.
- Links to individual project pages.
- Empty state when no projects match a filter.

Project categories should be configurable.

Use mock project data for now. Do not invent completed projects or present fictional work as my actual achievements.

Clearly identify sample content so it can be replaced later.

## 7. PROJECT DETAILS PAGE

Create a reusable project details template.

Each project page should support:

- Project title.
- Project overview.
- Main project image.
- Problem statement.
- Project objectives.
- Proposed solution.
- Implementation process.
- Technologies used.
- Key features.
- Screenshots or image gallery.
- Challenges and lessons learned.
- Live project link.
- Source code link.
- Related projects.

Use dynamic routing, such as `/projects/:slug`.

Do not display links that lead nowhere. If a project does not have a live demo or source code, hide the corresponding action.

## 8. SKILLS PAGE

Organize skills into meaningful categories.

Possible categories include:

- Programming Languages.
- Frontend Development.
- Backend Development.
- Databases.
- Data Analysis.
- Business Intelligence.
- Systems Analysis.
- Project Management.
- Tools and Technologies.
- Professional Skills.

Do not automatically claim that I possess every listed skill. Use sample data clearly marked for replacement.

Avoid meaningless percentage-based skill ratings unless there is a genuine reason to use them.

## 9. EXPERIENCE AND EDUCATION PAGE

Create a clean timeline-style presentation.

Support:
- Education.
- Certifications.
- Work experience.
- Internships.
- Leadership experience.
- Relevant activities.

Each entry should support:
- Institution or organization.
- Position or qualification.
- Start and end dates.
- Description.
- Relevant achievements.

Do not fabricate qualifications, dates, organizations, or employment history.

## 10. BLOG PAGE

Create a blog listing page with:

- Featured article.
- Article cards.
- Cover images.
- Publication dates.
- Categories.
- Short excerpts.
- Article reading links.
- Category filtering.

Create a reusable blog article page using `/blog/:slug`.

Article pages should support:
- Title.
- Cover image.
- Publication date.
- Category.
- Reading content.
- Related articles.
- Back-to-blog navigation.

Use clearly identified sample articles for development.

## 11. CONTACT PAGE

Build a professional contact page.

Include:
- Contact introduction.
- Email address placeholder.
- Social links.
- Location placeholder.
- Contact form.

The form should contain:
- Full name.
- Email address.
- Subject.
- Message.

Implement client-side validation and clear success/error states.

For now, prepare the form to integrate with the backend API in Part 5. Do not pretend messages have been delivered or stored.

## 12. REUSABLE COMPONENTS

Create reusable components where appropriate:

- Navbar.
- Mobile navigation.
- Footer.
- Theme toggle.
- Buttons.
- Section headings.
- Project cards.
- Skill badges.
- Experience timeline.
- Education timeline.
- Blog cards.
- Contact form.
- Image gallery.
- Loading states.
- Empty states.
- Page transitions.

Keep components modular and maintainable.

## 13. VISUAL ASSETS

Visual presentation is important.

Use appropriate images and screenshots for:
- Profile presentation.
- Project previews.
- Blog covers.
- Project detail galleries.

Use local assets or properly licensed image sources.

Create organized asset directories.

Do not use random images that misrepresent actual projects.

Where real assets are unavailable, use tasteful placeholders that can easily be replaced.

Prioritize actual project screenshots and interface mockups over decorative stock photography.

## 14. RESPONSIVENESS

The website must work properly on:

- Large desktop screens.
- Standard laptops.
- Tablets.
- Mobile phones.

Pay particular attention to:
- Navigation.
- Hero section.
- Project grids.
- Typography.
- Images.
- Contact forms.
- Spacing.
- Horizontal overflow.

Do not simply shrink the desktop layout. Adapt the composition for smaller screens.

## 15. FUNCTIONAL REQUIREMENTS

Ensure that:

- Navigation links work.
- React Router routes work.
- Theme switching works.
- Theme preference persists.
- Mobile menu works.
- Project filters work.
- Project detail pages load dynamically.
- Blog filters work.
- Blog article routes work.
- Contact form validation works.
- Download CV action works when a CV file exists.
- Social links are configurable.
- Buttons have meaningful actions.
- No unnecessary placeholder links remain.

## 16. TECHNICAL REQUIREMENTS

Use the existing stack:

- React.
- Vite.
- JavaScript.
- Tailwind CSS.
- React Router.
- Lucide React.

Additional requirements:

- Use reusable components.
- Keep content data separate from presentation.
- Use clean folder organization.
- Avoid unnecessary dependencies.
- Avoid duplicated code.
- Use semantic HTML.
- Follow accessibility best practices.
- Optimize images.
- Ensure there are no console errors.

Create structured mock data files for projects, skills, experience, education, blog posts, and profile information.

## 17. IMPORTANT PROJECT BOUNDARIES

This phase is ONLY for the public-facing frontend.

DO NOT:

- Build the backend.
- Create database models.
- Implement authentication.
- Build the admin dashboard.
- Connect to a production database.
- Implement real contact message storage.
- Deploy the application.
- Rewrite the existing architecture unnecessarily.

These will be handled in later phases.

## 18. TESTING AND VERIFICATION

After implementation:

1. Run the frontend.
2. Test every public route.
3. Test navigation.
4. Test mobile navigation.
5. Test theme switching.
6. Test project filtering.
7. Test project detail routes.
8. Test blog filtering and article routes.
9. Test contact form validation.
10. Test responsiveness.
11. Check for console errors.
12. Run the production build.

Fix errors before reporting completion.

## 19. FINAL REPORT

When finished, provide:

- Pages implemented.
- Components created.
- Routes created.
- Features implemented.
- Files and folders added.
- Dependencies installed.
- Tests performed.
- Build results.
- Known limitations.
- Issues that still need attention.

Clearly distinguish between implemented functionality and functionality that still requires backend integration.

STOP after completing Part 4.

Do not start Part 5 automatically. Wait for my review and approval.