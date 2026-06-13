import { Stack, router } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { EventProvider } from "../src/context/EventContext";
import { AuthProvider, AuthContext } from "../src/context/AuthContext";
import { ThemeProvider, ThemeContext } from "../src/context/ThemeContext";
import { useContext, useEffect, useRef, useState } from "react";
import { darkTheme, lightTheme } from "../src/themes/colors";
import * as Linking from "expo-linking";
import {ActivityIndicator, View} from 'react-native';
import { LeiturasProvider } from "../src/context/LeituraContext";
import { initDatabase } from "../src/services/localDatabase";

function DeepLinkHandler() {

  const {
    loginGarcom,
    user,
  } = useContext(AuthContext);

  const url = Linking.useURL();

  useEffect(() => {

    if (!url) return;

    const parsed = Linking.parse(url);

    if (
      parsed.path === "login" &&
      parsed.queryParams?.token
    ) {

      const token =
        parsed.queryParams.token as string;

      loginGarcom(token)
        .then(() => {

          router.replace(
            "/(tabs)/mesas-screen"
          );

        })
        .catch(() => {

          router.replace("/login");

        });
    }

  }, [url]);

  return null;
}

function RootContent() {
  const { theme } = useContext(ThemeContext);
  const { user, loading } = useContext(AuthContext);
  const [appPronto, setAppPronto] = useState(false);
  const colors = theme === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    initDatabase().catch(() => {});
  }, []);

  useEffect(() => {
    if (theme) {
      setAppPronto(true);
    }
  }, [theme]);

  const userAnterior = useRef(user);
  useEffect(() => {
    if (!loading && userAnterior.current !== null && user === null) {
      router.replace("/login");
    }
    userAnterior.current = user;
  }, [user, loading]);

  if (!appPronto) {
    return (
      <View style={{ flex: 1, backgroundColor: "#121212", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF9000" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <DeepLinkHandler />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="evento-config" />
        <Stack.Screen name="qrcode-scanner" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaView>
  );
}



export default function RootLayout() {

  return (

    <AuthProvider>

      <ThemeProvider>

        <EventProvider>

            <LeiturasProvider>

          <SafeAreaProvider>

            <RootContent />

          </SafeAreaProvider>

          </LeiturasProvider>

        </EventProvider>

      </ThemeProvider>

    </AuthProvider>
    
  );
}