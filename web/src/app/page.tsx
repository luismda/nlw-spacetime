import { cookies } from 'next/headers'

import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import { Memory } from '@/components/Memory'

interface MemoryResponse {
  id: string
  excerpt: string
  cover_url: string
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
      {memories.map(({ id, excerpt, cover_url, created_at }) => {
        return (
          <Memory
            key={id}
            id={id}
            excerpt={excerpt}
            cover_url={cover_url}
            created_at={created_at}
          />
        )
      })}
    </div>
  )
}
