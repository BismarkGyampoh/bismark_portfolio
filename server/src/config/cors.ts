import cors, { type CorsOptions } from 'cors';
import type { NextFunction, Request, Response } from 'express';
import { env } from './env.js';

const allowedOrigins = new Set(env.trustedOrigins);

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, !env.isProduction);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);

export function enforceTrustedOrigin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    next();
    return;
  }

  const origin = req.get('origin');
  if (origin && !allowedOrigins.has(origin)) {
    res.status(403).json({
      success: false,
      error: { code: 'ORIGIN_NOT_ALLOWED', message: 'Request origin is not allowed' },
    });
    return;
  }

  next();
}
