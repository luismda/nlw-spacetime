import { cookies } from 'next/headers'
import dayjs from 'dayjs'

import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import { Memory } from '@/components/Memory'

interface MemoryResponse {
  id: string
  excerpt: string
  cover_url: string
  cover_type: 'image' | 'video'
  created_at: string
}

export default async function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const token = cookies().get('token')?.value

  const memoriesResponse = await api.get<{ memories: MemoryResponse[] }>(
    '/memories',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const { memories } = memoriesResponse.data

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map(({ id, excerpt, cover_url, cover_type, created_at }) => {
        const memoryDateFormatted = dayjs(created_at).format(
          'DD[ de ]MMMM[, ]YYYY',
        )

        return (
          <Memory.Root key={id}>
            <Memory.Date>{memoryDateFormatted}</Memory.Date>

            <Memory.Cover coverType={cover_type} coverUrl={cover_url} />

            <Memory.Excerpt>{excerpt}</Memory.Excerpt>

            <Memory.Link href={`/memories/${id}`}>Ler mais</Memory.Link>
          </Memory.Root>
        )
      })}
    </div>
  )
}
