import Link from 'next/link'

export function EmptyMemories() {
  return (
    <div className="flex flex-1 items-center justify-center p-16">
      <p className="text-center leading-relaxed sm:w-[360px]">
        Você ainda não registrou nenhuma lembrança, comece a{' '}
        <Link
          href="/memories/new"
          className="underline transition-colors hover:text-gray-50"
        >
          criar agora
        </Link>
        !
      </p>
    </div>
  )
}
