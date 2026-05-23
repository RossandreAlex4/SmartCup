import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';

import CustomButton from "../components/customButton";

import { styles } from "../styles/LandingScreenStyle";

import { router } from 'expo-router';

import { useContext } from "react";

import { ThemeContext } from "../../context/ThemeContext";

import { darkTheme, lightTheme } from "../../themes/colors";

export default function TelaInicial() {

  const {
    theme,
    toggleTheme,
  } = useContext(ThemeContext);

  const colors =
    theme === "dark"
      ? darkTheme
      : lightTheme;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
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

        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.image}
        />

        <Text style={styles.title}>

          <Text
            style={{
              color: colors.text,
            }}
          >
            Smart
          </Text>

          <Text
            style={{
              color: colors.primary,
            }}
          >
            Cup
          </Text>

        </Text>

        <View
          style={[
            styles.line,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        />

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.text,
            },
          ]}
        >
          Monitoramento inteligente para{" "}

          <Text
            style={{
              color: colors.primary,
            }}
          >
            festas e eventos
          </Text>

        </Text>

        <CustomButton
          title="Entrar"
          width="70%"
          backgroundColor={
            colors.primary
          }
          onPress={() =>
            router.push('/login')
          }
          style={{
            position: "absolute",
            bottom: 90,
            alignSelf: "center",
          }}
        />


        

      </View>

    </ScrollView>
  );
}