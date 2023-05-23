import { FastifyRequest } from 'fastify'

import { prisma } from '@/lib/prisma'

export async function list(request: FastifyRequest) {
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
        cover_type: memory.cover_type,
        excerpt: memory.content.substring(0, 115).concat('...'),
        created_at: memory.created_at,
      }
    }),
  }
}
