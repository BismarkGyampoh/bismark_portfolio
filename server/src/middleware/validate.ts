import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { AppError } from '../utils/AppError.js';

/**
 * Reusable Zod validation middleware for body/query/params.
 * Prepared for future contact forms, auth, and content management.
 */
export function validate<T>(schema: ZodSchema<T>, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
      next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', details));
      return;
    }
    // attach parsed value for downstream handlers (typed usage later)
    (req as Request & { validated?: T }).validated = result.data;
    next();
  };
}
