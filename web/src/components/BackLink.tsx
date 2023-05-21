import { ComponentProps } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { clsx } from 'clsx'

interface BackLinkProps extends ComponentProps<typeof Link> {}

export function BackLink({ className, children, ...props }: BackLinkProps) {
  return (
    <Link
      className={clsx(
        'flex max-w-max items-center gap-1 text-sm text-gray-200 outline-none transition-colors hover:text-gray-100 focus:text-gray-100 focus:underline',
        className,
      )}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      {children}
    </Link>
  )
}
