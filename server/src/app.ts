import { resolve } from 'node:path'
import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyJWT from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'

import { env } from './env'

import { authRoutes } from './http/controllers/auth/routes'
import { memoriesRoutes } from './http/controllers/memories/routes'
import { uploadRoutes } from './http/controllers/upload/routes'
import { usersRoutes } from './http/controllers/users/routes'
import { ZodError } from 'zod'

export const app = fastify()

app.register(fastifyCors, {
  origin: true,
})

app.register(fastifyStatic, {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(fastifyMultipart)

app.register(fastifyJWT, {
  secret: env.JWT_SECRET,
})

app.register(authRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)
app.register(usersRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
