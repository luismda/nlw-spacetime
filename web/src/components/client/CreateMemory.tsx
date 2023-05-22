'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookie from 'js-cookie'

import { api } from '@/lib/api'

import { MemoryForm } from './MemoryForm'

interface FormMessage {
  message: string
  type: 'success' | 'error'
}

export function CreateMemory() {
  const [isCreatingMemory, setIsCreatingMemory] = useState(false)
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null)

  const router = useRouter()

  function clearFormError() {
    if (formMessage) {
      setFormMessage(null)
    }
  }

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)

    const content = formData.get('content')?.toString()
    const media = formData.get('media') as File
    const isPublic = formData.get('isPublic')

    if (!media.name) {
      setFormMessage({
        message: 'Forneça uma mídia para criar uma lembrança.',
        type: 'error',
      })

      return
    }

    if (!content?.trim()) {
      setFormMessage({
        message: 'Forneça uma descrição para criar uma lembrança.',
        type: 'error',
      })

      return
    }

    if (!media.type.includes('image') && !media.type.includes('video')) {
      setFormMessage({
        message: 'A capa precisa ser uma imagem ou vídeo.',
        type: 'error',
      })

      return
    }

    const fileMaxSizeInBytes = 1024 * 1024 * 5 // 5mb

    if (media.size > fileMaxSizeInBytes) {
      setFormMessage({
        message: 'A imagem ou vídeo de capa precisa ter no máximo 5MB.',
        type: 'error',
      })

      return
    }

    setIsCreatingMemory(true)

    const token = Cookie.get('token')
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    const uploadFormData = new FormData()
    uploadFormData.set('media', media)

    let coverUrl

    try {
      const uploadResponse = await api.post<{ file_url: string }>(
        '/upload',
        uploadFormData,
      )

      coverUrl = uploadResponse.data.file_url
    } catch (error) {
      setIsCreatingMemory(false)

      setFormMessage({
        message: 'Não foi possível fazer o upload da mídia, tente novamente.',
        type: 'error',
      })

      console.error(error)

      return
    }

    const coverType = media.type.includes('image') ? 'image' : 'video'

    try {
      await api.post('/memories', {
        content,
        is_public: !!isPublic,
        cover_url: coverUrl,
        cover_type: coverType,
      })

      router.push('/', {
        forceOptimisticNavigation: true,
      })
    } catch (error) {
      setIsCreatingMemory(false)

      setFormMessage({
        message: 'Não foi possível criar a lembrança, tente novamente.',
        type: 'error',
      })

      console.error(error)
    }
  }

  return (
    <MemoryForm
      isLoading={isCreatingMemory}
      formMessage={formMessage}
      onClearError={clearFormError}
      onSubmit={handleCreateMemory}
    />
  )
}
