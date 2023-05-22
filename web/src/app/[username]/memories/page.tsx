interface UserPublicMemoriesProps {
  params: {
    username: string
  }
}

export default function UserPublicMemories({
  params,
}: UserPublicMemoriesProps) {
  return <div>Memórias públicas do usuário: {params.username}</div>
}
