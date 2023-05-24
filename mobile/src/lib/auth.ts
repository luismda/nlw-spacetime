import decode from 'jwt-decode'

interface User {
  sub: string
  name: string
  avatarUrl: string
}

export function getUserByToken(token: string) {
  const user = decode<User>(token)

  return user
}
