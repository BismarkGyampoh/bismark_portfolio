import { Router } from 'express';
import { healthRouter } from './v1/health.routes.js';
import { projectsRouter } from './v1/projects.routes.js';
import { skillsRouter } from './v1/skills.routes.js';
import { experienceRouter } from './v1/experience.routes.js';
import { educationRouter } from './v1/education.routes.js';
import { blogRouter } from './v1/blog.routes.js';
import { contactRouter } from './v1/contact.routes.js';
import { mediaRouter } from './v1/media.routes.js';
import { profileRouter } from './v1/profile.routes.js';

export const apiV1Router = Router();

apiV1Router.use('/health', healthRouter);
apiV1Router.use('/projects', projectsRouter);
apiV1Router.use('/media', mediaRouter);
apiV1Router.use('/profile', profileRouter);
apiV1Router.use('/skills', skillsRouter);
apiV1Router.use('/experience', experienceRouter);
apiV1Router.use('/education', educationRouter);
apiV1Router.use('/blog', blogRouter);
apiV1Router.use('/contact', contactRouter);
