import { ComponentProps } from 'react'
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native'
import colors from 'tailwindcss/colors'
import { clsx } from 'clsx'

interface ButtonProps extends ComponentProps<typeof TouchableOpacity> {
  isLoading?: boolean
}

export function Button({
  isLoading = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={clsx(
        'items-center rounded-full bg-green-500 px-5 py-2',
        {
          'opacity-70': disabled || isLoading,
        },
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.black} />
      ) : (
        <Text className="font-alt text-sm uppercase text-black">
          {children}
        </Text>
      )}
    </TouchableOpacity>
  )
}
