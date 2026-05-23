import { Tabs } from "expo-router";

import { Image } from "react-native";

import { useContext } from "react";

import { AuthContext } from "../../src/context/AuthContext";

import { ThemeContext } from "../../src/context/ThemeContext";

import {
  darkTheme,
  lightTheme,
} from "../../src/themes/colors";

export default function TabsLayout() {

  const { user } =
    useContext(AuthContext);

  const {
    theme,
  } = useContext(ThemeContext);

  const colors =
    theme === "dark"
      ? darkTheme
      : lightTheme;

  const isGarcom =
    user?.tipo === "garcom";

  return (

    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor:
            colors.card,

          borderTopWidth: 1,

          height: 70,

          paddingTop: 7,

          paddingBottom: 10,

          borderTopColor:
            colors.primary,
        },

        tabBarActiveTintColor:
          colors.primary,

        tabBarInactiveTintColor:
          colors.secondaryText,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >

      <Tabs.Screen
        name="adm-dash"
        options={{
          title: "Dashboard",

          href:
            isGarcom
              ? null
              : undefined,

          tabBarIcon: ({
            focused,
          }) => (

            <Image
              source={require("../../assets/images/home.png")}
              style={{
                width: 24,

                height: 24,

                opacity:
                  focused
                    ? 1
                    : 0.5,

                tintColor:
                  focused
                    ? colors.primary
                    : colors.secondaryText,
              }}
            />

          ),
        }}
      />

      <Tabs.Screen
        name="mesas-screen"
        options={{
          title: "Mesas",

          tabBarIcon: ({
            focused,
          }) => (

            <Image
              source={require("../../assets/images/table.png")}
              style={{
                width: 24,

                height: 24,

                opacity:
                  focused
                    ? 1
                    : 0.5,

                tintColor:
                  focused
                    ? colors.primary
                    : colors.secondaryText,
              }}
            />

          ),
        }}
      />

      <Tabs.Screen
        name="alert"
        options={{
          title: "Alertas",

          tabBarIcon: ({
            focused,
          }) => (

            <Image
              source={require("../../assets/images/bell.png")}
              style={{
                width: 24,

                height: 24,

                opacity:
                  focused
                    ? 1
                    : 0.5,

                tintColor:
                  focused
                    ? colors.primary
                    : colors.secondaryText,
              }}
            />

          ),
        }}
      />

    </Tabs>
  );
}