import { Router } from 'express';
import {
  getEducations,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../../services/education.service.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import type { Request, Response } from 'express';

const router = Router();

const asFirstValue = (value: unknown): string => {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
  return typeof value === 'string' ? value : '';
};

// GET /api/v1/education - Get all education records
router.get('/', async (req: Request, res: Response) => {
  try {
    const currentOnly = asFirstValue(req.query.current) === 'true';
    const educations = await getEducations(currentOnly);
    res.json({ success: true, data: educations });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/education/:id - Get single education by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const education = await getEducationById(String(req.params.id));
    if (!education) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Education not found' } });
    }
    res.json({ success: true, data: education });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST /api/v1/education - Create education (admin only)
router.post('/', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const education = await createEducation(req.body);
    res.status(201).json({ success: true, data: education });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PUT /api/v1/education/:id - Update education (admin only)
router.put('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const education = await updateEducation(String(req.params.id), req.body);
    res.json({ success: true, data: education });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// DELETE /api/v1/education/:id - Delete education (admin only)
router.delete('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    await deleteEducation(String(req.params.id));
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export { router as educationRouter };