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
import { Video, ResizeMode } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import Icon from '@expo/vector-icons/Feather'
import colors from 'tailwindcss/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Preview {
  url: string
  type: 'image' | 'video'
  extension: string
}

export interface MemoryFormData {
  content: string
  isPublic: boolean
  preview: Preview
}

interface MemoryFormProps {
  existingMemory?: MemoryFormData | null
  onSubmit: (data: MemoryFormData) => Promise<void>
}

export function MemoryForm({ existingMemory, onSubmit }: MemoryFormProps) {
  const { bottom } = useSafeAreaInsets()

  const [content, setContent] = useState(existingMemory?.content ?? '')
  const [isPublic, setIsPublic] = useState(existingMemory?.isPublic ?? false)
  const [preview, setPreview] = useState<Preview | null>(
    existingMemory?.preview ?? null,
  )

  async function handleOpenMediaPicker() {
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

  async function handleSubmit() {
    const memoryFormData = {
      content,
      isPublic,
      preview,
    }

    await onSubmit(memoryFormData)
  }

  return (
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

      {preview ? (
        <View className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500">
          {preview.type === 'image' ? (
            <Image
              source={{ uri: preview.url }}
              alt=""
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <Video
              source={{ uri: preview.url }}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
              className="h-full w-full rounded-lg object-cover"
            />
          )}
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
          onPress={handleOpenMediaPicker}
        >
          <View className="flex-row items-center gap-2">
            <Icon name="image" color={colors.gray[200]} />
            <Text className="font-body text-sm text-gray-200">
              Adicionar foto ou vídeo de capa
            </Text>
          </View>
        </TouchableOpacity>
      )}

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
        onPress={handleSubmit}
      >
        <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
