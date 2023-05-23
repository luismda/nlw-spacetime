import { FastifyInstance } from 'fastify'

import { jwtVerify } from '../../middlewares/jwt-verify'

import { create } from './create'
import { list } from './list'
import { get } from './get'
import { edit } from './edit'
import { remove } from './remove'

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', jwtVerify)

  app.post('/memories', create)

  app.get('/memories', list)
  app.get('/memories/:id', get)

  app.put('/memories/:id', edit)

  app.delete('/memories/:id', remove)
}
