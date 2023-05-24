import { ComponentProps, ReactNode } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Video, ResizeMode } from 'expo-av'
import { Link } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import colors from 'tailwindcss/colors'

interface MemoryExcerptRootProps {
  children: ReactNode
}

function MemoryExcerptRoot({ children }: MemoryExcerptRootProps) {
  return <View className="mb-10">{children}</View>
}

interface MemoryExcerptDateProps {
  children: ReactNode
}

function MemoryExcerptDate({ children }: MemoryExcerptDateProps) {
  return (
    <View className="flex-row items-center gap-2">
      <View className="h-px w-5 bg-gray-50" />
      <Text className="font-body text-xs text-gray-100">{children}</Text>
    </View>
  )
}

interface MemoryExcerptContentProps {
  children: ReactNode
}

function MemoryExcerptContent({ children }: MemoryExcerptContentProps) {
  return <View className="mt-4 space-y-4 px-8">{children}</View>
}

interface MemoryExcerptCoverProps {
  coverType: 'image' | 'video'
  coverUrl: string
}

function MemoryExcerptCover({ coverType, coverUrl }: MemoryExcerptCoverProps) {
  return coverType === 'image' ? (
    <Image
      source={{
        uri: coverUrl,
      }}
      alt=""
      className="aspect-video w-full rounded-lg object-cover"
    />
  ) : (
    <Video
      source={{
        uri: coverUrl,
      }}
      useNativeControls
      resizeMode={ResizeMode.COVER}
      isLooping
      className="aspect-video w-full rounded-lg object-cover"
    />
  )
}

interface MemoryExcerptExcerptProps {
  children: ReactNode
}

function MemoryExcerptExcerpt({ children }: MemoryExcerptExcerptProps) {
  return (
    <Text className="mt-4 font-body text-base leading-relaxed text-gray-100">
      {children}
    </Text>
  )
}

interface MemoryExcerptLinkProps extends ComponentProps<typeof Link> {}

function MemoryExcerptLink({ children, ...props }: MemoryExcerptLinkProps) {
  return (
    <Link asChild {...props}>
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center gap-2"
      >
        <Text className="font-body text-sm text-gray-200">{children}</Text>
        <Icon name="arrow-right" size={16} color={colors.gray[200]} />
      </TouchableOpacity>
    </Link>
  )
}

export const MemoryExcerpt = {
  Root: MemoryExcerptRoot,
  Date: MemoryExcerptDate,
  Content: MemoryExcerptContent,
  Cover: MemoryExcerptCover,
  Excerpt: MemoryExcerptExcerpt,
  Link: MemoryExcerptLink,
}
