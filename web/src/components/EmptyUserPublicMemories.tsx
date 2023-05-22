import { Avatar } from './Avatar'

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
      <Avatar src={avatarUrl} alt="" />

      <p className="text-center leading-relaxed sm:w-[360px]">
        {name} ainda não registrou nenhuma lembrança pública.
      </p>
    </div>
  )
}
