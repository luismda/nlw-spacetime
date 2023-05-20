'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import Cookie from 'js-cookie'

import { MediaPicker } from './MediaPicker'
import { Button } from '../Button'
import { api } from '@/lib/api'

export function NewMemoryForm() {
  const [isCreatingMemory, setIsCreatingMemory] = useState(false)
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)

  const router = useRouter()

  function clearFormError() {
    if (formErrorMessage) {
      setFormErrorMessage(null)
    }
  }

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const content = formData.get('content')?.toString()
    const media = formData.get('media') as File
    const isPublic = formData.get('isPublic')

    if (!content?.trim() || !media.name) {
      setFormErrorMessage(
        'Forneça uma descrição e uma mídia para criar uma lembrança.',
      )

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

      setFormErrorMessage(
        'Não foi possível fazer o upload da mídia, tente novamente.',
      )

      console.error(error)

      return
    }

    try {
      await api.post('/memories', {
        content,
        is_public: !!isPublic,
        cover_url: coverUrl,
      })
    } catch (error) {
      setIsCreatingMemory(false)

      setFormErrorMessage('Não foi possível criar a memória, tente novamente.')

      console.error(error)

      return
    }

    router.push('/')
  }

  return (
    <form className="flex flex-1 flex-col gap-2" onSubmit={handleCreateMemory}>
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 transition-colors focus-within:text-gray-100 focus-within:underline hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar foto ou vídeo de capa
        </label>

        <label className="flex items-center gap-1.5 text-sm text-gray-200 transition-colors focus-within:text-gray-100 hover:text-gray-100">
          <input
            type="checkbox"
            name="isPublic"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500 transition-all focus:ring-0"
          />
          Tornar memória pública
        </label>
      </div>

      <MediaPicker onChangeMedia={clearFormError} />

      <textarea
        name="content"
        spellCheck={false}
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        className="flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        onChange={clearFormError}
      />

      {!!formErrorMessage && (
        <p className="text-sm leading-relaxed text-red-500">
          {formErrorMessage}
        </p>
      )}

      <Button
        type="submit"
        className="min-w-[92px] self-end"
        isLoading={isCreatingMemory}
      >
        Salvar
      </Button>
    </form>
  )
}
