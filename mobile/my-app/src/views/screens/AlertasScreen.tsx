import { useState, useEffect, useContext } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

import { styles } from "../styles/AlertasScreenStyle";

import { Ionicons } from "@expo/vector-icons";

import { router } from "expo-router";

import { ThemeContext } from "../../context/ThemeContext";

import {
  darkTheme,
  lightTheme,
} from "../../themes/colors";

import {
  fetchAlertas,
  resolveAlerta,
} from "../../services/smartcupService";

interface Alerta {
  id: number;
  tipo: string;
  mesa_nome: string;
  mesa_id: number;
  data: string;
}

export default function AlertasScreen() {

  const {
    theme,
    toggleTheme,
  } = useContext(ThemeContext);

  const colors =
    theme === "dark"
      ? darkTheme
      : lightTheme;

  const [alertas, setAlertas] =
    useState<Alerta[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function carregarAlertas() {

    try {

      const alertasData =
        await fetchAlertas();

      setAlertas(alertasData);

    } catch {

      Alert.alert(
        "Erro",
        "Nao foi possivel carregar os alertas."
      );

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {

    carregarAlertas();

    const interval =
      setInterval(
        carregarAlertas,
        10000
      );

    return () =>
      clearInterval(interval);

  }, []);

  async function atenderAlerta(
    id: number
  ) {

    try {

      await resolveAlerta(id);

      setAlertas((prev) =>
        prev.filter(
          (a) => a.id !== id
        )
      );

    } catch {

      Alert.alert(
        "Erro",
        "Nao foi possivel resolver este alerta."
      );

    }
  }

  const renderItem = ({
    item,
  }: {
    item: Alerta;
  }) => (

    <View
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

      <View
        style={[
          styles.indexCircle,
          {
            backgroundColor:
              colors.primary,
          },
        ]}
      >

        <Text
          style={styles.indexText}
        >
          {item.id}
        </Text>

      </View>

      <View
        style={
          styles.cardTextContainer
        }
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
          {item.tipo}
        </Text>

        <Text
          style={[
            styles.cardSubtitle,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {item.mesa_nome ||
            `Mesa ${item.mesa_id}`}
        </Text>

      </View>

      <TouchableOpacity
        style={styles.checkButton}
        onPress={() =>
          atenderAlerta(item.id)
        }
      >

        <Ionicons
          name="checkmark-circle-outline"
          size={32}
          color={colors.primary}
        />

      </TouchableOpacity>

    </View>
  );

  return (

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

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >

          <Image
            source={require("../../../assets/images/back.png")}
            style={[
              styles.backImage,
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
          Alertas
        </Text>

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

      {loading ? (

        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{
            marginTop: 40,
          }}
        />

      ) : (

        <FlatList
          data={alertas}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.id.toString()
          }
          contentContainerStyle={
            styles.listContent
          }
          showsVerticalScrollIndicator={
            false
          }
          onRefresh={
            carregarAlertas
          }
          refreshing={loading}
          ListEmptyComponent={

            <View
              style={{
                alignItems: "center",
                marginTop: 60,
              }}
            >

              <Ionicons
                name="checkmark-circle-outline"
                size={60}
                color={colors.primary}
              />

              <Text
                style={{
                  color:
                    colors.secondaryText,

                  fontSize: 16,

                  marginTop: 14,
                }}
              >
                Sem alertas pendentes
              </Text>

            </View>

          }
        />

      )}

    </View>
  );
}
