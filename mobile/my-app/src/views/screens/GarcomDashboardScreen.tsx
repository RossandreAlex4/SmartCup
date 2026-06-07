import { useState, useEffect, useContext } from "react";
import { useBackHandlerModal } from "../../hooks/useBackHandlerModal";
import ConfirmLogoutModal from "../components/ConfirmLogoutModal";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { fetchAlertas, resolveAlerta, } from "../../services/smartcupService";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

import {
  darkTheme,
  lightTheme,
} from "../../themes/colors";
import { scale, verticalScale, scaleFont, isLargeScreen } from "../../themes/responsive";

interface Alerta {
  id: number;
  tipo: string;
  mesa_nome: string;
  mesa_id: number;
  data: string;
}

export default function GarcomDashboardScreen() {

  const { user, logout } =
    useContext(AuthContext);
  const [modalVisivel, setModalVisivel] = useState(false)
  useBackHandlerModal(() => setModalVisivel(true))

  const { theme, toggleTheme } =
    useContext(ThemeContext);

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

  async function resolverAlerta(
    id: number
  ) {

    try {

      await resolveAlerta(id);

      setAlertas(prev =>
        prev.filter(
          alerta =>
            alerta.id !== id
        )
      );

    } catch {

      Alert.alert(
        "Erro",
        "Nao foi possivel resolver o alerta."
      );

    }
  }

  async function handleConfirmarSaidaGarcom() {
    try {
      setModalVisivel(false);

      router.replace("/login");

      setTimeout(async () => {
        await logout();
      }, 100);

    } catch {
      Alert.alert("Erro", "Não foi possível encerrar o turno.");
    }
  }

  const stats = [
    {
      label: "Alertas",
      value: alertas.length,
    },
    {
      label: "Status",
      value: "Online",
    },
    {
      label: "Zona",
      value: user?.zona || "Nenhuma",
    },
    {
      label: "Turno",
      value: "Ativo",
    },
  ];

  const renderAlerta = ({
    item,
  }: {
    item: Alerta;
  }) => (

    <View
      style={[
        styles.alertCard,
        {
          backgroundColor:
            colors.card,
          borderColor:
            colors.primary,
        },
      ]}
    >

      <View
        style={styles.alertLeft}
      >

        <View
          style={[
            styles.alertDot,
            {
              backgroundColor:
                colors.primary,
            },
          ]}
        />

        <View>

          <Text
            style={[
              styles.alertTitle,
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
              styles.alertSub,
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

      </View>

      <TouchableOpacity
        onPress={() =>
          resolverAlerta(item.id)
        }
      >

        <Ionicons
          name="checkmark-circle"
          size={32}
          color={colors.primary}
        />

      </TouchableOpacity>

    </View>
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

        <View
          style={styles.titleConfig}
        >

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
            Olá, {user?.nome}
          </Text>

        </View>

        <View
          style={
            styles.headerActions
          }
        >

          <TouchableOpacity
            onPress={toggleTheme}
            style={
              styles.themeButton
            }
          >

            <Image
              source={require("../../../assets/images/themes.png")}
              style={{
                width: 28,
                height: 28,
                tintColor:
                  colors.primary,
              }}
            />

          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.logoutButton,
              {
                backgroundColor:
                  colors.card,
                borderColor:
                  colors.primary,
              },
            ]}
            onPress={() => setModalVisivel(true)}
          >

            <Ionicons
              name="log-out-outline"
              size={22}
              color="#ce2a0f"
            />

          </TouchableOpacity>

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

        <View
          style={
            styles.statsContainer
          }
        >

          {stats.map(item => (

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

        <Text
          style={[
            styles.overview,
            {
              color:
                colors.text,
            },
          ]}
        >
          Visão geral dos alertas
        </Text>

        {loading ? (

          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{
              marginTop: 30,
            }}
          />

        ) : (

          <FlatList
            scrollEnabled={false}
            data={alertas}
            renderItem={renderAlerta}
            keyExtractor={(item) =>
              item.id.toString()
            }
            contentContainerStyle={{
              paddingBottom: 30,
            }}
            ListEmptyComponent={

              <View
                style={
                  styles.emptyContainer
                }
              >

                <Ionicons
                  name="checkmark-circle-outline"
                  size={60}
                  color={colors.primary}
                />

                <Text
                  style={[
                    styles.emptyText,
                    {
                      color:
                        colors.secondaryText,
                    },
                  ]}
                >
                  Sem alertas pendentes
                </Text>

              </View>

            }
          />

        )}

      </View>
      <ConfirmLogoutModal
        visible={modalVisivel}
        colors={colors}
        onCancel={() => setModalVisivel(false)}
        onConfirm={handleConfirmarSaidaGarcom}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    alignItems: "center",
  },

  titleConfig: {
    marginTop: verticalScale(20),
    width: "100%",
    alignItems: "center",
  },

  title: {
    fontSize: scaleFont(22),
    fontWeight: "700",
  },

  subtitle: {
    marginTop: verticalScale(6),
    fontSize: scaleFont(15),
  },

  headerActions: {
    position: "absolute",
    top: verticalScale(20),
    right: scale(20),
    flexDirection: "row",
    gap: scale(12),
    alignItems: "center",
  },

  themeButton: {
    justifyContent: "center",
    alignItems: "center",
  },

  logoutButton: {
    padding: scale(8),
    borderRadius: scale(10),
    borderWidth: 1,
  },

  line: {
    height: verticalScale(1),
    width: "50%",
    marginVertical: verticalScale(18),
    borderRadius: scale(100),
  },

  statsContainer: {
    width: "92%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: verticalScale(20),
    gap: scale(8),
  },

  statsCard: {
    width: isLargeScreen ? "23%" : "48%",
    minHeight: verticalScale(80),
    borderRadius: scale(16),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(6),
  },

  value: {
    fontSize: scaleFont(18),
    fontWeight: "700",
  },

  label: {
    marginTop: verticalScale(4),
    fontSize: scaleFont(11),
    textAlign: "center",
  },

  overview: {
    width: "90%",
    fontSize: scaleFont(16),
    marginBottom: verticalScale(15),
  },

  alertCard: {
    width: "100%",
    borderWidth: 1,
    borderRadius: scale(14),
    padding: scale(16),
    marginBottom: verticalScale(10),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  alertLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
    flex: 1,
  },

  alertDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
  },

  alertTitle: {
    fontSize: scaleFont(15),
    fontWeight: "600",
  },

  alertSub: {
    fontSize: scaleFont(13),
    marginTop: verticalScale(2),
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: verticalScale(50),
  },

  emptyText: {
    marginTop: verticalScale(10),
    fontSize: scaleFont(16),
  },

});