import rateLimit from 'express-rate-limit'

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: { success: false, error: 'Too many requests, please try again later' }
})

/**
 * Login rate limiter - stricter limits for authentication
 */
export const loginLimiter = rateLimit({
  max: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: { success: false, error: 'Too many login attempts, please try again in 15 minutes' }
})

export const passwordChangeLimiter = rateLimit({
  max: 5,
  windowMs: 15 * 60 * 1000,
  message: { success: false, error: 'Too many password change attempts, please try again later' },
})

export const contactLimiter = rateLimit({
  max: 5,
  windowMs: 15 * 60 * 1000,
  message: { success: false, error: 'Too many contact submissions, please try again later' },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

/**
 * Dashboard rate limiter - moderate limits for dashboard operations
 */
export const dashboardLimiter = rateLimit({
  max: 30,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: { success: false, error: 'Too many dashboard requests, please try again later' }
})