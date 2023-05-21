'use client'

import { FormEvent, useState } from 'react'
import Cookie from 'js-cookie'

import { api } from '@/lib/api'

import { MemoryForm } from './MemoryForm'

interface FormMessage {
  message: string
  type: 'success' | 'error'
}

interface EditMemoryProps {
  memory: {
    id: string
    user_id: string
    content: string
    cover_url: string
    is_public: boolean
    created_at: string
  }
}

export function EditMemory({ memory }: EditMemoryProps) {
  const [isEditingMemory, setIsEditingMemory] = useState(false)
  const [formMessage, setFormMessage] = useState<FormMessage | null>(null)

  function clearFormError() {
    if (formMessage) {
      setFormMessage(null)
    }
  }

  async function handleEditMemory(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)

    const content = formData.get('content')?.toString()
    const media = formData.get('media') as File
    const isPublic = formData.get('isPublic')

    if (!content?.trim()) {
      setFormMessage({
        message: 'Forneça uma descrição para editar uma lembrança.',
        type: 'error',
      })

      return
    }

    setIsEditingMemory(true)

    const token = Cookie.get('token')
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    let coverUrl

    if (media.name) {
      const uploadFormData = new FormData()
      uploadFormData.set('media', media)

      try {
        const uploadResponse = await api.post<{ file_url: string }>(
          '/upload',
          uploadFormData,
        )

        coverUrl = uploadResponse.data.file_url
      } catch (error) {
        setIsEditingMemory(false)

        setFormMessage({
          message: 'Não foi possível fazer o upload da mídia, tente novamente.',
          type: 'error',
        })

        console.error(error)

        return
      }
    }

    try {
      await api.put(`/memories/${memory.id}`, {
        content,
        is_public: !!isPublic,
        cover_url: coverUrl,
      })
    } catch (error) {
      setIsEditingMemory(false)

      setFormMessage({
        message: 'Não foi possível editar a lembrança, tente novamente.',
        type: 'error',
      })

      console.error(error)

      return
    }

    setIsEditingMemory(false)

    setFormMessage({
      message: 'Sua lembrança foi salva com sucesso!',
      type: 'success',
    })

    await new Promise((resolve) => setTimeout(resolve, 5000))

    setFormMessage(null)
  }

  return (
    <MemoryForm
      memory={memory}
      isLoading={isEditingMemory}
      formMessage={formMessage}
      onClearError={clearFormError}
      onSubmit={handleEditMemory}
    />
  )
}
