import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface MemoryRootProps {
  children: ReactNode
}

function MemoryRoot({ children }: MemoryRootProps) {
  return <article className="space-y-4">{children}</article>
}

interface MemoryDateProps {
  children: ReactNode
}

function MemoryDate({ children }: MemoryDateProps) {
  return (
    <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
      {children}
    </time>
  )
}

interface MemoryCoverProps {
  coverUrl: string
  coverType: 'image' | 'video'
}

function MemoryCover({ coverType, coverUrl }: MemoryCoverProps) {
  return coverType === 'image' ? (
    <Image
      src={coverUrl}
      alt=""
      width={592}
      height={280}
      className="aspect-video w-full rounded-lg object-cover"
    />
  ) : (
    <video
      src={coverUrl}
      controls
      className="aspect-video w-full rounded-lg object-cover"
    />
  )
}

interface MemoryExcerptProps {
  children: ReactNode
}

function MemoryExcerpt({ children }: MemoryExcerptProps) {
  return <p className="text-lg leading-relaxed text-gray-100">{children}</p>
}

interface MemoryLinkProps {
  href: string
  children: ReactNode
}

function MemoryLink({ href, children }: MemoryLinkProps) {
  return (
    <Link
      href={href}
      className="flex max-w-max items-center gap-2 text-sm text-gray-200 outline-none transition-colors hover:text-gray-100 focus:text-gray-100 focus:underline"
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

export const Memory = {
  Root: MemoryRoot,
  Date: MemoryDate,
  Cover: MemoryCover,
  Excerpt: MemoryExcerpt,
  Link: MemoryLink,
}
