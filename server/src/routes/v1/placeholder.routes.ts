import { Router } from 'express';

function notImplemented(resource: string) {
  const router = Router();
  router.use((_req, res) => {
    res.status(501).json({
      success: false,
      error: {
        code: 'NOT_IMPLEMENTED',
        message: `${resource} endpoints are not implemented yet (planned for a later phase).`,
      },
    });
  });
  return router;
}

export const projectsRouter = notImplemented('Projects');
export const skillsRouter = notImplemented('Skills');
export const experienceRouter = notImplemented('Experience');
export const educationRouter = notImplemented('Education');
export const profileRouter = notImplemented('Profile');
export const contactRouter = notImplemented('Contact');
export const blogRouter = notImplemented('Blog');
