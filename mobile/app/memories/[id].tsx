import { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'
import { Link, useSearchParams } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import colors from 'tailwindcss/colors'

import { api } from '../../src/lib/api'

import NLWSpacetimeLogo from '../../src/assets/nlw-spacetime-logo.svg'

import { MemoryForm, MemoryFormData } from '../../src/components/MemoryForm'

interface Memory {
  id: string
  content: string
  is_public: boolean
  cover_url: string
  cover_type: 'image' | 'video'
  created_at: string
  user: {
    login: string
  }
}

export default function EditMemory() {
  const [memory, setMemory] = useState<Memory | null>(null)

  const { top } = useSafeAreaInsets()

  const { id } = useSearchParams<{ id: string }>()

  async function handleEditMemory({
    content,
    isPublic,
    preview,
  }: MemoryFormData) {
    if (!preview || !content.trim()) {
      return
    }

    const token = await SecureStore.getItemAsync('token')
    api.defaults.headers.common.Authorization = `Bearer ${token}`

    let coverUrl: string

    try {
      const uploadFormData = new FormData()

      const file = {
        uri: preview.url,
        name: `media.${preview.extension}`,
        type: preview.type.concat('/').concat(preview.extension),
      }

      uploadFormData.append('media', file as any)

      const uploadResponse = await api.post<{ file_url: string }>(
        '/upload',
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      coverUrl = uploadResponse.data.file_url
    } catch (error) {
      return console.error(error)
    }

    try {
      await api.put(`/memories/${memory.id}`, {
        content,
        is_public: isPublic,
        cover_url: coverUrl,
        cover_type: preview.type,
      })
    } catch (error) {
      return console.error(error)
    }
  }

  async function getMemory() {
    const token = await SecureStore.getItemAsync('token')

    try {
      const memoryResponse = await api.get<{ memory: Memory }>(
        `/memories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setMemory(memoryResponse.data.memory)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getMemory()
  }, [id])

  return (
    <View className="flex-1 px-8" style={{ paddingTop: top }}>
      <View className="mt-4 flex-row items-center justify-between">
        <NLWSpacetimeLogo />

        <Link href="/memories" asChild>
          <TouchableOpacity
            activeOpacity={0.7}
            className="h-10 w-10 items-center justify-center rounded-full bg-purple-500"
          >
            <Icon name="arrow-left" size={16} color={colors.white} />
          </TouchableOpacity>
        </Link>
      </View>

      {memory && (
        <MemoryForm
          existingMemory={{
            content: memory.content,
            isPublic: memory.is_public,
            preview: {
              url: memory.cover_url,
              type: memory.cover_type,
              extension: memory.cover_type === 'image' ? 'jpg' : 'mp4',
            },
          }}
          onSubmit={handleEditMemory}
        />
      )}
    </View>
  )
}
