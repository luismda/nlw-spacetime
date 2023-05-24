import { TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'
import { Link, useRouter } from 'expo-router'
import colors from 'tailwindcss/colors'
import { useToast } from 'react-native-toast-notifications'

import { api } from '../../src/lib/api'

import NLWSpacetimeLogo from '../../src/assets/nlw-spacetime-logo.svg'

import { getExtensionByFilename } from '../../src/utils/get-extension-by-filename'
import { MemoryForm, MemoryFormData } from '../../src/components/MemoryForm'

export default function NewMemory() {
  const { top } = useSafeAreaInsets()
  const router = useRouter()

  const toast = useToast()

  async function handleCreateMemory({
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
      await api.post('/memories', {
        content,
        is_public: isPublic,
        cover_url: coverUrl,
        cover_type: mediaType,
      })
    } catch (error) {
      console.error(error)

      toast.show('Ocorreu um erro ao registrar a lembrança.', {
        type: 'danger',
      })

      return
    }

    toast.show('Lembrança registrada!', {
      type: 'success',
    })

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
