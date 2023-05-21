import { cookies } from 'next/headers'

import { api } from '@/lib/api'

import { BackLink } from '@/components/BackLink'
import { EditMemory } from '@/components/client/EditMemory'
import { CopyToClipboardButton } from '@/components/client/CopyToClipboardButton'

interface Memory {
  id: string
  user_id: string
  content: string
  cover_url: string
  is_public: boolean
  created_at: string
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-16">
      <div className="flex items-center justify-between">
        <BackLink href="/">voltar à timeline</BackLink>

        <CopyToClipboardButton />
      </div>

      <EditMemory memory={memory} />
    </div>
  )
}
