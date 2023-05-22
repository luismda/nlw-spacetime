import 'dotenv/config'

import { resolve } from 'node:path'
import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyJWT from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'

import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'
import { memoriesRoutes } from './routes/memories'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(fastifyCors, {
  origin: true,
})

app.register(fastifyStatic, {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(fastifyMultipart)

app.register(fastifyJWT, {
  secret: process.env.JWT_SECRET ?? '',
})

app.register(authRoutes)
app.register(uploadRoutes)
app.register(memoriesRoutes)
app.register(usersRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
  })
