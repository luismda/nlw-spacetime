import dayjs from 'dayjs'

import { api } from '@/lib/api'

import { Memory } from '@/components/Memory'
import { EmptyUserPublicMemories } from '@/components/EmptyUserPublicMemories'
import { Avatar } from '@/components/Avatar'

interface MemoryResponse {
  id: string
  excerpt: string
  cover_url: string
  cover_type: 'image' | 'video'
  created_at: string
}

interface User {
  name: string
  login: string
  avatar_url: string
}

interface UserPublicMemoriesProps {
  params: {
    username: string
  }
}

export default async function UserPublicMemories({
  params: { username },
}: UserPublicMemoriesProps) {
  const memoriesResponse = await api.get<{
    user: User
    memories: MemoryResponse[]
  }>(`/users/${username}/memories`)

  const { user, memories } = memoriesResponse.data

  if (memories.length === 0) {
    return (
      <EmptyUserPublicMemories
        user={{
          name: user.name,
          avatarUrl: user.avatar_url,
        }}
      />
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 text-left">
        <Avatar src={user.avatar_url} alt="" />

        <p className="max-w-[140px] text-sm leading-snug">
          {user.name}
          <span className="block text-gray-200">Lembranças públicas</span>
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-10">
        {memories.map(({ id, excerpt, cover_url, cover_type, created_at }) => {
          const memoryDateFormatted = dayjs(created_at).format(
            'DD[ de ]MMMM[, ]YYYY',
          )

          return (
            <Memory.Root key={id}>
              <Memory.Date>{memoryDateFormatted}</Memory.Date>

              <Memory.Cover coverType={cover_type} coverUrl={cover_url} />

              <Memory.Excerpt>{excerpt}</Memory.Excerpt>

              <Memory.Link href={`/${user.login}/memories/${id}`}>
                Ler mais
              </Memory.Link>
            </Memory.Root>
          )
        })}
      </div>
    </div>
  )
}
