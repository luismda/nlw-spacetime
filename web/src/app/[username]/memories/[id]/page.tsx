interface UserPublicMemoryProps {
  params: {
    id: string
    username: string
  }
}

export default function UserPublicMemory({ params }: UserPublicMemoryProps) {
  return (
    <div>
      Memórias públicas do usuário {params.username} na memória {params.id}
    </div>
  )
}
