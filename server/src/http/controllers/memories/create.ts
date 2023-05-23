import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    content: z.string(),
    cover_url: z.string(),
    cover_type: z.enum(['image', 'video']),
    is_public: z.coerce.boolean().default(false),
  })

  const { content, cover_url, cover_type, is_public } = bodySchema.parse(
    request.body,
  )

  await prisma.memory.create({
    data: {
      content,
      cover_url,
      cover_type,
      is_public,
      user_id: request.user.sub,
    },
  })

  return reply.status(201).send()
}
