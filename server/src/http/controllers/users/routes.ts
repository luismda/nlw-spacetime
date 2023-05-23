import { FastifyInstance } from 'fastify'

import { memories } from './memories'
import { memory } from './memory'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/users/:username/memories', memories)
  app.get('/users/:username/memories/:memoryId', memory)
}
