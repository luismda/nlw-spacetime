import { ButtonHTMLAttributes, ReactElement, cloneElement } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  isLoading?: boolean
}

export function Button({
  className,
  children,
  asChild = false,
  isLoading = false,
  ...props
}: ButtonProps) {
  const styles = clsx(
    'rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black transition-colors hover:bg-green-600 outline-none focus:ring-2 focus:ring-green-800 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-green-500',
    className,
  )

  if (asChild) {
    const childrenWithProps = cloneElement(children as ReactElement, {
      className: styles,
      ...props,
    })

    return childrenWithProps
  }

  return (
    <button disabled={isLoading} className={styles} {...props}>
      {isLoading ? (
        <span
          aria-live="polite"
          aria-busy="true"
          className="inline-block h-3 w-3 animate-ping rounded-full bg-green-100"
        />
      ) : (
        children
      )}
    </button>
  )
}
