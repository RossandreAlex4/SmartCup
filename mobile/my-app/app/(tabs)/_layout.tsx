import { Tabs } from "expo-router";
import { Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "#121212",
        borderTopWidth: 1,
        height: 70,
        paddingTop: 7,
        paddingBottom: 10,
        borderTopColor: "#0fce52",
      },

      tabBarActiveTintColor: "#0fce52",
      tabBarInactiveTintColor: "#777",

      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
      },
    }}>
      <Tabs.Screen
        name="adm-dash"
        options={{
          title: "Dashboard",

          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/home.png")}
              style={{
                width: 24,
                height: 24,
                opacity: focused ? 1 : 0.5,
                tintColor: focused ? "#0fce52" : "#c9c9c9",
              }}
            />
          )
        }}
      />

      <Tabs.Screen
        name="mesas-screen"
        options={{
          title: "Mesas",

          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/table.png")}
              style={{
                width: 24,
                height: 24,
                opacity: focused ? 1 : 0.5,
                tintColor: focused ? "#0fce52" : "#c9c9c9",
              }}
            />
          )
        }}
      />

      <Tabs.Screen
        name="alert"
        options={{
          title: "Alertas",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../../assets/images/bell.png")}
              style={{
                width: 24,
                height: 24,
                opacity: focused ? 1 : 0.5,
                tintColor: focused ? "#0fce52" : "#c9c9c9",
              }}
            />
          )
        }}
      />

      <Tabs.Screen
        name="evento-config"
        options={{
          title: "Config",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="settings-outline"
              size={24}
              color={focused ? "#0fce52" : "#c9c9c9"}
              style={{ opacity: focused ? 1 : 0.5 }}
            />
          )
        }}
      />
    </Tabs>
  );
}
