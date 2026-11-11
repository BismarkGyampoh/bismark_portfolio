import { Router, type Request, type Response } from 'express'
import { authenticate } from '../../middleware/auth.middleware.js'
import { prisma } from '../../services/prisma.service.js'

const router = Router()

/**
 * Dashboard statistics endpoint.
 * Returns overview statistics for the admin dashboard.
 */
router.get('/stats', authenticate, async (_req: Request, res: Response) => {
  try {
    const [
      totalProjects,
      projectsPublished,
      projectsDraft,
      totalBlogPosts,
      publishedBlogPosts,
      totalMessages,
      unreadMessages,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.project.count({ where: { published: false } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ])

    return res.json({
      success: true,
      data: {
        totalProjects: totalProjects || 0,
        projectsPublished: projectsPublished || 0,
        projectsDraft: projectsDraft || 0,
        totalBlogPosts: totalBlogPosts || 0,
        publishedBlogPosts: publishedBlogPosts || 0,
        unreadMessages: unreadMessages || 0,
        totalMessages: totalMessages || 0,
        recentActivity: 'Dashboard loaded successfully',
      },
    })
  } catch (error: unknown) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to load dashboard statistics',
    })
  }
})

export default router