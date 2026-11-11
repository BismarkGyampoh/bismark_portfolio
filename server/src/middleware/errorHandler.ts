import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

function formatZod(error: ZodError) {
  return error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  let status = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'Internal server error';
  let details: unknown;

  if (err instanceof ZodError) {
    status = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = formatZod(err);
  } else if (err instanceof AppError) {
    status = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err && typeof err === 'object' && 'statusCode' in err) {
    const e = err as { statusCode?: number; message?: string; code?: string; details?: unknown };
    status = typeof e.statusCode === 'number' ? e.statusCode : 500;
    code = e.code ?? (status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR');
    message = status >= 500 && env.isProduction ? 'Internal server error' : (e.message ?? message);
    details = e.details;
  } else if (err instanceof Error) {
    message = env.isProduction ? 'Internal server error' : err.message;
  }

  if (!env.isProduction && status >= 500 && err instanceof Error) {
    console.error('[error]', err.stack ?? err.message);
  }

  const payload: { success: false; error: { code: string; message: string; details?: unknown } } = {
    success: false,
    error: { code, message },
  };
  if (details !== undefined && status < 500) payload.error.details = details;
  res.status(status).json(payload);
}
