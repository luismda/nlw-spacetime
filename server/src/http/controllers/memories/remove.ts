import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const memory = await prisma.memory.findUnique({
    where: {
      id,
    },
  })

  if (!memory) {
    return reply.status(404).send({
      message: 'Memory not found.',
    })
  }

  if (memory.user_id !== request.user.sub) {
    return reply.status(401).send()
  }

  await prisma.memory.delete({
    where: {
      id,
    },
  })

  return reply.status(204).send()
}
