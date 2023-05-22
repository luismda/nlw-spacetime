import Image from 'next/image'
import { User } from 'lucide-react'

interface AvatarProps {
  src?: string
  alt?: string
}

export function Avatar({ src, alt = '' }: AvatarProps) {
  if (!src) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400">
        <User className="h-5 w-5 text-gray-500" />
      </div>
    )
  }

  return (
    <Image
      src={src}
      width={40}
      height={40}
      className="h-10 w-10 rounded-full"
      alt={alt}
    />
  )
}
