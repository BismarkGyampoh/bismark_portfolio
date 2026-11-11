import { Request, Response, NextFunction } from 'express'
import { verifyToken, checkRole, getCurrentUser } from '../services/auth.service.js'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: string
      }
    }
  }
}

/**
 * Authentication middleware - verifies JWT cookie and populates req.user
 */
export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.auth_token

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
      return
    }

    const verification = await verifyToken(token)

    if (!verification.valid) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      })
      return
    }

    const user = await getCurrentUser(verification.userId)

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: 'Account is disabled'
      })
      return
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    }

    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Authentication error'
    })
  }
}

/**
 * Authorization middleware - checks if user has required role
 * @requiredRole - 'ADMIN' or 'EDITOR'
 */
export function authorize(requiredRole: 'ADMIN' | 'EDITOR') {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required'
        })
        return
      }

      const hasRole = checkRole(req.user.role, requiredRole)

      if (!hasRole) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions'
        })
        return
      }

      next()
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Authorization error'
      })
    }
  }
}

export { verifyToken }