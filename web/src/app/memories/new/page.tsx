import Link from 'next/link'
import { Camera, ChevronLeft } from 'lucide-react'

export default function NewMemory() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Link
        href="/"
        className="flex max-w-max items-center gap-1 text-sm text-gray-200 outline-none transition-colors hover:text-gray-100 focus:text-gray-100 focus:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        voltar à timeline
      </Link>

      <form className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 transition-colors focus-within:text-gray-100 focus-within:underline hover:text-gray-100">
            <Camera className="h-4 w-4" />
            Anexar mídia
            <input type="file" name="media" className="h-0 w-0" />
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

        <textarea
          name="content"
          spellCheck={false}
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
          className="flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        />
      </form>
    </div>
  )
}
