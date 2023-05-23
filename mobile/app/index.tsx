import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import { useRouter } from 'expo-router'

import { api } from '../src/lib/api'

import NLWSpacetimeLogo from '../src/assets/nlw-spacetime-logo.svg'

import { Button } from '../src/components/Button'

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

        <Button
          className="min-w-[224]"
          isLoading={isLoadingSignIn}
          onPress={handleSignIn}
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
