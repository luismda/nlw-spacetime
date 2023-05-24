import { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'
import { Link, useSearchParams } from 'expo-router'
import colors from 'tailwindcss/colors'
import { useToast } from 'react-native-toast-notifications'

import { api } from '../../src/lib/api'

import NLWSpacetimeLogo from '../../src/assets/nlw-spacetime-logo.svg'

import { getExtensionByFilename } from '../../src/utils/get-extension-by-filename'
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

  const toast = useToast()

  async function handleEditMemory({
    content,
    isPublic,
    mediaUrl,
    mediaType,
  }: MemoryFormData) {
    let coverUrl: string

    try {
      const fileExtension = getExtensionByFilename(mediaUrl)

      const file = {
        uri: mediaUrl,
        name: `media.${fileExtension}`,
        type: mediaType.concat('/').concat(fileExtension),
      }

      const uploadFormData = new FormData()
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
      console.error(error)

      toast.show('Ocorreu um erro ao fazer upload da mídia.', {
        type: 'danger',
      })

      return
    }

    try {
      await api.put(`/memories/${memory.id}`, {
        content,
        is_public: isPublic,
        cover_url: coverUrl,
        cover_type: mediaType,
      })
    } catch (error) {
      console.error(error)

      toast.show('Ocorreu um erro ao editar a lembrança.', {
        type: 'danger',
      })

      return
    }

    toast.show('Lembrança salva!', {
      type: 'success',
    })
  }

  async function getMemory() {
    try {
      const memoryResponse = await api.get<{ memory: Memory }>(
        `/memories/${id}`,
      )

      setMemory(memoryResponse.data.memory)
    } catch (error) {
      console.error(error)

      toast.show('Não foi possível carregar os dados da lembrança.', {
        type: 'danger',
      })
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
          memory={{
            content: memory.content,
            isPublic: memory.is_public,
            coverUrl: memory.cover_url,
            coverType: memory.cover_type,
          }}
          onSubmit={handleEditMemory}
        />
      )}
    </View>
  )
}
