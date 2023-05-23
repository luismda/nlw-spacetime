import { useState } from 'react'
import { ScrollView, Switch, Text, TextInput, View } from 'react-native'
import colors from 'tailwindcss/colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useToast } from 'react-native-toast-notifications'

import { Button } from './Button'
import { MediaPicker, Preview } from './MediaPicker'

interface Memory {
  content: string
  isPublic: boolean
  coverUrl: string
  coverType: 'image' | 'video'
}

export interface MemoryFormData {
  content: string
  isPublic: boolean
  mediaUrl: string
  mediaType: 'image' | 'video'
}

interface MemoryFormProps {
  memory?: Memory | null
  onSubmit: (data: MemoryFormData) => Promise<void>
}

export function MemoryForm({ memory = null, onSubmit }: MemoryFormProps) {
  const { bottom } = useSafeAreaInsets()

  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)

  const [content, setContent] = useState(memory?.content ?? '')
  const [isPublic, setIsPublic] = useState(memory?.isPublic ?? false)

  const [preview, setPreview] = useState<Preview | null>(
    memory
      ? {
          url: memory.coverUrl,
          type: memory.coverType,
        }
      : null,
  )

  async function handleSubmit() {
    if (!preview) {
      toast.show('Forneça uma mídia para a lembrança.', {
        type: 'danger',
      })

      return
    }

    if (!content.trim()) {
      toast.show('Forneça o conteúdo da lembrança.', {
        type: 'danger',
      })

      return
    }

    const memoryFormData = {
      content,
      isPublic,
      mediaUrl: preview.url,
      mediaType: preview.type,
    }

    setIsLoading(true)

    await onSubmit(memoryFormData)

    setIsLoading(false)
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

      <MediaPicker preview={preview} onPreviewChange={setPreview} />

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

      <Button
        className="min-w-[94] self-end"
        isLoading={isLoading}
        onPress={handleSubmit}
      >
        Salvar
      </Button>
    </ScrollView>
  )
}
