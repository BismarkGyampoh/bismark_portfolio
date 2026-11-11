import { Router } from 'express';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByCategory,
  getFeaturedProjects,
  getTechnologies,
  getProjectCategories,
  createProjectCategory,
} from '../../services/project.service.js';
import { z } from 'zod';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import type { Request, Response } from 'express';

const router = Router();

const asFirstValue = (value: unknown): string => {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
  return typeof value === 'string' ? value : '';
};

// Administrative project listing includes drafts; public listing below never does.
router.get('/admin', authenticate, authorize('ADMIN'), async (_req: Request, res: Response) => {
  try {
    const projects = await getProjects();
    res.json({ success: true, data: projects });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to load projects' });
  }
});

router.get('/technologies', async (_req: Request, res: Response) => {
  try {
    const technologies = await getTechnologies();
    res.json({ success: true, data: technologies });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to load technologies' });
  }
});

router.get('/categories', async (_req: Request, res: Response) => {
  try {
    res.json({ success: true, data: await getProjectCategories() });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to load project categories' });
  }
});

router.post('/categories', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const category = await createProjectCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    const isValidationError = error instanceof z.ZodError;
    res.status(isValidationError ? 400 : 500).json({
      success: false,
      error: isValidationError ? error.issues[0]?.message : 'Failed to create project category',
    });
  }
});

// GET /api/v1/projects - Publicly available projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const categoryId = asFirstValue(req.query.categoryId);
    const featured = asFirstValue(req.query.featured);
    const projects = await getProjects({
      published: true,
      categoryId: categoryId || undefined,
      featured: featured ? featured === 'true' : undefined,
    });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/projects/featured - Get featured projects
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const projects = await getFeaturedProjects();
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/projects/category/:slug - Get projects by category
router.get('/category/:slug', async (req: Request, res: Response) => {
  try {
    const projects = await getProjectsByCategory(String(req.params.slug));
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/projects/:slug - Get single project by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const project = await getProjectBySlug(String(req.params.slug));
    if (!project) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST /api/v1/projects - Create project (admin only)
router.post('/', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const project = await createProject(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PUT /api/v1/projects/:slug - Update project (admin only)
router.put('/:slug', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const project = await updateProject(String(req.params.slug), req.body);
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// DELETE /api/v1/projects/:slug - Delete project (admin only)
router.delete('/:slug', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    await deleteProject(String(req.params.slug));
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export { router as projectsRouter };