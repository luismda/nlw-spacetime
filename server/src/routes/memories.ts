import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/memories', async (request) => {
    const memories = await prisma.memory.findMany({
      where: {
        user_id: request.user.sub,
      },
      orderBy: {
        created_at: 'asc',
      },
    })

    return {
      memories: memories.map((memory) => {
        return {
          id: memory.id,
          cover_url: memory.cover_url,
          excerpt: memory.content.substring(0, 115).concat('...'),
          created_at: memory.created_at,
        }
      }),
    }
  })

  app.get('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!memory.is_public && memory.user_id !== request.user.sub) {
      return reply.status(401).send()
    }

    return {
      memory,
    }
  })

  app.post('/memories', async (request, reply) => {
    const bodySchema = z.object({
      content: z.string(),
      cover_url: z.string(),
      is_public: z.coerce.boolean().default(false),
    })

    const { content, cover_url, is_public } = bodySchema.parse(request.body)

    await prisma.memory.create({
      data: {
        content,
        cover_url,
        is_public,
        user_id: request.user.sub,
      },
    })

    return reply.status(201).send()
  })

  app.put('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      cover_url: z.string(),
      is_public: z.coerce.boolean().default(false),
    })

    const { content, cover_url, is_public } = bodySchema.parse(request.body)

    const memory = await prisma.memory.findUnique({
      where: {
        id,
      },
    })

    if (!memory) {
      return reply.status(400).send({
        message: 'Memory not found.',
      })
    }

    if (memory.user_id !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        cover_url,
        is_public,
      },
    })

    return reply.status(204).send()
  })

  app.delete('/memories/:id', async (request, reply) => {
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
      return reply.status(400).send({
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
  })
}
