import { ReactNode, createContext, useEffect, useState } from 'react'
import * as AuthSession from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import { useRouter } from 'expo-router'
import { GITHUB_CLIENT_ID } from '@env'

import { api } from '../lib/api'
import { getUserByToken } from '../lib/auth'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: `https://github.com/settings/connections/applications/${GITHUB_CLIENT_ID}`,
}

interface User {
  name: string
  avatarUrl: string
}

interface AuthContextData {
  user: User
  isUserLoading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextData)

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isUserLoading, setIsUserLoading] = useState(true)

  const router = useRouter()

  const [, response, signInWithGitHub] = AuthSession.useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ['identity'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  async function signIn() {
    try {
      setIsUserLoading(true)

      await signInWithGitHub()
    } catch (error) {
      console.error(error)

      setIsUserLoading(false)

      throw error
    }
  }

  async function signOut() {
    try {
      setIsUserLoading(true)

      await SecureStore.deleteItemAsync('token')
      api.defaults.headers.common.Authorization = undefined

      setUser(null)

      router.replace('/')
    } catch (error) {
      console.error(error)

      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  async function getTokenByGitHubOAuthCode(code: string) {
    try {
      const sessionResponse = await api.post<{ token: string }>(
        '/session/mobile',
        {
          code,
        },
      )

      const { token } = sessionResponse.data

      await SecureStore.setItemAsync('token', token)
      api.defaults.headers.common.Authorization = `Bearer ${token}`

      const user = getUserByToken(token)

      setUser({
        name: user.name,
        avatarUrl: user.avatarUrl,
      })
    } catch (error) {
      console.error(error)

      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  async function getUserAlreadyLogged() {
    const token = await SecureStore.getItemAsync('token')

    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`

      const { name, avatarUrl } = getUserByToken(token)

      const user = {
        name,
        avatarUrl,
      }

      setUser(user)
    }

    setIsUserLoading(false)
  }

  useEffect(() => {
    getUserAlreadyLogged()
  }, [])

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      getTokenByGitHubOAuthCode(code)
    }
  }, [response])

  return (
    <AuthContext.Provider
      value={{
        user,
        isUserLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
