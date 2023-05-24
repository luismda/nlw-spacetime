import { useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'
import { Link, useFocusEffect } from 'expo-router'
import colors from 'tailwindcss/colors'
import dayjs from 'dayjs'
import { useToast } from 'react-native-toast-notifications'

import { useAuth } from '../../src/hooks/useAuth'

import { api } from '../../src/lib/api'

import NLWSpacetimeLogo from '../../src/assets/nlw-spacetime-logo.svg'

import { MemoryExcerpt } from '../../src/components/MemoryExcerpt'
import { EmptyMemories } from '../../src/components/EmptyMemories'

interface Memory {
  id: string
  excerpt: string
  cover_url: string
  cover_type: 'image' | 'video'
  created_at: string
}

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoadingMemories, setIsLoadingMemories] = useState(true)

  const { top, bottom } = useSafeAreaInsets()
  const toast = useToast()

  const { signOut } = useAuth()

  async function fetchMemories() {
    try {
      const memoriesResponse = await api.get<{ memories: Memory[] }>(
        '/memories',
      )

      setMemories(memoriesResponse.data.memories)
    } catch (error) {
      console.error(error)

      toast.show('Não foi possível carregar suas lembranças.', {
        type: 'danger',
      })
    } finally {
      setIsLoadingMemories(false)
    }
  }

  useFocusEffect(() => {
    fetchMemories()
  })

  return (
    <View className="flex-1" style={{ paddingTop: top }}>
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NLWSpacetimeLogo />

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            accessibilityLabel="Fazer logout"
            activeOpacity={0.7}
            className="h-10 w-10 items-center justify-center"
            onPress={signOut}
          >
            <Icon name="log-out" size={16} color={colors.red[500]} />
          </TouchableOpacity>

          <Link href="/memories/new" asChild>
            <TouchableOpacity
              accessibilityLabel="Adicionar nova lembrança"
              activeOpacity={0.7}
              className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
            >
              <Icon name="plus" size={16} color={colors.black} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {memories.length === 0 ? (
        isLoadingMemories ? (
          <View className="flex-1 items-center justify-center p-8">
            <ActivityIndicator color={colors.gray[200]} />
          </View>
        ) : (
          <EmptyMemories />
        )
      ) : (
        <ScrollView
          className="mt-6 space-y-10"
          contentContainerStyle={{ paddingBottom: bottom + 60 }}
        >
          {memories.map((memory) => {
            const memoryDateFormatted = dayjs(memory.created_at).format(
              'DD[ de ]MMMM[, ]YYYY',
            )

            return (
              <MemoryExcerpt.Root key={memory.id}>
                <MemoryExcerpt.Date>{memoryDateFormatted}</MemoryExcerpt.Date>

                <MemoryExcerpt.Content>
                  <MemoryExcerpt.Cover
                    coverType={memory.cover_type}
                    coverUrl={memory.cover_url}
                  />

                  <MemoryExcerpt.Excerpt>
                    {memory.excerpt}
                  </MemoryExcerpt.Excerpt>

                  <MemoryExcerpt.Link href={`/memories/${memory.id}`}>
                    Ler mais
                  </MemoryExcerpt.Link>
                </MemoryExcerpt.Content>
              </MemoryExcerpt.Root>
            )
          })}
        </ScrollView>
      )}
    </View>
  )
}
