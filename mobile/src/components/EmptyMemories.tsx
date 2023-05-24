import { Text, View } from 'react-native'
import { Link } from 'expo-router'

export function EmptyMemories() {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-center font-body leading-relaxed text-gray-100">
        Você ainda não registrou nenhuma lembrança, comece a{' '}
        <Link href="/memories/new" className="underline">
          criar agora
        </Link>
        !
      </Text>
    </View>
  )
}
