import { cookies } from 'next/headers'
import dayjs from 'dayjs'

import { api } from '@/lib/api'

import { BackLink } from '@/components/BackLink'
import { EditMemory } from '@/components/client/EditMemory'
import { CopyToClipboardButton } from '@/components/client/CopyToClipboardButton'

interface Memory {
  id: string
  content: string
  cover_url: string
  cover_type: 'image' | 'video'
  is_public: boolean
  created_at: string
  user: {
    id: string
    login: string
  }
}

interface MemoryDetailsProps {
  params: {
    id: string
  }
}

export default async function MemoryDetails({ params }: MemoryDetailsProps) {
  const token = cookies().get('token')?.value

  const memoryResponse = await api.get<{ memory: Memory }>(
    `/memories/${params.id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const { memory } = memoryResponse.data

  const publicURL = `${process.env.BASE_URL}/${memory.user.login}/memories/${memory.id}`

  const memoryDateFormatted = dayjs(memory.created_at).format(
    'DD[ de ]MMMM[, ]YYYY',
  )

  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <time className="-ml-16 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
        {memoryDateFormatted}
      </time>

      <div className="mt-2 flex items-center justify-between">
        <BackLink href="/">voltar à timeline</BackLink>

        {memory.is_public && (
          <CopyToClipboardButton type="button" contentToCopy={publicURL}>
            copiar url pública
          </CopyToClipboardButton>
        )}
      </div>

      <EditMemory memory={memory} />
    </div>
  )
}
