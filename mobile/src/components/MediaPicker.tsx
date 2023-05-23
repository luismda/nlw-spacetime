import { useState } from 'react'
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native'
import { Video, ResizeMode } from 'expo-av'
import Icon from '@expo/vector-icons/Feather'
import * as FilePicker from 'expo-image-picker'
import colors from 'tailwindcss/colors'
import { useToast } from 'react-native-toast-notifications'

export interface Preview {
  url: string
  type: 'image' | 'video'
}

interface MediaPickerProps {
  preview: Preview
  onPreviewChange: (preview: Preview) => void
}

export function MediaPicker({ preview, onPreviewChange }: MediaPickerProps) {
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)

  const toast = useToast()

  async function handleOpenMediaPicker() {
    setIsPreviewLoading(true)

    try {
      const result = await FilePicker.launchImageLibraryAsync({
        mediaTypes: FilePicker.MediaTypeOptions.All,
        quality: 1,
        selectionLimit: 1,
      })

      const file = result.assets[0]

      if (!file || result.canceled) {
        return
      }

      onPreviewChange({
        url: file.uri,
        type: file.type,
      })
    } catch (error) {
      toast.show('Ocorreu um erro ao selecionar uma mídia.', {
        type: 'danger',
      })
    } finally {
      setIsPreviewLoading(false)
    }
  }

  return preview ? (
    <View className="relative h-32 items-center justify-center rounded-lg border border-dashed border-gray-500">
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={isPreviewLoading}
        className="absolute right-1 top-1 z-10 h-8 w-8 items-center justify-center rounded-full bg-black/60"
        onPress={handleOpenMediaPicker}
      >
        <Icon name="edit-2" size={16} color={colors.gray[200]} />
      </TouchableOpacity>

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
      disabled={isPreviewLoading}
      className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
      onPress={handleOpenMediaPicker}
    >
      {isPreviewLoading ? (
        <ActivityIndicator color={colors.gray[200]} />
      ) : (
        <View className="flex-row items-center gap-2">
          <Icon name="image" color={colors.gray[200]} />
          <Text className="font-body text-sm text-gray-200">
            Adicionar foto ou vídeo de capa
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}
