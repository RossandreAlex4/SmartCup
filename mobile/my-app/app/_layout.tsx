import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { EventProvider } from "../src/context/EventContext";

export default function RootLayout() {
  return (
    <EventProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="evento-config" />
            <Stack.Screen name="adm-dash" />
            <Stack.Screen name="mesa-screen" />
            <Stack.Screen name="alert" />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </EventProvider>
  );
}