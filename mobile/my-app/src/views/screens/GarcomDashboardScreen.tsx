import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { api } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

interface Alerta {
  id: number;
  tipo: string;
  mesa_nome: string;
  mesa_id: number;
  data: string;
}

export default function GarcomDashboardScreen() {
  const { user, logout } = useContext(AuthContext);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregarAlertas() {
    try {
      const response = await api.get("/alertas");
      if (response.data.sucesso) {
        setAlertas(response.data.alertas);
      }
    } catch {
      Alert.alert("Erro", "Nao foi possivel carregar os alertas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarAlertas();
    const interval = setInterval(carregarAlertas, 10000);
    return () => clearInterval(interval);
  }, []);

  async function resolverAlerta(id: number) {
    try {
      await api.put(`/alertas/${id}/resolver`);
      setAlertas((prev) => prev.filter((a) => a.id !== id));
    } catch {
      Alert.alert("Erro", "Nao foi possivel resolver o alerta.");
    }
  }

  async function handleLogout() {
    Alert.alert("Sair", "Deseja encerrar seu turno?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  }

  const renderAlerta = ({ item }: { item: Alerta }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.alertDot} />
        <View>
          <Text style={styles.cardTitle}>{item.tipo}</Text>
          <Text style={styles.cardSub}>{item.mesa_nome || `Mesa ${item.mesa_id}`}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.checkButton} onPress={() => resolverAlerta(item.id)}>
        <Ionicons name="checkmark-circle" size={32} color="#0fce52" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Ola, {user?.nome}</Text>
          <Text style={styles.role}>Garcom</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#ce2a0f" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Alertas Pendentes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0fce52" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={alertas}
          renderItem={renderAlerta}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="checkmark-circle-outline" size={60} color="#0fce52" />
              <Text style={styles.emptyText}>Sem alertas pendentes</Text>
            </View>
          }
          onRefresh={carregarAlertas}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  greeting: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  role: {
    color: "#0fce52",
    fontSize: 13,
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "#2a1414",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3a1a1a",
  },
  divider: {
    height: 1,
    backgroundColor: "#0eb348",
    marginVertical: 14,
    width: "50%",
    alignSelf: "center",
    borderRadius: 100,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2e2e2e",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  alertDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffa500",
  },
  cardTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardSub: {
    color: "#888",
    fontSize: 13,
    marginTop: 2,
  },
  checkButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyText: {
    color: "#555",
    fontSize: 16,
    marginTop: 14,
  },
});
