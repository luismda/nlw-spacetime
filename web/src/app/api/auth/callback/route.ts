import { NextRequest, NextResponse } from 'next/server'
import { api } from '@/lib/api'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  const sessionResponse = await api.post<{ token: string }>('/session/web', {
    code,
  })

  const { token } = sessionResponse.data

  const redirectTo = request.cookies.get('redirectTo')?.value
  const redirectURL = redirectTo ?? new URL('/', request.url)

  const cookieExpiresInSeconds = 60 * 60 * 24 * 7 // 7 days

  return NextResponse.redirect(redirectURL, {
    headers: {
      'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpiresInSeconds};`,
    },
  })
}
