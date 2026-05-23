import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";

import { styles } from "../styles/AdminDashboardScreenStyles";

import { router } from "expo-router";

import { useContext } from "react";

import { EventContext } from "../../context/EventContext";

import { ThemeContext } from "../../context/ThemeContext";

import {
  darkTheme,
  lightTheme,
} from "../../themes/colors";

export default function AdmDash() {

  const { eventData } =
    useContext(EventContext);

   const {
    theme,
    toggleTheme,
  } = useContext(ThemeContext);


  const colors =
    theme === "dark"
      ? darkTheme
      : lightTheme;

  const stats = [
    {
      label: "Mesas",
      value: eventData.tables.length,
    },
    {
      label: "SmartCups",
      value: eventData.smartCups,
    },
    {
      label: "Zonas",
      value: eventData.zones,
    },
    {
      label: "Garçons",
      value: eventData.waiters,
    },
  ];

  return (

    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      style={{
        backgroundColor:
          colors.background,
      }}
    >

      <View
        style={[
          styles.container,
          {
            backgroundColor:
              colors.background,
          },
        ]}
      >

        <View style={styles.titleConfig}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >

            <Image
              source={require("../../../assets/images/back.png")}
              style={[
                styles.image,
                {
                  tintColor:
                    colors.primary,
                },
              ]}
            />

          </TouchableOpacity>

          <Text
            style={[
              styles.title,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Dashboard
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Evento: {eventData.eventName}
          </Text>

        </View>

        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <Image
            source={require("../../../assets/images/themes.png")}
            style={[
              styles.themeIcon,
              {
                tintColor: colors.primary,
              },
            ]}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.line,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        />

        <View style={styles.statsContainer}>

          {stats.map((item) => (

            <View
              key={item.label}
              style={[
                styles.statsCard,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.primary,
                },
              ]}
            >

              <Text
                style={[
                  styles.value,
                  {
                    color:
                      colors.primary,
                  },
                ]}
              >
                {item.value}
              </Text>

              <Text
                style={[
                  styles.label,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {item.label}
              </Text>

            </View>

          ))}

        </View>

        <View style={styles.createContainer}>

          <Text
            style={[
              styles.overview,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Visão geral das mesas
          </Text>

        </View>

        <View style={styles.cardsContainer}>

          {eventData.tables.map((table) => (

            <View
              key={table.id}
              style={[
                styles.card,
                {
                  backgroundColor:
                    colors.card,
                  borderColor:
                    colors.primary,
                },
              ]}
            >

              <Text
                style={[
                  styles.cardTitle,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                Mesa {table.id}
              </Text>

              <Text
                style={[
                  styles.cardStatus,
                  {
                    color:
                      table.status === "Livre"
                        ? "#0fce52"
                        : "#ff5252",
                  },
                ]}
              >
                {table.status}
              </Text>

            </View>

          ))}

        </View>

      </View>

    </ScrollView>
  );
}