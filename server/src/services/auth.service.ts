import { PrismaClient, type AdminUser } from '@prisma/client'
import argon2 from 'argon2'
import { randomBytes } from 'node:crypto'

const prisma = new PrismaClient()

interface LoginResult {
  user: Omit<AdminUser, 'passwordHash'>
  token: string
}

/**
 * Login administrator with Argon2id password verification.
 * The token is hashed and stored server-side, then compared by fetching active sessions.
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  const user = await prisma.adminUser.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error('Invalid email or password')
  }

  if (!user.isActive) {
    throw new Error('Account is disabled')
  }

  const passwordValid = await argon2.verify(user.passwordHash, password)

  if (!passwordValid) {
    throw new Error('Invalid email or password')
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  const token = randomBytes(32).toString('hex')
  const tokenHash = await argon2.hash(token)

  await prisma.session.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  })

  const { passwordHash, ...userWithoutPassword } = user

  return {
    user: userWithoutPassword,
    token,
  }
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: { passwordHash: true, isActive: true },
  })

  if (!user || !user.isActive || !(await argon2.verify(user.passwordHash, currentPassword))) {
    throw new Error('Current password is incorrect')
  }

  const passwordHash = await argon2.hash(newPassword)
  const revokedAt = new Date()

  await prisma.$transaction([
    prisma.adminUser.update({
      where: { id: userId },
      data: { passwordHash },
    }),
    prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt },
    }),
  ])
}

/**
 * Logout administrator - revoke matching active session.
 */
export async function logout(token: string): Promise<void> {
  const sessions = await prisma.session.findMany({
    where: { revokedAt: null },
  })

  for (const session of sessions) {
    const isMatch = await argon2.verify(session.tokenHash, token).catch(() => false)
    if (isMatch) {
      await prisma.session.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      })
      return
    }
  }
}

/**
 * Get current authenticated user.
 */
export async function getCurrentUser(userId: string): Promise<Omit<AdminUser, 'passwordHash'>> {
  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

/**
 * Generate a new refresh token.
 */
export async function generateRefreshToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const tokenHash = await argon2.hash(token)

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  return token
}

/**
 * Verify if a token is valid and not expired/revoked.
 */
export async function verifyToken(token: string): Promise<{ valid: true; userId: string } | { valid: false }> {
  const sessions = await prisma.session.findMany({
    where: { revokedAt: null },
    include: { user: true },
  })

  for (const session of sessions) {
    const isMatch = await argon2.verify(session.tokenHash, token).catch(() => false)
    if (!isMatch) continue

    if (session.expiresAt < new Date()) {
      return { valid: false }
    }

    return { valid: true, userId: session.userId }
  }

  return { valid: false }
}

/**
 * Check if user has required role.
 */
export function checkRole(userRole: string, requiredRole: 'ADMIN' | 'EDITOR'): boolean {
  if (requiredRole === 'ADMIN') {
    return userRole === 'admin' || userRole === 'superadmin'
  }
  if (requiredRole === 'EDITOR') {
    return userRole === 'admin' || userRole === 'editor' || userRole === 'superadmin'
  }
  return false
}

export { prisma }