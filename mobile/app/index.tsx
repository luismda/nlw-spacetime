import { useEffect, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import { useRouter } from 'expo-router'
import colors from 'tailwindcss/colors'

import { api } from '../src/lib/api'

import NLWSpacetimeLogo from '../src/assets/nlw-spacetime-logo.svg'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/f3758e85b68dca4dcdc3',
}

export default function App() {
  const [isLoadingSignIn, setIsLoadingSignIn] = useState(false)

  const router = useRouter()

  const [, response, signInWithGitHub] = useAuthRequest(
    {
      clientId: 'f3758e85b68dca4dcdc3',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  function handleSignIn() {
    setIsLoadingSignIn(true)
    signInWithGitHub()
  }

  async function handleGitHubOAuthCode(code: string) {
    const sessionResponse = await api.post<{ token: string }>(
      '/session/mobile',
      {
        code,
      },
    )

    const { token } = sessionResponse.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')

    setIsLoadingSignIn(false)
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      handleGitHubOAuthCode(code)
    }
  }, [response])

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

        <TouchableOpacity
          activeOpacity={0.75}
          className="w-56 items-center rounded-full bg-green-500 px-5 py-2"
          disabled={isLoadingSignIn}
          style={isLoadingSignIn ? { opacity: 0.7 } : undefined}
          onPress={handleSignIn}
        >
          {isLoadingSignIn ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <Text className="font-alt text-sm uppercase text-black">
              Cadastrar lembrança
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
