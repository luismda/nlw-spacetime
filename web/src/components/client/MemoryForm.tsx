'use client'

import { FormEvent } from 'react'
import { Camera } from 'lucide-react'
import { clsx } from 'clsx'

import { MediaPicker } from './MediaPicker'
import { Button } from '../Button'

interface Memory {
  id: string
  content: string
  cover_url: string
  cover_type: 'image' | 'video'
  is_public: boolean
  created_at: string
}

interface MemoryFormProps {
  memory?: Memory | null
  isLoading?: boolean
  formMessage?: {
    message: string
    type: 'success' | 'error'
  } | null
  onClearError?: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function MemoryForm({
  memory = null,
  isLoading = false,
  formMessage = null,
  onClearError = () => {},
  onSubmit,
}: MemoryFormProps) {
  async function handleSubmitMemoryForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onSubmit(event)
  }

  return (
    <form
      className="flex flex-1 flex-col gap-2"
      onSubmit={handleSubmitMemoryForm}
    >
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
            defaultChecked={!!memory?.is_public}
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500 transition-all focus:ring-0"
          />
          Tornar memória pública
        </label>
      </div>

      <MediaPicker
        previewExisting={
          memory ? { url: memory.cover_url, type: memory.cover_type } : null
        }
        onChangeMedia={onClearError}
      />

      <textarea
        name="content"
        spellCheck={false}
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        className="flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        defaultValue={memory?.content ?? ''}
        onChange={onClearError}
      />

      <p
        className={clsx('text-sm leading-relaxed transition-all', {
          'opacity-0': !formMessage?.type,
          'text-red-500': formMessage?.type === 'error',
          'text-green-500': formMessage?.type === 'success',
        })}
      >
        {formMessage?.message}
      </p>

      <Button
        type="submit"
        className="min-w-[92px] self-end"
        isLoading={isLoading}
      >
        Salvar
      </Button>
    </form>
  )
}
