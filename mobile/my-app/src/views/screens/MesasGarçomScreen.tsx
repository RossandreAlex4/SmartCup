import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, BackHandler } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { darkTheme, lightTheme } from "../../themes/colors";
import { styles } from "../styles/MesasGarçomScreenStyles";
import { fetchMesas, fetchAlertas } from "../../services/smartcupService";

interface Alerta {
  id: number;
  tipo: string;
  mesa_id: number;
  smartcup_id: number;
  mesa_nome: string;
}

interface Mesa {
  id: number;
  nome: string;
  zona: string;
  status: string;
}

const COR_CRITICA = "#FF5252";
const COR_ATENCAO = "#FF9800";
const COR_NORMAL = "#444";

function corDoAlerta(tipo: string) {
  if (tipo === "REPOSICAO_CRITICA") return COR_CRITICA;
  if (tipo === "REPOSICAO_ATENCAO") return COR_ATENCAO;
  return COR_ATENCAO;
}

function alertasDaMesa(alertas: Alerta[], mesaId: number) {
  const vistos = new Set<number>();
  return alertas
    .filter((a) => a.mesa_id === mesaId)
    .filter((a) => {
      if (vistos.has(a.smartcup_id)) return false;
      vistos.add(a.smartcup_id);
      return true;
    });
}

function SmartcupDots({ alertas, mesaId }: { alertas: Alerta[]; mesaId: number }) {
  const ativos = alertasDaMesa(alertas, mesaId);
  const slots = Array(4)
    .fill(null)
    .map((_, i) => ativos[i] || null);

  return (
    <View style={styles.dotsRow}>
      {slots.map((alerta, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: alerta ? corDoAlerta(alerta.tipo) : COR_NORMAL },
          ]}
        />
      ))}
    </View>
  );
}

export default function GarcomMesas() {
  const { theme } = useContext(ThemeContext);
  const colors = theme === "dark" ? darkTheme : lightTheme;

  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/(tabs)/garcom-dash");
        return true;
      };
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [])
  );

  async function carregarDados() {
    try {
      const [mesasData, alertasData] = await Promise.all([
        fetchMesas(),
        fetchAlertas(),
      ]);
      setMesas(mesasData);
      setAlertas(alertasData);
    } catch (error) {
      console.error("Erro ao carregar mesas:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Mesas Abertas</Text>
          <Text style={{ color: colors.secondaryText }}>Selecione uma mesa para ver detalhes</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.cardsContainer}>
            {mesas.map((mesa) => {
              const alertasMesa = alertasDaMesa(alertas, mesa.id);
              const temAlerta = alertasMesa.length > 0;
              const temCritico = alertasMesa.some((a) => a.tipo === "REPOSICAO_CRITICA");
              const corBorda = temCritico ? COR_CRITICA : temAlerta ? COR_ATENCAO : colors.primary;

              return (
                <TouchableOpacity
                  key={mesa.id}
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({ pathname: "/mesaDetalhes", params: { id: mesa.id } })
                  }
                  style={[styles.card, { backgroundColor: colors.card, borderColor: corBorda }]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{mesa.nome}</Text>
                    {temAlerta && (
                      <View style={[styles.badge, { backgroundColor: temCritico ? COR_CRITICA : COR_ATENCAO }]}>
                        <Text style={styles.badgeText}>{alertasMesa.length}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={[styles.zona, { color: colors.secondaryText }]}>{mesa.zona}</Text>

                  <SmartcupDots alertas={alertas} mesaId={mesa.id} />

                  {temAlerta && (
                    <Text style={[styles.alertaLabel, { color: temCritico ? COR_CRITICA : COR_ATENCAO }]}>
                      {temCritico ? "Reposição crítica" : "Atenção necessária"}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
