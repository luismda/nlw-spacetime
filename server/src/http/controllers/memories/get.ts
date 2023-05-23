import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const memory = await prisma.memory.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          login: true,
        },
      },
    },
  })

  if (!memory) {
    return reply.status(404).send({
      message: 'Memory not found.',
    })
  }

  if (!memory.is_public && memory.user_id !== request.user.sub) {
    return reply.status(401).send()
  }

  return {
    memory: {
      ...memory,
      user_id: undefined,
    },
  }
}
