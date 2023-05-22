import Image from 'next/image'

interface EmptyUserPublicMemoriesProps {
  user: {
    name: string
    avatarUrl: string
  }
}

export function EmptyUserPublicMemories({
  user: { name, avatarUrl },
}: EmptyUserPublicMemoriesProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-16">
      <Image
        src={avatarUrl}
        width={40}
        height={40}
        alt=""
        className="h-10 w-10 rounded-full"
      />

      <p className="w-[360px] text-center leading-relaxed">
        {name} ainda não registrou nenhuma lembrança pública.
      </p>
    </div>
  )
}
