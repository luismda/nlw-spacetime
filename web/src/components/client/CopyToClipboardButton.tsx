'use client'

import { ButtonHTMLAttributes, useState } from 'react'
import { Clipboard, ClipboardCheck } from 'lucide-react'
import { clsx } from 'clsx'

interface CopyToClipboardButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  contentToCopy: string
}

export function CopyToClipboardButton({
  contentToCopy,
  className,
  children,
  ...props
}: CopyToClipboardButtonProps) {
  const [isAlreadyCopied, setIsAlreadyCopied] = useState(false)

  async function handleCopyToClipboard() {
    await navigator.clipboard.writeText(contentToCopy)

    setIsAlreadyCopied(true)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsAlreadyCopied(false)
  }

  return (
    <button
      className={clsx(
        'flex max-w-max items-center gap-1 text-sm text-gray-200 outline-none transition-colors hover:text-gray-100 focus:text-gray-100 focus:underline',
        className,
      )}
      onClick={handleCopyToClipboard}
      {...props}
    >
      {isAlreadyCopied ? (
        <>
          <ClipboardCheck className="h-4 w-4" />
          copiado!
        </>
      ) : (
        <>
          <Clipboard className="h-4 w-4" />
          {children}
        </>
      )}
    </button>
  )
}
