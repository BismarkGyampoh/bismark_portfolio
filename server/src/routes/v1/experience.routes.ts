import { Router } from 'express';
import {
  getExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../../services/experience.service.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import type { Request, Response } from 'express';

const router = Router();

const asFirstValue = (value: unknown): string => {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
  return typeof value === 'string' ? value : '';
};

// GET /api/v1/experience - Get all experience records
router.get('/', async (req: Request, res: Response) => {
  try {
    const currentOnly = asFirstValue(req.query.current) === 'true';
    const experiences = await getExperiences(currentOnly);
    res.json({ success: true, data: experiences });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/experience/:id - Get single experience by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const experience = await getExperienceById(String(req.params.id));
    if (!experience) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Experience not found' } });
    }
    res.json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST /api/v1/experience - Create experience (admin only)
router.post('/', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const experience = await createExperience(req.body);
    res.status(201).json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PUT /api/v1/experience/:id - Update experience (admin only)
router.put('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const experience = await updateExperience(String(req.params.id), req.body);
    res.json({ success: true, data: experience });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// DELETE /api/v1/experience/:id - Delete experience (admin only)
router.delete('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    await deleteExperience(String(req.params.id));
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export { router as experienceRouter };