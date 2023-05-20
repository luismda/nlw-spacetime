import { useState } from 'react'
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'
import { Link, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import colors from 'tailwindcss/colors'

import { api } from '../src/lib/api'
import NLWSpacetimeLogo from '../src/assets/nlw-spacetime-logo.svg'

interface Preview {
  url: string
  type: 'image' | 'video'
  extension: string
}

export default function NewMemory() {
  const { top, bottom } = useSafeAreaInsets()
  const router = useRouter()

  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [preview, setPreview] = useState<Preview | null>(null)

  async function handleOpenImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      })

      const file = result.assets[0]

      if (!file || result.canceled) {
        return
      }

      setPreview({
        url: file.uri,
        type: file.type,
        extension: file.type === 'image' ? 'jpg' : 'mp4',
      })
    } catch (error) {
      console.error(error)
    }
  }

  async function handleCreateMemory() {
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

      <ScrollView
        className="mt-6 space-y-6"
        contentContainerStyle={{ paddingBottom: bottom + 60 }}
      >
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: colors.gray[700], true: colors.purple[900] }}
            thumbColor={isPublic ? colors.purple[400] : colors.gray[400]}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
          onPress={handleOpenImagePicker}
        >
          {preview ? (
            preview.type === 'image' ? (
              <Image
                source={{ uri: preview.url }}
                alt=""
                className="h-full w-full rounded-lg object-cover"
              />
            ) : (
              <Text>video</Text>
            )
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color={colors.gray[200]} />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          className="p-0 font-body text-lg text-gray-50"
          textAlignVertical="top"
          cursorColor={colors.gray[100]}
          placeholderTextColor={colors.gray[500]}
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
          value={content}
          onChangeText={setContent}
        />

        <TouchableOpacity
          activeOpacity={0.75}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
          onPress={handleCreateMemory}
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
