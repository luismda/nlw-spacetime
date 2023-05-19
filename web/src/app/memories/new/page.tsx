import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { NewMemoryForm } from '@/components/client/NewMemoryForm'

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

      <NewMemoryForm />
    </div>
  )
}
