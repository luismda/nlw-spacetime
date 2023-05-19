'use client'

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import Cookie from 'js-cookie'

import { MediaPicker } from './MediaPicker'
import { api } from '@/lib/api'

export function NewMemoryForm() {
  const router = useRouter()

  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const content = formData.get('content')
    const media = formData.get('media')
    const isPublic = formData.get('isPublic')

    if (!content || !media) {
      return
    }

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
      return console.error(error)
    }

    try {
      await api.post('/memories', {
        content,
        is_public: !!isPublic,
        cover_url: coverUrl,
      })
    } catch (error) {
      return console.error(error)
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

      <MediaPicker />

      <textarea
        name="content"
        spellCheck={false}
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        className="flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
      />

      <button
        type="submit"
        className="self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black transition-colors hover:bg-green-600"
      >
        Salvar
      </button>
    </form>
  )
}
