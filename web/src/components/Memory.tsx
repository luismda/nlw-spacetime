import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'
import { ArrowRight } from 'lucide-react'

interface MemoryProps {
  id: string
  excerpt: string
  cover_url: string
  created_at: string
}

export function Memory({ id, excerpt, cover_url, created_at }: MemoryProps) {
  const dateFormatted = dayjs(created_at).format('DD[ de ]MMMM[, ]YYYY')

  return (
    <article key={id} className="space-y-4">
      <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
        {dateFormatted}
      </time>

      <Image
        src={cover_url}
        alt=""
        width={592}
        height={280}
        className="aspect-video w-full rounded-lg object-cover"
      />

      <p className="text-lg leading-relaxed text-gray-100">{excerpt}</p>

      <Link
        href={`/memories/${id}`}
        className="flex max-w-max items-center gap-2 text-sm text-gray-200 outline-none transition-colors hover:text-gray-100 focus:text-gray-100 focus:underline"
      >
        Ler mais
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  )
}
