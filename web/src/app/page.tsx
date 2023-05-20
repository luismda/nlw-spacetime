import { cookies } from 'next/headers'
import dayjs from 'dayjs'

import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Memory {
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

  const memoriesResponse = await api.get<{ memories: Memory[] }>('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const { memories } = memoriesResponse.data

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => {
        return (
          <div key={memory.id} className="space-y-4">
            <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
              {dayjs(memory.created_at).format('DD[ de ]MMMM[, ]YYYY')}
            </time>

            <Image
              src={memory.cover_url}
              alt=""
              width={592}
              height={280}
              className="aspect-video w-full rounded-lg object-cover"
            />

            <p className="text-lg leading-relaxed text-gray-100">
              {memory.excerpt}
            </p>

            <Link
              href={`/memories/${memory.id}`}
              className="flex items-center gap-2 text-sm text-gray-200 outline-none transition-colors hover:text-gray-100 focus:text-gray-100 focus:underline"
            >
              Ler mais
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
