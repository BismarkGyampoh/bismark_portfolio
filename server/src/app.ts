import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'node:url';
import { corsMiddleware, enforceTrustedOrigin } from './config/cors.js';
import { env } from './config/env.js';
import { apiV1Router } from './routes/index.js';
import authRouter from './routes/v1/auth.routes.js';
import dashboardRouter from './routes/v1/dashboard.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

/**
 * Express application configuration (separate from server startup).
 * Backend foundation only — no DB-dependent CRUD, auth system, or fake portfolio data.
 */
export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(corsMiddleware);
  app.use(enforceTrustedOrigin);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan(env.isProduction ? 'combined' : 'dev'));
  app.use('/uploads/media', express.static(fileURLToPath(new URL('../uploads/media/', import.meta.url)), {
    dotfiles: 'deny',
    index: false,
    maxAge: env.isProduction ? '1d' : 0,
    setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff'),
  }));

  app.use('/api/v1', apiV1Router);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/dashboard', dashboardRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
