import { Stack } from 'expo-router'
import { useAuth } from '../hooks/useAuth'

export function Routes() {
  const { user } = useAuth()
  const isUserAuthenticated = !!user

  return (
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
  )
}
