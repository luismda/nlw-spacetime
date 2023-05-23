import { FastifyReply, FastifyRequest } from 'fastify'
import axios from 'axios'
import { z } from 'zod'

import { env } from '@/env'
import { prisma } from '@/lib/prisma'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    code: z.string(),
  })

  const { code } = bodySchema.parse(request.body)

  const paramsSchema = z.object({
    client: z.enum(['web', 'mobile']),
  })

  const { client } = paramsSchema.parse(request.params)

  const githubClientId =
    client === 'web' ? env.GITHUB_WEB_CLIENT_ID : env.GITHUB_MOBILE_CLIENT_ID

  const githubClientSecret =
    client === 'web'
      ? env.GITHUB_WEB_CLIENT_SECRET
      : env.GITHUB_MOBILE_CLIENT_SECRET

  const accessTokenResponse = await axios.post<{ access_token: string }>(
    'https://github.com/login/oauth/access_token',
    null,
    {
      params: {
        client_id: githubClientId,
        client_secret: githubClientSecret,
        code,
      },
      headers: {
        Accept: 'application/json',
      },
    },
  )

  const { access_token } = accessTokenResponse.data

  const userResponse = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  const userSchema = z.object({
    id: z.number(),
    login: z.string(),
    name: z.string(),
    avatar_url: z.string().url(),
  })

  const userInfo = userSchema.parse(userResponse.data)

  let user = await prisma.user.findUnique({
    where: {
      github_id: userInfo.id,
    },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        github_id: userInfo.id,
        login: userInfo.login,
        name: userInfo.name,
        avatar_url: userInfo.avatar_url,
      },
    })
  }

  const token = await reply.jwtSign(
    {
      name: user.name,
      avatarUrl: user.avatar_url,
    },
    {
      sub: user.id,
      expiresIn: '7 days',
    },
  )

  return reply.status(201).send({
    token,
  })
}
