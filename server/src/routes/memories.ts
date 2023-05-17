import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
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
        }
      }),
    }
  })

  app.get('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

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
        user_id: 'bc2f4de6-b281-42e5-8e20-6ad9a40d537f',
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

    await prisma.memory.delete({
      where: {
        id,
      },
    })

    return reply.status(204).send()
  })
}
