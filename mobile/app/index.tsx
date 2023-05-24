import { Text, View } from 'react-native'

import { useAuth } from '../src/hooks/useAuth'

import NLWSpacetimeLogo from '../src/assets/nlw-spacetime-logo.svg'

import { Button } from '../src/components/Button'

export default function App() {
  const { signIn, isUserLoading } = useAuth()

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWSpacetimeLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <Button
          className="min-w-[224]"
          isLoading={isUserLoading}
          onPress={signIn}
        >
          Cadastrar lembrança
        </Button>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
