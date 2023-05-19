import { useState } from 'react'
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'
import colors from 'tailwindcss/colors'

import NLWSpacetimeLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link } from 'expo-router'

export default function NewMemory() {
  const { top, bottom } = useSafeAreaInsets()

  const [isPublic, setIsPublic] = useState(false)

  return (
    <View className="flex-1 px-8" style={{ paddingTop: top }}>
      <View className="mt-4 flex-row items-center justify-between">
        <NLWSpacetimeLogo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
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
        >
          <View className="flex-row items-center gap-2">
            <Icon name="image" color={colors.gray[200]} />
            <Text className="font-body text-sm text-gray-200">
              Adicionar foto ou vídeo de capa
            </Text>
          </View>
        </TouchableOpacity>

        <TextInput
          multiline
          className="p-0 font-body text-lg text-gray-50"
          textAlignVertical="top"
          cursorColor={colors.gray[100]}
          placeholderTextColor={colors.gray[500]}
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />

        <TouchableOpacity
          activeOpacity={0.75}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
