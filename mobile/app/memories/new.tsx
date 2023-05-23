import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'
import { Link, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import colors from 'tailwindcss/colors'

import { api } from '../../src/lib/api'

import NLWSpacetimeLogo from '../../src/assets/nlw-spacetime-logo.svg'

import { MemoryForm, MemoryFormData } from '../../src/components/MemoryForm'

export default function NewMemory() {
  const { top } = useSafeAreaInsets()
  const router = useRouter()

  async function handleCreateMemory({
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
      await api.post('/memories', {
        content,
        is_public: isPublic,
        cover_url: coverUrl,
        cover_type: preview.type,
      })
    } catch (error) {
      return console.error(error)
    }

    router.push('/memories')
  }

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

      <MemoryForm onSubmit={handleCreateMemory} />
    </View>
  )
}
