import { useState, useContext, useEffect } from "react";

import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";

import { styles } from "../styles/MesasScreenStyle";

import { router } from "expo-router";

import { AuthContext } from "../../context/AuthContext";

import { ThemeContext } from "../../context/ThemeContext";

import {
  darkTheme,
  lightTheme,
} from "../../themes/colors";

import { fetchMesas } from "../../services/smartcupService";

import { Ionicons } from "@expo/vector-icons";

interface Mesa {
  id: number;
  nome: string;
  zona: string;
  status: string;
}

export default function MesasScreen() {

  const {
    user,
    logout,
  } = useContext(AuthContext);

  const {
    theme,
    toggleTheme,
  } = useContext(ThemeContext);

  const colors =
    theme === "dark"
      ? darkTheme
      : lightTheme;

  const isGarcom =
    user?.tipo === "garcom";

  const [mesas, setMesas] =
    useState<Mesa[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [busca, setBusca] =
    useState("");

  async function carregarMesas() {

    try {

      const mesasData =
        await fetchMesas();

      setMesas(mesasData);

    } catch {

      Alert.alert(
        "Erro",
        "Nao foi possivel carregar as mesas."
      );

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    carregarMesas();

  }, []);

  async function handleLogout() {

    Alert.alert(
      "Sair",
      "Deseja encerrar seu turno?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },

        {
          text: "Sair",

          onPress: async () => {

            await logout();

            router.replace("/login");

          },
        },
      ]
    );
  }

  const mesasFiltradas =
    mesas.filter(
      (m) =>
        m.nome
          .toLowerCase()
          .includes(
            busca.toLowerCase()
          ) ||

        m.zona
          ?.toLowerCase()
          .includes(
            busca.toLowerCase()
          )
    );

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

        <View style={styles.titleConfig}>

          {!isGarcom && (

            <TouchableOpacity
              style={styles.backButton}
              onPress={() =>
                router.back()
              }
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

          )}

          <Text
            style={[
              styles.title,
              {
                color:
                  colors.text,
              },
            ]}
          >
            {isGarcom
              ? "Mesas"
              : "Configuração das Mesas"}
          </Text>

          {isGarcom && (

            <TouchableOpacity
              style={{
                position: "absolute",
                right: 0,
              }}
              onPress={handleLogout}
            >

              <Ionicons
                name="log-out-outline"
                size={24}
                color="#ce2a0f"
              />

            </TouchableOpacity>

          )}

        </View>

        <View
          style={[
            styles.line,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        />

        <View style={styles.createContainer}>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor:
                  colors.card,

                borderColor:
                  colors.primary,
              },
            ]}
          >

            <TextInput
              placeholder="Buscar mesa..."
              placeholderTextColor="#999"
              style={[
                styles.input,
                {
                  color:
                    colors.text,
                },
              ]}
              value={busca}
              onChangeText={setBusca}
            />

          </View>

        </View>

        {loading ? (

          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{
              marginTop: 40,
            }}
          />

        ) : (

          <View style={styles.cardsContainer}>

            {mesasFiltradas.map(
              (mesa) => (

                <View
                  key={mesa.id}
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
                    {mesa.nome}
                  </Text>

                  {!isGarcom && (

                    <TouchableOpacity
                      onPress={() => {}}
                    >


                    </TouchableOpacity>

                  )}

                  <View
                    style={
                      styles.cardStatusLine
                    }
                  >

                    <Text
                      style={[
                        styles.cardStatus,
                        {
                          color:
                            mesa.status === "Livre"
                              ? "#0fce52"
                              : "#ff5252",
                        },
                      ]}
                    >
                      {mesa.status}
                    </Text>

                    {mesa.zona ? (

                      <Text
                        style={[
                          styles.cardStatus,
                          {
                            color:
                              colors.secondaryText,
                          },
                        ]}
                      >
                        {mesa.zona}
                      </Text>

                    ) : null}

                  </View>

                </View>

              )
            )}

          </View>

        )}

      </View>

    </ScrollView>
  );
}