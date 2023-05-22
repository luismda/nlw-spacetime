import { redirect } from 'next/navigation'
import Image from 'next/image'
import dayjs from 'dayjs'

import { api } from '@/lib/api'

import { BackLink } from '@/components/BackLink'
import { Avatar } from '@/components/Avatar'

interface Memory {
  id: string
  content: string
  cover_url: string
  cover_type: 'image' | 'video'
  created_at: string
  user: {
    name: string
    login: string
    avatar_url: string
  }
}

interface UserPublicMemoryProps {
  params: {
    id: string
    username: string
  }
}

export default async function UserPublicMemory({
  params: { id, username },
}: UserPublicMemoryProps) {
  const memoryResponse = await api.get<{ memory: Memory | null }>(
    `/users/${username}/memories/${id}`,
  )

  const { memory } = memoryResponse.data

  if (!memory) {
    return redirect('/')
  }

  const memoryDateFormatted = dayjs(memory.created_at).format(
    'DD[ de ]MMMM[, ]YYYY',
  )

  const userPublicMemoriesURL = `${process.env.NEXT_PUBLIC_BASE_URL}/${memory.user.login}/memories`

  return (
    <div className="flex flex-1 flex-col gap-4 p-8 lg:p-16">
      <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50 lg:-ml-16">
        {memoryDateFormatted}
      </time>

      <BackLink href={userPublicMemoriesURL}>voltar à timeline</BackLink>

      <div className="flex items-center gap-3 text-left">
        <Avatar src={memory.user.avatar_url} alt="" />

        <p className="max-w-[140px] text-sm leading-snug">{memory.user.name}</p>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        {memory.cover_type === 'image' ? (
          <Image
            src={memory.cover_url}
            alt=""
            width={592}
            height={280}
            className="aspect-video w-full rounded-lg object-cover"
          />
        ) : (
          <video
            src={memory.cover_url}
            controls
            className="aspect-video w-full rounded-lg object-cover"
          />
        )}

        <p>{memory.content}</p>
      </div>
    </div>
  )
}
