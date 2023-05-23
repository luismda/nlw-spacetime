import { FastifyInstance } from 'fastify'

import { jwtVerify } from '../../middlewares/jwt-verify'

import { create } from './create'

export async function uploadRoutes(app: FastifyInstance) {
  app.addHook('preHandler', jwtVerify)

  app.post('/upload', create)
}
