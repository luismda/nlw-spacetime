import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function memories(request: FastifyRequest, reply: FastifyReply) {
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
}
