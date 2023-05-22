import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../lib/prisma'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/users/:username/memories', async (request, reply) => {
    const paramsSchema = z.object({
      username: z.string(),
    })

    const { username } = paramsSchema.parse(request.params)

    const user = await prisma.user.findUnique({
      select: {
        name: true,
        login: true,
        avatar_url: true,
      },
      where: {
        login: username,
      },
    })

    if (!user) {
      return reply.status(404).send({
        message: 'User not found.',
      })
    }

    const memories = await prisma.memory.findMany({
      where: {
        is_public: true,
        user: {
          login: username,
        },
      },
    })

    return {
      user,
      memories: memories.map((memory) => {
        return {
          id: memory.id,
          cover_url: memory.cover_url,
          cover_type: memory.cover_type,
          excerpt: memory.content.substring(0, 115).concat('...'),
          created_at: memory.created_at,
        }
      }),
    }
  })

  app.get('/users/:username/memories/:memoryId', async (request, reply) => {
    const paramsSchema = z.object({
      username: z.string(),
      memoryId: z.string().uuid(),
    })

    const { username, memoryId } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findFirst({
      where: {
        id: memoryId,
        is_public: true,
        user: {
          login: username,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            login: true,
            avatar_url: true,
          },
        },
      },
    })

    if (!memory) {
      return reply.status(404).send({
        message: 'Memory not found.',
      })
    }

    return {
      memory: {
        ...memory,
        user_id: undefined,
        is_public: undefined,
      },
    }
  })
}
