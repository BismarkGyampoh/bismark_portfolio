import { Router } from 'express';
import {
  getSkillCategories,
  getSkillsByCategory,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  createSkillCategory,
} from '../../services/skill.service.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import type { Request, Response } from 'express';

const router = Router();

const asFirstValue = (value: unknown): string => {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
  return typeof value === 'string' ? value : '';
};

// GET /api/v1/skills/categories - Get all skill categories
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await getSkillCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/skills - Get all skills
router.get('/', async (req: Request, res: Response) => {
  try {
    const categoryId = asFirstValue(req.query.categoryId);
    const skills = categoryId ? await getSkillsByCategory(categoryId) : await getSkillsByCategory('');
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/skills/:id - Get single skill by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const skill = await getSkillById(String(req.params.id));
    if (!skill) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Skill not found' } });
    }
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST /api/v1/skills - Create skill (admin only)
router.post('/', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const skill = await createSkill(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PUT /api/v1/skills/:id - Update skill (admin only)
router.put('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const skill = await updateSkill(String(req.params.id), req.body);
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// DELETE /api/v1/skills/:id - Delete skill (admin only)
router.delete('/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    await deleteSkill(String(req.params.id));
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST /api/v1/skills/categories - Create skill category (admin only)
router.post('/categories', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const category = await createSkillCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export { router as skillsRouter };