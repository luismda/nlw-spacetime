import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function memory(request: FastifyRequest, reply: FastifyReply) {
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
}
