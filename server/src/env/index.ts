import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  GITHUB_WEB_CLIENT_ID: z.string(),
  GITHUB_WEB_CLIENT_SECRET: z.string(),
  GITHUB_MOBILE_CLIENT_ID: z.string(),
  GITHUB_MOBILE_CLIENT_SECRET: z.string(),
  JWT_SECRET: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data
