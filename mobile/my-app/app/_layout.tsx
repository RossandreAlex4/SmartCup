import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { EventProvider } from "../src/context/EventContext";
import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import { useContext, useEffect } from "react";
import * as Linking from "expo-linking";
import { router } from "expo-router";

function DeepLinkHandler() {
  const { loginGarcom, user } = useContext(AuthContext);
  const url = Linking.useURL();

  useEffect(() => {
    if (!url) return;
    const parsed = Linking.parse(url);
    if (parsed.path === "login" && parsed.queryParams?.token) {
      const token = parsed.queryParams.token as string;
      loginGarcom(token)
        .then(() => {
          router.replace("/(tabs)/mesas-screen");
        })
        .catch(() => {
          router.replace("/login");
        });
    }
  }, [url]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <EventProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
            <DeepLinkHandler />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="evento-config" />
              <Stack.Screen name="garcons" />
              <Stack.Screen name="qrcode-scanner" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </SafeAreaView>
        </SafeAreaProvider>
      </EventProvider>
    </AuthProvider>
  );
}