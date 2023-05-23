import { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'
import { Link, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import colors from 'tailwindcss/colors'
import dayjs from 'dayjs'

import { api } from '../src/lib/api'
import NLWSpacetimeLogo from '../src/assets/nlw-spacetime-logo.svg'

interface Memory {
  id: string
  excerpt: string
  cover_url: string
  created_at: string
}

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const { top, bottom } = useSafeAreaInsets()

  const router = useRouter()

  async function handleLogout() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  async function fetchMemories() {
    const token = await SecureStore.getItemAsync('token')

    try {
      const memoriesResponse = await api.get<{ memories: Memory[] }>(
        '/memories',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setMemories(memoriesResponse.data.memories)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchMemories()
  }, [])

  return (
    <View className="flex-1" style={{ paddingTop: top }}>
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NLWSpacetimeLogo />

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            accessibilityLabel="Fazer logout"
            activeOpacity={0.7}
            className="h-10 w-10 items-center justify-center"
            onPress={handleLogout}
          >
            <Icon name="log-out" size={16} color={colors.red[500]} />
          </TouchableOpacity>

          <Link href="/new" asChild>
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
        <View className="flex-1 items-center justify-center p-8">
          <Text className="text-center font-body leading-relaxed text-gray-100">
            Você ainda não registrou nenhuma lembrança, comece a{' '}
            <Link href="/new" className="underline">
              criar agora
            </Link>
            !
          </Text>
        </View>
      ) : (
        <ScrollView
          className="mt-6 space-y-10"
          contentContainerStyle={{ paddingBottom: bottom + 60 }}
        >
          {memories.map((memory) => {
            return (
              <View key={memory.id} className="space-y-4">
                <View className="flex-row items-center gap-2">
                  <View className="h-px w-5 bg-gray-50" />
                  <Text className="font-body text-xs text-gray-100">
                    {dayjs(memory.created_at).format('DD[ de ]MMMM[, ]YYYY')}
                  </Text>
                </View>
                <View className="space-y-4 px-8">
                  <Image
                    source={{
                      uri: memory.cover_url,
                    }}
                    alt=""
                    className="aspect-video w-full rounded-lg object-cover"
                  />
                  <Text className="font-body text-base leading-relaxed text-gray-100">
                    {memory.excerpt}
                  </Text>
                  <Link href={`/memories/${memory.id}`} asChild>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      className="flex-row items-center gap-2"
                    >
                      <Text className="font-body text-sm text-gray-200">
                        Ler mais
                      </Text>
                      <Icon
                        name="arrow-right"
                        size={16}
                        color={colors.gray[200]}
                      />
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            )
          })}
        </ScrollView>
      )}
    </View>
  )
}
