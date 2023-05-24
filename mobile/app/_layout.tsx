import '../src/lib/dayjs'

import { ImageBackground } from 'react-native'
import { SplashScreen } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { styled } from 'nativewind'
import { ToastProvider } from 'react-native-toast-notifications'
import colors from 'tailwindcss/colors'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import { AuthContextProvider } from '../src/contexts/AuthContext'
import { Routes } from '../src/routes'

import blurBackgroundImg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'

const StyledStripes = styled(Stripes)

export default function Layout() {
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  if (!hasLoadedFonts) {
    return <SplashScreen />
  }

  return (
    <AuthContextProvider>
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

          <Routes />
        </ImageBackground>
      </ToastProvider>
    </AuthContextProvider>
  )
}
