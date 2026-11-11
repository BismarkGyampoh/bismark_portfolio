import { Router } from 'express';
import {
  getContactMessages,
  getContactMessageById,
  createContactMessage,
  updateMessageReadStatus,
  countUnreadMessages,
} from '../../services/contactmessage.service.js';
import { authenticate, authorize } from '../../middleware/auth.middleware.js';
import { contactLimiter } from '../../middleware/rateLimit.middleware.js';
import { contactMessageSchema } from '../../services/contactmessage.service.js';
import type { Request, Response } from 'express';

const router = Router();

const asFirstValue = (value: unknown): string => {
  if (Array.isArray(value)) return typeof value[0] === 'string' ? value[0] : '';
  return typeof value === 'string' ? value : '';
};

// GET /api/v1/contact/messages - Get all contact messages (admin only)
router.get('/', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const unreadOnly = asFirstValue(req.query.unread) === 'true';
    const messages = await getContactMessages(unreadOnly);
    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/contact/message/:id - Get single contact message by ID (admin only)
router.get('/message/:id', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const message = await getContactMessageById(String(req.params.id));
    if (!message) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Contact message not found' } });
    }
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// POST /api/v1/contact/message - Submit new contact message (public endpoint)
router.post('/message', contactLimiter, async (req: Request, res: Response) => {
  const validated = contactMessageSchema.safeParse(req.body);
  if (!validated.success) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Please correct the contact form fields',
        details: validated.error.issues.map(({ path, message }) => ({ path: path.join('.'), message })),
      },
    });
    return;
  }

  await createContactMessage(validated.data);
  res.status(201).json({ success: true, data: { accepted: true } });
});

// PUT /api/v1/contact/message/:id/read - Mark message as read (admin only)
router.put('/message/:id/read', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const message = await updateMessageReadStatus(String(req.params.id), true);
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// GET /api/v1/contact/unread/count - Count unread messages (admin only)
router.get('/unread/count', authenticate, authorize('ADMIN'), async (req: Request, res: Response) => {
  try {
    const count = await countUnreadMessages();
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export { router as contactRouter };