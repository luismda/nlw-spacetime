import '../src/lib/dayjs'

import { useState, useEffect } from 'react'
import { ImageBackground } from 'react-native'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SecureStore from 'expo-secure-store'
import { styled } from 'nativewind'
import { ToastProvider } from 'react-native-toast-notifications'
import colors from 'tailwindcss/colors'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBackgroundImg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'

const StyledStripes = styled(Stripes)

export default function Layout() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    null | boolean
  >(null)

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      setIsUserAuthenticated(!!token)
    })
  }, [])

  if (!hasLoadedFonts) {
    return <SplashScreen />
  }

  return (
    <ToastProvider
      placement="bottom"
      offsetBottom={40}
      textStyle={{ textAlign: 'center' }}
      successColor={colors.green[500]}
      dangerColor={colors.red[500]}
    >
      <ImageBackground
        source={blurBackgroundImg}
        className="relative flex-1 bg-gray-900"
        imageStyle={{ position: 'absolute', left: '-100%' }}
      >
        <StyledStripes className="absolute left-2" />
        <StatusBar style="light" translucent />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'simple_push',
          }}
        >
          <Stack.Screen name="index" redirect={isUserAuthenticated} />
          <Stack.Screen name="memories/index" />
          <Stack.Screen name="memories/new" />
          <Stack.Screen name="memories/[id]" />
        </Stack>
      </ImageBackground>
    </ToastProvider>
  )
}
