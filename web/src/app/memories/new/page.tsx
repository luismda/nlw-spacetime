import { BackLink } from '@/components/BackLink'
import { CreateMemory } from '@/components/client/CreateMemory'

export default function NewMemory() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-8 lg:p-16">
      <BackLink href="/">voltar à timeline</BackLink>

      <CreateMemory />
    </div>
  )
}
