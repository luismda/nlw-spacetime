import { resolve } from 'node:path'
import { unlink } from 'node:fs/promises'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export async function edit(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const bodySchema = z.object({
    content: z.string().optional(),
    cover_url: z.string().optional(),
    cover_type: z.enum(['image', 'video']).optional(),
    is_public: z.coerce.boolean().default(false),
  })

  const { content, cover_url, cover_type, is_public } = bodySchema.parse(
    request.body,
  )

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

  if (cover_url && !cover_type) {
    return reply.status(400).send({
      message: 'A cover URL exists, but the cover type is not provided.',
    })
  }

  await prisma.memory.update({
    where: {
      id,
    },
    data: {
      content,
      cover_url,
      cover_type,
      is_public,
    },
  })

  if (cover_url) {
    const oldFileURL = new URL(memory.cover_url)
    const oldFilePath = resolve(__dirname, '../../').concat(oldFileURL.pathname)

    await unlink(oldFilePath)
  }

  return reply.status(204).send()
}
