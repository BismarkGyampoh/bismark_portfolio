import { Router, type Request, type Response } from 'express'
import { changePassword, login, logout, getCurrentUser, generateRefreshToken } from '../../services/auth.service.js'
import { z } from 'zod'
import { authenticate } from '../../middleware/auth.middleware.js'
import { loginLimiter, passwordChangeLimiter } from '../../middleware/rateLimit.middleware.js'
import { env } from '../../config/env.js'

const router = Router()

// Login schema validation
const loginEmailSchema = z.string().trim().refine(
  (email) => z.string().email().safeParse(email).success || /^[^\s@]+@localhost$/i.test(email),
  'Valid email required',
)

const loginSchema = z.object({
  email: loginEmailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters')
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required').max(128),
  newPassword: z.string().min(12, 'New password must be at least 12 characters').max(128),
}).refine((value) => value.currentPassword !== value.newPassword, {
  message: 'New password must be different from the current password',
  path: ['newPassword'],
})

const cookieSameSite: 'none' | 'lax' = env.isProduction ? 'none' : 'lax'
const cookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: cookieSameSite,
  path: '/',
}

// GET /api/v1/auth/me - Get current authenticated user
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await getCurrentUser(req.user!.id)
    res.json({
      success: true,
      data: user
    })
  } catch (error: any) {
    const notFound = error instanceof Error && error.message === 'User not found'
    res.status(notFound ? 404 : 500).json({
      success: false,
      error: notFound ? 'User not found' : 'Unable to load the current user'
    })
  }
})

// POST /api/v1/auth/login - Administrator login
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.safeParse(req.body)

    if (!validated.success) {
      return res.status(400).json({
        success: false,
        error: validated.error.format()
      })
    }

    const { email, password } = validated.data
    const { user, token } = await login(email, password)

    res.cookie('auth_token', token, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.json({
      success: true,
      data: user
    })
  } catch (error: unknown) {
    const rejected = error instanceof Error
      && (error.message === 'Invalid email or password' || error.message === 'Account is disabled')
    if (!rejected) console.error('[auth] Login request failed')
    res.status(rejected ? 401 : 500).json({
      success: false,
      error: rejected ? 'Invalid email or password' : 'Unable to complete login'
    })
  }
})

router.put('/password', authenticate, passwordChangeLimiter, async (req: Request, res: Response) => {
  const validated = changePasswordSchema.safeParse(req.body)
  if (!validated.success) {
    return res.status(400).json({
      success: false,
      error: validated.error.issues[0]?.message || 'Invalid password change request',
    })
  }

  try {
    await changePassword(req.user!.id, validated.data.currentPassword, validated.data.newPassword)
    res.clearCookie('auth_token', { ...cookieOptions })
    res.json({
      success: true,
      data: { message: 'Password updated. Sign in again with your new password.' },
    })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Current password is incorrect') {
      return res.status(400).json({ success: false, error: error.message })
    }

    console.error('[auth] Password change failed')
    return res.status(500).json({ success: false, error: 'Unable to change password' })
  }
})

// POST /api/v1/auth/logout - Administrator logout
router.post('/logout', authenticate, async (req: Request, res: Response) => {
  try {
    await logout(req.cookies.auth_token || '')

    res.clearCookie('auth_token', {
      ...cookieOptions
    })

    res.json({
      success: true,
      data: { message: 'Successfully logged out' }
    })
  } catch {
    res.status(500).json({
      success: false,
      error: 'Unable to complete logout'
    })
  }
})

// POST /api/v1/auth/refresh - Refresh authentication token
router.post('/refresh', authenticate, async (req: Request, res: Response) => {
  try {
    const currentToken = req.cookies?.auth_token
    if (!currentToken || !req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' })
    }

    await logout(currentToken)
    const newToken = await generateRefreshToken(req.user.id)
    res.cookie('auth_token', newToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      success: true,
      data: { message: 'Session refreshed' }
    })
  } catch {
    res.status(500).json({
      success: false,
      error: 'Unable to refresh session'
    })
  }
})

export default router