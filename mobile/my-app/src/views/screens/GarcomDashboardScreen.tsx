import { useState, useEffect, useContext } from "react";
import { useBackHandlerModal } from "../../hooks/useBackHandlerModal";
import ConfirmLogoutModal from "../components/ConfirmLogoutModal";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView, } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { styles } from "../styles/GarcomDashboardScreenStyle";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { fetchAlertas, resolveAlerta, resolverTodosAlertas } from "../../services/smartcupService";
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

  const { user, logout, updateAvatar } =
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

  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  async function escolherFoto() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setUpdatingAvatar(true);
      try {
        await updateAvatar(base64);
      } catch (e) {
        Alert.alert("Erro", "Não foi possível atualizar a foto.");
      } finally {
        setUpdatingAvatar(false);
      }
    }
  }


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

  async function resolverTodos() {
    try {
      await resolverTodosAlertas();
      setAlertas([]);
    } catch {
      Alert.alert("Erro", "Não foi possível resolver todos os alertas.");
    }
  }

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

  function labelAlerta(tipo: string) {
    if (tipo === "REPOSICAO_CRITICA") return "Reposição Crítica";
    if (tipo === "REPOSICAO_ATENCAO") return "Atenção";
    if (tipo === "GARCOM_CHAMADO") return "Garçom Chamado";
    return tipo;
  }

  function corAlerta(tipo: string) {
    if (tipo === "REPOSICAO_CRITICA") return "#FF5252";
    if (tipo === "GARCOM_CHAMADO") return "#2196F3";
    return "#FF9800";
  }

  function tempoDecorrido(data: string): string {
    const diffMin = Math.floor((Date.now() - new Date(data).getTime()) / 60000);
    if (diffMin < 1) return "agora";
    if (diffMin < 60) return `há ${diffMin} min`;
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return m === 0 ? `há ${h}h` : `há ${h}h ${m}min`;
  }

  const renderAlerta = ({
    item,
  }: {
    item: Alerta;
  }) => (

    <View
      style={[
        styles.alertCard,
        {
          backgroundColor: colors.card,
          borderColor: corAlerta(item.tipo),
        },
      ]}
    >

      <View style={styles.alertLeft}>

        <View
          style={[
            styles.alertDot,
            { backgroundColor: corAlerta(item.tipo) },
          ]}
        />

        <View>

          <Text
            style={[
              styles.alertTitle,
              { color: corAlerta(item.tipo), fontWeight: "bold" },
            ]}
          >
            {labelAlerta(item.tipo)}
          </Text>

          <Text
            style={[
              styles.alertSub,
              { color: colors.secondaryText },
            ]}
          >
            {item.mesa_nome || `Mesa ${item.mesa_id}`}
          </Text>
          <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 2 }}>
            {tempoDecorrido(item.data)}
          </Text>

        </View>

      </View>

      <TouchableOpacity onPress={() => resolverAlerta(item.id)}>
        <Ionicons
          name="checkmark-circle"
          size={32}
          color={corAlerta(item.tipo)}
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

        <View style={{ width: "92%", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={escolherFoto} style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }} disabled={updatingAvatar}>
              {updatingAvatar ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={{ width: 56, height: 56 }} />
              ) : (
                <Ionicons name="camera" size={26} color={colors.primary} />
              )}
            </TouchableOpacity>

            <View>
              <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
              <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Olá, {user?.nome}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
              <Image
                source={require("../../../assets/images/themes.png")}
                style={{ width: 28, height: 28, tintColor: colors.primary }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.logoutButton,
                { backgroundColor: colors.card, borderColor: colors.primary },
              ]}
              onPress={() => setModalVisivel(true)}
            >
              <Ionicons name="log-out-outline" size={22} color="#ce2a0f" />
            </TouchableOpacity>
          </View>
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

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 15 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
            Visão geral dos alertas
          </Text>
          {alertas.length > 0 && (
            <TouchableOpacity
              onPress={resolverTodos}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.primary,
              }}
            >
              <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 12 }}>
                Resolver todos
              </Text>
            </TouchableOpacity>
          )}
        </View>

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