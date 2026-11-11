import { Router } from 'express';
import {
  getBlogCategories,
  createBlogCategory,
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getPublishedBlogPosts,
} from '../../services/blogpost.service.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import type { Request, Response } from 'express';

const router = Router();

const asFirstValue = (value: unknown): string => {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
  return typeof value === 'string' ? value : '';
};

router.get('/admin', authenticate, authorize('ADMIN'), async (_req: Request, res: Response) => {
  try {
    const posts = await getBlogPosts();
    res.json({ success: true, data: posts });
  } catch {
    res.status(500).json({ success: false, error: 'Failed to load blog posts' });
  }
});

// GET /api/v1/blog - Publicly available articles only
router.get('/', async (req: Request, res: Response) => {
  try {
    const categoryId = asFirstValue(req.query.categoryId);
    const posts = await getBlogPosts(true, categoryId || undefined);
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/blog/categories - Get all blog categories
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await getBlogCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/blog/published - Get published blog posts
router.get('/published', async (req: Request, res: Response) => {
  try {
    const posts = await getPublishedBlogPosts();
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/blog/category/:slug - Get blog posts by category
router.get('/category/:slug', async (req: Request, res: Response) => {
  try {
    const posts = await getBlogPosts(true, String(req.params.slug));
    res.json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/blog/:slug - Get single blog post by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const post = await getBlogPostBySlug(String(req.params.slug));
    if (!post) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Blog post not found' } });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST /api/v1/blog - Create blog post (admin only)
router.post('/', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const post = await createBlogPost(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// PUT /api/v1/blog/:slug - Update blog post (admin only)
router.put('/:slug', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const post = await updateBlogPost(String(req.params.slug), req.body);
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// DELETE /api/v1/blog/:slug - Delete blog post (admin only)
router.delete('/:slug', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    await deleteBlogPost(String(req.params.slug));
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST /api/v1/blog/categories - Create blog category (admin only)
router.post('/categories', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const category = await createBlogCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export { router as blogRouter };