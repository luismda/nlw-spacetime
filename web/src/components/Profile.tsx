import { getUser } from '@/lib/auth'
import { Avatar } from './Avatar'

export function Profile() {
  const { name, avatarUrl } = getUser()

  return (
    <div className="flex items-center gap-3 text-left">
      <Avatar src={avatarUrl} alt="" />

      <p className="max-w-[140px] text-sm leading-snug">
        {name}
        <a
          href="/api/auth/logout"
          className="block text-red-400 outline-none transition-colors hover:text-red-500 focus:text-red-500 focus:underline"
        >
          Quero sair
        </a>
      </p>
    </div>
  )
}
